import { useState } from 'react';
import {
  // Job Management
  createJob,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  closeJob,
  pauseJob,
  reopenJob,
  searchJobs,
  getJobStatistics,

  // Applications
  applyToJob,
  hasAppliedToJob,
  getMyApplications,
  getJobApplications,
  getAllEmployerApplications,
  getApplicationDetails,
  updateApplicationStatus,
  withdrawApplication,
  rateCandidate,
  getJobseekerApplicationStats,
  getEmployerApplicationStats,

  // Interviews
  scheduleInterview,
  getInterviewDetails,
  getEmployerInterviews,
  getCandidateInterviews,
  getUpcomingInterviews,
  updateInterview,
  cancelInterview,
  rescheduleInterview,
  submitInterviewFeedback,

  // Saved Jobs
  saveJob,
  unsaveJob,
  getSavedJobs,
  isJobSaved,
  getSavedJobsCount,
  clearAllSavedJobs,

  // Job Alerts
  createJobAlert,
  getMyJobAlerts,
  updateJobAlert,
  deleteJobAlert,
  toggleJobAlert,
  getMatchingJobsForAlert,

  // Subscriptions
  getSubscriptionPlans,
  subscribeToPlan,
  getMySubscription,
  cancelSubscription,
  checkSubscriptionAccess,

  // Messaging
  getMyThreads,
  getThreadMessages,
  sendMessage,
  markMessageAsRead,
  getUnreadCount,

  // Notifications
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount,
  deleteNotification,

  // Types
  type CreateJobRequest,
  type JobSearchRequest,
  type CreateJobAlertRequest,
} from '@/lib/services/jobService';

