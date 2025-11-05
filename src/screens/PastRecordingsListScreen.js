import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES } from '../constants';
import { playAudio, stopAudio } from '../services/openAI';

const RECORDINGS_HISTORY_KEY = '@sualingo_recordings_history';

const PastRecordingsListScreen = ({ navigation }) => {
  const [recordings, setRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    loadRecordings();
    
    return () => {
      stopAudio();
    };
  }, []);

  const loadRecordings = async () => {
    try {
      console.log('=== Loading Recordings History ===');
      setIsLoading(true);
      
      const saved = await AsyncStorage.getItem(RECORDINGS_HISTORY_KEY);
      if (saved) {
        const history = JSON.parse(saved);
        console.log('Loaded recordings:', history.length);
        setRecordings(history);
      } else {
        console.log('No recordings found');
      }
    } catch (error) {
      console.error('Error loading recordings:', error);
      Alert.alert('Error', 'Failed to load recordings');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayRecording = async (recording) => {
    if (!recording.audioUri) {
      Alert.alert('Error', 'Audio file not available');
      return;
    }

    try {
      if (playingId === recording.id) {
        // Stop current playback
        await stopAudio();
        setPlayingId(null);
      } else {
        // Stop any current playback
        await stopAudio();
        
        // Play new audio
        console.log('Playing recording:', recording.id);
        setPlayingId(recording.id);
        
        await playAudio(recording.audioUri, () => {
          setPlayingId(null);
        });
      }
    } catch (error) {
      console.error('Play recording error:', error);
      setPlayingId(null);
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  const handleViewScore = (recording) => {
    Alert.alert(
      'Score Report',
      `Level: ${recording.level}\n\nSentence: "${recording.sentence}"\n\nYou said: "${recording.userTranscript}"\n\nScore: ${recording.score}%\n\nLanguage: ${recording.language}\nVoice: ${recording.voice}`,
      [{ text: 'OK' }]
    );
  };

  const handleDeleteRecording = (recording) => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Deleting recording:', recording.id);
              const newRecordings = recordings.filter(r => r.id !== recording.id);
              setRecordings(newRecordings);
              await AsyncStorage.setItem(
                RECORDINGS_HISTORY_KEY,
                JSON.stringify(newRecordings)
              );
              
              // Stop if currently playing
              if (playingId === recording.id) {
                await stopAudio();
                setPlayingId(null);
              }
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete recording');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const renderRecordingItem = ({ item }) => (
    <View style={styles.recordingCard}>
      <View style={styles.recordingHeader}>
        <View style={styles.recordingInfo}>
          <Text style={styles.recordingName}>{item.name}</Text>
          <Text style={styles.recordingDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <View
          style={[
            styles.scoreBadge,
            { backgroundColor: getScoreColor(item.score) },
          ]}
        >
          <Text style={styles.scoreText}>{item.score}%</Text>
        </View>
      </View>

      <View style={styles.recordingContent}>
        <Text style={styles.levelLabel}>Level: {item.level}</Text>
        <Text style={styles.sentenceText} numberOfLines={2}>
          "{item.sentence}"
        </Text>
      </View>

      <View style={styles.recordingActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonPlay]}
          onPress={() => handlePlayRecording(item)}
        >
          <Ionicons
            name={playingId === item.id ? 'pause-circle' : 'play-circle'}
            size={20}
            color={COLORS.white}
          />
          <Text style={styles.actionButtonText}>
            {playingId === item.id ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonInfo]}
          onPress={() => handleViewScore(item)}
        >
          <Ionicons name="stats-chart" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Report</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonDelete]}
          onPress={() => handleDeleteRecording(item)}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Past Recordings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading recordings...</Text>
        </View>
      ) : recordings.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="mic-off-outline" size={64} color={COLORS.gray[600]} />
          <Text style={styles.emptyTitle}>No Recordings Yet</Text>
          <Text style={styles.emptyText}>
            Start practicing to see your recordings here
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.startButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recordings}
          keyExtractor={(item) => item.id}
          renderItem={renderRecordingItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  placeholder: {
    width: 40,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  loadingText: {
    fontSize: SIZES.body2,
    color: COLORS.gray[400],
  },
  emptyTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  emptyText: {
    fontSize: SIZES.body2,
    color: COLORS.gray[400],
    textAlign: 'center',
    lineHeight: 22,
  },
  startButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
  },
  startButtonText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.white,
  },
  listContent: {
    padding: SIZES.padding,
  },
  recordingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  recordingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingName: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  recordingDate: {
    fontSize: SIZES.body4,
    color: COLORS.gray[500],
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: SIZES.body3,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  recordingContent: {
    marginBottom: 12,
    gap: 8,
  },
  levelLabel: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.primary,
  },
  sentenceText: {
    fontSize: SIZES.body3,
    color: COLORS.gray[300],
    lineHeight: 20,
    fontStyle: 'italic',
  },
  recordingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonPlay: {
    backgroundColor: COLORS.primary,
  },
  actionButtonInfo: {
    backgroundColor: '#10b981',
  },
  actionButtonDelete: {
    flex: 0,
    paddingHorizontal: 12,
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default PastRecordingsListScreen;

