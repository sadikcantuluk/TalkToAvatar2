import axios from 'axios';
import { RAILS_API_URL } from '@env';

// Base API configuration
const apiClient = axios.create({
  baseURL: RAILS_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

/**
 * Get sentences by level and language
 * @param {string} level - Language level (A1, A2, B1, B2, C1, C2)
 * @param {string} language - Language code (en, tr, etc.)
 * @returns {Promise<Array>} Array of sentence objects
 */
export const getSentencesByLevel = async (level, language = 'en') => {
  try {
    console.log('=== Fetching Sentences from Backend ===');
    console.log('Level:', level);
    console.log('Language:', language);

    const response = await apiClient.get('/sentences', {
      params: { level, language },
    });

    console.log('Sentences loaded:', response.data.length);
    return {
      success: true,
      sentences: response.data,
    };
  } catch (error) {
    console.error('Get sentences error:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      sentences: [],
    };
  }
};

/**
 * Create a new recording
 * @param {Object} recordingData - Recording data
 * @param {string} recordingData.user_id - User ID
 * @param {string} recordingData.audio_url - Audio file URL (Supabase storage)
 * @param {string} recordingData.transcript - Whisper transcription result
 * @param {string} recordingData.reference_text - Original sentence
 * @param {number} recordingData.score - Pronunciation score
 * @param {string} recordingData.level - Language level
 * @returns {Promise<Object>} Created recording object
 */
export const createRecording = async (recordingData) => {
  try {
    console.log('=== Creating Recording in Backend ===');
    console.log('Data:', recordingData);

    const response = await apiClient.post('/recordings', {
      recording: recordingData,
    });

    console.log('Recording created:', response.data.id);
    return {
      success: true,
      recording: response.data,
    };
  } catch (error) {
    console.error('Create recording error:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Get user recordings
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of recording objects
 */
export const getUserRecordings = async (userId) => {
  try {
    console.log('=== Fetching User Recordings ===');
    console.log('User ID:', userId);

    const response = await apiClient.get(`/recordings/${userId}`);

    console.log('Recordings loaded:', response.data.length);
    return {
      success: true,
      recordings: response.data,
    };
  } catch (error) {
    console.error('Get recordings error:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      recordings: [],
    };
  }
};

/**
 * Delete a recording
 * @param {string} recordingId - Recording ID
 * @returns {Promise<Object>} Success status
 */
export const deleteRecording = async (recordingId) => {
  try {
    console.log('=== Deleting Recording ===');
    console.log('Recording ID:', recordingId);

    await apiClient.delete(`/recordings/${recordingId}`);

    console.log('Recording deleted successfully');
    return {
      success: true,
    };
  } catch (error) {
    console.error('Delete recording error:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Evaluate pronunciation using backend Whisper integration
 * @param {string} audioUrl - Audio file URL (Supabase storage)
 * @param {string} referenceText - Original sentence
 * @returns {Promise<Object>} Evaluation result with score and feedback
 */
export const evaluatePronunciation = async (audioUrl, referenceText) => {
  try {
    console.log('=== Evaluating Pronunciation via Backend ===');
    console.log('Audio URL:', audioUrl);
    console.log('Reference:', referenceText);

    const response = await apiClient.post('/evaluate', {
      audio_url: audioUrl,
      reference_text: referenceText,
    });

    console.log('Evaluation complete. Score:', response.data.score);
    return {
      success: true,
      transcript: response.data.transcript,
      score: response.data.score,
      feedback: response.data.feedback,
    };
  } catch (error) {
    console.error('Evaluate pronunciation error:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Upload audio file to Supabase storage via backend
 * @param {string} localAudioUri - Local audio file URI
 * @param {string} fileName - File name
 * @returns {Promise<string>} Supabase storage URL
 */
export const uploadAudioToStorage = async (localAudioUri, fileName) => {
  try {
    console.log('=== Uploading Audio to Storage ===');
    console.log('Local URI:', localAudioUri);
    console.log('File name:', fileName);

    // Create form data
    const formData = new FormData();
    formData.append('audio', {
      uri: localAudioUri,
      type: 'audio/m4a',
      name: fileName,
    });

    const response = await apiClient.post('/upload_audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Audio uploaded:', response.data.url);
    return {
      success: true,
      url: response.data.url,
    };
  } catch (error) {
    console.error('Upload audio error:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Create or get user
 * @param {Object} userData - User data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @returns {Promise<Object>} User object
 */
export const createOrGetUser = async (userData) => {
  try {
    console.log('=== Creating/Getting User ===');
    console.log('User data:', userData);

    const response = await apiClient.post('/users', {
      user: userData,
    });

    console.log('User:', response.data.id);
    return {
      success: true,
      user: response.data,
    };
  } catch (error) {
    console.error('Create/get user error:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

export default {
  getSentencesByLevel,
  createRecording,
  getUserRecordings,
  deleteRecording,
  evaluatePronunciation,
  uploadAudioToStorage,
  createOrGetUser,
};

