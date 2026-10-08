import axios from 'axios';
import { authStorage } from './auth';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.jarabiz.com/api', //http://localhost:8000/api
});

// Interceptor to add Token to all requests
api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle 401 errors (Auto-Logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.logout();
    }
    return Promise.reject(error);
  }
);