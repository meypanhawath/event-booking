"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Armchair,
  Bookmark,
  Calendar,
  Clock3,
  MapPin,
  Share2,
} from "lucide-react";
import VenueMap from "@/components/ui/venue-map";

import {
  useGetEventByIdQuery,
  useGetEventsQuery,
} from "@/lib/features/events/eventsApi";

const FETCH_SIZE = 200;

const formatShortDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

const getTicketBadge = (sectionType: string) => {
  const type = sectionType.trim().toLowerCase();

  if (type.includes("vip")) {
    return "vip";
  }

  if (type.includes("gold") || type.includes("premium")) {
    return "premium";
  }

  if (type.includes("bronze") || type.includes("standard")) {
    return "standard";
  }

  return sectionType;
};

export default function EventTicketsPage() {
  const params = useParams<{ id: string }>();
  const eventId = Number(params.id);
  const isValidId = Number.isFinite(eventId);

  const eventByIdQuery = useGetEventByIdQuery(eventId, {
    skip: !isValidId,
  });

  const eventsListQuery = useGetEventsQuery(
    {
      page: 0,
      size: FETCH_SIZE,
      sort: "startDate,desc",
    },
    { skip: !isValidId },
  );

  const event =
    eventByIdQuery.data ??
    eventsListQuery.data?.content.find((item) => item.id === eventId);

  const isLoading = eventByIdQuery.isLoading || eventsListQuery.isLoading;
  const hasFatalError = eventByIdQuery.isError && eventsListQuery.isError;
  const error = eventsListQuery.error ?? eventByIdQuery.error;

  const sortedTickets = useMemo(() => {
    if (!event?.tickets) {
      return [];
    }

    return [...event.tickets].sort((a, b) => b.price - a.price);
  }, [event?.tickets]);

  if (!isValidId) {
    return (
      <main className="min-h-screen bg-[#090a0f] px-4 py-8 text-zinc-100 sm:px-8">
        <p className="text-sm text-red-400">Invalid event id.</p>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#090a0f] px-4 py-8 text-zinc-100 sm:px-8">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="h-10 w-56 animate-pulse rounded-lg bg-zinc-800" />
          <div className="h-44 animate-pulse rounded-2xl bg-zinc-800" />
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <div className="h-125 animate-pulse rounded-2xl bg-zinc-900" />
            <div className="h-125 animate-pulse rounded-2xl bg-zinc-900" />
          </div>
        </div>
      </main>
    );
  }

  if (hasFatalError || !event) {
    return (
      <main className="min-h-screen bg-[#090a0f] px-4 py-8 text-zinc-100 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href={`/events/${eventId}`}
            className="mb-5 inline-flex items-center gap-2 text-sm text-zinc-300 transition hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to event
          </Link>
          <div className="rounded-xl border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
            {error && "status" in error
              ? `Failed to load tickets (Error ${error.status})`
              : "Failed to load tickets."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090a0f] text-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8">
        <Link
          href={`/events/${event.id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-300 transition hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to event detail
        </Link>

        <section className="relative overflow-hidden rounded-2xl border border-zinc-800">
          <img
            src={event.thumbnailUrl || "/Event.jpg"}
            alt={event.title}
            className="h-52 w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/65 to-[#101117]" />

          <div className="absolute inset-0 flex items-end p-5 sm:p-6">
            <div className="w-full">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {event.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-300">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {formatShortDate(event.startDate)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-3.5" />
                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {event.organizer?.orgName ?? "Event venue"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Armchair className="size-3.5" />
                  {event.tickets.reduce(
                    (acc, ticket) => acc + ticket.available,
                    0,
                  )}{" "}
                  seats
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
          <VenueMap eventTitle={event.title} />
          <aside className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs text-zinc-400">
              <span>{sortedTickets.length} Listings</span>
              <span>Sort by Price</span>
            </div>

            {sortedTickets.length > 0 ? (
              sortedTickets.map((ticket, index) => (
                <article
                  key={ticket.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-zinc-100">
                        Section {ticket.type}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-400">
                        {ticket.available} tickets, seated together
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-fuchsia-300">
                      ${ticket.price}
                      <span className="ml-1 text-xs font-normal text-zinc-400">
                        /per
                      </span>
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-full border border-amber-600/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300">
                      {getTicketBadge(ticket.type)}
                    </span>
                    <div className="inline-flex items-center gap-2 text-zinc-400">
                      <button className="rounded-md p-1 transition hover:bg-zinc-800 hover:text-zinc-200">
                        <Share2 className="size-3.5" />
                      </button>
                      <button className="rounded-md p-1 transition hover:bg-zinc-800 hover:text-zinc-200">
                        <Bookmark className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 text-sm text-zinc-400">
                No ticket listings available.
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
