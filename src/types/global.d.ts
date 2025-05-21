/// <reference types="react" />
/// <reference types="next" />

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare namespace React {
  interface FormEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }
}

declare module 'react-hot-toast' {
  export interface Toast {
    id: string;
    type: 'success' | 'error' | 'loading' | 'blank' | 'custom';
    message: string;
    icon?: React.ReactNode;
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  }

  export interface ToastOptions {
    id?: string;
    icon?: React.ReactNode;
    duration?: number;
    position?: Toast['position'];
    style?: React.CSSProperties;
    className?: string;
  }

  export function toast(message: string | React.ReactNode, options?: ToastOptions): string;
  export function success(message: string | React.ReactNode, options?: ToastOptions): string;
  export function error(message: string | React.ReactNode, options?: ToastOptions): string;
  export function loading(message: string | React.ReactNode, options?: ToastOptions): string;
  export function dismiss(toastId?: string): void;

  export default { toast, success, error, loading, dismiss };
}

declare module '@/lib/api' {
  import { AxiosInstance } from 'axios';
  const api: AxiosInstance;
  export default api;
}

declare module '@/config' {
  export const API_CONFIG: {
    BASE_URL: string;
    BACKUP_URL: string;
    TIMEOUT: number;
    CREDENTIALS: boolean;
    RETRY_ATTEMPTS: number;
    RETRY_DELAY: number;
    CONNECTION_TIMEOUT: number;
    WAKE_UP_ENDPOINT: string;
  };

  export const AUTH_CONFIG: {
    TOKEN_KEY: string;
    USER_KEY: string;
    COOKIE_OPTIONS: {
      secure: boolean;
      sameSite: string;
    };
  };

  export const APP_CONFIG: {
    FRONTEND_URL: string;
    ENV: string;
    IS_PRODUCTION: boolean;
  };
} 