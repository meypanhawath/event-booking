"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CreditCard,
  LogOut,
  Search,
  Settings,
  Ticket,
  User,
} from "lucide-react";

import { useGetTicketsQuery } from "@/lib/features/tickets/ticketsApi";
import type { TicketListItem, TicketStatus } from "@/lib/types/ticket";

const PAGE_SIZE = 8;

const tabs: Array<{ key: TicketStatus; label: string }> = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "CANCELED", label: "Canceled" },
  { key: "COMPLETED", label: "Completed" },
];

const statusStyles: Record<TicketListItem["status"], string> = {
  COMPLETED: "bg-emerald-500/15 text-emerald-400",
  PENDING: "bg-amber-500/15 text-amber-300",
  CANCELED: "bg-rose-500/15 text-rose-400",
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatOrderDate = (dateValue: string) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  const datePart = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} • ${timePart}`;
};

export default function UserTicketsPage() {
  const [activeTab, setActiveTab] = useState<TicketStatus>("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useGetTicketsQuery({
    page: 0,
    size: 100,
    sort: "createdAt,desc",
  });

  const tickets = data?.items ?? [];

  const counts = useMemo(() => {
    const bucket = {
      ALL: tickets.length,
      PENDING: 0,
      CANCELED: 0,
      COMPLETED: 0,
    } satisfies Record<TicketStatus, number>;

    for (const ticket of tickets) {
      bucket[ticket.status] += 1;
    }

    return bucket;
  }, [tickets]);

  const filteredTickets = useMemo(
    () =>
      tickets.filter((ticket) =>
        activeTab === "ALL" ? true : ticket.status === activeTab,
      ),
    [activeTab, tickets],
  );

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageTickets = filteredTickets.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const pageButtons = Array.from(
    { length: Math.min(totalPages, 3) },
    (_, index) => {
      if (totalPages <= 3) {
        return index + 1;
      }

      const start = Math.max(1, Math.min(safePage - 1, totalPages - 2));
      return start + index;
    },
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(193,79,230,0.08),transparent_40%),#090a0f] px-4 py-4 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-border bg-card/70 p-4 backdrop-blur lg:h-[calc(100vh-2rem)] lg:sticky lg:top-4">
          <div className="rounded-xl bg-black/20 px-3 py-4 text-center text-2xl font-black italic tracking-tight text-brand-main">
            Event Booking
          </div>

          <nav className="mt-6 space-y-1">
            <button className="flex w-full items-center gap-2 rounded-xl border-l-2 border-brand-main bg-brand-main/10 px-3 py-2 text-sm text-brand-main">
              <Ticket className="size-4" />
              Tickets
            </button>
            <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <User className="size-4" />
              Personal Info
            </button>
            <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <CreditCard className="size-4" />
              Payment
            </button>
            <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <Bell className="size-4" />
              Notification
            </button>
          </nav>

          <div className="my-5 border-t border-border" />

          <div className="space-y-1">
            <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <Settings className="size-4" />
              Setting
            </button>
            <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <LogOut className="size-4" />
              Log out
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-brand-main/25 bg-[linear-gradient(160deg,rgba(193,79,230,0.2),rgba(114,29,139,0.25))] p-4">
            <p className="text-sm font-semibold text-foreground">
              Upgrade your plan
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Unlock additional features and premium seats.
            </p>
            <button className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-brand-main px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-main/90">
              See plans
            </button>
          </div>
        </aside>

        <section className="rounded-3xl border border-border bg-card/60 p-4 backdrop-blur sm:p-6 lg:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-11 w-full rounded-xl border border-border bg-background/70 pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-brand-main"
                placeholder="Search ticket by title"
              />
            </label>

            <div className="flex items-center gap-3">
              <button className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition hover:text-foreground">
                <Bell className="size-4" />
              </button>
              <button className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground">
                EN
                <ChevronDown className="size-4" />
              </button>
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-brand-main text-sm font-semibold text-white">
                EB
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-background/40 p-3 sm:p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
              <div className="flex flex-wrap items-center gap-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.key);
                        setPage(1);
                      }}
                      className={[
                        "rounded-lg px-3 py-2 text-sm transition",
                        isActive
                          ? "border-b-2 border-brand-main bg-brand-main/10 text-brand-main"
                          : "text-muted-foreground hover:text-foreground",
                      ].join(" ")}
                    >
                      {tab.label} ({counts[tab.key]})
                    </button>
                  );
                })}
              </div>
              <div className="text-sm text-muted-foreground">Sort by</div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-xl bg-muted/40"
                  />
                ))}
              </div>
            ) : null}

            {isError ? (
              <div className="rounded-xl border border-rose-900/40 bg-rose-950/30 px-4 py-3 text-sm text-rose-300">
                {error && "status" in error
                  ? `Failed to load tickets (Error ${error.status})`
                  : "Failed to load tickets."}
              </div>
            ) : null}

            {!isLoading && !isError ? (
              <div className="space-y-3">
                {pageTickets.length > 0 ? (
                  pageTickets.map((ticket) => (
                    <article
                      key={`${ticket.id}-${ticket.reference}`}
                      className="rounded-xl border border-border bg-card/70 px-3 py-4 sm:px-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <Circle className="mt-1 size-4 text-muted-foreground" />
                          <div>
                            <h3 className="text-base font-semibold text-foreground">
                              {ticket.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {ticket.reference}
                            </p>
                          </div>
                        </div>
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-xs font-medium",
                            statusStyles[ticket.status],
                          ].join(" ")}
                        >
                          {ticket.status[0] +
                            ticket.status.slice(1).toLowerCase()}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 border-t border-border pt-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                        <p className="text-muted-foreground">
                          <span className="mr-2 text-foreground">
                            Order Date
                          </span>
                          {formatOrderDate(ticket.orderDate)}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="mr-2 text-foreground">
                            Total paid
                          </span>
                          {formatMoney(ticket.totalPaid)}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="mr-2 text-foreground">Tickets</span>
                          {ticket.quantity}
                        </p>
                        <button className="justify-self-start text-brand-main transition hover:text-brand-tint-300 lg:justify-self-end">
                          Ticket Details
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-xl border border-border bg-card/70 px-4 py-6 text-center text-sm text-muted-foreground">
                    No tickets found.
                  </div>
                )}
              </div>
            ) : null}

            {!isLoading && !isError && totalPages > 1 ? (
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage === 1}
                  className="inline-flex size-7 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:text-foreground disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>

                {pageButtons.map((buttonPage) => {
                  const isActive = buttonPage === safePage;
                  return (
                    <button
                      key={buttonPage}
                      type="button"
                      onClick={() => setPage(buttonPage)}
                      className={[
                        "inline-flex size-7 items-center justify-center rounded-full text-xs transition",
                        isActive
                          ? "bg-brand-main text-white"
                          : "border border-border text-muted-foreground hover:text-foreground",
                      ].join(" ")}
                    >
                      {buttonPage}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={safePage === totalPages}
                  className="inline-flex size-7 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:text-foreground disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
