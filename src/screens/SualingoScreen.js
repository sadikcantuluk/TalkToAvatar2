import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, IMAGES } from '../constants';
import { DashboardLayout, LanguageSelector, VoiceSelector, PronunciationResult } from '../components';
import {
  generateTextToSpeech,
  playAudio,
  stopAudio,
  startRecording,
  stopRecording,
  transcribeAudio,
  translateText,
} from '../services/openAI';
import { useAuth, useToast } from '../context';
import recordingsAPI from '../services/recordingsAPI';
import { getUserStorageKey } from '../utils/userStorage';
import { evaluatePronunciationWithFile } from '../services/railsAPI';
import practiceSentencesAPI from '../services/practiceSentencesAPI';
import userCourseProgressAPI from '../services/userCourseProgressAPI';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Success threshold for course completion
const SUCCESS_THRESHOLD = 85;

// Dil seviyeleri
const LANGUAGE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// Base English sentences (will be translated to other languages)
const BASE_SENTENCES = {
  'A1': [
    'Hello, my name is John.',
    'I like coffee.',
    'This is my friend.',
    'Where is the library?',
    'Good morning!',
    'How are you?',
    'I am fine, thank you.',
    'What is your name?',
    'Nice to meet you.',
    'See you later.',
  ],
  'A2': [
    'I would like a cup of coffee, please.',
    'Can you help me find the train station?',
    'What time does the meeting start?',
    'I enjoy reading books in my free time.',
    'The weather is beautiful today.',
    'I went to the cinema yesterday.',
    'Could you speak more slowly, please?',
    'I usually wake up at seven o\'clock.',
    'I need to buy some groceries.',
    'The movie was really interesting.',
  ],
  'B1': [
    'I have been learning English for three years.',
    'Could you explain that concept in more detail?',
    'I am looking forward to visiting your country.',
    'In my opinion, technology has changed our lives significantly.',
    'I would appreciate it if you could help me with this task.',
    'Despite the bad weather, we decided to go hiking.',
    'The book that I bought yesterday is fascinating.',
    'If I had more time, I would travel around the world.',
    'It\'s important to maintain a healthy lifestyle.',
    'I wish I could speak more languages.',
  ],
  'B2': [
    'The ongoing debate about climate change requires immediate attention.',
    'I have always been passionate about environmental conservation.',
    'It is essential to consider multiple perspectives before making a decision.',
    'The company has implemented several innovative strategies this year.',
    'Understanding cultural differences is crucial in global business.',
    'The research findings suggest a strong correlation between these factors.',
    'The government\'s new policy has sparked considerable controversy.',
    'We need to address these issues systematically.',
    'Technology has revolutionized the way we communicate.',
    'The situation requires careful consideration and strategic planning.',
  ],
  'C1': [
    'The complexity of the situation necessitates a comprehensive approach.',
    'Her eloquent presentation captivated the entire audience.',
    'The ramifications of this policy extend far beyond initial expectations.',
    'His nuanced understanding of the subject matter was evident throughout the discussion.',
    'The paradigm shift in contemporary education demands innovative methodologies.',
    'The intricate relationship between these variables warrants further investigation.',
    'Her contributions to the field have been groundbreaking and influential.',
    'The prevailing consensus among experts supports this hypothesis.',
    'The convergence of these factors has created unprecedented opportunities.',
    'His analysis revealed previously overlooked dimensions of the issue.',
  ],
  'C2': [
    'The quintessential manifestation of postmodern literature exemplifies linguistic virtuosity.',
    'Epistemological considerations underpin the fundamental premises of empirical research.',
    'The juxtaposition of divergent theoretical frameworks elucidates intricate conceptual relationships.',
    'Her erudite discourse on phenomenology transcended conventional academic boundaries.',
    'The multifaceted implications of globalization permeate every stratum of contemporary society.',
    'The dialectical approach to historiography reveals inherent contradictions in prevailing narratives.',
    'The phenomenological investigation of consciousness yields profound insights into human existence.',
    'The ontological implications of quantum mechanics continue to perplex theoretical physicists.',
    'Her comprehensive synthesis of disparate theories demonstrated remarkable intellectual acuity.',
    'The inexorable march of technological advancement poses unprecedented existential questions.',
  ],
};

