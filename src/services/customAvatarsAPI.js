import apiClient from './apiClient';

const customAvatarsAPI = {
  // Get all custom avatars for the current user
  getAll: async (token) => {
    try {
      const response = await apiClient.get('/custom_avatars', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new custom avatar
  create: async (token, avatarData) => {
    try {
      const response = await apiClient.post('/custom_avatars', {
        custom_avatar: avatarData,
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

  // Get a specific custom avatar
  getById: async (token, avatarId) => {
    try {
      const response = await apiClient.get(`/custom_avatars/${avatarId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete a custom avatar
  delete: async (token, avatarId) => {
    try {
      const response = await apiClient.delete(`/custom_avatars/${avatarId}`, {
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

export default customAvatarsAPI;

