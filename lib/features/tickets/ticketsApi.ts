import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  TicketListItem,
  TicketsQueryParams,
  TicketsResponse,
} from "@/lib/types/ticket";

type UnknownRecord = Record<string, unknown>;

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const toString = (value: unknown, fallback = "") =>
  typeof value === "string" && value.trim().length > 0 ? value : fallback;

const normalizeStatus = (value: unknown): TicketListItem["status"] => {
  const status = toString(value, "PENDING").toUpperCase();

  if (status.includes("CANCEL")) {
    return "CANCELED";
  }

  if (status.includes("COMPLETE") || status.includes("SUCCESS")) {
    return "COMPLETED";
  }

  return "PENDING";
};

const normalizeTicket = (raw: UnknownRecord, index: number): TicketListItem => {
  const event =
    typeof raw.event === "object" && raw.event !== null
      ? (raw.event as UnknownRecord)
      : undefined;

  const nestedTickets =
    Array.isArray(raw.tickets) && raw.tickets.length > 0 ? raw.tickets : [];

  const id = toNumber(raw.id, index + 1);
  const reference =
    toString(raw.reference) ||
    toString(raw.code) ||
    toString(raw.orderCode) ||
    `#R${id}`;

  const title =
    toString(raw.title) ||
    toString(raw.eventTitle) ||
    toString(event?.title) ||
    "Untitled Event";

  const orderDate =
    toString(raw.orderDate) ||
    toString(raw.createdAt) ||
    toString(raw.purchaseDate) ||
    new Date().toISOString();

  const totalPaid =
    toNumber(raw.totalPaid) || toNumber(raw.amount) || toNumber(raw.total);

  const quantity =
    toNumber(raw.quantity) ||
    toNumber(raw.ticketCount) ||
    (nestedTickets.length > 0 ? nestedTickets.length : 1);

  const status = normalizeStatus(
    raw.status ?? raw.paymentStatus ?? raw.bookingStatus,
  );

  return {
    id,
    reference,
    title,
    orderDate,
    totalPaid,
    quantity,
    status,
  };
};

const normalizeResponse = (raw: unknown): TicketsResponse => {
  const data = (raw ?? {}) as UnknownRecord;

  const listSource = Array.isArray(raw)
    ? (raw as UnknownRecord[])
    : Array.isArray(data.content)
      ? (data.content as UnknownRecord[])
      : Array.isArray(data.tickets)
        ? (data.tickets as UnknownRecord[])
        : [];

  const items = listSource.map((ticket, index) =>
    normalizeTicket(ticket, index),
  );
  const totalElements = toNumber(data.totalElements, items.length);
  const size = Math.max(1, toNumber(data.size, items.length || 1));
  const totalPages = Math.max(
    1,
    toNumber(data.totalPages, Math.ceil(totalElements / size)),
  );
  const number = toNumber(data.number, 0);

  return {
    items,
    number,
    totalElements,
    totalPages,
  };
};

export const ticketsApi = createApi({
  reducerPath: "ticketsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/proxy",
  }),
  tagTypes: ["Ticket"],
  endpoints: (builder) => ({
    getTickets: builder.query<TicketsResponse, TicketsQueryParams | void>({
      query: (params) => ({
        url: "/tickets",
        params: params ?? undefined,
      }),
      transformResponse: normalizeResponse,
      providesTags: ["Ticket"],
    }),
  }),
});

export const { useGetTicketsQuery } = ticketsApi;
