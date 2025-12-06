import React, { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useJobs } from '@/context/JobContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Briefcase, DollarSign, Heart, Share2, MessageSquare, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function JobDiscoveryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    jobs,
    filters,
    updateFilters,
    clearFilters,
    saveJob,
    unsaveJob,
    applyToJob,
    isSearching,
    isSaving,
    isUnsaving,
    isApplying,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
  } = useJobs();

  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplyingToJob, setIsApplyingToJob] = useState(false);

  const handleSearchChange = useCallback((value) => {
    updateFilters({ search: value });
  }, [updateFilters]);

  const handleLocationChange = useCallback((value) => {
    updateFilters({ location: value });
  }, [updateFilters]);

  const handleSalaryChange = useCallback((value) => {
    updateFilters({ salaryRange: value });
  }, [updateFilters]);

  const handleSaveJob = async (jobId) => {
    try {
      const job = jobs.find(j => j.jobId === jobId);
      if (job?.saved) {
        await unsaveJob(jobId);
        toast({ description: 'Job removed from saved' });
      } else {
        await saveJob(jobId);
        toast({ description: 'Job saved successfully' });
      }
    } catch (error) {
      toast({
        description: error?.message || 'Failed to save job',
        variant: 'destructive',
      });
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setCoverLetter('');
    setShowApplyModal(true);
  };

  const handleApplySubmit = async () => {
    if (!selectedJob) return;

    try {
      setIsApplyingToJob(true);
      await applyToJob(selectedJob.jobId, { coverLetter });
      toast({
        title: 'Success',
        description: `Applied to ${selectedJob.jobTitle} successfully`,
      });
      setShowApplyModal(false);
      setSelectedJob(null);
      setCoverLetter('');
    } catch (error) {
      toast({
        description: error?.message || 'Failed to apply',
        variant: 'destructive',
      });
    } finally {
      setIsApplyingToJob(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Jobs</h1>
          <p className="text-gray-600">Welcome, {user?.email || 'User'}. Find your next opportunity.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* SIDEBAR - FILTERS */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <h3 className="font-semibold text-lg">Filters</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    placeholder="Search by title..."
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="City or Remote"
                    value={filters.location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                  />
                </div>

                <Separator />

                {/* Salary Range */}
                <div className="space-y-4">
                  <Label>
                    Salary Range
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ₹{filters.salaryRange[0]}L - ₹{filters.salaryRange[1]}L
                    </span>
                  </Label>
                  <Slider
                    min={0}
                    max={200}
                    step={10}
                    value={filters.salaryRange}
                    onValueChange={handleSalaryChange}
                    className="w-full"
                  />
                </div>

                <Separator />

                {/* Job Type */}
                <div className="space-y-3">
                  <Label>Job Type</Label>
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Contract', 'Remote'].map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={filters.jobType?.includes(type)}
                          onCheckedChange={(checked) => {
                            const newTypes = checked
                              ? [...(filters.jobType || []), type]
                              : (filters.jobType || []).filter(t => t !== type);
                            updateFilters({ jobType: newTypes });
                          }}
                        />
                        <Label htmlFor={type} className="font-normal cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Experience Level */}
                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select value={filters.experience} onValueChange={(value) => updateFilters({ experience: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      <SelectItem value="fresher">Fresher (0-1 years)</SelectItem>
                      <SelectItem value="junior">Junior (1-3 years)</SelectItem>
                      <SelectItem value="mid">Mid-level (3-7 years)</SelectItem>
                      <SelectItem value="senior">Senior (7+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Posted Date */}
                <div className="space-y-2">
                  <Label>Posted</Label>
                  <Select value={filters.postedDate} onValueChange={(value) => updateFilters({ postedDate: value })}>
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

                <Separator />

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* MAIN CONTENT - JOB LISTINGS */}
          <div className="lg:col-span-3 space-y-4">
            {isSearching ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : jobs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 mb-4">No jobs found matching your criteria</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear filters and try again
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Jobs Count */}
                <div className="text-sm text-gray-600 mb-4">
                  Showing <strong>{jobs.length}</strong> jobs
                </div>

                {/* Job Cards */}
                <div className="space-y-4">
                  {jobs.map(job => (
                    <Card
                      key={job.jobId}
                      className={`cursor-pointer hover:shadow-md transition-all border-l-4 ${
                        selectedJob?.jobId === job.jobId
                          ? 'border-l-blue-600 bg-blue-50 shadow-md'
                          : 'border-l-transparent hover:border-l-blue-400'
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                                {job.jobTitle}
                              </h3>
                              {job.applied && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Applied
                                </Badge>
                              )}
                            </div>

                            <p className="text-gray-600 font-medium mb-3">{job.companyName}</p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                              {job.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin size={16} />
                                  {job.location}
                                </div>
                              )}
                              {job.jobType && (
                                <div className="flex items-center gap-1">
                                  <Briefcase size={16} />
                                  {job.jobType}
                                </div>
                              )}
                              {job.salary?.min && job.salary?.max && (
                                <div className="flex items-center gap-1">
                                  <DollarSign size={16} />
                                  ₹{job.salary.min}L - ₹{job.salary.max}L/yr
                                </div>
                              )}
                            </div>

                            {/* Description Preview */}
                            <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                              {job.description}
                            </p>

                            {/* Skills */}
                            {job.requiredSkills && job.requiredSkills.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {job.requiredSkills.slice(0, 3).map(skill => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {job.requiredSkills.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{job.requiredSkills.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant={job.saved ? 'default' : 'outline'}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveJob(job.jobId);
                              }}
                              disabled={isSaving || isUnsaving}
                              className="gap-2"
                            >
                              <Heart
                                size={16}
                                fill={job.saved ? 'currentColor' : 'none'}
                              />
                              <span className="hidden sm:inline">
                                {job.saved ? 'Saved' : 'Save'}
                              </span>
                            </Button>
                            {!job.applied && (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApplyClick(job);
                                }}
                                disabled={isApplying}
                              >
                                <MessageSquare size={16} />
                                <span className="hidden sm:inline">Apply</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={goToPreviousPage}
                    disabled={!hasPreviousPage}
                  >
                    Previous
                  </Button>
                  <div className="px-4 py-2 border rounded-md flex items-center">
                    Page {currentPage + 1}
                  </div>
                  <Button
                    variant="outline"
                    onClick={goToNextPage}
                    disabled={!hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-xl font-bold">Apply to {selectedJob.jobTitle}</h2>
              <p className="text-sm text-gray-600">{selectedJob.companyName}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cover-letter">Cover Letter (Optional)</Label>
                <textarea
                  id="cover-letter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Tell the employer why you're a great fit for this role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  disabled={isApplyingToJob}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
                <p className="font-semibold mb-1">Your latest resume will be sent automatically</p>
                <p>Make sure your profile is up-to-date before applying.</p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowApplyModal(false);
                    setCoverLetter('');
                  }}
                  disabled={isApplyingToJob}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleApplySubmit}
                  disabled={isApplyingToJob}
                >
                  {isApplyingToJob && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isApplyingToJob ? 'Applying...' : 'Apply Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
