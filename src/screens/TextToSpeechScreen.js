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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, IMAGES } from '../constants';
import { Button, Input, DashboardLayout, LanguageSelector, VoiceSelector } from '../components';
import {
  generateTextToSpeech,
  playAudio,
  stopAudio,
  startRecording,
  stopRecording,
  transcribeAudio,
} from '../services/openAI';
import { useAuth, useToast } from '../context';
import audiosAPI from '../services/audiosAPI';
import { getUserStorageKey } from '../utils/userStorage';

const TextToSpeechScreen = ({ navigation, route }) => {
  const { token, user } = useAuth();
  const { success, error: showError } = useToast();
  const [selectedAvatar, setSelectedAvatar] = useState(
    route?.params?.selectedAvatar || {
      name: 'Yusuf',
      image: IMAGES.yusuf,
    }
  );

  const [selectedDisplayMode, setSelectedDisplayMode] = useState('gif'); // 'avatar' or 'gif'
  const [selectedGif, setSelectedGif] = useState({
    name: 'Man',
    image: IMAGES.manGif,
  });
  const [gifKey, setGifKey] = useState(Date.now()); // Key to remount GIF

  const [outputName, setOutputName] = useState('');
  const [textInput, setTextInput] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isCreating, setIsCreating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAudioUri, setCurrentAudioUri] = useState(null);
  const [textHistory, setTextHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const recordingRef = useRef(null);

  // Avatar animation
  const avatarScale = useRef(new Animated.Value(1)).current;
  const avatarOpacity = useRef(new Animated.Value(1)).current;
  const speakingDotScale = useRef(new Animated.Value(1)).current;
  const mouthScale = useRef(new Animated.Value(1)).current;
  const mouthOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnimationRef = useRef(null);
  const dotAnimationRef = useRef(null);
  const mouthAnimationRef = useRef(null);

  // Load text history on mount and when user changes
  useEffect(() => {
    loadTextHistory();
    return () => {
      // Cleanup on unmount
      stopAudio();
    };
  }, [user?.id]);

  // Handle avatar selection from SelectAvatarScreen
  // Only update the avatar, preserve all other state (inputs, audio, etc.)
  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.selectedAvatar) {
        console.log('=== Avatar Changed in TTS ===');
        console.log('New avatar:', route.params.selectedAvatar.name);
        console.log('Preserving state: textInput, outputName, voice, language, audioUri');

        setSelectedAvatar(route.params.selectedAvatar);
        setSelectedDisplayMode('avatar'); // Switch to avatar display mode

        console.log('✅ Avatar updated, all state preserved');

        // Clear the param to prevent re-applying on next focus
        navigation.setParams({ selectedAvatar: undefined });
      }
    }, [route?.params?.selectedAvatar])
  );

  // Avatar animation when playing
  useEffect(() => {
    if (isPlaying && selectedDisplayMode === 'avatar') {
      console.log('=== Starting Avatar Animation ===');
      console.log('Avatar speaking animation activated with mouth movements');

      // Create a pulsing animation for avatar (scale and opacity)
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

      // Create a faster pulsing animation for speaking dot
      dotAnimationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(speakingDotScale, {
            toValue: 1.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(speakingDotScale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );

      // Create a mouth movement animation (faster, more intense)
      mouthAnimationRef.current = Animated.loop(
        Animated.sequence([
          // Open mouth
          Animated.parallel([
            Animated.timing(mouthScale, {
              toValue: 1.15,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(mouthOpacity, {
              toValue: 0.3,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
          // Close mouth
          Animated.parallel([
            Animated.timing(mouthScale, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(mouthOpacity, {
              toValue: 0.1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
          // Slight pause
          Animated.delay(100),
          // Open mouth again (variation)
          Animated.parallel([
            Animated.timing(mouthScale, {
              toValue: 1.2,
              duration: 180,
              useNativeDriver: true,
            }),
            Animated.timing(mouthOpacity, {
              toValue: 0.4,
              duration: 180,
              useNativeDriver: true,
            }),
          ]),
          // Close
          Animated.parallel([
            Animated.timing(mouthScale, {
              toValue: 1,
              duration: 180,
              useNativeDriver: true,
            }),
            Animated.timing(mouthOpacity, {
              toValue: 0,
              duration: 180,
              useNativeDriver: true,
            }),
          ]),
        ])
      );

      pulseAnimationRef.current.start();
      dotAnimationRef.current.start();
      mouthAnimationRef.current.start();
      console.log('✅ All animations started: pulse, dot, and mouth movements');
    } else {
      console.log('=== Stopping Avatar Animation ===');

      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
        pulseAnimationRef.current = null;
      }

      if (dotAnimationRef.current) {
        dotAnimationRef.current.stop();
        dotAnimationRef.current = null;
      }

      if (mouthAnimationRef.current) {
        mouthAnimationRef.current.stop();
        mouthAnimationRef.current = null;
      }

      // Reset to default values
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
        Animated.timing(speakingDotScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(mouthScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(mouthOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      console.log('✅ All animations stopped and reset');
    }
  }, [isPlaying, selectedDisplayMode]);

  // Load audio parameters if coming from "Use" button
  useEffect(() => {
    const loadAudioParameters = async () => {
      if (route.params?.loadAudio) {
        const audio = route.params.loadAudio;
        console.log('=== Loading Audio Parameters from History ===');
        console.log('Audio ID:', audio.id);
        console.log('Audio Name:', audio.name);
        console.log('Text:', audio.text);
        console.log('Voice:', audio.voice);
        console.log('Language:', audio.language);
        console.log('Avatar Name:', audio.avatarName);

        // Load all parameters
        setOutputName(audio.name || '');
        setTextInput(audio.text || '');
        setSelectedVoice(audio.voice || 'nova');
        setSelectedLanguage(audio.language || 'en');

        // Load avatar based on avatarName
        if (audio.avatarName) {
          if (audio.avatarName.toLowerCase() === 'yusuf') {
            console.log('Setting avatar to Yusuf (default)');
            setSelectedAvatar({
              name: 'Yusuf',
              image: IMAGES.yusuf,
            });
          } else if (audio.avatarName.toLowerCase() === 'eda') {
            console.log('Setting avatar to Eda (default)');
            setSelectedAvatar({
              name: 'Eda',
              image: IMAGES.eda,
            });
          } else {
            // Custom avatar - load from AsyncStorage
            console.log('Avatar is custom, loading from storage:', audio.avatarName);
            try {
              const customAvatarsKey = getUserStorageKey('@custom_avatars', user?.id);
              const savedAvatars = await AsyncStorage.getItem(customAvatarsKey);
              if (savedAvatars) {
                const customAvatars = JSON.parse(savedAvatars);
                console.log('Found custom avatars:', customAvatars.length);

                // Find the avatar by name
                const foundAvatar = customAvatars.find(a => a.name === audio.avatarName);

                if (foundAvatar) {
                  console.log('✅ Custom avatar found:', foundAvatar.name);
                  console.log('Avatar ID:', foundAvatar.id);
                  setSelectedAvatar({
                    name: foundAvatar.name,
                    image: foundAvatar.image,
                    id: foundAvatar.id,
                    isCustom: true,
                  });
                } else {
                  console.warn('⚠️ Custom avatar not found in storage:', audio.avatarName);
                  console.log('Available avatars:', customAvatars.map(a => a.name));
                  console.log('Keeping current avatar as fallback');
                }
              } else {
                console.warn('⚠️ No custom avatars in storage');
              }
            } catch (error) {
              console.error('❌ Error loading custom avatar:', error);
              console.error('Error stack:', error.stack);
            }
          }
        }

        // Reset audio state to force re-creation
        setCurrentAudioUri(null);
        setIsPlaying(false);
        setCurrentHistoryIndex(-1);

        console.log('All parameters loaded successfully');
        console.log('Current state:', {
          outputName: audio.name,
          textLength: audio.text?.length || 0,
          voice: audio.voice,
          language: audio.language,
          avatar: audio.avatarName,
        });

        // Clear the param
        navigation.setParams({ loadAudio: undefined });
      }
    };

    loadAudioParameters();
  }, [route.params?.loadAudio]);

  // Load text history from AsyncStorage
  const loadTextHistory = async () => {
    if (!user?.id) {
      setTextHistory([]);
      return;
    }

    try {
      console.log('=== Loading Text History ===');
      const key = getUserStorageKey('@text_history', user.id);
      const saved = await AsyncStorage.getItem(key);
      if (saved) {
        const history = JSON.parse(saved);
        console.log('Loaded text history items:', history.length);
        setTextHistory(history);
      } else {
        console.log('No text history found');
        setTextHistory([]);
      }
    } catch (error) {
      console.error('Error loading text history:', error);
      setTextHistory([]);
    }
  };

  // Save text to history
  const saveTextToHistory = async (text) => {
    if (!user?.id) return;

    try {
      console.log('=== Saving Text to History ===');
      const newHistory = [text, ...textHistory.filter(t => t !== text)].slice(0, 20); // Keep last 20
      setTextHistory(newHistory);
      const key = getUserStorageKey('@text_history', user.id);
      await AsyncStorage.setItem(key, JSON.stringify(newHistory));
      console.log('Text saved to history. Total items:', newHistory.length);
    } catch (error) {
      console.error('Error saving text history:', error);
    }
  };

  // Save audio to history (optimized for async backend save)
  const saveAudioToHistory = async (audioData) => {
    try {
      console.log('=== Saving Audio to History ===');

      const newAudio = {
        id: Date.now().toString(),
        name: outputName || `Audio ${audioHistory.length + 1}`,
        text: textInput,
        translatedText: audioData.translatedText,
        audioUri: audioData.audioUri,
        voice: selectedVoice,
        language: selectedLanguage,
        avatarName: selectedAvatar.name,
        createdAt: new Date().toISOString(),
      };

      // Save to local AsyncStorage (fast - blocks UI)
      const key = getUserStorageKey('@audio_history', user.id);
      const saved = await AsyncStorage.getItem(key);
      const history = saved ? JSON.parse(saved) : [];
      const newHistory = [newAudio, ...history];
      await AsyncStorage.setItem(key, JSON.stringify(newHistory));
      console.log('✅ Audio saved to AsyncStorage. Total audios:', newHistory.length);

      // Show success toast immediately after local save (instant feedback)
      success('Audio created and saved successfully!');

      // Save to backend/Supabase asynchronously (non-blocking)
      if (token && user) {
        // Use Promise.resolve().then() to defer backend save
        // This ensures UI doesn't wait for backend response
        Promise.resolve().then(async () => {
          try {
            console.log('📤 Saving audio to backend (background)...');
            const backendData = {
              local_uri: audioData.audioUri,
              text: textInput,
              translated_text: audioData.translatedText,
              voice_type: selectedVoice,
              language_code: selectedLanguage,
              avatar_name: selectedAvatar.name,
            };

            const response = await audiosAPI.create(token, backendData);
            console.log('✅ Audio saved to backend:', response.audio.id);

            // Update local storage with backend_id for future deletion
            const key = getUserStorageKey('@audio_history', user.id);
            const saved = await AsyncStorage.getItem(key);
            if (saved) {
              const history = JSON.parse(saved);
              const updatedHistory = history.map(item => {
                if (item.id === newAudio.id) {
                  return { ...item, backend_id: response.audio.id };
                }
                return item;
              });
              await AsyncStorage.setItem(key, JSON.stringify(updatedHistory));
            }
            // No toast here - already shown after local save
          } catch (backendError) {
            console.error('⚠️ Backend save failed, but local save succeeded:', backendError);
            // Could implement queue retry here if needed
            // For now, local save is sufficient
          }
        });
      }
    } catch (error) {
      console.error('❌ Error saving audio history:', error);
      showError('Failed to save audio');
    }
  };

  const handleModeChange = (mode) => {
    if (mode === 'video') {
      navigation.navigate('AvatarToVideo');
    } else if (mode === 'travel') {
      navigation.navigate('TravelAssistant');
    }
  };

  const handleAvatarSelect = () => {
    console.log('=== Navigating to Select Avatar (State Preservation) ===');
    console.log('Current state will be preserved:');
    console.log('- textInput:', textInput?.substring(0, 50) + '...');
    console.log('- outputName:', outputName);
    console.log('- voice:', selectedVoice);
    console.log('- language:', selectedLanguage);
    console.log('- audioUri:', currentAudioUri ? 'Available' : 'None');

    navigation.navigate('SelectAvatar', {
      returnScreen: 'TextToSpeech',
      preserveState: true // Indicate state should be preserved
    });
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
            // Stop any playing audio when changing GIF
            if (isPlaying) {
              stopAudio();
              setIsPlaying(false);
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
            // Stop any playing audio when changing GIF
            if (isPlaying) {
              stopAudio();
              setIsPlaying(false);
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

  const handleCreate = async () => {
    if (!textInput.trim()) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }

    try {
      console.log('=== Creating TTS Audio ===');
      setIsCreating(true);
      setCurrentAudioUri(null);

      // Generate audio from text
      const result = await generateTextToSpeech(textInput, selectedVoice, selectedLanguage);

      if (result.success) {
        console.log('Audio created successfully');
        setCurrentAudioUri(result.audioUri);

        // Save to history
        await saveTextToHistory(textInput);
        await saveAudioToHistory(result);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Create audio error:', error);
      Alert.alert('Error', 'Failed to create audio. Please check your API key and try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handlePlayPause = async () => {
    if (!currentAudioUri) {
      Alert.alert('Error', 'Please create audio first');
      return;
    }

    try {
      if (isPlaying) {
        console.log('Stopping audio playback');
        await stopAudio();
        setIsPlaying(false);
      } else {
        console.log('Starting audio playback');
        // Reset GIF key to restart animation
        if (selectedDisplayMode === 'gif') {
          console.log('=== Restarting GIF animation ===');
          setGifKey(Date.now());
        }
        setIsPlaying(true);
        const result = await playAudio(currentAudioUri, () => {
          console.log('=== Audio playback finished, stopping GIF ===');
          setIsPlaying(false);
        });

        if (!result.success) {
          setIsPlaying(false);
          Alert.alert('Error', 'Failed to play audio');
        }
      }
    } catch (error) {
      console.error('Play/Pause error:', error);
      setIsPlaying(false);
      Alert.alert('Error', 'Failed to play audio');
    }
  };

  const handleMicPress = async () => {
    try {
      if (isRecording) {
        console.log('Stopping recording...');
        setIsRecording(false);

        if (recordingRef.current) {
          const result = await stopRecording(recordingRef.current);

          if (result.success) {
            console.log('Transcribing audio...');
            const transcription = await transcribeAudio(result.uri, selectedLanguage);

            if (transcription.success) {
              console.log('Transcription successful');
              setTextInput(transcription.text);
              Alert.alert('Success', 'Speech recognized successfully!');
            } else {
              Alert.alert('Error', 'Failed to transcribe audio');
            }
          }

          recordingRef.current = null;
        }
      } else {
        console.log('Starting recording...');
        const result = await startRecording();

        if (result.success) {
          recordingRef.current = result.recording;
          setIsRecording(true);
          Alert.alert('Recording', 'Tap the mic again to stop recording');
        } else {
          Alert.alert('Error', 'Failed to start recording. Please grant microphone permission.');
        }
      }
    } catch (error) {
      console.error('Mic press error:', error);
      setIsRecording(false);
      recordingRef.current = null;
      Alert.alert('Error', 'Microphone error. Please try again.');
    }
  };

  const handleNavigateHistory = (direction) => {
    if (textHistory.length === 0) return;

    let newIndex = currentHistoryIndex;

    if (direction === 'prev') {
      newIndex = currentHistoryIndex < textHistory.length - 1 ? currentHistoryIndex + 1 : currentHistoryIndex;
    } else {
      newIndex = currentHistoryIndex > 0 ? currentHistoryIndex - 1 : -1;
    }

    console.log('=== Navigating History ===');
    console.log('Direction:', direction);
    console.log('New index:', newIndex);

    setCurrentHistoryIndex(newIndex);
    if (newIndex >= 0) {
      setTextInput(textHistory[newIndex]);
    } else {
      setTextInput('');
    }
  };

  const handlePastAudio = () => {
    navigation.navigate('PastAudioList');
  };

  return (
    <DashboardLayout
      currentMode="tts"
      onModeChange={handleModeChange}
      navigation={navigation}
      showBackButton={true}
    >
      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
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
                {isPlaying ? (
                  /* GIF playing - key changes on each play to restart animation */
                  <Image
                    key={`gif-playing-${gifKey}`}
                    source={selectedGif.image}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  /* GIF stopped - show preview with overlay */
                  <>
                    <View style={styles.gifPreviewContainer}>
                      <Image
                        source={selectedGif.image}
                        style={[styles.avatarImage, styles.gifPreview]}
                        resizeMode="cover"
                      />
                      <View style={styles.gifOverlay}>
                        {currentAudioUri ? (
                          <>
                            <Ionicons name="play-circle" size={80} color="rgba(255,255,255,0.95)" />
                            <Text style={styles.gifOverlayText}>Press Play</Text>
                          </>
                        ) : (
                          <>
                            <Ionicons name="musical-notes" size={60} color="rgba(255,255,255,0.8)" />
                            <Text style={styles.gifOverlayText}>Create Audio First</Text>
                          </>
                        )}
                      </View>
                    </View>
                  </>
                )}
              </>
            ) : (
              <Image
                source={selectedAvatar.image}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            )}

            {/* Mouth movement overlay - only for avatar mode */}
            {isPlaying && selectedDisplayMode === 'avatar' && (
              <Animated.View
                style={[
                  styles.mouthOverlay,
                  {
                    opacity: mouthOpacity,
                    transform: [{ scaleY: mouthScale }],
                  }
                ]}
              />
            )}

            {isPlaying && (
              <View style={styles.speakingIndicator}>
                <Animated.View
                  style={[
                    styles.speakingDot,
                    {
                      transform: [{ scale: speakingDotScale }],
                    }
                  ]}
                />
                <Text style={styles.speakingText}>Speaking...</Text>
              </View>
            )}

            {/* Play button on avatar (top right) */}
            {currentAudioUri && (
              <TouchableOpacity
                style={styles.avatarPlayButton}
                onPress={handlePlayPause}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
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
                color={selectedDisplayMode === 'gif' ? COLORS.primary : '#6B7280'}
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
                color={selectedDisplayMode === 'avatar' ? COLORS.primary : '#6B7280'}
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

        {/* Input Section */}
        <View style={styles.inputSection}>
          <View style={styles.labelContainer}>
            <Text style={styles.inputLabel}>Output Name</Text>
          </View>
          <Input
            placeholder="Name your audio file..."
            value={outputName}
            onChangeText={setOutputName}
            containerStyle={styles.inputContainerOverride}
            inputStyle={styles.inputStyleOverride}
            placeholderTextColor="#9CA3AF"
          />

          <View>
            <View style={styles.textInputHeader}>
              <Text style={styles.inputLabel}>Text to Speech</Text>
              {textInput.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    console.log('=== Clearing Text Input ===');
                    setTextInput('');
                    setCurrentHistoryIndex(-1);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={20} color={COLORS.gray[400]} />
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <Input
              placeholder="Type your message here..."
              value={textInput}
              onChangeText={setTextInput}
              multiline={true}
              numberOfLines={5}
              maxLength={500}
              containerStyle={styles.inputContainerOverride}
              inputStyle={styles.inputStyleOverride}
              placeholderTextColor="#9CA3AF"
              rightIcon={
                <View style={styles.micButtonContainer}>
                  {isRecording && (
                    <View style={styles.recordingIndicator} />
                  )}
                  <Ionicons
                    name={isRecording ? "stop-circle" : "mic"}
                    size={24}
                    color={isRecording ? "#ef4444" : COLORS.primary}
                  />
                </View>
              }
              onRightIconPress={handleMicPress}
            />
          </View>

          {/* Navigation Arrows Removed as per request */}
          {/* Navigation Arrows Removed as per request */}
          <View style={{ marginBottom: 4 }} />
        </View>

        {/* Voice and Language Selection */}
        <View style={styles.selectionSection}>
          <View style={styles.selectionRow}>
            <View style={styles.selectionItem}>
              <Text style={styles.selectionLabel}>Voice Selection</Text>
              <VoiceSelector
                selectedVoice={selectedVoice}
                onVoiceChange={setSelectedVoice}
                textColor="#1F2937"
                labelColor="#6B7280"
                style={styles.selectionButton}
              />
            </View>

            <View style={styles.selectionItem}>
              <Text style={styles.selectionLabel}>Language</Text>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                showFlag={false}
                textColor="#1F2937"
                style={styles.selectionButton}
              />
            </View>
          </View>
        </View>

        {/* Create Button Section */}
        <View style={styles.createSection}>
          <View style={styles.actionButtonsContainer}>
            {currentAudioUri && (
              <>
                <TouchableOpacity
                  style={styles.recreateButton}
                  onPress={() => {
                    console.log('=== Recreate Button Pressed ===');
                    console.log('Resetting to Create mode, keeping parameters');
                    setCurrentAudioUri(null);
                    setIsPlaying(false);
                    stopAudio();
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="refresh" size={20} color={COLORS.primary} />
                  <Text style={styles.recreateButtonText}>Recreate</Text>
                </TouchableOpacity>

                <Button
                  title={isPlaying ? 'Playing...' : 'Play'}
                  variant="primary"
                  style={{ flex: 1, backgroundColor: isPlaying ? '#22c55e' : COLORS.primary }}
                  onPress={handlePlayPause}
                  icon={
                    <Ionicons
                      name={isPlaying ? "pause-circle" : "play-circle"}
                      size={20}
                      color={COLORS.white}
                    />
                  }
                />
              </>
            )}
          </View>

          <TouchableOpacity
            style={styles.pastAudioButton}
            onPress={handlePastAudio}
          >
            <Ionicons name="time-outline" size={20} color={COLORS.gray[600]} />
            <Text style={styles.pastAudioText}>Past Audio</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Create Action */}
        {!currentAudioUri && (
          <Button
            title={isCreating ? "Creating..." : "Create Audio"}
            onPress={handleCreate}
            variant="primary"
            style={styles.mainCreateButton}
            disabled={isCreating || !textInput.trim()}
            loading={isCreating}
          />
        )}
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
    paddingBottom: 60, // Increased bottom padding to ensure buttons are visible above safe area/nav bar
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 8, // Reduced from 16 to pull inputs up
  },
  avatarContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
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
  mouthOverlay: {
    position: 'absolute',
    bottom: '20%',
    left: '25%',
    right: '25%',
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modeSelectButtonActive: {
    backgroundColor: 'rgba(19, 127, 236, 0.15)',
    borderColor: COLORS.primary,
  },
  modeSelectText: {
    fontSize: SIZES.body4,
    fontWeight: '600',
    color: '#1F2937', // Dark Text for visibility on white background
  },
  modeSelectTextActive: {
    color: COLORS.primary,
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
  inputSection: {
    marginBottom: 8, // Reduced from 12
  },
  labelContainer: {
    marginBottom: 8,
  },
  textInputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: SIZES.body3,
    fontWeight: '500',
    color: '#374151', // Dark Gray
  },
  inputContainerOverride: {
    marginBottom: SIZES.padding,
  },
  inputStyleOverride: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    color: '#1F2937', // Dark Text
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  clearButtonText: {
    fontSize: SIZES.body4,
    color: COLORS.gray[400],
  },
  micButtonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ef4444',
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  arrowButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB', // Light Gray
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButtonDisabled: {
    opacity: 0.4,
  },
  historyIndicator: {
    fontSize: SIZES.body4,
    color: COLORS.gray[400],
  },
  selectionSection: {
    marginBottom: 12,
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
    color: '#374151', // Dark Gray
    marginBottom: 8,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: SIZES.radius,
  },
  selectionButtonText: {
    fontSize: SIZES.body1,
    color: '#1F2937',
  },
  createSection: {
    paddingVertical: 12,
    gap: 8,
  },
  pastAudioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  pastAudioText: {
    fontSize: SIZES.body3,
    fontWeight: '500',
    color: '#374151',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    flex: 1,
    justifyContent: 'center',
  },
  createButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    gap: 4,
  },
  createButtonLoading: {
    backgroundColor: COLORS.gray[600],
  },
  createButtonActive: {
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
  },
  createButtonText: {
    fontSize: SIZES.body2,
    fontWeight: 'bold',
    color: COLORS.backgroundDark,
  },
  createButtonTextActive: {
    fontSize: SIZES.body3,
  },
  mainCreateButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#2D7F83',
  },
  recreateButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(19, 127, 236, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(19, 127, 236, 0.3)',
  },
  recreateButtonText: {
    fontSize: SIZES.body4,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default TextToSpeechScreen;

