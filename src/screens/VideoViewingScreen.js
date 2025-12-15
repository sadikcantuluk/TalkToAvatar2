import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { Button, Header } from '../components';

const VideoViewingScreen = ({ navigation, route }) => {
  const video = route?.params?.video;
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [videoStatus, setVideoStatus] = useState({});

  useEffect(() => {
    console.log('=== Video Viewing Screen ===');
    console.log('Video:', video?.name);
    console.log('Video URI:', video?.videoUri);
    console.log('Video URL:', video?.videoUrl);

    if (!video) {
      Alert.alert('Error', 'No video data provided');
      navigation.goBack();
    }

    return () => {
      // Cleanup
      if (videoRef.current) {
        videoRef.current.stopAsync();
      }
    };
  }, []);

  const handlePlayPause = async () => {
    console.log('=== Toggle Play/Pause ===');
    console.log('Current playing state:', isPlaying);
    console.log('Video status:', videoStatus);

    if (!videoRef.current) return;

    try {
      // If video finished, replay from start
      if (videoStatus.didJustFinish) {
        console.log('Video finished, replaying from start');
        await videoRef.current.replayAsync();
        setIsPlaying(true);
        return;
      }

      if (isPlaying) {
        await videoRef.current.pauseAsync();
        console.log('Video paused');
      } else {
        await videoRef.current.playAsync();
        console.log('Video playing');
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleExport = async () => {
    console.log('=== Exporting Video to Gallery ===');

    if (!video?.videoUri) {
      Alert.alert('Error', 'Video file not found');
      return;
    }

    try {
      setExporting(true);

      // Request permissions
      console.log('Requesting media library permissions...');
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        console.log('Permission denied');
        Alert.alert('Permission Required', 'Please grant permission to save videos to your gallery');
        setExporting(false);
        return;
      }

      console.log('Permission granted, saving video...');

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(video.videoUri);
      console.log('Asset created:', asset.id);

      // Create album if needed
      const album = await MediaLibrary.getAlbumAsync('TalkToAvatar');
      if (album === null) {
        console.log('Creating new album...');
        await MediaLibrary.createAlbumAsync('TalkToAvatar', asset, false);
      } else {
        console.log('Adding to existing album...');
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      setExporting(false);
      setSaved(true);
      console.log('✅ Video saved to gallery successfully!');

      Alert.alert('Success!', 'Video saved to your gallery');
    } catch (error) {
      console.error('=== Export Error ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      setExporting(false);
      Alert.alert('Error', `Failed to save video: ${error.message}`);
    }
  };

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Header
        title=""
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        containerStyle={{ backgroundColor: 'transparent' }}
        iconColor="#1F2937"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{video?.name || 'Video'}</Text>

        <View style={styles.videoContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}

          <Video
            ref={videoRef}
            source={{ uri: video?.videoUri || video?.videoUrl }}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={false}
            isLooping={false}
            onLoad={() => {
              console.log('Video loaded');
              setIsLoading(false);
            }}
            onPlaybackStatusUpdate={(status) => {
              setVideoStatus(status);
              if (status.isLoaded) {
                setIsPlaying(status.isPlaying);
              }
            }}
            onError={(error) => {
              console.error('Video playback error:', error);
              setIsLoading(false);
              Alert.alert('Error', 'Failed to load video');
            }}
          />

          {!isLoading && (
            <TouchableOpacity
              style={styles.playOverlay}
              onPress={handlePlayPause}
              activeOpacity={1}
            >
              {!isPlaying && (
                <View style={styles.playButton}>
                  <Ionicons name="play" size={40} color={COLORS.white} />
                </View>
              )}
            </TouchableOpacity>
          )}

          {!isLoading && videoStatus.isLoaded && (
            <>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progress,
                    {
                      width: `${(videoStatus.positionMillis / videoStatus.durationMillis) * 100}%`
                    }
                  ]}
                />
              </View>
              <View style={styles.timeLabels}>
                <Text style={styles.timeText}>
                  {formatTime(videoStatus.positionMillis || 0)}
                </Text>
                <Text style={styles.timeText}>
                  {formatTime(videoStatus.durationMillis || 0)}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.actionContainer}>
          {!saved && !exporting && (
            <Button
              title="Export to Gallery"
              onPress={handleExport}
              variant="primary"
              icon={<Ionicons name="download" size={20} color={COLORS.white} />}
              style={styles.actionButton}
            />
          )}

          {exporting && (
            <View style={styles.exportingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.exportText}>Exporting to gallery...</Text>
            </View>
          )}

          {saved && (
            <Button
              title="Saved to Gallery!"
              variant="primary"
              style={styles.savedButton}
              icon={<Ionicons name="checkmark-circle" size={24} color={COLORS.white} />}
              disabled={true}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light Background
    paddingTop: 30, // Spacing for header
  },
  content: {
    flex: 1,
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: 16,
    justifyContent: 'center', // Center vertically
    paddingBottom: 40,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: '#1F2937', // Dark Text
    marginBottom: 24,
    textAlign: 'center',
  },
  videoContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  loadingText: {
    fontSize: SIZES.body2,
    color: COLORS.gray[400],
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressBar: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2
  },
  progress: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2
  },
  timeLabels: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  timeText: {
    fontSize: SIZES.body4,
    color: COLORS.white,
    fontWeight: '500',
  },
  actionContainer: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  actionButton: {
    width: '100%',
    maxWidth: 300,
  },
  exportingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  exportText: {
    fontSize: SIZES.body2,
    fontWeight: '500',
    color: '#1F2937',
  },
  savedButton: {
    backgroundColor: '#22c55e',
    width: '100%',
    maxWidth: 300,
  },
});

export default VideoViewingScreen;

