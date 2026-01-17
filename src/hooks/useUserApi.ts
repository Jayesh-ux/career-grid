import { useState } from 'react';
import {
  registerUser,
  verifyRegistrationOtp,
  loginUser,
  verifyLoginOtp,
  getCurrentUser,
  updateCurrentUser,
  changePassword,
  deactivateAccount,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  resendOtp,
  requestPhoneVerification,
  verifyUpdatedPhone,
  getLoginHistory,
  subscribeNewsletter,
} from '@/lib/services/userService';

export const useUserApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async <T,>(apiCall: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
  loading,
  error,

  // Authentication
  registerUser: (data: any) => handleApiCall(() => registerUser(data)),
  verifyRegistrationOtp: (data: any) => handleApiCall(() => verifyRegistrationOtp(data)),
  loginUser: (data: any) => handleApiCall(() => loginUser(data)),
  verifyLoginOtp: (data: any) => handleApiCall(() => verifyLoginOtp(data)),

  // User Management
  getCurrentUser: () => handleApiCall(() => getCurrentUser()),
  updateCurrentUser: (data: any) => handleApiCall(() => updateCurrentUser(data)),
  changePassword: (data: any) => handleApiCall(() => changePassword(data)),
  deactivateAccount: (data: any) => handleApiCall(() => deactivateAccount(data)),

  // Password Reset
  forgotPassword: (data: any) => handleApiCall(() => forgotPassword(data)),
  verifyResetOtp: (data: any) => handleApiCall(() => verifyResetOtp(data)),
  resetPassword: (data: any) => handleApiCall(() => resetPassword(data)),
  resendOtp: (data: any) => handleApiCall(() => resendOtp(data)),

  // Phone Verification
  requestPhoneVerification: (data: any) => handleApiCall(() => requestPhoneVerification(data)),
  verifyUpdatedPhone: (data: any) => handleApiCall(() => verifyUpdatedPhone(data)),

  // Other - NO PARAMETERS
  getLoginHistory: () => handleApiCall(() => getLoginHistory()),
  subscribeNewsletter: (email: string) => handleApiCall(() => subscribeNewsletter({ email })),
};


};
