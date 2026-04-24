export interface BookingDetailRequest {
  ticketId: number;
  qty: number;
}

export interface CreateBookingRequest {
  eventId: number;
  details: BookingDetailRequest[];
}

export interface BookingDetailResponse {
  id: number;
  qty: number;
  unitPrice: number;
  subtotal: number;
  ticketCode: string | null;
  ticket: {
    id: number;
    type: string;
    price: number;
  };
}

export interface EventSummary {
  id: number;
  title: string;
  thumbnailUrl: string;
  startDate: string;
  endDate: string;
  location: string;
}

export interface CustomerInfo {
  uuid: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
}

export interface BookingResponse {
  id: number;
  totalAmount: number;
  paymentProofUrl: string | null;
  paymentProofPath?: string | null;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
  organizerRemark: string | null;
  bookedAt: string;
  verifiedAt: string | null;
  customer: CustomerInfo;
  event: EventSummary;
  details: BookingDetailResponse[];
}

export interface OrganizerBookingResponse {
  id: number;
  totalAmount: number;
  paymentProofUrl: string | null;
  paymentProofPath?: string | null;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
  organizerRemark: string | null;
  bookedAt: string;
  verifiedAt: string | null;
  customer: {
    name: string;
    email: string;
    phone: string | null;
  };
  event: EventSummary;
  details: BookingDetailResponse[];
}

export interface PaginatedBookings {
  content: BookingResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface PaginatedOrganizerBookings {
  content: OrganizerBookingResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
