import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, Heart, FileText, Settings, LogOut, Edit, Trash2, Eye, MapPin, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useJobs } from '@/context/JobContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect } from 'react';

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getSavedJobsDetails, getAppliedJobsDetails } = useJobs();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const savedJobs = getSavedJobsDetails();
  const appliedJobs = getAppliedJobsDetails();
  
  const getProfileCompletion = () => {
    let completion = 30; // Base for having an account
    if (user.profile?.phone) completion += 10;
    if (user.profile?.location) completion += 10;
    if (user.profile?.bio) completion += 15;
    if (user.profile?.skills?.length > 0) completion += 15;
    if (user.profile?.experience?.length > 0) completion += 20;
    return Math.min(completion, 100);
  };

  const formatSalary = (salary) => {
    return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k`;
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'interview': return 'bg-primary/10 text-primary border-primary/20';
      case 'hired': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'applied', label: 'Applied Jobs', icon: Briefcase },
    { id: 'saved', label: 'Saved Jobs', icon: Heart },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-lg font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Profile Completion</span>
                      <span className="font-medium">{getProfileCompletion()}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProfileCompletion()}%` }}
                      />
                    </div>
                  </div>
                </div>

                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors mt-4 border-t border-border pt-4"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <p className="text-muted-foreground">{user.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-muted-foreground">{user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <p className="text-muted-foreground">
                          {user.profile?.phone || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <p className="text-muted-foreground">
                          {user.profile?.location || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bio</label>
                      <p className="text-muted-foreground">
                        {user.profile?.bio || 'Tell us about yourself...'}
                      </p>
                    </div>
                    <Button>Edit Profile</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.profile?.skills?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.profile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No skills added yet.</p>
                    )}
                    <Button variant="outline" className="mt-4">Add Skills</Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Applied Jobs Tab */}
            {activeTab === 'applied' && (
              <Card>
                <CardHeader>
                  <CardTitle>Applied Jobs ({appliedJobs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {appliedJobs.length > 0 ? (
                    <div className="space-y-4">
                      {appliedJobs.map((application) => (
                        <div
                          key={application.jobId}
                          className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">
                                {application.job?.title}
                              </h3>
                              <p className="text-muted-foreground mb-2">
                                {application.job?.company}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{application.job?.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{application.job ? formatSalary(application.job.salary) : 'N/A'}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Applied {getTimeAgo(application.appliedDate)}</span>
                                </div>
                              </div>
                              <Badge className={getStatusColor(application.status)}>
                                {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/job/${application.jobId}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Job
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No Applications Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start applying to jobs to track your applications here.
                      </p>
                      <Button onClick={() => navigate('/find-jobs')}>
                        Browse Jobs
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Saved Jobs Tab */}
            {activeTab === 'saved' && (
              <Card>
                <CardHeader>
                  <CardTitle>Saved Jobs ({savedJobs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {savedJobs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {savedJobs.map((job) => (
                        <div
                          key={job.id}
                          className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                              <p className="text-muted-foreground mb-2">{job.company}</p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{job.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{formatSalary(job.salary)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{getTimeAgo(job.postedDate)}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {job.skills.slice(0, 3).map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/job/${job.id}`)}
                              >
                                View Details
                              </Button>
                              <Button size="sm">
                                Apply Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No Saved Jobs</h3>
                      <p className="text-muted-foreground mb-4">
                        Save jobs you're interested in to keep track of them here.
                      </p>
                      <Button onClick={() => navigate('/find-jobs')}>
                        Browse Jobs
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Resume Tab */}
            {activeTab === 'resume' && (
              <Card>
                <CardHeader>
                  <CardTitle>Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No Resume Uploaded</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload your resume to make it easier to apply for jobs.
                    </p>
                    <Button>Upload Resume</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Email Notifications</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">Job recommendations</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">Application updates</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Marketing emails</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Privacy</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">Make profile visible to employers</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Allow companies to contact me</span>
                        </label>
                      </div>
                    </div>
                    <Button>Save Settings</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;