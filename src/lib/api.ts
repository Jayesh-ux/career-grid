// Lightweight fetch-based API client for User Service
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function getAuthToken(): string | null {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  status: number;
  payload: any;
  constructor(status: number, message: string, payload?: any) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function request<T>(path: string, opts: { method?: HttpMethod; body?: any; token?: string | null; headers?: Record<string, string> } = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const token = opts.token ?? getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method: opts.method || 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    credentials: 'include',
  });

  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new ApiError(res.status, message, data);
  }

  return data as T;
}

// Auth endpoints
export const AuthApi = {
  register: (body: { email: string; password: string; phone?: string; userType: string; name?: string }) =>
    request<string>('/api/v1/auth/register', { method: 'POST', body }),
  verifyRegistrationOtp: (body: { phone: string; otp: string }) =>
    request<{ token: string; userId: number; name: string; email: string; userType: string }>(
      '/api/v1/auth/verify-registration-otp', { method: 'POST', body }
    ),
  login: (body: { email: string; password: string }) =>
    request<string>('/api/v1/auth/login', { method: 'POST', body }),
  verifyLoginOtp: (body: { phone: string; otp: string }) =>
    request<{ token: string; userId: number; name: string; email: string; userType: string }>(
      '/api/v1/auth/verify-login-otp', { method: 'POST', body }
    ),
  resendOtp: (body: { phone: string; purpose: 'registration' | 'login' | 'password_reset' }) =>
    request<string>('/api/v1/auth/resend-otp', { method: 'POST', body }),
  forgotPassword: (body: { phone: string }) =>
    request<string>('/api/v1/auth/forgot-password', { method: 'POST', body }),
  verifyResetOtp: (body: { phone: string; otp: string }) =>
    request<string>('/api/v1/auth/verify-reset-otp', { method: 'POST', body }),
  resetPassword: (body: { resetToken: string; newPassword: string }) =>
    request<string>('/api/v1/auth/reset-password', { method: 'POST', body }),
  test: () => request<string>('/api/v1/auth/test'),
};

// User endpoints
export type UserResponse = {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  userType: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
};

export const UserApi = {
  me: () => request<UserResponse>('/api/v1/users/me'),
  updateMe: (body: { name?: string; email?: string; phone?: string }) =>
    request<UserResponse>('/api/v1/users/me', { method: 'PUT', body }),
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    request<string>('/api/v1/users/change-password', { method: 'POST', body }),
  requestPhoneVerification: () => request<string>('/api/v1/users/request-phone-verification', { method: 'POST' }),
  verifyUpdatedPhone: (body: { otp: string }) =>
    request<UserResponse>('/api/v1/users/verify-updated-phone', { method: 'POST', body }),
  deactivate: (body: { password: string; reason?: string }) =>
    request<string>('/api/v1/users/me', { method: 'DELETE', body }),
  loginHistory: (limit = 10) => request<any>(`/api/v1/users/login-history?limit=${limit}`),
};

export default { request, AuthApi, UserApi, ApiError };