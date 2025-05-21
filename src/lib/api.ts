import axios, { AxiosError } from 'axios';
import { API_CONFIG, AUTH_CONFIG, APP_CONFIG } from '../config';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

// Function to wake up the backend service
export const wakeUpBackend = async () => {
  try {
    const wakeupToast = toast.loading('Connecting to server...');
    
    // Try multiple URLs in sequence
    const urls = [API_CONFIG.BASE_URL, API_CONFIG.BACKUP_URL];
    
    for (const url of urls) {
      try {
        await axios.get(`${url}${API_CONFIG.WAKE_UP_ENDPOINT}`, {
          timeout: API_CONFIG.CONNECTION_TIMEOUT
        });
        toast.success('Connected to server successfully!', {
          id: wakeupToast,
          duration: 3000
        });
        return true;
      } catch (error) {
        console.log(`Failed to wake up ${url}, trying next...`);
        continue;
      }
    }
    
    toast.error('Unable to connect to the server. Please try again in a moment.', {
      id: wakeupToast,
      duration: 5000
    });
    return false;
  } catch (error) {
    console.error('Failed to wake up backend:', error);
    return false;
  }
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: API_CONFIG.CREDENTIALS
});

// Function to check if a URL is accessible
const isUrlAccessible = async (url: string) => {
  try {
    await axios.get(`${url}${API_CONFIG.WAKE_UP_ENDPOINT}`, {
      timeout: API_CONFIG.CONNECTION_TIMEOUT,
      headers: {
        'Origin': typeof window !== 'undefined' ? window.location.origin : APP_CONFIG.FRONTEND_URL
      }
    });
    return true;
  } catch (error: any) {
    if (error.response) {
      console.error('URL access error response:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('URL access network error:', error.message);
    }
    return false;
  }
};

// Function to get the best available API URL
const getBestApiUrl = async () => {
  // Try primary URL first
  if (await isUrlAccessible(API_CONFIG.BASE_URL)) {
    return API_CONFIG.BASE_URL;
  }
  
  // Try backup URL if primary fails
  if (await isUrlAccessible(API_CONFIG.BACKUP_URL)) {
    console.log('Using backup API URL');
    return API_CONFIG.BACKUP_URL;
  }
  
  // Try to wake up the service
  const isWakeupSuccessful = await wakeUpBackend();
  if (isWakeupSuccessful) {
    return API_CONFIG.BASE_URL;
  }
  
  throw new Error('No API endpoints are accessible');
};

// Add request interceptor to attach auth token and handle connection issues
api.interceptors.request.use(async (config) => {
  try {
    // Update baseURL to the best available endpoint
    config.baseURL = await getBestApiUrl();
    
    // Attach auth token
    if (typeof window !== 'undefined') {
      const token = Cookies.get(AUTH_CONFIG.TOKEN_KEY) || localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  } catch (error) {
    toast.error('Unable to connect to the server. The service might be starting up, please try again in a moment.');
    return Promise.reject(error);
  }
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
        
        try {
          // Try to wake up the service if it's a 503 (service unavailable)
          if (status === 503) {
            await wakeUpBackend();
          }

          // Try to get the best available API URL before retrying
          originalRequest.baseURL = await getBestApiUrl();
          
          // Exponential backoff
          const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, retryCount);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return api(originalRequest);
        } catch (error) {
          console.error('Failed to retry request:', error);
        }
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
      toast.error('Network error. The server might be starting up, please try again in a moment.');
      console.error('Network Error:', error.request);
      
      // Try to wake up the service
      try {
        await wakeUpBackend();
        if (originalRequest.baseURL === API_CONFIG.BASE_URL) {
          originalRequest.baseURL = API_CONFIG.BACKUP_URL;
          return api(originalRequest);
        }
      } catch (retryError) {
        console.error('Failed to retry with backup URL:', retryError);
      }
    } else {
      // Handle other errors
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api; 