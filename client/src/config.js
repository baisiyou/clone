// API configuration
const getApiBaseUrl = () => {
  // In production, use the environment variable or default to Render backend
  const apiUrl = process.env.REACT_APP_API_URL || 'https://clone-i9i8.onrender.com/api';
  
  // Log for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('API Base URL:', apiUrl);
  }
  
  return apiUrl;
};

export const API_BASE_URL = getApiBaseUrl();

