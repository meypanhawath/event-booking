"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  PlusCircle,
  MapPin,
  Users,
  Pencil,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useDeleteEventMutation, useGetMyEventsQuery } from "@/lib/features/events/eventsApi";

export default function MyEventsPage() {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const { data, isLoading, isError } = useGetMyEventsQuery({ page, size: pageSize });
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const events = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id).unwrap();
      toast.success("Event deleted successfully");
    } catch {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600">Failed to load events</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No events yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Create your first event and start selling tickets!
            </p>
            <Link href="/organizer/dashboard/events/create">
              <Button className="mt-6 bg-[#C14FE6] hover:bg-[#a855f7]">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const isUpcoming = new Date(event.startDate) > new Date();
              return (
                <Card key={event.id} className="overflow-hidden group">
                  {/* Thumbnail */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={event.thumbnailUrl || "/placeholder-event.jpg"}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={isUpcoming ? "bg-[#C14FE6] text-white" : "bg-gray-500 text-white"}>
                        {isUpcoming ? "Upcoming" : "Past"}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-1">{event.title}</h3>
                    
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
	                      <div className="flex items-center gap-2">
	                        <Users className="w-4 h-4" />
	                        {event.tickets.reduce((sum, ticket) => sum + (ticket.soldCount ?? 0), 0)} tickets sold
	                      </div>
	                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link href={`/organizer/dashboard/events/${event.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/organizer/dashboard/events/${event.id}/bookings`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <ArrowRight className="w-4 h-4 mr-1" />
                          Bookings
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDelete(event.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
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
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
