import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export default function OtpModal({ open, onClose, onSubmit, onResend, title = 'Enter OTP' }: {
  open: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => Promise<void> | void;
  onResend?: () => Promise<void> | void;
  title?: string;
}) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let t: any;
    if (open) {
      setOtp('');
      setCooldown(0);
    }
    if (cooldown > 0) {
      t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => t && clearTimeout(t);
  }, [open, cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setLoading(true);
    try {
      await onSubmit(otp);
      setOtp('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!onResend || cooldown > 0) return;
    await onResend();
    setCooldown(60);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 text-center">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button type="submit" disabled={loading || otp.length < 6}>{loading ? 'Verifying...' : 'Verify'}</Button>
            {onResend && (
              <Button type="button" variant="secondary" disabled={cooldown>0} onClick={handleResend}>
                {cooldown>0 ? `Resend in 00:${String(cooldown).padStart(2,'0')}` : 'Resend'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
