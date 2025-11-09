import apiClient from './apiClient';

const audiosAPI = {
  // Get all audios for the current user
  getAll: async (token) => {
    try {
      const response = await apiClient.get('/audios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new audio
  create: async (token, audioData) => {
    try {
      const response = await apiClient.post('/audios', {
        audio: audioData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get a specific audio
  getById: async (token, audioId) => {
    try {
      const response = await apiClient.get(`/audios/${audioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete an audio
  delete: async (token, audioId) => {
    try {
      const response = await apiClient.delete(`/audios/${audioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default audiosAPI;

