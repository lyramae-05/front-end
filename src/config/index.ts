export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://backend-49g6.onrender.com',
  BACKUP_URL: 'https://backend-49g6.onrender.com',
  TIMEOUT: 180000, // 3 minutes for cold starts
  CREDENTIALS: true,
  RETRY_ATTEMPTS: 8,
  RETRY_DELAY: 3000,
  CONNECTION_TIMEOUT: 30000, // 30 seconds
  WAKE_UP_ENDPOINT: '/api/health', // Endpoint to wake up the service
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
    sameSite: 'none' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : 'localhost'
  },
}; 