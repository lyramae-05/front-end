export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://backend-49g6.onrender.com/api',
  BACKUP_URL: 'https://backend-49g6.onrender.com/api',
  TIMEOUT: 60000, // Reduced to 1 minute
  CREDENTIALS: true,
  RETRY_ATTEMPTS: 3, // Reduced retry attempts
  RETRY_DELAY: 1000, // Reduced retry delay
  CONNECTION_TIMEOUT: 15000, // Reduced to 15 seconds
  WAKE_UP_ENDPOINT: '/health', // Endpoint to wake up the service
};

export const APP_CONFIG = {
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://front-end-eight-roan.vercel.app',
  ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

export const AUTH_CONFIG = {
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  COOKIE_OPTIONS: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as 'lax'
  },
}; 