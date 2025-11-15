import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import OtpModal from '@/components/auth/OtpModal';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user, updateMe, requestPhoneVerification, verifyUpdatedPhone, changePassword, deactivate, logout } = useAuth();
  const isVerified = !!(user?.isVerified ?? user?.is_verified ?? false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '' });
  // Login history state removed - audit logs not shown to users

  const onSaveProfile = async () => {
    try {
      await updateMe(form);
      toast.success('Profile updated');
    } catch (e) {
      const msg = (e && (e.message || e.toString())) || 'Update failed';
      toast.error(msg);
    }
  };

  const onRequestPhoneOtp = async () => {
    try {
      await requestPhoneVerification();
      setShowPhoneOtp(true);
      toast.success('OTP sent to phone');
    } catch (e) {
      const msg = (e && (e.message || e.toString())) || 'Failed to send OTP';
      toast.error(msg);
    }
  };

  const onChangePassword = async () => {
    try {
      await changePassword(pwd);
      toast.success('Password changed');
      setPwd({ currentPassword: '', newPassword: '' });
    } catch (e) {
      const msg = (e && (e.message || e.toString())) || 'Change password failed';
      toast.error(msg);
    }
  };

  const onDeactivate = async () => {
    const password = prompt('Confirm your password to deactivate');
    if (!password) return;
    try {
      await deactivate({ password, reason: 'User requested' });
      toast.success('Account deactivated');
    } catch (e) {
      const msg = (e && (e.message || e.toString())) || 'Deactivation failed';
      toast.error(msg);
    }
  };

  // onLoadHistory removed - login history is for audit purposes only

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl">
            <Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Phone" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="flex gap-2 mt-3">
            <Button onClick={onSaveProfile}>Save</Button>
            {isVerified ? (
              <Badge className="bg-green-600 text-white border-transparent">Verified</Badge>
            ) : (
              <Button variant="secondary" onClick={onRequestPhoneOtp}>Verify Phone</Button>
            )}
          </div>
        </section>

        <section className="mb-10 max-w-md">
          <h2 className="text-xl font-semibold mb-3">Change Password</h2>
          <div className="grid gap-3">
            <Input type="password" placeholder="Current password" value={pwd.currentPassword} onChange={e => setPwd({ ...pwd, currentPassword: e.target.value })} />
            <Input type="password" placeholder="New password" value={pwd.newPassword} onChange={e => setPwd({ ...pwd, newPassword: e.target.value })} />
            <Button onClick={onChangePassword}>Change Password</Button>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Security</h2>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={onDeactivate}>Deactivate Account</Button>
            <Button variant="secondary" onClick={logout}>Logout</Button>
          </div>
        </section>

        {/* Login History section removed - audit logs are not shown to users. Backend API available for admins. */}
      </main>
      <Footer />

      <OtpModal
        open={showPhoneOtp}
        onClose={() => setShowPhoneOtp(false)}
        onSubmit={async (otp) => {
          try {
            await verifyUpdatedPhone({ otp });
            toast.success('Phone verified');
          } catch (e) {
            const msg = (e && (e.message || e.toString())) || 'Verification failed';
            toast.error(msg);
          }
        }}
        title="Verify Updated Phone"
      />
    </div>
  );
}
