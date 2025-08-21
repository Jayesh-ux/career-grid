import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockJobs, mockCompanies, jobCategories } from '../data/mockData';

const JobContext = createContext();

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState(mockJobs);
  const [companies, setCompanies] = useState(mockCompanies);
  const [categories, setCategories] = useState(jobCategories);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    category: '',
    jobType: [],
    experience: '',
    salaryRange: [0, 200000],
    postedDate: '',
    remote: false
  });
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(false);

  // Load saved data from localStorage
  useEffect(() => {
    const savedJobIds = localStorage.getItem('jobhook_saved_jobs');
    const appliedJobIds = localStorage.getItem('jobhook_applied_jobs');
    
    if (savedJobIds) {
      setSavedJobs(JSON.parse(savedJobIds));
    }
    
    if (appliedJobIds) {
      setAppliedJobs(JSON.parse(appliedJobIds));
    }
  }, []);

  // Filter and sort jobs based on current filters
  const getFilteredJobs = () => {
    let filteredJobs = [...jobs];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
      );
    }

    // Location filter
    if (filters.location) {
      filteredJobs = filteredJobs.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase()) ||
        (filters.location.toLowerCase() === 'remote' && job.remote)
      );
    }

    // Category filter
    if (filters.category) {
      filteredJobs = filteredJobs.filter(job =>
        job.category === filters.category
      );
    }

    // Job type filter
    if (filters.jobType.length > 0) {
      filteredJobs = filteredJobs.filter(job =>
        filters.jobType.includes(job.type)
      );
    }

    // Experience filter
    if (filters.experience) {
      filteredJobs = filteredJobs.filter(job =>
        job.experience === filters.experience
      );
    }

    // Salary range filter
    filteredJobs = filteredJobs.filter(job =>
      job.salary.min >= filters.salaryRange[0] &&
      job.salary.max <= filters.salaryRange[1]
    );

    // Posted date filter
    if (filters.postedDate) {
      const now = new Date();
      const jobDate = new Date(job.postedDate);
      const daysDiff = (now - jobDate) / (1000 * 60 * 60 * 24);

      filteredJobs = filteredJobs.filter(job => {
        const jobPostedDate = new Date(job.postedDate);
        const daysSincePosted = (now - jobPostedDate) / (1000 * 60 * 60 * 24);

        switch (filters.postedDate) {
          case '24hours':
            return daysSincePosted <= 1;
          case 'week':
            return daysSincePosted <= 7;
          case 'month':
            return daysSincePosted <= 30;
          default:
            return true;
        }
      });
    }

    // Remote filter
    if (filters.remote) {
      filteredJobs = filteredJobs.filter(job => job.remote);
    }

    // Sort jobs
    switch (sortBy) {
      case 'newest':
        filteredJobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        break;
      case 'salary-high':
        filteredJobs.sort((a, b) => b.salary.max - a.salary.max);
        break;
      case 'salary-low':
        filteredJobs.sort((a, b) => a.salary.min - b.salary.min);
        break;
      case 'relevance':
        // For now, keep original order for relevance
        break;
      default:
        break;
    }

    return filteredJobs;
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      category: '',
      jobType: [],
      experience: '',
      salaryRange: [0, 200000],
      postedDate: '',
      remote: false
    });
  };

  const saveJob = (jobId) => {
    const newSavedJobs = [...savedJobs];
    const index = newSavedJobs.indexOf(jobId);
    
    if (index > -1) {
      newSavedJobs.splice(index, 1);
    } else {
      newSavedJobs.push(jobId);
    }
    
    setSavedJobs(newSavedJobs);
    localStorage.setItem('jobhook_saved_jobs', JSON.stringify(newSavedJobs));
  };

  const applyToJob = (jobId, applicationData) => {
    const application = {
      jobId,
      appliedDate: new Date().toISOString(),
      status: 'pending',
      ...applicationData
    };
    
    const newAppliedJobs = [...appliedJobs, application];
    setAppliedJobs(newAppliedJobs);
    localStorage.setItem('jobhook_applied_jobs', JSON.stringify(newAppliedJobs));
    
    return application;
  };

  const getJobById = (id) => {
    return jobs.find(job => job.id === parseInt(id));
  };

  const getCompanyById = (id) => {
    return companies.find(company => company.id === parseInt(id));
  };

  const getSavedJobsDetails = () => {
    return jobs.filter(job => savedJobs.includes(job.id));
  };

  const getAppliedJobsDetails = () => {
    return appliedJobs.map(application => ({
      ...application,
      job: jobs.find(job => job.id === application.jobId)
    }));
  };

  const searchJobs = async (searchTerm) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setLoading(false);
    return results;
  };

  const value = {
    jobs,
    companies,
    categories,
    savedJobs,
    appliedJobs,
    filters,
    sortBy,
    loading,
    getFilteredJobs,
    updateFilters,
    clearFilters,
    setSortBy,
    saveJob,
    applyToJob,
    getJobById,
    getCompanyById,
    getSavedJobsDetails,
    getAppliedJobsDetails,
    searchJobs
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};
