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
      <Header
        title="Generated Videos"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

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
                  <Text style={styles.videoDetails}>
                    {item.language.toUpperCase()} • {item.voice}
                  </Text>
                </View>
                <View style={styles.thumbnail}>
                  <Ionicons name="videocam" size={32} color={COLORS.gray[500]} />
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
                  icon={<Ionicons name="create" size={20} color={COLORS.textLight} />}
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
    backgroundColor: COLORS.backgroundDark 
  },
  scrollView: { 
    flex: 1 
  },
  content: { 
    padding: SIZES.padding, 
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
    color: COLORS.textLight,
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: SIZES.body2,
    color: COLORS.gray[400],
    textAlign: 'center',
  },
  videoCard: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 12, 
    padding: 16, 
    gap: 16 
  },
  cardHeader: { 
    flexDirection: 'row', 
    gap: 16 
  },
  videoInfo: { 
    flex: 2 
  },
  videoTitle: { 
    fontSize: SIZES.body1, 
    fontWeight: 'bold', 
    color: COLORS.textLight 
  },
  videoDate: { 
    fontSize: SIZES.body4, 
    color: COLORS.gray[400], 
    marginTop: 4 
  },
  videoDetails: {
    fontSize: SIZES.body4,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  thumbnail: { 
    flex: 1, 
    aspectRatio: 16/9, 
    backgroundColor: COLORS.gray[700], 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardActions: { 
    flexDirection: 'row', 
    gap: 8 
  },
  actionBtn: { 
    flex: 1 
  },
  deleteButton: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PastVideosListScreen;

