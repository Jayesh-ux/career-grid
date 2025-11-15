import { useState, useCallback } from 'react';
import {
  JobseekerProfileApi,
  WorkExperienceApi,
  EducationApi,
  SkillsApi,
  ProfileApiError,
  CreateJobseekerProfileRequest,
  UpdateJobseekerProfileRequest,
  JobseekerProfileResponse,
  AddWorkExperienceRequest,
  UpdateWorkExperienceRequest,
  WorkExperienceResponse,
  AddEducationRequest,
  UpdateEducationRequest,
  EducationResponse,
  AddSkillRequest,
  JobseekerSkillResponse,
} from '@/lib/profileApi';

interface UseJobseekerProfileState {
  profile: JobseekerProfileResponse | null;
  workExperience: WorkExperienceResponse[];
  education: EducationResponse[];
  skills: JobseekerSkillResponse[];
  loading: boolean;
  error: string | null;
}

export const useJobseekerProfile = () => {
  const [state, setState] = useState<UseJobseekerProfileState>({
    profile: null,
    workExperience: [],
    education: [],
    skills: [],
    loading: false,
    error: null,
  });

  const handleError = useCallback((error: unknown) => {
    const message = error instanceof ProfileApiError ? error.message : 'An error occurred';
    setState(prev => ({ ...prev, error: message }));
    throw error;
  }, []);

  // Profile operations
  const createProfile = useCallback(async (data: CreateJobseekerProfileRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const profile = await JobseekerProfileApi.create(data);
      setState(prev => ({ ...prev, profile, loading: false }));
      return profile;
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  const getProfile = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const profile = await JobseekerProfileApi.getMe();
      setState(prev => ({ ...prev, profile, loading: false }));
      return profile;
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  const updateProfile = useCallback(async (data: UpdateJobseekerProfileRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const profile = await JobseekerProfileApi.updateMe(data);
      setState(prev => ({ ...prev, profile, loading: false }));
      return profile;
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  const deleteProfile = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await JobseekerProfileApi.deleteMe();
      setState(prev => ({ ...prev, profile: null, loading: false }));
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  const getProfileCompletion = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await JobseekerProfileApi.getCompletion();
      setState(prev => ({ ...prev, loading: false }));
      return result;
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  // Work Experience operations
  const addWorkExperience = useCallback(async (data: AddWorkExperienceRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const experience = await WorkExperienceApi.add(data);
      setState(prev => ({
        ...prev,
        workExperience: [...prev.workExperience, experience],
        loading: false,
      }));
      return experience;
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  const updateWorkExperience = useCallback(
    async (experienceId: number, data: UpdateWorkExperienceRequest) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const experience = await WorkExperienceApi.update(experienceId, data);
        setState(prev => ({
          ...prev,
          workExperience: prev.workExperience.map(e => (e.experienceId === experienceId ? experience : e)),
          loading: false,
        }));
        return experience;
      } catch (error) {
        handleError(error);
      }
    },
    [handleError]
  );

  const deleteWorkExperience = useCallback(async (experienceId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await WorkExperienceApi.delete(experienceId);
      setState(prev => ({
        ...prev,
        workExperience: prev.workExperience.filter(e => e.experienceId !== experienceId),
        loading: false,
      }));
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  // Education operations
  const addEducation = useCallback(async (data: AddEducationRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const education = await EducationApi.add(data);
      setState(prev => ({
        ...prev,
        education: [...prev.education, education],
        loading: false,
      }));
      return education;
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  const updateEducation = useCallback(
    async (educationId: number, data: UpdateEducationRequest) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const education = await EducationApi.update(educationId, data);
        setState(prev => ({
          ...prev,
          education: prev.education.map(e => (e.educationId === educationId ? education : e)),
          loading: false,
        }));
        return education;
      } catch (error) {
        handleError(error);
      }
    },
    [handleError]
  );

  const deleteEducation = useCallback(async (educationId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await EducationApi.delete(educationId);
      setState(prev => ({
        ...prev,
        education: prev.education.filter(e => e.educationId !== educationId),
        loading: false,
      }));
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  // Skills operations
  const addSkill = useCallback(async (data: AddSkillRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const skill = await SkillsApi.addSkill(data);
      setState(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
        loading: false,
      }));
      return skill;
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  const removeSkill = useCallback(async (skillId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await SkillsApi.removeSkill(skillId);
      setState(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s.skillId !== skillId),
        loading: false,
      }));
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  const loadAllData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [profile, workExp, edu, skills] = await Promise.all([
        JobseekerProfileApi.getMe(),
        WorkExperienceApi.getAll(),
        EducationApi.getAll(),
        SkillsApi.getMySkills(),
      ]);

      setState(prev => ({
        ...prev,
        profile,
        workExperience: workExp._embedded?.workExperiences || [],
        education: edu._embedded?.educations || [],
        skills: skills._embedded?.jobseekerSkills || [],
        loading: false,
      }));
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  return {
    ...state,
    // Profile
    createProfile,
    getProfile,
    updateProfile,
    deleteProfile,
    getProfileCompletion,
    // Work Experience
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    // Education
    addEducation,
    updateEducation,
    deleteEducation,
    // Skills
    addSkill,
    removeSkill,
    // Utilities
    loadAllData,
    clearError: () => setState(prev => ({ ...prev, error: null })),
  };
};
