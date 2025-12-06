import { jobServiceClient, handleApiError } from '@/lib/apiClient';
import {
  JobResponse,
  JobSummaryResponse,
  CreateJobRequest,
  UpdateJobRequest,
  JobSearchRequest,
  ApplicationResponse,
  ApplicationSummaryResponse,
  ApplyJobRequest,
  UpdateApplicationStatusRequest,
  RateCandidateRequest,
  SavedJobResponse,
  JobAlertResponse,
  CreateJobAlertRequest,
  UpdateJobAlertRequest,
  JobAlertMatchResponse,
  InterviewResponse,
  InterviewSummaryResponse,
  ScheduleInterviewRequest,
  UpdateInterviewRequest,
  InterviewFeedbackRequest,
  InterviewStatsResponse,
  MessageResponse,
  SendMessageRequest,
  ConversationResponse,
  NotificationResponse,
  NotificationStatsResponse,
  ApplicationStatsResponse,
} from '@/api/types/job';

export const jobService = {
  // Job Management
  createJob: async (data: CreateJobRequest) => {
    try {
      const response = await jobServiceClient.post('/jobs', data);
      return response.data as JobResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getJobById: async (jobId: number) => {
    try {
      const response = await jobServiceClient.get(`/jobs/${jobId}`);
      return response.data as JobResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  updateJob: async (jobId: number, data: UpdateJobRequest) => {
    try {
      const response = await jobServiceClient.put(`/jobs/${jobId}`, data);
      return response.data as JobResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  deleteJob: async (jobId: number) => {
    try {
      const response = await jobServiceClient.delete(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  changeJobStatus: async (jobId: number, status: string) => {
    try {
      const response = await jobServiceClient.patch(`/jobs/${jobId}/status`, null, {
        params: { arg1: status },
      });
      return response.data as JobResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  searchJobs: async (criteria: JobSearchRequest) => {
    try {
      const response = await jobServiceClient.post('/jobs/search', criteria);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getMyJobs: async (page: number = 0, size: number = 10, status?: string) => {
    try {
      const response = await jobServiceClient.get('/jobs/my-jobs', {
        params: { arg0: page, arg1: size, arg2: status },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getJobStatistics: async () => {
    try {
      const response = await jobServiceClient.get('/jobs/statistics');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Job Applications
  applyToJob: async (jobId: number, data: ApplyJobRequest) => {
    try {
      const response = await jobServiceClient.post(`/jobs/${jobId}/apply`, data);
      return response.data as ApplicationResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getApplicationById: async (applicationId: number) => {
    try {
      const response = await jobServiceClient.get(`/applications/${applicationId}`);
      return response.data as ApplicationResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  withdrawApplication: async (applicationId: number) => {
    try {
      const response = await jobServiceClient.delete(`/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  updateApplicationStatus: async (
    applicationId: number,
    data: UpdateApplicationStatusRequest
  ) => {
    try {
      const response = await jobServiceClient.patch(`/applications/${applicationId}/status`, data);
      return response.data as ApplicationResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  rateCandidate: async (applicationId: number, data: RateCandidateRequest) => {
    try {
      const response = await jobServiceClient.post(
        `/applications/${applicationId}/rate`,
        data
      );
      return response.data as ApplicationResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getMyApplications: async (page: number = 0, size: number = 10, status?: string) => {
    try {
      const response = await jobServiceClient.get('/applications/my-applications', {
        params: { arg0: page, arg1: size, arg2: status },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getAllMyApplications: async (page: number = 0, size: number = 10, status?: string) => {
    try {
      const response = await jobServiceClient.get('/applications/employer/all', {
        params: { arg0: page, arg1: size, arg2: status },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getJobApplications: async (jobId: number, page: number = 0, size: number = 10, status?: string) => {
    try {
      const response = await jobServiceClient.get(`/jobs/${jobId}/applications`, {
        params: { arg1: page, arg2: size, arg3: status },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  hasApplied: async (jobId: number) => {
    try {
      const response = await jobServiceClient.get(`/jobs/${jobId}/has-applied`);
      return response.data as boolean;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getApplicationStats: async (type: 'jobseeker' | 'employer') => {
    try {
      const url =
        type === 'jobseeker'
          ? '/applications/statistics/jobseeker'
          : '/applications/statistics/employer';
      const response = await jobServiceClient.get(url);
      return response.data as ApplicationStatsResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Saved Jobs
  saveJob: async (jobId: number) => {
    try {
      const response = await jobServiceClient.post(`/jobs/${jobId}/save`);
      return response.data as SavedJobResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  unsaveJob: async (jobId: number) => {
    try {
      const response = await jobServiceClient.delete(`/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  isJobSaved: async (jobId: number) => {
    try {
      const response = await jobServiceClient.get(`/jobs/${jobId}/is-saved`);
      return response.data as { isSaved: boolean };
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getMySavedJobs: async (page: number = 0, size: number = 10, onlyActive?: boolean) => {
    try {
      const response = await jobServiceClient.get('/jobs/saved', {
        params: { arg0: page, arg1: size, arg2: onlyActive },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getSavedJobsCount: async () => {
    try {
      const response = await jobServiceClient.get('/jobs/saved/count');
      return response.data as { count: number };
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  clearAllSavedJobs: async () => {
    try {
      const response = await jobServiceClient.delete('/jobs/saved/clear-all');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Job Alerts
  createJobAlert: async (data: CreateJobAlertRequest) => {
    try {
      const response = await jobServiceClient.post('/job-alerts', data);
      return response.data as JobAlertResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getJobAlertById: async (alertId: number) => {
    try {
      const response = await jobServiceClient.get(`/job-alerts/${alertId}`);
      return response.data as JobAlertResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  updateJobAlert: async (alertId: number, data: UpdateJobAlertRequest) => {
    try {
      const response = await jobServiceClient.put(`/job-alerts/${alertId}`, data);
      return response.data as JobAlertResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  deleteJobAlert: async (alertId: number) => {
    try {
      const response = await jobServiceClient.delete(`/job-alerts/${alertId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  toggleAlertStatus: async (alertId: number) => {
    try {
      const response = await jobServiceClient.patch(`/job-alerts/${alertId}/toggle`);
      return response.data as JobAlertResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getMyJobAlerts: async (page: number = 0, size: number = 10, onlyActive?: boolean) => {
    try {
      const response = await jobServiceClient.get('/job-alerts', {
        params: { arg0: page, arg1: size, arg2: onlyActive },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getMatchingJobs: async (alertId: number, page: number = 0, size: number = 10) => {
    try {
      const response = await jobServiceClient.get(`/job-alerts/${alertId}/matches`, {
        params: { arg1: page, arg2: size },
      });
      return response.data as JobAlertMatchResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getAlertStatistics: async () => {
    try {
      const response = await jobServiceClient.get('/job-alerts/statistics');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Interviews
  scheduleInterview: async (applicationId: number, data: ScheduleInterviewRequest) => {
    try {
      const response = await jobServiceClient.post(
        `/applications/${applicationId}/interviews`,
        data
      );
      return response.data as InterviewResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getInterviewById: async (interviewId: number) => {
    try {
      const response = await jobServiceClient.get(`/interviews/${interviewId}`);
      return response.data as InterviewResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  updateInterview: async (interviewId: number, data: UpdateInterviewRequest) => {
    try {
      const response = await jobServiceClient.put(`/interviews/${interviewId}`, data);
      return response.data as InterviewResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  cancelInterview: async (interviewId: number) => {
    try {
      const response = await jobServiceClient.delete(`/interviews/${interviewId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  addInterviewFeedback: async (interviewId: number, data: InterviewFeedbackRequest) => {
    try {
      const response = await jobServiceClient.post(`/interviews/${interviewId}/feedback`, data);
      return response.data as InterviewResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getInterviewsForApplication: async (applicationId: number) => {
    try {
      const response = await jobServiceClient.get(
        `/applications/${applicationId}/interviews`
      );
      return response.data as InterviewResponse[];
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getMyInterviewsAsEmployer: async (page: number = 0, size: number = 10, status?: string) => {
    try {
      const response = await jobServiceClient.get('/interviews/employer/my-interviews', {
        params: { arg0: page, arg1: size, arg2: status },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getUpcomingInterviewsAsEmployer: async () => {
    try {
      const response = await jobServiceClient.get('/interviews/employer/upcoming');
      return response.data as InterviewSummaryResponse[];
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getMyInterviewsAsCandidate: async (page: number = 0, size: number = 10, status?: string) => {
    try {
      const response = await jobServiceClient.get('/interviews/candidate/my-interviews', {
        params: { arg0: page, arg1: size, arg2: status },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getUpcomingInterviewsAsCandidate: async () => {
    try {
      const response = await jobServiceClient.get('/interviews/candidate/upcoming');
      return response.data as InterviewSummaryResponse[];
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getInterviewStats: async (type: 'employer' | 'candidate') => {
    try {
      const url =
        type === 'employer'
          ? '/interviews/statistics/employer'
          : '/interviews/statistics/candidate';
      const response = await jobServiceClient.get(url);
      return response.data as InterviewStatsResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Messaging
  sendMessage: async (data: SendMessageRequest) => {
    try {
      const response = await jobServiceClient.post('/messages', data);
      return response.data as MessageResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getConversation: async (otherUserId: number, page: number = 0, size: number = 20) => {
    try {
      const response = await jobServiceClient.get(`/messages/conversation/${otherUserId}`, {
        params: { arg1: page, arg2: size },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getAllConversations: async () => {
    try {
      const response = await jobServiceClient.get('/messages/conversations');
      return response.data as ConversationResponse[];
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  deleteConversation: async (otherUserId: number) => {
    try {
      const response = await jobServiceClient.delete(`/messages/conversation/${otherUserId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  markConversationAsRead: async (otherUserId: number) => {
    try {
      const response = await jobServiceClient.patch(
        `/messages/conversation/${otherUserId}/read`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  searchMessages: async (keyword: string, page: number = 0, size: number = 20) => {
    try {
      const response = await jobServiceClient.get('/messages/search', {
        params: { arg0: keyword, arg1: page, arg2: size },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getUnreadMessageCount: async () => {
    try {
      const response = await jobServiceClient.get('/messages/unread-count');
      return response.data as { count: number };
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getMessageStatistics: async () => {
    try {
      const response = await jobServiceClient.get('/messages/statistics');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Notifications
  getNotifications: async (
    page: number = 0,
    size: number = 20,
    onlyUnread?: boolean,
    type?: string
  ) => {
    try {
      const response = await jobServiceClient.get('/notifications', {
        params: { arg0: page, arg1: size, arg2: onlyUnread, arg3: type },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getNotificationById: async (notificationId: number) => {
    try {
      const response = await jobServiceClient.get(`/notifications/${notificationId}`);
      return response.data as NotificationResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  markNotificationAsRead: async (notificationId: number) => {
    try {
      const response = await jobServiceClient.patch(`/notifications/${notificationId}/read`);
      return response.data as NotificationResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  markAllNotificationsAsRead: async () => {
    try {
      const response = await jobServiceClient.patch('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  deleteNotification: async (notificationId: number) => {
    try {
      const response = await jobServiceClient.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  deleteAllReadNotifications: async () => {
    try {
      const response = await jobServiceClient.delete('/notifications/read');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  cleanupOldNotifications: async () => {
    try {
      const response = await jobServiceClient.delete('/notifications/cleanup');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await jobServiceClient.get('/notifications/unread-count');
      return response.data as { count: number };
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  getNotificationStats: async () => {
    try {
      const response = await jobServiceClient.get('/notifications/statistics');
      return response.data as NotificationStatsResponse;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  // Health Check
  healthCheck: async () => {
    try {
      const response = await jobServiceClient.get('/health');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },

  readinessCheck: async () => {
    try {
      const response = await jobServiceClient.get('/health/ready');
      return response.data;
    } catch (error) {
      throw handleApiError(error as any);
    }
  },
};
