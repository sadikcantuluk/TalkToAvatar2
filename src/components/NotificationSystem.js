import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Animated,
    TouchableWithoutFeedback,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants';
import { useNotifications } from '../context/NotificationContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const NotificationSystem = ({ navigation: propNavigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const swipeableRefs = useRef({});
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
    const navigation = propNavigation || useNavigation();

    const handleNotificationPress = (notification) => {
        // Mark as read
        markAsRead(notification.id);

        // Close modal
        setModalVisible(false);

        // Navigate based on notification type
        if (notification.type === 'video_ready' && notification.videoData) {
            if (navigation) {
                navigation.navigate('VideoViewing', { video: notification.videoData });
            }
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
        <>
            <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => setModalVisible(true)}
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

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <View style={styles.headerTopRow}>
                                        <Text style={styles.modalTitle}>Notifications</Text>
                                        <TouchableOpacity
                                            onPress={() => setModalVisible(false)}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                            style={styles.closeButton}
                                        >
                                            <Ionicons name="close" size={24} color="#374151" />
                                        </TouchableOpacity>
                                    </View>

                                    {notifications.length > 0 && (
                                        <View style={styles.headerActionRow}>
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
                                                        try {
                                                            setIsClearing(true);
                                                            await clearAll();
                                                        } finally {
                                                            setIsClearing(false);
                                                        }
                                                    }
                                                }}
                                                disabled={isClearing}
                                                style={[
                                                    styles.markAllButton,
                                                    styles.clearAllButton,
                                                    isClearing && styles.clearAllButtonDisabled,
                                                ]}
                                            >
                                                {isClearing ? (
                                                    <ActivityIndicator size="small" color="#EF4444" />
                                                ) : (
                                                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                                )}
                                                <Text style={[styles.markAllText, styles.clearAllText]}>
                                                    {isClearing ? 'Clearing…' : 'Clear all'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                {notifications.length === 0 ? (
                                    <View style={styles.emptyContainer}>
                                        <Ionicons name="notifications-off-outline" size={64} color={COLORS.gray[400]} />
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
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    notificationButton: {
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
        maxHeight: SCREEN_HEIGHT * 0.8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2, // Increased from 0.15/default
        shadowRadius: 24, // Increased from 15
        elevation: 20, // Increased for Android
        borderWidth: 1, // Added border
        borderColor: '#E5E7EB', // Cool gray border
    },
    modalHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        gap: 12,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
    },
    closeButton: {
        padding: 4,
        marginRight: -4, // Align physically with the edge
    },
    markAllButton: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: 'rgba(19, 127, 236, 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    markAllText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
    },
    clearAllButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    clearAllButtonDisabled: {
        opacity: 0.6,
    },
    clearAllText: {
        color: '#EF4444',
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
        color: '#374151',
    },
    emptySubText: {
        fontSize: SIZES.body3,
        color: COLORS.gray[500],
    },
    notificationList: {
        maxHeight: 500,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
    },
    notificationItemUnread: {
        backgroundColor: '#F0F9FF', // Very light blue for unread
    },
    notificationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationIconUnread: {
        backgroundColor: '#DBEAFE', // Light blue
    },
    notificationContent: {
        flex: 1,
        gap: 4,
    },
    notificationTitle: {
        fontSize: SIZES.body2,
        fontWeight: '600',
        color: '#374151',
    },
    notificationTitleUnread: {
        fontWeight: '700',
        color: '#111827',
    },
    notificationMessage: {
        fontSize: SIZES.body3,
        color: '#6B7280',
        lineHeight: 20,
    },
    notificationMessageUnread: {
        color: '#4B5563',
    },
    notificationTime: {
        fontSize: SIZES.body4,
        color: '#9CA3AF',
        marginTop: 2,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginTop: 6,
    },
    swipeDeleteContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: '#EF4444',
        width: 80,
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
    deleteButtonText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
});

export default NotificationSystem;
