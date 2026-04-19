"use client";

import { useState } from "react";
import { Goal, Music4, PartyPopper, Ticket } from "lucide-react";
import Link from "next/link";

import Navbar from "@/components/ui/navbar";
import { EventCard } from "@/components/event-card";
import { useGetEventsQuery } from "@/lib/features/events/eventsApi";

const categories = [
  {
    label: "Concerts",
    icon: Music4,
    accent: "from-fuchsia-500/20 to-pink-500/10 text-fuchsia-500",
  },
  {
    label: "Shows",
    icon: Ticket,
    accent: "from-sky-500/20 to-cyan-500/10 text-sky-500",
  },
  {
    label: "Sports",
    icon: Goal,
    accent: "from-amber-500/20 to-orange-500/10 text-amber-500",
  },
  {
    label: "Festivals",
    icon: PartyPopper,
    accent: "from-emerald-500/20 to-lime-500/10 text-emerald-500",
  },
] as const;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  // RTK Query hook - replaces your useEffect + fetch
  const { data: eventsData, isLoading, isError, error } = useGetEventsQuery();

  // Extract events from paginated response
  const events = eventsData?.content ?? [];

  // Get unique categories from API data
  const categoryFilters = [
    "All",
    ...Array.from(new Set(events.map((event) => event.category.name))),
  ];

  // Filter events by category
  const visibleEvents = events
    .filter(
      (event) =>
        activeCategory === "All" || event.category.name === activeCategory,
    )
    .slice(0, 4);

  // Loading skeleton
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div>
        {/* Hero Section */}
        <div className="relative isolate min-h-screen top-0">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-12%,rgba(168,85,247,0.2),transparent_40%),linear-gradient(180deg,#fcfcff_0%,#f7f8fc_30%,#f1f5f9_100%)] dark:bg-[radial-gradient(circle_at_50%_-12%,rgba(168,85,247,0.34),transparent_38%),linear-gradient(180deg,#17111f_0%,#100f13_24%,#0d0d10_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[48%] bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.05)_30%,rgba(15,23,42,0.1))] dark:bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.5)_30%,rgba(0,0,0,0.72))]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[42%] bg-[radial-gradient(circle_at_10%_100%,rgba(2,6,23,0.04),transparent_18%),radial-gradient(circle_at_20%_100%,rgba(2,6,23,0.04),transparent_14%),radial-gradient(circle_at_32%_100%,rgba(2,6,23,0.04),transparent_16%),radial-gradient(circle_at_45%_100%,rgba(2,6,23,0.04),transparent_18%),radial-gradient(circle_at_60%_100%,rgba(2,6,23,0.04),transparent_16%),radial-gradient(circle_at_74%_100%,rgba(2,6,23,0.04),transparent_18%),radial-gradient(circle_at_88%_100%,rgba(2,6,23,0.04),transparent_16%)] opacity-40 blur-xl dark:bg-[radial-gradient(circle_at_10%_100%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_20%_100%,rgba(255,255,255,0.08),transparent_14%),radial-gradient(circle_at_32%_100%,rgba(255,255,255,0.08),transparent_16%),radial-gradient(circle_at_45%_100%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_60%_100%,rgba(255,255,255,0.08),transparent_16%),radial-gradient(circle_at_74%_100%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_88%_100%,rgba(255,255,255,0.08),transparent_16%)]"
          />
          <Navbar />
          <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-9xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
            <section className="flex flex-1 flex-col items-center justify-center pt-16 text-center sm:pt-20">
              <div className="max-w-4xl">
                <h1 className="text-balance text-4xl font-bold leading-none tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  What <span className="text-fuchsia-400">Event</span> would
                  <br className="hidden sm:block" /> you like to go to?
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground sm:text-base">
                  More than {eventsData?.totalElements ?? 0} events in different
                  categories are now available to you.
                </p>
              </div>

              {/* Category Quick Select */}
              <div className="mt-12 w-full max-w-5xl rounded-[22px] border border-border bg-card/90 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur dark:shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                <div className="grid grid-cols-2 gap-2 border-b border-border p-4 sm:grid-cols-4 sm:gap-0 sm:p-5">
                  {categories.map(({ label, icon: Icon, accent }) => (
                    <button
                      key={label}
                      type="button"
                      className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-left text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground sm:justify-start"
                    >
                      <span
                        className={`inline-flex size-5 items-center justify-center rounded-full bg-linear-to-br ${accent}`}
                      >
                        <Icon className="size-3" />
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Events Section */}
        <section className="container mx-auto mt-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Events</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Discover amazing events happening near you
              </p>
            </div>
            <Link
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              href="/events"
            >
              See all
            </Link>
          </div>

          {/* Category Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categoryFilters.map((item) => (
              <button
                key={item}
                onClick={() => setActiveCategory(item)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                  activeCategory === item
                    ? "border-accent/50 bg-accent/15 text-accent"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Error State */}
          {isError && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
              <p className="text-sm text-red-600 dark:text-red-400">
                {error && "status" in error
                  ? `Failed to load events (Error ${error.status})`
                  : "Failed to load events. Please try again later."}
              </p>
            </div>
          )}

          {/* Events Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Empty State */}
          {!isLoading && !isError && visibleEvents.length === 0 && (
            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                No events found in this category.
              </p>
            </div>
          )}
        </section>

        {/* Top Organizers Section (replacing Top Singers) */}
        <section className="container mx-auto mt-20 px-4 pb-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Top Organizers
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Featured event organizers from our community.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from(
              new Map(
                events
                  .filter((e) => e.organizer)
                  .map((e) => [e.organizer!.uuid, e.organizer]),
              ).values(),
            )
              .slice(0, 8)
              .map((organizer, index) => (
                <article
                  key={organizer!.uuid}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-4 py-3"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white ${
                      [
                        "from-orange-500 to-pink-600",
                        "from-blue-400 to-cyan-600",
                        "from-violet-500 to-fuchsia-700",
                        "from-zinc-500 to-zinc-800",
                        "from-red-500 to-amber-500",
                        "from-emerald-400 to-teal-600",
                        "from-yellow-400 to-orange-600",
                        "from-indigo-400 to-purple-600",
                      ][index % 8]
                    } bg-linear-to-br`}
                  >
                    {organizer!.orgName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-medium text-foreground">
                      {organizer!.orgName}
                    </h3>
                    <p className="truncate text-xs text-muted-foreground">
                      @{organizer!.username}
                    </p>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
