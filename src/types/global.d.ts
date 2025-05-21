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

  export const toast: {
    (message: string | React.ReactNode, options?: ToastOptions): string;
    success: (message: string | React.ReactNode, options?: ToastOptions) => string;
    error: (message: string | React.ReactNode, options?: ToastOptions) => string;
    loading: (message: string | React.ReactNode, options?: ToastOptions) => string;
    dismiss: (toastId?: string) => void;
  };

  export default toast;
}

declare module '@/lib/api' {
  import { AxiosInstance } from 'axios';
  const api: AxiosInstance;
  export const wakeUpBackend: () => Promise<boolean>;
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
      sameSite: 'Lax' | 'lax' | 'Strict' | 'strict' | 'None' | 'none';
    };
  };

  export const APP_CONFIG: {
    FRONTEND_URL: string;
    ENV: string;
    IS_PRODUCTION: boolean;
  };
} 