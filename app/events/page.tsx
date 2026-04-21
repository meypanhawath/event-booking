"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import FilterPage from "@/components/ui/filter";
import { EventCard } from "@/components/event-card";
import { useGetEventsQuery } from "@/lib/features/events/eventsApi";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PRICE_RANGES = ["50-100", "100-200", "200-300", "400-500"] as const;

const PAGE_SIZE = 8;

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeWhen, setActiveWhen] = useState("All");
  const [activeWhere, setActiveWhere] = useState("All");
  const [activePrice, setActivePrice] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    data: eventsData,
    isLoading,
    isError,
    error,
  } = useGetEventsQuery({
    page: 0,
    size: 200,
  });

  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  const events = eventsData?.content ?? [];
  const totalElements = eventsData?.totalElements ?? 0;

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

  // Pagination for filtered results
  const totalFilteredPages = Math.ceil(filteredEvents.length / PAGE_SIZE);
  const paginatedEvents = filteredEvents.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [activeCategory, activeWhen, activeWhere, activePrice]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {paginatedEvents.length > 0 ? (
          paginatedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="col-span-full pb-6 text-center">
            <p className="text-sm text-muted-foreground">No events found</p>
          </div>
        )}
      </section>

      {totalFilteredPages > 1 && (
        <section className="mt-12 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentPage === 0}
                />
              </PaginationItem>

              {Array.from(
                { length: Math.min(totalFilteredPages, 5) },
                (_, i) => {
                  const pageNum = i;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                },
              )}

              {totalFilteredPages > 5 &&
                currentPage < totalFilteredPages - 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(totalFilteredPages - 1, prev + 1),
                    )
                  }
                  disabled={currentPage === totalFilteredPages - 1}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
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
