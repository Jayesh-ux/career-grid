import { useState, useMemo } from "react";
import { Search, MapPin, Filter, Grid, List, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import JobCard from "@/components/JobCard";
import { useJobs } from "@/context/JobContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

// Sample jobs for public browsing
const SAMPLE_JOBS = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "Senior",
    salary: 120000,
    description: "Join our innovative team to build cutting-edge web applications using React, TypeScript, and modern web technologies.",
    posted: "2 days ago",
    remote: true,
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"]
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    type: "Full-time",
    experience: "Mid",
    salary: 90000,
    description: "Lead product strategy and development for our SaaS platform. Collaborate with engineering, design, and marketing teams.",
    posted: "1 day ago",
    remote: false,
    skills: ["Product Strategy", "Agile", "Analytics", "User Research", "Roadmapping"]
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Design Studio",
    location: "Los Angeles, CA",
    type: "Contract",
    experience: "Mid",
    salary: 70000,
    description: "Create intuitive and beautiful user experiences for web and mobile applications.",
    posted: "3 days ago",
    remote: true,
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"]
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "AI Solutions",
    location: "Austin, TX",
    type: "Full-time",
    experience: "Senior",
    salary: 130000,
    description: "Develop machine learning models and data pipelines for our AI platform.",
    posted: "5 days ago",
    remote: true,
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Spark"]
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Seattle, WA",
    type: "Full-time",
    experience: "Mid",
    salary: 110000,
    description: "Build and maintain infrastructure for our cloud-native applications.",
    posted: "1 day ago",
    remote: true,
    skills: ["Kubernetes", "Docker", "AWS", "CI/CD", "Terraform"]
  },
  {
    id: 6,
    title: "Marketing Manager",
    company: "BrandCo",
    location: "Chicago, IL",
    type: "Full-time",
    experience: "Mid",
    salary: 80000,
    description: "Lead marketing campaigns and manage our digital presence.",
    posted: "4 days ago",
    remote: false,
    skills: ["Digital Marketing", "Analytics", "Social Media", "Content Strategy"]
  },
];

export default function FindJobs() {
  const { jobs, getFilteredJobs, updateFilters, clearFilters: clearJobFilters, filters, isSearching, searchJobs } = useJobs();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');

  // Use real jobs if authenticated, otherwise use sample jobs
  const displayJobs = useMemo(() => {
    if (token && jobs && jobs.length > 0) {
      return jobs;
    }
    return SAMPLE_JOBS;
  }, [token, jobs]);

  // Filter jobs locally for public users
  const filteredJobs = useMemo(() => {
    if (!displayJobs) return [];
    
    let filtered = displayJobs;
    
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.location?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        (job.remote && 'remote'.includes(locationFilter.toLowerCase()))
      );
    }
    
    return filtered;
  }, [displayJobs, searchTerm, locationFilter]);

  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    const newJobTypes = checked 
      ? [...(filters.jobType || []), jobType]
      : (filters.jobType || []).filter(type => type !== jobType);
    
    updateFilters({ jobType: newJobTypes });
  };

  const handleFilterChange = (key: string, value: any) => {
    updateFilters({ [key]: value });
  };

  const handleSearchClick = () => {
    if (token && isSearching === false) {
      // Call API search with current filters
      searchJobs({
        jobTitle: searchTerm || filters.search,
        location: locationFilter || filters.location,
        page: 0,
        size: 20,
      });
    }
    // For public users, filtering happens via useMemo above
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    clearJobFilters();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {!token && (
          <Alert className="mb-6 border-primary/50 bg-primary/10">
            <LogIn className="h-4 w-4" />
            <AlertDescription>
              Sign in to unlock personalized job recommendations and save your favorite jobs.{' '}
              <Button 
                variant="link" 
                size="sm"
                onClick={() => navigate('/auth')}
                className="pl-0 text-primary"
              >
                Sign in now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Find Your Perfect Job</h1>
          <div className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl glass">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Job title, company, or keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="City, state, or remote"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}
              />
            </div>
            <Button 
              onClick={handleSearchClick}
              disabled={isSearching}
              className="bg-gradient-primary hover:shadow-button text-white font-semibold"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            {(searchTerm || locationFilter) && (
              <Button 
                onClick={clearFilters}
                variant="outline"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="glass rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              {/* Job Type */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Job Type</h4>
                <div className="space-y-2">
                  {['Full-time', 'Part-time', 'Contract', 'Freelance'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={filters.jobType.includes(type)}
                        onCheckedChange={(checked) => handleJobTypeChange(type, checked as boolean)}
                      />
                      <label htmlFor={type} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Experience Level</h4>
                <Select value={filters.experience || 'any'} onValueChange={(value) => handleFilterChange('experience', value === 'any' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Level</SelectItem>
                    <SelectItem value="Entry">Entry Level</SelectItem>
                    <SelectItem value="Mid">Mid Level</SelectItem>
                    <SelectItem value="Senior">Senior Level</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Salary Range</h4>
                <div className="px-2">
                  <Slider
                    value={filters.salaryRange}
                    onValueChange={(value) => handleFilterChange('salaryRange', value)}
                    max={200000}
                    min={0}
                    step={5000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${filters.salaryRange[0].toLocaleString()}</span>
                    <span>${filters.salaryRange[1].toLocaleString()}+</span>
                  </div>
                </div>
              </div>

              {/* Date Posted */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Date Posted</h4>
                <Select value={filters.datePosted || 'any'} onValueChange={(value) => handleFilterChange('datePosted', value === 'any' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="24hours">Last 24 hours</SelectItem>
                    <SelectItem value="week">Last week</SelectItem>
                    <SelectItem value="month">Last month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <p className="text-muted-foreground">
                  Showing {filteredJobs.length} of {jobs.length} jobs
                </p>
                {filters.jobType.length > 0 && (
                  <div className="flex gap-2">
                    {filters.jobType.map(type => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <Button
                    variant={viewType === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewType('grid')}
                    className="rounded-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewType === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewType('list')}
                    className="rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Job Results */}
            <div className={`grid gap-6 ${viewType === 'grid' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              {isSearching ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading jobs...</p>
                </div>
              ) : filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {!isSearching && filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  {token 
                    ? "Try adjusting your search criteria or clearing some filters"
                    : "Sign in to search for jobs that match your profile"
                  }
                </p>
                <Button 
                  variant="outline" 
                  onClick={token ? clearFilters : () => navigate('/auth')}
                >
                  {token ? "Clear All Filters" : "Sign In"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}