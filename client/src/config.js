// API configuration
const getApiBaseUrl = () => {
  // In production, use the environment variable or default to Render backend
  let apiUrl = process.env.REACT_APP_API_URL || 'https://clone-i9i8.onrender.com/api';
  
  // Ensure the URL ends with /api
  if (!apiUrl.endsWith('/api')) {
    // If it doesn't end with /api, add it
    if (apiUrl.endsWith('/')) {
      apiUrl = apiUrl + 'api';
    } else {
      apiUrl = apiUrl + '/api';
    }
  }
  
  // Log for debugging
  console.log('API Base URL:', apiUrl);
  
  return apiUrl;
};

export const API_BASE_URL = getApiBaseUrl();

