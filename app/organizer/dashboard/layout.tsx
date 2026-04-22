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
import { TooltipProvider } from "@/components/ui/tooltip"; 
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  BarChart3,
  PlusCircle,
  LogOut,
  ChevronRight,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OrganizerGuard } from "@/components/guards/organizer-guard";

const organizerNavItems = [
  { label: "Overview", href: "/organizer/dashboard", icon: LayoutDashboard },
  { label: "My Events", href: "/organizer/dashboard/events", icon: Calendar },
  { label: "Create Event", href: "/organizer/dashboard/events/create", icon: PlusCircle },
  // Bookings is now per-event, remove global bookings or keep for all events
];

export default function OrganizerLayout({
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
    <OrganizerGuard>
          <TooltipProvider>
<SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" className="border-r border-border bg-card">
        {/* Header */}
        <SidebarHeader className="p-4 border-b border-border group-data-[collapsible=icon]:p-2">
          <Link href="/organizer/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <div className="w-8 h-8 rounded-lg bg-[#C14FE6] flex items-center justify-center shrink-0">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground italic tracking-tight group-data-[collapsible=icon]:hidden">
              Organizer
            </span>
          </Link>
        </SidebarHeader>

        {/* User Info */}
        <div className="p-4 border-b border-border group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:flex-col">
            <Avatar className="w-10 h-10 border-2 border-[#C14FE6]/20 shrink-0">
              <AvatarFallback className="bg-[#C14FE6]/10 text-[#C14FE6] text-sm font-medium">
                {getInitials(currentUser?.firstName || currentUser?.username)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium text-foreground truncate">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Organizer
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <SidebarContent className="p-2">
          <SidebarMenu className="space-y-1">
            {organizerNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/organizer/dashboard" && pathname.startsWith(item.href));
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                    className={cn(
                      "w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 h-auto",
                      isActive
                        ? "bg-[#C14FE6]/15 text-[#C14FE6] hover:bg-[#C14FE6]/15 hover:text-[#C14FE6]"
                        : "text-muted-foreground hover:bg-[#C14FE6]/10 hover:text-foreground"
                    )}
                  >
                    <Link href={item.href} className="flex items-center">
                      <item.icon
                        className={cn(
                          "w-5 h-5 shrink-0",
                          isActive ? "text-[#C14FE6]" : "text-muted-foreground"
                        )}
                      />
                      <span className="flex-1 group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 shrink-0 text-[#C14FE6] group-data-[collapsible=icon]:hidden" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-border mt-auto group-data-[collapsible=icon]:p-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
          </button>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-30 flex h-14 lg:h-16 items-center gap-4 border-b border-border bg-background/95 px-4 lg:px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-lg font-semibold text-foreground">
            {organizerNavItems.find((i) => pathname === i.href || (i.href !== "/organizer/dashboard" && pathname.startsWith(i.href)))?.label ?? "Organizer"}
          </h1>
        </header>
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
    </TooltipProvider>
    </OrganizerGuard>


    
  );
}