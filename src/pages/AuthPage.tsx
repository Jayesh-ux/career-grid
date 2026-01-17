import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import  OtpModal  from '@/components/auth/OtpModal';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { showToast } from '@/components/Toast';
import { Briefcase, User, Mail, Lock, Phone, Loader2 } from 'lucide-react';

type UserType = 'JOBSEEKER' | 'EMPLOYER';

interface LocationState {
  from?: { pathname: string };
}

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { initiateLogin, initiateRegister, verifyOtp, isLoading } = useAuth();

  // Form states
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerUserType, setRegisterUserType] = useState<UserType>('JOBSEEKER');

  // OTP Modal states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpPurpose, setOtpPurpose] = useState<'login' | 'registration'>('login');

  // Forgot Password Modal
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Get redirect path
  const from = (location.state as LocationState)?.from?.pathname || '/dashboard';

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setShowOtpModal(false);
    showToast.success('Authentication successful!');
    navigate(from, { replace: true });
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      showToast.error('Please fill in all fields');
      return;
    }

    try {
      const phone = await initiateLogin(loginEmail, loginPassword);
      setOtpPhone(phone);
      setOtpPurpose('login');
      setShowOtpModal(true);
      showToast.success('OTP sent to your registered phone');
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Login failed');
    }
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!registerName || !registerEmail || !registerPassword || !registerPhone) {
      showToast.error('Please fill in all fields');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      showToast.error('Passwords do not match');
      return;
    }

    if (registerPassword.length < 8) {
      showToast.error('Password must be at least 8 characters');
      return;
    }

    // Validate Indian phone number (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(registerPhone)) {
      showToast.error('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    try {
      await initiateRegister({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        phone: registerPhone,
        userType: registerUserType,
      });
      setOtpPhone(registerPhone);
      setOtpPurpose('registration');
      setShowOtpModal(true);
      showToast.success('OTP sent to your phone. Please verify to complete registration.');
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  // OTP verification handler
  const handleVerifyOtp = async (otp: string) => {
    try {
      await verifyOtp(otpPhone, otp, otpPurpose);
      handleAuthSuccess();
    } catch (error: any) {
      throw error; // Re-throw to let OtpModal handle the error display
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to CareerGrid</CardTitle>
          <CardDescription>
            {activeTab === 'login'
              ? 'Sign in to your account to continue'
              : 'Create an account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 text-sm"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER TAB */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="9876543210"
                      className="pl-10"
                      maxLength={10}
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value.replace(/\D/g, ''))}
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">10-digit Indian mobile number</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-usertype">I am a</Label>
                  <Select
                    value={registerUserType}
                    onValueChange={(v) => setRegisterUserType(v as UserType)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JOBSEEKER">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Job Seeker
                        </div>
                      </SelectItem>
                      <SelectItem value="EMPLOYER">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Employer
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* OTP Modal */}
      <OtpModal
  open={showOtpModal}
  onClose={() => setShowOtpModal(false)}
  onSubmit={handleVerifyOtp}
  title={otpPurpose === 'login' ? 'Verify Login OTP' : 'Verify Registration OTP'}
/>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSuccess={() => {
          setShowForgotPassword(false);
          showToast.success('Password reset successful! Please login with your new password.');
        }}
      />
    </div>
  );
}
