"use client";

import { useState } from "react";
import { useGetEventBookingsQuery } from "@/lib/features/bookings/bookingApi";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Ticket,
  SlidersHorizontal,
  User,
  Calendar,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { useGetMyEventsQuery } from "@/lib/features/events/eventsApi";

type StatusFilter = "ALL" | "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";

export default function OrganizerBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const { data: eventsData, isLoading: isLoadingEvents } = useGetMyEventsQuery({
    page: 0,
    size: 1,
  });
  const firstEventId = eventsData?.content?.[0]?.id;

  const { data, isLoading, isError } = useGetEventBookingsQuery(
    { eventId: firstEventId ?? 0, page, size: pageSize },
    { skip: !firstEventId }
  );

  const allBookings = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const filteredBookings =
    statusFilter === "ALL"
      ? allBookings
      : allBookings.filter((b) => b.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Event Bookings</h2>
          <p className="text-muted-foreground mt-1">
            {totalElements} total booking{totalElements !== 1 ? "s" : ""} across your events
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as StatusFilter);
              setPage(0);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings List */}
      {isLoading || isLoadingEvents ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !firstEventId ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Create an event first to start receiving bookings.
            </p>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600">Failed to load bookings</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">
              {statusFilter === "ALL" ? "No bookings yet" : `No ${statusFilter.toLowerCase()} bookings`}
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              {statusFilter === "ALL"
                ? "Bookings will appear here when customers purchase tickets."
                : "Try selecting a different status filter."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C14FE6]/10 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-[#C14FE6]" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {booking.customer?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.customer?.email}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {booking.event?.title}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          ${booking.totalAmount?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={
                      booking.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" :
                      booking.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }>
                      {booking.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {booking.details?.reduce((sum, d) => sum + d.qty, 0)} tickets
                    </span>
                    {booking.event?.id ? (
                      <Link href={`/organizer/dashboard/events/${booking.event.id}/bookings`}>
                        <Button size="sm" variant="outline">
                          <ArrowRight className="w-4 h-4 mr-1" />
                          Verify
                        </Button>
                      </Link>
                    ) : null}
                  </div>
                </div>

                {/* Ticket Details */}
                {booking.details && booking.details.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex flex-wrap gap-2">
                      {booking.details.map((detail) => (
                        <span
                          key={detail.id}
                          className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded"
                        >
                          <Ticket className="w-3 h-3" />
                          {detail.qty}x {detail.ticket?.type}
                          {detail.ticketCode && (
                            <span className="font-mono text-[#C14FE6] ml-1">
                              {detail.ticketCode}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || isLoading}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || isLoading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
