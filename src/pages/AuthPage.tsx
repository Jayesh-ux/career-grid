import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const {
    register,
    verifyRegistrationOtp,
    login,
    verifyLoginOtp,
    resendOtp,
    loading,
    token,
  } = useAuth();

  // Determine which tab to show
  const defaultTab = searchParams.get('tab') || 'login';

  // Login flow
  const [loginStep, setLoginStep] = useState('credentials'); // 'credentials' or 'otp'
  const [loginPhone, setLoginPhone] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register flow
  const [registerStep, setRegisterStep] = useState('details'); // 'details' or 'otp'
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerUserType, setRegisterUserType] = useState('jobseeker');
  const [registerOtp, setRegisterOtp] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  // LOGIN HANDLERS
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter email and password');
      return;
    }

    try {
      setLoginLoading(true);
      await login({ email: loginEmail, password: loginPassword });
      // API returns OTP is needed
      setLoginPhone(''); // Will be filled from API response if available
      setLoginStep('otp');
      toast({
        title: 'OTP Sent',
        description: 'Check your phone for the OTP code',
      });
    } catch (error) {
      setLoginError(error?.message || 'Login failed. Please try again.');
      toast({
        title: 'Login Failed',
        description: error?.message || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLoginOtpSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginOtp) {
      setLoginError('Please enter OTP');
      return;
    }
    
    if (!loginPhone && !loginEmail) {
      setLoginError('Phone number or email required');
      return;
    }

    try {
      setLoginLoading(true);
      await verifyLoginOtp({ phone: loginPhone, otp: loginOtp });
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      navigate('/dashboard');
    } catch (error) {
      setLoginError(error?.message || 'OTP verification failed');
      toast({
        title: 'Verification Failed',
        description: error?.message || 'Invalid OTP',
        variant: 'destructive',
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLoginResendOtp = async () => {
    if (!loginPhone) {
      setLoginError('Phone number not found');
      return;
    }

    try {
      setLoginLoading(true);
      await resendOtp({ phone: loginPhone, purpose: 'login' });
      toast({
        title: 'OTP Resent',
        description: 'Check your phone for the new OTP code',
      });
    } catch (error) {
      setLoginError(error?.message || 'Failed to resend OTP');
    } finally {
      setLoginLoading(false);
    }
  };

  // REGISTER HANDLERS
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');

    if (!registerEmail || !registerPassword || !registerPhone || !registerName) {
      setRegisterError('Please fill in all required fields');
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters');
      return;
    }

    try {
      setRegisterLoading(true);
      await register({
        email: registerEmail,
        password: registerPassword,
        phone: registerPhone,
        userType: registerUserType,
        name: registerName,
      });
      setRegisterStep('otp');
      toast({
        title: 'Registration Initiated',
        description: 'Check your phone for the OTP code',
      });
    } catch (error) {
      setRegisterError(error?.message || 'Registration failed');
      toast({
        title: 'Registration Failed',
        description: error?.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleRegisterOtpSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');

    if (!registerOtp) {
      setRegisterError('Please enter OTP');
      return;
    }

    try {
      setRegisterLoading(true);
      await verifyRegistrationOtp({ phone: registerPhone, otp: registerOtp });
      toast({
        title: 'Success',
        description: 'Account created successfully',
      });
      navigate(registerUserType === 'jobseeker' ? '/profile-setup' : '/employer-dashboard');
    } catch (error) {
      setRegisterError(error?.message || 'OTP verification failed');
      toast({
        title: 'Verification Failed',
        description: error?.message || 'Invalid OTP',
        variant: 'destructive',
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleRegisterResendOtp = async () => {
    if (!registerPhone) {
      setRegisterError('Phone number not found');
      return;
    }

    try {
      setRegisterLoading(true);
      await resendOtp({ phone: registerPhone, purpose: 'registration' });
      toast({
        title: 'OTP Resent',
        description: 'Check your phone for the new OTP code',
      });
    } catch (error) {
      setRegisterError(error?.message || 'Failed to resend OTP');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Career Grid
          </h1>
          <p className="text-gray-600">Find your next opportunity</p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-xl border-0">
          <Tabs defaultValue={defaultTab} className="w-full">
            {/* Tab List */}
            <TabsList className="grid w-full grid-cols-2 rounded-t-lg border-b">
              <TabsTrigger value="login" className="rounded-none">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-none">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  {loginStep === 'credentials'
                    ? 'Enter your email and password to continue'
                    : 'Enter the OTP sent to your phone'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Credentials Step */}
                {loginStep === 'credentials' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {loginError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{loginError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        disabled={loginLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          disabled={loginLoading}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={loginLoading}
                    >
                      {loginLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {loginLoading ? 'Signing in...' : 'Continue'}
                    </Button>

                    <div className="text-center text-sm">
                      <button
                        type="button"
                        className="text-blue-600 hover:underline"
                        onClick={() => navigate('/forgot-password')}
                      >
                        Forgot password?
                      </button>
                    </div>
                  </form>
                )}

                {/* OTP Step */}
                {loginStep === 'otp' && (
                  <form onSubmit={handleLoginOtpSubmit} className="space-y-4">
                    {loginError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{loginError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="login-phone">Phone Number</Label>
                      <Input
                        id="login-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        disabled={loginLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-otp">OTP Code</Label>
                      <Input
                        id="login-otp"
                        type="text"
                        placeholder="000000"
                        value={loginOtp}
                        onChange={(e) => setLoginOtp(e.target.value.slice(0, 6))}
                        maxLength={6}
                        disabled={loginLoading}
                        className="text-center text-2xl tracking-widest font-mono"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={loginLoading}
                    >
                      {loginLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {loginLoading ? 'Verifying...' : 'Verify OTP'}
                    </Button>

                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        className="text-blue-600 hover:underline"
                        onClick={() => setLoginStep('credentials')}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="text-blue-600 hover:underline"
                        onClick={handleLoginResendOtp}
                        disabled={loginLoading}
                      >
                        Resend OTP
                      </button>
                    </div>
                  </form>
                )}
              </CardContent>
            </TabsContent>

            {/* REGISTER TAB */}
            <TabsContent value="register">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  {registerStep === 'details'
                    ? 'Sign up to start your career journey'
                    : 'Verify your phone number'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Details Step */}
                {registerStep === 'details' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    {registerError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{registerError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        placeholder="John Doe"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        disabled={registerLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        disabled={registerLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-phone">Phone Number</Label>
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        disabled={registerLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showRegisterPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          disabled={registerLoading}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">At least 6 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-usertype">I am a</Label>
                      <Select value={registerUserType} onValueChange={setRegisterUserType}>
                        <SelectTrigger id="register-usertype">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jobseeker">Job Seeker</SelectItem>
                          <SelectItem value="employer">Employer / Recruiter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={registerLoading}
                    >
                      {registerLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {registerLoading ? 'Creating account...' : 'Continue'}
                    </Button>
                  </form>
                )}

                {/* OTP Verification Step */}
                {registerStep === 'otp' && (
                  <form onSubmit={handleRegisterOtpSubmit} className="space-y-4">
                    {registerError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{registerError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-2">
                        We've sent an OTP to <strong>{registerPhone}</strong>
                      </p>
                      <p className="text-sm text-gray-500">Enter it below to verify your number</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-otp">OTP Code</Label>
                      <Input
                        id="register-otp"
                        type="text"
                        placeholder="000000"
                        value={registerOtp}
                        onChange={(e) => setRegisterOtp(e.target.value.slice(0, 6))}
                        maxLength={6}
                        disabled={registerLoading}
                        className="text-center text-2xl tracking-widest font-mono"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={registerLoading}
                    >
                      {registerLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {registerLoading ? 'Verifying...' : 'Complete Sign Up'}
                    </Button>

                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        className="text-blue-600 hover:underline"
                        onClick={() => setRegisterStep('details')}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="text-blue-600 hover:underline"
                        onClick={handleRegisterResendOtp}
                        disabled={registerLoading}
                      >
                        Resend OTP
                      </button>
                    </div>
                  </form>
                )}
              </CardContent>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg text-center text-xs text-gray-600">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </Card>
      </div>
    </div>
  );
}
