import { useState } from 'react';
import {
  // Jobseeker Profile
  createJobseekerProfile,
  getMyJobseekerProfile,
  getJobseekerProfileById,
  updateMyJobseekerProfile,
  deleteMyJobseekerProfile,
  checkJobseekerProfileExists,
  getJobseekerCompletion,
  getJobseekerSummary,

  // Employer Profile
  createEmployerProfile,
  getMyEmployerProfile,
  getEmployerProfileById,
  updateMyEmployerProfile,
  deleteMyEmployerProfile,
  checkEmployerProfileExists,

  // Skills
  getAllSkills,
  searchSkills,
  addSkillToProfile,
  getMySkills,
  updateSkill,
  deleteSkill,

  // Education
  addEducation,
  getMyEducation,
  updateEducation,
  deleteEducation,

  // Work Experience
  addWorkExperience,
  getMyWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,

  // Companies
  createCompany,
  getCompanyById,
  getAllCompanies,
  searchCompanies,
  getMyCompanies,
  updateCompany,
  deleteCompany,

  // Company Reviews
  submitCompanyReview,
  getCompanyReviews,
  getMyReviews,
  updateReview,
  deleteReview,

  // Types
  type JobseekerProfileResponse,
  type EmployerProfileResponse,
  type CreateJobseekerProfileRequest,
  type CreateEmployerProfileRequest,
  type CreateSkillRequest,
  type CreateEducationRequest,
  type CreateWorkExperienceRequest,
  type CreateCompanyRequest,
  type CreateReviewRequest,
} from '@/lib/services/profileService';

export const useProfileApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async <T,>(apiCall: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,

    // Jobseeker Profile
    createJobseekerProfile: (data: CreateJobseekerProfileRequest) =>
      handleApiCall(() => createJobseekerProfile(data)),
    getMyJobseekerProfile: () => handleApiCall(() => getMyJobseekerProfile()),
    getJobseekerProfileById: (profileId: number) =>
      handleApiCall(() => getJobseekerProfileById(profileId)),
    updateMyJobseekerProfile: (data: Partial<CreateJobseekerProfileRequest>) =>
      handleApiCall(() => updateMyJobseekerProfile(data)),
    deleteMyJobseekerProfile: () => handleApiCall(() => deleteMyJobseekerProfile()),
    checkJobseekerProfileExists: () => handleApiCall(() => checkJobseekerProfileExists()),
    getJobseekerCompletion: () => handleApiCall(() => getJobseekerCompletion()),
    getJobseekerSummary: () => handleApiCall(() => getJobseekerSummary()),

    // Employer Profile
    createEmployerProfile: (data: CreateEmployerProfileRequest) =>
      handleApiCall(() => createEmployerProfile(data)),
    getMyEmployerProfile: () => handleApiCall(() => getMyEmployerProfile()),
    getEmployerProfileById: (employerId: number) =>
      handleApiCall(() => getEmployerProfileById(employerId)),
    updateMyEmployerProfile: (data: Partial<CreateEmployerProfileRequest>) =>
      handleApiCall(() => updateMyEmployerProfile(data)),
    deleteMyEmployerProfile: () => handleApiCall(() => deleteMyEmployerProfile()),
    checkEmployerProfileExists: () => handleApiCall(() => checkEmployerProfileExists()),

    // Skills
    getAllSkills: (page = 0, size = 50) => handleApiCall(() => getAllSkills(page, size)),
    searchSkills: (name: string) => handleApiCall(() => searchSkills(name)),
    addSkillToProfile: (data: CreateSkillRequest) =>
      handleApiCall(() => addSkillToProfile(data)),
    getMySkills: () => handleApiCall(() => getMySkills()),
    updateSkill: (id: number, data: Partial<CreateSkillRequest>) =>
      handleApiCall(() => updateSkill(id, data)),
    deleteSkill: (id: number) => handleApiCall(() => deleteSkill(id)),

    // Education
    addEducation: (data: CreateEducationRequest) => handleApiCall(() => addEducation(data)),
    getMyEducation: () => handleApiCall(() => getMyEducation()),
    updateEducation: (educationId: number, data: Partial<CreateEducationRequest>) =>
      handleApiCall(() => updateEducation(educationId, data)),
    deleteEducation: (educationId: number) => handleApiCall(() => deleteEducation(educationId)),

    // Work Experience
    addWorkExperience: (data: CreateWorkExperienceRequest) =>
      handleApiCall(() => addWorkExperience(data)),
    getMyWorkExperience: () => handleApiCall(() => getMyWorkExperience()),
    updateWorkExperience: (experienceId: number, data: Partial<CreateWorkExperienceRequest>) =>
      handleApiCall(() => updateWorkExperience(experienceId, data)),
    deleteWorkExperience: (experienceId: number) =>
      handleApiCall(() => deleteWorkExperience(experienceId)),

    // Companies
    createCompany: (data: CreateCompanyRequest) => handleApiCall(() => createCompany(data)),
    getCompanyById: (companyId: number) => handleApiCall(() => getCompanyById(companyId)),
    getAllCompanies: (page = 0, size = 10) => handleApiCall(() => getAllCompanies(page, size)),
    searchCompanies: (name: string) => handleApiCall(() => searchCompanies(name)),
    getMyCompanies: () => handleApiCall(() => getMyCompanies()),
    updateCompany: (companyId: number, data: Partial<CreateCompanyRequest>) =>
      handleApiCall(() => updateCompany(companyId, data)),
    deleteCompany: (companyId: number) => handleApiCall(() => deleteCompany(companyId)),

    // Company Reviews
    submitCompanyReview: (companyId: number, data: CreateReviewRequest) =>
      handleApiCall(() => submitCompanyReview(companyId, data)),
    getCompanyReviews: (companyId: number, onlyApproved = true) =>
      handleApiCall(() => getCompanyReviews(companyId, onlyApproved)),
    getMyReviews: () => handleApiCall(() => getMyReviews()),
    updateReview: (reviewId: number, data: Partial<CreateReviewRequest>) =>
      handleApiCall(() => updateReview(reviewId, data)),
    deleteReview: (reviewId: number) => handleApiCall(() => deleteReview(reviewId)),
  };
};
