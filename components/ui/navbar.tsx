"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/features/auth/authSlice";
import { useLogoutMutation } from "@/lib/features/auth/authApi";
import { toast } from "sonner";
import { User, LogOut } from "lucide-react";
import { AvatarDropdown } from "@/components/avatars";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

type NavbarProps = {
  activeItem?: (typeof navItems)[number]["label"];
};

export default function Navbar({ activeItem = "Home" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();

  const isNavItemActive = (item: (typeof navItems)[number]) => {
    if (item.href.startsWith("#")) return false;

    if (item.href === "/") {
      return pathname === "/";
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  useEffect(() => {
    function handleScroll() {
      setHasScrolled(window.scrollY > 8);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
      });
    } catch (error) {
      // Even if API fails, clear local state
      dispatch(logout());
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full bg-transparent px-4 py-4 text-black dark:text-white sm:px-6 lg:px-8">
      <div
        className={[
          "mx-auto w-full max-w-7xl rounded-[28px] transition-all duration-200",
          hasScrolled
            ? "border border-border bg-white/80 shadow-sm backdrop-blur-md dark:bg-black/80"
            : "border border-transparent bg-transparent shadow-none",
        ].join(" ")}
      >
        <div className="flex min-h-18 items-center justify-between gap-4 px-4 py-3 sm:min-h-20 sm:px-6 lg:px-8">
          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-expanded={isOpen}
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setIsOpen((value) => !value)}
            className={[
              "inline-flex size-11 items-center justify-center rounded-full transition lg:hidden",
              hasScrolled
                ? "text-black dark:text-white"
                : "text-black dark:text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]",
            ].join(" ")}
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
            className="text-center text-xl font-black italic tracking-tight text-brand-main sm:text-2xl lg:shrink-0 lg:text-left lg:text-3xl"
          >
            Event Booking
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
                    hasScrolled
                      ? isActive
                        ? "text-black dark:text-white"
                        : "text-black/70 hover:text-black dark:text-muted-foreground dark:hover:text-white"
                      : isActive
                        ? "text-black dark:text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]"
                        : "text-black/75 hover:text-black dark:text-white/85 dark:hover:text-white",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute inset-x-2 inset-y-1 -z-10 rounded-full blur-lg transition-opacity duration-200",
                      isActive
                        ? "bg-[radial-gradient(circle_at_center,rgba(193,79,230,0.38),rgba(193,79,230,0.12)_40%,transparent_76%)] opacity-100"
                        : "bg-[radial-gradient(circle_at_center,rgba(193,79,230,0.32),rgba(193,79,230,0.08)_40%,transparent_76%)] opacity-0 group-hover:opacity-100",
                    ].join(" ")}
                  />
                  <span className="relative z-10 block">
                    {item.label}
                    {isActive ? (
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-current" />
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <ModeToggle />

            {isAuthenticated ? (
              <>
                {/* User Avatar/Menu */}
                <div className="hidden lg:flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-brand-main/10 px-2 py-1">
                    <AvatarDropdown
                      username={user?.username}
                      onLogout={handleLogout}
                    />
                    <span className="text-sm font-medium text-foreground max-w-25 truncate pr-1">
                      {user?.username ?? "User"}
                    </span>
                  </div>
                </div>

                {/* Mobile: Just show logout icon */}
                <button
                  onClick={handleLogout}
                  className="lg:hidden inline-flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                >
                  <LogOut className="size-5" />
                </button>
              </>
            ) : (
              <>
                {/* Login Button (Desktop) */}
                <Link
                  href="/login"
                  className="hidden rounded-full border border-brand-main bg-transparent px-5 py-2 text-sm font-medium text-brand-main transition hover:bg-brand-main hover:text-white lg:inline-flex"
                >
                  Log in
                </Link>

                {/* Login Button (Mobile) */}
                <Link
                  href="/login"
                  className="inline-flex rounded-full bg-brand-main px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-main/90 lg:hidden"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tablet/Mobile Sidebar Menu */}
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
          className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
        />

        <aside
          aria-label="Mobile navigation"
          className={[
            "absolute left-0 top-0 h-full w-[84%] max-w-sm border-r border-border bg-background px-5 py-6 shadow-2xl transition-transform duration-300",
            isOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="text-lg font-extrabold italic tracking-tight text-brand-main">
              Event Booking
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
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-current" />
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-border pt-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-full bg-[#C14FE6]/10 px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C14FE6] text-sm font-medium text-white">
                    {user?.username?.charAt(0).toUpperCase() || (
                      <User className="size-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground max-w-42.5 truncate">
                    {user?.username}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
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
                  className="inline-flex w-full items-center justify-center rounded-full border border-brand-main px-5 py-3 text-sm font-medium text-brand-main transition hover:bg-brand-main hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-brand-main px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-main/90"
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
