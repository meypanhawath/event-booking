"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  User,
  Ticket,
  Store,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string;
    roles?: string[];
    organizerStatus?: string;
  } | null;
}

const customerNavItems = [
  {
    label: "Profile",
    href: "/user/dashboard",
    icon: User,
  },
  {
    label: "My Bookings",
    href: "/user/dashboard/bookings",
    icon: Ticket,
  },
];

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const isOrganizer = user?.roles?.includes("ROLE_ORGANIZER");
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  const navItems = [...customerNavItems];

  // Show "Become Organizer" only if not organizer and not admin
  if (!isOrganizer && !isAdmin) {
    navItems.push({
      label: "Become Organizer",
      href: "/user/dashboard/apply-organizer",
      icon: Store,
    });
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-border bg-card sticky top-0">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-1.png"
            alt="Eventizo logo"
            width={160}
            height={48}
            className="block h-10 w-auto dark:hidden"
          />
          <Image
            src="/logo-2.png"
            alt="Eventizo logo"
            width={160}
            height={48}
            className="hidden h-10 w-auto dark:block"
          />
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C14FE6]/10 flex items-center justify-center">
            <User className="w-5 h-5 text-[#C14FE6]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
        {isOrganizer && (
          <span className="mt-2 inline-flex items-center rounded-full bg-[#C14FE6]/10 px-2 py-0.5 text-xs font-medium text-[#C14FE6]">
            Organizer
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#C14FE6]/10 text-[#C14FE6]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "text-[#C14FE6]")} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link
          href="/api/auth/logout"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}

// Mobile sidebar trigger - to be used in layout
export function MobileSidebarTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="lg:hidden">
      {children}
    </div>
  );
}
