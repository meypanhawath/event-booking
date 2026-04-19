"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown, SlidersHorizontal, X } from "lucide-react";

import FilterPage from "@/components/ui/filter";
import Navbar from "@/components/ui/navbar";
import { EventCard } from "@/components/event-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetEventsQuery } from "@/lib/features/events/eventsApi";

const PRICE_RANGES = ["50-100", "100-200", "200-300", "400-500"] as const;
const SORT_OPTIONS = [
  "Newest",
  "Oldest",
  "Price: Low to High",
  "Price: High to Low",
  "Rating: High to Low",
] as const;

const SORT_QUERY_MAP: Record<(typeof SORT_OPTIONS)[number], string> = {
  Newest: "startDate,desc",
  Oldest: "startDate,asc",
  "Price: Low to High": "price,asc",
  "Price: High to Low": "price,desc",
  "Rating: High to Low": "rating,desc",
};

const INITIAL_VISIBLE_COUNT = 8;
const SHOW_MORE_STEP = 8;
const FETCH_SIZE = 200;

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeWhen, setActiveWhen] = useState("All");
  const [activeWhere, setActiveWhere] = useState("All");
  const [activePrice, setActivePrice] = useState("All");
  const [activeSort, setActiveSort] =
    useState<(typeof SORT_OPTIONS)[number]>("Newest");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sortQuery = SORT_QUERY_MAP[activeSort];

  const {
    data: eventsData,
    isLoading,
    isError,
    error,
  } = useGetEventsQuery({
    page: 0,
    size: FETCH_SIZE,
    sort: sortQuery,
  });

  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  const events = eventsData?.content ?? [];
  const allFilterEvents = events;

  const getWhenLabel = (dateValue: string) => {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Unknown";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = date
      .toLocaleDateString("en-US", { month: "short" })
      .toLowerCase();
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const getLowestPrice = (event: (typeof allFilterEvents)[number]) =>
    event.tickets.length
      ? Math.min(...event.tickets.map((ticket) => ticket.price))
      : 0;

  const getWhereLabel = (event: (typeof allFilterEvents)[number]) =>
    event.organizer?.orgName ?? "Unknown";

  const matchesPriceRange = (
    event: (typeof allFilterEvents)[number],
    range: string,
  ) => {
    const [min, max] = range.split("-").map((value) => Number(value));
    const lowestPrice = getLowestPrice(event);

    if (Number.isNaN(min) || Number.isNaN(max)) {
      return false;
    }

    return lowestPrice >= min && lowestPrice <= max;
  };

  const categoryFilters = [
    "All",
    ...Array.from(new Set(allFilterEvents.map((event) => event.category.name))),
  ];

  const whenFilters = [
    "All",
    ...Array.from(
      new Set(allFilterEvents.map((event) => getWhenLabel(event.startDate))),
    ),
  ];

  const whereFilters = [
    "All",
    ...Array.from(
      new Set(allFilterEvents.map((event) => getWhereLabel(event))),
    ),
  ];

  const priceFilters = ["All", ...PRICE_RANGES];

  const filteredEvents = allFilterEvents.filter((event) => {
    const matchesCategory =
      activeCategory === "All" || event.category.name === activeCategory;
    const matchesWhen =
      activeWhen === "All" || getWhenLabel(event.startDate) === activeWhen;
    const matchesWhere =
      activeWhere === "All" || getWhereLabel(event) === activeWhere;
    const matchesPrice =
      activePrice === "All" || matchesPriceRange(event, activePrice);

    return matchesCategory && matchesWhen && matchesWhere && matchesPrice;
  });

  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const hasMoreEvents = visibleCount < filteredEvents.length;

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [activeCategory, activeWhen, activeWhere, activePrice, activeSort]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="pb-8 pt-10">
          <Navbar />
        </section>
        <section className="pb-5 pt-6 sm:hidden">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground"
          >
            <SlidersHorizontal className="size-4" />
            Filter events
          </button>
        </section>
        <section className="hidden pb-8 pt-10 sm:block">
          <FilterPage
            categories={categoryFilters}
            activeCategory={activeCategory}
            whenOptions={whenFilters}
            activeWhen={activeWhen}
            whereOptions={whereFilters}
            activeWhere={activeWhere}
            priceOptions={priceFilters}
            activePrice={activePrice}
            onCategoryChange={setActiveCategory}
            onWhenChange={setActiveWhen}
            onWhereChange={setActiveWhere}
            onPriceChange={setActivePrice}
          />
        </section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="pb-8 pt-10">
        <Navbar />
      </section>

      <section className="pb-5 pt-6 sm:hidden">
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          <SlidersHorizontal className="size-4" />
          Filter events
        </button>
      </section>

      <section className="hidden pb-8 pt-10 sm:block">
        <FilterPage
          categories={categoryFilters}
          activeCategory={activeCategory}
          whenOptions={whenFilters}
          activeWhen={activeWhen}
          whereOptions={whereFilters}
          activeWhere={activeWhere}
          priceOptions={priceFilters}
          activePrice={activePrice}
          onCategoryChange={setActiveCategory}
          onWhenChange={setActiveWhen}
          onWhereChange={setActiveWhere}
          onPriceChange={setActivePrice}
        />
      </section>

      {isError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
          <p className="text-sm text-red-600 dark:text-red-400">
            {error && "status" in error
              ? `Failed to load events (Error ${error.status})`
              : "Failed to load events. Please try again later."}
          </p>
        </div>
      )}

      <section className="mb-5 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <ArrowUpDown className="size-4 text-muted-foreground" />
              Sort: {activeSort}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => setActiveSort(option)}
                className={
                  activeSort === option
                    ? "bg-brand-main/10 text-brand-main"
                    : undefined
                }
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visibleEvents.length > 0 ? (
          visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="col-span-full pb-6 text-center">
            <p className="text-sm text-muted-foreground">No events found</p>
          </div>
        )}
      </section>

      {hasMoreEvents && (
        <section className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + SHOW_MORE_STEP)}
            className="inline-flex items-center justify-center rounded-2xl border border-brand-main bg-brand-main px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-brand-main/90"
          >
            Show More
          </button>
        </section>
      )}

      <div
        className={[
          "fixed inset-0 z-50 transition-opacity duration-300 sm:hidden",
          isFilterOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setIsFilterOpen(false)}
          className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
        />

        <aside
          aria-label="Event filters"
          className={[
            "absolute right-0 top-0 h-full w-[88%] max-w-sm border-l border-border bg-background px-4 py-5 shadow-2xl transition-transform duration-300",
            isFilterOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Filters</h2>
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              aria-label="Close filter sidebar"
              className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <FilterPage
            categories={categoryFilters}
            activeCategory={activeCategory}
            whenOptions={whenFilters}
            activeWhen={activeWhen}
            whereOptions={whereFilters}
            activeWhere={activeWhere}
            priceOptions={priceFilters}
            activePrice={activePrice}
            onCategoryChange={(category) => {
              setActiveCategory(category);
              setIsFilterOpen(false);
            }}
            onWhenChange={(value) => {
              setActiveWhen(value);
              setIsFilterOpen(false);
            }}
            onWhereChange={(value) => {
              setActiveWhere(value);
              setIsFilterOpen(false);
            }}
            onPriceChange={(value) => {
              setActivePrice(value);
              setIsFilterOpen(false);
            }}
          />
        </aside>
      </div>
    </main>
  );
}
