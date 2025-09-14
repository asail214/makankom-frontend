import axios from 'axios';
import i18n from '../i18n/i18n';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ends with /api/v1
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

const etags = new Map<string, string>(); // simple in-memory etag cache

api.interceptors.request.use((config) => {
  const t = localStorage.getItem('token');
  if (t) config.headers.Authorization = `Bearer ${t}`;
  config.headers['Accept-Language'] = i18n.language || 'en';

  // send If-None-Match for public event GETs
  if (config.method === 'get' && config.url?.startsWith('/events')) {
    const key = (config.url || '') + JSON.stringify(config.params || {});
    const etag = etags.get(key);
    if (etag) config.headers['If-None-Match'] = etag;
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    // store ETag from events endpoints
    const isEvents = res.config.url?.startsWith('/events') && res.config.method === 'get';
    const etag = res.headers?.etag;
    if (isEvents && etag) {
      const key = (res.config.url || '') + JSON.stringify(res.config.params || {});
      etags.set(key, etag);
    }
    return res;
  },
  (err) => {
    const s = err?.response?.status;
    if (s === 401 || s === 419) {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      // optional: window.location.assign('/login/customer');
    }
    return Promise.reject(err);
  }
);

export default api;
