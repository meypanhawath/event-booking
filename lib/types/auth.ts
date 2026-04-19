export interface LoginRequest {
  emailOrUsername: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string  // Added this field
}

export interface AuthResponse {
  access_token: string
  refresh_token?: string
  token_type?: string
  expires_in?: number
  user?: UserProfile
}

export interface UserProfile {
  id: number | string
  username: string
  email: string
  avatar?: string
  role?: string
  phoneNumber?: string
  isEmailVerified?: boolean
  createdAt?: string
}

export interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, string[]>
}