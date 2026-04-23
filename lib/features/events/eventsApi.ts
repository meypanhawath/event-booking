import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PageEventResponse, EventResponse } from "@/lib/types/event";

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
  }),
  tagTypes: ["Event", "MyEvents"],
  endpoints: (builder) => ({
    getEvents: builder.query<
      PageEventResponse,
      { page?: number; size?: number; sort?: string } | void
    >({
      query: (params) => ({
        url: "/events",
        params: params
          ? {
              pageNumber: params.page ?? 0,
              pageSize: params.size ?? 20,
            }
          : undefined,
      }),
      providesTags: ["Event"],
    }),

    getEventById: builder.query<EventResponse, number>({
      query: (id) => `/events/${id}`,
      providesTags: (result, error, id) => [{ type: "Event", id }],
    }),

getMyEvents: builder.query<
  PageEventResponse,
  { page?: number; size?: number }
>({
  query: ({ page = 0, size = 10 }) => ({
    url: "/events/organizer/me",
    params: { page, size },
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
