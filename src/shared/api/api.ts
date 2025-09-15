import axios from 'axios';
import i18n from '../i18n/i18n';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  headers: { 
    Accept: 'application/json', 
    'Content-Type': 'application/json' 
  },
  timeout: 10000, // 10 second timeout
});

const etags = new Map<string, string>();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  config.headers['Accept-Language'] = i18n.language || 'en';

  // Add ETag support for caching
  if (config.method === 'get' && config.url?.startsWith('/events')) {
    const key = (config.url || '') + JSON.stringify(config.params || {});
    const etag = etags.get(key);
    if (etag) {
      config.headers['If-None-Match'] = etag;
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    // Store ETag for caching
    const isEvents = response.config.url?.startsWith('/events') && response.config.method === 'get';
    const etag = response.headers?.etag;
    if (isEvents && etag) {
      const key = (response.config.url || '') + JSON.stringify(response.config.params || {});
      etags.set(key, etag);
    }
    
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    
    if (status === 401 || status === 419) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Enhance error messages
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (status >= 500) {
      error.message = 'Server error. Please try again later.';
    } else if (status === 404) {
      error.message = 'Resource not found.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

export default api;