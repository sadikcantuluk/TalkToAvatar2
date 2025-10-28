import axios from 'axios';
import { Audio } from 'expo-av';
import { OPENAI_API_KEY } from '@env';

const OPENAI_TTS_URL = 'https://api.openai.com/v1/audio/speech';

// Current playing sound instance
let currentSound = null;

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

export default {
  generateVoicePreview,
  stopVoicePreview,
};

