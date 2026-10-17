export interface User {
  id: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: 'USER' | 'VENDOR' | 'SUPER_ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: User;
  tokens: AuthTokens;
}

export interface LoginUserInput {
  mobileNumber: string;
  password?: string;
  otp?: string;
}

export interface RegisterUserInput {
  mobileNumber: string;
  firstName: string;
  lastName: string;
  password?: string;
  email?: string;
}
