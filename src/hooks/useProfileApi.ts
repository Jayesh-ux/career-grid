import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/lib/services/profileService';
import {
  JobseekerProfileResponse,
  EmployerProfileResponse,
  CreateJobseekerProfileRequest,
  UpdateJobseekerProfileRequest,
  CreateEmployerProfileRequest,
  UpdateEmployerProfileRequest,
  AddSkillRequest,
  AddWorkExperienceRequest,
  UpdateWorkExperienceRequest,
  AddEducationRequest,
  UpdateEducationRequest,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  CreateCompanyReviewRequest,
} from '@/api/types/profile';

// Jobseeker Profile Hooks
export const useCreateJobseekerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobseekerProfileRequest) =>
      profileService.createJobseekerProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobseekerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['profileExists'] });
    },
  });
};

export const useMyJobseekerProfile = () => {
  return useQuery({
    queryKey: ['jobseekerProfile', 'me'],
    queryFn: () => profileService.getMyJobseekerProfile(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useJobseekerProfile = (profileId: number) => {
  return useQuery({
    queryKey: ['jobseekerProfile', profileId],
    queryFn: () => profileService.getJobseekerProfile(profileId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useUpdateJobseekerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateJobseekerProfileRequest) =>
      profileService.updateJobseekerProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobseekerProfile', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['profileCompletion'] });
    },
  });
};

export const useJobseekerProfileExists = () => {
  return useQuery({
    queryKey: ['profileExists', 'jobseeker'],
    queryFn: () => profileService.jobseekerProfileExists(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useProfileCompletion = () => {
  return useQuery({
    queryKey: ['profileCompletion'],
    queryFn: () => profileService.getProfileCompletion(),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useProfileSummary = () => {
  return useQuery({
    queryKey: ['profileSummary'],
    queryFn: () => profileService.getProfileSummary(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

// Employer Profile Hooks
export const useCreateEmployerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEmployerProfileRequest) =>
      profileService.createEmployerProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['profileExists', 'employer'] });
    },
  });
};

export const useMyEmployerProfile = () => {
  return useQuery({
    queryKey: ['employerProfile', 'me'],
    queryFn: () => profileService.getMyEmployerProfile(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useEmployerProfile = (employerId: number) => {
  return useQuery({
    queryKey: ['employerProfile', employerId],
    queryFn: () => profileService.getEmployerProfile(employerId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useUpdateEmployerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateEmployerProfileRequest) =>
      profileService.updateEmployerProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerProfile', 'me'] });
    },
  });
};

export const useEmployerProfileExists = () => {
  return useQuery({
    queryKey: ['profileExists', 'employer'],
    queryFn: () => profileService.employerProfileExists(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

// Skills Hooks
export const useAllSkills = () => {
  return useQuery({
    queryKey: ['skills', 'all'],
    queryFn: () => profileService.getAllSkills(),
    retry: 1,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

export const useMySkills = () => {
  return useQuery({
    queryKey: ['skills', 'my'],
    queryFn: () => profileService.getMySkills(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useAddSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddSkillRequest) => profileService.addSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['profileCompletion'] });
    },
  });
};

export const useRemoveSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skillId: number) => profileService.removeSkill(skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills', 'my'] });
    },
  });
};

// Work Experience Hooks
export const useMyWorkExperience = () => {
  return useQuery({
    queryKey: ['workExperience', 'my'],
    queryFn: () => profileService.getMyWorkExperience(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useAddWorkExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddWorkExperienceRequest) => profileService.addWorkExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workExperience', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['profileCompletion'] });
    },
  });
};

export const useUpdateWorkExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateWorkExperienceRequest }) =>
      profileService.updateWorkExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workExperience', 'my'] });
    },
  });
};

export const useDeleteWorkExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (experienceId: number) => profileService.deleteWorkExperience(experienceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workExperience', 'my'] });
    },
  });
};

// Education Hooks
export const useMyEducation = () => {
  return useQuery({
    queryKey: ['education', 'my'],
    queryFn: () => profileService.getMyEducation(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useAddEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddEducationRequest) => profileService.addEducation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['profileCompletion'] });
    },
  });
};

export const useUpdateEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEducationRequest }) =>
      profileService.updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education', 'my'] });
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (educationId: number) => profileService.deleteEducation(educationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education', 'my'] });
    },
  });
};

// Company Hooks
export const useAllCompanies = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ['companies', 'all', page, size],
    queryFn: () => profileService.getAllCompanies(page, size),
    retry: 1,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCompanyById = (companyId: number) => {
  return useQuery({
    queryKey: ['company', companyId],
    queryFn: () => profileService.getCompanyById(companyId),
    retry: 1,
    staleTime: 10 * 60 * 1000,
  });
};

export const useSearchCompanies = (name: string) => {
  return useQuery({
    queryKey: ['companies', 'search', name],
    queryFn: () => profileService.searchCompanies(name),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!name,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCompanyRequest) => profileService.createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies', 'my'] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCompanyRequest }) =>
      profileService.updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies', 'my'] });
    },
  });
};

export const useMyCompanies = () => {
  return useQuery({
    queryKey: ['companies', 'my'],
    queryFn: () => profileService.getMyCompanies(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

// Company Reviews Hooks
export const useCompanyReviews = (companyId: number, onlyApproved: boolean = true) => {
  return useQuery({
    queryKey: ['companyReviews', companyId, onlyApproved],
    queryFn: () => profileService.getCompanyReviews(companyId, onlyApproved),
    retry: 1,
    staleTime: 10 * 60 * 1000,
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, data }: { companyId: number; data: CreateCompanyReviewRequest }) =>
      profileService.submitReview(companyId, data),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ['companyReviews', companyId] });
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
    },
  });
};

export const useMyReviews = () => {
  return useQuery({
    queryKey: ['myReviews'],
    queryFn: () => profileService.getMyReviews(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateCompanyReviewRequest }) =>
      profileService.updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyReviews'] });
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: number) => profileService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyReviews'] });
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
    },
  });
};
