import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useJobs } from '@/context/JobContext';
import { useToast } from '@/hooks/use-toast';

const ApplicationModal = ({ isOpen, onClose, job }) => {
  const { applyToJob } = useJobs();
  // Auth removed — user not available
  const user = null;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null,
    additionalInfo: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        toast({
          title: "Sign-in required",
          description: "Sign-in was removed. This action is unavailable.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      applyToJob(job.id, {
        ...applicationData,
        applicantName: user.name,
        applicantEmail: user.email
      });

      toast({
        title: "Application Submitted!",
        description: `Your application for ${job.title} has been submitted successfully.`,
      });

      onClose();
      setApplicationData({ coverLetter: '', resume: null, additionalInfo: '' });
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-card rounded-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Apply for {job.title}</h2>
            <p className="text-muted-foreground">at {job.company}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <Input value={user?.name || ''} disabled />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input value={user?.email || ''} disabled />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Resume *</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (max 5MB)</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setApplicationData(prev => ({ ...prev, resume: e.target.files[0] }))}
                />
              </div>
              {applicationData.resume && (
                <div className="flex items-center space-x-2 mt-2 p-2 bg-muted rounded">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm">{applicationData.resume.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Cover Letter (Optional)</label>
              <Textarea
                placeholder="Why are you interested in this position? What makes you a great fit?"
                value={applicationData.coverLetter}
                onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Additional Information (Optional)</label>
              <Textarea
                placeholder="Any additional information you'd like to share..."
                value={applicationData.additionalInfo}
                onChange={(e) => setApplicationData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;