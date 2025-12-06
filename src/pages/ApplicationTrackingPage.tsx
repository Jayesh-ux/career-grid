import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useJobs } from '@/context/JobContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Phone,
  Mail,
} from 'lucide-react';
import { format } from 'date-fns';

const STATUS_CONFIG = {
  applied: {
    color: 'bg-blue-100 text-blue-800',
    icon: <Clock className="h-4 w-4" />,
    label: 'Applied',
  },
  shortlisted: {
    color: 'bg-purple-100 text-purple-800',
    icon: <CheckCircle className="h-4 w-4" />,
    label: 'Shortlisted',
  },
  interview_scheduled: {
    color: 'bg-orange-100 text-orange-800',
    icon: <Calendar className="h-4 w-4" />,
    label: 'Interview Scheduled',
  },
  interviewed: {
    color: 'bg-indigo-100 text-indigo-800',
    icon: <MessageSquare className="h-4 w-4" />,
    label: 'Interviewed',
  },
  offer_received: {
    color: 'bg-green-100 text-green-800',
    icon: <TrendingUp className="h-4 w-4" />,
    label: 'Offer Received',
  },
  rejected: {
    color: 'bg-red-100 text-red-800',
    icon: <AlertCircle className="h-4 w-4" />,
    label: 'Rejected',
  },
  pending: {
    color: 'bg-gray-100 text-gray-800',
    icon: <Clock className="h-4 w-4" />,
    label: 'Pending',
  },
};

