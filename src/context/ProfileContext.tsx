import React, { createContext, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { useProfileApi } from '@/hooks/useProfileApi';
import {
  JobseekerProfileResponse,
  EmployerProfileResponse,
  SkillResponse,
  EducationResponse,
  WorkExperienceResponse,
  CreateJobseekerProfileRequest,
  CreateEmployerProfileRequest,
  CreateSkillRequest,
  CreateEducationRequest,
  CreateWorkExperienceRequest,
} from '@/lib/services/profileService';

// Type aliases for compatibility with existing ProfileContext interface
type JobseekerSkillResponse = SkillResponse;
type AddSkillRequest = CreateSkillRequest;
type AddEducationRequest = CreateEducationRequest;
type AddWorkExperienceRequest = CreateWorkExperienceRequest;
type UpdateJobseekerProfileRequest = Partial<CreateJobseekerProfileRequest>;
type UpdateWorkExperienceRequest = Partial<CreateWorkExperienceRequest>;
type UpdateEducationRequest = Partial<CreateEducationRequest>;



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
  const profileApi = useProfileApi();

  // Local state for profile data
  const [jobseekerProfile, setJobseekerProfile] = React.useState<JobseekerProfileResponse | null>(null);
  const [employerProfile, setEmployerProfile] = React.useState<EmployerProfileResponse | null>(null);
  const [workExperience, setWorkExperience] = React.useState<WorkExperienceResponse[]>([]);
  const [education, setEducation] = React.useState<EducationResponse[]>([]);
  const [skills, setSkills] = React.useState<JobseekerSkillResponse[]>([]);
  const [completionPercentage, setCompletionPercentage] = React.useState(0);

  const loadAllData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Try to load jobseeker profile first
      try {
        const [profile, exp, edu, sk, completion] = await Promise.all([
          profileApi.getMyJobseekerProfile(),
          profileApi.getMyWorkExperience(),
          profileApi.getMyEducation(),
          profileApi.getMySkills(),
          profileApi.getJobseekerCompletion(),
        ]);

        setJobseekerProfile(profile);
        setWorkExperience(exp);
        setEducation(edu);
        setSkills(sk);
        setCompletionPercentage(completion.completionPercentage);
      } catch (err: any) {
        // If 404, try employer profile
        if (err.response?.status === 404) {
          try {
            const empProfile = await profileApi.getMyEmployerProfile();
            setEmployerProfile(empProfile);
          } catch (empErr) {
            console.log('No profile found yet');
          }
        }
      }
    } catch (err) {
      console.error('Failed to load profile data:', err);
    }
  }, [profileApi]);

  // Auto-load profile on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      const token = localStorage.getItem('token');
      if (token) {
        loadAllData();
      }
    }
  }, [autoLoad, loadAllData]);

  const createJobseekerProfileCb = useCallback(
    async (data: CreateJobseekerProfileRequest) => {
      const profile = await profileApi.createJobseekerProfile(data);
      setJobseekerProfile(profile);
      await loadAllData();
    },
    [profileApi, loadAllData]
  );

  const updateJobseekerProfileCb = useCallback(
    async (data: UpdateJobseekerProfileRequest) => {
      const profile = await profileApi.updateMyJobseekerProfile(data);
      setJobseekerProfile(profile);
      const completion = await profileApi.getJobseekerCompletion();
      setCompletionPercentage(completion.completionPercentage);
    },
    [profileApi]
  );

  const createEmployerProfileCb = useCallback(
    async (data: CreateEmployerProfileRequest) => {
      const profile = await profileApi.createEmployerProfile(data);
      setEmployerProfile(profile);
    },
    [profileApi]
  );

  const addWorkExperienceCb = useCallback(
    async (data: AddWorkExperienceRequest) => {
      await profileApi.addWorkExperience(data);
      const exp = await profileApi.getMyWorkExperience();
      setWorkExperience(exp);
      const completion = await profileApi.getJobseekerCompletion();
      setCompletionPercentage(completion.completionPercentage);
    },
    [profileApi]
  );

  const updateWorkExperienceCb = useCallback(
    async (experienceId: number, data: UpdateWorkExperienceRequest) => {
      await profileApi.updateWorkExperience(experienceId, data);
      const exp = await profileApi.getMyWorkExperience();
      setWorkExperience(exp);
    },
    [profileApi]
  );

  const deleteWorkExperienceCb = useCallback(
    async (experienceId: number) => {
      await profileApi.deleteWorkExperience(experienceId);
      setWorkExperience(prev => prev.filter(e => e.experienceId !== experienceId));
    },
    [profileApi]
  );

  const addEducationCb = useCallback(
    async (data: AddEducationRequest) => {
      await profileApi.addEducation(data);
      const edu = await profileApi.getMyEducation();
      setEducation(edu);
      const completion = await profileApi.getJobseekerCompletion();
      setCompletionPercentage(completion.completionPercentage);
    },
    [profileApi]
  );

  const updateEducationCb = useCallback(
    async (educationId: number, data: UpdateEducationRequest) => {
      await profileApi.updateEducation(educationId, data);
      const edu = await profileApi.getMyEducation();
      setEducation(edu);
    },
    [profileApi]
  );

  const deleteEducationCb = useCallback(
    async (educationId: number) => {
      await profileApi.deleteEducation(educationId);
      setEducation(prev => prev.filter(e => e.educationId !== educationId));
    },
    [profileApi]
  );

  const addSkillCb = useCallback(
    async (data: AddSkillRequest) => {
      await profileApi.addSkillToProfile(data);
      const sk = await profileApi.getMySkills();
      setSkills(sk);
      const completion = await profileApi.getJobseekerCompletion();
      setCompletionPercentage(completion.completionPercentage);
    },
    [profileApi]
  );

  const removeSkillCb = useCallback(
    async (skillId: number) => {
      await profileApi.deleteSkill(skillId);
      setSkills(prev => prev.filter(s => s.id !== skillId));
    },
    [profileApi]
  );

  const refreshProfile = useCallback(async () => {
    await loadAllData();
  }, [loadAllData]);

  const value = useMemo<ProfileContextType>(
    () => ({
      jobseekerProfile,
      employerProfile,
      workExperience,
      education,
      skills,
      completionPercentage,
      loading: profileApi.loading,
      error: profileApi.error,

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
      jobseekerProfile,
      employerProfile,
      workExperience,
      education,
      skills,
      completionPercentage,
      profileApi.loading,
      profileApi.error,
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
