import axios from 'axios';
import Constants from 'expo-constants';

// Rails API base URL
// Expo'da localhost kullanılamaz, bilgisayarın IP adresini kullanın
// Alternatif: Android emulator için 10.0.2.2, iOS simulator için localhost çalışır
const getApiUrl = () => {
  // Eğer environment variable varsa onu kullan
  if (process.env.RAILS_API_URL) {
    return process.env.RAILS_API_URL;
  }
  
  // Tüm platformlar için gerçek IP adresini kullan
  // 10.0.2.2 bazen sorun çıkarıyor, gerçek IP daha güvenilir
  return 'http://192.168.1.37:3000/api/v1';
};

const API_URL = getApiUrl();

// Debug: API URL'i console'a yazdır
console.log('🔗 API URL:', API_URL);

// Axios instance oluştur - timeout ve debug ekle
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 saniye timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - giden istekleri logla
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('📤 Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - gelen cevapları logla
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

const authAPI = {
  // Register new user
  register: async (username, email, password) => {
    try {
      console.log('🚀 Starting registration:', { username, email });
      
      const response = await axiosInstance.post('/auth/register', {
        user: {
          username,
          email,
          password,
        },
      });
      
      console.log('✅ Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Registration failed:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
      });
      throw error.response?.data || error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      console.log('🚀 Starting login:', { email });
      
      const response = await axiosInstance.post('/auth/login', {
        auth: {
          email,
          password,
        },
      });
      
      console.log('✅ Login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
      });
      throw error.response?.data || error;
    }
  },

  // Verify email with code
  verifyEmail: async (userId, code) => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify_email`, {
        user_id: userId,
        code,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Resend verification code
  resendVerification: async (userId) => {
    try {
      const response = await axios.post(`${API_URL}/auth/resend_verification`, {
        user_id: userId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Forgot password - send reset email
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot_password`, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reset password with token
  resetPassword: async (token, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset_password`, {
        token,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user profile
  getProfile: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update username
  updateProfile: async (token, username) => {
    try {
      const response = await axios.put(
        `${API_URL}/auth/update_profile`,
        {
          user: {
            username,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Change password
  changePassword: async (token, currentPassword, newPassword) => {
    try {
      const response = await axios.put(
        `${API_URL}/auth/change_password`,
        {
          password_change: {
            current_password: currentPassword,
            new_password: newPassword,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete account
  deleteAccount: async (token) => {
    try {
      console.log('🚀 Deleting account...');
      
      const response = await axios.delete(`${API_URL}/auth/delete_account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('✅ Account deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Delete account failed:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
      });
      throw error.response?.data || error;
    }
  },
};

export default authAPI;

