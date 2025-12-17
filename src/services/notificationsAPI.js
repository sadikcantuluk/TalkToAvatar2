import apiClient from './apiClient';

const notificationsAPI = {
  // Get all notifications for the current user
  getAll: async (token) => {
    try {
      const response = await apiClient.get('/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new notification
  create: async (token, notificationData) => {
    try {
      const response = await apiClient.post('/notifications', {
        notification: notificationData,
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

  // Mark notification as read
  markAsRead: async (token, notificationId) => {
    try {
      // Backend controller implements `mark_read`
      const response = await apiClient.put(`/notifications/${notificationId}/mark_read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete a notification
  delete: async (token, notificationId) => {
    try {
      const response = await apiClient.delete(`/notifications/${notificationId}`, {
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

export default notificationsAPI;

