"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { useGetMeQuery } from "@/lib/features/auth/authApi";
import { logout } from "@/lib/features/auth/authSlice";
import { useLogoutMutation } from "@/lib/features/auth/authApi";
import { useAppDispatch } from "@/lib/hooks";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Ticket,
  Store,
  LogOut,
  ChevronRight,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const customerNavItems = [
  { label: "Profile", href: "/user/dashboard", icon: User },
  { label: "My Bookings", href: "/user/dashboard/bookings", icon: Ticket },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user: reduxUser } = useAppSelector((state) => state.auth);
  const { data: userData } = useGetMeQuery();
  const [logoutApi] = useLogoutMutation();

  const currentUser = userData || reduxUser;
  const isOrganizer = currentUser?.roles?.includes("ROLE_ORGANIZER");
  const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN");

  const navItems = [...customerNavItems];
  if (!isOrganizer && !isAdmin) {
    navItems.push({ label: "Become Organizer", href: "/user/dashboard/apply-organizer", icon: Store });
  }

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully");
    } catch {
      dispatch(logout());
      toast.success("Logged out successfully");
    }
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border bg-card">
        {/* Header / Brand */}
        <SidebarHeader className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C14FE6] flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground italic tracking-tight">
              Event Booking
            </span>
          </Link>
        </SidebarHeader>

        {/* User Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-[#C14FE6]/20">
              <AvatarFallback className="bg-[#C14FE6]/10 text-[#C14FE6] text-sm font-medium">
                {getInitials(currentUser?.firstName || currentUser?.username)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser?.email}
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
        <SidebarContent className="p-4">
          <SidebarMenu className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 h-auto",
                      isActive
                        ? "bg-[#C14FE6]/15 text-[#C14FE6] hover:bg-[#C14FE6]/15 hover:text-[#C14FE6]"
                        : "text-muted-foreground hover:bg-[#C14FE6]/10 hover:text-foreground"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon
                        className={cn(
                          "w-5 h-5 shrink-0",
                          isActive ? "text-[#C14FE6]" : "text-muted-foreground"
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 shrink-0 text-[#C14FE6]" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-border mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-30 flex h-14 lg:h-16 items-center gap-4 border-b border-border bg-background/95 px-4 lg:px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="-ml-1 lg:hidden" />
          <h1 className="text-lg font-semibold text-foreground">
            {navItems.find((i) => i.href === pathname)?.label ?? "Dashboard"}
          </h1>
        </header>
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}