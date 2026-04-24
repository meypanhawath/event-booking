"use client";

import { TrustByCompany } from "@/components/ui/trust-by-company"
import { useGetEventsQuery } from "@/lib/features/events/eventsApi";
import { Review } from "@/components/ui/review";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { SportsAndGamesSections } from "@/components/home/sports-and-games-section";
import { TrustByPeople } from "@/components/ui/increase";
import { TypingAnimationDemo2 } from "@/components/ui/typing-animation-demo-2";

export default function Home() {
  const { data: eventsData, isLoading } = useGetEventsQuery();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
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
        <div className="relative isolate min-h-screen top-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8f4fb_42%,#f3eef8_100%)] dark:bg-[#09080f]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(193,79,230,0.14),transparent_34%),radial-gradient(circle_at_0%_100%,rgba(193,79,230,0.08),transparent_28%),radial-gradient(circle_at_100%_100%,rgba(15,23,42,0.06),transparent_24%)] dark:hidden"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.68)_0%,rgba(250,247,252,0.58)_35%,rgba(243,238,248,0.92)_100%)] dark:bg-[linear-gradient(180deg,rgba(6,5,10,0.84)_0%,rgba(16,9,30,0.72)_35%,rgba(8,8,11,0.9)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_2%,rgba(193,79,230,0.12),transparent_42%),radial-gradient(circle_at_15%_100%,rgba(193,79,230,0.08),transparent_44%),radial-gradient(circle_at_85%_100%,rgba(148,163,184,0.08),transparent_44%)] dark:bg-[radial-gradient(circle_at_50%_2%,rgba(193,79,230,0.28),transparent_36%),radial-gradient(circle_at_15%_100%,rgba(2,6,23,0.52),transparent_40%),radial-gradient(circle_at_85%_100%,rgba(2,6,23,0.5),transparent_40%)]"
          />
          {/* <Navbar /> */}
          <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-9xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
            <section className="flex flex-1 flex-col items-center justify-center pt-16 text-center sm:pt-20">
              <div className="max-w-4xl">
                <h1 className="text-balance text-4xl font-bold leading-none tracking-tight text-foreground sm:text-6xl lg:text-7xl dark:text-white">
                  What{" "}
                  <span className="text-[#C14FE6]">
                    <TypingAnimationDemo2 />{" "}
                  </span>{" "}
                  would
                  <br className="hidden sm:block" /> you like to go to?
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-200">
                  More than {eventsData?.totalElements ?? 0} events in different
                  categories are now available to you.
                </p>
              </div>

              {/* Category Quick Select */}
              <TrustByPeople />
            </section>
          </div>
        </div>

        <FeaturedProductsSection />

        <SportsAndGamesSections />

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
