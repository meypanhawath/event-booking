"use client";

import { SiteLogo } from "@/components/ui/site-logo";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Events", href: "#" },
  { label: "Contact us", href: "#" },
  { label: "About us", href: "#" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon
          points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
          fill="#0d0d14"
        />
      </svg>
    ),
  },
  {
    label: "Telegram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 6.666a2.25 2.25 0 0 0 .126 4.238l3.813 1.168 1.53 4.863a1.5 1.5 0 0 0 2.56.434l2.018-2.378 4.137 3.048a2.245 2.245 0 0 0 3.494-1.426l2.446-14.5a2.25 2.25 0 0 0-2.602-2.328zM9.5 15.376l-.87-2.766 6.472-5.034-5.602 7.8z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      <footer className="relative w-full overflow-hidden border-t border-border bg-background text-foreground">
        {/* Top ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(168,85,247,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Center layout */}
        <div className="relative z-10 flex flex-col items-center px-6 pt-10 pb-6 max-w-7xl mx-auto">
          {/* CENTER – Brand & Nav */}
          <div className="flex flex-col items-center justify-center gap-6 py-4 w-full">
            {/* Logo */}
            <SiteLogo imageClassName="h-12 w-auto" width={200} height={60} />

            {/* Tagline */}
            <p
              className="max-w-xs text-center text-xs text-muted-foreground"
              style={{
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Your gateway to unforgettable live events, concerts & experiences.
            </p>

            {/* Nav Links */}
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors duration-200 hover:text-brand-main"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-all duration-200 hover:scale-110 hover:text-brand-main"
                  style={{
                    background: "hsl(var(--muted))",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-border" />

            {/* Copyright */}
            <p
              className="text-xs text-muted-foreground"
              style={{
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Copyright © Eventizo {new Date().getFullYear()}. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
