import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (err) {
    return true;
  }
};

axiosInstance.interceptors.request.use(async (config) => {
  const tokens = JSON.parse(localStorage.getItem('authTokens'));
  if (tokens) {
    const isExpired = isTokenExpired(tokens.access);

    // Refresh if needed
    if (isExpired && tokens.refresh) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/token/refresh/`,
          { refresh: tokens.refresh }
        );
        tokens.access = res.data.access;
        localStorage.setItem('authTokens', JSON.stringify(tokens));
      } catch (err) {
        localStorage.removeItem('authTokens');
        window.location.href = '/login'; // Optional: auto-redirect to login
        return config;
      }
    }

    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
});

// Global error handling (e.g. 401)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      localStorage.getItem('authTokens')
    ) {
      localStorage.removeItem('authTokens');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