export const useJobApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async <T,>(apiCall: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,

    // Job Management
    createJob: (data: CreateJobRequest) => handleApiCall(() => createJob(data)),
    getJobById: (jobId: number) => handleApiCall(() => getJobById(jobId)),
    getMyJobs: (page = 0, size = 10) => handleApiCall(() => getMyJobs(page, size)),
    updateJob: (jobId: number, data: Partial<CreateJobRequest>) =>
      handleApiCall(() => updateJob(jobId, data)),
    deleteJob: (jobId: number) => handleApiCall(() => deleteJob(jobId)),
    closeJob: (jobId: number) => handleApiCall(() => closeJob(jobId)),
    pauseJob: (jobId: number) => handleApiCall(() => pauseJob(jobId)),
    reopenJob: (jobId: number) => handleApiCall(() => reopenJob(jobId)),
    searchJobs: (searchParams: JobSearchRequest) =>
      handleApiCall(() => searchJobs(searchParams)),
    getJobStatistics: () => handleApiCall(() => getJobStatistics()),

    // Applications
    applyToJob: (jobId: number, coverLetter: string) =>
      handleApiCall(() => applyToJob(jobId, coverLetter)),
    hasAppliedToJob: (jobId: number) => handleApiCall(() => hasAppliedToJob(jobId)),
    getMyApplications: (page = 0, size = 10, status?: string) =>
      handleApiCall(() => getMyApplications(page, size, status)),
    getJobApplications: (jobId: number, page = 0, size = 10, status?: string) =>
      handleApiCall(() => getJobApplications(jobId, page, size, status)),
    getAllEmployerApplications: (page = 0, size = 10) =>
      handleApiCall(() => getAllEmployerApplications(page, size)),
    getApplicationDetails: (applicationId: number) =>
      handleApiCall(() => getApplicationDetails(applicationId)),
    updateApplicationStatus: (applicationId: number, status: string, notes?: string) =>
      handleApiCall(() => updateApplicationStatus(applicationId, status, notes)),
    withdrawApplication: (applicationId: number) =>
      handleApiCall(() => withdrawApplication(applicationId)),
    rateCandidate: (applicationId: number, rating: number, notes?: string) =>
      handleApiCall(() => rateCandidate(applicationId, rating, notes)),
    getJobseekerApplicationStats: () =>
      handleApiCall(() => getJobseekerApplicationStats()),
    getEmployerApplicationStats: () =>
      handleApiCall(() => getEmployerApplicationStats()),

    // Interviews
    scheduleInterview: (applicationId: number, data: any) =>
      handleApiCall(() => scheduleInterview(applicationId, data)),
    getInterviewDetails: (interviewId: number) =>
      handleApiCall(() => getInterviewDetails(interviewId)),
    getEmployerInterviews: (page = 0, size = 10, status?: string) =>
      handleApiCall(() => getEmployerInterviews(page, size, status)),
    getCandidateInterviews: (page = 0, size = 10) =>
      handleApiCall(() => getCandidateInterviews(page, size)),
    getUpcomingInterviews: () => handleApiCall(() => getUpcomingInterviews()),
    updateInterview: (interviewId: number, data: any) =>
      handleApiCall(() => updateInterview(interviewId, data)),
    cancelInterview: (interviewId: number, reason: string) =>
      handleApiCall(() => cancelInterview(interviewId, reason)),
    rescheduleInterview: (interviewId: number, newDatetime: string, reason?: string) =>
      handleApiCall(() => rescheduleInterview(interviewId, newDatetime, reason)),
    submitInterviewFeedback: (interviewId: number, feedback: string, rating: number) =>
      handleApiCall(() => submitInterviewFeedback(interviewId, feedback, rating)),

    // Saved Jobs
    saveJob: (jobId: number) => handleApiCall(() => saveJob(jobId)),
    unsaveJob: (jobId: number) => handleApiCall(() => unsaveJob(jobId)),
    getSavedJobs: (page = 0, size = 10) => handleApiCall(() => getSavedJobs(page, size)),
    isJobSaved: (jobId: number) => handleApiCall(() => isJobSaved(jobId)),
    getSavedJobsCount: () => handleApiCall(() => getSavedJobsCount()),
    clearAllSavedJobs: () => handleApiCall(() => clearAllSavedJobs()),

    // Job Alerts
    createJobAlert: (data: CreateJobAlertRequest) =>
      handleApiCall(() => createJobAlert(data)),
    getMyJobAlerts: () => handleApiCall(() => getMyJobAlerts()),
    updateJobAlert: (alertId: number, data: Partial<CreateJobAlertRequest>) =>
      handleApiCall(() => updateJobAlert(alertId, data)),
    deleteJobAlert: (alertId: number) => handleApiCall(() => deleteJobAlert(alertId)),
    toggleJobAlert: (alertId: number) => handleApiCall(() => toggleJobAlert(alertId)),
    getMatchingJobsForAlert: (alertId: number, page = 0, size = 10) =>
      handleApiCall(() => getMatchingJobsForAlert(alertId, page, size)),

    // Subscriptions
    getSubscriptionPlans: () => handleApiCall(() => getSubscriptionPlans()),
    subscribeToPlan: (planId: number) => handleApiCall(() => subscribeToPlan(planId)),
    getMySubscription: () => handleApiCall(() => getMySubscription()),
    cancelSubscription: (subscriptionId: number) =>
      handleApiCall(() => cancelSubscription(subscriptionId)),
    checkSubscriptionAccess: () => handleApiCall(() => checkSubscriptionAccess()),

    // Messaging
    getMyThreads: (page = 0, size = 20) => handleApiCall(() => getMyThreads(page, size)),
    getThreadMessages: (threadId: number, page = 0, size = 50) =>
      handleApiCall(() => getThreadMessages(threadId, page, size)),
    sendMessage: (threadId: number, messageText: string) =>
      handleApiCall(() => sendMessage(threadId, messageText)),
    markMessageAsRead: (messageId: number) =>
      handleApiCall(() => markMessageAsRead(messageId)),
    getUnreadCount: () => handleApiCall(() => getUnreadCount()),

    // Notifications
    getMyNotifications: (page = 0, size = 20) =>
      handleApiCall(() => getMyNotifications(page, size)),
    markNotificationAsRead: (notificationId: number) =>
      handleApiCall(() => markNotificationAsRead(notificationId)),
    markAllNotificationsAsRead: () =>
      handleApiCall(() => markAllNotificationsAsRead()),
    getUnreadNotificationsCount: () =>
      handleApiCall(() => getUnreadNotificationsCount()),
    deleteNotification: (notificationId: number) =>
      handleApiCall(() => deleteNotification(notificationId)),
  };
};
