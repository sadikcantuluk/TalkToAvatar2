import apiClient from './apiClient';

const subjectsAPI = {
  // Get all subjects for the current user's courses
  getAll: async (token) => {
    try {
      const response = await apiClient.get('/subjects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get a specific subject
  getById: async (token, subjectId) => {
    try {
      const response = await apiClient.get(`/subjects/${subjectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new subject
  create: async (token, subjectData) => {
    try {
      const response = await apiClient.post('/subjects', {
        subject: subjectData,
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

  // Update a subject
  update: async (token, subjectId, subjectData) => {
    try {
      const response = await apiClient.put(`/subjects/${subjectId}`, {
        subject: subjectData,
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

  // Delete a subject
  delete: async (token, subjectId) => {
    try {
      const response = await apiClient.delete(`/subjects/${subjectId}`, {
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

export default subjectsAPI;

