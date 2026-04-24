"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Star, Ticket, X } from "lucide-react";
import { useGetEventsQuery } from "@/lib/features/events/eventsApi";

const FETCH_SIZE = 200;

export default function EventInterceptedModalPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const eventId = Number(params.id);
  const isValidId = Number.isFinite(eventId);

  const {
    data: eventsData,
    isLoading,
    isError,
    error,
  } = useGetEventsQuery(
    {
      page: 0,
      size: FETCH_SIZE,
      sort: "startDate,desc",
    },
    { skip: !isValidId },
  );

  const event = eventsData?.content.find((item) => item.id === eventId);

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const totalAvailable = event?.tickets.reduce(
    (acc, ticket) => acc + (ticket.available ?? 0),
    0,
  );

  return (
    <div className="fixed inset-0 z-60">
      <button
        type="button"
        aria-label="Close event details"
        onClick={() => router.back()}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
      />

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-4xl items-center px-4 py-8 sm:px-6">
        <article className="max-h-[88vh] w-full overflow-hidden rounded-3xl border border-border/70 bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Ticket className="size-4" />
              Event Details
            </div>
            <button
              type="button"
              aria-label="Close modal"
              onClick={() => router.back()}
              className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="max-h-[calc(88vh-66px)] overflow-y-auto">
            {!isValidId && (
              <div className="p-6">
                <p className="text-sm text-red-500">Invalid event id.</p>
              </div>
            )}

            {isValidId && isLoading && (
              <div className="space-y-4 p-6">
                <div className="aspect-video w-full animate-pulse rounded-2xl bg-muted" />
                <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              </div>
            )}

            {isValidId && isError && (
              <div className="p-6">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center dark:border-red-900 dark:bg-red-950/60">
                  <p className="text-sm text-red-600 dark:text-red-300">
                    {error && "status" in error
                      ? `Failed to load event (Error ${error.status})`
                      : "Failed to load event. Please try again later."}
                  </p>
                </div>
              </div>
            )}

            {isValidId && !isLoading && !isError && !event && (
              <div className="p-6">
                <div className="rounded-2xl border border-border bg-background p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Event not found.
                  </p>
                </div>
              </div>
            )}

            {event && (
              <>
                <div className="relative aspect-16/7 w-full overflow-hidden bg-muted">
                  <img
                    src={event.thumbnailUrl}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/75 via-background/10 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                    {event.category.name}
                  </span>
                </div>

                <div className="space-y-5 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">
                        {event.title}
                      </h1>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {event.organizer?.orgName ?? "Unknown organizer"}
                      </p>
                    </div>
                    {event.rating > 0 && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                        <Star className="size-4 fill-yellow-400 text-yellow-400" />
                        {event.rating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>

                  <div className="grid gap-3 rounded-2xl border border-border p-4 text-sm text-muted-foreground sm:grid-cols-3">
                    <div className="inline-flex items-center gap-2">
                      <Calendar className="size-4" />
                      {formatDate(event.startDate)}
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <MapPin className="size-4" />
                      {event.organizer?.orgName ?? "Unknown"}
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <Ticket className="size-4" />
                      {totalAvailable} tickets available
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-foreground">
                      Ticket Types
                    </h2>
                    {event.tickets.length ? (
                      event.tickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {ticket.type}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {ticket.available} available
                            </p>
                          </div>
                          <p className="font-semibold text-brand-main">
                            ${ticket.price}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No tickets available.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                      <ArrowLeft className="size-4" />
                      Back
                    </button>
                    <Link
                      href={`/events/${event.id}`}
                      className="inline-flex items-center rounded-xl bg-brand-main px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-main/90"
                    >
                      Open Full Page
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
