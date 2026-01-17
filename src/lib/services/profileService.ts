import { profileApi } from '../apiClient';

// ============================================
// JOBSEEKER PROFILE
// ============================================

export interface CreateJobseekerProfileRequest {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  currentLocation?: string;
  preferredLocation?: string;
  bio?: string;
  totalExperienceMonths?: number;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod?: 'IMMEDIATE' | 'DAYS15' | 'MONTH1' | 'MONTH2' | 'MONTH3';
}

export interface JobseekerProfileResponse {
  profileId: number;
  userId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  currentLocation: string;
  preferredLocation: string;
  bio: string;
  totalExperienceMonths: number;
  currentSalary: number;
  expectedSalary: number;
  noticePeriod: string;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileCompletionResponse {
  completionPercentage: number;
}

export interface ProfileSummaryResponse {
  profile: JobseekerProfileResponse;
  skills: SkillResponse[];
  education: EducationResponse[];
  experience: WorkExperienceResponse[];
  completionPercentage: number;
}

// Create jobseeker profile
export const createJobseekerProfile = async (
  data: CreateJobseekerProfileRequest
): Promise<JobseekerProfileResponse> => {
  const response = await profileApi.post<JobseekerProfileResponse>(
    '/api/v1/profiles/jobseeker',
    data
  );
  return response.data;
};

// Get my jobseeker profile
export const getMyJobseekerProfile = async (): Promise<JobseekerProfileResponse> => {
  const response = await profileApi.get<JobseekerProfileResponse>(
    '/api/v1/profiles/jobseeker/me'
  );
  return response.data;
};

// Get jobseeker profile by ID (public viewing)
export const getJobseekerProfileById = async (
  profileId: number
): Promise<JobseekerProfileResponse> => {
  const response = await profileApi.get<JobseekerProfileResponse>(
    `/api/v1/profiles/jobseeker/${profileId}`
  );
  return response.data;
};

// Update my jobseeker profile
export const updateMyJobseekerProfile = async (
  data: Partial<CreateJobseekerProfileRequest>
): Promise<JobseekerProfileResponse> => {
  const response = await profileApi.put<JobseekerProfileResponse>(
    '/api/v1/profiles/jobseeker/me',
    data
  );
  return response.data;
};

// Delete my jobseeker profile
export const deleteMyJobseekerProfile = async (): Promise<void> => {
  await profileApi.delete('/api/v1/profiles/jobseeker/me');
};

// Check if jobseeker profile exists
export const checkJobseekerProfileExists = async (): Promise<boolean> => {
  const response = await profileApi.get<boolean>('/api/v1/profiles/jobseeker/exists');
  return response.data;
};

// Get profile completion percentage
export const getJobseekerCompletion = async (): Promise<ProfileCompletionResponse> => {
  const response = await profileApi.get<ProfileCompletionResponse>(
    '/api/v1/profiles/jobseeker/me/completion'
  );
  return response.data;
};

// Get complete profile summary
export const getJobseekerSummary = async (): Promise<ProfileSummaryResponse> => {
  const response = await profileApi.get<ProfileSummaryResponse>(
    '/api/v1/profiles/jobseeker/me/summary'
  );
  return response.data;
};

// ============================================
// EMPLOYER PROFILE
// ============================================

export interface CreateEmployerProfileRequest {
  companyName: string;
  companyWebsite?: string;
  companyDescription?: string;
  industry?: string;
  companySize?: 'SIZE1_10' | 'SIZE11_50' | 'SIZE51_200' | 'SIZE201_500' | 'SIZE500PLUS';
  headquartersLocation?: string;
  contactPersonName?: string;
  contactPersonDesignation?: string;
}

export interface EmployerProfileResponse {
  employerId: number;
  userId: number;
  companyName: string;
  companyWebsite: string;
  companyDescription: string;
  industry: string;
  companySize: string;
  headquartersLocation: string;
  contactPersonName: string;
  contactPersonDesignation: string;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
}

// Create employer profile
export const createEmployerProfile = async (
  data: CreateEmployerProfileRequest
): Promise<EmployerProfileResponse> => {
  const response = await profileApi.post<EmployerProfileResponse>(
    '/api/v1/profiles/employer',
    data
  );
  return response.data;
};

// Get my employer profile
export const getMyEmployerProfile = async (): Promise<EmployerProfileResponse> => {
  const response = await profileApi.get<EmployerProfileResponse>(
    '/api/v1/profiles/employer/me'
  );
  return response.data;
};

// Get employer profile by ID
export const getEmployerProfileById = async (
  employerId: number
): Promise<EmployerProfileResponse> => {
  const response = await profileApi.get<EmployerProfileResponse>(
    `/api/v1/profiles/employer/${employerId}`
  );
  return response.data;
};

// Update my employer profile
export const updateMyEmployerProfile = async (
  data: Partial<CreateEmployerProfileRequest>
): Promise<EmployerProfileResponse> => {
  const response = await profileApi.put<EmployerProfileResponse>(
    '/api/v1/profiles/employer/me',
    data
  );
  return response.data;
};

// Delete my employer profile
export const deleteMyEmployerProfile = async (): Promise<void> => {
  await profileApi.delete('/api/v1/profiles/employer/me');
};

// Check if employer profile exists
export const checkEmployerProfileExists = async (): Promise<boolean> => {
  const response = await profileApi.get<boolean>('/api/v1/profiles/employer/exists');
  return response.data;
};

// ============================================
// SKILLS
// ============================================

export interface SkillResponse {
  id: number;
  profileId: number;
  skillId: number;
  skillName: string;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsOfExperience: number;
}

export interface CreateSkillRequest {
  skillId: number;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsOfExperience: number;
}

export interface MasterSkill {
  skillId: number;
  skillName: string;
  category: string;
  description: string;
  isActive: boolean;
}

// Get all master skills
export const getAllSkills = async (page = 0, size = 50): Promise<MasterSkill[]> => {
  const response = await profileApi.get<MasterSkill[]>(
    `/api/v1/skills?page=${page}&size=${size}`
  );
  return response.data;
};

// Search skills by name
export const searchSkills = async (name: string): Promise<MasterSkill[]> => {
  const response = await profileApi.get<MasterSkill[]>(
    `/api/v1/skills/search?name=${name}`
  );
  return response.data;
};

// Add skill to profile
export const addSkillToProfile = async (
  data: CreateSkillRequest
): Promise<SkillResponse> => {
  const response = await profileApi.post<SkillResponse>(
    '/api/v1/profiles/jobseeker/skills',
    data
  );
  return response.data;
};

// Get my skills
export const getMySkills = async (): Promise<SkillResponse[]> => {
  const response = await profileApi.get<SkillResponse[]>(
    '/api/v1/profiles/jobseeker/skills'
  );
  return response.data;
};

// Update skill
export const updateSkill = async (
  id: number,
  data: Partial<CreateSkillRequest>
): Promise<SkillResponse> => {
  const response = await profileApi.put<SkillResponse>(
    `/api/v1/profiles/jobseeker/skills/${id}`,
    data
  );
  return response.data;
};

// Delete skill
export const deleteSkill = async (id: number): Promise<void> => {
  await profileApi.delete(`/api/v1/profiles/jobseeker/skills/${id}`);
};

// ============================================
// EDUCATION
// ============================================

export interface EducationResponse {
  educationId: number;
  profileId: number;
  degree: string;
  fieldOfStudy: string;
  institutionName: string;
  university: string;
  startDate: string;
  endDate: string;
  percentageOrCgpa: number;
  description: string;
  isCurrent: boolean;
}

export interface CreateEducationRequest {
  degree: string;
  fieldOfStudy: string;
  institutionName: string;
  university: string;
  startDate: string;
  endDate?: string;
  percentageOrCgpa?: number;
  description?: string;
  isCurrent: boolean;
}

// Add education
export const addEducation = async (
  data: CreateEducationRequest
): Promise<EducationResponse> => {
  const response = await profileApi.post<EducationResponse>(
    '/api/v1/profiles/jobseeker/education',
    data
  );
  return response.data;
};

// Get my education
export const getMyEducation = async (): Promise<EducationResponse[]> => {
  const response = await profileApi.get<EducationResponse[]>(
    '/api/v1/profiles/jobseeker/education'
  );
  return response.data;
};

// Update education
export const updateEducation = async (
  educationId: number,
  data: Partial<CreateEducationRequest>
): Promise<EducationResponse> => {
  const response = await profileApi.put<EducationResponse>(
    `/api/v1/profiles/jobseeker/education/${educationId}`,
    data
  );
  return response.data;
};

// Delete education
export const deleteEducation = async (educationId: number): Promise<void> => {
  await profileApi.delete(`/api/v1/profiles/jobseeker/education/${educationId}`);
};

// ============================================
// WORK EXPERIENCE
// ============================================

export interface WorkExperienceResponse {
  experienceId: number;
  profileId: number;
  companyName: string;
  jobTitle: string;
  employmentType: 'FULLTIME' | 'PARTTIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  jobDescription: string;
  location: string;
  salary: number;
}

export interface CreateWorkExperienceRequest {
  companyName: string;
  jobTitle: string;
  employmentType: 'FULLTIME' | 'PARTTIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  jobDescription?: string;
  location?: string;
  salary?: number;
}

// Add work experience
export const addWorkExperience = async (
  data: CreateWorkExperienceRequest
): Promise<WorkExperienceResponse> => {
  const response = await profileApi.post<WorkExperienceResponse>(
    '/api/v1/profiles/jobseeker/work-experience',
    data
  );
  return response.data;
};

// Get my work experience
export const getMyWorkExperience = async (): Promise<WorkExperienceResponse[]> => {
  const response = await profileApi.get<WorkExperienceResponse[]>(
    '/api/v1/profiles/jobseeker/work-experience'
  );
  return response.data;
};

// Update work experience
export const updateWorkExperience = async (
  experienceId: number,
  data: Partial<CreateWorkExperienceRequest>
): Promise<WorkExperienceResponse> => {
  const response = await profileApi.put<WorkExperienceResponse>(
    `/api/v1/profiles/jobseeker/work-experience/${experienceId}`,
    data
  );
  return response.data;
};

// Delete work experience
export const deleteWorkExperience = async (experienceId: number): Promise<void> => {
  await profileApi.delete(`/api/v1/profiles/jobseeker/work-experience/${experienceId}`);
};

// ============================================
// COMPANIES
// ============================================

export interface CompanyResponse {
  companyId: number;
  adminUserId: number;
  companyName: string;
  website: string;
  description: string;
  industry: string;
  size: string;
  headquarters: string;
  foundedYear: number;
  employeeCount: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  createdAt: string;
}

export interface CreateCompanyRequest {
  companyName: string;
  website?: string;
  description?: string;
  industry?: string;
  size?: string;
  headquarters?: string;
  foundedYear?: number;
  employeeCount?: number;
}

// Create company
export const createCompany = async (
  data: CreateCompanyRequest
): Promise<CompanyResponse> => {
  const response = await profileApi.post<CompanyResponse>('/api/v1/companies', data);
  return response.data;
};

// Get company by ID
export const getCompanyById = async (companyId: number): Promise<CompanyResponse> => {
  const response = await profileApi.get<CompanyResponse>(`/api/v1/companies/${companyId}`);
  return response.data;
};

// Get all companies
export const getAllCompanies = async (
  page = 0,
  size = 10
): Promise<CompanyResponse[]> => {
  const response = await profileApi.get<CompanyResponse[]>(
    `/api/v1/companies?page=${page}&size=${size}`
  );
  return response.data;
};

// Search companies
export const searchCompanies = async (name: string): Promise<CompanyResponse[]> => {
  const response = await profileApi.get<CompanyResponse[]>(
    `/api/v1/companies/search?name=${name}`
  );
  return response.data;
};

// Get my companies
export const getMyCompanies = async (): Promise<CompanyResponse[]> => {
  const response = await profileApi.get<CompanyResponse[]>('/api/v1/companies/my-companies');
  return response.data;
};

// Update company
export const updateCompany = async (
  companyId: number,
  data: Partial<CreateCompanyRequest>
): Promise<CompanyResponse> => {
  const response = await profileApi.put<CompanyResponse>(
    `/api/v1/companies/${companyId}`,
    data
  );
  return response.data;
};

// Delete company
export const deleteCompany = async (companyId: number): Promise<void> => {
  await profileApi.delete(`/api/v1/companies/${companyId}`);
};

// ============================================
// COMPANY REVIEWS
// ============================================

export interface CompanyReviewResponse {
  reviewId: number;
  companyId: number;
  profileId: number;
  overallRating: number;
  workLifeBalance: number;
  salaryBenefits: number;
  careerGrowth: number;
  management: number;
  culture: number;
  reviewTitle: string;
  pros: string;
  cons: string;
  adviceToManagement: string;
  jobTitle: string;
  employmentStatus: string;
  location: string;
  isCurrentEmployee: boolean;
  isAnonymous: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface CreateReviewRequest {
  overallRating: number;
  workLifeBalance: number;
  salaryBenefits: number;
  careerGrowth: number;
  management: number;
  culture: number;
  reviewTitle: string;
  pros: string;
  cons: string;
  adviceToManagement?: string;
  jobTitle: string;
  employmentStatus: string;
  location: string;
  isCurrentEmployee: boolean;
  isAnonymous: boolean;
}

// Submit review
export const submitCompanyReview = async (
  companyId: number,
  data: CreateReviewRequest
): Promise<CompanyReviewResponse> => {
  const response = await profileApi.post<CompanyReviewResponse>(
    `/api/v1/companies/${companyId}/reviews`,
    data
  );
  return response.data;
};

// Get company reviews
export const getCompanyReviews = async (
  companyId: number,
  onlyApproved = true
): Promise<CompanyReviewResponse[]> => {
  const response = await profileApi.get<CompanyReviewResponse[]>(
    `/api/v1/companies/${companyId}/reviews?onlyApproved=${onlyApproved}`
  );
  return response.data;
};

// Get my reviews
export const getMyReviews = async (): Promise<CompanyReviewResponse[]> => {
  const response = await profileApi.get<CompanyReviewResponse[]>(
    '/api/v1/companies/reviews/my-reviews'
  );
  return response.data;
};

// Update review
export const updateReview = async (
  reviewId: number,
  data: Partial<CreateReviewRequest>
): Promise<CompanyReviewResponse> => {
  const response = await profileApi.put<CompanyReviewResponse>(
    `/api/v1/companies/reviews/${reviewId}`,
    data
  );
  return response.data;
};

// Delete review
export const deleteReview = async (reviewId: number): Promise<void> => {
  await profileApi.delete(`/api/v1/companies/reviews/${reviewId}`);
};
