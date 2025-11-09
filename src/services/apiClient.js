import axios from 'axios';

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
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60 saniye timeout (doubled for better UX)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - giden istekleri logla
apiClient.interceptors.request.use(
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

// Response interceptor - gelen cevapları logla ve retry yap
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const config = error.config;
    
    console.error('❌ Response Error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      retryCount: config.__retryCount || 0,
    });

    // Retry logic: 3 attempts with exponential backoff
    if (!config || !config.__retryCount) {
      config.__retryCount = 0;
    }

    // Retry only for network errors, timeouts, or 5xx errors
    const shouldRetry = 
      !error.response || // Network error
      error.code === 'ECONNABORTED' || // Timeout
      (error.response && error.response.status >= 500); // Server error

    if (shouldRetry && config.__retryCount < 3) {
      config.__retryCount += 1;
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, config.__retryCount - 1) * 1000;
      console.log(`🔄 Retrying request (attempt ${config.__retryCount}/3) after ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiClient(config);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

