"use client";

import { useGetMeQuery } from "@/lib/features/auth/authApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Ticket, Calendar, Clock, Activity } from "lucide-react";
import { BookingCard } from "@/components/dashboard/booking-card";
import { ProfileCard } from "@/components/dashboard/profile-card";
import { useGetMyBookingsQuery } from "@/lib/features/bookings/bookingApi";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

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
  const bookingTrend = recentBookings
    .slice()
    .reverse()
    .map((booking, index) => ({
      label: `#${index + 1}`,
      amount: booking.totalAmount ?? 0,
    }));
  const chartConfig = {
    amount: { label: "Amount", color: "#c14fe6" },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-3xl border-border/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
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

        <Card className="rounded-3xl border-border/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
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

        <Card className="rounded-3xl border-border/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
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
        <Card className="rounded-3xl border-border/70 bg-[linear-gradient(135deg,rgba(193,79,230,0.12),rgba(193,79,230,0.03))]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Activity
            </CardTitle>
            <Activity className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentBookings.length}</div>
            <p className="mt-1 text-sm text-muted-foreground">Recent booking actions in this view</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.8fr]">
        <div className="space-y-6">
          {userLoading ? (
            <Card className="rounded-3xl">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
                <Skeleton className="h-3 w-48 mx-auto" />
              </CardContent>
            </Card>
	          ) : (
	            <ProfileCard user={user ?? null} />
	          )}
          <Card className="rounded-3xl border-border/70">
            <CardHeader>
              <CardTitle className="text-lg">Booking Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <Skeleton className="h-64 w-full rounded-2xl" />
              ) : bookingTrend.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted-foreground">
                  Your booking chart will appear here after you make a reservation.
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-64 w-full">
                  <AreaChart data={bookingTrend}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="var(--color-amount)"
                      fill="var(--color-amount)"
                      fillOpacity={0.18}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="rounded-3xl border-border/70">
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
