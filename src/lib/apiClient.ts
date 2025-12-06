import axios, { AxiosInstance, AxiosError } from 'axios';

// API Configuration
const API_CONFIG = {
  USER_SERVICE: 'http://localhost:8080/api/v1',
  PROFILE_SERVICE: 'http://localhost:8081/api/v1',
  JOB_SERVICE: 'http://localhost:8082/api/v1',
};

// Error handling
export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

export const handleApiError = (error: AxiosError): ApiError => {
  return {
    status: error.response?.status || 500,
    message: (error.response?.data as any)?.message || error.message,
    data: error.response?.data,
  };
};

// Create axios instances with interceptors
const createApiClient = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add token to headers
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - Handle errors
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle 401 - Token expired/invalid
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(handleApiError(error));
    }
  );

  return instance;
};

// Create service-specific clients
export const userServiceClient = createApiClient(API_CONFIG.USER_SERVICE);
export const profileServiceClient = createApiClient(API_CONFIG.PROFILE_SERVICE);
export const jobServiceClient = createApiClient(API_CONFIG.JOB_SERVICE);

// Export URLs for reference
export const API_URLS = API_CONFIG;
