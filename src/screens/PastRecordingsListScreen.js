import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES } from '../constants';
import { RecordingCardSkeleton, SkeletonList } from '../components/SkeletonComponents';
import PronunciationResult from '../components/PronunciationResult';
import { playAudio, stopAudio } from '../services/openAI';
import { useAuth } from '../context';
import recordingsAPI from '../services/recordingsAPI';
import { getUserStorageKey } from '../utils/userStorage';
import { useUserData } from '../hooks/useUserData';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const THEME = {
  primary: '#2D7F83',
  background: '#F9FAFB', // Light gray background - matches dashboard
  cardBg: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
};

const MAX_RECORDINGS = 10;

const PastRecordingsListScreen = ({ navigation, route }) => {
  const { courseId } = route?.params || {};
  const { token, user } = useAuth();
  const { data: recordings, loading: isLoading, setData: setRecordings } = useUserData('recordings');
  const [playingId, setPlayingId] = useState(null);
  const [showReportDetails, setShowReportDetails] = useState({});

  // Debug: Log recordings state
  useEffect(() => {
    console.log('[PastRecordings] Component mounted/updated');
    console.log('[PastRecordings] User ID:', user?.id);
    console.log('[PastRecordings] Course ID:', courseId);
    console.log('[PastRecordings] Recordings count:', recordings?.length || 0);
    console.log('[PastRecordings] Recordings data:', recordings);
    console.log('[PastRecordings] Loading state:', isLoading);
  }, [recordings, isLoading, user?.id, courseId]);

  // Filter recordings by courseId if provided, and limit to 10 most recent
  const filteredAndLimitedRecordings = useMemo(() => {
    console.log('[PastRecordings] Filtering recordings...');
    let filtered = recordings || [];
    console.log('[PastRecordings] Initial recordings count:', filtered.length);
    
    // Filter by courseId if provided
    // IMPORTANT: If a recording doesn't have courseId/course_id, show it for all courses (general practice)
    if (courseId) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(r => {
        const recordingCourseId = r.courseId || r.course_id;
        // Show recording if:
        // 1. It matches the courseId, OR
        // 2. It has no courseId (general practice recording)
        return recordingCourseId === courseId || !recordingCourseId;
      });
      console.log('[PastRecordings] After courseId filter:', filtered.length, '(was:', beforeFilter, ')');
      console.log('[PastRecordings] CourseId filter details:', {
        courseId,
        sampleRecording: filtered[0] ? {
          id: filtered[0].id,
          courseId: filtered[0].courseId,
          course_id: filtered[0].course_id
        } : null,
        allRecordingsCourseIds: (recordings || []).map(r => ({
          id: r.id,
          courseId: r.courseId,
          course_id: r.course_id
        }))
      });
    }
    
    // Sort by date (newest first) and limit to 10
    filtered = filtered
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || 0);
        const dateB = new Date(b.createdAt || b.created_at || 0);
        return dateB - dateA;
      })
      .slice(0, MAX_RECORDINGS);
    
    console.log('[PastRecordings] Final filtered count:', filtered.length);
    console.log('[PastRecordings] Filtered recordings:', filtered.map(r => ({
      id: r.id,
      name: r.name,
      createdAt: r.createdAt || r.created_at,
      courseId: r.courseId || r.course_id
    })));
    
    return filtered;
  }, [recordings, courseId]);

  // Cleanup old recordings when recordings change
  useEffect(() => {
    const cleanupOldRecordings = async () => {
      if (!user?.id || !recordings || recordings.length <= MAX_RECORDINGS) return;

      try {
        // Sort by date and keep only the 10 most recent
        const sorted = [...recordings].sort((a, b) => {
          const dateA = new Date(a.createdAt || a.created_at || 0);
          const dateB = new Date(b.createdAt || b.created_at || 0);
          return dateB - dateA;
        });

        const toKeep = sorted.slice(0, MAX_RECORDINGS);
        const toDelete = sorted.slice(MAX_RECORDINGS);

        // Update local storage
        const key = getUserStorageKey('@sualingo_recordings_history', user.id);
        await AsyncStorage.setItem(key, JSON.stringify(toKeep));
        setRecordings(toKeep);

        // Delete old recordings from backend
        if (token && toDelete.length > 0) {
          toDelete.forEach(async (recording) => {
            if (recording.backend_id) {
              try {
                await recordingsAPI.delete(token, recording.backend_id);
                console.log('✅ Old recording deleted from backend:', recording.id);
              } catch (error) {
                // Handle 404 gracefully - record was already deleted, which is fine
                if (error?.response?.status === 404 || error?.status === 404) {
                  // Silently ignore 404 - record already deleted, which is the desired state
                  console.log('ℹ️ Recording already deleted from backend:', recording.id);
                } else {
                  // Log other errors
                  console.error('⚠️ Failed to delete old recording from backend:', error);
                }
              }
            }
          });
        }

        console.log(`✅ Cleaned up ${toDelete.length} old recordings. Keeping ${toKeep.length} most recent.`);
      } catch (error) {
        console.error('❌ Error cleaning up old recordings:', error);
      }
    };

    cleanupOldRecordings();
  }, [recordings, user?.id, token, setRecordings]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

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
              console.log('=== Deleting Recording ===');
              console.log('Recording ID:', recording.id);
              
              // Delete from local storage
              const newRecordings = recordings.filter(r => r.id !== recording.id);
              setRecordings(newRecordings);
              const key = getUserStorageKey('@sualingo_recordings_history', user.id);
              await AsyncStorage.setItem(key, JSON.stringify(newRecordings));
              
              console.log('✅ Recording deleted locally. Remaining items:', newRecordings.length);
              
              // Delete from backend if authenticated and backend_id exists
              if (token && user && recording?.backend_id) {
                Promise.resolve().then(async () => {
                  try {
                    console.log('📤 Deleting recording from backend (background)...');
                    await recordingsAPI.delete(token, recording.backend_id);
                    console.log('✅ Recording deleted from backend');
                  } catch (backendError) {
                    console.error('⚠️ Backend delete failed, but local delete succeeded:', backendError);
                  }
                });
              }
              
              // Stop if currently playing
              if (playingId === recording.id) {
                await stopAudio();
                setPlayingId(null);
              }
            } catch (error) {
              console.error('❌ Delete error:', error);
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

  const toggleReport = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowReportDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderRecordingItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.recordingCard}
        onPress={() => toggleReport(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.recordingHeader}>
          <View style={styles.recordingInfo}>
            <Text style={styles.recordingName}>{item.name || 'Recording'}</Text>
            <Text style={styles.recordingDate}>{formatDate(item.createdAt || item.created_at)}</Text>
          </View>
          <View
            style={[
              styles.scoreBadge,
              { 
                backgroundColor: (item.pronunciationScore || item.score || 0) >= 85 ? '#10b981' :
                                 (item.pronunciationScore || item.score || 0) >= 70 ? '#f59e0b' : '#ef4444'
              },
            ]}
          >
            <Text style={styles.scoreText}>{item.pronunciationScore || item.score || 0}%</Text>
          </View>
        </View>

        <View style={styles.recordingContent}>
          {item.level && (
            <Text style={styles.levelLabel}>Level: {item.level}</Text>
          )}
          <Text style={styles.sentenceText} numberOfLines={2}>
            "{item.sentence || item.reference_text || 'No sentence available'}"
          </Text>
        </View>

        <View style={styles.recordingActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPlay]}
            onPress={(e) => {
              e.stopPropagation(); // Prevent card tap
              handlePlayRecording(item);
            }}
          >
            <Ionicons
              name={playingId === item.id ? 'pause-circle' : 'play-circle'}
              size={20}
              color={THEME.cardBg}
            />
            <Text style={styles.actionButtonText}>
              {playingId === item.id ? 'Pause' : 'Play'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonDelete]}
            onPress={(e) => {
              e.stopPropagation(); // Prevent card tap
              handleDeleteRecording(item);
            }}
          >
            <Ionicons name="trash-outline" size={20} color={THEME.cardBg} />
          </TouchableOpacity>
        </View>

        {/* Inline Report Details */}
        {showReportDetails[item.id] && (
          <View style={styles.reportDetailsContainer}>
            <PronunciationResult
              overallScore={item.pronunciation_score || item.score || 0}
              accuracy={item.accuracy || item.accuracy_score}
              fluency={item.fluency || item.fluency_score}
              completeness={item.completeness || item.completeness_score}
              words={item.words || item.word_level_details || []}
              transcript={item.user_transcript || item.transcript || item.userTranscript || ''}
              referenceText={item.reference_text || item.sentence || ''}
              showTitle={true}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={THEME.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Past Recordings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      {isLoading ? (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.listContent}
        >
          <SkeletonList 
            count={3} 
            renderSkeleton={() => <RecordingCardSkeleton />}
            itemStyle={{ marginBottom: 16 }}
          />
        </ScrollView>
      ) : filteredAndLimitedRecordings.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="mic-off-outline" size={64} color={THEME.textSecondary} />
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
          data={filteredAndLimitedRecordings}
          keyExtractor={(item) => item.id}
          renderItem={renderRecordingItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background, // Light background - matches dashboard
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 30 : 10,
    paddingBottom: 16,
    backgroundColor: THEME.background, // Light background - matches dashboard
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.text, // Dark text - matches dashboard
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.text, // Dark text
  },
  emptyText: {
    fontSize: 14,
    color: THEME.textSecondary, // Secondary text
    textAlign: 'center',
    lineHeight: 22,
  },
  startButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: THEME.primary,
    borderRadius: 24,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.cardBg,
  },
  listContent: {
    padding: 24,
  },
  recordingCard: {
    backgroundColor: THEME.cardBg, // White card - matches dashboard
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text, // Dark text
    marginBottom: 4,
  },
  recordingDate: {
    fontSize: 12,
    color: THEME.textSecondary, // Secondary text
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.cardBg,
  },
  recordingContent: {
    marginBottom: 12,
    gap: 8,
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.primary,
  },
  sentenceText: {
    fontSize: 14,
    color: THEME.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  recordingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionButtonPlay: {
    backgroundColor: THEME.primary,
    flex: 1,
  },
  actionButtonDelete: {
    flex: 0,
    paddingHorizontal: 16,
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.cardBg,
  },
  // Report Details Styles
  reportDetailsContainer: {
    marginTop: 12,
  },
});

export default PastRecordingsListScreen;
