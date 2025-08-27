export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export type SignInData = {
  email: string;
  password: string;
};

export type SignUpData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

export type ForgotPasswordData = {
  email: string;
};

export type AuthResponse = {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  error?: string;
};

