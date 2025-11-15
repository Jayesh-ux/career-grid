import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useJobseekerProfile } from '@/hooks/useJobseekerProfile';
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
} from '@/lib/profileApi';

interface ProfileContextType {
  // State
  profile: JobseekerProfileResponse | null;
  workExperience: WorkExperienceResponse[];
  education: EducationResponse[];
  skills: JobseekerSkillResponse[];
  loading: boolean;
  error: string | null;

  // Profile operations
  createProfile: (data: CreateJobseekerProfileRequest) => Promise<JobseekerProfileResponse | undefined>;
  getProfile: () => Promise<JobseekerProfileResponse | undefined>;
  updateProfile: (data: UpdateJobseekerProfileRequest) => Promise<JobseekerProfileResponse | undefined>;
  deleteProfile: () => Promise<void>;
  getProfileCompletion: () => Promise<{ completionPercentage: number } | undefined>;

  // Work Experience operations
  addWorkExperience: (data: AddWorkExperienceRequest) => Promise<WorkExperienceResponse | undefined>;
  updateWorkExperience: (
    experienceId: number,
    data: UpdateWorkExperienceRequest
  ) => Promise<WorkExperienceResponse | undefined>;
  deleteWorkExperience: (experienceId: number) => Promise<void>;

  // Education operations
  addEducation: (data: AddEducationRequest) => Promise<EducationResponse | undefined>;
  updateEducation: (educationId: number, data: UpdateEducationRequest) => Promise<EducationResponse | undefined>;
  deleteEducation: (educationId: number) => Promise<void>;

  // Skills operations
  addSkill: (data: AddSkillRequest) => Promise<JobseekerSkillResponse | undefined>;
  removeSkill: (skillId: number) => Promise<void>;

  // Utilities
  loadAllData: () => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode; autoLoad?: boolean }> = ({
  children,
  autoLoad = true,
}) => {
  const profileHook = useJobseekerProfile();

  // Auto-load profile on mount if explicitly enabled AND user is authenticated
  // By default, autoLoad is false to prevent interference with auth flow
  // Components can manually call loadAllData() after successful login
  useEffect(() => {
    if (autoLoad) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        profileHook.loadAllData().catch(() => {
          // Silently fail if profile doesn't exist (user hasn't created one yet)
          // This is expected behavior for new users
        });
      }
    }
  }, [autoLoad, profileHook]);

  const refreshProfile = React.useCallback(async () => {
    await profileHook.loadAllData();
  }, [profileHook]);

  const value: ProfileContextType = {
    ...profileHook,
    refreshProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