const SualingoScreen = ({ navigation, route }) => {
  const { token, user } = useAuth();
  const { success, error: showError } = useToast();
  
  const [selectedAvatar, setSelectedAvatar] = useState({
    name: 'Yusuf',
    image: IMAGES.yusuf,
  });

  // Display mode (gif or avatar)
  const [selectedDisplayMode, setSelectedDisplayMode] = useState('gif');
  const [selectedGif, setSelectedGif] = useState({
    name: 'Man',
    image: IMAGES.manGif,
  });
  const [gifKey, setGifKey] = useState(Date.now());

  // Seviye ve cümle yönetimi
  const [selectedLevel, setSelectedLevel] = useState('A1'); // Default A1
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isLoadingSentences, setIsLoadingSentences] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  // Ses ve dil
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  

  // Kayıt ve oynatma
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
  const levelScrollRef = useRef(null);

  // Avatar animation
  const avatarScale = useRef(new Animated.Value(1)).current;
  const avatarOpacity = useRef(new Animated.Value(1)).current;
  const pulseAnimationRef = useRef(null);

  // Course context from navigation
  const courseContext = route?.params?.fromCourse ? {
    courseId: route.params.courseId,
    course: route.params.course,
    topic: route.params.topic,
    topicTitle: route.params.topicTitle,
  } : null;

  useEffect(() => {
    // If coming from course, load course sentences
    if (courseContext) {
      console.log('📚 [DEBUG] Loading course practice sentences:', courseContext);
      setSelectedLanguage(courseContext.course?.language_code || 'en');
      setSelectedLevel(courseContext.course?.level || 'A1');
      fetchCourseSentences();
    } else {
      // Auto-load A1 sentences on mount
      handleLevelSelect('A1');
    }
    
    return () => {
      stopAudio();
    };
  }, []);

  // Update avatar when route params change
  useEffect(() => {
    if (route?.params?.selectedAvatar) {
      setSelectedAvatar(route.params.selectedAvatar);
      setSelectedDisplayMode('avatar');
    }
  }, [route?.params?.selectedAvatar]);

  // Reset reference audio when parameters change
  useEffect(() => {
    console.log('🔄 [DEBUG] Parameters changed, resetting reference audio...');
    setReferenceAudioUri(null);
    setIsPlayingReference(false);
  }, [selectedLanguage, selectedVoice, currentSentenceIndex]);

  // Avatar animation when playing
  useEffect(() => {
    if ((isPlayingReference || isPlayingUser) && selectedDisplayMode === 'avatar') {
      pulseAnimationRef.current = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(avatarScale, {
              toValue: 1.05,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(avatarOpacity, {
              toValue: 0.85,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(avatarScale, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(avatarOpacity, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      pulseAnimationRef.current.start();
    } else {
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
        pulseAnimationRef.current = null;
      }
      Animated.parallel([
        Animated.timing(avatarScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(avatarOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isPlayingReference, isPlayingUser, selectedDisplayMode]);

  // Handle language change - translate sentences (only if not in course context)
  useEffect(() => {
    if (courseContext) {
      // Don't translate if in course context
      return;
    }
    
    if (selectedLevel && selectedLanguage !== 'en') {
      translateSentences();
    } else if (selectedLevel && selectedLanguage === 'en') {
      // Load English sentences directly
      setSentences(BASE_SENTENCES[selectedLevel] || []);
    }
  }, [selectedLanguage]);

  // Fetch course practice sentences
  const fetchCourseSentences = async () => {
    if (!courseContext || !courseContext.courseId || !courseContext.topic) {
      console.error('❌ [ERROR] Missing course context');
      return;
    }

    try {
      console.log('📚 [DEBUG] Fetching course practice sentences...');
      setIsLoadingSentences(true);
      
      const data = await practiceSentencesAPI.getByCourse(
        token,
        courseContext.courseId,
        courseContext.topic
      );
      
      console.log('✅ [DEBUG] Fetched course sentences:', data.length);
      
      // Keep sentence objects (with id) for progress tracking
      setSentences(data);
      setCurrentSentenceIndex(0);
    } catch (err) {
      console.error('❌ [ERROR] Failed to fetch course sentences:', err);
      showError('Failed to load practice sentences');
      setSentences([]);
    } finally {
      setIsLoadingSentences(false);
    }
  };

  const fetchSentencesFromBackend = async (level, languageCode) => {
    try {
      console.log('🔄 [DEBUG] Fetching sentences from backend...');
      console.log('📊 [DEBUG] Parameters:', { level, languageCode });
      
      const url = `http://192.168.1.37:3000/api/v1/sentences?level=${level}&language=${languageCode}`;
      console.log('🌐 [DEBUG] Request URL:', url);
      
      const response = await fetch(url);

      console.log('📡 [DEBUG] Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📦 [DEBUG] Response data:', JSON.stringify(data).substring(0, 200));
        console.log('📊 [DEBUG] Fetched sentences count:', data.length);
        
        if (data.length > 0) {
          const sentences = data.map(item => item.text || item.sentence);
          console.log('✅ [SUCCESS] Sentences fetched from backend:', sentences.length);
          console.log('📝 [DEBUG] First sentence:', sentences[0]);
          return { success: true, sentences };
        } else {
          console.log('⚠️ [INFO] No sentences found in backend for this level/language');
          return { success: false, sentences: [] };
        }
      } else {
        const errorText = await response.text();
        console.error('❌ [ERROR] Backend returned error status:', response.status);
        console.error('❌ [ERROR] Response body:', errorText);
        return { success: false, sentences: [] };
      }
    } catch (error) {
      console.error('❌ [ERROR] Failed to fetch from backend:', error);
      console.error('❌ [ERROR] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return { success: false, sentences: [] };
    }
  };

  const translateSentences = async () => {
    try {
      console.log('=== Loading Sentences ===');
      console.log('🌍 [DEBUG] Target language:', selectedLanguage);
      console.log('📚 [DEBUG] Selected level:', selectedLevel);
      setIsTranslating(true);

      // First, try to fetch from backend
      console.log('🔍 [DEBUG] Checking backend for existing translations...');
      const backendResult = await fetchSentencesFromBackend(selectedLevel, selectedLanguage);
      
      if (backendResult.success && backendResult.sentences.length > 0) {
        console.log('✅ [SUCCESS] Using sentences from backend (no translation needed)');
        console.log(`📊 [STATS] Loaded ${backendResult.sentences.length} sentences from database`);
        setSentences(backendResult.sentences);
      } else {
        console.log('⚠️ [INFO] Sentences not found in backend, will translate...');
      const englishSentences = BASE_SENTENCES[selectedLevel] || [];
        console.log('📝 [DEBUG] Number of sentences to translate:', englishSentences.length);
      const translatedSentences = [];

        for (let i = 0; i < englishSentences.length; i++) {
          const sentence = englishSentences[i];
          console.log(`🔄 [DEBUG] Translating sentence ${i + 1}/${englishSentences.length}...`);
          
        const result = await translateText(sentence, selectedLanguage);
        if (result.success) {
          translatedSentences.push(result.translatedText);
            console.log(`✅ [DEBUG] Translation successful: ${result.translatedText.substring(0, 50)}...`);
        } else {
            console.warn(`⚠️ [DEBUG] Translation failed for sentence ${i + 1}, using English fallback`);
          translatedSentences.push(sentence);
        }
      }

      setSentences(translatedSentences);
        console.log('✅ [SUCCESS] Translation complete');
        console.log(`📊 [STATS] Translated: ${translatedSentences.length} sentences`);
      }
    } catch (error) {
      console.error('❌ [ERROR] Error loading sentences:', error);
      console.error('❌ [ERROR] Error stack:', error.stack);
      // Fallback to English
      setSentences(BASE_SENTENCES[selectedLevel] || []);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLevelSelect = async (level) => {
    console.log('=== Level Selected ===');
    console.log('📚 [DEBUG] Level:', level);
    console.log('🌍 [DEBUG] Current language:', selectedLanguage);
    setSelectedLevel(level);
    setCurrentSentenceIndex(0);
    setReferenceAudioUri(null);
    setUserAudioUri(null);
    setUserTranscript('');
    setPronunciationScore(null);

    setIsLoadingSentences(true);
    
    // If language is English, use base sentences directly
    if (selectedLanguage === 'en') {
      console.log('✅ [DEBUG] Using English base sentences (no translation needed)');
      setSentences(BASE_SENTENCES[level] || []);
      setIsLoadingSentences(false);
    } else {
      // Try to fetch from backend first, then translate if needed
      try {
        console.log('🔍 [DEBUG] Checking backend for existing translations...');
        const backendResult = await fetchSentencesFromBackend(level, selectedLanguage);
        
        if (backendResult.success && backendResult.sentences.length > 0) {
          console.log('✅ [SUCCESS] Using sentences from backend');
          console.log(`📊 [STATS] Loaded ${backendResult.sentences.length} sentences from database`);
          setSentences(backendResult.sentences);
        } else {
          console.log('⚠️ [INFO] Sentences not found in backend, translating...');
        const englishSentences = BASE_SENTENCES[level] || [];
          console.log(`🔄 [DEBUG] Starting translation of ${englishSentences.length} sentences...`);
        const translatedSentences = [];

          for (let i = 0; i < englishSentences.length; i++) {
            const sentence = englishSentences[i];
            console.log(`🔄 [DEBUG] Translating ${i + 1}/${englishSentences.length}: ${sentence.substring(0, 30)}...`);
            
          const result = await translateText(sentence, selectedLanguage);
          if (result.success) {
            translatedSentences.push(result.translatedText);
              console.log(`✅ [DEBUG] Translated: ${result.translatedText.substring(0, 30)}...`);
          } else {
              console.warn(`⚠️ [DEBUG] Translation failed for sentence ${i + 1}, using fallback`);
            translatedSentences.push(sentence);
          }
        }

        setSentences(translatedSentences);
          console.log(`✅ [SUCCESS] Translation complete: ${translatedSentences.length} sentences`);
        }
      } catch (error) {
        console.error('❌ [ERROR] Error loading sentences:', error);
        console.error('❌ [ERROR] Error details:', { name: error.name, message: error.message, stack: error.stack });
        setSentences(BASE_SENTENCES[level] || []);
      } finally {
        setIsLoadingSentences(false);
      }
    }
  };

  const getCurrentSentence = () => {
    if (!sentences || sentences.length === 0) return null;
    const sentence = sentences[currentSentenceIndex];
    // If in course context, sentences are objects with id, otherwise strings
    if (courseContext && typeof sentence === 'object') {
      return sentence;
    }
    return typeof sentence === 'string' ? sentence : (sentence?.sentence || sentence?.text || sentence);
  };

  // Save user progress for course practice
  const saveUserProgress = async (sentenceId, evaluationResult) => {
    console.log('🎯 [DEBUG] saveUserProgress called');
    console.log('📊 [DEBUG] Parameters:', {
      sentenceId,
      hasCourseContext: !!courseContext,
      courseId: courseContext?.courseId,
      evaluationResult: {
        score: evaluationResult.score,
        accuracy: evaluationResult.accuracy_score,
        fluency: evaluationResult.fluency_score,
        completeness: evaluationResult.completeness_score
      }
    });

    if (!courseContext || !courseContext.courseId || !sentenceId) {
      console.log('⚠️ [DEBUG] Missing context for progress save:', {
        hasCourseContext: !!courseContext,
        courseId: courseContext?.courseId,
        sentenceId: sentenceId
      });
      return;
    }

    try {
      console.log('📊 [DEBUG] Saving user progress for sentence:', sentenceId);
      console.log('📊 [DEBUG] Course ID:', courseContext.courseId);
      console.log('📊 [DEBUG] Evaluation result:', {
        score: evaluationResult.score,
        accuracy_score: evaluationResult.accuracy_score,
        fluency_score: evaluationResult.fluency_score,
        completeness_score: evaluationResult.completeness_score
      });
      
      const isCompleted = evaluationResult.score >= SUCCESS_THRESHOLD;
      console.log('📊 [DEBUG] Completion status:', isCompleted, `(score >= ${SUCCESS_THRESHOLD})`);
      
      const progressData = {
        course_id: courseContext.courseId,
        practice_sentence_id: sentenceId,  // ✅ Correct parameter name
        completed: isCompleted,
        score: evaluationResult.score,
        // Note: accuracy_score, fluency_score, completeness_score are not in database schema
        // Note: last_practiced_at is automatically updated by model callback
      };

      console.log('📤 [DEBUG] Progress data to send:', progressData);

      // Try to update existing progress, or create new
      console.log('🔍 [DEBUG] Checking for existing progress...');
      const existingProgress = await userCourseProgressAPI.getAll(token, {
        course_id: courseContext.courseId,
        practice_sentence_id: sentenceId,  // ✅ Correct parameter name
      });

      console.log('📊 [DEBUG] Existing progress found:', existingProgress?.length || 0);
      if (existingProgress && existingProgress.length > 0) {
        console.log('📊 [DEBUG] Existing progress details:', existingProgress[0]);
      }

      if (existingProgress && existingProgress.length > 0) {
        // Update existing
        const progressId = existingProgress[0].id || existingProgress[0].sentence_id;
        console.log('🔄 [DEBUG] Updating existing progress:', progressId);
        console.log('📊 [DEBUG] Current progress state:', existingProgress[0]);
        
        const response = await userCourseProgressAPI.update(token, progressId, progressData);
        console.log('✅ [DEBUG] Updated user progress:', response);
      } else {
        // Create new
        console.log('➕ [DEBUG] Creating new progress record');
        const response = await userCourseProgressAPI.create(token, progressData);
        console.log('✅ [DEBUG] Created user progress:', response);
      }
    } catch (err) {
      console.error('❌ [ERROR] Failed to save user progress:', err);
      console.error('❌ [ERROR] Error details:', {
        message: err.message,
        response: err.response,
        data: err.response?.data,
        status: err.response?.status
      });
      // Don't show error to user, progress saving is non-critical
    }
  };

  const handlePlayReference = async () => {
    const sentenceObj = getCurrentSentence();
    if (!sentenceObj) {
      Alert.alert('Error', 'No sentence selected');
      return;
    }
    
    // Get sentence text (handle both string and object)
    const sentence = typeof sentenceObj === 'string' 
      ? sentenceObj 
      : (sentenceObj.sentence || sentenceObj.text || '');
    
    if (!sentence) {
      Alert.alert('Error', 'No sentence text available');
      return;
    }

    try {
      // If audio is playing, stop it
      if (isPlayingReference) {
        await stopAudio();
        setIsPlayingReference(false);
        return;
      }

      console.log('=== Playing Reference Audio ===');
      console.log('Sentence:', sentence);

      // If audio doesn't exist, generate it
      if (!referenceAudioUri) {
        console.log('🎵 [DEBUG] Creating reference audio...');
        setIsGeneratingAudio(true);
        
        // Skip translation because sentence is already translated to selectedLanguage
        const result = await generateTextToSpeech(sentence, selectedVoice, selectedLanguage, true);
        
        setIsGeneratingAudio(false);
        
        if (result.success) {
          console.log('✅ [DEBUG] Audio generated successfully');
          setReferenceAudioUri(result.audioUri);
          setIsPlayingReference(true);
          
          // Restart GIF if in GIF mode
          if (selectedDisplayMode === 'gif') {
            setGifKey(Date.now());
          }
          
          await playAudio(result.audioUri, () => {
            setIsPlayingReference(false);
          });
        } else {
          throw new Error(result.error);
        }
      } else {
        // Audio exists, just play it
        console.log('▶️ [DEBUG] Playing existing audio');
        setIsPlayingReference(true);
        
        if (selectedDisplayMode === 'gif') {
          setGifKey(Date.now());
        }
        
        await playAudio(referenceAudioUri, () => {
          setIsPlayingReference(false);
        });
      }
    } catch (error) {
      console.error('❌ [ERROR] Play reference error:', error);
      setIsPlayingReference(false);
      setIsGeneratingAudio(false);
      Alert.alert('Error', 'Failed to play reference audio');
    }
  };

  const handleRecordUser = async () => {
    const sentenceObj = getCurrentSentence();
    if (!sentenceObj) {
      Alert.alert('Error', 'No sentence selected');
      return;
    }
    
    // Get sentence text (handle both string and object)
    const sentence = typeof sentenceObj === 'string' 
      ? sentenceObj 
      : (sentenceObj.sentence || sentenceObj.text || '');
    
    if (!sentence) {
      Alert.alert('Error', 'No sentence text available');
      return;
    }

    try {
      if (isRecording) {
        console.log('Stopping user recording...');
        setIsRecording(false);
        
        if (recordingRef.current) {
          const result = await stopRecording(recordingRef.current);
          
          if (result.success) {
            setUserAudioUri(result.uri);
            console.log('Recording saved:', result.uri);
            
            await evaluatePronunciation(result.uri, sentence);
          }
          
          recordingRef.current = null;
        }
      } else {
        console.log('Starting user recording...');
        const result = await startRecording();
        
        if (result.success) {
          recordingRef.current = result.recording;
          setIsRecording(true);
          setUserTranscript('');
          setPronunciationScore(null);
        } else {
          Alert.alert('Error', 'Failed to start recording. Please grant microphone permission.');
        }
      }
    } catch (error) {
      console.error('Record user error:', error);
      setIsRecording(false);
      recordingRef.current = null;
      Alert.alert('Error', 'Microphone error. Please try again.');
    }
  };

  const evaluatePronunciation = async (audioUri, referenceSentence) => {
    try {
      console.log('=== Evaluating Pronunciation with Azure Speech API ===');
      setIsEvaluating(true);

      // Send audio file directly to backend (no Supabase upload needed)
      console.log('Sending audio file directly to backend...');
      
      // Create FormData with the audio file
      const formData = new FormData();
      formData.append('audio_file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: `recording_${Date.now()}.m4a`,
      });
      formData.append('reference_text', referenceSentence);
      formData.append('language_code', selectedLanguage);

      // Call evaluate endpoint with file
      const evaluationResult = await evaluatePronunciationWithFile(
        formData,
        referenceSentence,
        selectedLanguage
      );
      
      if (evaluationResult.success) {
        const userText = evaluationResult.transcript;
        setUserTranscript(userText);
        
        console.log('Reference:', referenceSentence);
        console.log('User said:', userText);
        console.log('Language:', selectedLanguage);
        console.log('Overall Score:', evaluationResult.score);
        console.log('Accuracy:', evaluationResult.accuracy_score);
        console.log('Fluency:', evaluationResult.fluency_score);
        console.log('Completeness:', evaluationResult.completeness_score);

        // Store detailed scoring information
        setPronunciationScore({
          score: evaluationResult.score,
          accuracy_score: evaluationResult.accuracy_score,
          fluency_score: evaluationResult.fluency_score,
          completeness_score: evaluationResult.completeness_score,
          feedback: evaluationResult.feedback,
          original: referenceSentence,
          userText: userText,
          word_level_details: evaluationResult.word_level_details || [],
          detailed_scores: evaluationResult.detailed_scores,
        });

        // Get current sentence object for progress tracking
        const currentSentenceObj = getCurrentSentence();
        
        await saveRecordingToHistory({
          level: selectedLevel,
          sentence: referenceSentence,
          userTranscript: userText,
          pronunciationScore: evaluationResult.score,
          accuracyScore: evaluationResult.accuracy_score,
          fluencyScore: evaluationResult.fluency_score,
          completenessScore: evaluationResult.completeness_score,
          wordLevelDetails: evaluationResult.word_level_details || evaluationResult.words || [],
          userAudioUri: audioUri, // Use local URI instead of uploaded URL
          referenceAudioUri: referenceAudioUri,
          language: selectedLanguage,
          voice: selectedVoice,
          courseId: courseContext?.courseId,
          course: courseContext?.course,
          topic: courseContext?.topic,
          practiceSentenceId: currentSentenceObj?.id, // If sentence has id from API
        });

        // Save user progress if in course context
        if (courseContext && currentSentenceObj?.id) {
          await saveUserProgress(currentSentenceObj.id, evaluationResult);
        }

        console.log('Evaluation complete. Overall Score:', evaluationResult.score);
      } else {
        Alert.alert('Error', evaluationResult.error || 'Failed to evaluate pronunciation');
      }
    } catch (error) {
      console.error('Evaluation error:', error);
      Alert.alert('Error', 'Failed to evaluate pronunciation. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const calculateSimilarityScore = (reference, user) => {
    const ref = reference.toLowerCase().trim();
    const usr = user.toLowerCase().trim();

    if (ref === usr) return 100;

    const refWords = ref.split(/\s+/);
    const usrWords = usr.split(/\s+/);

    let matchingWords = 0;
    refWords.forEach(refWord => {
      if (usrWords.some(usrWord => usrWord === refWord || 
          levenshteinDistance(refWord, usrWord) <= 1)) {
        matchingWords++;
      }
    });

    const wordScore = (matchingWords / refWords.length) * 100;
    const charScore = (1 - (levenshteinDistance(ref, usr) / Math.max(ref.length, usr.length))) * 100;

    return Math.round((wordScore * 0.7 + charScore * 0.3));
  };

  const levenshteinDistance = (str1, str2) => {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  const generateFeedback = (score, reference, userText) => {
    if (score >= 95) {
      return 'Excellent! Your pronunciation is nearly perfect.';
    } else if (score >= 85) {
      return 'Great job! Your pronunciation is very clear with minor improvements needed.';
    } else if (score >= 70) {
      return 'Good effort! Your pronunciation is understandable, but practice some words.';
    } else if (score >= 50) {
      return 'Keep practicing! Focus on pronunciation of key words.';
    } else {
      return 'More practice needed. Try listening to the reference audio again.';
    }
  };

  const saveRecordingToHistory = async (recordingData) => {
    if (!user?.id) {
      showError('User not authenticated');
      return;
    }
    
    try {
      console.log('=== Saving Recording to History ===');
      const key = getUserStorageKey('@sualingo_recordings_history', user.id);
      
      const saved = await AsyncStorage.getItem(key);
      const history = saved ? JSON.parse(saved) : [];
      
      const date = new Date();
      const dateStr = date.toISOString().split('T')[0];
      const count = history.filter(r => r.level === recordingData.level).length + 1;
      const autoName = `Level_${recordingData.level}_${dateStr}_#${String(count).padStart(3, '0')}`;

      const newRecording = {
        id: Date.now().toString(),
        name: autoName,
        ...recordingData,
        createdAt: date.toISOString(),
      };
      
      // Save to local AsyncStorage (fast)
      const newHistory = [newRecording, ...history];
      await AsyncStorage.setItem(key, JSON.stringify(newHistory));
      console.log('✅ Recording saved to AsyncStorage. Total recordings:', newHistory.length);
      
      // Show success toast immediately
      success('Recording saved successfully!');
      
      // Save to backend asynchronously (non-blocking)
      if (token && user) {
        Promise.resolve().then(async () => {
          try {
            console.log('📤 Saving recording to backend (background)...');
            
            const backendData = {
              level: recordingData.level,
              sentence: recordingData.sentence,
              user_audio_uri: recordingData.userAudioUri,
              reference_audio_uri: recordingData.referenceAudioUri,
              user_transcript: recordingData.userTranscript,
              pronunciation_score: recordingData.pronunciationScore,
              accuracy_score: recordingData.accuracyScore,
              fluency_score: recordingData.fluencyScore,
              completeness_score: recordingData.completenessScore,
              word_level_details: recordingData.wordLevelDetails || [],
              language_code: selectedLanguage,
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

  const handleNavigateSentence = (direction) => {
    if (!sentences || sentences.length === 0) return;

    let newIndex = currentSentenceIndex;
    
    if (direction === 'prev' && currentSentenceIndex > 0) {
      newIndex = currentSentenceIndex - 1;
    } else if (direction === 'next' && currentSentenceIndex < sentences.length - 1) {
      newIndex = currentSentenceIndex + 1;
    }

    if (newIndex !== currentSentenceIndex) {
      setCurrentSentenceIndex(newIndex);
      setReferenceAudioUri(null);
      setUserAudioUri(null);
      setUserTranscript('');
      setPronunciationScore(null);
      stopAudio();
      setIsPlayingReference(false);
      setIsPlayingUser(false);
    }
  };

  const handleModeChange = (mode) => {
    if (mode === 'tts') {
      navigation.navigate('Dashboard');
    } else if (mode === 'video') {
      navigation.navigate('AvatarToVideo');
    } else if (mode === 'travel') {
      navigation.navigate('TravelAssistant');
    }
  };

  const handleAvatarSelect = () => {
    navigation.navigate('SelectAvatar', { returnScreen: 'Sualingo' });
  };

  const handleGifSelect = () => {
    Alert.alert(
      'Select GIF',
      'Choose a GIF animation:',
      [
        {
          text: 'Woman',
          onPress: () => {
            console.log('=== Selected Woman GIF ===');
            setSelectedGif({
              name: 'Woman',
              image: IMAGES.womanGif,
            });
            setSelectedDisplayMode('gif');
            if (isPlayingReference || isPlayingUser) {
              stopAudio();
              setIsPlayingReference(false);
              setIsPlayingUser(false);
            }
          },
        },
        {
          text: 'Man',
          onPress: () => {
            console.log('=== Selected Man GIF ===');
            setSelectedGif({
              name: 'Man',
              image: IMAGES.manGif,
            });
            setSelectedDisplayMode('gif');
            if (isPlayingReference || isPlayingUser) {
              stopAudio();
              setIsPlayingReference(false);
              setIsPlayingUser(false);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handlePastRecordings = () => {
    navigation.navigate('PastRecordingsList');
  };

  const handleCourses = () => {
    navigation.navigate('Courses');
  };

  const handlePlayUserRecording = async () => {
    if (!userAudioUri) {
      Alert.alert('Error', 'No user recording available');
      return;
    }

    try {
      if (isPlayingUser) {
        await stopAudio();
        setIsPlayingUser(false);
      } else {
        setIsPlayingUser(true);
        
        if (selectedDisplayMode === 'gif') {
          setGifKey(Date.now());
        }
        
        await playAudio(userAudioUri, () => {
          setIsPlayingUser(false);
        });
      }
    } catch (error) {
      console.error('Play user recording error:', error);
      setIsPlayingUser(false);
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  const currentSentenceObj = getCurrentSentence();
  const currentSentence = typeof currentSentenceObj === 'string' 
    ? currentSentenceObj 
    : (currentSentenceObj?.sentence || currentSentenceObj?.text || '');

  return (
    <DashboardLayout 
      currentMode="sualingo" 
      onModeChange={handleModeChange}
      navigation={navigation}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Context Header */}
        {courseContext && (
          <View style={styles.courseContextHeader}>
            <View style={styles.courseContextBadge}>
              <TouchableOpacity
                style={styles.courseContextClickable}
                onPress={() => {
                  if (courseContext.courseId && courseContext.course) {
                    navigation.navigate('CourseDetail', {
                      courseId: courseContext.courseId,
                      course: courseContext.course,
                    });
                  }
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="book" size={16} color={COLORS.primary} />
                <Text style={styles.courseContextText}>
                  {courseContext.course?.title}
                </Text>
                <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
              </TouchableOpacity>
              <View style={styles.topicBadgeInline}>
                <Text style={styles.topicBadgeTextInline}>• {courseContext.topicTitle}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Language Level Selection - Horizontal Scroll (hidden in course context) */}
        {!courseContext && (
          <View style={styles.levelSection}>
            <Text style={styles.sectionLabel}>Select Your Level</Text>
            <ScrollView
              ref={levelScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.levelButtonsScroll}
            >
              {LANGUAGE_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.levelButton,
                    selectedLevel === level && styles.levelButtonActive,
                  ]}
                  onPress={() => handleLevelSelect(level)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.levelButtonText,
                      selectedLevel === level && styles.levelButtonTextActive,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Voice and Language Selection (language disabled in course context) */}
        <View style={styles.selectionSection}>
          <View style={styles.selectionRow}>
            <View style={styles.selectionItem}>
              <Text style={styles.selectionLabel}>Voice</Text>
              <VoiceSelector
                selectedVoice={selectedVoice}
                onVoiceChange={setSelectedVoice}
              />
            </View>

            {!courseContext && (
              <View style={styles.selectionItem}>
                <Text style={styles.selectionLabel}>Language</Text>
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                  showFlag={false}
                />
              </View>
            )}
            {courseContext && (
              <View style={styles.selectionItem}>
                <Text style={styles.selectionLabel}>Language</Text>
                <View style={styles.languageDisplay}>
                  <Text style={styles.languageDisplayText}>
                    {courseContext.course?.language_code?.toUpperCase() || 'EN'}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Avatar Section - Larger like TTS */}
        <View style={styles.avatarSection}>
          <Animated.View 
            style={[
              styles.avatarContainer,
              selectedDisplayMode === 'avatar' && {
                transform: [{ scale: avatarScale }],
                opacity: avatarOpacity,
              }
            ]}
          >
            {selectedDisplayMode === 'gif' ? (
              <>
                {(isPlayingReference || isPlayingUser) ? (
                  <Image
                    key={`gif-playing-${gifKey}`}
                    source={selectedGif.image}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.gifPreviewContainer}>
                    <Image
                      source={selectedGif.image}
                      style={[styles.avatarImage, styles.gifPreview]}
                      resizeMode="cover"
                    />
                    <View style={styles.gifOverlay}>
                      {referenceAudioUri ? (
                        <>
                          <Ionicons name="play-circle" size={80} color="rgba(255,255,255,0.95)" />
                          <Text style={styles.gifOverlayText}>Press Play</Text>
                        </>
                      ) : (
                        <>
                          <Ionicons name="musical-notes" size={60} color="rgba(255,255,255,0.8)" />
                          <Text style={styles.gifOverlayText}>Listen First</Text>
                        </>
                      )}
                    </View>
                  </View>
                )}
              </>
            ) : (
              <Image
                source={selectedAvatar.image}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            )}
            
            {(isPlayingReference || isPlayingUser) && (
              <View style={styles.speakingIndicator}>
                <View style={styles.speakingDot} />
                <Text style={styles.speakingText}>
                  {isPlayingReference ? 'Reference...' : 'Your Recording...'}
                </Text>
              </View>
            )}
            
            {referenceAudioUri && (
              <TouchableOpacity
                style={styles.avatarPlayButton}
                onPress={handlePlayReference}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={isPlayingReference ? "pause" : "play"} 
                  size={24} 
                  color={COLORS.white} 
                />
              </TouchableOpacity>
            )}
          </Animated.View>
          
          {/* Selection Buttons Row */}
          <View style={styles.selectionButtonsRow}>
            <TouchableOpacity
              style={[
                styles.modeSelectButton,
                selectedDisplayMode === 'gif' && styles.modeSelectButtonActive
              ]}
              onPress={handleGifSelect}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="film" 
                size={18} 
                color={selectedDisplayMode === 'gif' ? COLORS.primary : COLORS.white} 
              />
              <Text style={[
                styles.modeSelectText,
                selectedDisplayMode === 'gif' && styles.modeSelectTextActive
              ]}>
                Select GIF
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modeSelectButton,
                selectedDisplayMode === 'avatar' && styles.modeSelectButtonActive
              ]}
              onPress={() => {
                setSelectedDisplayMode('avatar');
                handleAvatarSelect();
              }}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="swap-horizontal" 
                size={18} 
                color={selectedDisplayMode === 'avatar' ? COLORS.primary : COLORS.white} 
              />
              <Text style={[
                styles.modeSelectText,
                selectedDisplayMode === 'avatar' && styles.modeSelectTextActive
              ]}>
                Select Avatar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sentences Area */}
        <View style={styles.sentencesSection}>
          <View style={styles.sentenceHeader}>
            <Text style={styles.sectionLabel}>Practice Sentences</Text>
            {sentences.length > 0 && (
              <Text style={styles.sentenceCounter}>
                {currentSentenceIndex + 1} / {sentences.length}
              </Text>
            )}
          </View>

          {(isLoadingSentences || isTranslating) ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>
                {isTranslating ? 'Translating sentences...' : 'Loading sentences...'}
              </Text>
            </View>
          ) : sentences.length > 0 ? (
            <>
              {/* Current Sentence Card */}
              <View style={styles.sentenceCard}>
                <Text style={styles.sentenceText}>{currentSentence}</Text>
                
                {/* Navigation Arrows */}
                <View style={styles.sentenceNavigation}>
                  <TouchableOpacity
                    style={[
                      styles.sentenceNavButton,
                      currentSentenceIndex === 0 && styles.sentenceNavButtonDisabled,
                    ]}
                    onPress={() => handleNavigateSentence('prev')}
                    disabled={currentSentenceIndex === 0}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={24}
                      color={currentSentenceIndex === 0 ? COLORS.gray[700] : COLORS.white}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.sentenceNavButton,
                      currentSentenceIndex === sentences.length - 1 && styles.sentenceNavButtonDisabled,
                    ]}
                    onPress={() => handleNavigateSentence('next')}
                    disabled={currentSentenceIndex === sentences.length - 1}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color={currentSentenceIndex === sentences.length - 1 ? COLORS.gray[700] : COLORS.white}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {/* Play Reference */}
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonPrimary]}
                  onPress={handlePlayReference}
                  disabled={isGeneratingAudio || isPlayingReference}
                >
                  {isGeneratingAudio ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Ionicons
                      name={isPlayingReference ? 'pause' : (referenceAudioUri ? 'play' : 'musical-notes')}
                      size={24}
                      color={COLORS.white}
                    />
                  )}
                  <Text style={styles.actionButtonText}>
                    {isGeneratingAudio ? 'Generating...' : (isPlayingReference ? 'Stop' : (referenceAudioUri ? 'Play' : 'Listen'))}
                  </Text>
                </TouchableOpacity>

                {/* Record User */}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.actionButtonRecord,
                    isRecording && styles.actionButtonRecording,
                  ]}
                  onPress={handleRecordUser}
                  disabled={isEvaluating}
                >
                  <Ionicons
                    name={isRecording ? 'stop-circle' : 'mic'}
                    size={24}
                    color={COLORS.white}
                  />
                  <Text style={styles.actionButtonText}>
                    {isRecording ? 'Stop' : 'Record'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Evaluation Loading */}
              {isEvaluating && (
                <View style={styles.evaluatingContainer}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={styles.evaluatingText}>Evaluating your pronunciation...</Text>
                </View>
              )}

              {/* Score Display */}
              {pronunciationScore && (
                <View style={styles.scoreCard}>
                  <PronunciationResult
                    overallScore={pronunciationScore.score || 0}
                    accuracy={pronunciationScore.accuracy_score}
                    fluency={pronunciationScore.fluency_score}
                    completeness={pronunciationScore.completeness_score}
                    words={pronunciationScore.word_level_details || pronunciationScore.words || []}
                    transcript={pronunciationScore.userText || ''}
                    referenceText={pronunciationScore.original || ''}
                    showTitle={true}
                  />
                  
                  {/* Detailed Scores - 3 temel score progress bar'ları */}
                  {(pronunciationScore.accuracy_score !== undefined || 
                    pronunciationScore.fluency_score !== undefined || 
                    pronunciationScore.completeness_score !== undefined) && (
                    <View style={styles.detailedScoresContainer}>
                      {pronunciationScore.accuracy_score !== undefined && (
                        <View style={styles.detailedScoreItem}>
                          <Text style={styles.detailedScoreLabel}>Accuracy</Text>
                          <View style={styles.detailedScoreBar}>
                    <View
                      style={[
                                styles.detailedScoreBarFill,
                                { width: `${pronunciationScore.accuracy_score}%` }
                              ]} 
                            />
                    </View>
                          <Text style={styles.detailedScoreValue}>{pronunciationScore.accuracy_score}%</Text>
                  </View>
                      )}
                      {pronunciationScore.fluency_score !== undefined && (
                        <View style={styles.detailedScoreItem}>
                          <Text style={styles.detailedScoreLabel}>Fluency</Text>
                          <View style={styles.detailedScoreBar}>
                            <View 
                              style={[
                                styles.detailedScoreBarFill,
                                { width: `${pronunciationScore.fluency_score}%` }
                              ]} 
                            />
                          </View>
                          <Text style={styles.detailedScoreValue}>{pronunciationScore.fluency_score}%</Text>
                        </View>
                      )}
                      {pronunciationScore.completeness_score !== undefined && (
                        <View style={styles.detailedScoreItem}>
                          <Text style={styles.detailedScoreLabel}>Completeness</Text>
                          <View style={styles.detailedScoreBar}>
                            <View 
                              style={[
                                styles.detailedScoreBarFill,
                                { width: `${pronunciationScore.completeness_score}%` }
                              ]} 
                            />
                          </View>
                          <Text style={styles.detailedScoreValue}>{pronunciationScore.completeness_score}%</Text>
                        </View>
                      )}
                    </View>
                  )}
                  
                  <Text style={styles.feedbackText}>{pronunciationScore.feedback}</Text>
                  
                  {/* You said transcript section */}
                  <View style={styles.transcriptSection}>
                    <Text style={styles.transcriptLabel}>You said:</Text>
                    <Text style={styles.transcriptText}>"{pronunciationScore.userText}"</Text>
                  </View>

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
                        {isPlayingUser ? 'Stop Recording' : 'Play Your Recording'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color={COLORS.gray[600]} />
              <Text style={styles.emptyText}>No sentences available</Text>
            </View>
          )}
        </View>

        {/* Footer Buttons */}
        <View style={styles.footerSection}>
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={handleCourses}
          >
            <Ionicons name="book-outline" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={styles.footerButtonText}>My Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={handlePastRecordings}
          >
            <Ionicons name="time-outline" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={styles.footerButtonText}>Past Recordings</Text>
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
  avatarSection: {
    marginBottom: 20,
  },
  avatarContainer: {
    width: '100%',
    aspectRatio: 4/3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.gray[800],
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  gifPreviewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  gifPreview: {
    opacity: 0.3,
  },
  gifOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  gifOverlayText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  speakingIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    borderRadius: 20,
  },
  speakingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
  speakingText: {
    fontSize: SIZES.body4,
    fontWeight: '600',
    color: COLORS.white,
  },
  avatarPlayButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  selectionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  modeSelectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modeSelectButtonActive: {
    backgroundColor: 'rgba(19, 127, 236, 0.15)',
    borderColor: COLORS.primary,
  },
  modeSelectText: {
    fontSize: SIZES.body4,
    fontWeight: '600',
    color: COLORS.white,
  },
  modeSelectTextActive: {
    color: COLORS.primary,
  },
  levelSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 12,
  },
  levelButtonsScroll: {
    paddingRight: 16,
    gap: 8,
  },
  levelButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  levelButtonActive: {
    backgroundColor: 'rgba(19, 127, 236, 0.2)',
    borderColor: COLORS.primary,
  },
  levelButtonText: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.gray[400],
  },
  levelButtonTextActive: {
    color: COLORS.primary,
  },
  selectionSection: {
    marginBottom: 24,
  },
  selectionRow: {
    flexDirection: 'row',
    gap: 16,
  },
  selectionItem: {
    flex: 1,
  },
  selectionLabel: {
    fontSize: SIZES.body3,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
  },
  sentencesSection: {
    marginBottom: 24,
  },
  sentenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sentenceCounter: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: SIZES.body2,
    color: COLORS.gray[400],
  },
  sentenceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  sentenceText: {
    fontSize: SIZES.h4,
    color: COLORS.textLight,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 16,
  },
  sentenceNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  sentenceNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentenceNavButtonDisabled: {
    opacity: 0.3,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionButtonPrimary: {
    backgroundColor: COLORS.primary,
  },
  actionButtonRecord: {
    backgroundColor: '#10b981',
  },
  actionButtonRecording: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.white,
  },
  evaluatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: 'rgba(19, 127, 236, 0.1)',
    borderRadius: 8,
    marginBottom: 16,
  },
  evaluatingText: {
    fontSize: SIZES.body3,
    color: COLORS.primary,
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  scoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreBadgeExcellent: {
    backgroundColor: '#10b981',
  },
  scoreBadgeGood: {
    backgroundColor: '#f59e0b',
  },
  scoreBadgeNeedsWork: {
    backgroundColor: '#ef4444',
  },
  scoreValue: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  detailedScoresContainer: {
    marginTop: 12,
    marginBottom: 16,
    gap: 12,
  },
  detailedScoreItem: {
    gap: 6,
  },
  detailedScoreLabel: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
    fontWeight: '500',
  },
  detailedScoreBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  detailedScoreBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  detailedScoreValue: {
    fontSize: SIZES.body3,
    color: COLORS.textLight,
    fontWeight: '600',
    alignSelf: 'flex-end',
  },
  feedbackText: {
    fontSize: SIZES.body2,
    color: COLORS.gray[300],
    lineHeight: 22,
    marginBottom: 16,
  },
  transcriptSection: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginBottom: 12,
  },
  transcriptLabel: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
    marginBottom: 4,
  },
  transcriptText: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    fontStyle: 'italic',
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: SIZES.body2,
    color: COLORS.gray[400],
  },
  footerSection: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: SIZES.padding,
    justifyContent: 'center',
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerButtonText: {
    fontSize: SIZES.body2,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  // Course Context Styles
  courseContextHeader: {
    marginBottom: SIZES.padding,
    paddingHorizontal: SIZES.padding,
  },
  courseContextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(19, 127, 236, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
    gap: 8,
  },
  courseContextClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  courseContextText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.primary,
    flex: 1,
  },
  topicBadgeInline: {
    marginLeft: 4,
  },
  topicBadgeTextInline: {
    fontSize: SIZES.body3,
    fontWeight: '500',
    color: COLORS.primary,
    opacity: 0.8,
  },
  languageDisplay: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  languageDisplayText: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  detailedScoresContainer: {
    marginTop: 12,
    marginBottom: 16,
    gap: 12,
  },
  detailedScoreItem: {
    gap: 6,
  },
  detailedScoreLabel: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
    fontWeight: '500',
  },
  detailedScoreBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  detailedScoreBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  detailedScoreValue: {
    fontSize: SIZES.body3,
    color: COLORS.textLight,
    fontWeight: '600',
    alignSelf: 'flex-end',
  },
  feedbackText: {
    fontSize: SIZES.body2,
    color: COLORS.gray[300],
    lineHeight: 22,
    marginBottom: 16,
  },
  transcriptSection: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginBottom: 12,
  },
  transcriptLabel: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
    marginBottom: 4,
  },
  transcriptText: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    fontStyle: 'italic',
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
});

export default SualingoScreen;
