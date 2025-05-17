import axios from 'axios';

// API configuration
const API_URL = 'http://127.0.0.1:8000/api';
const isBrowser = typeof window !== 'undefined';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Enable sending cookies with requests
});

// Add request interceptor to attach auth token
api.interceptors.request.use((config) => {
  if (isBrowser) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && isBrowser) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      // Handle 403 Forbidden errors
      if (error.response.status === 403) {
        window.location.href = '/unauthorized';
      }
      // Log detailed error information
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    return Promise.reject(error);
  }
);

export default api; 