export default function ApplicationTrackingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    appliedJobs,
    isLoadingApplications,
    interviews,
  } = useJobs();

  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Filter applications
  const filteredApplications = useMemo(() => {
    let filtered = appliedJobs || [];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.applicationStatus === filterStatus);
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime());
        break;
      default:
        break;
    }

    return filtered;
  }, [appliedJobs, filterStatus, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const applications = appliedJobs || [];
    return {
      total: applications.length,
      shortlisted: applications.filter(a => a.applicationStatus === 'shortlisted').length,
      interviewed: applications.filter(a => a.applicationStatus === 'interviewed').length,
      offers: applications.filter(a => a.applicationStatus === 'offer_received').length,
      rejected: applications.filter(a => a.applicationStatus === 'rejected').length,
    };
  }, [appliedJobs]);

  // Upcoming interviews
  const upcomingInterviews = useMemo(() => {
    if (!interviews) return [];
    const now = new Date();
    return interviews
      .filter(int => new Date(int.scheduledDatetime) > now)
      .sort((a, b) => new Date(a.scheduledDatetime).getTime() - new Date(b.scheduledDatetime).getTime())
      .slice(0, 5);
  }, [interviews]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Application Tracking</h1>
          <p className="text-gray-600">Track all your job applications and interviews in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-sm text-gray-600 mt-2">Total Applications</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{stats.shortlisted}</p>
                <p className="text-sm text-gray-600 mt-2">Shortlisted</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">{stats.interviewed}</p>
                <p className="text-sm text-gray-600 mt-2">Interviewed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{stats.offers}</p>
                <p className="text-sm text-gray-600 mt-2">Offers</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-sm text-gray-600 mt-2">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-sm">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="interviews">Interviews ({upcomingInterviews.length})</TabsTrigger>
          </TabsList>

          {/* APPLICATIONS TAB */}
          <TabsContent value="applications" className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApplications.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">No applications found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredApplications.map(application => {
                  const config = STATUS_CONFIG[application.applicationStatus] || STATUS_CONFIG.pending;

                  return (
                    <Card key={application.applicationId} className="hover:shadow-md transition-all">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">
                              {application.jobTitle}
                            </h3>
                            <p className="text-gray-600 font-medium mb-3">
                              {application.companyName}
                            </p>

                            {/* Job Details */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                              {application.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin size={16} />
                                  {application.location}
                                </div>
                              )}
                              {application.salary && (
                                <div className="flex items-center gap-1">
                                  <DollarSign size={16} />
                                  ₹{application.salary}/yr
                                </div>
                              )}
                              {application.jobType && (
                                <div className="flex items-center gap-1">
                                  <Briefcase size={16} />
                                  {application.jobType}
                                </div>
                              )}
                            </div>

                            {/* Applied Date */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar size={16} />
                              Applied {format(new Date(application.appliedAt), 'MMM dd, yyyy')}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="text-right">
                            <Badge className={`${config.color} gap-2 mb-4`}>
                              {config.icon}
                              {config.label}
                            </Badge>

                            {/* Rating if available */}
                            {application.ratingByEmployer && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-600">Employer Rating</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="text-lg font-bold text-yellow-500">
                                    {application.ratingByEmployer}
                                  </span>
                                  <span className="text-sm text-yellow-500">/5</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Timeline or Additional Info */}
                        <div className="border-t pt-4 mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {application.lastUpdatedAt && (
                            <div>
                              <p className="text-gray-600">Last Update</p>
                              <p className="font-medium">
                                {format(new Date(application.lastUpdatedAt), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          )}

                          {application.interviewsCount !== undefined && (
                            <div>
                              <p className="text-gray-600">Interviews</p>
                              <p className="font-medium">{application.interviewsCount} interview(s)</p>
                            </div>
                          )}

                          {application.rejectionReason && (
                            <div>
                              <p className="text-gray-600">Rejection Reason</p>
                              <p className="font-medium text-red-600">
                                {application.rejectionReason}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          {application.companyContactPhone && (
                            <Button variant="outline" size="sm" className="gap-2">
                              <Phone size={16} />
                              Call
                            </Button>
                          )}
                          {application.companyContactEmail && (
                            <Button variant="outline" size="sm" className="gap-2">
                              <Mail size={16} />
                              Email
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="gap-2">
                            <MessageSquare size={16} />
                            Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* INTERVIEWS TAB */}
          <TabsContent value="interviews" className="space-y-4">
            {upcomingInterviews.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming interviews scheduled</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingInterviews.map(interview => (
                  <Card
                    key={interview.interviewId}
                    className="border-l-4 border-l-orange-500 hover:shadow-md transition-all"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">
                            {interview.jobTitle}
                          </h3>
                          <p className="text-gray-600 font-medium mb-4">
                            {interview.companyName}
                          </p>

                          {/* Interview Details */}
                          <div className="space-y-3">
                            {/* Date and Time */}
                            <div className="flex items-center gap-3 text-sm">
                              <Calendar size={18} className="text-blue-600" />
                              <div>
                                <p className="text-gray-600">Scheduled</p>
                                <p className="font-semibold">
                                  {format(
                                    new Date(interview.scheduledDatetime),
                                    'MMMM dd, yyyy • HH:mm'
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Interview Type */}
                            {interview.interviewType && (
                              <div className="flex items-center gap-3 text-sm">
                                <Briefcase size={18} className="text-indigo-600" />
                                <div>
                                  <p className="text-gray-600">Type</p>
                                  <p className="font-semibold capitalize">
                                    {interview.interviewType.replace('_', ' ')}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Location/Link */}
                            {interview.locationOrLink && (
                              <div className="flex items-center gap-3 text-sm">
                                <MapPin size={18} className="text-red-600" />
                                <div>
                                  <p className="text-gray-600">
                                    {interview.interviewType?.includes('video') ? 'Meeting Link' : 'Location'}
                                  </p>
                                  <p className="font-semibold break-all">
                                    {interview.locationOrLink}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Interviewer */}
                            {interview.interviewerName && (
                              <div className="flex items-center gap-3 text-sm">
                                <MessageSquare size={18} className="text-purple-600" />
                                <div>
                                  <p className="text-gray-600">Interviewer</p>
                                  <p className="font-semibold">{interview.interviewerName}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <Badge className="bg-orange-100 text-orange-800 gap-2">
                          <Calendar size={14} />
                          Upcoming
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-6 pt-4 border-t">
                        {interview.locationOrLink && interview.interviewType?.includes('video') && (
                          <Button 
                            className="gap-2 bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                              window.open(interview.locationOrLink, '_blank');
                            }}
                          >
                            <MessageSquare size={16} />
                            Join Meeting
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          className="gap-2"
                          onClick={() => {
                            toast({ description: "Message functionality coming soon" });
                          }}
                        >
                          <MessageSquare size={16} />
                          Message Interviewer
                        </Button>
                        <Button 
                          variant="outline" 
                          className="gap-2"
                          onClick={() => {
                            toast({ description: "Reschedule functionality coming soon" });
                          }}
                        >
                          <Calendar size={16} />
                          Reschedule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
