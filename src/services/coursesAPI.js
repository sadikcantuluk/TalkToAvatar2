import apiClient from './apiClient';

const coursesAPI = {
  // Get all courses for the current user
  getAll: async (token) => {
    console.log('🎯 [coursesAPI] getAll called');
    console.log('🔑 [coursesAPI] Token:', token ? token.substring(0, 20) + '...' : 'missing');

    try {
      console.log('📤 [coursesAPI] Making GET request to /courses');
      
      const response = await apiClient.get('/courses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('✅ [coursesAPI] Request successful');
      console.log('📦 [coursesAPI] Response status:', response.status);
      console.log('📦 [coursesAPI] Response data type:', Array.isArray(response.data) ? 'array' : typeof response.data);
      console.log('📦 [coursesAPI] Response data length:', Array.isArray(response.data) ? response.data.length : 'N/A');
      console.log('📦 [coursesAPI] Response data:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('❌ [coursesAPI] Request failed');
      console.error('❌ [coursesAPI] Error type:', error?.constructor?.name);
      console.error('❌ [coursesAPI] Error message:', error?.message);
      console.error('❌ [coursesAPI] Error response status:', error?.response?.status);
      console.error('❌ [coursesAPI] Error response data:', error?.response?.data);
      console.error('❌ [coursesAPI] Full error:', JSON.stringify(error, null, 2));
      
      throw error.response?.data || error;
    }
  },

  // Get a specific course
  getById: async (token, courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new course
  create: async (token, courseData) => {
    console.log('🎯 [coursesAPI] create called');
    console.log('📊 [coursesAPI] Course data:', JSON.stringify(courseData, null, 2));
    console.log('🔑 [coursesAPI] Token:', token ? token.substring(0, 20) + '...' : 'missing');

    try {
      console.log('📤 [coursesAPI] Making POST request to /courses');
      console.log('📤 [coursesAPI] Request body:', JSON.stringify({ course: courseData }, null, 2));
      
      const response = await apiClient.post('/courses', {
        course: courseData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('✅ [coursesAPI] Request successful');
      console.log('📦 [coursesAPI] Response status:', response.status);
      console.log('📦 [coursesAPI] Response data:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('❌ [coursesAPI] Request failed');
      console.error('❌ [coursesAPI] Error type:', error?.constructor?.name);
      console.error('❌ [coursesAPI] Error message:', error?.message);
      console.error('❌ [coursesAPI] Error response status:', error?.response?.status);
      console.error('❌ [coursesAPI] Error response data:', error?.response?.data);
      console.error('❌ [coursesAPI] Full error:', JSON.stringify(error, null, 2));
      
      // Return a more detailed error
      const errorData = error.response?.data || error.message || error;
      throw errorData;
    }
  },

  // Update a course
  update: async (token, courseId, courseData) => {
    try {
      const response = await apiClient.put(`/courses/${courseId}`, {
        course: courseData,
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

  // Delete a course
  delete: async (token, courseId) => {
    try {
      const response = await apiClient.delete(`/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get course subjects
  getSubjects: async (token, courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/subjects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get course videos
  getVideos: async (token, courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/videos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get course reports
  getReports: async (token, courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get course analyses
  getAnalyses: async (token, courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/analyses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get course recordings
  getRecordings: async (token, courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/recordings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get course progress
  getProgress: async (token, courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/progress`, {
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

export default coursesAPI;

