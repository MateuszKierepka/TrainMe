export interface ApiErrorResponse {
  status: number;
  message: string;
  errors: Record<string, string>;
  timestamp: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  role: "CLIENT" | "TRAINER";
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface AuthActionState {
  success: boolean;
  fieldErrors?: Record<string, string>;
  globalError?: string;
  accountNotVerified?: boolean;
  notVerifiedEmail?: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "CLIENT" | "TRAINER" | "ADMIN";
  photoUrl: string | null;
  verified: boolean;
}

export interface LoginResponse {
  token: string;
  user: AuthResponse;
}

export interface ResendVerificationState {
  success: boolean;
  message: string;
}
