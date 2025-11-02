import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:8081/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('vetclinic_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      localStorage.removeItem('vetclinic_token');
      localStorage.removeItem('vetclinic_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
