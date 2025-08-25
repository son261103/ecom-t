import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Return the data property directly to simplify handling in services
        return response.data;
      },
      (error) => {
        if (error.response) {
          const { status, data } = error.response;
          
          switch (status) {
            case 401:
              // Unauthorized - clear token and redirect to login
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user_data');
              window.location.href = '/login';
              toast.error('Session expired. Please login again.');
              break;
            case 403:
              // Don't show toast for user-related 403 errors (user may not have data yet)
              if (!error.config?.url?.includes('/user/')) {
                toast.error('Access denied. You do not have permission to perform this action.');
              } else {
                console.log('User data access denied - may be new user or missing data');
              }
              break;
            case 404:
              toast.error('Resource not found.');
              break;
            case 422:
              // Validation errors
              if (data.errors) {
                Object.values(data.errors).forEach((error: any) => {
                  toast.error(error);
                });
              } else {
                toast.error(data.message || 'Validation error occurred.');
              }
              break;
            case 500:
              toast.error('Internal server error. Please try again later.');
              break;
            default:
              toast.error(data.message || 'An unexpected error occurred.');
          }
        } else if (error.request) {
          toast.error('Network error. Please check your connection.');
        } else {
          toast.error('An unexpected error occurred.');
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Generic HTTP methods
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put<T>(url, data, config);
  }

  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.patch<T>(url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete<T>(url, config);
  }

  // File upload method
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    };

    const response = await this.client.post<T>(url, formData, config);
    return response.data;
  }

  // Get axios instance for custom requests
  getClient(): AxiosInstance {
    return this.client;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;
