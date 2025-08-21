import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, DollarSign, Building2, Users, Heart, Share2, Briefcase, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJobs } from '@/context/JobContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import ApplicationModal from '@/components/job/ApplicationModal';
import AuthModal from '@/components/auth/AuthModal';
import { useToast } from '@/hooks/use-toast';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobById, jobs, saveJob, savedJobs } = useJobs();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const job = getJobById(id);
  const isSaved = savedJobs.includes(parseInt(id));

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-8">The job you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/find-jobs')}>
            Browse All Jobs
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Get similar jobs (same category, different company)
  const similarJobs = jobs
    .filter(j => j.id !== job.id && j.category === job.category)
    .slice(0, 3);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowApplicationModal(true);
  };

  const handleSaveJob = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    saveJob(job.id);
    toast({
      title: isSaved ? "Job Removed" : "Job Saved",
      description: isSaved ? "Job removed from your saved list." : "Job added to your saved list.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Job link copied to clipboard.",
    });
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-secondary flex items-center justify-center">
                      <img 
                        src={job.logo} 
                        alt={job.company}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = `<Building2 className="h-8 w-8 text-company-accent" />`;
                        }}
                      />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
                      <p className="text-xl text-muted-foreground">{job.company}</p>
                      <div className="flex items-center space-x-4 mt-2 text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{getTimeAgo(job.postedDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{job.applicants} applicants</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveJob}
                      className={`${isSaved ? 'text-red-500 border-red-500' : ''}`}
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-salary-highlight">
                    <DollarSign className="h-5 w-5" />
                    <span className="font-semibold text-lg">{formatSalary(job.salary)}</span>
                  </div>
                  <Badge variant="outline">{job.type}</Badge>
                  <Badge variant="outline">{job.experience}</Badge>
                  {job.remote && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Remote
                    </Badge>
                  )}
                  <Badge className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Actively Hiring
                  </Badge>
                </div>

                <div className="flex space-x-4">
                  <Button
                    size="lg"
                    className="bg-gradient-primary hover:shadow-button flex-1 max-w-xs"
                    onClick={handleApplyClick}
                  >
                    <Briefcase className="h-5 w-5 mr-2" />
                    Apply Now
                  </Button>
                  <Button variant="outline" size="lg">
                    Save Job
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>About this role</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>What we offer</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {job.company}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={job.logo} 
                    alt={job.company}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = `<Building2 className="h-8 w-8 text-company-accent" />`;
                    }}
                  />
                  <div>
                    <h3 className="font-semibold">{job.company}</h3>
                    <p className="text-sm text-muted-foreground">{job.category}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Leading company in the {job.category.toLowerCase()} industry, focused on innovative solutions and cutting-edge technology.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Company Profile
                </Button>
              </CardContent>
            </Card>

            {/* Application Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Application Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Tailor your resume</h4>
                  <p className="text-sm text-muted-foreground">
                    Highlight skills that match the job requirements.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Write a cover letter</h4>
                  <p className="text-sm text-muted-foreground">
                    Explain why you're interested in this specific role.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Apply quickly</h4>
                  <p className="text-sm text-muted-foreground">
                    This job has {job.applicants} applicants already.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Jobs */}
        {similarJobs.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Similar Jobs</h2>
              <Link to="/find-jobs" className="text-primary hover:underline">
                View all jobs
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarJobs.map(similarJob => (
                <JobCard key={similarJob.id} job={similarJob} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Modals */}
      <ApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        job={job}
      />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="login"
      />
    </div>
  );
};

export default JobDetail;