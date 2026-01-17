import { jobApi } from '../apiClient';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface JobSkillRequirement {
  skillId: number;
  skillName?: string;
  importance: 'REQUIRED' | 'PREFERRED' | 'OPTIONAL';
  minExperienceYears: number;
}

export interface CreateJobRequest {
  jobTitle: string;
  jobDescription: string;
  jobRequirements: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
  experienceLevel: '0-1' | '1-3' | '3-5' | '5-10' | '10+';
  minExperienceYears: number;
  maxExperienceYears: number;
  minSalary: number;
  maxSalary: number;
  jobLocation: string;
  isRemote: boolean;
  industry: string;
  department: string;
  numberOfOpenings: number;
  applicationDeadline: string;
  skills?: JobSkillRequirement[];
}

export interface JobResponse {
  jobId: number;
  jobTitle: string;
  employerId: number;
  companyName: string;
  jobDescription: string;
  jobRequirements: string;
  employmentType: string;
  experienceLevel: string;
  minExperienceYears: number;
  maxExperienceYears: number;
  minSalary: number;
  maxSalary: number;
  jobLocation: string;
  isRemote: boolean;
  industry: string;
  department: string;
  jobStatus: 'ACTIVE' | 'CLOSED' | 'PAUSED' | 'DELETED';
  numberOfOpenings: number;
  applicationsCount: number;
  viewsCount: number;
  applicationDeadline: string;
  postedAt: string;
  skills?: JobSkillRequirement[];
}

