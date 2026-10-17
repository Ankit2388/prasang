import { apiClient } from './api-client';
import { ApiResponse } from '@/types/api.types';
import { AuthResult, LoginUserInput, RegisterUserInput, User } from '@/types/auth.types';

export const authService = {
  async loginUser(input: LoginUserInput): Promise<AuthResult> {
    const response = await apiClient.post<ApiResponse<AuthResult>>('/auth/login/user', input);
    return response.data.data;
  },

  async registerUser(input: RegisterUserInput): Promise<AuthResult> {
    const response = await apiClient.post<ApiResponse<AuthResult>>('/auth/register/user', input);
    return response.data.data;
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network failure on logout
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('prasang_user_access_token');
        localStorage.removeItem('prasang_user_refresh_token');
        localStorage.removeItem('prasang_user_profile');
      }
    }
  },

  async sendOtp(mobileNumber: string, purpose = 'LOGIN') {
    const response = await apiClient.post<ApiResponse<{ otp?: string; message: string }>>('/auth/send-otp', {
      mobileNumber,
      purpose,
    });
    return response.data.data;
  },

  async verifyOtp(mobileNumber: string, otp: string, purpose = 'LOGIN') {
    const response = await apiClient.post<ApiResponse<{ verified: boolean; message: string }>>('/auth/verify-otp', {
      mobileNumber,
      otp,
      purpose,
    });
    return response.data.data;
  },
};
