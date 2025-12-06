/**
 * Complete Backend API Client
 * Integrates User Service, Auth Service, and Profile Service
 * All endpoints, types, and utilities in one consolidated file
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const USER_SERVICE_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const PROFILE_SERVICE_BASE_URL = import.meta.env.VITE_PROFILE_API_BASE_URL || 'http://localhost:8081';

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

async function request<T>(
  path: string,
  baseUrl: string,
  opts: { method?: HttpMethod; body?: any; token?: string | null; headers?: Record<string, string> } = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
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

// Re-export generated OpenAPI enums/types so the app uses a single canonical source
export {
  Gender,
  NoticePeriod,
  ProficiencyLevel,
  EmploymentType,
  EmploymentStatus,
  ReviewStatus,
  CompanySize as CompanySizeEnum,
  EmployerCompanySize,
} from '@/api/types/openapi';

import type * as OpenApiTypes from '@/api/types/openapi';

// ============================================================================
// USER SERVICE TYPES
// ============================================================================

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

export type AuthTokenResponse = {
  token: string;
  userId: number;
  name: string;
  email: string;
  userType: string;
};

// ============================================================================
// PROFILE SERVICE TYPES
// ============================================================================

// Jobseeker Profile (use generated OpenAPI types)
export type JobseekerProfileResponse = OpenApiTypes.JobseekerProfileResponse;
export type CreateJobseekerProfileRequest = OpenApiTypes.CreateJobseekerProfileRequest;
export type UpdateJobseekerProfileRequest = OpenApiTypes.UpdateJobseekerProfileRequest;

// Work Experience (use generated OpenAPI types)
export type WorkExperienceResponse = OpenApiTypes.WorkExperienceResponse;
export type AddWorkExperienceRequest = OpenApiTypes.AddWorkExperienceRequest;
export type UpdateWorkExperienceRequest = OpenApiTypes.UpdateWorkExperienceRequest;

// Education (use generated OpenAPI types)
export type EducationResponse = OpenApiTypes.EducationResponse;
export type AddEducationRequest = OpenApiTypes.AddEducationRequest;
export type UpdateEducationRequest = OpenApiTypes.UpdateEducationRequest;

// Skills (use generated OpenAPI types)
export type SkillResponse = OpenApiTypes.SkillResponse;
export type JobseekerSkillResponse = OpenApiTypes.JobseekerSkillResponse;
export type AddSkillRequest = OpenApiTypes.AddSkillRequest;

// Company
export type CompanyResponse = OpenApiTypes.CompanyResponse;

export type CreateCompanyRequest = OpenApiTypes.CreateCompanyRequest;

export type UpdateCompanyRequest = OpenApiTypes.UpdateCompanyRequest;

// Company Review (use generated OpenAPI types)
export type CompanyReviewResponse = OpenApiTypes.CompanyReviewResponse;
export type CreateCompanyReviewRequest = OpenApiTypes.CreateCompanyReviewRequest;

// Employer Profile (use generated OpenAPI types)
export type EmployerProfileResponse = OpenApiTypes.EmployerProfileResponse;
export type CreateEmployerProfileRequest = OpenApiTypes.CreateEmployerProfileRequest;
export type UpdateEmployerProfileRequest = OpenApiTypes.UpdateEmployerProfileRequest;

// Pagination
export interface PageParams {
  page?: number;
  size?: number;
}

export type PaginatedResponse<T> = OpenApiTypes.PagedResponse<T>;

// ============================================================================
// AUTH SERVICE ENDPOINTS
// ============================================================================

export const AuthApi = {
  register: (body: { email: string; password: string; phone?: string; userType: string; name?: string }) =>
    request<string>('/api/v1/auth/register', USER_SERVICE_BASE_URL, { method: 'POST', body }),
  
  verifyRegistrationOtp: (body: { phone: string; otp: string }) =>
    request<AuthTokenResponse>('/api/v1/auth/verify-registration-otp', USER_SERVICE_BASE_URL, {
      method: 'POST',
      body,
    }),
  
  login: (body: { email: string; password: string }) =>
    request<string>('/api/v1/auth/login', USER_SERVICE_BASE_URL, { method: 'POST', body }),
  
  verifyLoginOtp: (body: { phone: string; otp: string }) =>
    request<AuthTokenResponse>('/api/v1/auth/verify-login-otp', USER_SERVICE_BASE_URL, {
      method: 'POST',
      body,
    }),
  
  resendOtp: (body: { phone: string; purpose: 'registration' | 'login' | 'password_reset' }) =>
    request<string>('/api/v1/auth/resend-otp', USER_SERVICE_BASE_URL, { method: 'POST', body }),
  
  forgotPassword: (body: { phone: string }) =>
    request<string>('/api/v1/auth/forgot-password', USER_SERVICE_BASE_URL, { method: 'POST', body }),
  
  verifyResetOtp: (body: { phone: string; otp: string }) =>
    request<string>('/api/v1/auth/verify-reset-otp', USER_SERVICE_BASE_URL, { method: 'POST', body }),
  
  resetPassword: (body: { resetToken: string; newPassword: string }) =>
    request<string>('/api/v1/auth/reset-password', USER_SERVICE_BASE_URL, { method: 'POST', body }),
  
  test: () => request<string>('/api/v1/auth/test', USER_SERVICE_BASE_URL),
};

// ============================================================================
// USER SERVICE ENDPOINTS
// ============================================================================

export const UserApi = {
  me: () => request<UserResponse>('/api/v1/users/me', USER_SERVICE_BASE_URL),
  
  updateMe: (body: { name?: string; email?: string; phone?: string }) =>
    request<UserResponse>('/api/v1/users/me', USER_SERVICE_BASE_URL, { method: 'PUT', body }),
  
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    request<string>('/api/v1/users/change-password', USER_SERVICE_BASE_URL, { method: 'POST', body }),
  
  requestPhoneVerification: () =>
    request<string>('/api/v1/users/request-phone-verification', USER_SERVICE_BASE_URL, { method: 'POST' }),
  
  verifyUpdatedPhone: (body: { otp: string }) =>
    request<UserResponse>('/api/v1/users/verify-updated-phone', USER_SERVICE_BASE_URL, {
      method: 'POST',
      body,
    }),
  
  deactivate: (body: { password: string; reason?: string }) =>
    request<string>('/api/v1/users/me', USER_SERVICE_BASE_URL, { method: 'DELETE', body }),
  
  loginHistory: (limit = 10) =>
    request<any>(`/api/v1/users/login-history?limit=${limit}`, USER_SERVICE_BASE_URL),
};

// ============================================================================
// PROFILE SERVICE ENDPOINTS
// ============================================================================

// Jobseeker Profile APIs
export const JobseekerProfileApi = {
  create: (data: CreateJobseekerProfileRequest) =>
    request<JobseekerProfileResponse>('/api/v1/profiles/jobseeker', PROFILE_SERVICE_BASE_URL, {
      method: 'POST',
      body: data,
    }),

  getMe: () =>
    request<JobseekerProfileResponse>('/api/v1/profiles/jobseeker/me', PROFILE_SERVICE_BASE_URL),

  updateMe: (data: UpdateJobseekerProfileRequest) =>
    request<JobseekerProfileResponse>('/api/v1/profiles/jobseeker/me', PROFILE_SERVICE_BASE_URL, {
      method: 'PUT',
      body: data,
    }),

  deleteMe: () =>
    request<void>('/api/v1/profiles/jobseeker/me', PROFILE_SERVICE_BASE_URL, {
      method: 'DELETE',
    }),

  getById: (profileId: number) =>
    request<JobseekerProfileResponse>(`/api/v1/profiles/jobseeker/${profileId}`, PROFILE_SERVICE_BASE_URL),

  getSummary: () =>
    request<any>('/api/v1/profiles/jobseeker/me/summary', PROFILE_SERVICE_BASE_URL),

  getCompletion: () =>
    request<{ completionPercentage: number }>('/api/v1/profiles/jobseeker/me/completion', PROFILE_SERVICE_BASE_URL),

  exists: () =>
    request<{ hasProfile: boolean }>('/api/v1/profiles/jobseeker/exists', PROFILE_SERVICE_BASE_URL),
};

// Work Experience APIs
export const WorkExperienceApi = {
  getAll: () =>
    request<any>('/api/v1/profiles/jobseeker/experience', PROFILE_SERVICE_BASE_URL),

  add: (data: AddWorkExperienceRequest) =>
    request<WorkExperienceResponse>('/api/v1/profiles/jobseeker/experience', PROFILE_SERVICE_BASE_URL, {
      method: 'POST',
      body: data,
    }),

  update: (experienceId: number, data: UpdateWorkExperienceRequest) =>
    request<WorkExperienceResponse>(
      `/api/v1/profiles/jobseeker/experience/${experienceId}`,
      PROFILE_SERVICE_BASE_URL,
      { method: 'PUT', body: data }
    ),

  delete: (experienceId: number) =>
    request<void>(`/api/v1/profiles/jobseeker/experience/${experienceId}`, PROFILE_SERVICE_BASE_URL, {
      method: 'DELETE',
    }),
};

// Education APIs
export const EducationApi = {
  getAll: () =>
    request<any>('/api/v1/profiles/jobseeker/education', PROFILE_SERVICE_BASE_URL),

  add: (data: AddEducationRequest) =>
    request<EducationResponse>('/api/v1/profiles/jobseeker/education', PROFILE_SERVICE_BASE_URL, {
      method: 'POST',
      body: data,
    }),

  update: (educationId: number, data: UpdateEducationRequest) =>
    request<EducationResponse>(
      `/api/v1/profiles/jobseeker/education/${educationId}`,
      PROFILE_SERVICE_BASE_URL,
      { method: 'PUT', body: data }
    ),

  delete: (educationId: number) =>
    request<void>(`/api/v1/profiles/jobseeker/education/${educationId}`, PROFILE_SERVICE_BASE_URL, {
      method: 'DELETE',
    }),
};

// Skills APIs
export const SkillsApi = {
  getCatalog: (params?: PageParams) => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.append('page', String(params.page));
    if (params?.size !== undefined) query.append('size', String(params.size));
    const queryStr = query.toString();
    return request<PaginatedResponse<SkillResponse>>(
      `/api/v1/profiles/jobseeker/skills/catalog${queryStr ? `?${queryStr}` : ''}`,
      PROFILE_SERVICE_BASE_URL
    );
  },

  getSkillById: (skillId: number) =>
    request<SkillResponse>(`/api/v1/profiles/jobseeker/skills/catalog/${skillId}`, PROFILE_SERVICE_BASE_URL),

  getMySkills: () =>
    request<any>('/api/v1/profiles/jobseeker/skills', PROFILE_SERVICE_BASE_URL),

  addSkill: (data: AddSkillRequest) =>
    request<JobseekerSkillResponse>('/api/v1/profiles/jobseeker/skills', PROFILE_SERVICE_BASE_URL, {
      method: 'POST',
      body: data,
    }),

  removeSkill: (skillId: number) =>
    request<void>(`/api/v1/profiles/jobseeker/skills/${skillId}`, PROFILE_SERVICE_BASE_URL, {
      method: 'DELETE',
    }),
};

// Company APIs
export const CompanyApi = {
  getAll: (params?: PageParams) => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.append('page', String(params.page));
    if (params?.size !== undefined) query.append('size', String(params.size));
    const queryStr = query.toString();
    return request<PaginatedResponse<CompanyResponse>>(
      `/api/v1/companies${queryStr ? `?${queryStr}` : ''}`,
      PROFILE_SERVICE_BASE_URL
    );
  },

  create: (data: CreateCompanyRequest) =>
    request<CompanyResponse>('/api/v1/companies', PROFILE_SERVICE_BASE_URL, {
      method: 'POST',
      body: data,
    }),

  getById: (companyId: number) =>
    request<CompanyResponse>(`/api/v1/companies/${companyId}`, PROFILE_SERVICE_BASE_URL),

  update: (companyId: number, data: UpdateCompanyRequest) =>
    request<CompanyResponse>(`/api/v1/companies/${companyId}`, PROFILE_SERVICE_BASE_URL, {
      method: 'PUT',
      body: data,
    }),

  delete: (companyId: number) =>
    request<void>(`/api/v1/companies/${companyId}`, PROFILE_SERVICE_BASE_URL, {
      method: 'DELETE',
    }),

  search: (name: string) =>
    request<any>(`/api/v1/companies/search?name=${encodeURIComponent(name)}`, PROFILE_SERVICE_BASE_URL),

  getMyCompanies: () =>
    request<any>('/api/v1/companies/my-companies', PROFILE_SERVICE_BASE_URL),
};

// Company Review APIs
export const CompanyReviewApi = {
  getCompanyReviews: (companyId: number, onlyApproved?: boolean) => {
    const query = onlyApproved !== undefined ? `?onlyApproved=${onlyApproved}` : '';
    return request<any>(`/api/v1/companies/${companyId}/reviews${query}`, PROFILE_SERVICE_BASE_URL);
  },

  submitReview: (companyId: number, data: CreateCompanyReviewRequest) =>
    request<CompanyReviewResponse>(`/api/v1/companies/${companyId}/reviews`, PROFILE_SERVICE_BASE_URL, {
      method: 'POST',
      body: data,
    }),

  getMyReviews: () =>
    request<any>('/api/v1/companies/reviews/my-reviews', PROFILE_SERVICE_BASE_URL),

  update: (reviewId: number, data: CreateCompanyReviewRequest) =>
    request<CompanyReviewResponse>(`/api/v1/companies/reviews/${reviewId}`, PROFILE_SERVICE_BASE_URL, {
      method: 'PUT',
      body: data,
    }),

  delete: (reviewId: number) =>
    request<void>(`/api/v1/companies/reviews/${reviewId}`, PROFILE_SERVICE_BASE_URL, {
      method: 'DELETE',
    }),

  approve: (reviewId: number) =>
    request<CompanyReviewResponse>(`/api/v1/companies/reviews/${reviewId}/approve`, PROFILE_SERVICE_BASE_URL, {
      method: 'PATCH',
    }),

  reject: (reviewId: number) =>
    request<CompanyReviewResponse>(`/api/v1/companies/reviews/${reviewId}/reject`, PROFILE_SERVICE_BASE_URL, {
      method: 'PATCH',
    }),
};

// Employer Profile APIs
export const EmployerProfileApi = {
  create: (data: CreateEmployerProfileRequest) =>
    request<EmployerProfileResponse>('/api/v1/profiles/employer', PROFILE_SERVICE_BASE_URL, {
      method: 'POST',
      body: data,
    }),

  getMe: () =>
    request<EmployerProfileResponse>('/api/v1/profiles/employer/me', PROFILE_SERVICE_BASE_URL),

  updateMe: (data: UpdateEmployerProfileRequest) =>
    request<EmployerProfileResponse>('/api/v1/profiles/employer/me', PROFILE_SERVICE_BASE_URL, {
      method: 'PUT',
      body: data,
    }),

  deleteMe: () =>
    request<void>('/api/v1/profiles/employer/me', PROFILE_SERVICE_BASE_URL, {
      method: 'DELETE',
    }),

  getById: (employerId: number) =>
    request<EmployerProfileResponse>(`/api/v1/profiles/employer/${employerId}`, PROFILE_SERVICE_BASE_URL),

  exists: () =>
    request<boolean>('/api/v1/profiles/employer/exists', PROFILE_SERVICE_BASE_URL),
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  request,
  AuthApi,
  UserApi,
  JobseekerProfileApi,
  WorkExperienceApi,
  EducationApi,
  SkillsApi,
  CompanyApi,
  CompanyReviewApi,
  EmployerProfileApi,
  ApiError,
};