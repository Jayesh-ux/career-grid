// Profile Service API Client
// Generated from OpenAPI specification

const PROFILE_API_BASE_URL = import.meta.env.VITE_PROFILE_API_BASE_URL || 'http://localhost:8081';

function getAuthToken(): string | null {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

export class ProfileApiError extends Error {
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
  opts: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    token?: string | null;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${PROFILE_API_BASE_URL}${path}`;
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
    throw new ProfileApiError(res.status, message, data);
  }

  return data as T;
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum NoticePeriod {
  IMMEDIATE = 'IMMEDIATE',
  DAYS_15 = 'DAYS_15',
  MONTH_1 = 'MONTH_1',
  MONTH_2 = 'MONTH_2',
  MONTH_3 = 'MONTH_3',
}

export enum ProficiencyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export enum CompanySize {
  SIZE_1_10 = 'SIZE_1_10',
  SIZE_11_50 = 'SIZE_11_50',
  SIZE_51_200 = 'SIZE_51_200',
  SIZE_201_500 = 'SIZE_201_500',
  SIZE_500_PLUS = 'SIZE_500_PLUS',
}

export enum CompanySizeEnum {
  STARTUP = 'STARTUP',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ENTERPRISE = 'ENTERPRISE',
}

// Jobseeker Profile
export interface JobseekerProfileResponse {
  profileId: number;
  userId: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  currentLocation?: string;
  preferredLocation?: string;
  bio?: string;
  profilePicture?: string;
  resumePath?: string;
  totalExperienceMonths?: number;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod?: string;
  isProfileComplete: boolean;
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobseekerProfileRequest {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: Gender;
  currentLocation?: string;
  preferredLocation?: string;
  bio?: string;
  totalExperienceMonths?: number;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod?: NoticePeriod;
}

export interface UpdateJobseekerProfileRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  currentLocation?: string;
  preferredLocation?: string;
  bio?: string;
  totalExperienceMonths?: number;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod?: NoticePeriod;
}

// Work Experience
export interface WorkExperienceResponse {
  experienceId: number;
  profileId: number;
  companyName: string;
  jobTitle: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  jobDescription?: string;
  location?: string;
  salary?: number;
}

export interface AddWorkExperienceRequest {
  companyName: string;
  jobTitle: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  jobDescription?: string;
  location?: string;
  salary?: number;
}

export interface UpdateWorkExperienceRequest {
  companyName?: string;
  jobTitle?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  jobDescription?: string;
  location?: string;
  salary?: number;
}

// Education
export interface EducationResponse {
  educationId: number;
  profileId: number;
  degree: string;
  fieldOfStudy?: string;
  institutionName: string;
  university?: string;
  startDate?: string;
  endDate?: string;
  percentageOrCgpa?: number;
  description?: string;
  isCurrent?: boolean;
}

export interface AddEducationRequest {
  degree: string;
  fieldOfStudy?: string;
  institutionName: string;
  university?: string;
  startDate?: string;
  endDate?: string;
  percentageOrCgpa?: number;
  description?: string;
  isCurrent?: boolean;
}

export interface UpdateEducationRequest {
  degree?: string;
  fieldOfStudy?: string;
  institutionName?: string;
  university?: string;
  startDate?: string;
  endDate?: string;
  percentageOrCgpa?: number;
  description?: string;
  isCurrent?: boolean;
}

// Skills
export interface SkillResponse {
  skillId: number;
  skillName: string;
  category?: string;
  description?: string;
  isActive: boolean;
}

export interface JobseekerSkillResponse {
  id: number;
  profileId: number;
  skillId: number;
  skillName: string;
  proficiencyLevel: string;
  yearsOfExperience?: number;
}

export interface AddSkillRequest {
  skillId: number;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience?: number;
}

// Company
export interface CompanyResponse {
  companyId: number;
  adminUserId: number;
  companyName: string;
  website?: string;
  description?: string;
  logo?: string;
  industry?: string;
  size?: string;
  headquarters?: string;
  foundedYear?: number;
  rating?: number;
  reviewCount?: number;
  employeeCount?: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  companyName: string;
  website?: string;
  description?: string;
  industry?: string;
  size?: CompanySizeEnum;
  headquarters?: string;
  foundedYear?: number;
  employeeCount?: number;
}

export interface UpdateCompanyRequest {
  companyName?: string;
  website?: string;
  description?: string;
  industry?: string;
  size?: CompanySizeEnum;
  headquarters?: string;
  foundedYear?: number;
  employeeCount?: number;
}

// Company Review
export interface CompanyReviewResponse {
  reviewId: number;
  companyId: number;
  profileId: number;
  reviewerName?: string;
  overallRating: number;
  workLifeBalance?: number;
  salaryBenefits?: number;
  careerGrowth?: number;
  management?: number;
  culture?: number;
  reviewTitle: string;
  pros?: string;
  cons?: string;
  adviceToManagement?: string;
  jobTitle?: string;
  employmentStatus?: string;
  location?: string;
  isCurrentEmployee?: boolean;
  isAnonymous?: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface CreateCompanyReviewRequest {
  overallRating: number;
  workLifeBalance?: number;
  salaryBenefits?: number;
  careerGrowth?: number;
  management?: number;
  culture?: number;
  reviewTitle: string;
  pros?: string;
  cons?: string;
  adviceToManagement?: string;
  jobTitle?: string;
  employmentStatus?: string;
  location?: string;
  isCurrentEmployee?: boolean;
  isAnonymous?: boolean;
}

// Employer Profile
export interface EmployerProfileResponse {
  employerId: number;
  userId: number;
  companyId: number;
  companyName: string;
  companyWebsite?: string;
  companyDescription?: string;
  companyLogo?: string;
  industry?: string;
  companySize?: string;
  headquartersLocation?: string;
  contactPersonName?: string;
  contactPersonDesignation?: string;
  isVerified: boolean;
  rating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployerProfileRequest {
  companyName: string;
  companyWebsite?: string;
  companyDescription?: string;
  industry?: string;
  companySize?: CompanySize;
  headquartersLocation?: string;
  contactPersonName?: string;
  contactPersonDesignation?: string;
}

export interface UpdateEmployerProfileRequest {
  companyId?: number;
  companyName?: string;
  companyWebsite?: string;
  companyDescription?: string;
  industry?: string;
  companySize?: CompanySize;
  headquartersLocation?: string;
  contactPersonName?: string;
  contactPersonDesignation?: string;
}

// Pagination
export interface PageParams {
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  _embedded?: {
    [key: string]: T[];
  };
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
  _links?: any;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

// Jobseeker Profile APIs
export const JobseekerProfileApi = {
  /**
   * Create a new jobseeker profile for the authenticated user
   */
  create: (data: CreateJobseekerProfileRequest) =>
    request<JobseekerProfileResponse>('/api/v1/profiles/jobseeker', {
      method: 'POST',
      body: data,
    }),

  /**
   * Get authenticated user's profile
   */
  getMe: () =>
    request<JobseekerProfileResponse>('/api/v1/profiles/jobseeker/me', {
      method: 'GET',
    }),

  /**
   * Update authenticated user's profile
   */
  updateMe: (data: UpdateJobseekerProfileRequest) =>
    request<JobseekerProfileResponse>('/api/v1/profiles/jobseeker/me', {
      method: 'PUT',
      body: data,
    }),

  /**
   * Delete authenticated user's profile
   */
  deleteMe: () =>
    request<void>('/api/v1/profiles/jobseeker/me', {
      method: 'DELETE',
    }),

  /**
   * Get profile by ID (public endpoint)
   */
  getById: (profileId: number) =>
    request<JobseekerProfileResponse>(`/api/v1/profiles/jobseeker/${profileId}`, {
      method: 'GET',
    }),

  /**
   * Get complete profile summary including skills, education, and work experience
   */
  getSummary: () =>
    request<any>('/api/v1/profiles/jobseeker/me/summary', {
      method: 'GET',
    }),

  /**
   * Get profile completion percentage
   */
  getCompletion: () =>
    request<{ completionPercentage: number }>('/api/v1/profiles/jobseeker/me/completion', {
      method: 'GET',
    }),

  /**
   * Check if profile exists
   */
  exists: () =>
    request<{ hasProfile: boolean }>('/api/v1/profiles/jobseeker/exists', {
      method: 'GET',
    }),
};

// Work Experience APIs
export const WorkExperienceApi = {
  /**
   * Get all work experience records for authenticated user
   */
  getAll: () =>
    request<any>('/api/v1/profiles/jobseeker/experience', {
      method: 'GET',
    }),

  /**
   * Add work experience
   */
  add: (data: AddWorkExperienceRequest) =>
    request<WorkExperienceResponse>('/api/v1/profiles/jobseeker/experience', {
      method: 'POST',
      body: data,
    }),

  /**
   * Update work experience
   */
  update: (experienceId: number, data: UpdateWorkExperienceRequest) =>
    request<WorkExperienceResponse>(`/api/v1/profiles/jobseeker/experience/${experienceId}`, {
      method: 'PUT',
      body: data,
    }),

  /**
   * Delete work experience
   */
  delete: (experienceId: number) =>
    request<void>(`/api/v1/profiles/jobseeker/experience/${experienceId}`, {
      method: 'DELETE',
    }),
};

// Education APIs
export const EducationApi = {
  /**
   * Get all education records for authenticated user
   */
  getAll: () =>
    request<any>('/api/v1/profiles/jobseeker/education', {
      method: 'GET',
    }),

  /**
   * Add education record
   */
  add: (data: AddEducationRequest) =>
    request<EducationResponse>('/api/v1/profiles/jobseeker/education', {
      method: 'POST',
      body: data,
    }),

  /**
   * Update education record
   */
  update: (educationId: number, data: UpdateEducationRequest) =>
    request<EducationResponse>(`/api/v1/profiles/jobseeker/education/${educationId}`, {
      method: 'PUT',
      body: data,
    }),

  /**
   * Delete education record
   */
  delete: (educationId: number) =>
    request<void>(`/api/v1/profiles/jobseeker/education/${educationId}`, {
      method: 'DELETE',
    }),
};

// Skills APIs
export const SkillsApi = {
  /**
   * Get all available skills (master catalog)
   */
  getCatalog: (params?: PageParams) => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.append('page', String(params.page));
    if (params?.size !== undefined) query.append('size', String(params.size));
    const queryStr = query.toString();
    return request<PaginatedResponse<SkillResponse>>(`/api/v1/profiles/jobseeker/skills/catalog${queryStr ? `?${queryStr}` : ''}`, {
      method: 'GET',
    });
  },

  /**
   * Get skill by ID from catalog
   */
  getSkillById: (skillId: number) =>
    request<SkillResponse>(`/api/v1/profiles/jobseeker/skills/catalog/${skillId}`, {
      method: 'GET',
    }),

  /**
   * Get authenticated user's skills
   */
  getMySkills: () =>
    request<any>('/api/v1/profiles/jobseeker/skills', {
      method: 'GET',
    }),

  /**
   * Add skill to profile
   */
  addSkill: (data: AddSkillRequest) =>
    request<JobseekerSkillResponse>('/api/v1/profiles/jobseeker/skills', {
      method: 'POST',
      body: data,
    }),

  /**
   * Remove skill from profile
   */
  removeSkill: (skillId: number) =>
    request<void>(`/api/v1/profiles/jobseeker/skills/${skillId}`, {
      method: 'DELETE',
    }),
};

// Company APIs
export const CompanyApi = {
  /**
   * Get all companies (paginated)
   */
  getAll: (params?: PageParams) => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.append('page', String(params.page));
    if (params?.size !== undefined) query.append('size', String(params.size));
    const queryStr = query.toString();
    return request<PaginatedResponse<CompanyResponse>>(`/api/v1/companies${queryStr ? `?${queryStr}` : ''}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new company
   */
  create: (data: CreateCompanyRequest) =>
    request<CompanyResponse>('/api/v1/companies', {
      method: 'POST',
      body: data,
    }),

  /**
   * Get company by ID
   */
  getById: (companyId: number) =>
    request<CompanyResponse>(`/api/v1/companies/${companyId}`, {
      method: 'GET',
    }),

  /**
   * Update company
   */
  update: (companyId: number, data: UpdateCompanyRequest) =>
    request<CompanyResponse>(`/api/v1/companies/${companyId}`, {
      method: 'PUT',
      body: data,
    }),

  /**
   * Delete company
   */
  delete: (companyId: number) =>
    request<void>(`/api/v1/companies/${companyId}`, {
      method: 'DELETE',
    }),

  /**
   * Search companies by name
   */
  search: (name: string) =>
    request<any>(`/api/v1/companies/search?name=${encodeURIComponent(name)}`, {
      method: 'GET',
    }),

  /**
   * Get companies created/managed by authenticated user
   */
  getMyCompanies: () =>
    request<any>('/api/v1/companies/my-companies', {
      method: 'GET',
    }),
};

// Company Review APIs
export const CompanyReviewApi = {
  /**
   * Get approved reviews for a company
   */
  getCompanyReviews: (companyId: number, onlyApproved?: boolean) => {
    const query = onlyApproved !== undefined ? `?onlyApproved=${onlyApproved}` : '';
    return request<any>(`/api/v1/companies/${companyId}/reviews${query}`, {
      method: 'GET',
    });
  },

  /**
   * Submit a review for a company
   */
  submitReview: (companyId: number, data: CreateCompanyReviewRequest) =>
    request<CompanyReviewResponse>(`/api/v1/companies/${companyId}/reviews`, {
      method: 'POST',
      body: data,
    }),

  /**
   * Get reviews submitted by authenticated user
   */
  getMyReviews: () =>
    request<any>('/api/v1/companies/reviews/my-reviews', {
      method: 'GET',
    }),

  /**
   * Update a review
   */
  update: (reviewId: number, data: CreateCompanyReviewRequest) =>
    request<CompanyReviewResponse>(`/api/v1/companies/reviews/${reviewId}`, {
      method: 'PUT',
      body: data,
    }),

  /**
   * Delete a review
   */
  delete: (reviewId: number) =>
    request<void>(`/api/v1/companies/reviews/${reviewId}`, {
      method: 'DELETE',
    }),

  /**
   * Approve a review (admin only)
   */
  approve: (reviewId: number) =>
    request<CompanyReviewResponse>(`/api/v1/companies/reviews/${reviewId}/approve`, {
      method: 'PATCH',
    }),

  /**
   * Reject a review (admin only)
   */
  reject: (reviewId: number) =>
    request<CompanyReviewResponse>(`/api/v1/companies/reviews/${reviewId}/reject`, {
      method: 'PATCH',
    }),
};

// Employer Profile APIs
export const EmployerProfileApi = {
  /**
   * Create employer profile for authenticated user
   */
  create: (data: CreateEmployerProfileRequest) =>
    request<EmployerProfileResponse>('/api/v1/profiles/employer', {
      method: 'POST',
      body: data,
    }),

  /**
   * Get authenticated user's employer profile
   */
  getMe: () =>
    request<EmployerProfileResponse>('/api/v1/profiles/employer/me', {
      method: 'GET',
    }),

  /**
   * Update authenticated user's employer profile
   */
  updateMe: (data: UpdateEmployerProfileRequest) =>
    request<EmployerProfileResponse>('/api/v1/profiles/employer/me', {
      method: 'PUT',
      body: data,
    }),

  /**
   * Delete authenticated user's employer profile
   */
  deleteMe: () =>
    request<void>('/api/v1/profiles/employer/me', {
      method: 'DELETE',
    }),

  /**
   * Get employer profile by ID
   */
  getById: (employerId: number) =>
    request<EmployerProfileResponse>(`/api/v1/profiles/employer/${employerId}`, {
      method: 'GET',
    }),

  /**
   * Check if employer profile exists
   */
  exists: () =>
    request<boolean>('/api/v1/profiles/employer/exists', {
      method: 'GET',
    }),
};

export default {
  JobseekerProfileApi,
  WorkExperienceApi,
  EducationApi,
  SkillsApi,
  CompanyApi,
  CompanyReviewApi,
  EmployerProfileApi,
};
