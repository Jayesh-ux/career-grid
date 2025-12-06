// Job Service Types - Generated from OpenAPI spec
export interface JobResponse {
  jobId: number;
  employerId: number;
  employerName: string;
  companyName: string;
  jobTitle: string;
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
  numberOfOpenings: number;
  applicationDeadline: string;
  jobStatus: 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'DRAFT';
  postedAt: string;
  updatedAt: string;
  viewsCount: number;
  applicationsCount: number;
  skills: JobSkillResponse[];
}

export interface JobSkillResponse {
  id: number;
  skillId: number;
  skillName: string;
  importance: string;
  minExperienceYears: number;
}

export interface JobSummaryResponse {
  jobId: number;
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  isRemote: boolean;
  employmentType: string;
  experienceLevel: string;
  minSalary: number;
  maxSalary: number;
  applicationDeadline: string;
  jobStatus: string;
  postedAt: string;
  viewsCount: number;
  applicationsCount: number;
  skillsCount: number;
}

export interface CreateJobRequest {
  jobTitle: string;
  jobDescription: string;
  jobRequirements?: string;
  employmentType: string;
  experienceLevel?: string;
  minExperienceYears?: number;
  maxExperienceYears?: number;
  minSalary?: number;
  maxSalary?: number;
  jobLocation: string;
  isRemote?: boolean;
  industry?: string;
  department?: string;
  numberOfOpenings?: number;
  applicationDeadline?: string;
  skills?: JobSkillRequest[];
}

export interface JobSkillRequest {
  skillId: number;
  importance: string;
  minExperienceYears?: number;
}

export interface UpdateJobRequest {
  jobTitle?: string;
  jobDescription?: string;
  jobRequirements?: string;
  employmentType?: string;
  experienceLevel?: string;
  minExperienceYears?: number;
  maxExperienceYears?: number;
  minSalary?: number;
  maxSalary?: number;
  jobLocation?: string;
  isRemote?: boolean;
  industry?: string;
  department?: string;
  numberOfOpenings?: number;
  applicationDeadline?: string;
  jobStatus?: string;
  skills?: JobSkillRequest[];
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
  skillId?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

// Job Applications
export interface ApplicationResponse {
  applicationId: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  profileId: number;
  candidateName: string;
  candidateEmail: string;
  coverLetter: string;
  resumePath?: string;
  applicationStatus: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'REJECTED' | 'HIRED' | 'WITHDRAWN';
  appliedAt: string;
  statusUpdatedAt: string;
  employerNotes?: string;
  ratingByEmployer?: number;
  trackingHistory: ApplicationTrackingResponse[];
}

export interface ApplicationTrackingResponse {
  trackingId: number;
  status: string;
  notes: string;
  statusDate: string;
  updatedBy: number;
  updatedByName: string;
}

export interface ApplicationSummaryResponse {
  applicationId: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  profileId: number;
  candidateName: string;
  applicationStatus: string;
  appliedAt: string;
  ratingByEmployer?: number;
}

export interface ApplyJobRequest {
  coverLetter?: string;
  resumePath?: string;
}

export interface UpdateApplicationStatusRequest {
  status: string;
  notes?: string;
}

export interface RateCandidateRequest {
  rating: number;
  notes?: string;
}

// Saved Jobs
export interface SavedJobResponse {
  savedJobId: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  isRemote: boolean;
  employmentType: string;
  experienceLevel: string;
  minSalary: number;
  maxSalary: number;
  applicationDeadline: string;
  jobStatus: string;
  postedAt: string;
  savedAt: string;
  applicationsCount: number;
  hasApplied: boolean;
}

// Job Alerts
export interface JobAlertResponse {
  alertId: number;
  alertName: string;
  keywords: string;
  location: string;
  industry: string;
  minSalary: number;
  maxSalary: number;
  experienceLevel: string;
  frequency: string;
  isActive: boolean;
  createdAt: string;
  lastSentAt?: string;
  matchCount: number;
}

export interface CreateJobAlertRequest {
  alertName: string;
  keywords?: string;
  location?: string;
  industry?: string;
  minSalary?: number;
  maxSalary?: number;
  experienceLevel?: string;
  frequency: string;
}

export interface UpdateJobAlertRequest {
  alertName?: string;
  keywords?: string;
  location?: string;
  industry?: string;
  minSalary?: number;
  maxSalary?: number;
  experienceLevel?: string;
  frequency?: string;
  isActive?: boolean;
}

export interface JobAlertMatchResponse {
  alertId: number;
  alertName: string;
  matchCount: number;
  matchingJobs: JobSummaryResponse[];
}

// Interviews
export interface InterviewResponse {
  interviewId: number;
  applicationId: number;
  jobId: number;
  jobTitle: string;
  profileId: number;
  candidateName: string;
  interviewType: string;
  scheduledDatetime: string;
  locationOrLink: string;
  interviewerDetails: string;
  instructions: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  feedback?: string;
  rating?: number;
  createdAt: string;
}

export interface InterviewSummaryResponse {
  interviewId: number;
  applicationId: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  candidateName: string;
  interviewType: string;
  scheduledDatetime: string;
  status: string;
  createdAt: string;
}

export interface ScheduleInterviewRequest {
  interviewType: string;
  scheduledDatetime: string;
  locationOrLink?: string;
  interviewerDetails?: string;
  instructions?: string;
}

export interface UpdateInterviewRequest {
  interviewType?: string;
  scheduledDatetime?: string;
  locationOrLink?: string;
  interviewerDetails?: string;
  instructions?: string;
  status?: string;
}

export interface InterviewFeedbackRequest {
  feedback: string;
  rating: number;
}

export interface InterviewStatsResponse {
  totalInterviews: number;
  scheduledCount: number;
  completedCount: number;
  cancelledCount: number;
  rescheduledCount: number;
  statusBreakdown: Record<string, number>;
}

// Messaging
export interface MessageResponse {
  messageId: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  content: string;
  applicationId?: number;
  jobTitle?: string;
  isRead: boolean;
  sentAt: string;
  readAt?: string;
}

export interface SendMessageRequest {
  receiverId: number;
  content: string;
  applicationId?: number;
}

export interface ConversationResponse {
  otherUserId: number;
  otherUserName: string;
  otherUserType: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

// Notifications
export interface NotificationResponse {
  notificationId: number;
  title: string;
  content: string;
  type: 'JOB_ALERT' | 'APPLICATION_STATUS' | 'MESSAGE' | 'INTERVIEW' | 'SYSTEM';
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationStatsResponse {
  totalNotifications: number;
  unreadCount: number;
  readCount: number;
  typeBreakdown: Record<string, number>;
}

// Statistics
export interface ApplicationStatsResponse {
  totalApplications: number;
  appliedCount: number;
  shortlistedCount: number;
  interviewScheduledCount: number;
  rejectedCount: number;
  hiredCount: number;
  statusBreakdown: Record<string, number>;
}
