import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  useRegister,
  useVerifyLoginOtp,
  useLogin,
  useVerifyRegistrationOtp,
  useResendOtp,
  useForgotPassword,
  useVerifyResetOtp,
  useResetPassword,
  useCurrentUser,
  useChangePassword,
  useLoginHistory,
  useRequestPhoneVerification,
  useVerifyUpdatedPhone,
  useUpdateUser,
  useDeactivateAccount,
} from '@/hooks/useUserApi';
import { UserResponse, AuthResponse } from '@/api/types/user';

export type AuthState = {
  token: string | null;
  user: UserResponse | null;
  loading: boolean;
};

type AuthContextValue = AuthState & {
  // flows
  register: (input: { email: string; password: string; phone?: string; userType: string; name?: string }) => Promise<void>;
  verifyRegistrationOtp: (input: { phone: string; otp: string }) => Promise<void>;
  login: (input: { email: string; password: string }) => Promise<void>;
  verifyLoginOtp: (input: { phone: string; otp: string }) => Promise<void>;
  resendOtp: (input: { phone: string; purpose: 'registration' | 'login' | 'password_reset' }) => Promise<void>;
  forgotPassword: (input: { phone: string }) => Promise<void>;
  verifyResetOtp: (input: { phone: string; otp: string }) => Promise<string>; // returns resetToken
  resetPassword: (input: { resetToken: string; newPassword: string }) => Promise<void>;
  // user
  refreshMe: () => Promise<void>;
  updateMe: (input: { name?: string; email?: string; phone?: string }) => Promise<void>;
  requestPhoneVerification: () => Promise<void>;
  verifyUpdatedPhone: (input: { otp: string }) => Promise<void>;
  changePassword: (input: { currentPassword: string; newPassword: string }) => Promise<void>;
  deactivate: (input: { password: string; reason?: string }) => Promise<void>;
  loginHistory: (limit?: number) => Promise<any>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(!!localStorage.getItem('authToken'));

  // API mutations
  const { mutateAsync: registerAsync } = useRegister();
  const { mutateAsync: verifyRegOtpAsync } = useVerifyRegistrationOtp();
  const { mutateAsync: loginAsync } = useLogin();
  const { mutateAsync: verifyLoginOtpAsync } = useVerifyLoginOtp();
  const { mutateAsync: resendOtpAsync } = useResendOtp();
  const { mutateAsync: forgotPasswordAsync } = useForgotPassword();
  const { mutateAsync: verifyResetOtpAsync } = useVerifyResetOtp();
  const { mutateAsync: resetPasswordAsync } = useResetPassword();
  const { mutateAsync: changePasswordAsync } = useChangePassword();
  const { mutateAsync: requestPhoneVerAsync } = useRequestPhoneVerification();
  const { mutateAsync: verifyUpdatedPhoneAsync } = useVerifyUpdatedPhone();
  const { mutateAsync: updateUserAsync } = useUpdateUser();
  const { mutateAsync: deactivateAsync } = useDeactivateAccount();
  const { data: currentUserData, refetch: refetchUser } = useCurrentUser(!!token);
  const { mutateAsync: getLoginHistoryAsync } = useLoginHistory();

  // Sync currentUser data to state
  useEffect(() => {
    if (currentUserData) {
      setUser(currentUserData);
      setLoading(false);
    } else if (!token) {
      setLoading(false);
    }
  }, [currentUserData, token]);

  // persist token
  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [token]);

  // Refetch user when token changes
  useEffect(() => {
    if (token) {
      setLoading(true);
      refetchUser();
    } else {
      setLoading(false);
      setUser(null);
    }
  }, [token, refetchUser]);

  // flows
  const register = useCallback(async (input: { email: string; password: string; phone?: string; userType: string; name?: string }) => {
    await registerAsync(input);
  }, [registerAsync]);

  const verifyRegistrationOtp = useCallback(async (input: { phone: string; otp: string }) => {
    const res = await verifyRegOtpAsync(input);
    setToken(res.token);
  }, [verifyRegOtpAsync]);

  const login = useCallback(async (input: { email: string; password: string }) => {
    await loginAsync(input);
  }, [loginAsync]);

  const verifyLoginOtp = useCallback(async (input: { phone: string; otp: string }) => {
    const res = await verifyLoginOtpAsync(input);
    setToken(res.token);
  }, [verifyLoginOtpAsync]);

  const resendOtp = useCallback(async (input: { phone: string; purpose: 'registration' | 'login' | 'password_reset' }) => {
    await resendOtpAsync(input);
  }, [resendOtpAsync]);

  const forgotPassword = useCallback(async (input: { phone: string }) => {
    await forgotPasswordAsync(input);
  }, [forgotPasswordAsync]);

  const verifyResetOtp = useCallback(async (input: { phone: string; otp: string }) => {
    const resetToken = await verifyResetOtpAsync(input);
    return resetToken;
  }, [verifyResetOtpAsync]);

  const resetPassword = useCallback(async (input: { resetToken: string; newPassword: string }) => {
    await resetPasswordAsync(input);
  }, [resetPasswordAsync]);

  // user
  const updateMe = useCallback(async (input: { name?: string; email?: string; phone?: string }) => {
    const updated = await updateUserAsync(input);
    setUser(updated);
  }, [updateUserAsync]);

  const requestPhoneVerification = useCallback(async () => {
    await requestPhoneVerAsync({});
  }, [requestPhoneVerAsync]);

  const verifyUpdatedPhone = useCallback(async (input: { otp: string }) => {
    const updated = await verifyUpdatedPhoneAsync(input);
    setUser(updated);
  }, [verifyUpdatedPhoneAsync]);

  const changePassword = useCallback(async (input: { currentPassword: string; newPassword: string }) => {
    await changePasswordAsync(input);
  }, [changePasswordAsync]);

  const deactivate = useCallback(async (input: { password: string; reason?: string }) => {
    await deactivateAsync(input);
    // After deactivate, log out locally
    setToken(null);
    setUser(null);
  }, [deactivateAsync]);

  const loginHistory = useCallback(async (limit = 10) => {
    return await getLoginHistoryAsync(limit);
  }, [getLoginHistoryAsync]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    token,
    user,
    loading,
    register,
    verifyRegistrationOtp,
    login,
    verifyLoginOtp,
    resendOtp,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
    refreshMe: refetchUser,
    updateMe,
    requestPhoneVerification,
    verifyUpdatedPhone,
    changePassword,
    deactivate,
    loginHistory,
    logout,
  }), [token, user, loading, register, verifyRegistrationOtp, login, verifyLoginOtp, resendOtp, forgotPassword, verifyResetOtp, resetPassword, refetchUser, updateMe, requestPhoneVerification, verifyUpdatedPhone, changePassword, deactivate, loginHistory, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}