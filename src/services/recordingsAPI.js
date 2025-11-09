import apiClient from './apiClient';

const recordingsAPI = {
  // Get all recordings for the current user
  getAll: async (token) => {
    try {
      const response = await apiClient.get('/recordings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new recording
  create: async (token, recordingData) => {
    try {
      const response = await apiClient.post('/recordings', {
        recording: recordingData,
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

  // Get a specific recording
  getById: async (token, recordingId) => {
    try {
      const response = await apiClient.get(`/recordings/${recordingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete a recording
  delete: async (token, recordingId) => {
    try {
      const response = await apiClient.delete(`/recordings/${recordingId}`, {
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

export default recordingsAPI;

