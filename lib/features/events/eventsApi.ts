import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Event, PaginatedResponse } from "@/lib/types/event";

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/proxy", // We'll create this proxy route
  }),
  tagTypes: ["Event"],
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
  }),
});

export const { useGetEventsQuery, useGetEventByIdQuery } = eventsApi;
