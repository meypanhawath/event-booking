"use client";

import { Calendar, MapPin, Star, Ticket } from "lucide-react";
import Link from "next/link";
import type { Event } from "@/lib/types/event";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  // Get lowest price from tickets
  const lowestPrice =
    event.tickets.length > 0
      ? Math.min(...event.tickets.map((t) => t.price))
      : 0;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-accent/50">
        {/* Thumbnail */}
        <div className="relative aspect-16/10 overflow-hidden">
          <img
            src={event.thumbnailUrl}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

          {/* Category Badge */}
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm dark:bg-black/80 dark:text-white">
            {event.category.name}
          </span>

          {/* Status Badge */}
          {event.status === "UPCOMING" && (
            <span className="absolute right-3 top-3 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Upcoming
            </span>
          )}

          {/* Rating */}
          {event.rating > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
              <Star className="size-3 fill-yellow-400 text-yellow-400" />
              <span>{event.rating}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="line-clamp-1 text-base font-semibold text-foreground">
            {event.title}
          </h3>

          <p className="mt-1 line-clamp-1 overflow-hidden text-sm text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]">
            {event.description}
          </p>

          {/* Date & Location */}
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              <span>{formatDate(event.startDate)}</span>
            </div>
            <div className="flex min-w-0 items-center justify-end gap-1 text-right">
              <MapPin className="size-3.5" />
              <span className="truncate">
                {event.organizer?.orgName ?? "Unknown"}
              </span>
            </div>
          </div>

          {/* Organizer */}
          {event.organizer && (
            <div className="sr-only">{event.organizer.orgName}</div>
          )}

          {/* Price */}
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-1">
              <Ticket className="size-4 text-accent" />
              {lowestPrice === 0 ? (
                <span className="text-sm font-semibold tracking-wide text-brand-main">
                  Free
                </span>
              ) : (
                <span className="text-sm font-semibold tracking-wide text-brand-main">
                  {`From $${lowestPrice}`}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {event.tickets.reduce((acc, t) => acc + t.available, 0)} left
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
