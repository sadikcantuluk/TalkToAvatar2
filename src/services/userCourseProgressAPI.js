import apiClient from './apiClient';

const userCourseProgressAPI = {
  // Get all progress records for a user
  getAll: async (token, filters = {}) => {
    try {
      console.log('📤 [DEBUG] userCourseProgressAPI.getAll called');
      console.log('📊 [DEBUG] Filters:', filters);
      
      const params = new URLSearchParams();
      if (filters.course_id) {
        params.append('course_id', filters.course_id);
        console.log('✅ [DEBUG] Added course_id filter:', filters.course_id);
      }
      if (filters.topic) {
        params.append('topic', filters.topic);
        console.log('✅ [DEBUG] Added topic filter:', filters.topic);
      }
      if (filters.practice_sentence_id) {
        params.append('practice_sentence_id', filters.practice_sentence_id);
        console.log('✅ [DEBUG] Added practice_sentence_id filter:', filters.practice_sentence_id);
      }

      const queryString = params.toString();
      const url = `/user_course_progresses${queryString ? `?${queryString}` : ''}`;
      
      console.log('🌐 [DEBUG] Request URL:', url);

      const response = await apiClient.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('✅ [DEBUG] Response received:', {
        status: response.status,
        dataLength: Array.isArray(response.data) ? response.data.length : 'not array',
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ [ERROR] userCourseProgressAPI.getAll failed:', error);
      console.error('❌ [ERROR] Error response:', error.response?.data);
      throw error.response?.data || error;
    }
  },

  // Create or update progress
  create: async (token, progressData) => {
    try {
      console.log('📤 [DEBUG] userCourseProgressAPI.create called');
      console.log('📊 [DEBUG] Progress data:', progressData);
      
      const requestData = {
        user_course_progress: progressData,
      };
      
      console.log('📤 [DEBUG] Request payload:', JSON.stringify(requestData, null, 2));

      const response = await apiClient.post('/user_course_progresses', requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('✅ [DEBUG] Response received:', {
        status: response.status,
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ [ERROR] userCourseProgressAPI.create failed:', error);
      console.error('❌ [ERROR] Error response:', error.response?.data);
      console.error('❌ [ERROR] Error status:', error.response?.status);
      throw error.response?.data || error;
    }
  },

  // Update progress
  update: async (token, progressId, progressData) => {
    try {
      console.log('📤 [DEBUG] userCourseProgressAPI.update called');
      console.log('📊 [DEBUG] Progress ID:', progressId);
      console.log('📊 [DEBUG] Progress data:', progressData);
      
      const requestData = {
        user_course_progress: progressData,
      };
      
      console.log('📤 [DEBUG] Request payload:', JSON.stringify(requestData, null, 2));
      console.log('🌐 [DEBUG] Request URL:', `/user_course_progresses/${progressId}`);

      const response = await apiClient.put(`/user_course_progresses/${progressId}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('✅ [DEBUG] Response received:', {
        status: response.status,
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ [ERROR] userCourseProgressAPI.update failed:', error);
      console.error('❌ [ERROR] Error response:', error.response?.data);
      console.error('❌ [ERROR] Error status:', error.response?.status);
      throw error.response?.data || error;
    }
  },
};

export default userCourseProgressAPI;

