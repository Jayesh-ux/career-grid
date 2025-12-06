// Profile Service Types - Generated from OpenAPI spec
export interface JobseekerProfileResponse {
  profileId: number;
  userId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  currentLocation: string;
  preferredLocation: string;
  bio: string;
  profilePicture?: string;
  resumePath?: string;
  totalExperienceMonths: number;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod: 'IMMEDIATE' | 'DAYS_15' | 'MONTH_1' | 'MONTH_2' | 'MONTH_3';
  isProfileComplete: boolean;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerProfileResponse {
  employerId: number;
  userId: number;
  companyId: number;
  companyName: string;
  companyWebsite: string;
  companyDescription: string;
  companyLogo?: string;
  industry: string;
  companySize: 'SIZE_1_10' | 'SIZE_11_50' | 'SIZE_51_200' | 'SIZE_201_500' | 'SIZE_500_PLUS';
  headquartersLocation: string;
  contactPersonName: string;
  contactPersonDesignation: string;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobseekerProfileRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  currentLocation: string;
  preferredLocation: string;
  bio: string;
  totalExperienceMonths: number;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod: 'IMMEDIATE' | 'DAYS_15' | 'MONTH_1' | 'MONTH_2' | 'MONTH_3';
}

export interface UpdateJobseekerProfileRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  currentLocation?: string;
  preferredLocation?: string;
  bio?: string;
  totalExperienceMonths?: number;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod?: 'IMMEDIATE' | 'DAYS_15' | 'MONTH_1' | 'MONTH_2' | 'MONTH_3';
}

export interface CreateEmployerProfileRequest {
  companyId?: number;
  companyName: string;
  companyWebsite?: string;
  companyDescription?: string;
  industry?: string;
  companySize?: 'SIZE_1_10' | 'SIZE_11_50' | 'SIZE_51_200' | 'SIZE_201_500' | 'SIZE_500_PLUS';
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
  companySize?: 'SIZE_1_10' | 'SIZE_11_50' | 'SIZE_51_200' | 'SIZE_201_500' | 'SIZE_500_PLUS';
  headquartersLocation?: string;
  contactPersonName?: string;
  contactPersonDesignation?: string;
}

// Skills
export interface SkillResponse {
  skillId: number;
  skillName: string;
  category: string;
  description: string;
  isActive: boolean;
}

export interface JobseekerSkillResponse {
  id: number;
  profileId: number;
  skillId: number;
  skillName: string;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsOfExperience: number;
}

export interface AddSkillRequest {
  skillId: number;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsOfExperience?: number;
}

// Work Experience
export interface WorkExperienceResponse {
  experienceId: number;
  profileId: number;
  companyName: string;
  jobTitle: string;
  employmentType: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  jobDescription: string;
  location: string;
  salary?: number;
}

export interface AddWorkExperienceRequest {
  companyName: string;
  jobTitle: string;
  employmentType: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  jobDescription: string;
  location: string;
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
  fieldOfStudy: string;
  institutionName: string;
  university: string;
  startDate: string;
  endDate?: string;
  percentageOrCgpa: number;
  description: string;
  isCurrent: boolean;
}

export interface AddEducationRequest {
  degree: string;
  fieldOfStudy: string;
  institutionName: string;
  university: string;
  startDate: string;
  endDate?: string;
  percentageOrCgpa: number;
  description: string;
  isCurrent: boolean;
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

// Company
export interface CompanyResponse {
  companyId: number;
  adminUserId: number;
  companyName: string;
  website: string;
  description: string;
  logo?: string;
  industry: string;
  size: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  headquarters: string;
  foundedYear: number;
  rating: number;
  reviewCount: number;
  employeeCount: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  companyName: string;
  website?: string;
  description?: string;
  industry?: string;
  size?: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  headquarters?: string;
  foundedYear?: number;
  employeeCount?: number;
}

export interface UpdateCompanyRequest {
  companyName?: string;
  website?: string;
  description?: string;
  industry?: string;
  size?: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  headquarters?: string;
  foundedYear?: number;
  employeeCount?: number;
}

// Company Reviews
export interface CompanyReviewResponse {
  reviewId: number;
  companyId: number;
  profileId: number;
  reviewerName: string;
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
  jobTitle: string;
  employmentStatus: string;
  location: string;
  isCurrentEmployee: boolean;
  isAnonymous: boolean;
}
