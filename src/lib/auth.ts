import axios from 'axios';
import { User } from '@/types/api';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-49g6.onrender.com/api';

const isBrowser = typeof window !== 'undefined';

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    Cookies.set('token', token, { path: '/' });
    
    // Set axios default header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const setUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
    Cookies.set('user', JSON.stringify(user), { path: '/' });
    // Dispatch a storage event so other components can update
    window.dispatchEvent(new Event('storage'));
  }
};

export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
};

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    const token = getAuthToken();
    const user = getUser();
    return !!token && !!user;
  }
  return false;
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === 'admin';
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear cookies
    Cookies.remove('token', { path: '/' });
    Cookies.remove('user', { path: '/' });
    Cookies.remove('redirect', { path: '/' });
    
    // Clear axios header
    delete axios.defaults.headers.common['Authorization'];
    
    // Dispatch a storage event so other components can update
    window.dispatchEvent(new Event('storage'));
  }
};

// Initialize axios with token if it exists
if (isBrowser) {
  const token = getAuthToken();
  setAuthToken(token || '');
}