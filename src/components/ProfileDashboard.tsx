import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import OtpModal from '@/components/auth/OtpModal';
import { Home, RefreshCw, Edit, Briefcase, GraduationCap, Award, MapPin, Shield } from 'lucide-react';

export interface ProfileDashboardProps { embedded?: boolean }

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ embedded = false }) => {
  const navigate = useNavigate();
  const {
    profile,
    workExperience = [],
    education = [],
    skills = [],
    loading,
    error,
    getProfileCompletion,
    refreshProfile,
    clearError,
  } = useProfile();
  const { user, requestPhoneVerification, verifyUpdatedPhone, loading: authLoading } = useAuth();
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [verifying, setVerifying] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);

  const isVerified = !!(user?.isVerified ?? (user as any)?.is_verified ?? false);

  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const result = await getProfileCompletion();
        if (result) setCompletionPercentage(result.completionPercentage);
      } catch (err) {
        console.error('Failed to fetch completion:', err);
      }
    };
    fetchCompletion();
  }, []);

  const { toast } = useToast();

  const onRequestPhoneOtp = async () => {
    if (verifying) return;
    setVerifying(true);
    try {
      await requestPhoneVerification();
      setShowPhoneOtp(true);
      toast({ title: 'OTP sent', description: 'OTP sent to your phone. Enter the code to complete verification.' });
    } catch (err: any) {
      toast({ title: 'Failed to send OTP', description: err?.message || 'Failed to send verification OTP', variant: 'destructive' });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className={embedded ? 'w-full' : 'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}>
      {!embedded && (
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost"
              className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
            >
              <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Back to Home
            </Button>
          </div>
        </div>
      )}
      
      <div className={embedded ? 'w-full' : 'container mx-auto px-4 py-8'}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Enhanced Profile Card */}
          <aside className="lg:col-span-1">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
              <CardContent className="flex flex-col items-center text-center gap-4 -mt-12 relative">
                <div className="relative">
                  <Avatar className="h-28 w-28 border-4 border-white shadow-xl ring-2 ring-blue-100">
                    {profile?.profilePicture ? (
                      <AvatarImage src={profile.profilePicture} alt={profile.firstName || 'Profile'} />
                    ) : (
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        {(profile?.firstName || user?.name || 'U').charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white shadow-lg">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="w-full">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    {profile?.firstName} {profile?.lastName}
                  </h3>
                  <div className="flex items-center justify-center gap-1 mt-1 text-sm text-slate-600">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{profile?.currentLocation || 'Location not set'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {authLoading ? (
                    <span className="text-sm text-slate-600">Loading...</span>
                  ) : !user ? (
                    <span className="text-sm text-slate-600">Sign in to verify</span>
                  ) : isVerified ? (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
                      ✓ Verified
                    </Badge>
                  ) : (
                    <>
                      <Badge variant="outline" className="border-slate-300">Not verified</Badge>
                      <Button 
                        onClick={onRequestPhoneOtp} 
                        aria-busy={verifying} 
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                      >
                        {verifying ? 'Sending…' : 'Verify Phone'}
                      </Button>
                    </>
                  )}
                </div>

                <div className="w-full mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Profile Completion</p>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-inner"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  <p className="text-right text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                    {completionPercentage}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            {/* Header Section */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                      {profile?.firstName} {profile?.lastName}
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                      {profile?.bio || 'Add a professional summary to your profile'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={refreshProfile} 
                      variant="outline"
                      className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group"
                    >
                      <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      Refresh
                    </Button>
                    <Button 
                      onClick={() => {/* navigate to edit profile */}}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card className="border-0 shadow-xl bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Work Experience ({workExperience.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {workExperience.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500">No work experience added yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {workExperience.map((exp, idx) => (
                      <div 
                        key={exp.experienceId} 
                        className="relative pl-6 pb-6 border-l-2 border-blue-200 hover:border-blue-400 transition-colors duration-300 last:pb-0"
                      >
                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 border-2 border-white shadow-md"></div>
                        <h4 className="font-bold text-lg text-slate-900">{exp.jobTitle}</h4>
                        <p className="text-blue-600 font-semibold">{exp.companyName}</p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <span>{exp.startDate}</span>
                          <span>→</span>
                          <span>{exp.isCurrent ? 'Present' : exp.endDate}</span>
                        </p>
                        {exp.jobDescription && (
                          <p className="mt-3 text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg">
                            {exp.jobDescription}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Education & Skills Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Education */}
              <Card className="border-0 shadow-xl bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                    Education ({education.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {education.length === 0 ? (
                    <div className="text-center py-8">
                      <GraduationCap className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500">No education added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {education.map((edu) => (
                        <div 
                          key={edu.educationId} 
                          className="relative pl-5 border-l-4 border-green-400 hover:border-green-500 transition-colors duration-300 py-2"
                        >
                          <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                          <p className="text-sm text-green-600 font-semibold">{edu.institutionName}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {edu.fieldOfStudy} • CGPA: {edu.percentageOrCgpa}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="border-0 shadow-xl bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Award className="w-5 h-5 text-purple-600" />
                    Skills ({skills.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {skills.length === 0 ? (
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500">No skills added yet</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span 
                          key={skill.id} 
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 shadow-sm hover:shadow-md cursor-default"
                        >
                          {skill.skillName}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      <OtpModal
        open={showPhoneOtp}
        onClose={() => setShowPhoneOtp(false)}
        onSubmit={async (otp) => {
          try {
            await verifyUpdatedPhone({ otp });
            setShowPhoneOtp(false);
            toast({ title: 'Phone verified' });
          } catch (e: any) {
            toast({ title: 'Verification failed', description: e?.message || 'Verification failed', variant: 'destructive' });
          }
        }}
        title="Verify Updated Phone"
      />
    </div>
  );
};

export default ProfileDashboard;