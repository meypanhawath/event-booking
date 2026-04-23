"use client";

import { Goal, Music4, PartyPopper, Ticket } from "lucide-react";
import Link from "next/link";

import Navbar from "@/components/ui/navbar";
import { TrustByCompany } from "@/components/ui/trust-by-company";
import { EventCard } from "@/components/event-card";
import { useGetEventsQuery } from "@/lib/features/events/eventsApi";
import { Review } from "@/components/ui/review";

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
] as const;

export default function Home() {
  const { data: eventsData, isLoading, isError, error } = useGetEventsQuery();
  const events = eventsData?.content ?? [];

  // Group events by category
  const eventsByCategory = events.reduce((acc, event) => {
    const categoryName = event.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
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
                  What <span className="text-[#C14FE6]">Event</span> would
                  <br className="hidden sm:block" /> you like to go to?
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground sm:text-base">
                  More than {eventsData?.totalElements ?? 0} events in different
                  categories are now available to you.
                </p>
              </div>

              {/* Category Quick Select */}
              <div className="mt-12 w-full max-w-5xl rounded-[22px] border border-border bg-card/90 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur dark:shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                <div className="flex flex-wrap gap-2 border-b border-border p-4 sm:gap-0 sm:p-5 justify-around">
                  {categories.map(({ label, icon: Icon, accent }) => (
                    <Link
                      key={label}
                      href={`/events?category=${label.toLowerCase()}`}
                      className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-left text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground sm:justify-start"
                    >
                      <span
                        className={`inline-flex size-5 items-center justify-center rounded-full bg-linear-to-br ${accent}`}
                      >
                        <Icon className="size-3" />
                      </span>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Dynamic Category Sections */}
        {Object.entries(eventsByCategory).map(([categoryName, categoryEvents]) => (
          <section key={categoryName} className="container mx-auto mt-12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {categoryName} Events
                </h2>
              </div>
              <Link
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
                href="/events"
              >
                See all
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryEvents.slice(0, 4).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {categoryEvents.length === 0 && (
              <div className="mt-12 text-center">
                <p className="text-muted-foreground">No {categoryName.toLowerCase()} events found.</p>
              </div>
            )}
          </section>
        ))}

        <section className="container mx-auto mt-12 px-4 sm:px-6 lg:px-8 w-full pt-20">
          <TrustByCompany />
        </section>

        <section className="mt-10 w-full pt-15 pb-15">
          <Review />
        </section>
      </div>
    </main>
  );
}