export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface UserResponse {
  email: string;
  full_name: string;
  tier: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface ErrorResponse {
  error: string;
}

export interface ApiScanResponse {
  scan_id?: string;
  [key: string]: unknown;
}
