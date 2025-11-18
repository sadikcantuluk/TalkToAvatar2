import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { DashboardLayout, LanguageSelector, VoiceSelector, PronunciationResult } from '../components';
import {
  generateTextToSpeech,
  playAudio,
  stopAudio,
  startRecording,
  stopRecording,
  transcribeAudio,
} from '../services/openAI';
import { useAuth, useToast } from '../context';
import { getUserStorageKey } from '../utils/userStorage';
import { evaluatePronunciationWithFile } from '../services/railsAPI';
import practiceSentencesAPI from '../services/practiceSentencesAPI';
import userCourseProgressAPI from '../services/userCourseProgressAPI';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CoursePracticeScreen = ({ route, navigation }) => {
  const { courseId, course, topic, topicTitle } = route.params || {};
  const { token, user } = useAuth();
  const { success, error: showError } = useToast();

  // Practice sentences
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [loadingSentences, setLoadingSentences] = useState(true);
  const [userProgress, setUserProgress] = useState({}); // sentence_id -> progress data

  // Voice and language (from course)
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const courseLanguage = course?.language_code || 'en';

  // Recording and playback
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingReference, setIsPlayingReference] = useState(false);
  const [isPlayingUser, setIsPlayingUser] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [referenceAudioUri, setReferenceAudioUri] = useState(null);
  const [userAudioUri, setUserAudioUri] = useState(null);
  const [userTranscript, setUserTranscript] = useState('');
  const [pronunciationScore, setPronunciationScore] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const recordingRef = useRef(null);

  // Current sentence
  const currentSentence = sentences[currentSentenceIndex];
  const currentProgress = currentSentence ? userProgress[currentSentence.id] : null;

  useEffect(() => {
    if (courseId && topic) {
      fetchSentences();
      fetchUserProgress();
    }
  }, [courseId, topic]);

  const fetchSentences = async () => {
    try {
      console.log('📚 [DEBUG] Fetching sentences for course:', courseId, 'topic:', topic);
      setLoadingSentences(true);
      const data = await practiceSentencesAPI.getByCourse(token, courseId, topic);
      console.log('✅ [DEBUG] Fetched sentences:', data.length);
      setSentences(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ [ERROR] Failed to fetch sentences:', err);
      showError('Failed to load practice sentences');
    } finally {
      setLoadingSentences(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      console.log('📊 [DEBUG] Fetching user progress for course:', courseId);
      const data = await userCourseProgressAPI.getAll(token, { course_id: courseId, topic });
      console.log('✅ [DEBUG] Fetched progress records:', data.length);
      
      const progressMap = {};
      if (Array.isArray(data)) {
        data.forEach(progress => {
          progressMap[progress.sentence_id] = progress;
        });
      }
      setUserProgress(progressMap);
    } catch (err) {
      console.error('❌ [ERROR] Failed to fetch progress:', err);
    }
  };

  const handleGenerateReferenceAudio = async () => {
    if (!currentSentence) return;

    try {
      console.log('🎵 [DEBUG] Generating reference audio for:', currentSentence.sentence);
      setIsGeneratingAudio(true);
      setReferenceAudioUri(null);

      const result = await generateTextToSpeech(
        currentSentence.sentence,
        selectedVoice,
        courseLanguage
      );

      if (result.success && result.uri) {
        console.log('✅ [DEBUG] Reference audio generated');
        setReferenceAudioUri(result.uri);
      } else {
        showError('Failed to generate reference audio');
      }
    } catch (error) {
      console.error('❌ [ERROR] Audio generation error:', error);
      showError('Failed to generate audio');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handlePlayReference = async () => {
    if (!referenceAudioUri) {
      await handleGenerateReferenceAudio();
      return;
    }

    try {
      if (isPlayingReference) {
        await stopAudio();
        setIsPlayingReference(false);
      } else {
        await stopAudio(); // Stop any other audio
        setIsPlayingUser(false);
        await playAudio(referenceAudioUri);
        setIsPlayingReference(true);
      }
    } catch (error) {
      console.error('❌ [ERROR] Playback error:', error);
      showError('Failed to play audio');
    }
  };

  const handleStartRecording = async () => {
    try {
      console.log('🎤 [DEBUG] Starting recording...');
      const result = await startRecording();

      if (result.success) {
        recordingRef.current = result.recording;
        setIsRecording(true);
      } else {
        Alert.alert('Error', 'Failed to start recording. Please grant microphone permission.');
      }
    } catch (error) {
      console.error('❌ [ERROR] Recording error:', error);
      setIsRecording(false);
      Alert.alert('Error', 'Microphone error. Please try again.');
    }
  };

  const handleStopRecording = async () => {
    if (!recordingRef.current) return;

    try {
      console.log('🛑 [DEBUG] Stopping recording...');
      setIsRecording(false);

      const result = await stopRecording(recordingRef.current);
      if (result.success) {
        console.log('✅ [DEBUG] Recording stopped, URI:', result.uri);
        setUserAudioUri(result.uri);

        // Transcribe and evaluate
        await handleEvaluateRecording(result.uri);
      } else {
        showError('Failed to stop recording');
      }

      recordingRef.current = null;
    } catch (error) {
      console.error('❌ [ERROR] Stop recording error:', error);
      setIsRecording(false);
      recordingRef.current = null;
    }
  };

  const handleEvaluateRecording = async (audioUri) => {
    if (!currentSentence) return;

    try {
      console.log('🔍 [DEBUG] Evaluating pronunciation...');
      setIsEvaluating(true);
      setPronunciationScore(null);
      setUserTranscript('');

      // Transcribe
      const transcription = await transcribeAudio(audioUri, courseLanguage);
      if (transcription.success) {
        setUserTranscript(transcription.text);
        console.log('✅ [DEBUG] Transcription:', transcription.text);
      }

      // Evaluate pronunciation
      const evaluationResult = await evaluatePronunciationWithFile(
        audioUri,
        currentSentence.sentence,
        courseLanguage
      );

      if (evaluationResult.success) {
        const score = evaluationResult.score;
        console.log('✅ [DEBUG] Pronunciation score:', score);

        setPronunciationScore({
          score: score,
          accuracy_score: evaluationResult.accuracy_score,
          fluency_score: evaluationResult.fluency_score,
          completeness_score: evaluationResult.completeness_score,
          feedback: evaluationResult.feedback,
          original: currentSentence.sentence,
          userText: transcription.text,
          word_level_details: evaluationResult.word_level_details || [],
        });

        // Save progress
        await saveProgress(score, evaluationResult);
      } else {
        showError(evaluationResult.error || 'Failed to evaluate pronunciation');
      }
    } catch (error) {
      console.error('❌ [ERROR] Evaluation error:', error);
      showError('Failed to evaluate pronunciation');
    } finally {
      setIsEvaluating(false);
    }
  };

  const saveProgress = async (score, evaluationResult) => {
    if (!currentSentence || !courseId) return;

    try {
      console.log('💾 [DEBUG] Saving progress for sentence:', currentSentence.id);
      
      const progressData = {
        course_id: courseId,
        sentence_id: currentSentence.id,
        score: score,
        completed: score >= 85, // Consider completed if score >= 85 (SUCCESS_THRESHOLD)
        attempts: (currentProgress?.attempts || 0) + 1,
      };

      const response = await userCourseProgressAPI.create(token, progressData);
      console.log('✅ [DEBUG] Progress saved:', response.progress.id);

      // Update local progress state
      setUserProgress(prev => ({
        ...prev,
        [currentSentence.id]: response.progress,
      }));

      // Refresh course progress
      if (navigation.getState) {
        // Notify parent screen to refresh
      }
    } catch (error) {
      console.error('❌ [ERROR] Failed to save progress:', error);
    }
  };

  const handlePlayUserRecording = async () => {
    if (!userAudioUri) return;

    try {
      if (isPlayingUser) {
        await stopAudio();
        setIsPlayingUser(false);
      } else {
        await stopAudio(); // Stop any other audio
        setIsPlayingReference(false);
        await playAudio(userAudioUri);
        setIsPlayingUser(true);
      }
    } catch (error) {
      console.error('❌ [ERROR] Playback error:', error);
      showError('Failed to play recording');
    }
  };

  const handleNextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setCurrentSentenceIndex(currentSentenceIndex + 1);
      // Reset state for new sentence
      setReferenceAudioUri(null);
      setUserAudioUri(null);
      setUserTranscript('');
      setPronunciationScore(null);
      setIsPlayingReference(false);
      setIsPlayingUser(false);
    }
  };

  const handlePreviousSentence = () => {
    if (currentSentenceIndex > 0) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setCurrentSentenceIndex(currentSentenceIndex - 1);
      // Reset state for new sentence
      setReferenceAudioUri(null);
      setUserAudioUri(null);
      setUserTranscript('');
      setPronunciationScore(null);
      setIsPlayingReference(false);
      setIsPlayingUser(false);
    }
  };

  // Auto-generate reference audio when sentence changes
  useEffect(() => {
    if (currentSentence && !referenceAudioUri) {
      handleGenerateReferenceAudio();
    }
  }, [currentSentenceIndex]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  if (loadingSentences) {
    return (
      <DashboardLayout navigation={navigation}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading practice sentences...</Text>
        </View>
      </DashboardLayout>
    );
  }

  if (sentences.length === 0) {
    return (
      <DashboardLayout navigation={navigation}>
        <View style={styles.centerContainer}>
          <Ionicons name="book-outline" size={48} color={COLORS.gray[400]} />
          <Text style={styles.emptyText}>No sentences available</Text>
          <Text style={styles.emptySubtext}>
            Practice sentences for this topic are not available yet
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </DashboardLayout>
    );
  }

  const completedCount = Object.values(userProgress).filter(p => p.completed).length;
  const progressPercentage = sentences.length > 0 
    ? Math.round((completedCount / sentences.length) * 100) 
    : 0;

  return (
    <DashboardLayout navigation={navigation}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {topicTitle || topic}
            </Text>
            <Text style={styles.headerSubtitle}>
              {currentSentenceIndex + 1} / {sentences.length}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercentage}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {completedCount} / {sentences.length} completed ({progressPercentage}%)
          </Text>
        </View>

        {/* Current Sentence Card */}
        <View style={styles.sentenceCard}>
          <Text style={styles.sentenceText}>{currentSentence?.sentence}</Text>
          
          {currentProgress && (
            <View style={styles.sentenceProgress}>
              <Ionicons
                name={currentProgress.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={currentProgress.completed ? '#10b981' : COLORS.gray[400]}
              />
              <Text style={styles.sentenceProgressText}>
                {currentProgress.completed ? 'Completed' : 'In Progress'} • 
                Best Score: {currentProgress.best_score || currentProgress.score || 0}% • 
                Attempts: {currentProgress.attempts || 0}
              </Text>
            </View>
          )}
        </View>

        {/* Reference Audio Section */}
        <View style={styles.audioSection}>
          <Text style={styles.sectionTitle}>Reference Audio</Text>
          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlayReference}
            disabled={isGeneratingAudio}
          >
            {isGeneratingAudio ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Ionicons
                  name={isPlayingReference ? 'pause' : 'play'}
                  size={24}
                  color={COLORS.white}
                />
                <Text style={styles.playButtonText}>
                  {isPlayingReference ? 'Pause' : 'Play Reference'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Recording Section */}
        <View style={styles.recordingSection}>
          <Text style={styles.sectionTitle}>Your Recording</Text>
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive,
            ]}
            onPress={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isEvaluating}
          >
            {isEvaluating ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Ionicons
                  name={isRecording ? 'stop' : 'mic'}
                  size={24}
                  color={COLORS.white}
                />
                <Text style={styles.recordButtonText}>
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {userAudioUri && (
            <TouchableOpacity
              style={styles.playUserButton}
              onPress={handlePlayUserRecording}
            >
              <Ionicons
                name={isPlayingUser ? 'pause-circle' : 'play-circle'}
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.playUserText}>
                {isPlayingUser ? 'Pause' : 'Play Your Recording'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Pronunciation Result */}
        {pronunciationScore && (
          <View style={styles.resultSection}>
            <PronunciationResult
              overallScore={pronunciationScore.score}
              accuracy={pronunciationScore.accuracy_score}
              fluency={pronunciationScore.fluency_score}
              completeness={pronunciationScore.completeness_score}
              words={pronunciationScore.word_level_details || []}
              transcript={pronunciationScore.userText}
              referenceText={pronunciationScore.original}
              showTitle={true}
            />
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationSection}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentSentenceIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePreviousSentence}
            disabled={currentSentenceIndex === 0}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={currentSentenceIndex === 0 ? COLORS.gray[500] : COLORS.textLight}
            />
            <Text
              style={[
                styles.navButtonText,
                currentSentenceIndex === 0 && styles.navButtonTextDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.navButtonPrimary,
              currentSentenceIndex === sentences.length - 1 && styles.navButtonDisabled,
            ]}
            onPress={handleNextSentence}
            disabled={currentSentenceIndex === sentences.length - 1}
          >
            <Text
              style={[
                styles.navButtonText,
                styles.navButtonTextPrimary,
                currentSentenceIndex === sentences.length - 1 && styles.navButtonTextDisabled,
              ]}
            >
              Next
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={currentSentenceIndex === sentences.length - 1 ? COLORS.gray[500] : COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  loadingText: {
    marginTop: SIZES.padding,
    fontSize: SIZES.body,
    color: COLORS.textLight,
  },
  emptyText: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: SIZES.padding,
  },
  emptySubtext: {
    fontSize: SIZES.body,
    color: COLORS.gray[400],
    textAlign: 'center',
    marginTop: SIZES.base,
    marginBottom: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  backButton: {
    padding: 4,
    marginRight: SIZES.base,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  headerSubtitle: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
    marginTop: 2,
  },
  progressSection: {
    marginBottom: SIZES.padding,
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  progressText: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
    textAlign: 'center',
  },
  sentenceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sentenceText: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SIZES.base,
    lineHeight: 28,
  },
  sentenceProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: SIZES.base,
    paddingTop: SIZES.base,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  sentenceProgressText: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
  },
  audioSection: {
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: SIZES.base,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  playButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body1,
    fontWeight: '600',
  },
  recordingSection: {
    marginBottom: SIZES.padding,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.gray[700],
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: SIZES.base,
  },
  recordButtonActive: {
    backgroundColor: '#ef4444',
  },
  recordButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body1,
    fontWeight: '600',
  },
  playUserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(19, 127, 236, 0.1)',
  },
  playUserText: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.primary,
  },
  resultSection: {
    marginBottom: SIZES.padding,
  },
  navigationSection: {
    flexDirection: 'row',
    gap: SIZES.base,
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButtonPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  navButtonTextPrimary: {
    color: COLORS.white,
  },
  navButtonTextDisabled: {
    color: COLORS.gray[500],
  },
  backButton: {
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.base,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
  },
  backButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default CoursePracticeScreen;

