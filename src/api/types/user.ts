// User Service Types - Generated from OpenAPI spec
export interface UserResponse {
  userId: number;
  name: string;
  email: string;
  phone: string;
  userType: 'JOBSEEKER' | 'EMPLOYER' | 'COMPANY_ADMIN' | 'SUPER_ADMIN';
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  userType: 'JOBSEEKER' | 'EMPLOYER' | 'COMPANY_ADMIN' | 'SUPER_ADMIN';
}

export interface RegisterRequest {
  email: string;
  password: string;
  phone: string;
  userType: 'JOBSEEKER' | 'EMPLOYER' | 'COMPANY_ADMIN' | 'SUPER_ADMIN';
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OtpRequest {
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
  purpose: 'registration' | 'login' | 'password_reset';
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
  reason?: string;
}

export interface VerifyUpdatedPhoneRequest {
  otp: string;
}

export interface LoginHistoryResponse {
  loginId: number;
  phone: string;
  email: string;
  ipAddress: string;
  browser: string;
  loginTime: string;
  status: 'SUCCESS' | 'FAILED';
  failureReason?: string;
}
