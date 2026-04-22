import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Event, PaginatedResponse } from "@/lib/types/event";

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Event", "MyEvents"],
  endpoints: (builder) => ({
    getEvents: builder.query<
      PaginatedResponse<Event>,
      { page?: number; size?: number; sort?: string } | void
    >({
      query: (params) => ({
        url: "/events",
        params,
      }),
      providesTags: ["Event"],
    }),

    getEventById: builder.query<Event, number>({
      query: (id) => `/events/${id}`,
      providesTags: (result, error, id) => [{ type: "Event", id }],
    }),

getMyEvents: builder.query<
  PageEventResponse,
  { page?: number; size?: number }
>({
  query: ({ page = 0, size = 10 }) => ({
    url: "/events/organizer/me",
    params: { page, size },  // Simple page/size, not pageable string
  }),
  providesTags: ["MyEvents"],
}),

    // ADD THIS:
    deleteEvent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MyEvents"],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useGetMyEventsQuery,
  useDeleteEventMutation, // ADD THIS EXPORT
} = eventsApi;