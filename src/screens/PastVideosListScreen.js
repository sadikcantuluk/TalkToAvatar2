import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES } from '../constants';
import { Header, Button } from '../components';
import { VideoCardSkeleton, SkeletonList } from '../components/SkeletonComponents';
import { useAuth } from '../context';
import videosAPI from '../services/videosAPI';
import { getUserStorageKey } from '../utils/userStorage';
import { useUserData } from '../hooks/useUserData';

const PastVideosListScreen = ({ navigation }) => {
  const { token, user } = useAuth();
  const { data: videoItems, loading, refresh, setData: setVideoItems } = useUserData('videos');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    console.log('=== Refreshing Video History ===');
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    console.log('=== Deleting Video ===');
    console.log('Video ID:', id);

    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('=== Deleting Video ===');
              const videoItem = videoItems.find(item => item.id === id);

              // Delete from local storage
              const updatedItems = videoItems.filter(item => item.id !== id);
              const key = getUserStorageKey('@video_history', user.id);
              await AsyncStorage.setItem(key, JSON.stringify(updatedItems));
              setVideoItems(updatedItems);
              console.log('✅ Video deleted locally. Remaining items:', updatedItems.length);

              // Delete from backend if authenticated and backend_id exists
              if (token && user && videoItem?.backend_id) {
                Promise.resolve().then(async () => {
                  try {
                    console.log('📤 Deleting video from backend (background)...');
                    await videosAPI.delete(token, videoItem.backend_id);
                    console.log('✅ Video deleted from backend');
                  } catch (backendError) {
                    console.error('⚠️ Backend delete failed, but local delete succeeded:', backendError);
                  }
                });
              }
            } catch (error) {
              console.error('❌ Error deleting video:', error);
              Alert.alert('Error', 'Failed to delete video');
            }
          },
        },
      ]
    );
  };

  const handleWatch = (item) => {
    console.log('=== Watching Video ===');
    console.log('Video:', item.name);
    navigation.navigate('VideoViewing', { video: item });
  };

  const handleUse = (item) => {
    console.log('=== Using Video Parameters ===');
    console.log('Video:', item.name);
    console.log('Parameters:', {
      name: item.name,
      text: item.text,
      voice: item.voice,
      language: item.language,
      avatarName: item.avatarName,
    });

    navigation.navigate('AvatarToVideo', {
      loadVideo: item,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `Created: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Generated Videos</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {loading ? (
          <SkeletonList
            count={3}
            renderSkeleton={() => <VideoCardSkeleton />}
            itemStyle={{ marginBottom: 16 }}
          />
        ) : videoItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="videocam-off-outline" size={64} color={COLORS.gray[600]} />
            <Text style={styles.emptyTitle}>No Videos Yet</Text>
            <Text style={styles.emptyDescription}>
              Your generated videos will appear here
            </Text>
          </View>
        ) : (
          videoItems.map(item => (
            <View key={item.id} style={styles.videoCard}>
              <View style={styles.cardHeader}>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{item.name}</Text>
                  <Text style={styles.videoDate}>{formatDate(item.createdAt)}</Text>
                  <View style={styles.badgeContainer}>
                    <View style={styles.languageBadge}>
                      <Ionicons name="language" size={14} color="#0369A1" />
                      <Text style={styles.languageBadgeText}>
                        {item.language.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.voiceBadge}>
                      <Ionicons name="mic-outline" size={14} color="#6B21A8" />
                      <Text style={styles.voiceBadgeText}>
                        {item.voice}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.thumbnail}>
                  <Ionicons name="videocam" size={24} color="#2D7F83" />
                </View>
              </View>
              <View style={styles.cardActions}>
                <Button
                  title="Watch"
                  variant="primary"
                  style={styles.actionBtn}
                  icon={<Ionicons name="play-circle" size={20} color={COLORS.white} />}
                  onPress={() => handleWatch(item)}
                />
                <Button
                  title="Use"
                  variant="secondary"
                  style={styles.actionBtn}
                  icon={<Ionicons name="create" size={20} color="#374151" />}
                  onPress={() => handleUse(item)}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB' // Light Background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48, // Move down from top (was 16 + status bar implicit?)
    paddingBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 16,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1
  },
  content: {
    padding: 24,
    paddingTop: 8,
    gap: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: SIZES.body2,
    color: '#6B7280',
    textAlign: 'center',
  },
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  videoInfo: {
    flex: 2
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  videoDate: {
    fontSize: 12,
    color: '#4B5563', // Darker gray (Gray 600)
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE', // Light Blue
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  languageBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1', // Dark Blue
  },
  voiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF', // Light Purple
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  voiceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B21A8', // Dark Purple
  },
  thumbnail: {
    width: 80,
    height: 60,
    backgroundColor: '#E0F2F1', // Light Teal bg
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B2DFDB',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    height: 48,
  },
  deleteButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PastVideosListScreen;

