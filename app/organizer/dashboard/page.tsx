"use client";

import { useGetEventBookingsQuery } from "@/lib/features/bookings/bookingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
  Calendar,
  Ticket,
  DollarSign,
  TrendingUp,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { useGetMyEventsQuery } from "@/lib/features/events/eventsApi";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

export default function OrganizerOverviewPage() {
  const { data: eventsData, isLoading: eventsLoading } = useGetMyEventsQuery({ page: 0, size: 5 });

  // Get bookings for first event to show stats
  const firstEventId = eventsData?.content?.[0]?.id;
  const { data: bookingsData, isLoading: bookingsLoading } = useGetEventBookingsQuery(
    firstEventId ? { eventId: firstEventId, page: 0, size: 100 } : { eventId: 0, page: 0, size: 1 },
    { skip: !firstEventId }
  );

  const events = useMemo(() => eventsData?.content ?? [], [eventsData?.content]);
  const totalEvents = eventsData?.totalElements ?? 0;

  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.startDate) > now).length;

  // Calculate total tickets sold across all events
  const totalTicketsSold = useMemo(() => {
    return events.reduce((sum, event) => {
      return sum + event.tickets.reduce((tSum, t) => tSum + (t.soldCount || 0), 0);
    }, 0);
  }, [events]);

  // Revenue from bookings (if available)
  const totalRevenue = bookingsData?.content?.reduce((sum, b) => sum + (b.totalAmount || 0), 0) ?? 0;
  const chartConfig = {
    sold: { label: "Tickets sold", color: "#c14fe6" },
    upcoming: { label: "Upcoming", color: "#10b981" },
  } satisfies ChartConfig;
  const eventPerformance = events.slice(0, 6).map((event) => ({
    name: event.title.length > 12 ? `${event.title.slice(0, 12)}...` : event.title,
    sold: event.tickets.reduce((sum, ticket) => sum + (ticket.soldCount || 0), 0),
  }));
  const mixData = [
    { name: "Upcoming", value: upcomingEvents, fill: "#10b981" },
    { name: "Past", value: Math.max(totalEvents - upcomingEvents, 0), fill: "#f59e0b" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
        </div>
        <Link href="/organizer/dashboard/events/create">
          <Button className="bg-[#C14FE6] hover:bg-[#a855f7]">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-[#C14FE6]" />
          </CardHeader>
          <CardContent>
            {eventsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold">{totalEvents}</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {eventsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold text-emerald-500">{upcomingEvents}</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {eventsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold text-amber-500">{totalTicketsSold}</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#C14FE6]" />
          </CardHeader>
          <CardContent>
            {bookingsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold text-[#C14FE6]">${totalRevenue.toFixed(2)}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Event Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <Skeleton className="h-72 w-full rounded-2xl" />
            ) : eventPerformance.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted-foreground">
                Your event analytics will appear here once you publish events.
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-72 w-full">
                <BarChart data={eventPerformance}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sold" radius={12} fill="var(--color-sold)" />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Event Mix</CardTitle>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <Skeleton className="h-72 w-full rounded-2xl" />
            ) : (
              <ChartContainer config={chartConfig} className="h-72 w-full">
                <PieChart>
                  <Pie data={mixData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={92} />
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Events</CardTitle>
          <Link href="/organizer/dashboard/events">
            <Button variant="ghost" size="sm" className="text-[#C14FE6]">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No events yet</p>
              <Link href="/organizer/dashboard/events/create">
                <Button className="mt-4 bg-[#C14FE6] hover:bg-[#a855f7]">
                  Create your first event
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={event.thumbnailUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.startDate).toLocaleDateString()} · {event.location}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {event.tickets.reduce((sum, t) => sum + t.soldCount, 0)} sold
                        </span>
                        <span className="text-xs text-[#C14FE6]">
                          {event.tickets.reduce((sum, t) => sum + t.available, 0)} available
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/organizer/dashboard/events/${event.id}/bookings`}>
                    <Button variant="ghost" size="sm">
                      Manage
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
