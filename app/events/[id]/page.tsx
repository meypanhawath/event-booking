"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  ChevronDown,
  Clock3,
  MapPin,
  Share2,
  Star,
  Ticket,
} from "lucide-react";
import { useGetEventsQuery } from "@/lib/features/events/eventsApi";

const FETCH_SIZE = 200;

const formatLongDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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

export default function EventDetailsPage() {
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

  if (!isValidId) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(193,79,230,0.08),transparent_40%)]" />
        <div className="relative z-10 mx-auto w-full max-w-7xl pt-10">
          <Link
            href="/events"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to events
          </Link>
          <p className="text-sm text-red-500">Invalid event id.</p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/Event.jpg')] bg-cover bg-center bg-no-repeat opacity-20" />
        <div className="absolute inset-0 bg-background/90" />
        <div className="relative z-10 mx-auto w-full max-w-7xl pt-10">
          <div className="mb-6 h-9 w-44 animate-pulse rounded-xl bg-muted" />
          <div className="mb-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-3">
              <div className="h-10 w-2/3 animate-pulse rounded-xl bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
            </div>
            <div className="aspect-4/3 animate-pulse rounded-2xl bg-muted" />
          </div>
          <div className="space-y-3 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-sm">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/Event.jpg')] bg-cover bg-center bg-no-repeat opacity-20" />
        <div className="absolute inset-0 bg-background/90" />
        <div className="relative z-10 mx-auto w-full max-w-7xl pt-10">
          <Link
            href="/events"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to events
          </Link>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/60">
            <p className="text-sm text-red-600 dark:text-red-300">
              {error && "status" in error
                ? `Failed to load event (Error ${error.status})`
                : "Failed to load event. Please try again later."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/Event.jpg')] bg-cover bg-center bg-no-repeat opacity-20" />
        <div className="absolute inset-0 bg-background/90" />
        <div className="relative z-10 mx-auto w-full max-w-7xl pt-10">
          <Link
            href="/events"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to events
          </Link>
          <div className="rounded-2xl border border-border bg-card/90 p-6 text-center shadow-sm backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">Event not found.</p>
          </div>
        </div>
      </main>
    );
  }

  const totalAvailable = event.tickets.reduce(
    (acc, ticket) => acc + ticket.available,
    0,
  );

  const sameOrganizerEvents =
    eventsData?.content
      .filter(
        (item) =>
          item.id !== event.id &&
          item.organizer?.uuid &&
          item.organizer.uuid === event.organizer?.uuid,
      )
      .slice(0, 5) ?? [];

  const scheduleEvents = [event, ...sameOrganizerEvents].slice(0, 7);
  const monthEvents =
    eventsData?.content.filter((item) => item.id !== event.id).slice(0, 4) ??
    [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0">
        <img
          src={event.thumbnailUrl || "/Event.jpg"}
          alt={event.title}
          className="h-80 w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/85 via-background/92 to-background" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-295 px-4 py-6 pt-12 sm:px-8">
        <Link
          href="/events"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>

        <section className="grid gap-6 lg:grid-cols-[1fr_240px] lg:gap-5">
          <div>
            <header className="mb-5 border-b border-border pb-8 pt-10">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {event.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {event.description}
              </p>
            </header>

            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-3xl font-medium text-foreground">
                  Days and times
                </h2>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/80 px-3 py-2 text-sm text-foreground shadow-sm backdrop-blur-sm"
                >
                  <MapPin className="size-4" />
                  {event.organizer?.orgName ?? "Las Vegas, Nevada, USA"}
                  <ChevronDown className="size-4" />
                </button>
              </div>

              <div className="space-y-3">
                {scheduleEvents.slice(0, 1).map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-foreground">
                          {item.organizer?.orgName ?? "Event venue"}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            {formatShortDate(item.startDate)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="size-3.5" />
                            {formatTime(item.startDate)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                          <Share2 className="size-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                          <Bookmark className="size-4" />
                        </button>
                        <Link
                          href={`/events/${item.id}/tickets`}
                          className="rounded-md border border-brand-main/30 bg-brand-main/10 px-3 py-1.5 text-xs font-medium text-brand-main transition hover:bg-brand-main/15"
                        >
                          Get Tickets
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2 text-[10px]">
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-amber-700 dark:text-amber-300">
                        Popular
                      </span>
                      <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-yellow-700 dark:text-yellow-300">
                        Best Selling
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-linear-to-r from-brand-main/10 via-brand-main/15 to-brand-main/10 p-5 shadow-sm">
                <p className="text-center text-[11px] uppercase tracking-[0.15em] text-brand-main/70">
                  in las vegas
                </p>
                <h3 className="mt-1 text-center text-4xl font-semibold tracking-wide text-foreground">
                  MUSIC FESTIVAL
                </h3>
                <p className="mt-1 text-center text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {event.organizer?.orgName ?? "Special Guest Lineup"}
                </p>
              </div>

              <h3 className="mt-7 mb-3 text-3xl font-medium text-foreground">
                This months
              </h3>

              <div className="space-y-3">
                {monthEvents.slice(0, 2).map((item, index) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-foreground">
                          {item.organizer?.orgName ?? item.title}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            {formatShortDate(item.startDate)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="size-3.5" />
                            {formatTime(item.startDate)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                          <Share2 className="size-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                          <Bookmark className="size-4" />
                        </button>
                        <Link
                          href={`/events/${item.id}/tickets`}
                          className="rounded-md border border-brand-main/30 bg-brand-main/10 px-3 py-1.5 text-xs font-medium text-brand-main transition hover:bg-brand-main/15"
                        >
                          Get Tickets
                        </Link>
                      </div>
                    </div>

                    {index === 0 && (
                      <div className="mt-4 text-[10px]">
                        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-amber-700 dark:text-amber-300">
                          Great
                        </span>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4 lg:pt-24">
            <div className="overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm backdrop-blur-sm">
              <img
                src={event.thumbnailUrl || "/Event.jpg"}
                alt={event.title}
                className="aspect-4/5 w-full object-cover"
              />
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(193,79,230,0.16),transparent_55%)]" />
              <div className="relative">
                <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full border border-brand-main/30 bg-brand-main/10">
                  <MapPin className="size-4 text-brand-main" />
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  {event.organizer?.orgName ??
                    "Complex, Las Vegas, Nevada, USA"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Event stats
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="rounded-lg bg-muted p-2">
                  <p className="text-muted-foreground">Rating</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {event.rating > 0 ? event.rating.toFixed(1) : "N/A"}
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <p className="text-muted-foreground">Tickets</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {totalAvailable}
                  </p>
                </div>
                <div className="col-span-2 rounded-lg bg-muted p-2">
                  <p className="text-muted-foreground">Date</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {formatLongDate(event.startDate)}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
