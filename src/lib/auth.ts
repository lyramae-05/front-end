import axios from 'axios';
import { User } from '@/types/api';
import Cookies from 'js-cookie';
import { AUTH_CONFIG } from '@/config';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-49g6.onrender.com';

const isBrowser = typeof window !== 'undefined';

export const setAuthToken = (token: string) => {
  if (isBrowser) {
    try {
      // Store in both localStorage and cookies for redundancy
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
      Cookies.set(AUTH_CONFIG.TOKEN_KEY, token, AUTH_CONFIG.COOKIE_OPTIONS);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Error setting auth token:', error);
      // Fallback to just localStorage if cookie fails
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
};

export const setUser = (user: User) => {
  if (isBrowser) {
    try {
      const userStr = JSON.stringify(user);
      localStorage.setItem(AUTH_CONFIG.USER_KEY, userStr);
      Cookies.set(AUTH_CONFIG.USER_KEY, userStr, AUTH_CONFIG.COOKIE_OPTIONS);
      // Dispatch a storage event so other components can update
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error setting user data:', error);
      // Fallback to just localStorage if cookie fails
      const userStr = JSON.stringify(user);
      localStorage.setItem(AUTH_CONFIG.USER_KEY, userStr);
      window.dispatchEvent(new Event('storage'));
    }
  }
};

export const getUser = (): User | null => {
  if (isBrowser) {
    try {
      // Try cookie first, then localStorage
      const userStr = Cookies.get(AUTH_CONFIG.USER_KEY) || localStorage.getItem(AUTH_CONFIG.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

export const getAuthToken = (): string | null => {
  if (isBrowser) {
    // Try cookie first, then localStorage
    return Cookies.get(AUTH_CONFIG.TOKEN_KEY) || localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  if (isBrowser) {
    const token = getAuthToken();
    const user = getUser();
    return !!token && !!user;
  }
  return false;
};

export const isAdmin = (): boolean => {
  if (isBrowser) {
    const user = getUser();
    return user?.role === 'admin';
  }
  return false;
};

export const logout = () => {
  if (isBrowser) {
    // Clear localStorage
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    
    // Clear cookies
    Cookies.remove(AUTH_CONFIG.TOKEN_KEY, { path: '/' });
    Cookies.remove(AUTH_CONFIG.USER_KEY, { path: '/' });
    
    // Clear any other auth-related data
    localStorage.removeItem('redirect');
    Cookies.remove('redirect', { path: '/' });
    
    // Clear axios header
    delete axios.defaults.headers.common['Authorization'];
    
    // Dispatch a storage event so other components can update
    window.dispatchEvent(new Event('storage'));
  }
};

// Initialize auth state if token exists
if (isBrowser) {
  const token = getAuthToken();
  if (token) {
    // Set axios default header
    setAuthToken(token);
  }
}