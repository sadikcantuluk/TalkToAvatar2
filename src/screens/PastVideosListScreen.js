import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES } from '../constants';
import { Header, Button } from '../components';

const VIDEO_HISTORY_KEY = '@video_history';

const PastVideosListScreen = ({ navigation }) => {
  const [videoItems, setVideoItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadVideoHistory();
  }, []);

  const loadVideoHistory = async () => {
    try {
      console.log('=== Loading Video History ===');
      const history = await AsyncStorage.getItem(VIDEO_HISTORY_KEY);
      if (history) {
        const videos = JSON.parse(history);
        console.log('Loaded video items:', videos.length);
        setVideoItems(videos);
      } else {
        console.log('No video history found');
        setVideoItems([]);
      }
    } catch (error) {
      console.error('Error loading video history:', error);
      setVideoItems([]);
    }
  };

  const handleRefresh = async () => {
    console.log('=== Refreshing Video History ===');
    setRefreshing(true);
    await loadVideoHistory();
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
              const updatedItems = videoItems.filter(item => item.id !== id);
              await AsyncStorage.setItem(VIDEO_HISTORY_KEY, JSON.stringify(updatedItems));
              setVideoItems(updatedItems);
              console.log('Video deleted. Remaining items:', updatedItems.length);
            } catch (error) {
              console.error('Error deleting video:', error);
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
        {videoItems.length === 0 ? (
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

