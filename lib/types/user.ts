export interface UserResponse {
  uuid: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profile: string;
  phoneNumber?: string | null;
  gender?: string | null;
  roles: string[];

  // Organizer fields
  orgName?: string | null;
  orgBio?: string | null;
  orgProfilePath?: string | null;
  orgProfileUrl?: string | null;

  // Banking fields
  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankAccountName?: string | null;
  currency?: "KHR" | "USD" | null;
  qrCodePath?: string | null;
  qrCodeUrl?: string | null;

  // Status fields
  organizerStatus: "NONE" | "PENDING" | "ACCEPTED" | "REJECTED";
  remark?: string | null;
  appliedAt?: string | null;
  reviewedAt?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  email: string;
  roles: string[];
}