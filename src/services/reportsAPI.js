import apiClient from './apiClient';

const reportsAPI = {
  // Get all reports for the current user's courses
  getAll: async (token) => {
    try {
      const response = await apiClient.get('/reports', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get a specific report
  getById: async (token, reportId) => {
    try {
      const response = await apiClient.get(`/reports/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new report
  create: async (token, reportData) => {
    try {
      const response = await apiClient.post('/reports', {
        report: reportData,
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

  // Update a report
  update: async (token, reportId, reportData) => {
    try {
      const response = await apiClient.put(`/reports/${reportId}`, {
        report: reportData,
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

  // Delete a report
  delete: async (token, reportId) => {
    try {
      const response = await apiClient.delete(`/reports/${reportId}`, {
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

export default reportsAPI;

