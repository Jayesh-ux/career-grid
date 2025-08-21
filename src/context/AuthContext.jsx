import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user data on app load
    const savedUser = localStorage.getItem('jobhook_user');
    const savedToken = localStorage.getItem('jobhook_token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on email
      const mockUser = {
        id: Date.now(),
        email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        type: email.includes('employer') ? 'employer' : 'jobseeker',
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
        joinDate: new Date().toISOString(),
        profile: {
          phone: '',
          location: '',
          bio: '',
          skills: [],
          experience: [],
          education: []
        }
      };
      
      const mockToken = `mock_jwt_token_${Date.now()}`;
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Save to localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem('jobhook_user', JSON.stringify(mockUser));
        localStorage.setItem('jobhook_token', mockToken);
      }
      
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: Date.now(),
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        type: 'jobseeker',
        avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random`,
        joinDate: new Date().toISOString(),
        profile: {
          phone: userData.phone || '',
          location: '',
          bio: '',
          skills: [],
          experience: [],
          education: []
        }
      };
      
      const mockToken = `mock_jwt_token_${Date.now()}`;
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem('jobhook_user', JSON.stringify(mockUser));
      localStorage.setItem('jobhook_token', mockToken);
      
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('jobhook_user');
    localStorage.removeItem('jobhook_token');
  };

  const updateProfile = (profileData) => {
    const updatedUser = {
      ...user,
      ...profileData,
      profile: {
        ...user.profile,
        ...profileData.profile
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem('jobhook_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};