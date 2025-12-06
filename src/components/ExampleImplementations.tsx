import React, { useState } from 'react';
import { useCurrentUser, useLogin, useVerifyLoginOtp } from '@/hooks/useUserApi';
import {
  useMyJobseekerProfile,
  useCreateJobseekerProfile,
  useMySkills,
  useAddSkill,
  useAllSkills,
} from '@/hooks/useProfileApi';
import {
  useSearchJobs,
  useSaveJob,
  useApplyToJob,
  useMyApplications,
} from '@/hooks/useJobApi';
import { CreateJobseekerProfileRequest } from '@/api/types/profile';

/**
 * ========================================
 * EXAMPLE: LOGIN FLOW
 * ========================================
 */
export function LoginExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('login'); // 'login' | 'otp'

  const { mutate: login, isPending: isLoggingIn, error: loginError } = useLogin();
  const { mutate: verify, isPending: isVerifying, error: verifyError } = useVerifyLoginOtp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email, password },
      {
        onSuccess: () => {
          setStep('otp');
        },
      }
    );
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    verify(
      { phone, otp },
      {
        onSuccess: () => {
          // Will redirect or update auth context
          window.location.href = '/dashboard';
        },
      }
    );
  };

  return (
    <div className="login-container">
      {step === 'login' ? (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>
          {loginError && <p className="error">{loginError.message}</p>}
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <h2>Verify OTP</h2>
          <p>OTP has been sent to your phone</p>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            required
          />
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit OTP"
            required
          />
          <button type="submit" disabled={isVerifying}>
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>
          {verifyError && <p className="error">{verifyError.message}</p>}
        </form>
      )}
    </div>
  );
}

/**
 * ========================================
 * EXAMPLE: PROFILE SETUP
 * ========================================
 */
export function ProfileSetupExample() {
  const { data: user } = useCurrentUser();
  const { data: profile } = useMyJobseekerProfile();
  const { mutate: createProfile, isPending } = useCreateJobseekerProfile();

  const [formData, setFormData] = useState<CreateJobseekerProfileRequest>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    currentLocation: '',
    preferredLocation: '',
    bio: '',
    totalExperienceMonths: 0,
    noticePeriod: 'MONTH_1',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalExperienceMonths' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProfile(formData);
  };

  if (profile) {
    return (
      <div>
        <h2>Your Profile</h2>
        <p>
          {profile.firstName} {profile.lastName}
        </p>
        <p>Location: {profile.currentLocation}</p>
        <p>Experience: {profile.totalExperienceMonths} months</p>
        <p>Profile Complete: {profile.isProfileComplete ? '✓' : 'Incomplete'}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h2>Complete Your Profile</h2>

      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Current Location</label>
        <input
          type="text"
          name="currentLocation"
          value={formData.currentLocation}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Total Experience (months)</label>
        <input
          type="number"
          name="totalExperienceMonths"
          value={formData.totalExperienceMonths}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Notice Period</label>
        <select name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange}>
          <option value="IMMEDIATE">Immediate</option>
          <option value="DAYS_15">15 Days</option>
          <option value="MONTH_1">1 Month</option>
          <option value="MONTH_2">2 Months</option>
          <option value="MONTH_3">3 Months</option>
        </select>
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating Profile...' : 'Create Profile'}
      </button>
    </form>
  );
}

/**
 * ========================================
 * EXAMPLE: JOB SEARCH & APPLICATION
 * ========================================
 */
