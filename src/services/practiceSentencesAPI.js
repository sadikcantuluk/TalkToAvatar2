import apiClient from './apiClient';

const practiceSentencesAPI = {
  // Get all practice sentences with optional filters
  getAll: async (token, filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.language_code) params.append('language_code', filters.language_code);
      if (filters.level) params.append('level', filters.level);
      if (filters.topic) params.append('topic', filters.topic);

      const queryString = params.toString();
      const url = `/practice_sentences${queryString ? `?${queryString}` : ''}`;

      const response = await apiClient.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get a specific practice sentence
  getById: async (token, sentenceId) => {
    try {
      const response = await apiClient.get(`/practice_sentences/${sentenceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get practice sentences for a course
  getByCourse: async (token, courseId, topic = null) => {
    try {
      const params = new URLSearchParams();
      if (topic) params.append('topic', topic);

      const queryString = params.toString();
      const url = `/courses/${courseId}/practice_sentences${queryString ? `?${queryString}` : ''}`;

      const response = await apiClient.get(url, {
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

export default practiceSentencesAPI;

