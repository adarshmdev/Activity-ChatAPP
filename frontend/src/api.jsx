import axios from 'axios';
import store from './store';
import { logout } from './redux/authSlice';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized responses
      if (error.response.status === 401) {
        store.dispatch(logout());
      }
      
      // Handle 403 Forbidden responses
      if (error.response.status === 403) {
        console.error('Access forbidden');
      }

      // Handle 404 Not Found responses
      if (error.response.status === 404) {
        console.error('Resource not found');
      }

      // Handle 500 Internal Server Error responses
      if (error.response.status >= 500) {
        console.error('Server error');
      }

      // Return the error response data if it exists
      if (error.response.data) {
        return Promise.reject(error.response.data);
      }
    }

    // Handle network errors
    if (error.request) {
      console.error('Network error');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default API;