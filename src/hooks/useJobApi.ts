import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { jobService } from '@/lib/services/jobService';
import {
  CreateJobRequest,
  UpdateJobRequest,
  JobSearchRequest,
  ApplyJobRequest,
  UpdateApplicationStatusRequest,
  RateCandidateRequest,
  CreateJobAlertRequest,
  UpdateJobAlertRequest,
  ScheduleInterviewRequest,
  UpdateInterviewRequest,
  InterviewFeedbackRequest,
  SendMessageRequest,
} from '@/api/types/job';

// Job Management Hooks
export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobRequest) => jobService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
    },
  });
};

export const useJobById = (jobId: number) => {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobService.getJobById(jobId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateJobRequest }) =>
      jobService.updateJob(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: number) => jobService.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
    },
  });
};

export const useSearchJobs = (criteria: JobSearchRequest) => {
  return useQuery({
    queryKey: ['jobsSearch', criteria],
    queryFn: () => jobService.searchJobs(criteria),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMyJobs = (page: number = 0, size: number = 10, status?: string) => {
  return useQuery({
    queryKey: ['myJobs', page, size, status],
    queryFn: () => jobService.getMyJobs(page, size, status),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useJobStatistics = () => {
  return useQuery({
    queryKey: ['jobStatistics'],
    queryFn: () => jobService.getJobStatistics(),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

// Job Applications Hooks
export const useApplyToJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: number; data: ApplyJobRequest }) =>
      jobService.applyToJob(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      queryClient.invalidateQueries({ queryKey: ['jobApplicationStats'] });
    },
  });
};

export const useApplicationById = (applicationId: number) => {
  return useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => jobService.getApplicationById(applicationId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) => jobService.withdrawApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateApplicationStatusRequest }) =>
      jobService.updateApplicationStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      queryClient.invalidateQueries({ queryKey: ['allApplications'] });
    },
  });
};

export const useRateCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RateCandidateRequest }) =>
      jobService.rateCandidate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allApplications'] });
    },
  });
};

export const useMyApplications = (page: number = 0, size: number = 10, status?: string) => {
  return useQuery({
    queryKey: ['myApplications', page, size, status],
    queryFn: () => jobService.getMyApplications(page, size, status),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useAllApplications = (page: number = 0, size: number = 10, status?: string) => {
  return useQuery({
    queryKey: ['allApplications', page, size, status],
    queryFn: () => jobService.getAllMyApplications(page, size, status),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useJobApplications = (jobId: number, page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ['jobApplications', jobId, page, size],
    queryFn: () => jobService.getJobApplications(jobId, page, size),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useHasApplied = (jobId: number) => {
  return useQuery({
    queryKey: ['hasApplied', jobId],
    queryFn: () => jobService.hasApplied(jobId),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useApplicationStats = (type: 'jobseeker' | 'employer') => {
  return useQuery({
    queryKey: ['applicationStats', type],
    queryFn: () => jobService.getApplicationStats(type),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

// Saved Jobs Hooks
export const useSaveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: number) => jobService.saveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
    },
  });
};

export const useUnsaveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: number) => jobService.unsaveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
    },
  });
};

export const useIsJobSaved = (jobId: number) => {
  return useQuery({
    queryKey: ['isJobSaved', jobId],
    queryFn: () => jobService.isJobSaved(jobId),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useMySavedJobs = (page: number = 0, size: number = 10, onlyActive?: boolean) => {
  return useQuery({
    queryKey: ['savedJobs', page, size, onlyActive],
    queryFn: () => jobService.getMySavedJobs(page, size, onlyActive),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useSavedJobsCount = () => {
  return useQuery({
    queryKey: ['savedJobsCount'],
    queryFn: () => jobService.getSavedJobsCount(),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

// Job Alerts Hooks
export const useCreateJobAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobAlertRequest) => jobService.createJobAlert(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myJobAlerts'] });
    },
  });
};

export const useJobAlertById = (alertId: number) => {
  return useQuery({
    queryKey: ['jobAlert', alertId],
    queryFn: () => jobService.getJobAlertById(alertId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateJobAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateJobAlertRequest }) =>
      jobService.updateJobAlert(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['jobAlert', id] });
      queryClient.invalidateQueries({ queryKey: ['myJobAlerts'] });
    },
  });
};

export const useDeleteJobAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alertId: number) => jobService.deleteJobAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myJobAlerts'] });
    },
  });
};

export const useToggleAlertStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alertId: number) => jobService.toggleAlertStatus(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myJobAlerts'] });
    },
  });
};

export const useMyJobAlerts = (page: number = 0, size: number = 10, onlyActive?: boolean) => {
  return useQuery({
    queryKey: ['myJobAlerts', page, size, onlyActive],
    queryFn: () => jobService.getMyJobAlerts(page, size, onlyActive),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useMatchingJobs = (alertId: number, page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ['matchingJobs', alertId, page, size],
    queryFn: () => jobService.getMatchingJobs(alertId, page, size),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

// Interviews Hooks
export const useScheduleInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, data }: { appId: number; data: ScheduleInterviewRequest }) =>
      jobService.scheduleInterview(appId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });
};

export const useInterviewById = (interviewId: number) => {
  return useQuery({
    queryKey: ['interview', interviewId],
    queryFn: () => jobService.getInterviewById(interviewId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInterviewRequest }) =>
      jobService.updateInterview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });
};

export const useCancelInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (interviewId: number) => jobService.cancelInterview(interviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });
};

export const useAddInterviewFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: InterviewFeedbackRequest }) =>
      jobService.addInterviewFeedback(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });
};

export const useMyInterviewsAsEmployer = (page: number = 0, size: number = 10, status?: string) => {
  return useQuery({
    queryKey: ['myInterviews', 'employer', page, size, status],
    queryFn: () => jobService.getMyInterviewsAsEmployer(page, size, status),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useUpcomingInterviewsAsEmployer = () => {
  return useQuery({
    queryKey: ['upcomingInterviews', 'employer'],
    queryFn: () => jobService.getUpcomingInterviewsAsEmployer(),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useMyInterviewsAsCandidate = (page: number = 0, size: number = 10, status?: string) => {
  return useQuery({
    queryKey: ['myInterviews', 'candidate', page, size, status],
    queryFn: () => jobService.getMyInterviewsAsCandidate(page, size, status),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useUpcomingInterviewsAsCandidate = () => {
  return useQuery({
    queryKey: ['upcomingInterviews', 'candidate'],
    queryFn: () => jobService.getUpcomingInterviewsAsCandidate(),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

// Messaging Hooks
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendMessageRequest) => jobService.sendMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
    },
  });
};

export const useConversation = (otherUserId: number, page: number = 0) => {
  return useQuery({
    queryKey: ['conversation', otherUserId, page],
    queryFn: () => jobService.getConversation(otherUserId, page),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useAllConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => jobService.getAllConversations(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useUnreadMessageCount = () => {
  return useQuery({
    queryKey: ['unreadMessages'],
    queryFn: () => jobService.getUnreadMessageCount(),
    retry: 1,
    staleTime: 1 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

// Notifications Hooks
export const useNotifications = (page: number = 0, size: number = 20, onlyUnread?: boolean) => {
  return useQuery({
    queryKey: ['notifications', page, size, onlyUnread],
    queryFn: () => jobService.getNotifications(page, size, onlyUnread),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) => jobService.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => jobService.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => jobService.getUnreadCount(),
    retry: 1,
    staleTime: 1 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useNotificationStats = () => {
  return useQuery({
    queryKey: ['notificationStats'],
    queryFn: () => jobService.getNotificationStats(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};
