"use client";

import { useGetMeQuery } from "@/lib/features/auth/authApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Ticket, Calendar, Clock } from "lucide-react";
import { BookingCard } from "@/components/dashboard/booking-card";
import { ProfileCard } from "@/components/dashboard/profile-card";
import { useGetMyBookingsQuery } from "@/lib/features/bookings/bookingApi";

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useGetMeQuery();
  const { data: bookingsData, isLoading: bookingsLoading } = useGetMyBookingsQuery({
    page: 0,
    size: 5,
  });

  const recentBookings = bookingsData?.content ?? [];
  const totalBookings = bookingsData?.totalElements ?? 0;

  // Count bookings by status
  const pendingCount = recentBookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = recentBookings.filter((b) => b.status === "CONFIRMED").length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.firstName || user?.username}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
            <Ticket className="h-4 w-4 text-[#C14FE6]" />
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{totalBookings}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-amber-500">{pendingCount}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confirmed
            </CardTitle>
            <Calendar className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-emerald-500">{confirmedCount}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card - Takes 1 column */}
        <div className="lg:col-span-1">
          {userLoading ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
                <Skeleton className="h-3 w-48 mx-auto" />
              </CardContent>
            </Card>
          ) : (
            <ProfileCard user={user} />
          )}
        </div>

        {/* Recent Bookings - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No bookings yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Browse events and book your first ticket!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} compact />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}