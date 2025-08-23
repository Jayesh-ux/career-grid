import { useState } from "react";
import { Search, MapPin, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import JobCard from "@/components/JobCard";
import { useJobs } from "@/context/JobContext";

export default function FindJobs() {
  const { jobs, getFilteredJobs, updateFilters, clearFilters: clearJobFilters, filters } = useJobs();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  // Use the context's filtered jobs instead of local filtering
  const filteredJobs = getFilteredJobs();

  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    const newJobTypes = checked 
      ? [...(filters.jobType || []), jobType]
      : (filters.jobType || []).filter(type => type !== jobType);
    
    updateFilters({ jobType: newJobTypes });
  };

  const handleFilterChange = (key: string, value: any) => {
    updateFilters({ [key]: value });
  };

  const clearFilters = () => {
    clearJobFilters();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Find Your Perfect Job</h1>
          <div className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl glass">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Job title, company, or keyword"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="pl-10"
                />
            </div>
            <Button className="bg-gradient-primary">
              <Search className="h-4 w-4 mr-2" />
              Search Jobs
            </Button>
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
                <Select value={filters.experience} onValueChange={(value) => handleFilterChange('experience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Level</SelectItem>
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
                <Select value={filters.datePosted} onValueChange={(value) => handleFilterChange('datePosted', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any time</SelectItem>
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
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or clearing some filters
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}