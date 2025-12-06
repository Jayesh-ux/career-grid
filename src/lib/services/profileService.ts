import { profileServiceClient, handleApiError } from '@/lib/apiClient';
import {
  JobseekerProfileResponse,
  EmployerProfileResponse,
  CreateJobseekerProfileRequest,
  UpdateJobseekerProfileRequest,
  CreateEmployerProfileRequest,
  UpdateEmployerProfileRequest,
  SkillResponse,
  JobseekerSkillResponse,
  AddSkillRequest,
  WorkExperienceResponse,
  AddWorkExperienceRequest,
  UpdateWorkExperienceRequest,
  EducationResponse,
  AddEducationRequest,
  UpdateEducationRequest,
  CompanyResponse,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  CompanyReviewResponse,
  CreateCompanyReviewRequest,
} from '@/api/types/profile';

export const profileService = {
  // Jobseeker Profile
  createJobseekerProfile: async (data: CreateJobseekerProfileRequest) => {
    try {
      const response = await profileServiceClient.post('/profiles/jobseeker', data);
      return response.data as JobseekerProfileResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getMyJobseekerProfile: async () => {
    try {
      const response = await profileServiceClient.get('/profiles/jobseeker/me');
      return response.data as JobseekerProfileResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getJobseekerProfile: async (profileId: number) => {
    try {
      const response = await profileServiceClient.get(`/profiles/jobseeker/${profileId}`);
      return response.data as JobseekerProfileResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  updateJobseekerProfile: async (data: UpdateJobseekerProfileRequest) => {
    try {
      const response = await profileServiceClient.put('/profiles/jobseeker/me', data);
      return response.data as JobseekerProfileResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  deleteJobseekerProfile: async () => {
    try {
      const response = await profileServiceClient.delete('/profiles/jobseeker/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  jobseekerProfileExists: async () => {
    try {
      const response = await profileServiceClient.get('/profiles/jobseeker/exists');
      return response.data as { hasProfile: boolean };
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getProfileCompletion: async () => {
    try {
      const response = await profileServiceClient.get('/profiles/jobseeker/me/completion');
      return response.data as { completionPercentage: number };
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getProfileSummary: async () => {
    try {
      const response = await profileServiceClient.get('/profiles/jobseeker/me/summary');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Employer Profile
  createEmployerProfile: async (data: CreateEmployerProfileRequest) => {
    try {
      const response = await profileServiceClient.post('/profiles/employer', data);
      return response.data as EmployerProfileResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getMyEmployerProfile: async () => {
    try {
      const response = await profileServiceClient.get('/profiles/employer/me');
      return response.data as EmployerProfileResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getEmployerProfile: async (employerId: number) => {
    try {
      const response = await profileServiceClient.get(`/profiles/employer/${employerId}`);
      return response.data as EmployerProfileResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  updateEmployerProfile: async (data: UpdateEmployerProfileRequest) => {
    try {
      const response = await profileServiceClient.put('/profiles/employer/me', data);
      return response.data as EmployerProfileResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  deleteEmployerProfile: async () => {
    try {
      const response = await profileServiceClient.delete('/profiles/employer/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  employerProfileExists: async () => {
    try {
      const response = await profileServiceClient.get('/profiles/employer/exists');
      return response.data as boolean;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Skills
  getAllSkills: async () => {
    try {
      const response = await profileServiceClient.get('/profiles/jobseeker/skills/catalog');
      return response.data as SkillResponse[];
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getSkillById: async (skillId: number) => {
    try {
      const response = await profileServiceClient.get(`/profiles/jobseeker/skills/catalog/${skillId}`);
      return response.data as SkillResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getMySkills: async () => {
    try {
      const response = await profileServiceClient.get('/profiles/jobseeker/skills');
      return response.data as JobseekerSkillResponse[];
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  addSkill: async (data: AddSkillRequest) => {
    try {
      const response = await profileServiceClient.post('/profiles/jobseeker/skills', data);
      return response.data as JobseekerSkillResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  removeSkill: async (skillId: number) => {
    try {
      const response = await profileServiceClient.delete(`/profiles/jobseeker/skills/${skillId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Work Experience
  getMyWorkExperience: async () => {
    try {
      const response = await profileServiceClient.get('/profiles/jobseeker/experience');
      return response.data as WorkExperienceResponse[];
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  addWorkExperience: async (data: AddWorkExperienceRequest) => {
    try {
      const response = await profileServiceClient.post('/profiles/jobseeker/experience', data);
      return response.data as WorkExperienceResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  updateWorkExperience: async (experienceId: number, data: UpdateWorkExperienceRequest) => {
    try {
      const response = await profileServiceClient.put(
        `/profiles/jobseeker/experience/${experienceId}`,
        data
      );
      return response.data as WorkExperienceResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  deleteWorkExperience: async (experienceId: number) => {
    try {
      const response = await profileServiceClient.delete(`/profiles/jobseeker/experience/${experienceId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Education
  getMyEducation: async () => {
    try {
      const response = await profileServiceClient.get('/profiles/jobseeker/education');
      return response.data as EducationResponse[];
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  addEducation: async (data: AddEducationRequest) => {
    try {
      const response = await profileServiceClient.post('/profiles/jobseeker/education', data);
      return response.data as EducationResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  updateEducation: async (educationId: number, data: UpdateEducationRequest) => {
    try {
      const response = await profileServiceClient.put(
        `/profiles/jobseeker/education/${educationId}`,
        data
      );
      return response.data as EducationResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  deleteEducation: async (educationId: number) => {
    try {
      const response = await profileServiceClient.delete(`/profiles/jobseeker/education/${educationId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Companies
  getAllCompanies: async (page: number = 0, size: number = 10) => {
    try {
      const response = await profileServiceClient.get('/companies', {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getCompanyById: async (companyId: number) => {
    try {
      const response = await profileServiceClient.get(`/api/v1/companies/${companyId}`);
      return response.data as CompanyResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  searchCompanies: async (name: string) => {
    try {
      const response = await profileServiceClient.get('/api/v1/companies/search', {
        params: { name },
      });
      return response.data as CompanyResponse[];
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  createCompany: async (data: CreateCompanyRequest) => {
    try {
      const response = await profileServiceClient.post('/api/v1/companies', data);
      return response.data as CompanyResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  updateCompany: async (companyId: number, data: UpdateCompanyRequest) => {
    try {
      const response = await profileServiceClient.put(`/api/v1/companies/${companyId}`, data);
      return response.data as CompanyResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  deleteCompany: async (companyId: number) => {
    try {
      const response = await profileServiceClient.delete(`/api/v1/companies/${companyId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getMyCompanies: async () => {
    try {
      const response = await profileServiceClient.get('/api/v1/companies/my-companies');
      return response.data as CompanyResponse[];
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Company Reviews
  getCompanyReviews: async (companyId: number, onlyApproved: boolean = true) => {
    try {
      const response = await profileServiceClient.get(`/api/v1/companies/${companyId}/reviews`, {
        params: { onlyApproved },
      });
      return response.data as CompanyReviewResponse[];
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  submitReview: async (companyId: number, data: CreateCompanyReviewRequest) => {
    try {
      const response = await profileServiceClient.post(
        `/api/v1/companies/${companyId}/reviews`,
        data
      );
      return response.data as CompanyReviewResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  updateReview: async (reviewId: number, data: CreateCompanyReviewRequest) => {
    try {
      const response = await profileServiceClient.put(`/api/v1/companies/reviews/${reviewId}`, data);
      return response.data as CompanyReviewResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  deleteReview: async (reviewId: number) => {
    try {
      const response = await profileServiceClient.delete(`/api/v1/companies/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getMyReviews: async () => {
    try {
      const response = await profileServiceClient.get('/api/v1/companies/reviews/my-reviews');
      return response.data as CompanyReviewResponse[];
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  approveReview: async (reviewId: number) => {
    try {
      const response = await profileServiceClient.patch(
        `/api/v1/companies/reviews/${reviewId}/approve`
      );
      return response.data as CompanyReviewResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  rejectReview: async (reviewId: number) => {
    try {
      const response = await profileServiceClient.patch(
        `/api/v1/companies/reviews/${reviewId}/reject`
      );
      return response.data as CompanyReviewResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Health Check
  healthCheck: async () => {
    try {
      const response = await profileServiceClient.get('/health');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  readinessCheck: async () => {
    try {
      const response = await profileServiceClient.get('/health/ready');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },
};
