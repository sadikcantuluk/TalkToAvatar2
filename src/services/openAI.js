import axios from 'axios';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { OPENAI_API_KEY } from '@env';

const OPENAI_TTS_URL = 'https://api.openai.com/v1/audio/speech';
const OPENAI_STT_URL = 'https://api.openai.com/v1/audio/transcriptions';
const OPENAI_TRANSLATE_URL = 'https://api.openai.com/v1/chat/completions';

// Current playing sound instance
let currentSound = null;

// Language mapping for translation
const languageNames = {
  en: 'English',
  tr: 'Turkish',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ar: 'Arabic',
};

export const generateVoicePreview = async (voiceId) => {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found. Please add OPENAI_API_KEY to your .env file');
    }

    // Stop any currently playing sound immediately (non-blocking)
    if (currentSound) {
      currentSound.stopAsync().catch(() => {});
      currentSound.unloadAsync().catch(() => {});
      currentSound = null;
    }

    // Configure audio mode first (do this once)
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    // Sample text for preview (shorter for faster preview)
    const previewText = "Hello! This is a voice preview.";

    // Call OpenAI TTS API with faster model
    const response = await axios.post(
      OPENAI_TTS_URL,
      {
        model: 'tts-1', // Fast model
        voice: voiceId,
        input: previewText,
        speed: 1.0,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 10000, // Shorter timeout for faster feedback
      }
    );

    // Convert audio data to base64
    const base64Audio = btoa(
      new Uint8Array(response.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );

    // Create and play sound immediately
    const { sound } = await Audio.Sound.createAsync(
      { uri: `data:audio/mp3;base64,${base64Audio}` },
      { shouldPlay: true, volume: 1.0 }
    );

    currentSound = sound;

    // Set up completion callback
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
        currentSound = null;
      }
    });

    return { success: true, sound };
  } catch (error) {
    console.error('Voice preview error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

export const stopVoicePreview = async () => {
  if (currentSound) {
    try {
      // Stop immediately without waiting
      currentSound.stopAsync().catch(() => {});
      currentSound.unloadAsync().catch(() => {});
      currentSound = null;
    } catch (error) {
      console.error('Error stopping voice preview:', error);
    }
  }
};

// Generate Speech Only - NO translation (for Travel Assistant)
export const generateSpeechOnly = async (text, voiceId) => {
  try {
    console.log('=== OpenAI Speech Generation (No Translation) ===');
    console.log('Text length:', text.length);
    console.log('Text preview:', text.substring(0, 100) + '...');
    console.log('Voice ID:', voiceId);
    console.log('⚠️ Skipping translation - text is already in correct language');

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found');
    }

    // Configure audio mode
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    console.log('Calling OpenAI TTS API (direct, no translation)...');
    const response = await axios.post(
      OPENAI_TTS_URL,
      {
        model: 'tts-1-hd', // High quality model
        voice: voiceId,
        input: text,
        speed: 1.0,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 30000,
      }
    );

    console.log('TTS API response received. Size:', response.data.byteLength, 'bytes');

    // Convert audio data to base64
    const base64Audio = btoa(
      new Uint8Array(response.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );

    console.log('Audio converted to base64. Length:', base64Audio.length);

    // Save to file system
    const filename = `speech_${Date.now()}.mp3`;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    
    await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('✅ Speech saved to file:', fileUri);

    return {
      success: true,
      audioUri: fileUri,
      base64Audio,
    };
  } catch (error) {
    console.error('=== Speech Generation Error ===');
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error stack:', error.stack);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Text to Speech - Generate audio from text
export const generateTextToSpeech = async (text, voiceId, languageCode) => {
  try {
    console.log('=== OpenAI TTS Generation ===');
    console.log('Text length:', text.length);
    console.log('Voice ID:', voiceId);
    console.log('Language:', languageCode);

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found');
    }

    // Always translate text to selected language
    // This ensures the text is in the correct language regardless of input
    let finalText = text;
    console.log('🌐 Translating text to:', languageNames[languageCode] || languageCode);
    console.log('Original text preview:', text.substring(0, 100) + '...');
    
    const translateResult = await translateText(text, languageCode);
    if (translateResult.success) {
      finalText = translateResult.translatedText;
      console.log('✅ Translation successful. Translated text length:', finalText.length);
      console.log('Translated text preview:', finalText.substring(0, 100) + '...');
    } else {
      console.warn('⚠️  Translation failed, using original text');
      finalText = text;
    }

    // Configure audio mode
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    console.log('Calling OpenAI TTS API...');
    const response = await axios.post(
      OPENAI_TTS_URL,
      {
        model: 'tts-1-hd', // High quality model
        voice: voiceId,
        input: finalText,
        speed: 1.0,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 30000,
      }
    );

    console.log('TTS API response received. Size:', response.data.byteLength, 'bytes');

    // Convert audio data to base64
    const base64Audio = btoa(
      new Uint8Array(response.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );

    console.log('Audio converted to base64. Length:', base64Audio.length);

    // Save to file system
    const filename = `tts_${Date.now()}.mp3`;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    
    await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('Audio saved to file:', fileUri);

    return {
      success: true,
      audioUri: fileUri,
      base64Audio,
      translatedText: finalText,
    };
  } catch (error) {
    console.error('=== TTS Generation Error ===');
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error stack:', error.stack);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Speech to Text - Transcribe audio to text
export const transcribeAudio = async (audioUri, language = 'en') => {
  try {
    console.log('=== OpenAI STT Transcription ===');
    console.log('Audio URI:', audioUri);
    console.log('Expected language:', language);

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found');
    }

    // Read audio file
    const audioFile = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('Audio file read. Size:', audioFile.length);

    // Create form data
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: 'audio/mp3',
      name: 'recording.mp3',
    });
    formData.append('model', 'whisper-1');
    
    // IMPORTANT: Specify the language to improve accuracy
    // This tells Whisper what language to expect, dramatically improving results
    formData.append('language', language);
    
    console.log('Calling OpenAI STT API with language hint:', language);
    const response = await axios.post(OPENAI_STT_URL, formData, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });

    console.log('STT API response received');
    console.log('Transcribed text:', response.data.text);

    return {
      success: true,
      text: response.data.text,
    };
  } catch (error) {
    console.error('=== STT Transcription Error ===');
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error stack:', error.stack);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Translate text to target language
export const translateText = async (text, targetLanguage) => {
  try {
    console.log('=== OpenAI Translation ===');
    console.log('Text to translate:', text.substring(0, 100) + '...');
    console.log('Target language:', languageNames[targetLanguage]);

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found');
    }

    const targetLangName = languageNames[targetLanguage] || targetLanguage;

    console.log('Calling OpenAI Chat API for translation...');
    const response = await axios.post(
      OPENAI_TRANSLATE_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the given text to ${targetLangName}. Only respond with the translation, nothing else.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const translatedText = response.data.choices[0].message.content;
    console.log('Translation successful');
    console.log('Translated text:', translatedText.substring(0, 100) + '...');

    return {
      success: true,
      translatedText,
    };
  } catch (error) {
    console.error('=== Translation Error ===');
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error stack:', error.stack);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Play audio from URI or base64
export const playAudio = async (audioUri, onPlaybackComplete) => {
  try {
    console.log('=== Playing Audio ===');
    console.log('Audio URI:', audioUri);

    // Stop any currently playing sound
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    }

    // Configure audio mode
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    console.log('Creating sound object...');
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      { shouldPlay: true, volume: 1.0 }
    );

    currentSound = sound;
    console.log('Audio playback started');

    // Set up completion callback
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        console.log('Audio playback finished');
        sound.unloadAsync().catch(() => {});
        currentSound = null;
        if (onPlaybackComplete) {
          onPlaybackComplete();
        }
      }
    });

    return {
      success: true,
      sound,
    };
  } catch (error) {
    console.error('=== Audio Playback Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Stop currently playing audio
export const stopAudio = async () => {
  try {
    if (currentSound) {
      console.log('Stopping audio playback');
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    }
  } catch (error) {
    console.error('Error stopping audio:', error);
  }
};

// Start recording audio
export const startRecording = async () => {
  try {
    console.log('=== Starting Audio Recording ===');

    // Request permissions
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Audio recording permission not granted');
    }

    console.log('Permission granted');

    // Configure audio mode for recording
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    console.log('Creating recording object...');
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await recording.startAsync();

    console.log('Recording started');

    return {
      success: true,
      recording,
    };
  } catch (error) {
    console.error('=== Recording Start Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Stop recording and return audio URI
export const stopRecording = async (recording) => {
  try {
    console.log('=== Stopping Audio Recording ===');

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    console.log('Recording stopped. URI:', uri);

    // Reset audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    return {
      success: true,
      uri,
    };
  } catch (error) {
    console.error('=== Recording Stop Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  generateVoicePreview,
  stopVoicePreview,
  generateTextToSpeech,
  generateSpeechOnly,
  transcribeAudio,
  translateText,
  playAudio,
  stopAudio,
  startRecording,
  stopRecording,
};

