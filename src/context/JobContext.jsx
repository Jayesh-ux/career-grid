import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
  useSearchJobs,
  useSaveJob,
  useUnsaveJob,
  useApplyToJob,
  useMyApplications,
  useJobById,
  useMySavedJobs,
  useApplicationById,
  useScheduleInterview,
  useMyInterviewsAsCandidate,
} from '@/hooks/useJobApi';

const JobContext = createContext();

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export const JobProvider = ({ children }) => {
  // Search criteria state
  const [searchCriteria, setSearchCriteria] = useState({
    jobTitle: '',
    location: '',
    page: 0,
    size: 20,
  });

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: [],
    salaryRange: [0, 200000],
    experience: '',
    postedDate: '',
    remote: false,
  });

  const [sortBy, setSortBy] = useState('newest');

  // API queries
  const { data: searchResults, isLoading: isSearching } = useSearchJobs(searchCriteria);
  const { data: savedJobsList, isLoading: isLoadingSaved } = useMySavedJobs(searchCriteria.page, searchCriteria.size);
  const { data: myApplications, isLoading: isLoadingApplications } = useMyApplications(searchCriteria.page, searchCriteria.size);
  const { data: myInterviews, isLoading: isLoadingInterviews } = useMyInterviewsAsCandidate(searchCriteria.page, searchCriteria.size);

  // API mutations
  const { mutateAsync: saveJobAsync, isPending: isSaving } = useSaveJob();
  const { mutateAsync: unsaveJobAsync, isPending: isUnsaving } = useUnsaveJob();
  const { mutateAsync: applyAsync, isPending: isApplying } = useApplyToJob();
  const { mutateAsync: scheduleAsync } = useScheduleInterview();

  // Combine search results with applied status
  const jobs = useMemo(() => {
    if (!searchResults?.content) return [];

    return searchResults.content.map(job => {
      const application = myApplications?.content?.find(app => app.jobId === job.jobId);
      return {
        ...job,
        applied: !!application,
        applicationStatus: application?.applicationStatus || null,
      };
    });
  }, [searchResults, myApplications]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset to first page when filters change
    setSearchCriteria(prev => ({ ...prev, page: 0 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      location: '',
      jobType: [],
      salaryRange: [0, 200000],
      experience: '',
      postedDate: '',
      remote: false,
    });
    setSearchCriteria(prev => ({
      ...prev,
      jobTitle: '',
      location: '',
      page: 0,
    }));
  }, []);

  const searchJobs = useCallback((criteria) => {
    setSearchCriteria(prev => ({
      ...prev,
      ...criteria,
      page: 0,
    }));
  }, []);

  const saveJob = useCallback(async (jobId) => {
    try {
      await saveJobAsync(jobId);
      // Refetch saved jobs to update UI
      return true;
    } catch (error) {
      console.error('Failed to save job:', error);
      throw error;
    }
  }, [saveJobAsync]);

  const unsaveJob = useCallback(async (jobId) => {
    try {
      await unsaveJobAsync(jobId);
      // Refetch saved jobs to update UI
      return true;
    } catch (error) {
      console.error('Failed to unsave job:', error);
      throw error;
    }
  }, [unsaveJobAsync]);

  const applyToJob = useCallback(async (jobId, applicationData = {}) => {
    try {
      await applyAsync({
        jobId,
        coverLetter: applicationData.coverLetter || '',
        resume: applicationData.resume || '',
      });
      // Refetch applications to update UI
      return true;
    } catch (error) {
      console.error('Failed to apply to job:', error);
      throw error;
    }
  }, [applyAsync]);

  const getJobById = useCallback((jobId) => {
    return jobs.find(job => job.jobId === jobId);
  }, [jobs]);

  const getCompanyById = useCallback((companyId) => {
    // Companies are managed through ProfileContext or fetched separately
    return null;
  }, []);

  const getSavedJobsDetails = useCallback(() => {
    return savedJobsList?.content || [];
  }, [savedJobsList]);

  const getAppliedJobsDetails = useCallback(() => {
    return myApplications?.content || [];
  }, [myApplications]);

  const goToNextPage = useCallback(() => {
    setSearchCriteria(prev => ({
      ...prev,
      page: prev.page + 1,
    }));
  }, []);

  const goToPreviousPage = useCallback(() => {
    setSearchCriteria(prev => ({
      ...prev,
      page: Math.max(0, prev.page - 1),
    }));
  }, []);

  const goToPage = useCallback((page) => {
    setSearchCriteria(prev => ({
      ...prev,
      page,
    }));
  }, []);

  const scheduleInterview = useCallback(async (applicationId, interviewData) => {
    try {
      await scheduleAsync({
        applicationId,
        ...interviewData,
      });
    } catch (error) {
      console.error('Failed to schedule interview:', error);
      throw error;
    }
  }, [scheduleAsync]);

  const getFilteredJobs = useCallback(() => {
    if (!searchResults?.content) return [];
    
    return searchResults.content.filter(job => {
      // Apply local filters
      if (filters.search && !job.title?.toLowerCase().includes(filters.search.toLowerCase()) && 
          !job.description?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      if (filters.location && !job.location?.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      if (filters.jobType?.length > 0 && !filters.jobType.includes(job.type)) {
        return false;
      }
      
      if (filters.salaryRange && job.salary) {
        const [min, max] = filters.salaryRange;
        if (job.salary < min || job.salary > max) {
          return false;
        }
      }
      
      if (filters.experience && job.experience !== filters.experience) {
        return false;
      }
      
      if (filters.remote !== undefined && filters.remote !== job.remote) {
        return false;
      }
      
      return true;
    });
  }, [searchResults, filters]);

  const value = useMemo(() => ({
    // Data
    jobs,
    companies: [],
    savedJobs: savedJobsList?.content || [],
    appliedJobs: myApplications?.content || [],
    interviews: myInterviews?.content || [],
    filters,
    sortBy,

    // Pagination
    currentPage: searchCriteria.page,
    pageSize: searchCriteria.size,
    totalJobs: searchResults?.totalElements || 0,
    totalPages: searchResults?.totalPages || 0,
    hasNextPage: searchResults && !searchResults.last,
    hasPreviousPage: searchResults?.number > 0,

    // Loading states
    loading: isSearching || isSaving || isUnsaving || isApplying,
    isSearching,
    isLoadingSaved,
    isLoadingApplications,
    isLoadingInterviews,
    isSaving,
    isUnsaving,
    isApplying,

    // Methods
    updateFilters,
    clearFilters,
    searchJobs,
    setSortBy,
    saveJob,
    unsaveJob,
    applyToJob,
    getFilteredJobs,
    getJobById,
    getCompanyById,
    getSavedJobsDetails,
    getAppliedJobsDetails,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    scheduleInterview,
  }), [
    jobs,
    savedJobsList,
    myApplications,
    myInterviews,
    filters,
    sortBy,
    searchCriteria,
    searchResults,
    isSearching,
    isLoadingSaved,
    isLoadingApplications,
    isLoadingInterviews,
    isSaving,
    isUnsaving,
    isApplying,
    updateFilters,
    clearFilters,
    searchJobs,
    saveJob,
    unsaveJob,
    applyToJob,
    getFilteredJobs,
    getJobById,
    getCompanyById,
    getSavedJobsDetails,
    getAppliedJobsDetails,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    scheduleInterview,
  ]);

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};
