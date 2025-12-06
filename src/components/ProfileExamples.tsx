// Example components for using the Profile Service API
// Copy and adapt these examples in your own components

import React, { useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Gender, NoticePeriod } from '@/lib/api';

// ============================================================================
// Example 1: Create Profile Form
// ============================================================================

export const CreateProfileForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { createProfile, loading, error, clearError } = useProfile();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: Gender.MALE,
    currentLocation: '',
    preferredLocation: '',
    bio: '',
    totalExperienceMonths: '',
    currentSalary: '',
    expectedSalary: '',
    noticePeriod: NoticePeriod.MONTH_1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProfile({
        ...formData,
        totalExperienceMonths: formData.totalExperienceMonths ? Number(formData.totalExperienceMonths) : undefined,
        currentSalary: formData.currentSalary ? Number(formData.currentSalary) : undefined,
        expectedSalary: formData.expectedSalary ? Number(formData.expectedSalary) : undefined,
      });
      onSuccess?.();
    } catch (err) {
      console.error('Profile creation failed:', err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex justify-between">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
            <Select value={formData.gender} onValueChange={(value: any) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Current Location"
              value={formData.currentLocation}
              onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
            />
            <Input
              placeholder="Preferred Location"
              value={formData.preferredLocation}
              onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
            />
          </div>

          <Textarea
            placeholder="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              type="number"
              placeholder="Experience (months)"
              value={formData.totalExperienceMonths}
              onChange={(e) => setFormData({ ...formData, totalExperienceMonths: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Current Salary"
              value={formData.currentSalary}
              onChange={(e) => setFormData({ ...formData, currentSalary: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Expected Salary"
              value={formData.expectedSalary}
              onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
            />
          </div>

          <Select value={formData.noticePeriod} onValueChange={(value: any) => setFormData({ ...formData, noticePeriod: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Notice Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IMMEDIATE">Immediate</SelectItem>
              <SelectItem value="DAYS_15">15 Days</SelectItem>
              <SelectItem value="MONTH_1">1 Month</SelectItem>
              <SelectItem value="MONTH_2">2 Months</SelectItem>
              <SelectItem value="MONTH_3">3 Months</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// Example 2: Add Work Experience Form
// ============================================================================

export const AddWorkExperienceForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { addWorkExperience, loading, error, clearError } = useProfile();
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    employmentType: 'Full-time',
    startDate: '',
    endDate: '',
    isCurrent: false,
    jobDescription: '',
    location: '',
    salary: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addWorkExperience({
        ...formData,
        employmentType: formData.employmentType as any,
        salary: formData.salary ? Number(formData.salary) : undefined,
      });
      setFormData({
        companyName: '',
        jobTitle: '',
        employmentType: 'Full-time',
        startDate: '',
        endDate: '',
        isCurrent: false,
        jobDescription: '',
        location: '',
        salary: '',
      });
      onSuccess?.();
    } catch (err) {
      console.error('Failed to add work experience:', err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add Work Experience</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Company Name"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
            <Input
              placeholder="Job Title"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              disabled={formData.isCurrent}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isCurrent"
              checked={formData.isCurrent}
              onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isCurrent">I currently work here</label>
          </div>

          <Textarea
            placeholder="Job Description"
            value={formData.jobDescription}
            onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Employment Type"
              value={formData.employmentType}
              onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
            />
            <Input
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Salary"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Experience'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// Example 3: Skills Manager
// ============================================================================

export const SkillsManager: React.FC = () => {
  const { skills, addSkill, removeSkill, loading } = useProfile();
  const [selectedSkill, setSelectedSkill] = React.useState('');
  const [proficiencyLevel, setProficiencyLevel] = React.useState('INTERMEDIATE');

  const handleAddSkill = async () => {
    if (!selectedSkill) return;
    try {
      await addSkill({
        skillId: Number(selectedSkill),
        proficiencyLevel: proficiencyLevel as any,
        yearsOfExperience: 1,
      });
      setSelectedSkill('');
    } catch (err) {
      console.error('Failed to add skill:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search skills..."
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          />
          <Select value={proficiencyLevel} onValueChange={setProficiencyLevel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BEGINNER">Beginner</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
              <SelectItem value="EXPERT">Expert</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddSkill} disabled={loading || !selectedSkill}>
            Add
          </Button>
        </div>

        <div className="space-y-2">
          <p className="font-semibold">Your Skills ({skills.length})</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id ?? skill.skillId}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>{skill.skill?.skillName ?? `Skill ${skill.skillId ?? skill.id ?? ''}`}</span>
                <button
                  onClick={() => removeSkill(skill.skillId ?? skill.id ?? 0)}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-800 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// Example 4: Company Review Submission
// ============================================================================

export const CompanyReviewForm: React.FC<{ companyId: number; onSuccess?: () => void }> = ({
  companyId,
  onSuccess,
}) => {
  const { loading, error, clearError } = useProfile();
  const [formData, setFormData] = React.useState({
    overallRating: 4,
    workLifeBalance: 4,
    salaryBenefits: 4,
    careerGrowth: 4,
    management: 4,
    culture: 4,
    reviewTitle: '',
    pros: '',
    cons: '',
    adviceToManagement: '',
    jobTitle: '',
    employmentStatus: 'Full-time',
    location: '',
    isCurrentEmployee: true,
    isAnonymous: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement using CompanyReviewApi.submitReview
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <p className="text-sm text-gray-600">Rate various aspects of the company</p>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// Example 5: Profile Progress Indicator
// ============================================================================

export const ProfileProgressIndicator: React.FC = () => {
  const { profile, workExperience, education, skills } = useProfile();
  const [completion, setCompletion] = React.useState(0);

  React.useEffect(() => {
    if (!profile) return;

    let score = 0;
    let maxScore = 10;

    // Basic info
    if (profile.firstName && profile.lastName) score += 2;
    if (profile.bio) score += 1;
    if (profile.currentLocation) score += 1;

    // Experience
    if (workExperience.length > 0) score += 2;

    // Education
    if (education.length > 0) score += 2;

    // Skills
    if (skills.length > 0) score += 2;

    setCompletion(Math.round((score / maxScore) * 100));
  }, [profile, workExperience, education, skills]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile Completion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="text-center font-semibold">{completion}% Complete</p>

          <div className="text-sm space-y-1 text-gray-600">
            <p className={profile?.firstName ? '✓ text-green-600' : ''}>
              {profile?.firstName ? '✓' : '○'} Basic Information
            </p>
            <p className={workExperience.length > 0 ? '✓ text-green-600' : ''}>
              {workExperience.length > 0 ? '✓' : '○'} Work Experience
            </p>
            <p className={education.length > 0 ? '✓ text-green-600' : ''}>
              {education.length > 0 ? '✓' : '○'} Education
            </p>
            <p className={skills.length > 0 ? '✓ text-green-600' : ''}>
              {skills.length > 0 ? '✓' : '○'} Skills
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
