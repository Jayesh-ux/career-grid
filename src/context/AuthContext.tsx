import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { AuthApi, UserApi, UserResponse, ApiError } from '@/lib/api';

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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // persist token
  useEffect(() => {
    if (token) localStorage.setItem('auth_token', token);
    else localStorage.removeItem('auth_token');
  }, [token]);

  const refreshMe = useCallback(async () => {
    if (!token) return;
    try {
      const me = await UserApi.me();
      setUser(me);
    } catch (e) {
      // if unauthorized, clear
      if (e instanceof ApiError && e.status === 401) {
        setToken(null);
        setUser(null);
      }
    }
  }, [token]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (token) {
        await refreshMe();
      }
      setLoading(false);
    })();
  }, [token, refreshMe]);

  // flows
  const register = useCallback(async (input: { email: string; password: string; phone?: string; userType: string; name?: string }) => {
    await AuthApi.register(input);
  }, []);

  const verifyRegistrationOtp = useCallback(async (input: { phone: string; otp: string }) => {
    const res = await AuthApi.verifyRegistrationOtp(input);
    setToken(res.token);
    await refreshMe();
  }, [refreshMe]);

  const login = useCallback(async (input: { email: string; password: string }) => {
    await AuthApi.login(input);
  }, []);

  const verifyLoginOtp = useCallback(async (input: { phone: string; otp: string }) => {
    const res = await AuthApi.verifyLoginOtp(input);
    setToken(res.token);
    await refreshMe();
  }, [refreshMe]);

  const resendOtp = useCallback(async (input: { phone: string; purpose: 'registration' | 'login' | 'password_reset' }) => {
    await AuthApi.resendOtp(input);
  }, []);

  const forgotPassword = useCallback(async (input: { phone: string }) => {
    await AuthApi.forgotPassword(input);
  }, []);

  const verifyResetOtp = useCallback(async (input: { phone: string; otp: string }) => {
    const resetToken = await AuthApi.verifyResetOtp(input);
    return resetToken;
  }, []);

  const resetPassword = useCallback(async (input: { resetToken: string; newPassword: string }) => {
    await AuthApi.resetPassword(input);
  }, []);

  // user
  const updateMe = useCallback(async (input: { name?: string; email?: string; phone?: string }) => {
    const updated = await UserApi.updateMe(input);
    setUser(updated);
  }, []);

  const requestPhoneVerification = useCallback(async () => {
    await UserApi.requestPhoneVerification();
  }, []);

  const verifyUpdatedPhone = useCallback(async (input: { otp: string }) => {
    const updated = await UserApi.verifyUpdatedPhone(input);
    setUser(updated);
  }, []);

  const changePassword = useCallback(async (input: { currentPassword: string; newPassword: string }) => {
    await UserApi.changePassword(input);
  }, []);

  const deactivate = useCallback(async (input: { password: string; reason?: string }) => {
    await UserApi.deactivate(input);
    // After deactivate, log out locally
    setToken(null);
    setUser(null);
  }, []);

  const loginHistory = useCallback(async (limit = 10) => {
    return await UserApi.loginHistory(limit);
  }, []);

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
    refreshMe,
    updateMe,
    requestPhoneVerification,
    verifyUpdatedPhone,
    changePassword,
    deactivate,
    loginHistory,
    logout,
  }), [token, user, loading, register, verifyRegistrationOtp, login, verifyLoginOtp, resendOtp, forgotPassword, verifyResetOtp, resetPassword, refreshMe, updateMe, requestPhoneVerification, verifyUpdatedPhone, changePassword, deactivate, loginHistory, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
