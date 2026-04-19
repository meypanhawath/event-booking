"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Shows", href: "#shows" },
  { label: "Concerts", href: "#concerts" },
  { label: "Sports", href: "#sports" },
  { label: "Festivals", href: "#festivals" },
] as const;

type NavbarProps = {
  activeItem?: (typeof navItems)[number]["label"];
};

export default function Navbar({ activeItem = "Home" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const avatarLetter = (user?.name?.trim()?.charAt(0) || "U").toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-4 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl rounded-[28px]">
        <div className="flex min-h-18 items-center justify-between gap-4 px-4 py-3 sm:min-h-20 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex size-11 items-center justify-center rounded-full text-white transition hover:bg-white/6 lg:hidden"
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

          <Link
            href="/"
            className="text-center text-xl font-black italic tracking-tight text-fuchsia-400 sm:text-2xl lg:shrink-0 lg:text-left lg:text-3xl"
          >
            Event Booking
          </Link>

          <nav className="hidden items-center justify-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = item.label === activeItem;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "group relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 xl:px-5",
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute inset-x-2 inset-y-1 -z-10 rounded-full blur-lg transition-opacity duration-200",
                      isActive
                        ? "bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.38),rgba(168,85,247,0.12)_40%,transparent_76%)] opacity-100"
                        : "bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.32),rgba(168,85,247,0.08)_40%,transparent_76%)] opacity-0 group-hover:opacity-100",
                    ].join(" ")}
                  />
                  <span className="relative z-10 block">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            {isPending ? (
              <div className="size-10 rounded-full bg-white/10" aria-hidden="true" />
            ) : user ? (
              <Link
                href="/dashboard"
                aria-label={user.name ? `${user.name} profile` : "Profile"}
                className="inline-flex items-center justify-center rounded-full ring-1 ring-white/20 transition hover:ring-white/40"
              >
                {user.image ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="size-10 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${user.image})` }}
                    />
                    <span className="sr-only">
                      {user.name ? `${user.name} avatar` : "User avatar"}
                    </span>
                  </>
                ) : (
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-fuchsia-500/80 text-sm font-semibold text-white">
                    {avatarLetter}
                  </span>
                )}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex rounded-full bg-linear-to-r from-fuchsia-500 to-violet-500 px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 sm:px-5 lg:hidden"
                >
                  Signup
                </Link>

                <Link
                  href="/login"
                  className="hidden rounded-full bg-linear-to-r from-fuchsia-500 to-violet-500 px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 lg:inline-flex"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="border-t border-white/8 bg-[#17171b]/96 px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = item.label === activeItem;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={[
                      "rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-fuchsia-500/12 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {!user && (
              <Link
                href="/login"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:brightness-110"
              >
                Signup
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
