import axios, { AxiosError } from 'axios';
import { API_CONFIG, AUTH_CONFIG } from '../config';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: API_CONFIG.CREDENTIALS
});

// Add request interceptor to attach auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = Cookies.get(AUTH_CONFIG.TOKEN_KEY) || localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle retry logic
    if (error.response) {
      const status = error.response.status;
      const retryCount = (originalRequest as any)._retryCount || 0;

      // Retry on network errors or specific status codes
      if ((status === 408 || status === 429 || status >= 500) && retryCount < API_CONFIG.RETRY_ATTEMPTS) {
        (originalRequest as any)._retryCount = retryCount + 1;
        
        // Exponential backoff
        const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return api(originalRequest);
      }

      // Handle authentication errors
      if (status === 401) {
        // Clear auth data
        localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
        Cookies.remove(AUTH_CONFIG.TOKEN_KEY);
        localStorage.removeItem(AUTH_CONFIG.USER_KEY);
        Cookies.remove(AUTH_CONFIG.USER_KEY);

        // Show error message
        toast.error('Session expired. Please login again.');

        // Redirect to login if in browser
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }

      // Handle forbidden errors
      if (status === 403) {
        toast.error('You do not have permission to perform this action.');
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard';
        }
      }

      // Handle validation errors
      if (status === 422) {
        const errorData = error.response?.data as { errors?: Record<string, string[]> };
        if (errorData?.errors) {
          Object.values(errorData.errors).forEach((error) => {
            if (Array.isArray(error)) {
              error.forEach(message => toast.error(message));
            }
          });
        }
      }

      // Log detailed error information in development
      if (process.env.NODE_ENV !== 'production') {
        console.error('API Error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
          config: error.config
        });
      }
    } else if (error.request) {
      // Handle network errors
      toast.error('Network error. Please check your connection.');
      console.error('Network Error:', error.request);
    } else {
      // Handle other errors
      toast.error('An unexpected error occurred.');
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api; 