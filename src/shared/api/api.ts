import axios, { type AxiosResponse } from 'axios';
import i18n from '../i18n/i18n'; // Use relative path for now

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  // Add auth token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add language header
  config.headers['Accept-Language'] = i18n.language || 'en';
  
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status = error?.response?.status;
    
    // Handle auth errors
    if (status === 401 || status === 419) {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle rate limiting
    if (status === 429) {
      const resetTime = error.response?.headers['X-RateLimit-Reset'];
      if (resetTime) {
        const resetDate = new Date(parseInt(resetTime) * 1000);
        console.log('Rate limited. Reset at:', resetDate);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;