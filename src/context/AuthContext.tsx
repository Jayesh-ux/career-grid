import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  registerUser,
  verifyRegistrationOtp,
  loginUser,
  verifyLoginOtp,
  getCurrentUser,
  AuthResponse,
} from '@/lib/services/userService';
import { showToast } from '@/components/Toast';

export type UserType = 'JOBSEEKER' | 'EMPLOYER' | 'COMPANYADMIN' | 'SUPERADMIN';

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  userType: UserType;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isLoading: boolean; // for UI actions
  isAuthenticated: boolean;
  initiateLogin: (email: string, password: string) => Promise<string>; // returns phone
  initiateRegister: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    userType: UserType;
  }) => Promise<void>;
  verifyOtp: (
    phone: string,
    otp: string,
    purpose: 'login' | 'registration'
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  autoLoad?: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  autoLoad = true,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(autoLoad);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (!autoLoad) return;

    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, [autoLoad]);

  const isAuthenticated = !!token && !!user;

  const saveAuthData = (auth: AuthResponse) => {
    const authUser: AuthUser = {
      userId: auth.userId,
      name: auth.name,
      email: auth.email,
      userType: auth.userType as UserType,
    };

    setToken(auth.token);
    setUser(authUser);
    localStorage.setItem('token', auth.token);
    localStorage.setItem('user', JSON.stringify(authUser));
  };

  // Step 1: Login with email/password – returns phone for OTP
  const initiateLogin = async (email: string, password: string): Promise<string> => {
    setIsLoading(true);
    try {
      const message = await loginUser({ email, password });
      // Backend uses the registered phone; your UI already knows nothing about it,
      // so in a real implementation you’d fetch the phone from /users/me after OTP.
      // Here, we return a placeholder phone until backend explicitly returns it.
      // If your backend returns phone in headers/body, adjust accordingly.

      // For now, assume phone is tied to user and you collect it separately:
      const normalizedEmail = email.trim();
      showToast.success(message || 'OTP sent to your phone for login');
      // You might instead return an empty string and not show phone in modal
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Register – sends OTP to phone
  const initiateRegister = async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    userType: UserType;
  }): Promise<void> => {
    setIsLoading(true);
    try {
      const message = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        userType: data.userType,
      });
      showToast.success(
        message || 'OTP sent to your phone. Please verify to complete registration.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP (login or registration)
  const verifyOtp = async (
    phone: string,
    otp: string,
    purpose: 'login' | 'registration'
  ): Promise<void> => {
    setIsLoading(true);
    try {
      let auth: AuthResponse;
      if (purpose === 'login') {
        auth = await verifyLoginOtp({ phone, otp });
      } else {
        auth = await verifyRegistrationOtp({ phone, otp });
      }
      saveAuthData(auth);
      showToast.success('OTP verified successfully');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast.info('You have been logged out');
  };

  const refreshUser = async (): Promise<void> => {
    if (!token) return;
    try {
      const data = await getCurrentUser();
      const authUser: AuthUser = {
        userId: data.userId,
        name: data.name,
        email: data.email,
        userType: data.userType as UserType,
      };
      setUser(authUser);
      localStorage.setItem('user', JSON.stringify(authUser));
    } catch {
      // If token is invalid, force logout
      logout();
    }
  };

  const value: AuthContextValue = {
    user,
    token,
    loading,
    isLoading,
    isAuthenticated,
    initiateLogin,
    initiateRegister,
    verifyOtp,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
