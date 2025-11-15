import React, { useMemo, useState } from 'react';
import ProfileDashboard from '@/components/ProfileDashboard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import OtpModal from '@/components/auth/OtpModal';
import { toast } from 'sonner';

// Minimal shape based on expected API fields
type LoginHistoryItem = {
  loginTime?: string;
  status?: string;
  ipAddress?: string;
  [k: string]: any;
};

export default function Dashboard() {
  const { user, updateMe, requestPhoneVerification, verifyUpdatedPhone, changePassword, deactivate, logout } = useAuth();
  const isVerified = !!(user?.isVerified ?? (user as any)?.is_verified ?? false);

  const [form, setForm] = useState<{ name: string; email: string; phone?: string }>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [pwd, setPwd] = useState<{ currentPassword: string; newPassword: string }>({ currentPassword: '', newPassword: '' });
  // login history intentionally removed from main profile dashboard per product feedback
  const [saving, setSaving] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const canSave = useMemo(() => !!form.name && !!form.email, [form.name, form.email]);

  const onSaveProfile = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await updateMe(form);
      toast.success('Profile updated');
    } catch (e: any) {
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
    } catch (e: any) {
      toast.error(e?.message || 'Failed to send OTP');
    } finally {
      setRequestingOtp(false);
    }
  };

  const onChangePassword = async () => {
    if (!pwd.currentPassword || !pwd.newPassword || changingPwd) return;
    setChangingPwd(true);
    try {
      await changePassword(pwd);
      toast.success('Password changed');
      setPwd({ currentPassword: '', newPassword: '' });
    } catch (e: any) {
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
    } catch (e: any) {
      toast.error(e?.message || 'Deactivation failed');
    } finally {
      setDeactivating(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <ProfileDashboard embedded />

        <section className="mb-10 max-w-md">
          <h2 className="text-xl font-semibold mb-3">Change Password</h2>
          <div className="grid gap-3">
            <Input type="password" placeholder="Current password" value={pwd.currentPassword} onChange={e => setPwd({ ...pwd, currentPassword: e.target.value })} />
            <Input type="password" placeholder="New password" value={pwd.newPassword} onChange={e => setPwd({ ...pwd, newPassword: e.target.value })} />
            <Button onClick={onChangePassword} disabled={!pwd.currentPassword || !pwd.newPassword || changingPwd} aria-busy={changingPwd}>
              {changingPwd ? 'Changing…' : 'Change Password'}
            </Button>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Security</h2>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={onDeactivate} disabled={deactivating} aria-busy={deactivating}>
              {deactivating ? 'Deactivating…' : 'Deactivate Account'}
            </Button>
            <Button variant="secondary" onClick={logout}>Logout</Button>
          </div>
        </section>

        {/* Login History intentionally removed from main profile. Use Security page to review login sessions. */}
      </main>
      <Footer />

      <OtpModal
        open={showPhoneOtp}
        onClose={() => setShowPhoneOtp(false)}
        onSubmit={async (otp) => {
          try {
            await verifyUpdatedPhone({ otp });
            setShowPhoneOtp(false);
            toast.success('Phone verified');
          } catch (e: any) {
            toast.error(e?.message || 'Verification failed');
          }
        }}
        title="Verify Updated Phone"
      />
    </div>
  );
}
