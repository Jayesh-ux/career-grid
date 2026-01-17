import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, Briefcase, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import OtpModal from "./auth/OtpModal";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dialog open states
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Forms
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    userType: "JOBSEEKER" as const,
  });

  // OTP tracking
  const [otpPurpose, setOtpPurpose] = useState<'login' | 'registration'>('login');
  const [pendingPhone, setPendingPhone] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, initiateLogin, initiateRegister, verifyOtp, logout, isLoading } = useAuth();

  // phone regex per OpenAPI: ^(\+91)?[6-9][0-9]{9}$
  const phoneRegex = /^(\+91)?[6-9][0-9]{9}$/;

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Find Jobs", path: "/find-jobs", icon: Search },
    { name: "Companies", path: "/companies", icon: Building },
    { name: "Post a Job", path: "/post-job", icon: Briefcase },
  ];

  // ---------- AUTH / FORM HANDLERS ----------

  async function onLoginSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const phone = await initiateLogin(loginForm.email, loginForm.password);
      setPendingPhone(phone || loginForm.email);
      setOtpPurpose('login');
      setLoginOpen(false);
      setShowOtpModal(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Login failed");
    }
  }

  async function onRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!registerForm.email || !registerForm.password) {
      toast.error("Email and password are required");
      return;
    }

    if (!registerForm.phone || !phoneRegex.test(registerForm.phone)) {
      toast.error("Phone must be a valid Indian number, e.g. +919876543210 or 9876543210");
      return;
    }

    try {
      await initiateRegister({
        email: registerForm.email,
        password: registerForm.password,
        phone: registerForm.phone,
        userType: registerForm.userType,
        name: registerForm.name,
      });

      setPendingPhone(registerForm.phone);
      setOtpPurpose('registration');
      setRegisterOpen(false);
      setShowOtpModal(true);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || "Registration failed";
      console.error('Registration error:', err);
      toast.error(errorMsg);
    }
  }

  async function handleVerifyOtp(otp: string) {
    try {
      await verifyOtp(pendingPhone, otp, otpPurpose);
      setShowOtpModal(false);
      toast.success(otpPurpose === 'login' ? 'Login successful!' : 'Registration completed!');

      // Reset forms
      setLoginForm({ email: "", password: "" });
      setRegisterForm({ email: "", password: "", name: "", phone: "", userType: "JOBSEEKER" });
      setPendingPhone("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'OTP verification failed');
      throw err;
    }
  }

  function onLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white dark:bg-[#0a0a0a] text-black dark:text-white backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CareerGrid</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm ${
                  isActive(item.path) ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions - auth aware */}
          <div className="hidden md:flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Button onClick={() => setLoginOpen(true)}>Sign in</Button>
                <Button variant="outline" onClick={() => setRegisterOpen(true)}>Register</Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                    </div>
                    {user?.name && <span className="text-sm font-medium">{user.name}</span>}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="bg-black text-white border border-white/10 shadow-xl rounded-lg">
                  <DropdownMenuLabel className="text-white/80">
                    <Link to="/dashboard" className="block text-white/80">Account</Link>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="text-white hover:bg-white/10">My Profile & Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout} className="text-red-400 hover:bg-red-900/30">Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/40 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path) ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}

              <div className="flex items-center justify-between pt-4 border-t border-border/40 space-x-2">
                {!isAuthenticated ? (
                  <>
                    <Button className="w-full" onClick={() => { setLoginOpen(true); setIsMobileMenuOpen(false); }}>Sign in</Button>
                    <Button variant="secondary" className="w-full" onClick={() => { setRegisterOpen(true); setIsMobileMenuOpen(false); }}>Register</Button>
                  </>
                ) : (
                  <div className="flex w-full items-center gap-3">
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <Button variant="secondary" className="w-full">Profile</Button>
                    </Link>
                    <Button variant="ghost" className="w-full" onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}>Logout</Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* ---------------- LOGIN DIALOG ---------------- */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="bg-white dark:bg-[#0a0a0a] text-black dark:text-white [&>button]:hidden">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Sign in</DialogTitle>
            <button type="button" onClick={() => setLoginOpen(false)} aria-label="Close login dialog">
              <X className="h-5 w-5" />
            </button>
          </DialogHeader>
          <DialogDescription className="text-xs text-muted-foreground mb-4">
            Enter your credentials to continue
          </DialogDescription>

          <form onSubmit={onLoginSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Email</label>
              <Input
                placeholder="you@example.com"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Password</label>
              <Input
                placeholder="••••••••"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <button type="button" className="text-xs underline text-muted-foreground">
                Forgot password?
              </button>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Please wait..." : "Continue to OTP"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ---------------- REGISTER DIALOG ---------------- */}
      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent className="bg-white dark:bg-[#0a0a0a] text-black dark:text-white [&>button]:hidden">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Create account</DialogTitle>
            <button type="button" onClick={() => setRegisterOpen(false)} aria-label="Close register dialog">
              <X className="h-5 w-5" />
            </button>
          </DialogHeader>
          <DialogDescription className="text-xs text-muted-foreground mb-4">
            Fill in your details to create a new account
          </DialogDescription>

          <form onSubmit={onRegisterSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Full name</label>
              <Input
                placeholder="John Doe"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Email</label>
              <Input
                placeholder="you@example.com"
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Phone</label>
              <Input
                placeholder="9876543210"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">We will send a 6-digit code to verify your account.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Role</label>
              <Select value={registerForm.userType} onValueChange={(value: any) => setRegisterForm({ ...registerForm, userType: value })}>
                <SelectTrigger className="w-full h-10 rounded-md border border-white/20 bg-[#0b0b0b] text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-[#0b0b0b] text-white border border-white/20 rounded-md shadow-xl">
                  <SelectItem value="JOBSEEKER" className="hover:bg-white/10">Jobseeker</SelectItem>
                  <SelectItem value="EMPLOYER" className="hover:bg-white/10">Employer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Password</label>
              <Input
                placeholder="••••••••"
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create account"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ---------------- OTP MODAL (Shared for Login & Register) ---------------- */}
<OtpModal
  open={showOtpModal}
  onClose={() => setShowOtpModal(false)}
  onSubmit={handleVerifyOtp}
  title={otpPurpose === 'login' ? 'Verify Login OTP' : 'Verify Registration OTP'}
/>

    </header>
  );
}
