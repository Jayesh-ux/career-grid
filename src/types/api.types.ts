// Common API types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// User types
export type UserType = 'JOBSEEKER' | 'EMPLOYER' | 'COMPANYADMIN' | 'SUPERADMIN';

export interface UserResponse {
  userId: number;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  userType: UserType;
}
