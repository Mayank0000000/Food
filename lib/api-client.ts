import { ENV } from '@/config/env';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

// API Error interface
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: ENV.GITHUB_API_BASE_URL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    this.setupInterceptors();
  }

  private decodeBase64Utf8(base64Content: string): string {
    const binary = atob(base64Content);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  }

  private encodeBase64Utf8(content: string): string {
    const bytes = new TextEncoder().encode(content);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (ENV.GITHUB_TOKEN) {
          config.headers.Authorization = `Bearer ${ENV.GITHUB_TOKEN}`;
        }


        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response in development

        return response;
      },
      (error) => {
        // Handle common errors
        const apiError: ApiError = {
          message: 'An unexpected error occurred',
          status: error.response?.status,
          code: error.code,
        };

        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;
          
          switch (status) {
            case 401:
              apiError.message = 'Unauthorized access. Please check your credentials.';
              break;
            case 403:
              apiError.message = 'Access forbidden. You don\'t have permission.';
              break;
            case 404:
              apiError.message = 'Resource not found.';
              break;
            case 422:
              apiError.message = data?.message || 'Validation error occurred.';
              break;
            case 500:
              apiError.message = 'Internal server error. Please try again later.';
              break;
            default:
              apiError.message = data?.message || `Request failed with status ${status}`;
          }
        } else if (error.request) {
          // Network error
          apiError.message = 'Network error. Please check your internet connection.';
        }

        // Only log unexpected errors — 409 conflicts and 404 not found are handled by retry logic upstream
        if (apiError.status !== 409 && apiError.status !== 404) {
          console.error('❌ API Error:', apiError);
        }
        return Promise.reject(apiError);
      }
    );
  }

  // Generic HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // GitHub specific methods
  async getGitHubFile(filePath: string): Promise<any> {
    try {
      const url = `/repos/${ENV.GITHUB_REPO_OWNER}/${ENV.GITHUB_REPO_NAME}/contents/${filePath}`;
      const response = await this.get(url);
      
      if (response.content) {
        const decodedContent = this.decodeBase64Utf8(response.content);
        return JSON.parse(decodedContent);
      }
      
      return null;
    } catch (error: any) {
      if (error.status === 404) {
        // File doesn't exist, return empty array for JSON files
        return [];
      }
      throw error;
    }
  }

  async updateGitHubFile(filePath: string, content: any, message: string = 'Update file', retryCount: number = 0): Promise<void> {
    const MAX_RETRIES = 3;
    
    try {
      const url = `/repos/${ENV.GITHUB_REPO_OWNER}/${ENV.GITHUB_REPO_NAME}/contents/${filePath}`;
      
      // Get current file SHA if it exists
      let sha: string | undefined;
      try {
        const currentFile = await this.get(url);
        sha = currentFile.sha;
      } catch (error: any) {
        // File might not exist, that's okay
        if (error.status !== 404) {
          throw error;
        }
      }

      const encodedContent = this.encodeBase64Utf8(JSON.stringify(content, null, 2));
      
      const body: any = {
        message,
        content: encodedContent,
      };

      if (sha) {
        body.sha = sha;
      }

      await this.put(url, body);
    } catch (error: any) {
      // Handle 409 conflict - file was updated by another process
      if (error.status === 409 && retryCount < MAX_RETRIES) {
        // Wait a bit before retrying to avoid race conditions
        await new Promise(resolve => setTimeout(resolve, 500 * (retryCount + 1)));
        return this.updateGitHubFile(filePath, content, message, retryCount + 1);
      }
      
      console.error('Error updating GitHub file:', error);
      throw error;
    }
  }

  // Utility method to set auth token dynamically
  setAuthToken(token: string) {
    this.client.defaults.headers.Authorization = `Bearer ${token}`;
  }

  // Utility method to remove auth token
  removeAuthToken() {
    delete this.client.defaults.headers.Authorization;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
