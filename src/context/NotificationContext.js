import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationsAPI from '../services/notificationsAPI';
import { getUserStorageKey } from '../utils/userStorage';

const NotificationContext = createContext();

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

  // Load notifications from storage and sync with backend
  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    } else {
      setNotifications([]);
    }
  }, [user?.id]);

  // Sync with backend when token/user changes
  useEffect(() => {
    if (token && user) {
      syncNotificationsWithBackend();
    }
  }, [token, user, syncNotificationsWithBackend]);

  // Update unread count whenever notifications change
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const getNotificationsKey = () => {
    return getUserStorageKey('@notifications', user?.id);
  };

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    try {
      const key = getNotificationsKey();
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  // Sync notifications with backend to ensure all are saved to database
  const syncNotificationsWithBackend = useCallback(async () => {
    if (!token || !user) return;

    try {
      // Get current local notifications first
      const key = getNotificationsKey();
      const stored = await AsyncStorage.getItem(key);
      const localNotifications = stored ? JSON.parse(stored) : [];
      
      // Load notifications from backend
      const backendNotifications = await notificationsAPI.getAll(token);
      
      // Create a map of backend notifications by their ID
      const backendMap = new Map();
      backendNotifications.forEach(backendNotif => {
        backendMap.set(backendNotif.id, backendNotif);
      });

      // Collect notifications that need to be saved to backend
      const notificationsToSave = localNotifications.filter(n => !n.backend_id && !n.fromBackend);

      // Update local notifications: ensure all have backend_id and sync data
      const updated = localNotifications.map(localNotif => {
        // If notification has backend_id, check if it still exists in backend
        if (localNotif.backend_id) {
          const backendNotif = backendMap.get(localNotif.backend_id);
          if (backendNotif) {
            // Update with latest backend data
            return {
              ...localNotif,
              read: backendNotif.read,
              // Keep local id and other local properties
            };
          }
        }
        return localNotif;
      });

      // Add any backend notifications that don't exist locally
      backendNotifications.forEach(backendNotif => {
        const existsLocally = updated.some(n => n.backend_id === backendNotif.id);
        if (!existsLocally) {
          updated.push({
            id: `backend_${backendNotif.id}`,
            backend_id: backendNotif.id,
            title: backendNotif.title,
            message: backendNotif.message,
            type: backendNotif.type,
            read: backendNotif.read,
            createdAt: backendNotif.created_at,
            fromBackend: true,
          });
        }
      });

      // Sort by createdAt (newest first)
      updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Save updated notifications
      setNotifications(updated);
      await saveNotifications(updated);

      // Ensure all local notifications without backend_id are saved to backend
      for (const notif of notificationsToSave) {
        try {
          const backendData = {
            title: notif.title,
            message: notif.message,
            type: notif.type || 'info',
          };
          
          const response = await notificationsAPI.create(token, backendData);
          const backendId = response.notification?.id;
          
          if (backendId) {
            // Update the notification with backend_id
            setNotifications(prevNotifications => {
              const updated = prevNotifications.map(n => 
                n.id === notif.id ? { ...n, backend_id: backendId } : n
              );
              saveNotifications(updated);
              return updated;
            });
          }
        } catch (error) {
          console.error('⚠️ Failed to save notification to backend during sync:', error);
        }
      }
    } catch (error) {
      console.error('⚠️ Error syncing notifications with backend:', error);
    }
  }, [token, user]);

  const saveNotifications = async (notifs) => {
    if (!user?.id) return;
    
    try {
      const key = getNotificationsKey();
      await AsyncStorage.setItem(key, JSON.stringify(notifs));
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
    
    // Delete from backend if authenticated - properly await the deletion
    if (token && user && backendId) {
      try {
        console.log('📤 Deleting notification from backend...');
        await notificationsAPI.delete(token, backendId);
        console.log('✅ Notification deleted from backend');
      } catch (backendError) {
        console.error('⚠️ Backend delete failed, but local delete succeeded:', backendError);
        // Optionally restore the notification locally if backend delete fails
        // For now, we'll keep it deleted locally as the user intended
      }
    }
  };

  const clearAll = async () => {
    // Delete all notifications from backend if authenticated
    if (token && user) {
      const notificationsWithBackendId = notifications.filter(n => n.backend_id);
      
      // Delete all from backend in parallel
      const deletePromises = notificationsWithBackendId.map(notif => 
        notificationsAPI.delete(token, notif.backend_id).catch(error => {
          console.error(`⚠️ Failed to delete notification ${notif.backend_id} from backend:`, error);
        })
      );
      
      try {
        await Promise.all(deletePromises);
        console.log('✅ All notifications deleted from backend');
      } catch (error) {
        console.error('⚠️ Some notifications failed to delete from backend:', error);
      }
    }
    
    // Clear local storage
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
