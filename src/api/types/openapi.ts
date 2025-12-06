/**
 * Generated OpenAPI types from Profile Service API v1.0.0
 * Base URL: http://localhost:8081
 * 
 * These types are automatically generated from the OpenAPI 3.0.1 specification.
 * Last Updated: 2025-11-16
 * 
 * To regenerate, extract types from /openapi.json or use:
 * npx @openapitools/openapi-generator-cli generate -i openapi.json -g typescript-fetch
 */

// ============================================================
// ENUMS
// ============================================================

export enum CompanySize {
  STARTUP = 'STARTUP',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ENTERPRISE = 'ENTERPRISE',
}

export enum EmployerCompanySize {
  SIZE_1_10 = 'SIZE_1_10',
  SIZE_11_50 = 'SIZE_11_50',
  SIZE_51_200 = 'SIZE_51_200',
  SIZE_201_500 = 'SIZE_201_500',
  SIZE_500_PLUS = 'SIZE_500_PLUS',
}

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

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  FREELANCE = 'FREELANCE',
}

export enum EmploymentStatus {
  CURRENT = 'CURRENT',
  FORMER = 'FORMER',
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// ============================================================
// COMPANY TYPES (from OpenAPI spec)
// ============================================================

/**
 * Company response model.
 * Maps to /api/v1/companies endpoints
 */
export interface CompanyResponse {
  companyId?: number;
  adminUserId?: number;
  companyName: string;
  website?: string;
  description?: string;
  logo?: string;
  industry: string;
  size?: string;
  headquarters?: string;
  foundedYear?: number;
  rating?: number;
  reviewCount?: number;
  employeeCount?: number;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _links?: Record<string, any>;
}

export interface CreateCompanyRequest {
  companyName: string;
  website?: string;
  description?: string;
  industry: string;
  size?: string;
  headquarters?: string;
  foundedYear?: number;
  employeeCount?: number;
}

export interface UpdateCompanyRequest {
  companyName?: string;
  website?: string;
  description?: string;
  industry?: string;
  size?: string;
  headquarters?: string;
  foundedYear?: number;
  employeeCount?: number;
}

// ============================================================
// JOBSEEKER PROFILE TYPES (from OpenAPI spec)
// ============================================================

/**
 * Jobseeker profile response model.
 * Maps to /api/v1/profiles/jobseeker/* endpoints
 */
export interface JobseekerProfileResponse {
  profileId?: number;
  userId?: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string; // ISO 8601 date format
  gender?: Gender;
  currentLocation?: string;
  preferredLocation?: string;
  bio?: string;
  profilePicture?: string;
  resumePath?: string;
  totalExperienceMonths?: number;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod?: NoticePeriod;
  isProfileComplete?: boolean;
  lastActive?: string; // ISO 8601 date-time format
  createdAt?: string;
  updatedAt?: string;
  _links?: Record<string, any>;
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

export interface ProfileCompletionResponse {
  profileId: number;
  percentage: number;
  completedSections: string[];
  missingFields: string[];
}

export interface ProfileSummaryResponse {
  userId: string;
  fullName: string;
  headline?: string;
  skillsCount: number;
  experienceCount: number;
  educationCount: number;
}

// ============================================================
// SKILL TYPES (from OpenAPI spec)
// ============================================================

/**
 * Master skill catalog response.
 * Represents available skills in the system
 */
export interface SkillResponse {
  skillId?: number;
  skillName: string;
  category?: string;
  description?: string;
  isActive?: boolean;
  _links?: Record<string, any>;
}

/**
 * Jobseeker's assigned skill with proficiency level.
 * Maps to /api/v1/profiles/jobseeker/skills endpoints
 */
export interface JobseekerSkillResponse {
  id?: number;
  profileId?: number;
  skillId?: number;
  skill?: SkillResponse;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience?: number;
  endorsements?: number;
  createdAt?: string;
  _links?: Record<string, any>;
}

export interface AddSkillRequest {
  skillId: number;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience?: number;
}

// ============================================================
// WORK EXPERIENCE TYPES (from OpenAPI spec)
// ============================================================

/**
 * Work experience record response.
 * Maps to /api/v1/profiles/jobseeker/experience endpoints
 */
export interface WorkExperienceResponse {
  experienceId?: number;
  profileId?: number;
  companyName: string;
  jobTitle: string;
  employmentType: EmploymentType;
  startDate: string; // ISO 8601 date format
  endDate?: string; // ISO 8601 date format
  isCurrent?: boolean;
  jobDescription?: string;
  location?: string;
  salary?: number;
  _links?: Record<string, any>;
}

export interface AddWorkExperienceRequest {
  companyName: string;
  jobTitle: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  jobDescription?: string;
  location?: string;
  salary?: number;
}

export interface UpdateWorkExperienceRequest {
  companyName?: string;
  jobTitle?: string;
  employmentType?: EmploymentType;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  jobDescription?: string;
  location?: string;
  salary?: number;
}

// ============================================================
// EDUCATION TYPES (from OpenAPI spec)
// ============================================================

/**
 * Education record response.
 * Maps to /api/v1/profiles/jobseeker/education endpoints
 */
export interface EducationResponse {
  educationId?: number;
  profileId?: number;
  degree: string;
  fieldOfStudy?: string;
  institutionName: string;
  university?: string;
  startDate: string; // ISO 8601 date format
  endDate?: string; // ISO 8601 date format
  percentageOrCgpa?: number;
  description?: string;
  isCurrent?: boolean;
  _links?: Record<string, any>;
}

export interface AddEducationRequest {
  degree: string;
  fieldOfStudy?: string;
  institutionName: string;
  university?: string;
  startDate: string;
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

// ============================================================
// COMPANY REVIEW TYPES (from OpenAPI spec)
// ============================================================

/**
 * Company review response model.
 * Maps to /api/v1/companies/{companyId}/reviews endpoints
 */
export interface CompanyReviewResponse {
  reviewId?: number;
  companyId: number;
  profileId?: number;
  reviewerName?: string;
  overallRating: number;
  workLifeBalance?: number;
  salaryBenefits?: number;
  careerGrowth?: number;
  management?: number;
  culture?: number;
  reviewTitle: string;
  pros: string;
  cons: string;
  adviceToManagement?: string;
  jobTitle: string;
  employmentStatus: EmploymentStatus;
  location?: string;
  isCurrentEmployee?: boolean;
  isAnonymous?: boolean;
  isApproved?: boolean;
  createdAt?: string;
  _links?: Record<string, any>;
}

export interface CreateCompanyReviewRequest {
  overallRating: number;
  workLifeBalance?: number;
  salaryBenefits?: number;
  careerGrowth?: number;
  management?: number;
  culture?: number;
  reviewTitle: string;
  pros: string;
  cons: string;
  adviceToManagement?: string;
  jobTitle: string;
  employmentStatus: EmploymentStatus;
  location?: string;
  isCurrentEmployee?: boolean;
  isAnonymous?: boolean;
}

export interface UpdateCompanyReviewRequest {
  overallRating?: number;
  workLifeBalance?: number;
  salaryBenefits?: number;
  careerGrowth?: number;
  management?: number;
  culture?: number;
  reviewTitle?: string;
  pros?: string;
  cons?: string;
  adviceToManagement?: string;
  jobTitle?: string;
  employmentStatus?: EmploymentStatus;
  location?: string;
  isCurrentEmployee?: boolean;
  isAnonymous?: boolean;
}

// ============================================================
// EMPLOYER PROFILE TYPES (from OpenAPI spec)
// ============================================================

/**
 * Employer profile response model.
 * Maps to /api/v1/profiles/employer/* endpoints
 */
export interface EmployerProfileResponse {
  employerId?: number;
  userId?: number;
  companyId: number;
  companyName: string;
  companyWebsite?: string;
  companyDescription?: string;
  companyLogo?: string;
  industry?: string;
  companySize?: EmployerCompanySize;
  headquartersLocation?: string;
  contactPersonName?: string;
  contactPersonDesignation?: string;
  isVerified?: boolean;
  rating?: number;
  totalReviews?: number;
  createdAt?: string;
  updatedAt?: string;
  _links?: Record<string, any>;
}

export interface CreateEmployerProfileRequest {
  companyId: number;
  companyName: string;
  companyWebsite?: string;
  companyDescription?: string;
  industry?: string;
  companySize?: EmployerCompanySize;
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
  companySize?: EmployerCompanySize;
  headquartersLocation?: string;
  contactPersonName?: string;
  contactPersonDesignation?: string;
}

// ============================================================
// PAGINATION & UTILITY TYPES
// ============================================================

export interface PageMetadata {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface PagedResponse<T> {
  _embedded?: Record<string, T[]>;
  page?: PageMetadata;
  _links?: Record<string, any>;
}

export interface CollectionResponse<T> {
  _embedded?: Record<string, T[]>;
  _links?: Record<string, any>;
}

// ============================================================
// ERROR TYPES
// ============================================================

export interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
  path?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

// ============================================================
// USER DTO (for inter-service communication)
// ============================================================

export interface UserDTO {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  userType: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}
