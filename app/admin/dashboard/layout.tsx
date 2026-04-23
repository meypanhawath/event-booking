"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Tag,
} from "lucide-react";
import { hasRole } from "@/lib/auth-utils";
import { useAppSelector } from "@/lib/hooks";
import { useGetMeQuery } from "@/lib/features/auth/authApi";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/dashboard/organizers", label: "Pending Organizers", icon: UserCheck },
  { href: "/admin/dashboard/users", label: "All Users", icon: Users },
  { href: "/admin/dashboard/categories", label: "Categories", icon: Tag },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user: reduxUser, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { data: userData, isLoading: meLoading } = useGetMeQuery();
  const user = userData || reduxUser;

  useEffect(() => {
    if (authLoading || meLoading) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }
    if (!hasRole(user.roles, "ROLE_ADMIN")) {
      router.push("/");
    }
  }, [authLoading, meLoading, user, router]);

  if (authLoading || meLoading) {
    return <div className="p-8"><Skeleton className="h-96 w-full rounded-3xl" /></div>;
  }

  if (!user || !hasRole(user.roles, "ROLE_ADMIN")) {
    return null;
  }

  return (
    <DashboardShell
      title="Admin Dashboard"
      subtitle="Review organizers, monitor users, and keep platform data clean."
      items={navItems}
      user={user}
    >
      {children}
    </DashboardShell>
  );
}
