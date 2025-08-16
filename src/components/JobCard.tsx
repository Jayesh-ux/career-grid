import { Heart, MapPin, Clock, DollarSign, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    experience: string;
    salary: string;
    description: string;
    posted: string;
    urgent?: boolean;
    remote?: boolean;
    companyLogo?: string;
    skills: string[];
  };
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card className="job-card bg-job-card border-border/50 hover:border-primary/30 group cursor-pointer">
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
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Heart className="h-4 w-4" />
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
            <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary hover:border-primary/30">
              View Details
            </Button>
            <Button size="sm" className="bg-gradient-primary hover:shadow-button btn-glow">
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}