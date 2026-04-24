import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  CreateBookingRequest,
  BookingResponse,
  PaginatedBookings,
  PaginatedOrganizerBookings,
} from "@/lib/types/booking";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
  }),
  tagTypes: ["Booking", "EventBookings"],
  endpoints: (builder) => ({
    // Customer: Create booking
    createBooking: builder.mutation<BookingResponse, CreateBookingRequest>({
      query: (body) => ({
        url: "/bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking"],
    }),

    // Customer: My bookings
    getMyBookings: builder.query<
      PaginatedBookings,
      { page?: number; size?: number } | void
    >({
      query: (params) => ({
        url: "/bookings/me",
        params: params ?? { page: 0, size: 10 },
      }),
      providesTags: ["Booking"],
    }),

    // Customer: Upload payment proof
    uploadPaymentProof: builder.mutation<
      BookingResponse,
      { bookingId: number; proofPath: string }
    >({
      query: ({ bookingId, proofPath }) => ({
        url: `/bookings/${bookingId}/payment-proof`,
        method: "PATCH",
        params: { proofPath },
      }),
      invalidatesTags: ["Booking"],
    }),

    // Customer: Cancel booking
    cancelBooking: builder.mutation<void, number>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Booking"],
    }),

    // Organizer: Event bookings
    getEventBookings: builder.query<
      PaginatedOrganizerBookings,
      { eventId: number; page?: number; size?: number }
    >({
      query: ({ eventId, ...params }) => ({
        url: `/bookings/events/${eventId}`,
        params,
      }),
      providesTags: ["EventBookings"],
    }),

    // Organizer: Verify booking (confirm/reject)
    verifyBooking: builder.mutation<
      BookingResponse,
      { bookingId: number; status: "CONFIRMED" | "REJECTED"; remark?: string }
    >({
      query: ({ bookingId, status, remark }) => ({
        url: `/bookings/${bookingId}/verify`,
        method: "PATCH",
        params: { status, ...(remark ? { remark } : {}) },
      }),
      invalidatesTags: ["Booking", "EventBookings"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useUploadPaymentProofMutation,
  useCancelBookingMutation,
  useGetEventBookingsQuery,
  useVerifyBookingMutation,
} = bookingsApi;
