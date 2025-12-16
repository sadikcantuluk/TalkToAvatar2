import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { COLORS, SIZES } from '../constants';
import { useNotifications } from '../context/NotificationContext';

const modes = [
  { id: 'sualingo', name: 'Sualingo Mode', icon: 'language' },
  { id: 'video', name: 'Video Mode', icon: 'videocam' },
  { id: 'travel', name: 'Travel Assistant', icon: 'navigate' },
  { id: 'tts', name: 'TTS Mode', icon: 'mic' },
];

const DashboardLayout = ({ children, currentMode = 'tts', onModeChange, navigation, hideHeader = false, showBackButton = false }) => {
  const [modeModalVisible, setModeModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const swipeableRefs = useRef({});
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();

  const currentModeData = modes.find(m => m.id === currentMode) || modes[0];

  const handleModeSelect = (mode) => {
    setModeModalVisible(false);

    // Direct navigation based on mode (only if navigation is available)
    if (navigation) {
      if (mode.id === 'tts') {
        navigation.navigate('TextToSpeech');
      } else if (mode.id === 'video') {
        navigation.navigate('AvatarToVideo');
      } else if (mode.id === 'travel') {
        navigation.navigate('TravelAssistant');
      } else if (mode.id === 'sualingo') {
        navigation.navigate('Courses');
      }
    }

    // Also call onModeChange if provided (for internal state updates)
    if (onModeChange) {
      onModeChange(mode.id);
    }
  };

  const handleNotifications = () => {
    setNotificationModalVisible(true);
  };

  const handleNotificationPress = (notification) => {
    // Mark as read
    markAsRead(notification.id);

    // Close modal
    setNotificationModalVisible(false);

    // Navigate based on notification type
    if (notification.type === 'video_ready' && notification.videoData) {
      navigation.navigate('VideoViewing', { video: notification.videoData });
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      {!hideHeader && (
        <View style={styles.header}>
          {showBackButton ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Dashboard')}
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={handleNotifications}
            >
              <Ionicons name="notifications-outline" size={24} color="#1F2937" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.modeSelector}
            onPress={() => setModeModalVisible(true)}
          >
            <View style={styles.modePill}>
              <Ionicons name={currentModeData.icon} size={18} color={COLORS.primary} />
              <Text style={styles.modeText}>{currentModeData.name}</Text>
            </View>
            <Ionicons name="chevron-down" size={20} color={COLORS.gray[600]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle-outline" size={28} color="#2D7F83" />
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {children}

      {/* Mode Selection Modal */}
      <Modal
        visible={modeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Mode</Text>
              <TouchableOpacity onPress={() => setModeModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={modes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modeItem,
                    currentMode === item.id && styles.modeItemSelected,
                  ]}
                  onPress={() => handleModeSelect(item)}
                >
                  <View style={styles.modeItemIconContainer}>
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={currentMode === item.id ? COLORS.primary : '#6B7280'}
                    />
                  </View>
                  <Text style={[
                    styles.modeItemText,
                    currentMode === item.id && styles.modeItemTextSelected
                  ]}>
                    {item.name}
                  </Text>
                  {currentMode === item.id && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        visible={notificationModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.notificationModal]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <View style={styles.headerActions}>
                {notifications.length > 0 && (
                  <>
                    {unreadCount > 0 && (
                      <TouchableOpacity
                        onPress={markAllAsRead}
                        style={styles.markAllButton}
                      >
                        <Ionicons name="checkmark-done" size={18} color={COLORS.primary} />
                        <Text style={styles.markAllText}>Mark all</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={async () => {
                        if (notifications.length > 0) {
                          await clearAll();
                        }
                      }}
                      style={[styles.markAllButton, styles.clearAllButton]}
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      <Text style={[styles.markAllText, styles.clearAllText]}>Clear all</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity onPress={() => setNotificationModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>
            </View>

            {notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={64} color={COLORS.gray[600]} />
                <Text style={styles.emptyText}>No notifications</Text>
                <Text style={styles.emptySubText}>You're all caught up!</Text>
              </View>
            ) : (
              <ScrollView style={styles.notificationList}>
                {notifications.map((notification) => (
                  <Swipeable
                    key={notification.id}
                    ref={ref => swipeableRefs.current[notification.id] = ref}
                    renderRightActions={(progress, dragX) => (
                      <View style={styles.swipeDeleteContainer}>
                        <Animated.View
                          style={[
                            styles.deleteButton,
                            {
                              transform: [{
                                translateX: dragX.interpolate({
                                  inputRange: [-100, 0],
                                  outputRange: [0, 100],
                                  extrapolate: 'clamp',
                                }),
                              }],
                            },
                          ]}
                        >
                          <Ionicons name="trash-outline" size={24} color={COLORS.white} />
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </Animated.View>
                      </View>
                    )}
                    onSwipeableOpen={() => {
                      deleteNotification(notification.id);
                      // Close swipeable after deletion
                      setTimeout(() => {
                        swipeableRefs.current[notification.id]?.close();
                      }, 100);
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.notificationItem,
                        !notification.read && styles.notificationItemUnread,
                      ]}
                      onPress={() => handleNotificationPress(notification)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.notificationIcon,
                        !notification.read && styles.notificationIconUnread,
                      ]}>
                        <Ionicons
                          name={notification.type === 'video_ready' ? 'videocam' : 'information-circle'}
                          size={24}
                          color={!notification.read ? COLORS.primary : COLORS.gray[500]}
                        />
                      </View>
                      <View style={styles.notificationContent}>
                        <Text style={[
                          styles.notificationTitle,
                          !notification.read && styles.notificationTitleUnread,
                        ]}>
                          {notification.title}
                        </Text>
                        <Text style={[
                          styles.notificationMessage,
                          !notification.read && styles.notificationMessageUnread,
                        ]}>
                          {notification.message}
                        </Text>
                        <Text style={styles.notificationTime}>
                          {formatTimeAgo(notification.createdAt)}
                        </Text>
                      </View>
                      {!notification.read && (
                        <View style={styles.unreadDot} />
                      )}
                    </TouchableOpacity>
                  </Swipeable>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light Background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#F9FAFB', // Match Dashboard Background
    borderBottomWidth: 0,
  },
  notificationButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    // Removed transparent background to fix touch artifact issues
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#F9FAFB',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: '#1F2937',
  },
  profileButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    // overflow: 'hidden', // Removing overflow hidden to allow shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 0,
    // borderBottomColor removed
  },
  modalTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  modeItemSelected: {
    backgroundColor: 'rgba(19, 127, 236, 0.1)',
  },
  modeItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeItemText: {
    flex: 1,
    fontSize: SIZES.body1,
    color: '#1F2937',
  },
  modeItemTextSelected: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  // Notification Modal Styles
  notificationModal: {
    maxHeight: '80%',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(19, 127, 236, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  clearAllButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  clearAllText: {
    color: '#EF4444',
  },
  swipeDeleteContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 10,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  notificationList: {
    maxHeight: 500,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  emptySubText: {
    fontSize: SIZES.body2,
    color: COLORS.gray[500],
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[800],
    backgroundColor: 'transparent',
  },
  notificationItemUnread: {
    backgroundColor: 'rgba(19, 127, 236, 0.05)',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIconUnread: {
    backgroundColor: 'rgba(19, 127, 236, 0.1)',
  },
  notificationContent: {
    flex: 1,
    gap: 4,
  },
  notificationTitle: {
    fontSize: SIZES.body2,
    fontWeight: '500',
    color: COLORS.gray[400],
  },
  notificationTitleUnread: {
    fontWeight: '700',
    color: COLORS.textLight,
  },
  notificationMessage: {
    fontSize: SIZES.body3,
    color: COLORS.gray[500],
    lineHeight: 20,
  },
  notificationMessageUnread: {
    color: COLORS.gray[300],
  },
  notificationTime: {
    fontSize: SIZES.body4,
    color: COLORS.gray[600],
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
});

export default DashboardLayout;

