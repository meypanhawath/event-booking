"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "@/components/ui/mode-toggle";
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
import { cn } from "@/lib/utils";
import { notifyError, notifySuccess } from "@/lib/toast";
import { logout } from "@/lib/features/auth/authSlice";
import { authApi, useLogoutMutation } from "@/lib/features/auth/authApi";
import { useAppDispatch } from "@/lib/hooks";
import { getProfileImageUrl, getUserInitial } from "@/lib/auth-utils";
import { SignOutDialog } from "@/components/dashboard/sign-out-dialog";
import { SiteLogo } from "@/components/ui/site-logo";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { ChevronRight, LogOut } from "lucide-react";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type DashboardShellProps = {
  title: string;
  subtitle: string;
  items: DashboardNavItem[];
  user: {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    profile?: string | null;
  } | null | undefined;
  children: React.ReactNode;
};

export function DashboardShell({
  title,
  subtitle,
  items,
  user,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const activeItem = useMemo(
    () =>
      items.find(
        (item) => pathname === item.href || (item.href !== items[0]?.href && pathname.startsWith(item.href))
      ),
    [items, pathname]
  );

  const initials = getUserInitial(user?.username, user?.firstName);
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || "User";
  const profileImage = getProfileImageUrl(user?.profile);

  async function handleConfirmLogout() {
    try {
      await logoutApi().unwrap();
    } catch {
      notifyError("Sign out request failed.", "Your local session was cleared, but the server did not confirm it.");
    } finally {
      dispatch(authApi.util.resetApiState());
      dispatch(logout());
      setConfirmOpen(false);
      notifySuccess("Signed out successfully.", "You have been returned to the landing page.");
      router.replace("/");
      router.refresh();
    }
  }

  const crumbs = pathname
    .split("/")
    .filter(Boolean)
    .filter((crumb) => crumb !== "home");

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border bg-sidebar">
        <SidebarHeader className="border-b border-border px-4 py-5">
          <div className="flex items-center gap-3">
            <SiteLogo
              className="shrink-0"
              imageClassName="h-10 w-auto"
              width={160}
              height={48}
            />
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          <SidebarMenu className="space-y-1">
            {items.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== items[0]?.href && pathname.startsWith(item.href));
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "h-auto rounded-2xl px-3 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "bg-[#c14fe6] text-white hover:bg-[#b347d4] hover:text-white"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                      {isActive ? <ChevronRight className="ml-auto size-4" /> : null}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-border p-3">
          <Button
            variant="ghost"
            className="w-full justify-start rounded-2xl px-3 py-6 text-muted-foreground hover:bg-red-50 hover:text-red-600"
            onClick={() => setConfirmOpen(true)}
          >
            <LogOut className="size-4" />
            <span>Sign out</span>
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <main className="min-w-0 flex-1 bg-[linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--muted)/0.3)_100%)]">
        <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 px-4 py-4 lg:px-8">
            <SidebarTrigger className="lg:hidden" />
            <div className="min-w-0 flex-1">
              <Breadcrumb className="hidden sm:block">
                <BreadcrumbList>
                  {crumbs.map((crumb, index) => {
                    const href = `/${crumbs.slice(0, index + 1).join("/")}`;
                    const label = crumb.replace(/-/g, " ");
                    const isLast = index === crumbs.length - 1;
                    return (
                      <BreadcrumbItem key={href}>
                        {index > 0 ? <BreadcrumbSeparator /> : null}
                        {isLast ? (
                          <BreadcrumbPage className="capitalize">{label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={href} className="capitalize">
                              {label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
              <div className="mt-2">
                <h1 className="text-xl font-semibold tracking-tight text-foreground lg:text-2xl">{activeItem?.label ?? title}</h1>
                <p className="text-sm text-muted-foreground sm:text-base">{subtitle}</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <ModeToggle />
              {profileImage ? (
                <Image src={profileImage} alt={fullName} width={40} height={40} className="size-10 rounded-full object-cover" />
              ) : (
                <Avatar className="size-10 border border-border">
                  <AvatarFallback className="bg-[#C14FE6] font-semibold text-white">{initials}</AvatarFallback>
                </Avatar>
              )}
              <div className="hidden text-right sm:block">
                <p className="text-base font-medium">{fullName}</p>
                <p className="text-sm text-muted-foreground">{user?.username ?? user?.email}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8 lg:py-8">{children}</div>
      </main>

      <SignOutDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmLogout}
        isSubmitting={isLoggingOut}
      />
    </SidebarProvider>
  );
}
