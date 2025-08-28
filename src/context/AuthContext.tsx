import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import type { AuthState, User, SignInData, SignUpData, ForgotPasswordData } from '../types/auth';

type AuthContextType = {
  state: AuthState;
  signIn: (data: SignInData) => Promise<boolean>;
  signUp: (data: SignUpData) => Promise<boolean>;
  forgotPassword: (data: ForgotPasswordData) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEYS = {
  AUTH_TOKEN: 'chipmost_auth_token',
  USER_DATA: 'chipmost_user_data'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false
  });

  // Uygulama başladığında token kontrolü
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (token && userData) {
        // Token'ı doğrula
        const response = await authService.validateToken(token);
        if (response.success && response.user) {
          setState({
            user: response.user,
            token,
            isLoading: false,
            isAuthenticated: true
          });
          return;
        }
      }

      // Geçersiz token veya kullanıcı yok
      await clearStoredAuth();
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Auth status check error:', error);
      await clearStoredAuth();
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const clearStoredAuth = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
    } catch (error) {
      console.error('Clear stored auth error:', error);
    }
  };

  const signIn = async (data: SignInData): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.signIn(data);
      
      if (response.success && response.user && response.token) {
        // Kullanıcı bilgilerini sakla
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
        
        setState({
          user: response.user,
          token: response.token,
          isLoading: false,
          isAuthenticated: true
        });
        
        return true;
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const signUp = async (data: SignUpData): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.signUp(data);
      
      if (response.success && response.user && response.token) {
        // Kullanıcı bilgilerini sakla
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
        
        setState({
          user: response.user,
          token: response.token,
          isLoading: false,
          isAuthenticated: true
        });
        
        return true;
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const forgotPassword = async (data: ForgotPasswordData): Promise<boolean> => {
    try {
      const response = await authService.forgotPassword(data);
      return response.success;
    } catch (error) {
      console.error('Forgot password error:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await clearStoredAuth();
      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const clearAuthError = () => {
    // Hata mesajlarını temizlemek için kullanılabilir
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!state.user) return false;
      
      console.log('AuthContext: updateProfile called with:', updates);
      console.log('AuthContext: Current user:', state.user);
      
      // Kullanıcı bilgilerini güncelle
      const updatedUser = { ...state.user, ...updates };
      
      console.log('AuthContext: Updated user:', updatedUser);
      
      // Local storage'ı güncelle
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      
      // State'i güncelle
      setState(prev => ({
        ...prev,
        user: updatedUser
      }));
      
      console.log('AuthContext: State updated successfully');
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    state,
    signIn,
    signUp,
    forgotPassword,
    signOut,
    clearAuthError,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

