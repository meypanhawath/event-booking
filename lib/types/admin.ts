export interface PageUserResponse {
  content: UserResponse[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: PageableObject;
  size: number;
  sort: SortObject;
  totalElements: number;
  totalPages: number;
}

export interface UserResponse {
  uuid: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profile: string | null;
  roles: string[];
  orgName: string | null;
  orgBio: string | null;
  orgProfilePath: string | null;
  orgProfileUrl: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  currency: string | null;
  qrCodePath: string | null;
  qrCodeUrl: string | null;
  organizerStatus: string | null;
  remark: string | null;
  appliedAt: string | null;
  reviewedAt: string | null;
}

export interface PageableObject {
  offset: number;
  sort: SortObject;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}

export interface SortObject {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateOrganizerStatusRequest {
  uuid: string;
  status: "NONE" | "PENDING" | "ACCEPTED" | "REJECTED";
  remark?: string;
}