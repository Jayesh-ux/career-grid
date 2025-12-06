import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '@/context/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, RefreshCw, Edit, Briefcase, GraduationCap, Award, MapPin, Shield, Calendar, DollarSign, Clock, Building2, Users, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import OtpModal from '@/components/auth/OtpModal';
import { toast } from 'sonner';

// Role constants matching backend API
const ROLES = {
  JOBSEEKER: 'JOBSEEKER',
  EMPLOYER: 'EMPLOYER',
  COMPANY_ADMIN: 'COMPANY_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

export default function Dashboard() {
  const { user, updateMe, requestPhoneVerification, verifyUpdatedPhone, changePassword, deactivate, logout } = useAuth();
  const { jobseekerProfile, workExperience = [], education = [], skills = [], completionPercentage, refreshProfile } = useProfile();
  const profile = jobseekerProfile;
  const isVerified = !!(user?.isVerified ?? (user as any)?.is_verified ?? false);

  // Determine user role
  const userRole = user?.userType || '';
  const isJobseeker = userRole === ROLES.JOBSEEKER;
  const isEmployer = userRole === ROLES.EMPLOYER;
  const isAdmin = [ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN].includes(userRole);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const canSave = useMemo(() => !!form.name && !!form.email, [form.name, form.email]);

  const onSaveProfile = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await updateMe(form);
      toast.success('Profile updated');
    } catch (e) {
      toast.error(e?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const onRequestPhoneOtp = async () => {
    if (requestingOtp) return;
    setRequestingOtp(true);
    try {
      await requestPhoneVerification();
      setShowPhoneOtp(true);
      toast.success('OTP sent to phone');
    } catch (e) {
      toast.error(e?.message || 'Failed to send OTP');
    } finally {
      setRequestingOtp(false);
    }
  };

  React.useEffect(() => {
    // Auto-refresh profile on mount to ensure latest data
    if (isJobseeker && profile) {
      refreshProfile();
    }
  }, [isJobseeker, refreshProfile]);

  const onChangePassword = async () => {
    if (!pwd.currentPassword || !pwd.newPassword || changingPwd) return;
    setChangingPwd(true);
    try {
      await changePassword(pwd);
      toast.success('Password changed');
      setPwd({ currentPassword: '', newPassword: '' });
    } catch (e) {
      toast.error(e?.message || 'Change password failed');
    } finally {
      setChangingPwd(false);
    }
  };

  const onDeactivate = async () => {
    if (deactivating) return;
    const password = window.prompt('Confirm your password to deactivate');
    if (!password) return;
    setDeactivating(true);
    try {
      await deactivate({ password, reason: 'User requested' });
      toast.success('Account deactivated');
    } catch (e) {
      toast.error(e?.message || 'Deactivation failed');
    } finally {
      setDeactivating(false);
    }
  };

  const formatSalary = (amount) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {isJobseeker && `Welcome back, ${profile?.firstName || user?.name || 'User'}!`}
              {isEmployer && `Welcome, ${user?.name || 'Employer'}! Manage your company and job postings.`}
              {isAdmin && `Admin Console - ${user?.name || 'Administrator'}`}
              {!isJobseeker && !isEmployer && !isAdmin && `Welcome, ${user?.name || 'User'}!`}
            </p>
          </div>
          <Link to="/" className="inline-block">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>

        {/* Role-specific content */}
        {isJobseeker ? (
          <JobseekerDashboard
            profile={profile}
            workExperience={workExperience}
            education={education}
            skills={skills}
            completionPercentage={0}
            isVerified={isVerified}
            refreshProfile={refreshProfile}
            onRequestPhoneOtp={() => {}}
            requestingOtp={false}
            userRole={userRole}
          />
        ) : isEmployer ? (
          <EmployerDashboard user={user} />
        ) : isAdmin ? (
          <AdminDashboard user={user} />
        ) : (
          <GenericDashboard user={user} />
        )}

        {/* Common Settings Section - visible to all roles */}
        <div className="mt-8 space-y-6">
          {/* Account Settings */}
          <AccountSettingsCard
            user={user}
            onUpdateUser={updateMe}
            onRequestPhoneOtp={requestPhoneVerification}
            onVerifyPhone={verifyUpdatedPhone}
            onChangePassword={changePassword}
            onDeactivate={deactivate}
            onLogout={logout}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

/**
 * JOBSEEKER DASHBOARD
 * Displays profile, work experience, education, and skills
 */
function JobseekerDashboard({
  profile,
  workExperience,
  education,
  skills,
  completionPercentage,
  isVerified,
  refreshProfile,
  onRequestPhoneOtp,
  requestingOtp,
  userRole,
}: {
  profile: any;
  workExperience: any[];
  education: any[];
  skills: any[];
  completionPercentage: number;
  isVerified: boolean;
  refreshProfile: () => void;
  onRequestPhoneOtp: () => void;
  requestingOtp: boolean;
  userRole: string;
}) {
  const [profileCompletion, setProfileCompletion] = useState(completionPercentage);

  React.useEffect(() => {
    // Fetch completion percentage on mount
    // This would be implemented in the context
  }, []);

  const formatSalary = (amount: number | undefined) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar - Profile Card */}
      <aside className="lg:col-span-4">
        <Card className="border-0 shadow-xl bg-card overflow-hidden sticky top-4">
          <div className="h-24 bg-gradient-primary"></div>
          <CardContent className="flex flex-col items-center text-center gap-4 -mt-12 relative px-6 pb-6">
            <div className="relative">
              <Avatar className="h-28 w-28 border-4 border-border shadow-xl ring-2 ring-ring">
                {profile?.profilePicture ? (
                  <AvatarImage src={profile.profilePicture} alt={profile.firstName || 'Profile'} />
                ) : (
                  <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                    {(profile?.firstName || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-success rounded-full p-1.5 border-2 border-white shadow-lg">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="w-full">
              <h3 className="text-xl font-bold text-foreground">
                {profile?.firstName} {profile?.lastName}
              </h3>
              <div className="flex items-center justify-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile?.currentLocation || 'Location not set'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              {isVerified ? (
                <Badge className="bg-success text-success-foreground border-0 shadow-lg">
                  ✓ Verified
                </Badge>
              ) : (
                <>
                  <Badge variant="outline" className="border-border">Not verified</Badge>
                  <Button 
                    onClick={onRequestPhoneOtp} 
                    disabled={requestingOtp} 
                    size="sm" 
                    className="bg-gradient-primary hover:opacity-95 shadow-button"
                  >
                    {requestingOtp ? 'Sending…' : 'Verify Phone'}
                  </Button>
                </>
              )}
            </div>

            <div className="w-full mt-4 p-4 bg-popover rounded-xl border border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Profile Completion</p>
              <div className="w-full bg-input rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="text-right text-sm font-bold text-foreground mt-2">{profileCompletion}%</p>
            </div>

            {/* Quick Stats */}
            <div className="w-full grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <Briefcase className="w-5 h-5 mx-auto text-accent mb-1" />
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="text-sm font-bold text-foreground">{workExperience?.length || 0}</p>
              </div>
              <div className="text-center">
                <GraduationCap className="w-5 h-5 mx-auto text-accent mb-1" />
                <p className="text-xs text-muted-foreground">Education</p>
                <p className="text-sm font-bold text-foreground">{education?.length || 0}</p>
              </div>
              <div className="text-center">
                <Award className="w-5 h-5 mx-auto text-accent mb-1" />
                <p className="text-xs text-muted-foreground">Skills</p>
                <p className="text-sm font-bold text-foreground">{skills?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Right Content Area */}
      <div className="lg:col-span-8 space-y-6">
        {/* Profile Summary */}
        <Card className="border-0 shadow-xl bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {profile?.bio || 'Add a professional summary to your profile to stand out to employers'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={refreshProfile} 
                  variant="outline" 
                  className="hover:bg-accent/5 hover:border-border transition-all duration-300 group"
                >
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  Refresh
                </Button>
                <Button 
                  className="bg-gradient-primary hover:opacity-95 shadow-button"
                  onClick={() => {
                    const elementId = userRole === ROLES.JOBSEEKER ? 'profile' : 'profile';
                    window.location.hash = elementId;
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Current Salary</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatSalary(profile?.currentSalary)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Expected Salary</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatSalary(profile?.expectedSalary)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Notice Period</p>
                  <p className="text-sm font-semibold text-foreground">
                    {profile?.noticePeriod?.replace(/_/g, ' ') || 'Not specified'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Experience</p>
                  <p className="text-sm font-semibold text-foreground">
                    {profile?.totalExperienceMonths 
                      ? `${Math.floor(profile.totalExperienceMonths / 12)}y ${profile.totalExperienceMonths % 12}m`
                      : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card className="border-0 shadow-xl bg-card">
          <CardHeader className="border-b border-border">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-accent" />
                Work Experience
              </CardTitle>
              <Button size="sm" className="bg-gradient-primary">
                Add Experience
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {workExperience?.length > 0 ? (
              <div className="space-y-4">
                {workExperience.map((exp, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-lg bg-popover hover:bg-job-card transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold">
                        {exp.companyName?.charAt(0).toUpperCase() || 'C'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{exp.jobTitle}</h4>
                      <p className="text-sm text-muted-foreground">{exp.companyName}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                      {exp.jobDescription && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{exp.jobDescription}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p>No work experience added yet</p>
                <Button size="sm" variant="outline" className="mt-3">
                  Add your first experience
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="border-0 shadow-xl bg-card">
          <CardHeader className="border-b border-border">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-accent" />
                Education
              </CardTitle>
              <Button size="sm" className="bg-gradient-primary">
                Add Education
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {education?.length > 0 ? (
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-lg bg-popover hover:bg-job-card transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institutionName}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-sm text-muted-foreground">{edu.fieldOfStudy}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(edu.startDate)} - {edu.isCurrent ? 'Present' : formatDate(edu.endDate)}
                        </span>
                        {edu.percentageOrCgpa && (
                          <span className="font-semibold text-foreground">
                            {edu.percentageOrCgpa}% / CGPA
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p>No education added yet</p>
                <Button size="sm" variant="outline" className="mt-3">
                  Add your education
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="border-0 shadow-xl bg-card">
          <CardHeader className="border-b border-border">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                Skills
              </CardTitle>
              <Button size="sm" className="bg-gradient-primary">
                Add Skill
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="px-3 py-1.5 text-sm bg-popover text-foreground hover:bg-job-card"
                  >
                    {skill.skillName}
                    {skill.proficiencyLevel && (
                      <span className="ml-2 text-xs opacity-70">
                        • {skill.proficiencyLevel}
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p>No skills added yet</p>
                <Button size="sm" variant="outline" className="mt-3">
                  Add your skills
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * EMPLOYER DASHBOARD
 * Displays company profile and job posting management
 */
function EmployerDashboard({ user }: { user: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <Card className="lg:col-span-8 border-0 shadow-xl bg-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-accent" />
            Company Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Manage your company profile, job postings, and candidate applications.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button className="bg-gradient-primary">Create Job Posting</Button>
              <Button variant="outline">View Applications</Button>
              <Button variant="outline">Edit Company Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-4 border-0 shadow-xl bg-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">Active Job Postings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">Total Applications</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * ADMIN DASHBOARD
 * Displays system administration controls
 */
function AdminDashboard({ user }: { user: any }) {
  return (
    <Card className="border-0 shadow-xl bg-card">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          Administration Console
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Welcome, {user?.name}. You have administrative access to the system.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="justify-start">
              <Building2 className="w-4 h-4 mr-2" />
              Manage Companies
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Review Content
            </Button>
            <Button variant="outline" className="justify-start">
              <Award className="w-4 h-4 mr-2" />
              System Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * GENERIC DASHBOARD
 * Fallback for unrecognized roles
 */
function GenericDashboard({ user }: { user: any }) {
  return (
    <Card className="border-0 shadow-xl bg-card">
      <CardContent className="p-6">
        <p className="text-muted-foreground">
          Welcome, {user?.name}! Your role is {user?.userType}. Dashboard features are being customized for your role.
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * ACCOUNT SETTINGS CARD
 * Common to all roles - password change, phone verification, account deactivation
 */
function AccountSettingsCard({
  user,
  onUpdateUser,
  onRequestPhoneOtp,
  onVerifyPhone,
  onChangePassword,
  onDeactivate,
  onLogout,
}: {
  user: any;
  onUpdateUser: (data: any) => Promise<void>;
  onRequestPhoneOtp: () => Promise<void>;
  onVerifyPhone: (data: any) => Promise<void>;
  onChangePassword: (data: any) => Promise<void>;
  onDeactivate: (data: any) => Promise<void>;
  onLogout: () => void;
}) {
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '' });
  const [changingPwd, setChangingPwd] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);

  const onChangePasswordClick = async () => {
    if (!pwd.currentPassword || !pwd.newPassword || changingPwd) return;
    setChangingPwd(true);
    try {
      await onChangePassword(pwd);
      toast.success('Password changed');
      setPwd({ currentPassword: '', newPassword: '' });
    } catch (e: any) {
      toast.error(e?.message || 'Change password failed');
    } finally {
      setChangingPwd(false);
    }
  };

  const onDeactivateClick = async () => {
    if (deactivating) return;
    const password = window.prompt('Confirm your password to deactivate');
    if (!password) return;
    setDeactivating(true);
    try {
      await onDeactivate({ password, reason: 'User requested' });
      toast.success('Account deactivated');
    } catch (e: any) {
      toast.error(e?.message || 'Deactivation failed');
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <>
      {/* Change Password */}
      <Card className="border-0 shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-3 w-full">
            <Input 
              type="password" 
              placeholder="Current password" 
              value={pwd.currentPassword} 
              onChange={e => setPwd({ ...pwd, currentPassword: e.target.value })} 
            />
            <Input 
              type="password" 
              placeholder="New password" 
              value={pwd.newPassword} 
              onChange={e => setPwd({ ...pwd, newPassword: e.target.value })} 
            />
            <Button
              className="bg-gradient-primary shadow-button"
              onClick={onChangePasswordClick}
              disabled={!pwd.currentPassword || !pwd.newPassword || changingPwd}
            >
              {changingPwd ? 'Changing…' : 'Change Password'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card className="border-0 shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Security</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Button 
              variant="destructive" 
              onClick={onDeactivateClick} 
              disabled={deactivating}
            >
              {deactivating ? 'Deactivating…' : 'Deactivate Account'}
            </Button>
            <Button variant="secondary" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
