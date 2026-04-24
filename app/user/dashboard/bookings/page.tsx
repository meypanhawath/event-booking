"use client";

import { useState } from "react";
import { BookingCard } from "@/components/dashboard/booking-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ticket, SlidersHorizontal } from "lucide-react";
import { useGetMyBookingsQuery } from "@/lib/features/bookings/bookingApi";

type StatusFilter = "ALL" | "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";

export default function MyBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, isLoading, isError } = useGetMyBookingsQuery({
    page,
    size: pageSize,
  });

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
          <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
          <p className="text-muted-foreground mt-1">
            {totalElements} total booking{totalElements !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filter */}
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
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <Skeleton className="w-full sm:w-48 h-48 sm:h-auto" />
                  <div className="flex-1 p-5 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600">Failed to load bookings</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">
              {statusFilter === "ALL"
                ? "No bookings yet"
                : `No ${statusFilter.toLowerCase()} bookings`}
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              {statusFilter === "ALL"
                ? "Browse events and book your first ticket to see them here!"
                : "Try selecting a different status filter."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
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
