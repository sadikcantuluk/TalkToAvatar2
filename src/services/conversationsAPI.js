import apiClient from './apiClient';

const conversationsAPI = {
  // Get all conversations for the current user
  getAll: async (token) => {
    try {
      const response = await apiClient.get('/conversations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new conversation
  create: async (token, conversationData) => {
    try {
      const response = await apiClient.post('/conversations', {
        conversation: conversationData,
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

  // Get a specific conversation
  getById: async (token, conversationId) => {
    try {
      const response = await apiClient.get(`/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete a conversation
  delete: async (token, conversationId) => {
    try {
      const response = await apiClient.delete(`/conversations/${conversationId}`, {
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

export default conversationsAPI;

