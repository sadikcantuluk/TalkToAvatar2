import apiClient from './apiClient';

const analysesAPI = {
  // Get all analyses for the current user's courses
  getAll: async (token) => {
    try {
      const response = await apiClient.get('/analyses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get a specific analysis
  getById: async (token, analysisId) => {
    try {
      const response = await apiClient.get(`/analyses/${analysisId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new analysis
  create: async (token, analysisData) => {
    try {
      const response = await apiClient.post('/analyses', {
        analysis: analysisData,
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

  // Update an analysis
  update: async (token, analysisId, analysisData) => {
    try {
      const response = await apiClient.put(`/analyses/${analysisId}`, {
        analysis: analysisData,
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

  // Delete an analysis
  delete: async (token, analysisId) => {
    try {
      const response = await apiClient.delete(`/analyses/${analysisId}`, {
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

export default analysesAPI;

