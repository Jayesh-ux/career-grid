import { Heart, MapPin, Clock, DollarSign, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useJobs } from "@/context/JobContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useState } from "react";

interface JobCardProps {
  job?: {
    id?: string;
    jobId?: number;
    title: string;
    company: string;
    location: string;
    type: string;
    experience?: string;
    salary: string | number;
    description: string;
    posted: string;
    urgent?: boolean;
    remote?: boolean;
    companyLogo?: string;
    skills: string[];
    applied?: boolean;
  };
  // Alternative props for public jobs
  jobId?: string | number;
  title?: string;
  company?: string;
  location?: string;
  type?: string;
  salary?: string | number;
  description?: string;
  posted?: string;
  skills?: string[];
  remote?: boolean;
  isPublic?: boolean;
}

export default function JobCard(props: JobCardProps) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { saveJob, unsaveJob } = useJobs();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);

  // Support both job object and individual props
  const job = props.job || {
    jobId: props.jobId,
    title: props.title || '',
    company: props.company || '',
    location: props.location || '',
    type: props.type || '',
    salary: props.salary || 'Not specified',
    description: props.description || '',
    posted: props.posted || 'Recently',
    skills: props.skills || [],
    remote: props.remote,
  };

  const jobId = job.jobId || parseInt(job.id || "0");
  const isPublicJob = props.isPublic || !token;

  const handleSaveJob = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!token) {
      toast.error("Please login to save jobs");
      navigate('/auth');
      return;
    }

    try {
      setSaving(true);
      if (saved) {
        await unsaveJob(jobId);
        setSaved(false);
        toast.success("Job removed from saved");
      } else {
        await saveJob(jobId);
        setSaved(true);
        toast.success("Job saved successfully");
      }
    } catch (error) {
      toast.error("Failed to save job");
    } finally {
      setSaving(false);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/job/${jobId}`);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!token) {
      toast.error("Please login to apply");
      navigate('/auth');
      return;
    }
    
    setApplying(true);
    navigate(`/job/${jobId}?apply=true`);
  };

  return (
    <Card 
      className="job-card bg-job-card border-border/50 hover:border-primary/30 group cursor-pointer"
      onClick={() => navigate(`/job/${jobId}`)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-secondary flex items-center justify-center">
              <Building2 className="h-6 w-6 text-company-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-muted-foreground text-sm">{job.company}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {job.urgent && (
              <Badge className="bg-urgent-badge text-urgent-badge-foreground">
                Urgent
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleSaveJob}
              disabled={saving}
            >
              <Heart className={`h-4 w-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
              {job.remote && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Remote
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{job.experience}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-salary-highlight">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">{job.salary}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {job.type}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 3).map((skill, index) => (
            <Badge 
              key={index}
              variant="secondary" 
              className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
            >
              {skill}
            </Badge>
          ))}
          {job.skills.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{job.skills.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{job.posted}</span>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:bg-primary/10 hover:text-primary hover:border-primary/30"
              onClick={handleViewDetails}
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-primary hover:shadow-button btn-glow"
              onClick={handleApply}
              disabled={job.applied}
            >
              {job.applied ? 'Already Applied' : 'Apply Now'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}