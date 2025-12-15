import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useToast } from '../context';
import { playAudio, stopAudio, startRecording, stopRecording, transcribeAudio } from '../services/openAI';
import { evaluatePronunciationWithFile } from '../services/railsAPI';
import practiceSentencesAPI from '../services/practiceSentencesAPI';
import userCourseProgressAPI from '../services/userCourseProgressAPI';
import { COLORS, IMAGES } from '../constants';

const CoursePracticeScreen = ({ route, navigation }) => {
  const { courseId, course, topic, topicTitle, selectedVoice } = route.params || {};
  const { token } = useAuth();
  const { error: showError } = useToast();

  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Interaction State
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingRef, setIsPlayingRef] = useState(false);
  const [isPlayingUser, setIsPlayingUser] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Evaluation Results
  const [evaluation, setEvaluation] = useState(null); // { score, feedback, transcript }
  const [recordingUri, setRecordingUri] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);

  const recordingRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animation effect
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  useEffect(() => {
    loadSentences();
    return () => stopAudio();
  }, []);

  const loadSentences = async () => {
    try {
      setLoading(true);
      const data = await practiceSentencesAPI.getByCourse(token, courseId, topic);
      setSentences(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load sentences', err);
      showError('Failed to load sentences.');
    } finally {
      setLoading(false);
    }
  };

  const activeSentence = sentences[currentIndex];

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false); // Reset translation view
      resetState();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowTranslation(false); // Reset translation view
      resetState();
    }
  };

  const resetState = () => {
    stopAudio();
    setIsPlayingRef(false);
    setIsPlayingUser(false);
    setIsRecording(false);
    setEvaluation(null);
    setRecordingUri(null);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      setProcessing(true);
      try {
        const result = await stopRecording(recordingRef.current);
        if (result.success) {
          setRecordingUri(result.uri);
          await handleEvaluation(result.uri);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setProcessing(false);
        recordingRef.current = null;
      }
    } else {
      try {
        const result = await startRecording();
        if (result.success) {
          recordingRef.current = result.recording;
          setIsRecording(true);
        }
      } catch (err) {
        Alert.alert('Error', 'Could not start recording.');
      }
    }
  };

  const handleEvaluation = async (uri) => {
    if (!activeSentence) return;
    try {
      // Evaluate
      // Note: Real implementation would actally generate feedback here using the API
      // For simplicity reusing existing service
      const result = await evaluatePronunciationWithFile(
        uri,
        activeSentence.sentence,
        course?.language_code || 'en'
      );

      if (result.success) {
        setEvaluation({
          score: result.score,
          transcript: result.transcript,
          feedback: result.feedback,
          words: result.word_level_details
        });
        // Save progress
        saveProgress(result.score);
      } else {
        showError('Evaluation failed.');
      }

    } catch (err) {
      console.error(err);
      showError('Evaluation error.');
    }
  };

  const saveProgress = async (score) => {
    try {
      await userCourseProgressAPI.create(token, {
        course_id: courseId,
        sentence_id: activeSentence.id,
        score: score,
        completed: score >= 85
      });
    } catch (e) { console.log('Progress save failed', e) }
  };

  const playReference = async () => {
    // TODO: Implement TTS for reference based on selectedVoice
    // Placeholder
    Alert.alert('Info', `Playing reference using ${selectedVoice} voice...`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2D7F83" />
      </View>
    );
  }

  if (sentences.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No sentences found for this topic.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Highlight words based on evaluation
  const renderSentenceText = () => {
    if (!evaluation || !evaluation.words) {
      return <Text style={styles.sentenceText}>{activeSentence?.sentence}</Text>;
    }

    return (
      <Text style={styles.sentenceText}>
        {evaluation.words.map((w, i) => (
          <Text key={i} style={{
            color: w.accuracy_score >= 80 ? '#1F2937' : '#EF4444',
            // Bold if good? 
          }}>
            {w.word}{' '}
          </Text>
        ))}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E0F2F1" />

      {/* Top Section: Header & Avatar (60%) */}
      <View style={styles.topSection}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{currentIndex + 1} / {sentences.length}</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        {/* Hero Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarGlow}>
            <Image
              source={selectedVoice === 'female' ? IMAGES.yusuf : IMAGES.yusuf}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      {/* Bottom Section: Interaction (40%) */}
      <View style={styles.bottomSection}>

        {/* Sentence Card Area */}
        <View style={styles.cardArea}>
          <TouchableOpacity
            style={styles.navArrow}
            onPress={handlePrev}
            disabled={currentIndex === 0}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="chevron-back" size={32} color={currentIndex === 0 ? "#D1D5DB" : "#4B5563"} />
          </TouchableOpacity>

          <View style={styles.sentenceCard}>
            <View style={styles.sentenceContent}>
              <ScrollView
                contentContainerStyle={styles.sentenceScrollContent}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {renderSentenceText()}

                {showTranslation && (
                  <View style={styles.translationContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.translationText}>
                      {activeSentence?.turkish_translation || activeSentence?.translation || "Çeviri bulunamadı."}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
            <TouchableOpacity
              style={styles.translationButton}
              hitSlop={{ top: 10, bottom: 10 }}
              onPress={() => setShowTranslation(!showTranslation)}
            >
              <Text style={styles.translationButtonText}>
                {showTranslation ? "Çeviriyi Gizle" : "Çeviriyi Göster"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.navArrow}
            onPress={handleNext}
            disabled={currentIndex === sentences.length - 1}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="chevron-forward" size={32} color={currentIndex === sentences.length - 1 ? "#D1D5DB" : "#4B5563"} />
          </TouchableOpacity>
        </View>

        {/* Result Feedback Overlay (Optional placement) */}
        {evaluation && (
          <View style={styles.evaluationFeedback}>
            <Text style={[styles.evaluationText, { color: evaluation.score >= 80 ? '#047857' : '#B91C1C' }]}>
              Result: {Math.round(evaluation.score)}%
            </Text>
          </View>
        )}

        {/* Ergonomic Controls */}
        <View style={styles.controlsArea}>
          {/* Reference Audio */}
          <TouchableOpacity
            style={styles.sideControlButton}
            onPress={playReference}
            activeOpacity={0.7}
          >
            <Ionicons name="volume-medium" size={28} color="#4B5563" />
          </TouchableOpacity>

          {/* Main Record Button */}
          <View style={styles.micContainer}>
            <Animated.View style={[
              styles.micPulseRing,
              {
                transform: [{ scale: pulseAnim }],
                opacity: isRecording ? 0.3 : 0,
              }
            ]} />
            <TouchableOpacity
              style={[
                styles.mainMicButton,
                isRecording && styles.recordingState
              ]}
              onPress={toggleRecording}
              disabled={processing}
              activeOpacity={0.8}
            >
              {processing ? (
                <ActivityIndicator color="#FFFFFF" size="large" />
              ) : (
                <Ionicons name={isRecording ? "stop" : "mic"} size={44} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>

          {/* User Playback */}
          <TouchableOpacity
            style={[styles.sideControlButton, !recordingUri && styles.disabledButton]}
            onPress={() => recordingUri && playAudio(recordingUri)}
            disabled={!recordingUri}
            activeOpacity={0.7}
          >
            <Ionicons name="play" size={28} color={recordingUri ? "#4B5563" : "#D1D5DB"} />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2F1', // Soft Mint Background
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // --- TOP SECTION ---
  topSection: {
    flex: 0.55, // 55% height
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    zIndex: 10,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressContainer: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  progressText: {
    fontWeight: '700',
    color: '#1F2937',
    fontSize: 14,
  },
  avatarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20, // Pull up slightly to center logically
  },
  avatarGlow: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D7F83',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2, // Glow effect
    shadowRadius: 20,
    elevation: 10,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },

  // --- BOTTOM SECTION ---
  bottomSection: {
    flex: 0.45, // 45% height
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
    justifyContent: 'space-between', // Distribute Space
  },
  // Card
  cardArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  navArrow: {
    padding: 8,
  },
  sentenceCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    minHeight: 120,
    maxHeight: 200,
    justifyContent: 'center',
  },
  sentenceContent: {
    width: '100%',
    maxHeight: 140, // Allow internal scroll if very long
  },
  sentenceScrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  sentenceText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 30, // Increased line height for readability
  },
  translationButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 20, // Chip style
  },
  translationButtonText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '600',
  },
  translationContainer: {
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '80%',
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
  },
  translationText: {
    fontSize: 17,
    color: '#4B5563',
    fontStyle: 'italic',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Evaluation
  evaluationFeedback: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  evaluationText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Controls
  controlsArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingBottom: Platform.OS === 'ios' ? 10 : 20,
    marginTop: 10,
  },
  sideControlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.4,
  },
  micContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  micPulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2D7F83',
  },
  mainMicButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#2D7F83',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D7F83',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  recordingState: {
    backgroundColor: '#EF4444',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  }
});

export default CoursePracticeScreen;
