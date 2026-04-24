"use client";

import { useAppSelector } from "@/lib/hooks";
import { useGetMeQuery } from "@/lib/features/auth/authApi";
import {
  LayoutDashboard,
  Ticket,
  Store,
  UserRoundCog,
} from "lucide-react";
import { hasRole } from "@/lib/auth-utils";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Skeleton } from "@/components/ui/skeleton";

const customerNavItems = [
  { label: "Overview", href: "/user/dashboard", icon: LayoutDashboard },
  { label: "Edit Profile", href: "/user/dashboard/profile", icon: UserRoundCog },
  { label: "My Bookings", href: "/user/dashboard/bookings", icon: Ticket },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user: reduxUser } = useAppSelector((state) => state.auth);
  const { data: userData, isLoading } = useGetMeQuery();

  const currentUser = userData || reduxUser;
  const isOrganizer = hasRole(currentUser?.roles, "ROLE_ORGANIZER");
  const isAdmin = hasRole(currentUser?.roles, "ROLE_ADMIN");

  const navItems = [...customerNavItems];
  if (!isOrganizer && !isAdmin) {
    navItems.push({ label: "Become Organizer", href: "/user/dashboard/apply-organizer", icon: Store });
  }

  if (isLoading && !currentUser) {
    return <div className="p-8"><Skeleton className="h-96 w-full rounded-3xl" /></div>;
  }

  return (
    <DashboardShell
      title="Customer Dashboard"
      subtitle=""
      items={navItems}
      user={currentUser}
    >
      {children}
    </DashboardShell>
  );
}
