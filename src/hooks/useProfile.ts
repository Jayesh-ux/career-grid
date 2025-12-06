/**
 * React Query hooks for jobseeker profile and related data.
 * Uses consolidated API from src/lib/api.ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  JobseekerProfileResponse,
  CreateJobseekerProfileRequest,
  UpdateJobseekerProfileRequest,
  WorkExperienceResponse,
  EducationResponse,
  AddWorkExperienceRequest,
  AddEducationRequest,
  UpdateWorkExperienceRequest,
  UpdateEducationRequest,
} from '@/lib/api';
import {
  JobseekerProfileApi,
  WorkExperienceApi,
  EducationApi,
} from '@/lib/api';

/**
 * Hook: Get my jobseeker profile.
 */
export function useMyJobseekerProfile() {
  return useQuery({
    queryKey: ['my-jobseeker-profile'],
    queryFn: () => JobseekerProfileApi.getMe(),
  });
}

/**
 * Hook: Get jobseeker profile by ID (public).
 */
export function useJobseekerProfile(profileId: number) {
  return useQuery({
    queryKey: ['jobseeker-profile', profileId],
    queryFn: () => JobseekerProfileApi.getById(profileId),
    enabled: !!profileId,
  });
}

/**
 * Hook: Create jobseeker profile.
 */
export function useCreateJobseekerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobseekerProfileRequest) =>
      JobseekerProfileApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobseeker-profile'] });
      queryClient.invalidateQueries({
        queryKey: ['jobseeker-profile-exists'],
      });
    },
  });
}

/**
 * Hook: Update my jobseeker profile.
 */
export function useUpdateJobseekerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateJobseekerProfileRequest) =>
      JobseekerProfileApi.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobseeker-profile'] });
      queryClient.invalidateQueries({
        queryKey: ['profile-completion'],
      });
    },
  });
}

/**
 * Hook: Delete my jobseeker profile.
 */
export function useDeleteJobseekerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => JobseekerProfileApi.deleteMe(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobseeker-profile'] });
      queryClient.invalidateQueries({
        queryKey: ['jobseeker-profile-exists'],
      });
    },
  });
}

/**
 * Hook: Check if user has jobseeker profile.
 */
export function useHasJobseekerProfile() {
  return useQuery({
    queryKey: ['jobseeker-profile-exists'],
    queryFn: () => JobseekerProfileApi.exists(),
  });
}

/**
 * Hook: Get profile completion percentage.
 */
export function useProfileCompletion() {
  return useQuery({
    queryKey: ['profile-completion'],
    queryFn: () => JobseekerProfileApi.getCompletion(),
  });
}

/**
 * Hook: Get profile summary (profile + skills + experience + education).
 */
export function useProfileSummary() {
  return useQuery({
    queryKey: ['profile-summary'],
    queryFn: () => JobseekerProfileApi.getSummary(),
  });
}

/**
 * Hook: Get my work experience.
 */
export function useMyWorkExperience() {
  return useQuery({
    queryKey: ['my-work-experience'],
    queryFn: () => WorkExperienceApi.getAll(),
  });
}

/**
 * Hook: Add work experience.
 */
export function useAddWorkExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddWorkExperienceRequest) =>
      WorkExperienceApi.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-work-experience'] });
      queryClient.invalidateQueries({
        queryKey: ['profile-completion'],
      });
    },
  });
}

/**
 * Hook: Update work experience.
 */
export function useUpdateWorkExperience(experienceId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateWorkExperienceRequest) =>
      WorkExperienceApi.update(experienceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-work-experience'] });
    },
  });
}

/**
 * Hook: Delete work experience.
 */
export function useDeleteWorkExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (experienceId: number) =>
      WorkExperienceApi.delete(experienceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-work-experience'] });
    },
  });
}

/**
 * Hook: Get my education.
 */
export function useMyEducation() {
  return useQuery({
    queryKey: ['my-education'],
    queryFn: () => EducationApi.getAll(),
  });
}

/**
 * Hook: Add education.
 */
export function useAddEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddEducationRequest) => EducationApi.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-education'] });
      queryClient.invalidateQueries({
        queryKey: ['profile-completion'],
      });
    },
  });
}

/**
 * Hook: Update education.
 */
export function useUpdateEducation(educationId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateEducationRequest) =>
      EducationApi.update(educationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-education'] });
    },
  });
}

/**
 * Hook: Delete education.
 */
export function useDeleteEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (educationId: number) => EducationApi.delete(educationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-education'] });
    },
  });
}
