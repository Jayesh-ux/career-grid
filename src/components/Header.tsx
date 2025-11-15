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

/**
 * Full Header component with:
 * - Inline OTP for login/register
 * - Dark-themed (black) dropdown/select using ShadCN Select
 * - Dialogs and header fixed for readable dark/light
 * - No double close icons (hides built-in close)
 *
 * Drop-in replacement for your Header.tsx
 */

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dialog open states
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Forms
  const [loginForm, setLoginForm] = useState({ email: "", password: "", phone: "" });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    userType: "JOBSEEKER",
  });

  // OTP inline controls
  const [showLoginOtp, setShowLoginOtp] = useState(false);
  const [showRegOtp, setShowRegOtp] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");
  const [regOtp, setRegOtp] = useState("");

  // loading states
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginOtpLoading, setLoginOtpLoading] = useState(false);
  const [regOtpLoading, setRegOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { token, user, login, verifyLoginOtp, register, verifyRegistrationOtp, resendOtp, logout } = useAuth();

  // phone regex per OpenAPI: ^(\+91)?[6-9][0-9]{9}$
  const phoneRegex = /^(\+91)?[6-9][0-9]{9}$/;

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Find Jobs", path: "/find-jobs", icon: Search },
    { name: "Companies", path: "/companies", icon: Building },
    { name: "Post a Job", path: "/post-job", icon: Briefcase },
  ];

  const publicRoles = ["JOBSEEKER", "EMPLOYER"]; // only expose safe roles publicly

  // ---------- AUTH / FORM HANDLERS ----------

  async function onLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loginLoading) return;
    setLoginLoading(true);
    try {
      await login({ email: loginForm.email, password: loginForm.password });
      setShowLoginOtp(true);
      toast.success("OTP sent to phone");
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  }

  async function onRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (registerLoading) return;

    if (!registerForm.email || !registerForm.password) {
      toast.message("Email and password are required");
      return;
    }

    // Validate phone if provided
    if (registerForm.phone && !phoneRegex.test(registerForm.phone)) {
      toast.message("Phone must be a valid Indian number, e.g. +919876543210 or 9876543210");
      return;
    }

    // Validate role selected is allowed
    if (!publicRoles.includes(registerForm.userType)) {
      toast.error("Selected role is not allowed for public registration");
      return;
    }

    setRegisterLoading(true);
    try {
      await register({
        email: registerForm.email,
        password: registerForm.password,
        phone: registerForm.phone,
        userType: registerForm.userType.toUpperCase(),
        name: registerForm.name,
      });
      setShowRegOtp(true);
      toast.success("OTP sent to phone");
    } catch (err: any) {
      // Show detailed error from backend if available
      const errorMsg = err?.payload?.message || err?.message || "Registration failed";
      console.error('Registration error:', err);
      toast.error(errorMsg);
    } finally {
      setRegisterLoading(false);
    }
  }

  async function handleVerifyLoginOtp() {
    if (loginOtpLoading) return;
    const phone = loginForm.phone || "";
    if (!phone) {
      toast.message("Enter your phone in the login form");
      return;
    }
    if (!loginOtp || loginOtp.length !== 6) {
      toast.message("Enter the 6-digit OTP");
      return;
    }

    setLoginOtpLoading(true);
    try {
      await verifyLoginOtp({ phone, otp: loginOtp });
      setShowLoginOtp(false);
      setLoginOpen(false);
      setLoginOtp("");
      toast.success("Login successful");
    } catch (err: any) {
      toast.error(err?.message || "OTP verification failed");
    } finally {
      setLoginOtpLoading(false);
    }
  }

  async function handleVerifyRegOtp() {
    if (regOtpLoading) return;
    const phone = registerForm.phone || "";
    if (!phone) {
      toast.message("Enter your phone in the register form");
      return;
    }
    if (!regOtp || regOtp.length !== 6) {
      toast.message("Enter the 6-digit OTP");
      return;
    }

    setRegOtpLoading(true);
    try {
      await verifyRegistrationOtp({ phone, otp: regOtp });
      setShowRegOtp(false);
      setRegisterOpen(false);
      setRegOtp("");
      toast.success("Registration completed");
    } catch (err: any) {
      toast.error(err?.message || "OTP verification failed");
    } finally {
      setRegOtpLoading(false);
    }
  }

  async function handleResendOtp(purpose: "login" | "registration") {
    if (resendLoading) return;
    const phone = purpose === "login" ? loginForm.phone || "" : registerForm.phone || "";
    if (!phone) {
      toast.message("Enter your phone first");
      return;
    }
    if (!phoneRegex.test(phone)) {
      toast.message("Phone must be valid before resending OTP");
      return;
    }
    setResendLoading(true);
    try {
      await resendOtp({ phone, purpose });
      toast.success("OTP resent");
    } catch (err: any) {
      toast.error(err?.message || "Resend failed");
    } finally {
      setResendLoading(false);
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
            {!token ? (
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

                {/* Black themed dropdown content */}
                <DropdownMenuContent align="end" className="bg-black text-white border border-white/10 shadow-xl rounded-lg">
                  <DropdownMenuLabel className="text-white/80">
                    <Link to="/dashboard" className="block text-white/80">Account</Link>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => navigate("/dashboard#profile")} className="text-white hover:bg-white/10">My Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard#settings")} className="text-white hover:bg-white/10">Settings</DropdownMenuItem>
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
                {!token ? (
                  <>
                    <Button className="w-full" onClick={() => { setLoginOpen(true); setIsMobileMenuOpen(false); }}>Sign in</Button>
                    <Button variant="secondary" className="w-full" onClick={() => { setRegisterOpen(true); setIsMobileMenuOpen(false); }}>Register</Button>
                  </>
                ) : (
                  <div className="flex w-full items-center gap-3">
                    <Link to="/dashboard#profile" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <Button variant="secondary" className="w-full">Profile</Button>
                    </Link>
                    <Link to="/dashboard#settings" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <Button variant="secondary" className="w-full">Settings</Button>
                    </Link>
                    <Button variant="ghost" className="w-full" onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}>Logout</Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* ---------------- LOGIN DIALOG (inline OTP) ---------------- */}
      <Dialog open={loginOpen} onOpenChange={(open) => {
        setLoginOpen(open);
        // Don't reset states when closing - user might want to reopen and continue
        // Only reset loading states to prevent stuck buttons
        if (!open) {
          setLoginLoading(false);
          setLoginOtpLoading(false);
          setResendLoading(false);
        }
      }}>
        {/* hide built-in close button via [&>button]:hidden, set dark bg/text */}
        <DialogContent
          className="bg-white dark:bg-[#0a0a0a] text-black dark:text-white [&>button]:hidden"
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Sign in</DialogTitle>
            {/* custom close button (only one) */}
            <button type="button" onClick={() => setLoginOpen(false)} aria-label="Close login dialog">
              <X className="h-5 w-5" />
            </button>
          </DialogHeader>
          <DialogDescription className="text-xs text-muted-foreground mb-4">
            Enter your email and password to sign in
          </DialogDescription>

          {!showLoginOtp ? (
            <form onSubmit={onLoginSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Email</label>
                <Input placeholder="you@example.com" type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Password</label>
                <Input placeholder="••••••••" type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Phone (for OTP)</label>
                <Input placeholder="9876543210" value={loginForm.phone} onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })} />
                <p className="text-xs text-muted-foreground">We will send a 6-digit code to this number.</p>
              </div>

              <div className="flex items-center justify-between">
                <button type="button" className="text-xs underline text-muted-foreground" onClick={() => { setLoginOpen(false); setRegisterOpen(false); }}>
                  Forgot password?
                </button>

                <Button type="submit" disabled={loginLoading} className={loginLoading ? "pointer-events-none opacity-80" : ""}>
                  {loginLoading ? "Please wait..." : "Continue"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Enter the 6-digit OTP sent to {loginForm.phone || "your phone"}.</p>

              <Input placeholder="123456" value={loginOtp} onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} maxLength={6} inputMode="numeric" />

              <div className="flex items-center gap-2 flex-wrap">
                <Button onClick={handleVerifyLoginOtp} disabled={loginOtpLoading}>{loginOtpLoading ? "Verifying..." : "Verify OTP"}</Button>
                <Button variant="outline" onClick={() => handleResendOtp("login")} disabled={resendLoading}>{resendLoading ? "Resending..." : "Resend OTP"}</Button>
                <Button variant="ghost" onClick={() => {
                  setShowLoginOtp(false);
                  setLoginOtp("");
                }}>Start Over</Button>
              </div>

              <p className="text-xs text-muted-foreground">If you need to change your credentials, click "Start Over". Otherwise, you can close and reopen this dialog to continue entering your OTP.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ---------------- REGISTER DIALOG (inline OTP) ---------------- */}
      <Dialog open={registerOpen} onOpenChange={(open) => {
        setRegisterOpen(open);
        // Don't reset states when closing - user might want to reopen and continue
        // Only reset loading states to prevent stuck buttons
        if (!open) {
          setRegisterLoading(false);
          setRegOtpLoading(false);
          setResendLoading(false);
        }
      }}>
        <DialogContent
          className="bg-white dark:bg-[#0a0a0a] text-black dark:text-white [&>button]:hidden"
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Create account</DialogTitle>
            <button type="button" onClick={() => setRegisterOpen(false)} aria-label="Close register dialog">
              <X className="h-5 w-5" />
            </button>
          </DialogHeader>
          <DialogDescription className="text-xs text-muted-foreground mb-4">
            Fill in your details to create a new account
          </DialogDescription>

          {!showRegOtp ? (
            <form onSubmit={onRegisterSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Full name</label>
                <Input placeholder="John Doe" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Email</label>
                <Input placeholder="you@example.com" type="email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Phone</label>
                <Input placeholder="9876543210" value={registerForm.phone} onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} />
                <p className="text-xs text-muted-foreground">We will send a 6-digit code to this number to verify your account.</p>
              </div>

              {/* ===== Replaced native <select> with ShadCN Select (dark themed) ===== */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Role</label>

                <Select value={registerForm.userType} onValueChange={(value) => setRegisterForm({ ...registerForm, userType: value })}>
                  <SelectTrigger className="w-full h-10 rounded-md border border-white/20 bg-[#0b0b0b] text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>

                  <SelectContent className="bg-[#0b0b0b] text-white border border-white/20 rounded-md shadow-xl">
                    <SelectItem value="JOBSEEKER" className="hover:bg-white/10">Jobseeker</SelectItem>
                    <SelectItem value="EMPLOYER" className="hover:bg-white/10">Employer</SelectItem>
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground">If you need a Company Admin or Super Admin account, request it from site administrators (invite-only).</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Password</label>
                <Input placeholder="••••••••" type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required />
              </div>

              <Button type="submit" className="w-full" disabled={registerLoading} aria-busy={registerLoading} aria-disabled={registerLoading}>
                {registerLoading ? "Creating..." : "Create account"}
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Enter the 6-digit OTP sent to {registerForm.phone || "your phone"}.</p>

              <Input placeholder="123456" value={regOtp} onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} maxLength={6} inputMode="numeric" />

              <div className="flex items-center gap-2 flex-wrap">
                <Button onClick={handleVerifyRegOtp} disabled={regOtpLoading}>{regOtpLoading ? "Verifying..." : "Verify OTP"}</Button>
                <Button variant="outline" onClick={() => handleResendOtp("registration")} disabled={resendLoading}>{resendLoading ? "Resending..." : "Resend OTP"}</Button>
                <Button variant="ghost" onClick={() => {
                  setShowRegOtp(false);
                  setRegOtp("");
                }}>Start Over</Button>
              </div>

              <p className="text-xs text-muted-foreground">If you need to change your details, click "Start Over". Otherwise, you can close and reopen this dialog to continue entering your OTP.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
}