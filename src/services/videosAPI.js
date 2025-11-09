import apiClient from './apiClient';

const videosAPI = {
  // Get all videos for the current user
  getAll: async (token) => {
    try {
      const response = await apiClient.get('/videos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new video
  create: async (token, videoData) => {
    try {
      const response = await apiClient.post('/videos', {
        video: videoData,
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

  // Get a specific video
  getById: async (token, videoId) => {
    try {
      const response = await apiClient.get(`/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update a video
  update: async (token, videoId, videoData) => {
    try {
      const response = await apiClient.put(`/videos/${videoId}`, {
        video: videoData,
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

  // Delete a video
  delete: async (token, videoId) => {
    try {
      const response = await apiClient.delete(`/videos/${videoId}`, {
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

export default videosAPI;

