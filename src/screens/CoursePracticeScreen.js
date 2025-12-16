import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Modal,
  Dimensions
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useToast } from '../context';
import { playAudio, stopAudio, startRecording, stopRecording, transcribeAudio, translateText, generateTextToSpeech } from '../services/openAI';
import { evaluatePronunciationWithFile } from '../services/railsAPI';
import practiceSentencesAPI from '../services/practiceSentencesAPI';
import userCourseProgressAPI from '../services/userCourseProgressAPI';
import { useTopicProgress, useUpdateTopicProgress } from '../hooks/useCourseQueries';
import { COLORS, IMAGES } from '../constants';
import { ProgressBarSkeleton } from '../components/SkeletonComponents';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserStorageKey } from '../utils/userStorage';
import recordingsAPI from '../services/recordingsAPI';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CoursePracticeScreen = ({ route, navigation }) => {
  const { courseId, course, topic, topicTitle, selectedVoice, selectedAvatar } = route.params || {};
  const { token, user } = useAuth();
  const { error: showError, success } = useToast();

  // Ensure courseId is available - use course?.id as fallback
  const effectiveCourseId = courseId || course?.id;

  // Topic progress query - only if courseId is available
  const { data: topicProgressData, refetch: refetchTopicProgress, isLoading: topicProgressLoading } = useTopicProgress(effectiveCourseId);
  const updateTopicProgressMutation = useUpdateTopicProgress();

  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Interaction State
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingRef, setIsPlayingRef] = useState(false); // Playing reference audio
  const [isGeneratingTTS, setIsGeneratingTTS] = useState(false); // Generating TTS
  const [isPlayingUser, setIsPlayingUser] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Evaluation Results
  const [evaluation, setEvaluation] = useState(null); // { score, feedback, transcript }
  const [recordingUri, setRecordingUri] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translation, setTranslation] = useState(null);
  const [translating, setTranslating] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false); // Toggle for word details

  const recordingRef = useRef(null);
  // Animation Refs for Ripple Effect
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim3 = useRef(new Animated.Value(0)).current;

  // Animation for "Listen to My Recording" button
  const playbackWaveAnim1 = useRef(new Animated.Value(0)).current;
  const playbackWaveAnim2 = useRef(new Animated.Value(0)).current;
  const playbackWaveAnim3 = useRef(new Animated.Value(0)).current;

  // Avatar display state - show image by default, video when playing
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  // Playback animation control
  useEffect(() => {
    if (isPlayingUser) {
      // Start wave animations
      const animateWave = (anim, delay) => {
        anim.setValue(0);
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            })
          ])
        ).start();
      };

      animateWave(playbackWaveAnim1, 0);
      animateWave(playbackWaveAnim2, 200);
      animateWave(playbackWaveAnim3, 400);
    } else {
      // Reset animations
      playbackWaveAnim1.stopAnimation(); playbackWaveAnim1.setValue(0);
      playbackWaveAnim2.stopAnimation(); playbackWaveAnim2.setValue(0);
      playbackWaveAnim3.stopAnimation(); playbackWaveAnim3.setValue(0);
    }
  }, [isPlayingUser]);

  // Animation effect
  useEffect(() => {
    if (isRecording) {
      const createAnimation = (anim, delay) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(anim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
              }),
              Animated.timing(anim, {
                toValue: 0, // Opacity fade out, reuse value for scale 0->1?? No, need separate or interpolation
                duration: 2000,
                useNativeDriver: true,
              })
            ])
          ])
        );
      };

      // We actually need separate scale and opacity for perfect ripple
      // Simplified: Just use ONE value 0->1 per ring, and interpolate scale and opacity from it.

      const animateRing = (anim, delay) => {
        anim.setValue(0);
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
              easing: Easing.out(Easing.ease),
            })
          ])
        ).start();
      };

      animateRing(pulseAnim1, 0);
      animateRing(pulseAnim2, 600);
      animateRing(pulseAnim3, 1200);

    } else {
      // Reset
      pulseAnim1.stopAnimation(); pulseAnim1.setValue(0);
      pulseAnim2.stopAnimation(); pulseAnim2.setValue(0);
      pulseAnim3.stopAnimation(); pulseAnim3.setValue(0);
    }
  }, [isRecording]);

  useEffect(() => {
    loadSentences();
    return () => stopAudio();
  }, []);

  const loadSentences = async () => {
    const effectiveCourseId = courseId || course?.id;
    if (!effectiveCourseId) {
      console.error('courseId is missing');
      showError('Course ID is missing');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await practiceSentencesAPI.getByCourse(token, effectiveCourseId, topic);
      setSentences(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load sentences', err);
      showError('Failed to load sentences.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTranslation = async () => {
    if (showTranslation) {
      setShowTranslation(false);
      return;
    }

    setShowTranslation(true);

    if (translation) {
      return;
    }

    if (!activeSentence || !activeSentence.sentence) {
      return;
    }

    const nativeLanguage = course?.native_language || user?.native_language || 'tr';

    try {
      setTranslating(true);
      const result = await translateText(activeSentence.sentence, nativeLanguage);

      if (result.success) {
        setTranslation(result.translatedText);
      } else {
        setTranslation('Çeviri başarısız oldu.');
      }
    } catch (err) {
      setTranslation('Çeviri hatası oluştu.');
    } finally {
      setTranslating(false);
    }
  };

  const activeSentence = sentences[currentIndex];

  const handleNext = () => {
    setModalVisible(false);
    setEvaluation(null); // Clear evaluation for next sentence
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
      resetState();
    }
  };

  const handleTryAgain = () => {
    setModalVisible(false);
    setEvaluation(null); // Clear evaluation to retry
    // No index change
    resetState();
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowTranslation(false);
      resetState();
      setEvaluation(null);
      setModalVisible(false);
    }
  };

  const resetState = async () => {
    stopAudio();
    setIsPlayingRef(false);
    setIsGeneratingTTS(false);
    setIsPlayingUser(false);
    setIsRecording(false);
    setRecordingUri(null);

    // Stop video and reset to image
    if (videoRef.current) {
      try {
        await videoRef.current.stopAsync();
      } catch (err) {
        console.log('Video stop error:', err);
      }
    }
    setIsVideoPlaying(false);
    setTranslation(null);
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
        showError('Recording failed.');
        setProcessing(false);
      } finally {
        recordingRef.current = null;
      }
    } else {
      if (isPlayingRef) return; // Prevent recording while audio is playing
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
    if (!activeSentence) {
      setProcessing(false);
      return;
    }
    try {
      // 1. Prepare FormData for file upload
      const formData = new FormData();
      formData.append('audio_file', {
        uri: uri,
        type: 'audio/m4a', // Expo Audio recording default usually m4a/caf on iOS, m4a on Android with high quality preset
        name: 'recording.m4a',
      });
      formData.append('reference_text', activeSentence.sentence);
      formData.append('language_code', course?.language_code || 'en');

      // 2. Call API
      const result = await evaluatePronunciationWithFile(
        formData,
        activeSentence.sentence,
        course?.language_code || 'en'
      );

      if (result.success) {
        const newEvaluation = {
          score: result.score,
          transcript: result.transcript,
          feedback: result.feedback,
          words: result.word_level_details,
          accuracy: result.accuracy_score,
          completeness: result.completeness_score,
          fluency: result.fluency_score,
        };
        setEvaluation(newEvaluation);
        setModalVisible(true); // Show the report modal automatically

        saveProgress(result.score);

        // Save recording to history
        if (uri && activeSentence) {
          await saveRecordingToHistory({
            level: course?.level || 'beginner',
            sentence: activeSentence.sentence,
            userTranscript: result.transcript,
            pronunciationScore: result.score,
            accuracyScore: result.accuracy_score,
            fluencyScore: result.fluency_score,
            completenessScore: result.completeness_score,
            wordLevelDetails: result.word_level_details || [],
            userAudioUri: uri,
            referenceAudioUri: null, // Can be added later if needed
            language: course?.language_code || 'en',
            courseId: effectiveCourseId,
            course: course,
            topic: topic,
            practiceSentenceId: activeSentence.id,
          });
        }
      } else {
        showError('Evaluation failed: ' + (result.error || 'Unknown error'));
      }

    } catch (err) {
      console.error(err);
      showError('Evaluation error occurred.');
    } finally {
      setProcessing(false);
    }
  };

  const saveRecordingToHistory = async (recordingData) => {
    if (!user?.id) {
      showError('User not authenticated');
      return;
    }

    try {
      console.log('[saveRecording] === Saving Recording to History ===');
      const key = getUserStorageKey('@sualingo_recordings_history', user.id);
      console.log('[saveRecording] Storage key:', key);
      console.log('[saveRecording] User ID:', user.id);
      console.log('[saveRecording] Recording data:', {
        sentence: recordingData.sentence,
        score: recordingData.pronunciationScore,
        courseId: recordingData.courseId,
        topic: recordingData.topic
      });

      const saved = await AsyncStorage.getItem(key);
      console.log('[saveRecording] Existing data in AsyncStorage:', saved ? 'exists' : 'null');
      const history = saved ? JSON.parse(saved) : [];
      console.log('[saveRecording] Existing history count:', history.length);

      const date = new Date();
      const dateStr = date.toISOString().split('T')[0];
      const level = recordingData.level || course?.level || 'beginner';
      const count = history.filter(r => r.level === level).length + 1;
      const autoName = `Level_${level}_${dateStr}_#${String(count).padStart(3, '0')}`;

      const newRecording = {
        id: Date.now().toString(),
        name: autoName,
        ...recordingData,
        createdAt: date.toISOString(),
      };

      // Save to local AsyncStorage (fast)
      let newHistory = [newRecording, ...history];

      // Cleanup: Keep only 10 most recent recordings
      if (newHistory.length > 10) {
        // Sort by date (newest first) and keep only 10
        newHistory = newHistory
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || a.created_at || 0);
            const dateB = new Date(b.createdAt || b.created_at || 0);
            return dateB - dateA;
          })
          .slice(0, 10);
        console.log('✅ Cleaned up old recordings. Keeping 10 most recent.');
      }

      await AsyncStorage.setItem(key, JSON.stringify(newHistory));
      console.log('✅ Recording saved to AsyncStorage. Total recordings:', newHistory.length);

      // Save to backend asynchronously (non-blocking)
      if (token && user) {
        Promise.resolve().then(async () => {
          try {
            console.log('📤 Saving recording to backend (background)...');

            const backendData = {
              level: level,
              sentence: recordingData.sentence,
              user_audio_uri: recordingData.userAudioUri,
              reference_audio_uri: recordingData.referenceAudioUri || null,
              user_transcript: recordingData.userTranscript,
              pronunciation_score: recordingData.pronunciationScore,
              accuracy_score: recordingData.accuracyScore,
              fluency_score: recordingData.fluencyScore,
              completeness_score: recordingData.completenessScore,
              word_level_details: recordingData.wordLevelDetails || [],
              language_code: course?.language_code || 'en',
              course_id: recordingData.courseId || null,
              practice_sentence_id: recordingData.practiceSentenceId || null,
              topic: recordingData.topic || null,
            };

            console.log('📤 [DEBUG] Backend data with course context:', {
              course_id: backendData.course_id,
              practice_sentence_id: backendData.practice_sentence_id,
              topic: backendData.topic
            });

            const response = await recordingsAPI.create(token, backendData);
            console.log('✅ Recording saved to backend:', response.recording.id);

            // Update local storage with backend_id for future deletion
            const saved = await AsyncStorage.getItem(key);
            if (saved) {
              const history = JSON.parse(saved);
              const updatedHistory = history.map(item => {
                if (item.id === newRecording.id) {
                  return { ...item, backend_id: response.recording.id };
                }
                return item;
              });
              await AsyncStorage.setItem(key, JSON.stringify(updatedHistory));
            }
          } catch (backendError) {
            console.error('⚠️ Backend save failed, but local save succeeded:', backendError);
          }
        });
      }
    } catch (error) {
      console.error('❌ Error saving recording history:', error);
      showError('Failed to save recording');
    }
  };

  const saveProgress = async (score) => {
    const effectiveCourseId = courseId || course?.id;
    if (!effectiveCourseId) {
      console.error('courseId is missing in saveProgress');
      return;
    }

    const isCompleted = score >= 85;

    // Optimistic update: immediately update progress if sentence is completed
    if (isCompleted && topic && topicProgressData?.topic_progress) {
      const topicData = topicProgressData.topic_progress.find(
        (tp) => tp.topic === topic || tp.topic?.toLowerCase() === topic?.toLowerCase()
      );

      if (topicData) {
        const newCompleted = (topicData.completed_sentences || 0) + 1;
        const total = topicData.total_sentences || sentences.length;
        const newProgress = total > 0 ? (newCompleted / total) * 100 : 0;

        // Set optimistic progress for instant UI update
        setOptimisticProgress(newProgress);
      }
    }

    try {
      await userCourseProgressAPI.create(token, {
        course_id: effectiveCourseId,
        sentence_id: activeSentence.id,
        practice_sentence_id: activeSentence.id,
        score: score,
        completed: isCompleted // Enforce threshold logic
      });

      // Update topic progress if sentence was completed (score >= 85)
      if (isCompleted && topic) {
        try {
          await updateTopicProgressMutation.mutateAsync({ courseId: effectiveCourseId, topic });
          // Refetch topic progress to get updated data (will clear optimistic state)
          refetchTopicProgress().then(() => {
            // Clear optimistic progress after refetch
            setOptimisticProgress(null);
          });
        } catch (e) {
          console.log('Topic progress update failed', e);
          // Clear optimistic progress on error
          setOptimisticProgress(null);
        }
      } else {
        // Clear optimistic progress if not completed
        setOptimisticProgress(null);
      }
    } catch (e) {
      console.log('Progress save failed', e);
      // Clear optimistic progress on error
      setOptimisticProgress(null);
    }
  };

  const playReference = async () => {
    if (!activeSentence || !activeSentence.sentence) return;
    if (isRecording || isPlayingRef || isGeneratingTTS) return; // Block double clicks

    try {
      setIsGeneratingTTS(true); // Show loading state on button

      // Generate TTS audio from sentence text
      const languageCode = course?.language_code || 'en';
      const voiceId = selectedVoice || 'alloy';

      // Generate speech 
      const ttsResult = await generateTextToSpeech(
        activeSentence.sentence,
        voiceId,
        languageCode,
        true // skipTranslation
      );

      if (!ttsResult.success || !ttsResult.audioUri) {
        throw new Error(ttsResult.error || 'Failed to generate audio');
      }

      setIsGeneratingTTS(false); // Stop loading, start playing
      setIsPlayingRef(true);

      // Play the generated audio with synchronized video animation
      const playResult = await playAudio(
        ttsResult.audioUri,
        // onPlaybackComplete
        async () => {
          if (videoRef.current) {
            try {
              await videoRef.current.stopAsync();
            } catch (err) { }
          }
          setIsVideoPlaying(false);
          setIsPlayingRef(false);
        },
        // onPlaybackStart
        async () => {
          setIsVideoPlaying(true);
          if (videoRef.current) {
            try {
              await videoRef.current.setPositionAsync(0);
              await videoRef.current.playAsync();
            } catch (err) { }
          }
        }
      );

      if (!playResult.success) {
        throw new Error(playResult.error || 'Failed to play audio');
      }

    } catch (err) {
      console.error('Error playing reference audio:', err);
      setIsGeneratingTTS(false);
      setIsPlayingRef(false);
      if (videoRef.current) {
        try {
          await videoRef.current.stopAsync();
        } catch (err) { }
      }
      setIsVideoPlaying(false);
      showError('Failed to play audio.');
    }
  };

  const renderWordFeedback = (text, words) => {
    if (!words || words.length === 0) return <Text style={styles.modalReferenceText}>{text}</Text>;

    return (
      <View style={styles.wordDetailsContainer}>
        {words.map((w, i) => {
          // High: >= 80 (Green), Med: >= 50 (Yellow), Low: < 50 (Red)
          let color = '#EF4444';
          let bgColor = '#FEF2F2';
          if (w.accuracy_score >= 80) { color = '#047857'; bgColor = '#ECFDF5'; }
          else if (w.accuracy_score >= 50) { color = '#D97706'; bgColor = '#FFFBEB'; }

          return (
            <View key={i} style={[styles.wordDetailItem, { backgroundColor: bgColor }]}>
              <Text style={[styles.wordDetailText, { color: color }]}>{w.word}</Text>
              <View style={[styles.wordScoreBadge, { backgroundColor: color }]}>
                <Text style={styles.wordScoreText}>{Math.round(w.accuracy_score)}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  // Topic Progress Calculation - Use real progress data from API
  // Also maintain local optimistic state for instant updates
  const [optimisticProgress, setOptimisticProgress] = useState(null);

  const topicProgress = useMemo(() => {
    // Use optimistic progress if available (for instant updates)
    if (optimisticProgress !== null) {
      return optimisticProgress;
    }

    if (!topicProgressData?.topic_progress || !topic) return 0;

    // Find progress for current topic
    const topicData = topicProgressData.topic_progress.find(
      (tp) => tp.topic === topic || tp.topic?.toLowerCase() === topic?.toLowerCase()
    );

    // Always calculate from completed/total for accuracy
    if (topicData?.completed_sentences !== undefined && topicData?.total_sentences !== undefined && topicData.total_sentences > 0) {
      const calculatedProgress = (topicData.completed_sentences / topicData.total_sentences) * 100;
      return calculatedProgress;
    }

    // Fallback to API progress value if completed/total not available
    return topicData?.progress || 0;
  }, [topicProgressData, topic, optimisticProgress]);

  // Helper function for smooth color transitions (0-40% red/orange, 40-70% yellow, 70-100% green)
  const getProgressColor = (progress) => {
    if (progress < 20) return '#EF4444'; // Red - Very low
    if (progress < 40) return '#F97316'; // Orange - Low progress
    if (progress < 60) return '#FBBF24'; // Yellow - Getting started
    if (progress < 70) return '#F59E0B'; // Amber - Good progress
    if (progress < 90) return '#22C55E'; // Green - Great progress
    return '#047857'; // Emerald - Excellent progress
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E0F2F1" />

      {/* Top Section: Header & Avatar (60%) */}
      <View style={styles.topSection}>
        {/* Header - AT THE VERY TOP */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{currentIndex + 1} / {sentences.length}</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>



        {/* Hero Avatar - Image or Video */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarGlow}>
            {/* Static Image - always rendered, visible when not playing video */}
            <Animated.Image
              source={selectedAvatar === 'female' ? IMAGES.sualingoWoman : IMAGES.sualingoMan}
              style={[styles.avatar, { opacity: isVideoPlaying ? 0 : 1 }]}
              resizeMode="cover"
            />

            {/* Video - always rendered, visible when playing */}
            <Animated.View style={[styles.avatarVideoContainer, { opacity: isVideoPlaying ? 1 : 0 }]}>
              <Video
                ref={videoRef}
                source={selectedAvatar === 'female' ? IMAGES.sualingoWomanVideo : IMAGES.sualingoManVideo}
                style={styles.avatar}
                resizeMode="cover"
                isLooping={true}
                isMuted={true}
                shouldPlay={false}
              />
            </Animated.View>
          </View>
        </View>
      </View>

      {/* Bottom Section: Interaction (40%) */}
      <View style={styles.bottomSection}>
        {/* Topic Progress Bar - Modern Design */}
        <View style={styles.topicProgressBarWrapper}>
          {topicProgressLoading || !topicProgressData || !topicProgressData.topic_progress ? (
            <ProgressBarSkeleton showLabel={true} showPercentage={true} />
          ) : (
            <>
              <View style={styles.topicProgressHeader}>
                <Text style={styles.topicProgressLabel}>{topicTitle || topic || 'Topic'}</Text>
                <Text style={styles.topicProgressPercent}>{Math.round(topicProgress)}%</Text>
              </View>
              <View style={styles.topicProgressBarContainer}>
                <View style={[
                  styles.topicProgressBarFill,
                  {
                    width: `${topicProgress}%`,
                    backgroundColor: getProgressColor(topicProgress)
                  }
                ]} />
              </View>
            </>
          )}
        </View>

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
                showsHorizontalScrollIndicator={true}
                horizontal={false} // Vertical scroll for wrapping, but allow horizontal if text is too wide
                bounces={true}
              >
                <Text style={styles.sentenceText}>{activeSentence?.sentence}</Text>

                {showTranslation && (
                  <View style={styles.translationContainer}>
                    <View style={styles.divider} />
                    {translating ? (
                      <ActivityIndicator size="small" color="#6B7280" />
                    ) : (
                      <Text style={styles.translationText}>
                        {translation || "Çeviri yükleniyor..."}
                      </Text>
                    )}
                  </View>
                )}
              </ScrollView>
            </View>
            <TouchableOpacity
              style={styles.translationButton}
              hitSlop={{ top: 10, bottom: 10 }}
              onPress={handleToggleTranslation}
              disabled={translating}
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

        {/* Ergonomic Controls */}
        <View style={styles.controlsArea}>
          {/* Reference Audio */}
          <TouchableOpacity
            style={[styles.sideControlButton, (isPlayingRef || isGeneratingTTS) && styles.activeStateButton]}
            onPress={playReference}
            disabled={isRecording || isPlayingRef || isGeneratingTTS}
            activeOpacity={0.7}
          >
            {isGeneratingTTS ? (
              <ActivityIndicator color="#4B5563" size="small" />
            ) : (
              <Ionicons name="volume-medium" size={28} color={isPlayingRef ? "#2D7F83" : "#4B5563"} />
            )}
          </TouchableOpacity>

          {/* Main Record Button with Ripple Animation */}
          <View style={styles.micContainer}>
            {/* Ripple Rings */}
            {[pulseAnim1, pulseAnim2, pulseAnim3].map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.micPulseRing,
                  {
                    transform: [{
                      scale: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.8]
                      })
                    }],
                    opacity: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 0]
                    }),
                  }
                ]}
              />
            ))}

            <TouchableOpacity
              style={[
                styles.mainMicButton,
                isRecording && styles.recordingState
              ]}
              onPress={toggleRecording}
              disabled={processing || isPlayingRef || isGeneratingTTS}
              activeOpacity={0.8}
            >
              {processing ? (
                <ActivityIndicator color="#FFFFFF" size="large" />
              ) : (
                <Ionicons name={isRecording ? "stop" : "mic"} size={44} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>

          {/* User Playback - Only active after recording, disabled here if handled in Modal */}
          {/* Kept for manual check if needed, but Modal is primary flow now */}
          {/* Past Recordings Navigation - Replaces Replay Button */}
          <TouchableOpacity
            style={styles.sideControlButton}
            onPress={() => navigation.navigate('PastRecordingsList', { courseId })}
            activeOpacity={0.7}
          >
            <Ionicons name="list" size={28} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- PRONUNCIATION REPORT MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Do nothing on back button to force user choice, or handleTryAgain
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)} // Optional: click outside to close
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Evaluation Result</Text>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody}>
              {/* Score Indicator */}
              <View style={styles.scoreContainer}>
                <View style={[
                  styles.scoreCircle,
                  { borderColor: evaluation?.score >= 80 ? '#047857' : '#DC2626' }
                ]}>
                  <Text style={[
                    styles.scoreText,
                    { color: evaluation?.score >= 80 ? '#047857' : '#DC2626' }
                  ]}>
                    {evaluation ? Math.round(evaluation.score) : 0}
                  </Text>
                  <Text style={styles.scoreLabel}>Score</Text>
                </View>
              </View>

              {/* Advanced Metrics */}
              <View style={styles.metricsContainer}>
                <View style={styles.metricBox}>
                  <Text style={styles.metricValue}>{evaluation?.accuracy ? Math.round(evaluation.accuracy) : '-'}</Text>
                  <Text style={styles.metricLabel}>Accuracy</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricBox}>
                  <Text style={styles.metricValue}>{evaluation?.fluency ? Math.round(evaluation.fluency) : '-'}</Text>
                  <Text style={styles.metricLabel}>Fluency</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricBox}>
                  <Text style={styles.metricValue}>{evaluation?.completeness ? Math.round(evaluation.completeness) : '-'}</Text>
                  <Text style={styles.metricLabel}>Completeness</Text>
                </View>
              </View>

              {/* Reference */}
              <View style={styles.resultSection}>
                <Text style={styles.sectionLabel}>Reference:</Text>
                <Text style={styles.modalReferenceText}>{activeSentence?.sentence}</Text>
              </View>

              {/* Play User Audio */}
              {recordingUri && (
                <TouchableOpacity
                  style={[styles.playUserAudioButton, isPlayingUser && styles.playingButton]}
                  onPress={async () => {
                    setIsPlayingUser(true);
                    await playAudio(recordingUri, () => {
                      setIsPlayingUser(false);
                    });
                  }}
                  disabled={isPlayingUser}
                  activeOpacity={0.7}
                >
                  {isPlayingUser ? (
                    <View style={styles.playbackAnimationContainer}>
                      <View style={styles.waveformContainer}>
                        {[playbackWaveAnim1, playbackWaveAnim2, playbackWaveAnim3, playbackWaveAnim2, playbackWaveAnim1].map((anim, index) => {
                          const scaleY = anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [8 / 24, 1] // Scale from 8/24 to 1 (8px to 24px)
                          });
                          const opacity = anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.4, 1]
                          });
                          return (
                            <Animated.View
                              key={index}
                              style={[
                                styles.waveBar,
                                {
                                  transform: [{ scaleY }],
                                  opacity: opacity
                                }
                              ]}
                            />
                          );
                        })}
                      </View>
                      <Text style={styles.playUserAudioText}>Playing...</Text>
                    </View>
                  ) : (
                    <>
                      <Ionicons name="play-circle" size={24} color="#4F46E5" />
                      <Text style={styles.playUserAudioText}>Listen to My Recording</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              {/* Word Details Toggle */}
              <TouchableOpacity
                style={styles.detailsToggle}
                onPress={() => setShowDetails(!showDetails)}
              >
                <Text style={styles.detailsToggleText}>
                  {showDetails ? "Hide Word Details" : "Show Word Details"}
                </Text>
                <Ionicons name={showDetails ? "chevron-up" : "chevron-down"} size={16} color="#4B5563" />
              </TouchableOpacity>

              {/* Detailed Breakdown */}
              {showDetails && (
                <View style={[styles.resultSection, { marginTop: 10 }]}>
                  <Text style={styles.sectionLabel}>Word Feedback:</Text>
                  {renderWordFeedback(evaluation?.transcript || "No transcript available", evaluation?.words)}
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={handleTryAgain}
              >
                <Ionicons name="refresh" size={20} color="#4B5563" style={{ marginRight: 8 }} />
                <Text style={styles.secondaryButtonText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={handleNext}
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    flex: 0.4, // Reduced to 40% to give more space to bottom
    alignItems: 'center',
    justifyContent: 'flex-start', // Align to top
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    backgroundColor: '#E0F2F1', // Light teal background
    position: 'relative',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10, // Reduced margin
    zIndex: 10,
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D7F83',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10, // Reduced top margin
    marginBottom: 0,
    zIndex: 5,
  },
  avatarGlow: {
    width: 170, // Slightly smaller avatar to fit space
    height: 170,
    borderRadius: 85,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D7F83',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  avatarVideoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 170,
    height: 170,
    borderRadius: 85,
    overflow: 'hidden',
  },
  avatar: {
    width: 170,
    height: 170,
    borderRadius: 85,
  },

  // --- BOTTOM SECTION ---
  bottomSection: {
    flex: 0.6, // Increased to 60%
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
    justifyContent: 'space-between', // Keep buttons at bottom, content at top
  },
  // Card
  cardArea: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align to top
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 0,
    marginBottom: 10,
    marginTop: 10, // Add explicit top margin
    flex: 1, // Let card take available space
  },
  navArrow: {
    padding: 8,
    marginTop: 20, // Push arrow down slightly to align with text center roughly
  },
  sentenceCard: {
    flex: 1,
    paddingVertical: 10, // Reduced vertical padding
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-start', // Align content to top
    minHeight: 100,
    marginBottom: 'auto', // Push to top
  },
  sentenceContent: {
    width: '100%',
  },
  sentenceScrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    paddingHorizontal: 8, // Additional padding for horizontal scroll
  },
  sentenceText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 30,
    paddingHorizontal: 4, // Allow text to scroll horizontally if needed
  },
  translationButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
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
    width: '60%',
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
  },
  translationText: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },

  // Controls
  controlsArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingBottom: Platform.OS === 'ios' ? 0 : 10, // Adjusted for safe area
    marginTop: 0,
    marginBottom: 20, // Add margin from bottom
  },
  sideControlButton: {
    width: 60, // Slightly larger
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStateButton: {
    backgroundColor: '#E6FFFA',
    borderWidth: 1,
    borderColor: '#2D7F83',
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
    marginTop: -40, // Push up slightly to break boundary if needed, or keeping inline
  },
  micPulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2D7F83',
  },
  mainMicButton: {
    width: 88, // Slightly Adjusted
    height: 88,
    borderRadius: 44,
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
  },

  // --- MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent', // No dimming as requested
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)', // Very subtle touch protection, or completely transparent
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '80%',
    paddingBottom: 40,
    // Floating Card Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalBody: {
    alignItems: 'center',
  },
  scoreContainer: {
    marginBottom: 24,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  resultSection: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
  },
  // New Styles for Metrics
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  metricBox: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  // Play User Audio
  playUserAudioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  playingButton: {
    backgroundColor: '#E0E7FF',
    borderColor: '#4F46E5',
  },
  playUserAudioText: {
    marginLeft: 8,
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 14,
  },
  // Details Toggle
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 8,
  },
  detailsToggleText: {
    marginRight: 4,
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  modalReferenceText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  wordCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordFeedback: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 16,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },
  primaryButton: {
    backgroundColor: '#2D7F83',
    shadowColor: '#2D7F83',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 16,
  },
  // Word Details
  wordDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 10,
  },
  wordDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  wordDetailText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  wordScoreBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  wordScoreText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Topic Progress Bar
  // Topic Progress Bar
  topicProgressBarWrapper: {
    width: '100%',
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  topicProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  topicProgressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  topicProgressPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  topicProgressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  topicProgressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  // Playback Animation Styles
  playbackAnimationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 24,
  },
  waveBar: {
    width: 3,
    height: 24, // Fixed height, will be scaled via transform
    backgroundColor: '#4F46E5',
    borderRadius: 2,
  },
});

export default CoursePracticeScreen;
