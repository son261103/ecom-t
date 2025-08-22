import { apiClient } from './api';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ApiResponse,
} from '../types';

export class AuthService {
  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', userData);
  }

  async logout(): Promise<void> {
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Optional: Call backend logout endpoint if it exists
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Ignore errors on logout
      console.warn('Logout endpoint error:', error);
    }
  }

  // User profile endpoints
  async getUserProfile(): Promise<UserProfileResponse> {
    return apiClient.get<UserProfileResponse>('/user/profile');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse> {
    return apiClient.put<ApiResponse>('/user/profile', data);
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/auth/change-password', data);
  }

  // Token management
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  removeAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  // User data management
  setUserData(userData: any): void {
    localStorage.setItem('user_data', JSON.stringify(userData));
  }

  getUserData(): any | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  removeUserData(): void {
    localStorage.removeItem('user_data');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    const userData = this.getUserData();
    return !!(token && userData);
  }

    // Check if user has specific role
  hasRole(role: string): boolean {
    const userData = this.getUserData();
    if (!userData?.role) return false;
    
    // So sánh role đơn giản (cả hai đều uppercase)
    const userRole = userData.role.toUpperCase();
    const checkRole = role.toUpperCase();
    
    return userRole === checkRole;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  // Check if user is regular user
  isUser(): boolean {
    return this.hasRole('USER');
  }
}

// Create and export a singleton instance
export const authService = new AuthService();
export default authService;
