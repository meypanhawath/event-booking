"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/features/auth/authSlice";
import { authApi, useGetMeQuery, useLogoutMutation } from "@/lib/features/auth/authApi";
import { getDashboardPath, getPrimaryRole, getProfileImageUrl, getUserInitial, hasRole } from "@/lib/auth-utils";
import { toast } from "sonner";
import Image from "next/image";
import {
  LogOut,
  LayoutDashboard,
  Ticket,
  ChevronDown,
  Shield,
  CalendarDays,
  PlusCircle,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

type NavbarProps = {
  activeItem?: (typeof navItems)[number]["label"];
};

export default function Navbar({ activeItem = "Home" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { data: userData } = useGetMeQuery();
  const [logoutApi] = useLogoutMutation();
  const currentUser = userData ?? user;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isNavItemActive = (item: (typeof navItems)[number]) => {
    if (item.href.startsWith("#")) return false;
    if (item.href === "/") return pathname === "/";
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  useEffect(() => {
    function handleScroll() {
      setHasScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully", {
        position: "top-right",
        duration: 3000,
      });
    } catch {
      dispatch(authApi.util.resetApiState());
      dispatch(logout());
      toast.success("Logged out successfully", {
        position: "top-right",
        duration: 3000,
      });
    } finally {
      dispatch(authApi.util.resetApiState());
    }
    window.location.href = "/";
    setDropdownOpen(false);
  };

  const showLogoutConfirm = () => {
    setDropdownOpen(false);
    
    toast.custom(
      (t) => (
        <div className="w-80 rounded-2xl border border-border bg-background shadow-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C14FE6]/10">
              <LogOut className="size-5 text-[#C14FE6]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Confirm Logout
              </h3>
              <p className="text-xs text-muted-foreground">
                Are you sure you want to logout?
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t)}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t);
                handleLogout();
              }}
              className="rounded-full bg-[#C14FE6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#C14FE6]/90"
            >
              Logout
            </button>
          </div>
        </div>
      ),
      {
        position: "top-right",
        duration: 3000,
      }
    );
  };

  const getInitials = (name: string | undefined) => {
    return getUserInitial(name);
  };

  // Check roles
  const isAdmin = hasRole(currentUser?.roles, "ROLE_ADMIN");
  const isOrganizer = hasRole(currentUser?.roles, "ROLE_ORGANIZER");
  const primaryRole = getPrimaryRole(currentUser?.roles);

  // Get profile image URL
  const profileImage = getProfileImageUrl(currentUser?.profile);

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full bg-transparent px-4 py-4 text-foreground sm:px-6 lg:px-8">
      <div
        className={[
          "mx-auto w-full max-w-7xl rounded-[28px] transition-colors duration-200",
          hasScrolled
            ? "border border-border bg-background shadow-lg"
            : "border border-transparent bg-transparent shadow-none",
        ].join(" ")}
      >
        <div className="flex min-h-15 items-center justify-between gap-3 px-3 py-2 sm:min-h-16 sm:px-4 lg:px-6">
          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex size-11 items-center justify-center rounded-full transition lg:hidden text-foreground"
          >
            <span className="sr-only">Menu</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
              aria-hidden="true"
            >
              {isOpen ? (
                <>
                  <path d="M6 6 18 18" />
                  <path d="M6 18 18 6" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="text-center text-xl font-black italic tracking-tight text-[#C14FE6] sm:text-2xl lg:shrink-0 lg:text-left lg:text-3xl"
          >
            Eventizo
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center justify-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = isNavItemActive(item);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "group relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 xl:px-5",
                    isActive
                      ? "text-foreground"
                      : "text-foreground/70 hover:text-foreground",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute inset-x-2 inset-y-1 -z-10 rounded-full transition-opacity duration-200",
                      isActive
                        ? "bg-[#C14FE6]/15 opacity-100"
                        : "bg-[#C14FE6]/10 opacity-0 group-hover:opacity-100",
                    ].join(" ")}
                  />
                  <span className="relative z-10 block">
                    {item.label}
                    {isActive ? (
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-[#C14FE6]" />
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <ModeToggle />

            {currentUser || isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Profile Button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={[
                    "flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-200",
                    dropdownOpen
                      ? "bg-[#C14FE6]/15 border border-[#C14FE6]/30"
                      : "bg-[#C14FE6]/10 border border-transparent hover:border-[#C14FE6]/20",
                  ].join(" ")}
                >
                  {/* Profile Image or Initials */}
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#C14FE6] flex items-center justify-center">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt={currentUser?.username || "User"}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to initials on image error
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-sm font-medium text-white">
                        {getInitials(currentUser?.username)}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline max-w-24 truncate text-sm font-medium text-foreground">
                    {currentUser?.username ?? "User"}
                  </span>
                  <ChevronDown
                    className={[
                      "size-4 text-muted-foreground transition-transform duration-200",
                      dropdownOpen ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-border bg-background shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-border bg-muted/30">
                      <p className="text-sm font-semibold text-foreground">
                        {currentUser?.username}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {currentUser?.email}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#C14FE6]/10 text-[#C14FE6] font-medium">
                          {primaryRole.replace("ROLE_", "")}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 space-y-0.5">
                      {/* Admin Panel Link */}
                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Shield className="size-4 text-red-500" />
                          Admin Panel
                        </Link>
                      )}

                      {/* Organizer Dashboard Link */}
                      {isOrganizer && (
                        <Link
                          href="/organizer/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition hover:bg-[#C14FE6]/10"
                        >
                          <CalendarDays className="size-4 text-[#C14FE6]" />
                          Organizer Dashboard
                        </Link>
                      )}

                      {/* User Dashboard */}
                      <Link
                        href={getDashboardPath(currentUser?.roles)}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition hover:bg-[#C14FE6]/10"
                      >
                        <LayoutDashboard className="size-4 text-[#C14FE6]" />
                        Dashboard
                      </Link>

                      {/* My Bookings */}
                      <Link
                        href="/user/dashboard/bookings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition hover:bg-[#C14FE6]/10"
                      >
                        <Ticket className="size-4 text-[#C14FE6]" />
                        My Bookings
                      </Link>

                      {/* Apply as Organizer (only for non-organizers) */}
                      {!isOrganizer && !isAdmin && (
                        <Link
                          href="/user/dashboard/apply-organizer"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition hover:bg-[#C14FE6]/10"
                        >
                          <PlusCircle className="size-4 text-[#C14FE6]" />
                          Become Organizer
                        </Link>
                      )}

                      <div className="border-t border-border my-1" />

                      {/* Logout */}
                      <button
                        onClick={showLogoutConfirm}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive transition hover:bg-destructive/10"
                      >
                        <LogOut className="size-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-full border border-[#C14FE6] bg-transparent px-5 py-2 text-sm font-medium text-[#C14FE6] transition hover:bg-[#C14FE6] hover:text-white lg:inline-flex"
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  className="inline-flex rounded-full bg-[#C14FE6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#C14FE6]/90 lg:hidden"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={[
          "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/45"
        />
        <aside
          aria-label="Mobile navigation"
          className={[
            "absolute left-0 top-0 h-full w-[84%] max-w-sm border-r border-border bg-background px-5 py-6 shadow-2xl transition-transform duration-300",
            isOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="text-lg font-extrabold italic tracking-tight text-[#C14FE6]">
              Eventizo
            </span>
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setIsOpen(false)}
              className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
                aria-hidden="true"
              >
                <path d="M6 6 18 18" />
                <path d="M6 18 18 6" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = isNavItemActive(item);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={[
                    "rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-foreground bg-[#C14FE6]/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  ].join(" ")}
                >
                  <span className="relative inline-block">
                    {item.label}
                    {isActive ? (
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-[#C14FE6]" />
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-border pt-4">
            {currentUser || isAuthenticated ? (
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-center gap-3 px-1">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#C14FE6] flex items-center justify-center">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt={currentUser?.username || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-white">
                        {getInitials(currentUser?.username)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {currentUser?.username}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>

                {/* Role Badges */}
                <div className="flex flex-wrap gap-1 px-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C14FE6]/10 text-[#C14FE6] font-medium">
                    {primaryRole.replace("ROLE_", "")}
                  </span>
                </div>

                {/* Admin Link */}
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <Shield className="size-4" />
                    Admin Panel
                  </Link>
                )}

                {/* Organizer Link */}
                {isOrganizer && (
                  <Link
                    href="/organizer/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-foreground transition hover:bg-[#C14FE6]/10"
                  >
                    <CalendarDays className="size-4 text-[#C14FE6]" />
                    Organizer Dashboard
                  </Link>
                )}

                <Link
                  href={getDashboardPath(currentUser?.roles)}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-foreground transition hover:bg-[#C14FE6]/10"
                >
                  <LayoutDashboard className="size-4 text-[#C14FE6]" />
                  Dashboard
                </Link>

                <Link
                  href="/user/dashboard/bookings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-foreground transition hover:bg-[#C14FE6]/10"
                >
                  <Ticket className="size-4 text-[#C14FE6]" />
                  My Bookings
                </Link>

                {!isOrganizer && !isAdmin && (
                  <Link
                    href="/user/dashboard/apply-organizer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-foreground transition hover:bg-[#C14FE6]/10"
                  >
                    <PlusCircle className="size-4 text-[#C14FE6]" />
                    Become Organizer
                  </Link>
                )}

                <button
                  onClick={() => {
                    setIsOpen(false);
                    showLogoutConfirm();
                  }}
                  className="inline-flex w-full items-center justify-center rounded-full bg-destructive/10 px-5 py-3 text-sm font-medium text-destructive transition hover:bg-destructive/20"
                >
                  <LogOut className="mr-2 size-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#C14FE6] px-5 py-3 text-sm font-medium text-[#C14FE6] transition hover:bg-[#C14FE6] hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#C14FE6] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#C14FE6]/90"
                >
                  Create account
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </header>
  );
}
