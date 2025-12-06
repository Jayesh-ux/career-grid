import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/services/userService';
import {
  UserResponse,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  OtpRequest,
  ForgotPasswordRequest,
  VerifyResetOtpRequest,
  ResetPasswordRequest,
  ResendOtpRequest,
  ChangePasswordRequest,
  UpdateUserRequest,
  DeactivateAccountRequest,
  VerifyUpdatedPhoneRequest,
} from '@/api/types/user';

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => userService.register(data),
    onSuccess: (data) => {
      console.log('Registration successful', data);
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => userService.login(data),
    onSuccess: (data) => {
      console.log('Login successful', data);
    },
  });
};

export const useVerifyRegistrationOtp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OtpRequest) => userService.verifyRegistrationOtp(data),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useVerifyLoginOtp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OtpRequest) => userService.verifyLoginOtp(data),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => userService.forgotPassword(data),
  });
};

export const useVerifyResetOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyResetOtpRequest) => userService.verifyResetOtp(data),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => userService.resetPassword(data),
    onSuccess: () => {
      console.log('Password reset successful');
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data: ResendOtpRequest) => userService.resendOtp(data),
  });
};

export const useCurrentUser = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => userService.getCurrentUser(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: enabled || !!localStorage.getItem('authToken'),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => userService.updateUser(data),
    onSuccess: (data: UserResponse) => {
      queryClient.setQueryData(['currentUser'], data);
      localStorage.setItem('user', JSON.stringify(data));
    },
  });
};

export const useDeactivateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeactivateAccountRequest) => userService.deactivateAccount(data),
    onSuccess: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      queryClient.clear();
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => userService.changePassword(data),
    onSuccess: () => {
      console.log('Password changed successfully');
    },
  });
};

export const useRequestPhoneVerification = () => {
  return useMutation({
    mutationFn: () => userService.requestPhoneVerification(),
  });
};

export const useVerifyUpdatedPhone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VerifyUpdatedPhoneRequest) => userService.verifyUpdatedPhone(data),
    onSuccess: (data: UserResponse) => {
      queryClient.setQueryData(['currentUser'], data);
    },
  });
};

export const useLoginHistory = () => {
  return useQuery({
    queryKey: ['loginHistory'],
    queryFn: () => userService.getLoginHistory(),
    retry: 1,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useUserServiceHealth = () => {
  return useQuery({
    queryKey: ['userServiceHealth'],
    queryFn: () => userService.healthCheck(),
    retry: 2,
    staleTime: 30 * 1000,
  });
};
