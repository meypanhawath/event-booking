"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/lib/features/auth/authApi";

export function OrganizerGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useGetMeQuery();

  useEffect(() => {
    // Wait for query to finish
    if (isLoading) return;

    // No user data or error = not logged in
    if (isError || !user) {
      router.replace("/login");
      return;
    }

    // Check role - your backend might use "ROLE_ORGANIZER" or "ORGANIZER"
    const roles = user.roles || [];
    const isOrganizer = roles.includes("ROLE_ORGANIZER") || roles.includes("ORGANIZER");
    const isAdmin = roles.includes("ROLE_ADMIN") || roles.includes("ADMIN");

    if (!isOrganizer && !isAdmin) {
      // Not organizer, redirect to user dashboard
      router.replace("/user/dashboard");
    }
  }, [user, isLoading, isError, router]);

  // Show loading while checking
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#C14FE6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Don't render children if not authorized
  if (isError || !user) return null;

  const roles = user.roles || [];
  const isOrganizer = roles.includes("ROLE_ORGANIZER") || roles.includes("ORGANIZER");
  const isAdmin = roles.includes("ROLE_ADMIN") || roles.includes("ADMIN");

  if (!isOrganizer && !isAdmin) return null;

  return <>{children}</>;
}