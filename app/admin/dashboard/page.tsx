"use client";

import { useGetPendingOrganizersQuery, useGetAllUsersQuery } from "@/lib/features/admin/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  UserCheck,
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

export default function AdminDashboardPage() {
  const { data: pendingData, isLoading: pendingLoading } = useGetPendingOrganizersQuery({ size: 5 });
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery({ size: 100 });

  const pendingCount = pendingData?.totalElements || 0;
  const rejectingCount = pendingData?.totalElements || 0;
  const totalUsers = usersData?.totalElements || 0;
  const allUsers = usersData?.content ?? [];
  const approvedCount = allUsers.filter((user) => user.organizerStatus === "ACCEPTED").length;
  const roleMix = [
    { name: "Customers", value: allUsers.filter((user) => user.roles?.includes("ROLE_CUSTOMER")).length, fill: "#c14fe6" },
    { name: "Organizers", value: allUsers.filter((user) => user.roles?.includes("ROLE_ORGANIZER")).length, fill: "#10b981" },
    { name: "Admins", value: allUsers.filter((user) => user.roles?.includes("ROLE_ADMIN")).length, fill: "#f59e0b" },
  ];
  const organizerStatuses = [
    { label: "Pending", total: pendingCount },
    { label: "Approved", total: approvedCount },
    { label: "Rejected", total: rejectingCount },
  ];
  const chartConfig = {
    total: { label: "Users", color: "#c14fe6" },
  } satisfies ChartConfig;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Pending Organizers",
      value: pendingCount,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Approved Organizers",
      value: approvedCount,
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Rejected Organizers",
      value: rejectingCount,
      icon: ShieldAlert,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Manage your event booking platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                    <Icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  {stat.title === "Pending Organizers" && pendingCount > 0 && (
                    <Badge className="bg-red-500 text-white animate-pulse">
                      {pendingCount} new
                    </Badge>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold">{usersLoading && stat.title === "Total Users" ? "..." : stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="rounded-3xl border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Organizer Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <Skeleton className="h-72 w-full rounded-2xl" />
            ) : (
              <ChartContainer config={chartConfig} className="h-72 w-full">
                <BarChart data={organizerStatuses}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="var(--color-total)" radius={12} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">User Role Type</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <Skeleton className="h-72 w-full rounded-2xl" />
            ) : (
              <ChartContainer config={chartConfig} className="h-72 w-full">
                <PieChart>
                  <Pie data={roleMix} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} />
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Pending Organizers */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg">Recent Pending Applications</CardTitle>
            <p className="text-sm text-muted-foreground">
              Organizer applications awaiting review
            </p>
          </div>
          <Link href="/admin/dashboard/organizers">
            <Button variant="outline" size="sm" className="gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {pendingLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : pendingData?.content && pendingData.content.length > 0 ? (
            <div className="space-y-3">
              {pendingData.content.slice(0, 5).map((user) => (
                <div
                  key={user.uuid}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#C14FE6]/10 flex items-center justify-center">
                      <span className="font-bold text-[#C14FE6]">
                        {user.username[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.orgName && (
                        <p className="text-xs text-muted-foreground">Org: {user.orgName}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                      PENDING
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {user.appliedAt
                        ? new Date(user.appliedAt).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No pending applications</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/dashboard/organizers">
          <Card className="border-border/50 hover:border-[#C14FE6]/30 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C14FE6]/10 flex items-center justify-center group-hover:bg-[#C14FE6]/20 transition-colors">
                <UserCheck className="w-6 h-6 text-[#C14FE6]" />
              </div>
              <div>
                <p className="font-medium">Review Organizers</p>
                <p className="text-sm text-muted-foreground">Approve or reject applications</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-[#C14FE6] transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/dashboard/users">
          <Card className="border-border/50 hover:border-[#C14FE6]/30 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Manage Users</p>
                <p className="text-sm text-muted-foreground">View and manage all users</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-blue-600 transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/dashboard/categories">
          <Card className="border-border/50 hover:border-[#C14FE6]/30 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium">Categories</p>
                <p className="text-sm text-muted-foreground">Manage event categories</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-emerald-600 transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
