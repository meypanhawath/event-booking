"use client";

import { useGetMyEventsQuery } from "@/lib/features/events/eventApi";
import { useGetOrganizerBookingsQuery } from "@/lib/features/bookings/bookingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Ticket,
} from "lucide-react";

const COLORS = ["#C14FE6", "#a855f7", "#8b5cf6", "#6366f1", "#3b82f6"];

export default function AnalyticsPage() {
  const { data: eventsData, isLoading: eventsLoading } = useGetMyEventsQuery({ page: 0, size: 100 });
  const { data: bookingsData, isLoading: bookingsLoading } = useGetOrganizerBookingsQuery({ page: 0, size: 100 });

  const events = eventsData?.content ?? [];
  const bookings = bookingsData?.content ?? [];

  // Calculate stats
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalTickets = bookings.reduce((sum, b) => sum + (b.details?.reduce((dSum, d) => dSum + d.qty, 0) || 0), 0);
  
  // Revenue by event
  const revenueByEvent = events.map(event => ({
    name: event.title.length > 20 ? event.title.substring(0, 20) + "..." : event.title,
    revenue: bookings
      .filter(b => b.event?.id === event.id)
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    tickets: bookings
      .filter(b => b.event?.id === event.id)
      .reduce((sum, b) => sum + (b.details?.reduce((dSum, d) => dSum + d.qty, 0) || 0), 0),
  })).filter(e => e.revenue > 0);

  // Status distribution
  const statusCounts = {
    PENDING: bookings.filter(b => b.status === "PENDING").length,
    CONFIRMED: bookings.filter(b => b.status === "CONFIRMED").length,
    REJECTED: bookings.filter(b => b.status === "REJECTED").length,
    CANCELLED: bookings.filter(b => b.status === "CANCELLED").length,
  };

  const pieData = [
    { name: "Pending", value: statusCounts.PENDING, color: "#f59e0b" },
    { name: "Confirmed", value: statusCounts.CONFIRMED, color: "#10b981" },
    { name: "Rejected", value: statusCounts.REJECTED, color: "#ef4444" },
    { name: "Cancelled", value: statusCounts.CANCELLED, color: "#6b7280" },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-muted-foreground mt-1">
          Insights into your event performance
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#C14FE6]" />
          </CardHeader>
          <CardContent>
            {bookingsLoading ? <Skeleton className="h-8 w-24" /> : (
              <div className="text-2xl font-bold text-[#C14FE6]">${totalRevenue.toFixed(2)}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {bookingsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold text-emerald-500">{totalTickets}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {eventsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold text-amber-500">{events.length}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Revenue/Event</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#C14FE6]" />
          </CardHeader>
          <CardContent>
            {eventsLoading || bookingsLoading ? <Skeleton className="h-8 w-24" /> : (
              <div className="text-2xl font-bold text-[#C14FE6]">
                ${events.length > 0 ? (totalRevenue / events.length).toFixed(2) : "0.00"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Revenue by Event */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Event</CardTitle>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : revenueByEvent.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No revenue data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={256}>
                <BarChart data={revenueByEvent}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))" }}
                  />
                  <Bar dataKey="revenue" fill="#C14FE6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : pieData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No booking data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={256}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [value, name]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}