import React, { createContext, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import {
  useMyJobseekerProfile,
  useCreateJobseekerProfile,
  useUpdateJobseekerProfile,
  useMyWorkExperience,
  useAddWorkExperience,
  useUpdateWorkExperience,
  useDeleteWorkExperience,
  useMyEducation,
  useAddEducation,
  useUpdateEducation,
  useDeleteEducation,
  useMySkills,
  useAddSkill,
  useRemoveSkill,
  useProfileCompletion,
  useMyEmployerProfile,
  useCreateEmployerProfile,
} from '@/hooks/useProfileApi';
import {
  JobseekerProfileResponse,
  WorkExperienceResponse,
  EducationResponse,
  JobseekerSkillResponse,
  CreateJobseekerProfileRequest,
  UpdateJobseekerProfileRequest,
  AddWorkExperienceRequest,
  UpdateWorkExperienceRequest,
  AddEducationRequest,
  UpdateEducationRequest,
  AddSkillRequest,
  EmployerProfileResponse,
  CreateEmployerProfileRequest,
} from '@/api/types/profile';

interface ProfileContextType {
  // State
  jobseekerProfile: JobseekerProfileResponse | null;
  employerProfile: EmployerProfileResponse | null;
  workExperience: WorkExperienceResponse[];
  education: EducationResponse[];
  skills: JobseekerSkillResponse[];
  completionPercentage: number;
  loading: boolean;
  error: string | null;

  // Jobseeker Profile operations
  createJobseekerProfile: (data: CreateJobseekerProfileRequest) => Promise<void>;
  updateJobseekerProfile: (data: UpdateJobseekerProfileRequest) => Promise<void>;

  // Employer Profile operations
  createEmployerProfile: (data: CreateEmployerProfileRequest) => Promise<void>;

  // Work Experience operations
  addWorkExperience: (data: AddWorkExperienceRequest) => Promise<void>;
  updateWorkExperience: (experienceId: number, data: UpdateWorkExperienceRequest) => Promise<void>;
  deleteWorkExperience: (experienceId: number) => Promise<void>;

  // Education operations
  addEducation: (data: AddEducationRequest) => Promise<void>;
  updateEducation: (educationId: number, data: UpdateEducationRequest) => Promise<void>;
  deleteEducation: (educationId: number) => Promise<void>;

  // Skills operations
  addSkill: (data: AddSkillRequest) => Promise<void>;
  removeSkill: (skillId: number) => Promise<void>;

  // Utilities
  loadAllData: () => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode; autoLoad?: boolean }> = ({
  children,
  autoLoad = false,
}) => {
  // Jobseeker Profile queries
  const { data: jobseekerData, refetch: refetchJobseeker, isLoading: jobseekerLoading } = useMyJobseekerProfile();
  const { data: employerData, refetch: refetchEmployer } = useMyEmployerProfile();
  const { data: experienceData, refetch: refetchExperience } = useMyWorkExperience();
  const { data: educationData, refetch: refetchEducation } = useMyEducation();
  const { data: skillsData, refetch: refetchSkills } = useMySkills();
  const { data: completionData } = useProfileCompletion();

  // Jobseeker mutations
  const { mutateAsync: createJobseekerAsync, isPending: creatingJobseeker } = useCreateJobseekerProfile();
  const { mutateAsync: updateJobseekerAsync, isPending: updatingJobseeker } = useUpdateJobseekerProfile();

  // Employer mutations
  const { mutateAsync: createEmployerAsync } = useCreateEmployerProfile();

  // Experience mutations
  const { mutateAsync: addExperienceAsync } = useAddWorkExperience();
  const { mutateAsync: updateExperienceAsync } = useUpdateWorkExperience();
  const { mutateAsync: deleteExperienceAsync } = useDeleteWorkExperience();

  // Education mutations
  const { mutateAsync: addEducationAsync } = useAddEducation();
  const { mutateAsync: updateEducationAsync } = useUpdateEducation();
  const { mutateAsync: deleteEducationAsync } = useDeleteEducation();

  // Skills mutations
  const { mutateAsync: addSkillAsync } = useAddSkill();
  const { mutateAsync: removeSkillAsync } = useRemoveSkill();

  // Auto-load profile on mount if explicitly enabled AND user is authenticated
  useEffect(() => {
    if (autoLoad) {
      const token = localStorage.getItem('authToken');
      if (token) {
        loadAllData();
      }
    }
  }, [autoLoad]);

  const loadAllData = useCallback(async () => {
    try {
      await Promise.all([
        refetchJobseeker(),
        refetchEmployer(),
        refetchExperience(),
        refetchEducation(),
        refetchSkills(),
      ]);
    } catch (err) {
      console.error('Failed to load profile data:', err);
    }
  }, [refetchJobseeker, refetchEmployer, refetchExperience, refetchEducation, refetchSkills]);

  const createJobseekerProfileCb = useCallback(
    async (data: CreateJobseekerProfileRequest) => {
      await createJobseekerAsync(data);
      await refetchJobseeker();
    },
    [createJobseekerAsync, refetchJobseeker]
  );

  const updateJobseekerProfileCb = useCallback(
    async (data: UpdateJobseekerProfileRequest) => {
      await updateJobseekerAsync(data);
      await refetchJobseeker();
    },
    [updateJobseekerAsync, refetchJobseeker]
  );

  const createEmployerProfileCb = useCallback(
    async (data: CreateEmployerProfileRequest) => {
      await createEmployerAsync(data);
      await refetchEmployer();
    },
    [createEmployerAsync, refetchEmployer]
  );

  const addWorkExperienceCb = useCallback(
    async (data: AddWorkExperienceRequest) => {
      await addExperienceAsync(data);
      await refetchExperience();
    },
    [addExperienceAsync, refetchExperience]
  );

  const updateWorkExperienceCb = useCallback(
    async (experienceId: number, data: UpdateWorkExperienceRequest) => {
      await updateExperienceAsync({ id: experienceId, data });
      await refetchExperience();
    },
    [updateExperienceAsync, refetchExperience]
  );

  const deleteWorkExperienceCb = useCallback(
    async (experienceId: number) => {
      await deleteExperienceAsync(experienceId);
      await refetchExperience();
    },
    [deleteExperienceAsync, refetchExperience]
  );

  const addEducationCb = useCallback(
    async (data: AddEducationRequest) => {
      await addEducationAsync(data);
      await refetchEducation();
    },
    [addEducationAsync, refetchEducation]
  );

  const updateEducationCb = useCallback(
    async (educationId: number, data: UpdateEducationRequest) => {
      await updateEducationAsync({ id: educationId, data });
      await refetchEducation();
    },
    [updateEducationAsync, refetchEducation]
  );

  const deleteEducationCb = useCallback(
    async (educationId: number) => {
      await deleteEducationAsync(educationId);
      await refetchEducation();
    },
    [deleteEducationAsync, refetchEducation]
  );

  const addSkillCb = useCallback(
    async (data: AddSkillRequest) => {
      await addSkillAsync(data);
      await refetchSkills();
    },
    [addSkillAsync, refetchSkills]
  );

  const removeSkillCb = useCallback(
    async (skillId: number) => {
      await removeSkillAsync(skillId);
      await refetchSkills();
    },
    [removeSkillAsync, refetchSkills]
  );

  const refreshProfile = useCallback(async () => {
    await loadAllData();
  }, [loadAllData]);

  const value = useMemo<ProfileContextType>(
    () => ({
      jobseekerProfile: jobseekerData || null,
      employerProfile: employerData || null,
      workExperience: experienceData || [],
      education: educationData || [],
      skills: skillsData || [],
      completionPercentage: completionData?.completionPercentage || 0,
      loading: jobseekerLoading || creatingJobseeker || updatingJobseeker,
      error: null,

      createJobseekerProfile: createJobseekerProfileCb,
      updateJobseekerProfile: updateJobseekerProfileCb,
      createEmployerProfile: createEmployerProfileCb,
      addWorkExperience: addWorkExperienceCb,
      updateWorkExperience: updateWorkExperienceCb,
      deleteWorkExperience: deleteWorkExperienceCb,
      addEducation: addEducationCb,
      updateEducation: updateEducationCb,
      deleteEducation: deleteEducationCb,
      addSkill: addSkillCb,
      removeSkill: removeSkillCb,
      loadAllData,
      clearError: () => {},
      refreshProfile,
    }),
    [
      jobseekerData,
      employerData,
      experienceData,
      educationData,
      skillsData,
      completionData,
      jobseekerLoading,
      creatingJobseeker,
      updatingJobseeker,
      createJobseekerProfileCb,
      updateJobseekerProfileCb,
      createEmployerProfileCb,
      addWorkExperienceCb,
      updateWorkExperienceCb,
      deleteWorkExperienceCb,
      addEducationCb,
      updateEducationCb,
      deleteEducationCb,
      addSkillCb,
      removeSkillCb,
      loadAllData,
      refreshProfile,
    ]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
