import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedJobs from "@/components/FeaturedJobs";
import CompanyShowcase from "@/components/CompanyShowcase";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import OtpModal from "@/components/auth/OtpModal";
import { toast } from "sonner";

const Index = () => {
  try {
    const { register, verifyRegistrationOtp, login, verifyLoginOtp, resendOtp, token, user, logout } = useAuth();
    const [showRegOtp, setShowRegOtp] = useState(false);
    const [showLoginOtp, setShowLoginOtp] = useState(false);
    const [lastPhone, setLastPhone] = useState<string>("");

    async function handleQuickRegister() {
      // Demo quick registration with minimal fields; replace with your form values
      const email = `user${Math.floor(Math.random()*1e5)}@example.com`;
      const phone = "9876543210"; // demo; replace with input
      const password = "SecurePass123";
      try {
        await register({ email, password, phone, userType: "JOBSEEKER", name: "New User" });
        setLastPhone(phone);
        setShowRegOtp(true);
        toast.success("OTP sent to phone for registration");
      } catch (e: any) {
        toast.error(e?.message || "Registration failed");
      }
    }

    async function handleQuickLogin() {
      // Demo quick login; replace with your form values
      const email = user?.email || "john.doe@example.com";
      const password = "SecurePass123";
      try {
        await login({ email, password });
        // phone must be provided by UI in real flow
        const phone = lastPhone || "9876543210";
        setLastPhone(phone);
        setShowLoginOtp(true);
        toast.success("OTP sent to phone for login");
      } catch (e: any) {
        toast.error(e?.message || "Login failed");
      }
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <FeaturedJobs />
          <CompanyShowcase />
          <div className="container mx-auto px-4 py-10 flex gap-3">
            {!token ? (
              <>
                <Button onClick={handleQuickRegister}>Quick Register (demo)</Button>
                <Button variant="secondary" onClick={handleQuickLogin}>Quick Login (demo)</Button>
              </>
            ) : (
              <>
                <span className="text-sm text-muted-foreground">Signed in as {user?.name || user?.email}</span>
                <Button variant="destructive" onClick={logout}>Logout</Button>
              </>
            )}
          </div>
        </main>
        <Footer />

        {/* Registration OTP */}
        <OtpModal
          open={showRegOtp}
          onClose={() => setShowRegOtp(false)}
          onSubmit={async (otp) => {
            try {
              await verifyRegistrationOtp({ phone: lastPhone, otp });
              toast.success("Registration completed");
            } catch (e: any) {
              toast.error(e?.message || "OTP verification failed");
            }
          }}
          onResend={async () => {
            try {
              await resendOtp({ phone: lastPhone, purpose: 'registration' });
              toast.success('OTP resent');
            } catch (e: any) {
              toast.error(e?.message || 'Resend failed');
            }
          }}
          title="Verify Registration OTP"
        />

        {/* Login OTP */}
        <OtpModal
          open={showLoginOtp}
          onClose={() => setShowLoginOtp(false)}
          onSubmit={async (otp) => {
            try {
              await verifyLoginOtp({ phone: lastPhone, otp });
              toast.success("Login successful");
            } catch (e: any) {
              toast.error(e?.message || "OTP verification failed");
            }
          }}
          onResend={async () => {
            try {
              await resendOtp({ phone: lastPhone, purpose: 'login' });
              toast.success('OTP resent');
            } catch (e: any) {
              toast.error(e?.message || 'Resend failed');
            }
          }}
          title="Verify Login OTP"
        />
      </div>
    );
  } catch (err) {
    console.error('Index page error:', err);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Error loading page</h1>
          <p className="text-red-300 mb-4">{(err as any)?.message || 'Unknown error'}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary rounded">
            Reload
          </button>
        </div>
      </div>
    );
  }
};

export default Index;
