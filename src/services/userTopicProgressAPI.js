import apiClient from './apiClient';

const userTopicProgressAPI = {
  // Get topic progress for a course
  getByCourse: async (token, courseId) => {
    try {
      console.log('📤 [DEBUG] userTopicProgressAPI.getByCourse called');
      console.log('📊 [DEBUG] Course ID:', courseId);

      const response = await apiClient.get(`/courses/${courseId}/topic_progress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ [DEBUG] Topic progress response:', {
        status: response.status,
        data: response.data
      });

      return response.data;
    } catch (error) {
      console.error('❌ [ERROR] userTopicProgressAPI.getByCourse failed:', error);
      console.error('❌ [ERROR] Error response:', error.response?.data);
      throw error.response?.data || error;
    }
  },

  // Update or create topic progress
  update: async (token, courseId, topic) => {
    try {
      console.log('📤 [DEBUG] userTopicProgressAPI.update called');
      console.log('📊 [DEBUG] Course ID:', courseId, 'Topic:', topic);

      const requestData = {
        user_topic_progress: {
          course_id: courseId,
          topic: topic,
        },
      };

      console.log('📤 [DEBUG] Request payload:', JSON.stringify(requestData, null, 2));

      const response = await apiClient.post('/user_topic_progress', requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ [DEBUG] Topic progress updated:', {
        status: response.status,
        data: response.data
      });

      return response.data;
    } catch (error) {
      console.error('❌ [ERROR] userTopicProgressAPI.update failed:', error);
      console.error('❌ [ERROR] Error response:', error.response?.data);
      throw error.response?.data || error;
    }
  },
};

export default userTopicProgressAPI;

