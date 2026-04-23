"use client";

import { useAppSelector } from "@/lib/hooks";
import { useGetMeQuery } from "@/lib/features/auth/authApi";
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  UserRoundCog,
} from "lucide-react";
import { OrganizerGuard } from "@/components/guards/organizer-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Skeleton } from "@/components/ui/skeleton";

const organizerNavItems = [
  { label: "Overview", href: "/organizer/dashboard", icon: LayoutDashboard },
  { label: "My Events", href: "/organizer/dashboard/events", icon: Calendar },
  { label: "Create Event", href: "/organizer/dashboard/events/create", icon: PlusCircle },
  { label: "Profile", href: "/organizer/dashboard/profile", icon: UserRoundCog },
];

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user: reduxUser } = useAppSelector((state) => state.auth);
  const { data: userData, isLoading } = useGetMeQuery();

  const currentUser = userData || reduxUser;

  return (
    <OrganizerGuard>
      {isLoading && !currentUser ? (
        <div className="p-8"><Skeleton className="h-96 w-full rounded-3xl" /></div>
      ) : (
        <DashboardShell
          title="Organizer Dashboard"
          subtitle="Monitor your events, bookings, and performance from one responsive workspace."
          items={organizerNavItems}
          user={currentUser}
        >
          {children}
        </DashboardShell>
      )}
    </OrganizerGuard>
  );
}
