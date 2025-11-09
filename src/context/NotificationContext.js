import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationsAPI from '../services/notificationsAPI';

const NotificationContext = createContext();

const NOTIFICATIONS_KEY = '@notifications';

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children, authToken, authUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Auth context passed from App.js
  const token = authToken;
  const user = authUser;

  // Load notifications from storage
  useEffect(() => {
    loadNotifications();
  }, []);

  // Update unread count whenever notifications change
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const saveNotifications = async (notifs) => {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const addNotification = (notification) => {
    // Check if this notification already exists to prevent duplicates
    const isDuplicate = notifications.some(existing => 
      existing.title === notification.title && 
      existing.message === notification.message &&
      existing.type === notification.type &&
      Math.abs(new Date(existing.createdAt) - new Date()) < 5000 // Within 5 seconds
    );

    if (isDuplicate) {
      console.log('⚠️ [Notification] Duplicate notification detected, skipping...');
      return null;
    }

    const newNotification = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
      ...notification,
    };

    // Save to local AsyncStorage (fast)
    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    saveNotifications(updated);

    console.log('✅ Notification added locally:', newNotification.title);
    
    // Save to backend asynchronously (non-blocking) - only if not from backend
    if (token && user && !notification.fromBackend) {
      Promise.resolve().then(async () => {
        try {
          console.log('📤 Saving notification to backend (background)...');
          // Backend only accepts: title, message, type (not read, metadata)
          // Note: 'type' is reserved in Rails for STI, but backend controller permits it
          // If it causes issues, backend should use 'notification_type' column instead
          const backendData = {
            title: newNotification.title,
            message: newNotification.message,
            type: newNotification.type || 'info',
            // read and metadata are not permitted by backend
            // Backend will set read=false by default
          };
          
          const response = await notificationsAPI.create(token, backendData);
          const backendId = response.notification?.id;
          console.log('✅ Notification saved to backend:', backendId || 'success');
          
          // Update local storage with backend_id for future deletion
          // Use functional update to ensure we have the latest state
          if (backendId) {
            setNotifications(prevNotifications => {
              const updated = prevNotifications.map(n => 
                n.id === newNotification.id ? { ...n, backend_id: backendId } : n
              );
              saveNotifications(updated);
              return updated;
            });
          }
        } catch (backendError) {
          console.error('⚠️ Backend notification save failed, but local save succeeded:', backendError);
        }
      });
    }
    
    return newNotification.id;
  };

  const markAsRead = (notificationId) => {
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const deleteNotification = async (notificationId) => {
    // Find notification before deleting to get backend_id
    const notificationToDelete = notifications.find(n => n.id === notificationId);
    const backendId = notificationToDelete?.backend_id;
    
    // Delete from local storage using functional update
    setNotifications(prevNotifications => {
      const updated = prevNotifications.filter(n => n.id !== notificationId);
      saveNotifications(updated);
      return updated;
    });
    
    // Delete from backend if authenticated
    if (token && user && backendId) {
      Promise.resolve().then(async () => {
        try {
          console.log('📤 Deleting notification from backend (background)...');
          await notificationsAPI.delete(token, backendId);
          console.log('✅ Notification deleted from backend');
        } catch (backendError) {
          console.error('⚠️ Backend delete failed, but local delete succeeded:', backendError);
        }
      });
    }
  };

  const clearAll = () => {
    setNotifications([]);
    saveNotifications([]);
  };

  // Show notification with type (success, error, info)
  const showNotification = (message, type = 'info') => {
    const title = type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info';
    addNotification({
      title,
      message,
      type,
    });
    
    // Also log to console for debugging
    if (type === 'error') {
      console.error('❌ Notification:', message);
    } else if (type === 'success') {
      console.log('✅ Notification:', message);
    } else {
      console.log('ℹ️ Notification:', message);
    }
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    showNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
