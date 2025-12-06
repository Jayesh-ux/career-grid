import { userServiceClient, handleApiError } from '@/lib/apiClient';
import {
  UserResponse,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  OtpRequest,
  ForgotPasswordRequest,
  VerifyResetOtpRequest,
  ResetPasswordRequest,
  ResendOtpRequest,
  ChangePasswordRequest,
  UpdateUserRequest,
  DeactivateAccountRequest,
  VerifyUpdatedPhoneRequest,
  LoginHistoryResponse,
} from '@/api/types/user';

export const userService = {
  // Authentication
  register: async (data: RegisterRequest) => {
    try {
      const response = await userServiceClient.post('/auth/register', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  login: async (data: LoginRequest) => {
    try {
      const response = await userServiceClient.post('/auth/login', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  verifyRegistrationOtp: async (data: OtpRequest) => {
    try {
      const response = await userServiceClient.post('/auth/verify-registration-otp', data);
      return response.data as AuthResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  verifyLoginOtp: async (data: OtpRequest) => {
    try {
      const response = await userServiceClient.post('/auth/verify-login-otp', data);
      return response.data as AuthResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    try {
      const response = await userServiceClient.post('/auth/forgot-password', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  verifyResetOtp: async (data: VerifyResetOtpRequest) => {
    try {
      const response = await userServiceClient.post('/auth/verify-reset-otp', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    try {
      const response = await userServiceClient.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  resendOtp: async (data: ResendOtpRequest) => {
    try {
      const response = await userServiceClient.post('/auth/resend-otp', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // User Profile
  getCurrentUser: async () => {
    try {
      const response = await userServiceClient.get('/users/me');
      return response.data as UserResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  updateUser: async (data: UpdateUserRequest) => {
    try {
      const response = await userServiceClient.put('/users/me', data);
      return response.data as UserResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  deactivateAccount: async (data: DeactivateAccountRequest) => {
    try {
      const response = await userServiceClient.delete('/users/me', { data });
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  changePassword: async (data: ChangePasswordRequest) => {
    try {
      const response = await userServiceClient.post('/users/change-password', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Phone Verification
  requestPhoneVerification: async () => {
    try {
      const response = await userServiceClient.post('/users/request-phone-verification');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  verifyUpdatedPhone: async (data: VerifyUpdatedPhoneRequest) => {
    try {
      const response = await userServiceClient.post('/users/verify-updated-phone', data);
      return response.data as UserResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Login History
  getLoginHistory: async (limit: number = 10) => {
    try {
      const response = await userServiceClient.get('/users/login-history', {
        params: { limit },
      });
      return response.data as LoginHistoryResponse[];
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Health Check
  healthCheck: async () => {
    try {
      const response = await userServiceClient.get('/health');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  readinessCheck: async () => {
    try {
      const response = await userServiceClient.get('/health/ready');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },
};
