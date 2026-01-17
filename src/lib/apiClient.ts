import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Base URLs from environment variables
const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;
const PROFILE_SERVICE_URL = import.meta.env.VITE_PROFILE_SERVICE_URL;
const JOB_SERVICE_URL = import.meta.env.VITE_JOB_SERVICE_URL;
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

// Create axios instances for each service
const createServiceClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add JWT token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - Handle errors
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Export service clients
export const userServiceClient = createServiceClient(USER_SERVICE_URL);
export const profileServiceClient = createServiceClient(PROFILE_SERVICE_URL);
export const jobServiceClient = createServiceClient(JOB_SERVICE_URL);

// Helper function to handle API calls
export const apiCall = async <T>(
  apiFunc: () => Promise<any>
): Promise<T> => {
  try {
    const response = await apiFunc();
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
