"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Ticket,
  MapPin,
  Calendar,
  Tag,
  X,
  CreditCard,
} from "lucide-react";
import type { BookingResponse } from "@/lib/types/booking";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  booking: BookingResponse;
  compact?: boolean;
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: Ban,
  },
};

import { Clock, CheckCircle, XCircle, Ban } from "lucide-react";
import { useCancelBookingMutation } from "@/lib/features/bookings/bookingApi";

export function BookingCard({ booking, compact = false }: BookingCardProps) {
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const handleCancel = async () => {
    try {
      await cancelBooking(booking.id).unwrap();
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  const status = statusConfig[booking.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  if (compact) {
    return (
      <div className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
        {/* Thumbnail */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={booking.event.thumbnailUrl || "/placeholder-event.jpg"}
            alt={booking.event.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium text-foreground truncate">
                {booking.event.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {format(new Date(booking.event.startDate), "MMM d, yyyy")}
              </p>
            </div>
            <Badge className={cn("text-xs", status.color)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>

          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5" />
              {booking.details.length} ticket type(s)
            </span>
            <span className="font-medium text-foreground">
              ${booking.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Event Image */}
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
          <Image
            src={booking.event.thumbnailUrl || "/placeholder-event.jpg"}
            alt={booking.event.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Link
                href={`/events/${booking.event.id}`}
                className="text-lg font-semibold text-foreground hover:text-[#C14FE6] transition-colors"
              >
                {booking.event.title}
              </Link>

              <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(booking.event.startDate), "PPP")}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {booking.event.location}
                </span>
              </div>
            </div>

            <Badge className={cn(status.color)}>
              <StatusIcon className="w-3.5 h-3.5 mr-1" />
              {status.label}
            </Badge>
          </div>

          {/* Ticket Details */}
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-foreground">Tickets:</p>
            {booking.details.map((detail) => (
              <div
                key={detail.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#C14FE6]" />
                  {detail.qty}x {detail.ticket.type}
                  {detail.ticketCode && (
                    <span className="text-xs bg-[#C14FE6]/10 text-[#C14FE6] px-2 py-0.5 rounded">
                      {detail.ticketCode}
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground">
                  ${detail.subtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold text-[#C14FE6]">
                ${booking.totalAmount.toFixed(2)}
              </p>
            </div>

            <div className="flex gap-2">
              {booking.status === "PENDING" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleCancel}
                    disabled={isCancelling}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                  <Link href={`/bookings/${booking.id}/payment`}>
                    <Button size="sm" className="bg-[#C14FE6] hover:bg-[#a855f7]">
                      <CreditCard className="w-4 h-4 mr-1" />
                      Pay Now
                    </Button>
                  </Link>
                </>
              )}

              {booking.status === "CONFIRMED" && booking.details.some(d => d.ticketCode) && (
                <div className="flex gap-2">
                  {booking.details.map((detail) =>
                    detail.ticketCode ? (
                      <span
                        key={detail.id}
                        className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-mono"
                      >
                        <Ticket className="w-3 h-3" />
                        {detail.ticketCode}
                      </span>
                    ) : null
                  )}
                </div>
              )}
            </div>
          </div>

          {booking.organizerRemark && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 text-sm text-red-700">
              <p className="font-medium">Organizer Note:</p>
              <p>{booking.organizerRemark}</p>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}