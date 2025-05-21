export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://backend-49g6.onrender.com/api',
  TIMEOUT: 30000,
  CREDENTIALS: true,
};

export const APP_CONFIG = {
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
}; 