export function JobSearchExample() {
  const [searchCriteria, setSearchCriteria] = useState({
    jobTitle: '',
    location: '',
    page: 0,
    size: 10,
  });

  const { data: results, isLoading } = useSearchJobs(searchCriteria);
  const { mutate: saveJob } = useSaveJob();
  const { mutate: applyJob, isPending: isApplying } = useApplyToJob();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchCriteria((prev) => ({ ...prev, page: 0 }));
  };

  const handleSaveJob = (jobId: number) => {
    saveJob(jobId, {
      onSuccess: () => {
        // Show success toast
      },
    });
  };

  const handleApplyJob = (jobId: number) => {
    applyJob(
      {
        jobId,
        data: {
          coverLetter: 'I am interested in this position...',
        },
      },
      {
        onSuccess: () => {
          // Show success toast
        },
      }
    );
  };

  return (
    <div className="job-search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Job Title"
          value={searchCriteria.jobTitle}
          onChange={(e) => setSearchCriteria((prev) => ({ ...prev, jobTitle: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Location"
          value={searchCriteria.location}
          onChange={(e) => setSearchCriteria((prev) => ({ ...prev, location: e.target.value }))}
        />
        <button type="submit">Search</button>
      </form>

      {isLoading && <p>Loading jobs...</p>}

      <div className="job-listings">
        {results?.content?.map((job) => (
          <div key={job.jobId} className="job-card">
            <h3>{job.jobTitle}</h3>
            <p>{job.companyName}</p>
            <p>{job.jobLocation}</p>
            <p className="salary">
              ${job.minSalary?.toLocaleString()} - ${job.maxSalary?.toLocaleString()}
            </p>

            <div className="job-actions">
              <button onClick={() => handleSaveJob(job.jobId)} className="btn-secondary">
                Save Job
              </button>
              <button
                onClick={() => handleApplyJob(job.jobId)}
                disabled={isApplying}
                className="btn-primary"
              >
                {isApplying ? 'Applying...' : 'Apply Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setSearchCriteria((prev) => ({ ...prev, page: prev.page - 1 }))}
          disabled={searchCriteria.page === 0}
        >
          Previous
        </button>
        <span>Page {searchCriteria.page + 1}</span>
        <button
          onClick={() => setSearchCriteria((prev) => ({ ...prev, page: prev.page + 1 }))}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/**
 * ========================================
 * EXAMPLE: APPLICATION TRACKING
 * ========================================
 */
export function ApplicationTrackingExample() {
  const { data: applications, isLoading } = useMyApplications(0, 20);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      APPLIED: '#3b82f6',
      SHORTLISTED: '#8b5cf6',
      INTERVIEW_SCHEDULED: '#f59e0b',
      REJECTED: '#ef4444',
      HIRED: '#10b981',
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="applications">
      <h2>My Applications</h2>

      {isLoading && <p>Loading applications...</p>}

      {applications?.content?.length === 0 && <p>No applications yet</p>}

      <div className="applications-list">
        {applications?.content?.map((app) => (
          <div
            key={app.applicationId}
            className="application-card"
            style={{ borderLeft: `4px solid ${getStatusColor(app.applicationStatus)}` }}
          >
            <div className="app-header">
              <h3>{app.jobTitle}</h3>
              <span className="status">{app.applicationStatus}</span>
            </div>

            <p className="company">{app.companyName}</p>
            <p className="location">{app.jobLocation}</p>

            <div className="app-details">
              <p className="applied-date">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
              {app.ratingByEmployer && (
                <p className="rating">Rating: {app.ratingByEmployer}/5</p>
              )}
            </div>

            <button className="btn-secondary">View Details</button>
          </div>
        ))}
      </div>

      <div className="stats">
        <div className="stat">
          <strong>{applications?.totalElements || 0}</strong>
          <span>Total Applications</span>
        </div>
      </div>
    </div>
  );
}

/**
 * ========================================
 * EXAMPLE: SKILL MANAGEMENT
 * ========================================
 */
export function SkillManagementExample() {
  const { data: mySkills } = useMySkills();
  const { data: allSkills } = useAllSkills();
  const { mutate: addSkill, isPending } = useAddSkill();
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [proficiencyLevel, setProficiencyLevel] = useState('INTERMEDIATE');

  const handleAddSkill = () => {
    if (selectedSkillId) {
      addSkill({
        skillId: parseInt(selectedSkillId),
        proficiencyLevel: proficiencyLevel as any,
        yearsOfExperience: 0,
      });
      setSelectedSkillId('');
    }
  };

  return (
    <div className="skills-management">
      <h2>My Skills</h2>

      <div className="add-skill">
        <select
          value={selectedSkillId}
          onChange={(e) => setSelectedSkillId(e.target.value)}
        >
          <option value="">Select a skill</option>
          {allSkills?.map((skill) => (
            <option key={skill.skillId} value={skill.skillId}>
              {skill.skillName}
            </option>
          ))}
        </select>

        <select
          value={proficiencyLevel}
          onChange={(e) => setProficiencyLevel(e.target.value)}
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
          <option value="EXPERT">Expert</option>
        </select>

        <button onClick={handleAddSkill} disabled={isPending}>
          {isPending ? 'Adding...' : 'Add Skill'}
        </button>
      </div>

      <div className="skills-list">
        {mySkills?.map((skill) => (
          <div key={skill.id} className="skill-badge">
            <span className="skill-name">{skill.skillName}</span>
            <span className="skill-level">{skill.proficiencyLevel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default {
  LoginExample,
  ProfileSetupExample,
  JobSearchExample,
  ApplicationTrackingExample,
  SkillManagementExample,
};