export interface JobSearchRequest {
  jobTitle?: string;
  location?: string;
  industry?: string;
  employmentType?: string;
  experienceLevel?: string;
  minSalary?: number;
  maxSalary?: number;
  isRemote?: boolean;
  companyName?: string;
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface JobStatisticsResponse {
  activeJobs: number;
  draftJobs: number;
  closedJobs: number;
  pausedJobs: number;
  totalJobs: number;
  totalViewsLast30Days: number;
  totalApplicationsLast30Days: number;
  avgApplicationsPerJob: number;
}

// ============================================
// JOB MANAGEMENT
// ============================================

export const createJob = async (data: CreateJobRequest): Promise<JobResponse> => {
  const response = await jobApi.post<JobResponse>('/api/v1/jobs', data);
  return response.data;
};

export const getJobById = async (jobId: number): Promise<JobResponse> => {
  const response = await jobApi.get<JobResponse>(`/api/v1/jobs/${jobId}`);
  return response.data;
};

export const getMyJobs = async (page = 0, size = 10): Promise<PaginatedResponse<JobResponse>> => {
  const response = await jobApi.get<PaginatedResponse<JobResponse>>(
    `/api/v1/jobs/my-jobs?page=${page}&size=${size}`
  );
  return response.data;
};

export const updateJob = async (
  jobId: number,
  data: Partial<CreateJobRequest>
): Promise<JobResponse> => {
  const response = await jobApi.put<JobResponse>(`/api/v1/jobs/${jobId}`, data);
  return response.data;
};

export const deleteJob = async (jobId: number): Promise<void> => {
  await jobApi.delete(`/api/v1/jobs/${jobId}`);
};

export const closeJob = async (jobId: number): Promise<JobResponse> => {
  const response = await jobApi.patch<JobResponse>(`/api/v1/jobs/${jobId}/close`);
  return response.data;
};

export const pauseJob = async (jobId: number): Promise<JobResponse> => {
  const response = await jobApi.patch<JobResponse>(`/api/v1/jobs/${jobId}/pause`);
  return response.data;
};

export const reopenJob = async (jobId: number): Promise<JobResponse> => {
  const response = await jobApi.patch<JobResponse>(`/api/v1/jobs/${jobId}/reopen`);
  return response.data;
};

export const searchJobs = async (
  searchParams: JobSearchRequest
): Promise<PaginatedResponse<JobResponse>> => {
  const response = await jobApi.post<PaginatedResponse<JobResponse>>(
    '/api/v1/jobs/search',
    searchParams
  );
  return response.data;
};

export const getJobStatistics = async (): Promise<JobStatisticsResponse> => {
  const response = await jobApi.get<JobStatisticsResponse>('/api/v1/jobs/statistics');
  return response.data;
};

// ============================================
// JOB APPLICATIONS
// ============================================

export interface ApplicationResponse {
  applicationId: number;
  jobId: number;
  jobTitle: string;
  profileId: number;
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  employerId: number;
  companyName: string;
  coverLetter: string;
  applicationStatus: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'REJECTED' | 'HIRED' | 'WITHDRAWN';
  appliedAt: string;
  statusUpdatedAt?: string;
  statusNotes?: string;
  rating?: number;
  trackingHistory?: ApplicationTrackingResponse[];
}

export interface ApplicationTrackingResponse {
  trackingId: number;
  oldStatus: string | null;
  newStatus: string;
  changedAt: string;
  changedBy: number | null;
  notes: string | null;
}

export interface ApplicationStatisticsResponse {
  totalApplications: number;
  appliedCount: number;
  shortlistedCount: number;
  interviewScheduledCount: number;
  rejectedCount: number;
  hiredCount: number;
  withdrawnCount: number;
  statusBreakdown: Record<string, number>;
}

export const applyToJob = async (jobId: number, coverLetter: string): Promise<ApplicationResponse> => {
  const response = await jobApi.post<ApplicationResponse>(`/api/v1/jobs/${jobId}/apply`, {
    coverLetter,
  });
  return response.data;
};

export const hasAppliedToJob = async (jobId: number): Promise<{ hasApplied: boolean }> => {
  const response = await jobApi.get<{ hasApplied: boolean }>(`/api/v1/jobs/${jobId}/has-applied`);
  return response.data;
};

export const getMyApplications = async (
  page = 0,
  size = 10,
  status?: string
): Promise<PaginatedResponse<ApplicationResponse>> => {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (status) params.append('status', status);
  const response = await jobApi.get<PaginatedResponse<ApplicationResponse>>(
    `/api/v1/applications/my-applications?${params.toString()}`
  );
  return response.data;
};

export const getJobApplications = async (
  jobId: number,
  page = 0,
  size = 10,
  status?: string
): Promise<PaginatedResponse<ApplicationResponse>> => {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (status) params.append('status', status);
  const response = await jobApi.get<PaginatedResponse<ApplicationResponse>>(
    `/api/v1/jobs/${jobId}/applications?${params.toString()}`
  );
  return response.data;
};

export const getAllEmployerApplications = async (
  page = 0,
  size = 10
): Promise<PaginatedResponse<ApplicationResponse>> => {
  const response = await jobApi.get<PaginatedResponse<ApplicationResponse>>(
    `/api/v1/applications/employer/all?page=${page}&size=${size}`
  );
  return response.data;
};

export const getApplicationDetails = async (applicationId: number): Promise<ApplicationResponse> => {
  const response = await jobApi.get<ApplicationResponse>(`/api/v1/applications/${applicationId}`);
  return response.data;
};

export const updateApplicationStatus = async (
  applicationId: number,
  status: string,
  notes?: string
): Promise<ApplicationResponse> => {
  const response = await jobApi.patch<ApplicationResponse>(
    `/api/v1/applications/${applicationId}/status`,
    { status, notes }
  );
  return response.data;
};

export const withdrawApplication = async (applicationId: number): Promise<void> => {
  await jobApi.delete(`/api/v1/applications/${applicationId}`);
};

export const rateCandidate = async (
  applicationId: number,
  rating: number,
  notes?: string
): Promise<ApplicationResponse> => {
  const response = await jobApi.post<ApplicationResponse>(
    `/api/v1/applications/${applicationId}/rate`,
    { rating, notes }
  );
  return response.data;
};

export const getJobseekerApplicationStats = async (): Promise<ApplicationStatisticsResponse> => {
  const response = await jobApi.get<ApplicationStatisticsResponse>(
    '/api/v1/applications/statistics/jobseeker'
  );
  return response.data;
};

export const getEmployerApplicationStats = async (): Promise<ApplicationStatisticsResponse> => {
  const response = await jobApi.get<ApplicationStatisticsResponse>(
    '/api/v1/applications/statistics/employer'
  );
  return response.data;
};

// ============================================
// INTERVIEWS
// ============================================

export interface InterviewResponse {
  interviewId: number;
  applicationId: number;
  jobId: number;
  jobTitle: string;
  candidateName: string;
  employerId: number;
  interviewType: 'Phone' | 'Video' | 'In-person' | 'Technical' | 'HR';
  scheduledDatetime: string;
  locationOrLink: string;
  interviewerDetails: string;
  instructions: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  createdAt: string;
  feedback?: string;
  rating?: number;
}

export const scheduleInterview = async (
  applicationId: number,
  data: {
    interviewType: string;
    scheduledDatetime: string;
    locationOrLink: string;
    interviewerDetails: string;
    instructions?: string;
  }
): Promise<InterviewResponse> => {
  const response = await jobApi.post<InterviewResponse>(
    `/api/v1/applications/${applicationId}/interviews`,
    data
  );
  return response.data;
};

export const getInterviewDetails = async (interviewId: number): Promise<InterviewResponse> => {
  const response = await jobApi.get<InterviewResponse>(`/api/v1/interviews/${interviewId}`);
  return response.data;
};

export const getEmployerInterviews = async (
  page = 0,
  size = 10,
  status?: string
): Promise<PaginatedResponse<InterviewResponse>> => {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (status) params.append('status', status);
  const response = await jobApi.get<PaginatedResponse<InterviewResponse>>(
    `/api/v1/interviews/employer/my-interviews?${params.toString()}`
  );
  return response.data;
};

export const getCandidateInterviews = async (
  page = 0,
  size = 10
): Promise<PaginatedResponse<InterviewResponse>> => {
  const response = await jobApi.get<PaginatedResponse<InterviewResponse>>(
    `/api/v1/interviews/candidate/my-interviews?page=${page}&size=${size}`
  );
  return response.data;
};

export const getUpcomingInterviews = async (): Promise<InterviewResponse[]> => {
  const response = await jobApi.get<InterviewResponse[]>('/api/v1/interviews/employer/upcoming');
  return response.data;
};

export const updateInterview = async (
  interviewId: number,
  data: Partial<{
    scheduledDatetime: string;
    locationOrLink: string;
    interviewerDetails: string;
    instructions: string;
  }>
): Promise<InterviewResponse> => {
  const response = await jobApi.put<InterviewResponse>(`/api/v1/interviews/${interviewId}`, data);
  return response.data;
};

export const cancelInterview = async (interviewId: number, reason: string): Promise<InterviewResponse> => {
  const response = await jobApi.patch<InterviewResponse>(
    `/api/v1/interviews/${interviewId}/cancel`,
    { reason }
  );
  return response.data;
};

export const rescheduleInterview = async (
  interviewId: number,
  newDatetime: string,
  reason?: string
): Promise<InterviewResponse> => {
  const response = await jobApi.patch<InterviewResponse>(
    `/api/v1/interviews/${interviewId}/reschedule`,
    { newDatetime, reason }
  );
  return response.data;
};

export const submitInterviewFeedback = async (
  interviewId: number,
  feedback: string,
  rating: number
): Promise<InterviewResponse> => {
  const response = await jobApi.post<InterviewResponse>(
    `/api/v1/interviews/${interviewId}/feedback`,
    { feedback, rating }
  );
  return response.data;
};

// ============================================
// SAVED JOBS
// ============================================

export const saveJob = async (jobId: number): Promise<void> => {
  await jobApi.post(`/api/v1/jobs/${jobId}/save`);
};

export const unsaveJob = async (jobId: number): Promise<void> => {
  await jobApi.delete(`/api/v1/jobs/${jobId}/unsave`);
};

export const getSavedJobs = async (page = 0, size = 10): Promise<PaginatedResponse<JobResponse>> => {
  const response = await jobApi.get<PaginatedResponse<JobResponse>>(
    `/api/v1/jobs/saved?page=${page}&size=${size}`
  );
  return response.data;
};

export const isJobSaved = async (jobId: number): Promise<{ isSaved: boolean }> => {
  const response = await jobApi.get<{ isSaved: boolean }>(`/api/v1/jobs/${jobId}/is-saved`);
  return response.data;
};

export const getSavedJobsCount = async (): Promise<{ count: number }> => {
  const response = await jobApi.get<{ count: number }>('/api/v1/jobs/saved/count');
  return response.data;
};

export const clearAllSavedJobs = async (): Promise<void> => {
  await jobApi.delete('/api/v1/jobs/saved/clear-all');
};

// ============================================
// JOB ALERTS
// ============================================

export interface JobAlertResponse {
  alertId: number;
  profileId: number;
  alertName: string;
  keywords: string;
  location: string;
  industry: string;
  employmentType: string;
  minSalary: number;
  maxSalary: number;
  experienceLevel: string;
  isRemote: boolean;
  frequency: 'DAILY' | 'WEEKLY' | 'INSTANT';
  isActive: boolean;
  createdAt: string;
  lastSent: string | null;
}

export interface CreateJobAlertRequest {
  alertName: string;
  keywords?: string;
  location?: string;
  industry?: string;
  employmentType?: string;
  minSalary?: number;
  maxSalary?: number;
  experienceLevel?: string;
  isRemote?: boolean;
  frequency: 'DAILY' | 'WEEKLY' | 'INSTANT';
}

export const createJobAlert = async (data: CreateJobAlertRequest): Promise<JobAlertResponse> => {
  const response = await jobApi.post<JobAlertResponse>('/api/v1/job-alerts', data);
  return response.data;
};

export const getMyJobAlerts = async (): Promise<JobAlertResponse[]> => {
  const response = await jobApi.get<JobAlertResponse[]>('/api/v1/job-alerts/my-alerts');
  return response.data;
};

export const updateJobAlert = async (
  alertId: number,
  data: Partial<CreateJobAlertRequest>
): Promise<JobAlertResponse> => {
  const response = await jobApi.put<JobAlertResponse>(`/api/v1/job-alerts/${alertId}`, data);
  return response.data;
};

export const deleteJobAlert = async (alertId: number): Promise<void> => {
  await jobApi.delete(`/api/v1/job-alerts/${alertId}`);
};

export const toggleJobAlert = async (alertId: number): Promise<JobAlertResponse> => {
  const response = await jobApi.patch<JobAlertResponse>(`/api/v1/job-alerts/${alertId}/toggle`);
  return response.data;
};

export const getMatchingJobsForAlert = async (
  alertId: number,
  page = 0,
  size = 10
): Promise<PaginatedResponse<JobResponse>> => {
  const response = await jobApi.get<PaginatedResponse<JobResponse>>(
    `/api/v1/job-alerts/${alertId}/matching-jobs?page=${page}&size=${size}`
  );
  return response.data;
};

// ============================================
// SUBSCRIPTIONS
// ============================================

export interface SubscriptionPlanResponse {
  planId: number;
  planName: string;
  description: string;
  price: number;
  durationDays: number;
  jobPostingLimit: number;
  featuredJobSlots: number;
  resumeAccessLimit: number;
  supportLevel: string;
  features: string[];
  isActive: boolean;
}

export interface SubscriptionResponse {
  subscriptionId: number;
  employerId: number;
  planId: number;
  planName: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  jobsPosted: number;
  jobPostingLimit: number;
  autoRenew: boolean;
}

export const getSubscriptionPlans = async (): Promise<SubscriptionPlanResponse[]> => {
  const response = await jobApi.get<SubscriptionPlanResponse[]>('/api/v1/subscription-plans');
  return response.data;
};

export const subscribeToPlan = async (planId: number): Promise<SubscriptionResponse> => {
  const response = await jobApi.post<SubscriptionResponse>('/api/v1/subscriptions/subscribe', {
    planId,
  });
  return response.data;
};

export const getMySubscription = async (): Promise<SubscriptionResponse> => {
  const response = await jobApi.get<SubscriptionResponse>('/api/v1/subscriptions/my-subscription');
  return response.data;
};

export const cancelSubscription = async (subscriptionId: number): Promise<SubscriptionResponse> => {
  const response = await jobApi.patch<SubscriptionResponse>(
    `/api/v1/subscriptions/${subscriptionId}/cancel`
  );
  return response.data;
};

export const checkSubscriptionAccess = async (): Promise<{ hasAccess: boolean; message: string }> => {
  const response = await jobApi.get<{ hasAccess: boolean; message: string }>(
    '/api/v1/subscriptions/check-access'
  );
  return response.data;
};

// ============================================
// MESSAGING
// ============================================

export interface MessageThreadResponse {
  threadId: number;
  jobId: number;
  jobTitle: string;
  candidateId: number;
  candidateName: string;
  employerId: number;
  employerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface MessageResponse {
  messageId: number;
  threadId: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  messageText: string;
  sentAt: string;
  isRead: boolean;
}

export const getMyThreads = async (page = 0, size = 20): Promise<PaginatedResponse<MessageThreadResponse>> => {
  const response = await jobApi.get<PaginatedResponse<MessageThreadResponse>>(
    `/api/v1/messages/my-threads?page=${page}&size=${size}`
  );
  return response.data;
};

export const getThreadMessages = async (
  threadId: number,
  page = 0,
  size = 50
): Promise<PaginatedResponse<MessageResponse>> => {
  const response = await jobApi.get<PaginatedResponse<MessageResponse>>(
    `/api/v1/messages/threads/${threadId}?page=${page}&size=${size}`
  );
  return response.data;
};

export const sendMessage = async (threadId: number, messageText: string): Promise<MessageResponse> => {
  const response = await jobApi.post<MessageResponse>('/api/v1/messages/send', {
    threadId,
    messageText,
  });
  return response.data;
};

export const markMessageAsRead = async (messageId: number): Promise<void> => {
  await jobApi.patch(`/api/v1/messages/${messageId}/read`);
};

export const getUnreadCount = async (): Promise<{ count: number }> => {
  const response = await jobApi.get<{ count: number }>('/api/v1/messages/unread-count');
  return response.data;
};

// ============================================
// NOTIFICATIONS
// ============================================

export interface NotificationResponse {
  notificationId: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  relatedEntityId: number | null;
  isRead: boolean;
  createdAt: string;
}

export const getMyNotifications = async (
  page = 0,
  size = 20
): Promise<PaginatedResponse<NotificationResponse>> => {
  const response = await jobApi.get<PaginatedResponse<NotificationResponse>>(
    `/api/v1/notifications?page=${page}&size=${size}`
  );
  return response.data;
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  await jobApi.patch(`/api/v1/notifications/${notificationId}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await jobApi.patch('/api/v1/notifications/read-all');
};

export const getUnreadNotificationsCount = async (): Promise<{ count: number }> => {
  const response = await jobApi.get<{ count: number }>('/api/v1/notifications/unread-count');
  return response.data;
};

export const deleteNotification = async (notificationId: number): Promise<void> => {
  await jobApi.delete(`/api/v1/notifications/${notificationId}`);
};
