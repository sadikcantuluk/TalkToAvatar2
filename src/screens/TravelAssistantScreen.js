import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES } from '../constants';
import { Button, DashboardLayout, LanguageSelector, VoiceSelector } from '../components';
import {
  translateText,
  generateTextToSpeech,
  generateSpeechOnly,
  playAudio,
  stopAudio,
  startRecording,
  stopRecording,
  transcribeAudio,
} from '../services/openAI';

const USER_HISTORY_KEY = '@travel_user_history';
const COUNTERPART_HISTORY_KEY = '@travel_counterpart_history';

const TravelAssistantScreen = ({ navigation }) => {
  const [userText, setUserText] = useState('');
  const [counterpartText, setCounterpartText] = useState('');
  const [userLanguage, setUserLanguage] = useState('en');
  const [counterpartLanguage, setCounterpartLanguage] = useState('es');
  const [userVoice, setUserVoice] = useState('nova');
  const [counterpartVoice, setCounterpartVoice] = useState('onyx');

  // History management
  const [userHistory, setUserHistory] = useState([]);
  const [counterpartHistory, setCounterpartHistory] = useState([]);
  const [userHistoryIndex, setUserHistoryIndex] = useState(-1);
  const [counterpartHistoryIndex, setCounterpartHistoryIndex] = useState(-1);

  // Recording states
  const [isUserRecording, setIsUserRecording] = useState(false);
  const [isCounterpartRecording, setIsCounterpartRecording] = useState(false);
  const userRecordingRef = useRef(null);
  const counterpartRecordingRef = useRef(null);

  // Speaking states
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isCounterpartSpeaking, setIsCounterpartSpeaking] = useState(false);

  // Speech generation loading states
  const [isUserGeneratingSpeech, setIsUserGeneratingSpeech] = useState(false);
  const [isCounterpartGeneratingSpeech, setIsCounterpartGeneratingSpeech] = useState(false);

  // Sending states
  const [isSending, setIsSending] = useState(false);

  // Load history on mount
  useEffect(() => {
    loadHistory();
    return () => {
      // Cleanup
      stopAudio();
    };
  }, []);

  const loadHistory = async () => {
    try {
      console.log('=== Loading Travel Assistant History ===');
      const userHist = await AsyncStorage.getItem(USER_HISTORY_KEY);
      const counterpartHist = await AsyncStorage.getItem(COUNTERPART_HISTORY_KEY);

      if (userHist) {
        const parsed = JSON.parse(userHist);
        setUserHistory(parsed);
        console.log('Loaded user history items:', parsed.length);
      }

      if (counterpartHist) {
        const parsed = JSON.parse(counterpartHist);
        setCounterpartHistory(parsed);
        console.log('Loaded counterpart history items:', parsed.length);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const saveToHistory = async (text, isUser) => {
    try {
      const key = isUser ? USER_HISTORY_KEY : COUNTERPART_HISTORY_KEY;
      const currentHistory = isUser ? userHistory : counterpartHistory;
      const setHistory = isUser ? setUserHistory : setCounterpartHistory;

      const newHistory = [text, ...currentHistory.filter(t => t !== text)].slice(0, 20);
      setHistory(newHistory);
      await AsyncStorage.setItem(key, JSON.stringify(newHistory));

      console.log(`Saved to ${isUser ? 'user' : 'counterpart'} history. Total: ${newHistory.length}`);
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const handleModeChange = (mode) => {
    if (mode === 'tts') {
      navigation.navigate('Dashboard');
    } else if (mode === 'video') {
      navigation.navigate('AvatarToVideo');
    }
  };

  // Mic handlers
  const handleMicPress = async (isUser) => {
    const isRecording = isUser ? isUserRecording : isCounterpartRecording;
    const setRecording = isUser ? setIsUserRecording : setIsCounterpartRecording;
    const recordingRef = isUser ? userRecordingRef : counterpartRecordingRef;
    const setText = isUser ? setUserText : setCounterpartText;
    const side = isUser ? 'User' : 'Counterpart';

    try {
      if (isRecording) {
        console.log(`=== ${side} Stopping Recording ===`);
        setRecording(false);

        if (recordingRef.current) {
          const result = await stopRecording(recordingRef.current);

          if (result.success) {
            console.log(`${side} transcribing audio...`);
            // Use appropriate language for transcription
            const language = isUser ? userLanguage : counterpartLanguage;
            const transcription = await transcribeAudio(result.uri, language);

            if (transcription.success) {
              console.log(`✅ ${side} transcription successful:`, transcription.text);
              setText(transcription.text);
              await saveToHistory(transcription.text, isUser);
            } else {
              Alert.alert('Error', 'Failed to transcribe audio');
            }
          }

          recordingRef.current = null;
        }
      } else {
        console.log(`=== ${side} Starting Recording ===`);
        const result = await startRecording();

        if (result.success) {
          recordingRef.current = result.recording;
          setRecording(true);
        } else {
          Alert.alert('Error', 'Failed to start recording. Please grant microphone permission.');
        }
      }
    } catch (error) {
      console.error(`${side} mic error:`, error);
      setRecording(false);
      recordingRef.current = null;
      Alert.alert('Error', 'Microphone error. Please try again.');
    }
  };

  // Send handlers
  const handleSend = async (isUser) => {
    const text = isUser ? userText : counterpartText;
    const sourceLang = isUser ? userLanguage : counterpartLanguage;
    const targetLang = isUser ? counterpartLanguage : userLanguage;
    const setText = isUser ? setCounterpartText : setUserText;
    const side = isUser ? 'User' : 'Counterpart';

    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }

    try {
      console.log(`=== ${side} Sending Message ===`);
      console.log('Source language:', sourceLang);
      console.log('Target language:', targetLang);
      console.log('Text:', text);

      setIsSending(true);

      // Save to history
      await saveToHistory(text, isUser);

      // Translate if languages are different
      let translatedText = text;
      if (sourceLang !== targetLang) {
        console.log('Translating message...');
        const result = await translateText(text, targetLang);

        if (result.success) {
          translatedText = result.translatedText;
          console.log('✅ Translation successful:', translatedText);
        } else {
          console.warn('Translation failed, using original text');
        }
      } else {
        console.log('Same language, no translation needed');
      }

      // Set translated text to other side
      setText(translatedText);
      await saveToHistory(translatedText, !isUser);

      console.log('✅ Message sent successfully');
    } catch (error) {
      console.error(`${side} send error:`, error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  // Speak handlers
  const handleSpeak = async (isUser) => {
    const text = isUser ? userText : counterpartText;
    const language = isUser ? userLanguage : counterpartLanguage;
    const voice = isUser ? userVoice : counterpartVoice;
    const isSpeaking = isUser ? isUserSpeaking : isCounterpartSpeaking;
    const setSpeaking = isUser ? setIsUserSpeaking : setIsCounterpartSpeaking;
    const isGenerating = isUser ? isUserGeneratingSpeech : isCounterpartGeneratingSpeech;
    const setGenerating = isUser ? setIsUserGeneratingSpeech : setIsCounterpartGeneratingSpeech;
    const side = isUser ? 'User' : 'Counterpart';

    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text to speak');
      return;
    }

    // Prevent multiple clicks while generating
    if (isGenerating) {
      return;
    }

    try {
      if (isSpeaking) {
        console.log(`${side} stopping speech`);
        await stopAudio();
        setSpeaking(false);
      } else {
        console.log(`=== ${side} Speaking ===`);
        console.log('Text preview:', text.substring(0, 50) + '...');
        console.log('Text length:', text.length);
        console.log('Selected Language (for reference):', language);
        console.log('Selected Voice:', voice);
        console.log('✅ Using generateSpeechOnly - NO translation will occur');

        // Set loading state before generating speech
        setGenerating(true);

        try {
          // Generate speech ONLY - text is already in correct language
          // This function will NOT translate, just convert text to speech
          const result = await generateSpeechOnly(text, voice);

          // Reset loading state
          setGenerating(false);

          if (result.success) {
            setSpeaking(true);
            await playAudio(result.audioUri, () => {
              setSpeaking(false);
            });
            console.log('✅ Speech playback started - text spoken as-is');
          } else {
            Alert.alert('Error', 'Failed to generate speech');
          }
        } catch (genError) {
          // Reset loading state on error
          setGenerating(false);
          throw genError;
        }
      }
    } catch (error) {
      console.error(`${side} speak error:`, error);
      console.error('Error stack:', error.stack);
      setSpeaking(false);
      setGenerating(false);
      Alert.alert('Error', 'Failed to speak text');
    }
  };

  // History navigation
  const handleHistoryNavigation = (isUser, direction) => {
    const history = isUser ? userHistory : counterpartHistory;
    const currentIndex = isUser ? userHistoryIndex : counterpartHistoryIndex;
    const setIndex = isUser ? setUserHistoryIndex : setCounterpartHistoryIndex;
    const setText = isUser ? setUserText : setCounterpartText;

    if (history.length === 0) return;

    let newIndex = currentIndex;

    if (direction === 'prev') {
      newIndex = currentIndex < history.length - 1 ? currentIndex + 1 : currentIndex;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : -1;
    }

    console.log(`${isUser ? 'User' : 'Counterpart'} history navigation:`, direction, 'index:', newIndex);

    setIndex(newIndex);
    if (newIndex >= 0) {
      setText(history[newIndex]);
    } else {
      setText('');
    }
  };

  // Clear handlers
  const handleClear = (isUser) => {
    console.log(`Clearing ${isUser ? 'user' : 'counterpart'} text`);
    if (isUser) {
      setUserText('');
      setUserHistoryIndex(-1);
    } else {
      setCounterpartText('');
      setCounterpartHistoryIndex(-1);
    }
  };

  return (
    <DashboardLayout
      currentMode="travel"
      onModeChange={handleModeChange}
      navigation={navigation}
      showBackButton={true}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* User Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>You</Text>
              <View style={styles.headerActions}>
                <VoiceSelector
                  selectedVoice={userVoice}
                  onVoiceChange={setUserVoice}
                  style={styles.voiceSelector}
                  textColor="#1F2937"
                  labelColor="#6B7280" // Dark Gray for label
                />
                <LanguageSelector
                  selectedLanguage={userLanguage}
                  onLanguageChange={setUserLanguage}
                  style={styles.languageSelector}
                  textColor="#1F2937"
                />
              </View>
            </View>

            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder={`Type or tap the mic to speak... (${userText.length}/500)`}
                placeholderTextColor={COLORS.gray[400]}
                value={userText}
                onChangeText={setUserText}
                multiline
                maxLength={500}
              />
              {userText.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButtonInside}
                  onPress={() => handleClear(true)}
                >
                  <Ionicons name="close-circle" size={24} color={COLORS.gray[400]} />
                </TouchableOpacity>
              )}
              <View style={styles.arrowButtons}>
                <TouchableOpacity
                  onPress={() => handleHistoryNavigation(true, 'prev')}
                  disabled={userHistory.length === 0 || userHistoryIndex >= userHistory.length - 1}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={userHistory.length === 0 || userHistoryIndex >= userHistory.length - 1 ? COLORS.gray[600] : COLORS.gray[400]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleHistoryNavigation(true, 'next')}
                  disabled={userHistory.length === 0 || userHistoryIndex <= 0}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={userHistory.length === 0 || userHistoryIndex <= 0 ? COLORS.gray[600] : COLORS.gray[400]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.micButton, isUserRecording && styles.micButtonActive]}
                onPress={() => handleMicPress(true)}
              >
                <Ionicons
                  name={isUserRecording ? "stop-circle" : "mic"}
                  size={28}
                  color={isUserRecording ? "#ef4444" : COLORS.primary}
                />
              </TouchableOpacity>
              <View style={styles.buttonRow}>
                <Button
                  title={isUserSpeaking ? "Stop" : "Speak"}
                  variant="outline"
                  style={styles.smallButton}
                  onPress={() => handleSpeak(true)}
                  disabled={!userText.trim() || isUserGeneratingSpeech}
                  loading={isUserGeneratingSpeech}
                />
                <Button
                  title={isSending ? "Sending..." : "Send"}
                  variant="primary"
                  style={styles.smallButton}
                  onPress={() => handleSend(true)}
                  disabled={!userText.trim() || isSending}
                />
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Other Person Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Other</Text>
              <View style={styles.headerActions}>
                <VoiceSelector
                  selectedVoice={counterpartVoice}
                  onVoiceChange={setCounterpartVoice}
                  style={styles.voiceSelector}
                  textColor="#1F2937"
                  labelColor="#6B7280"
                />
                <LanguageSelector
                  selectedLanguage={counterpartLanguage}
                  onLanguageChange={setCounterpartLanguage}
                  style={styles.languageSelector}
                  textColor="#1F2937"
                />
              </View>
            </View>

            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder={`Type or tap the mic to speak... (${counterpartText.length}/500)`}
                placeholderTextColor={COLORS.gray[400]}
                value={counterpartText}
                onChangeText={setCounterpartText}
                multiline
                maxLength={500}
              />
              {counterpartText.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButtonInside}
                  onPress={() => handleClear(false)}
                >
                  <Ionicons name="close-circle" size={24} color={COLORS.gray[400]} />
                </TouchableOpacity>
              )}
              <View style={styles.arrowButtons}>
                <TouchableOpacity
                  onPress={() => handleHistoryNavigation(false, 'prev')}
                  disabled={counterpartHistory.length === 0 || counterpartHistoryIndex >= counterpartHistory.length - 1}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={counterpartHistory.length === 0 || counterpartHistoryIndex >= counterpartHistory.length - 1 ? COLORS.gray[600] : COLORS.gray[400]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleHistoryNavigation(false, 'next')}
                  disabled={counterpartHistory.length === 0 || counterpartHistoryIndex <= 0}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={counterpartHistory.length === 0 || counterpartHistoryIndex <= 0 ? COLORS.gray[600] : COLORS.gray[400]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.micButton, isCounterpartRecording && styles.micButtonActive]}
                onPress={() => handleMicPress(false)}
              >
                <Ionicons
                  name={isCounterpartRecording ? "stop-circle" : "mic"}
                  size={28}
                  color={isCounterpartRecording ? "#ef4444" : COLORS.primary}
                />
              </TouchableOpacity>
              <View style={styles.buttonRow}>
                <Button
                  title={isCounterpartSpeaking ? "Stop" : "Speak"}
                  variant="outline"
                  style={styles.smallButton}
                  onPress={() => handleSpeak(false)}
                  disabled={!counterpartText.trim() || isCounterpartGeneratingSpeech}
                  loading={isCounterpartGeneratingSpeech}
                />
                <Button
                  title={isSending ? "Sending..." : "Send"}
                  variant="primary"
                  style={styles.smallButton}
                  onPress={() => handleSend(false)}
                  disabled={!counterpartText.trim() || isSending}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light Background
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    flex: 1,
    padding: SIZES.padding,
    minHeight: 250,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: '#1F2937', // Dark Text
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearButtonInside: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
  },
  voiceSelector: {
    minWidth: 130,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  languageSelector: {
    minWidth: 130,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textAreaWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  textArea: {
    flex: 1,
    padding: 16,
    color: '#1F2937',
    fontSize: 16,
    textAlignVertical: 'top',
    height: '100%',
  },
  arrowButtons: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  micButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0F2F1', // Light Teal
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B2DFDB',
  },
  micButtonActive: {
    backgroundColor: '#FEE2E2', // Light Red
    borderColor: '#FECACA',
  },
  buttonRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  smallButton: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: SIZES.padding,
  },
});

export default TravelAssistantScreen;

