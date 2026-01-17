import { userApi } from '../apiClient';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface RegisterRequest {
  email: string;
  password: string;
  phone: string;
  userType: 'JOBSEEKER' | 'EMPLOYER' | 'COMPANYADMIN' | 'SUPERADMIN';
  name: string;
}

export interface VerifyRegistrationOtpRequest {
  phone: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyLoginOtpRequest {
  phone: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  phone: string;
}

export interface VerifyResetOtpRequest {
  phone: string;
  otp: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

export interface ResendOtpRequest {
  phone: string;
  purpose: 'registration' | 'login' | 'passwordreset';
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
}

export interface DeactivateAccountRequest {
  password: string;
  reason: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  userType: string;
}

export interface UserResponse {
  userId: number;
  name: string;
  email: string;
  phone: string;
  userType: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface LoginHistoryResponse {
  loginId: number;
  phone: string;
  email: string;
  ipAddress: string;
  browser: string;
  loginTime: string;
  status: 'SUCCESS' | 'FAILED';
  failureReason: string | null;
}

// ============================================
// AUTHENTICATION ENDPOINTS (Public)
// ============================================

/**
 * Step 1: Register new user
 * Backend sends OTP to phone number
 */
export const registerUser = async (data: RegisterRequest): Promise<string> => {
  const response = await userApi.post<string>('/api/v1/auth/register', data);
  return response.data; // "OTP sent to phone. Please verify to complete registration."
};

/**
 * Step 2: Verify registration OTP
 * Returns JWT token on success
 */
export const verifyRegistrationOtp = async (
  data: VerifyRegistrationOtpRequest
): Promise<AuthResponse> => {
  const response = await userApi.post<AuthResponse>(
    '/api/v1/auth/verify-registration-otp',
    data
  );
  return response.data;
};

/**
 * Step 1: Login with email/password
 * Backend sends OTP to registered phone (2FA)
 */
export const loginUser = async (data: LoginRequest): Promise<string> => {
  const response = await userApi.post<string>('/api/v1/auth/login', data);
  return response.data; // "OTP sent to phone. Please verify to complete login."
};

/**
 * Step 2: Verify login OTP
 * Returns JWT token on success
 */
export const verifyLoginOtp = async (
  data: VerifyLoginOtpRequest
): Promise<AuthResponse> => {
  const response = await userApi.post<AuthResponse>(
    '/api/v1/auth/verify-login-otp',
    data
  );
  return response.data;
};

/**
 * Forgot password - Request OTP
 */
export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<string> => {
  const response = await userApi.post<string>('/api/v1/auth/forgot-password', data);
  return response.data; // "OTP sent to your phone. Please verify to reset password."
};

/**
 * Verify reset OTP - Get reset token
 */
export const verifyResetOtp = async (
  data: VerifyResetOtpRequest
): Promise<string> => {
  const response = await userApi.post<string>(
    '/api/v1/auth/verify-reset-otp',
    data
  );
  return response.data; // "OTP verified. Use the reset token to set new password: {RESETTOKEN}"
};

/**
 * Reset password with reset token
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<string> => {
  const response = await userApi.post<string>('/api/v1/auth/reset-password', data);
  return response.data; // "Password reset successful. You can now login with your new password."
};

/**
 * Resend OTP with rate limiting
 */
export const resendOtp = async (data: ResendOtpRequest): Promise<string> => {
  const response = await userApi.post<string>('/api/v1/auth/resend-otp', data);
  return response.data; // "New OTP sent to your phone for {purpose}"
};

// ============================================
// USER ACCOUNT MANAGEMENT (Protected - Requires JWT)
// ============================================

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await userApi.get<UserResponse>('/api/v1/users/me');
  return response.data;
};

/**
 * Update current user (name, email, phone)
 * Note: Changing email/phone requires re-verification
 */
export const updateCurrentUser = async (
  data: UpdateUserRequest
): Promise<UserResponse> => {
  const response = await userApi.put<UserResponse>('/api/v1/users/me', data);
  return response.data;
};

/**
 * Change password
 */
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<string> => {
  const response = await userApi.post<string>(
    '/api/v1/users/change-password',
    data
  );
  return response.data; // "Password changed successfully"
};

/**
 * Get login history with pagination
 */
export const getLoginHistory = async (
  limit: number = 10
): Promise<LoginHistoryResponse[]> => {
  const response = await userApi.get<LoginHistoryResponse[]>(
    `/api/v1/users/login-history?limit=${limit}`
  );
  return response.data;
};

/**
 * Deactivate account (soft delete)
 */
export const deactivateAccount = async (
  data: DeactivateAccountRequest
): Promise<string> => {
  const response = await userApi.delete<string>('/api/v1/users/me', { data });
  return response.data; // "Account deactivated successfully. You can reactivate by contacting support."
};

/**
 * Request phone verification after updating phone
 */
export const requestPhoneVerification = async (): Promise<string> => {
  const response = await userApi.post<string>(
    '/api/v1/users/request-phone-verification'
  );
  return response.data; // "OTP sent to your phone number"
};

/**
 * Verify updated phone with OTP
 */
export const verifyUpdatedPhone = async (otp: string): Promise<UserResponse> => {
  const response = await userApi.post<UserResponse>(
    '/api/v1/users/verify-updated-phone',
    { otp }
  );
  return response.data;
};

// ============================================
// NEWSLETTER (Public)
// ============================================

export interface NewsletterSubscribeRequest {
  email: string;
}

/**
 * Subscribe to newsletter
 */
export const subscribeNewsletter = async (
  data: NewsletterSubscribeRequest
): Promise<string> => {
  const response = await userApi.post<string>(
    '/api/v1/newsletter/subscribe',
    data
  );
  return response.data; // "Thanks for subscribing!"
};

// ============================================
// HEALTH CHECK (Public)
// ============================================

export const checkHealth = async () => {
  const response = await userApi.get('/api/v1/health');
  return response.data;
};

export const checkReadiness = async () => {
  const response = await userApi.get('/api/v1/health/ready');
  return response.data;
};
