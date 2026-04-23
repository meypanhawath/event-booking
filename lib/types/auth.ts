export interface LoginRequest {
  emailOrUsername: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken?: string
  tokenType?: string
  email?: string
  roles?: string[]
  user?: UserProfile
}

export interface UserProfile {
  id?: number | string
  uuid?: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  profile?: string | null
  avatar?: string
  roles?: string[]
  phoneNumber?: string
  gender?: string | null
  isEmailVerified?: boolean
  createdAt?: string
  orgName?: string | null
  orgBio?: string | null
  orgProfilePath?: string | null
  orgProfileUrl?: string | null
  bankName?: string | null
  bankAccountNumber?: string | null
  bankAccountName?: string | null
  currency?: "KHR" | "USD" | null
  qrCodePath?: string | null
  qrCodeUrl?: string | null
  organizerStatus?: "NONE" | "PENDING" | "ACCEPTED" | "REJECTED"
  remark?: string | null
  appliedAt?: string | null
  reviewedAt?: string | null
}

export interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, string[]>
}
