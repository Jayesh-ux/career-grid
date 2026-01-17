import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useJobApi } from "@/hooks/useJobApi";

const JobContext = createContext();

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};

export const JobProvider = ({ children }) => {
  const jobApi = useJobApi();

  // Local state for data
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Search criteria state
  const [searchCriteria, setSearchCriteria] = useState({
    jobTitle: "",
    location: "",
    page: 0,
    size: 20,
  });

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: [],
    salaryRange: [0, 200000],
    experience: "",
    postedDate: "",
    remote: false,
  });

  const [sortBy, setSortBy] = useState("newest");

  // Fetch data when search criteria changes
  useEffect(() => {
    const fetchJobs = async () => {
      setIsSearching(true);
      try {
        const result = await jobApi.searchJobs(searchCriteria);
        setSearchResults(result);
        setJobs(result.content || []);
      } catch (error) {
        console.error("Failed to search jobs:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchJobs();
  }, [
    searchCriteria.jobTitle,
    searchCriteria.location,
    searchCriteria.page,
    searchCriteria.size,
  ]);

  // Fetch saved jobs and applications on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [savedResult, appsResult, interviewsResult] = await Promise.all([
          jobApi.getSavedJobs(0, 20),
          jobApi.getMyApplications(0, 20),
          jobApi.getCandidateInterviews(0, 20),
        ]);

        setSavedJobs(savedResult.content || []);
        setAppliedJobs(appsResult.content || []);
        setInterviews(interviewsResult.content || []);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Combine jobs with applied status
  const jobsWithStatus = useMemo(() => {
    return jobs.map((job) => {
      const application = appliedJobs.find((app) => app.jobId === job.jobId);
      return {
        ...job,
        applied: !!application,
        applicationStatus: application?.applicationStatus || null,
      };
    });
  }, [jobs, appliedJobs]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setSearchCriteria((prev) => ({ ...prev, page: 0 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      location: "",
      jobType: [],
      salaryRange: [0, 200000],
      experience: "",
      postedDate: "",
      remote: false,
    });
    setSearchCriteria((prev) => ({
      ...prev,
      jobTitle: "",
      location: "",
      page: 0,
    }));
  }, []);

  const searchJobs = useCallback((criteria) => {
    setSearchCriteria((prev) => ({
      ...prev,
      ...criteria,
      page: 0,
    }));
  }, []);

  const saveJob = useCallback(
    async (jobId) => {
      try {
        await jobApi.saveJob(jobId);
        // Refetch saved jobs
        const result = await jobApi.getSavedJobs(0, 20);
        setSavedJobs(result.content || []);
        return true;
      } catch (error) {
        console.error("Failed to save job:", error);
        throw error;
      }
    },
    [jobApi]
  );

  const unsaveJob = useCallback(
    async (jobId) => {
      try {
        await jobApi.unsaveJob(jobId);
        // Update local state
        setSavedJobs((prev) => prev.filter((job) => job.jobId !== jobId));
        return true;
      } catch (error) {
        console.error("Failed to unsave job:", error);
        throw error;
      }
    },
    [jobApi]
  );

  const applyToJob = useCallback(
    async (jobId, applicationData = {}) => {
      try {
        await jobApi.applyToJob(jobId, applicationData.coverLetter || "");
        // Refetch applications
        const result = await jobApi.getMyApplications(0, 20);
        setAppliedJobs(result.content || []);
        return true;
      } catch (error) {
        console.error("Failed to apply to job:", error);
        throw error;
      }
    },
    [jobApi]
  );

  const getJobById = useCallback(
    (jobId) => {
      return jobsWithStatus.find((job) => job.jobId === jobId);
    },
    [jobsWithStatus]
  );

  const getCompanyById = useCallback((companyId) => {
    return null;
  }, []);

  const getSavedJobsDetails = useCallback(() => {
    return savedJobs;
  }, [savedJobs]);

  const getAppliedJobsDetails = useCallback(() => {
    return appliedJobs;
  }, [appliedJobs]);

  const goToNextPage = useCallback(() => {
    setSearchCriteria((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  }, []);

  const goToPreviousPage = useCallback(() => {
    setSearchCriteria((prev) => ({
      ...prev,
      page: Math.max(0, prev.page - 1),
    }));
  }, []);

  const goToPage = useCallback((page) => {
    setSearchCriteria((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const scheduleInterview = useCallback(
    async (applicationId, interviewData) => {
      try {
        await jobApi.scheduleInterview(applicationId, interviewData);
        // Refetch interviews
        const result = await jobApi.getCandidateInterviews(0, 20);
        setInterviews(result.content || []);
      } catch (error) {
        console.error("Failed to schedule interview:", error);
        throw error;
      }
    },
    [jobApi]
  );

  const getFilteredJobs = useCallback(() => {
    return jobsWithStatus.filter((job) => {
      if (
        filters.search &&
        !job.jobTitle?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !job.jobDescription
          ?.toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.location &&
        !job.jobLocation?.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.jobType?.length > 0 &&
        !filters.jobType.includes(job.employmentType)
      ) {
        return false;
      }

      if (filters.salaryRange && job.minSalary && job.maxSalary) {
        const [min, max] = filters.salaryRange;
        if (job.maxSalary < min || job.minSalary > max) {
          return false;
        }
      }

      if (filters.experience && job.experienceLevel !== filters.experience) {
        return false;
      }

      if (filters.remote !== undefined && filters.remote !== job.isRemote) {
        return false;
      }

      return true;
    });
  }, [jobsWithStatus, filters]);

  const value = useMemo(
    () => ({
      // Data
      jobs: jobsWithStatus,
      companies: [],
      savedJobs,
      appliedJobs,
      interviews,
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
      loading: jobApi.loading || isSearching,
      isSearching,
      isLoadingSaved: false,
      isLoadingApplications: false,
      isLoadingInterviews: false,
      isSaving: jobApi.loading,
      isUnsaving: jobApi.loading,
      isApplying: jobApi.loading,

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
    }),
    [
      jobsWithStatus,
      savedJobs,
      appliedJobs,
      interviews,
      filters,
      sortBy,
      searchCriteria,
      searchResults,
      isSearching,
      jobApi.loading,
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
    ]
  );

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};
