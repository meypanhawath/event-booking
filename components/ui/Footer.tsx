"use client";

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

// Placeholder event images using SVG patterns
function EventImageLeft() {
  return (
    <div
      className="relative w-full h-full min-h-64 overflow-hidden rounded-2xl"
      style={{
        background:
          "linear-gradient(135deg, #1a0a2e 0%, #2d1155 50%, #1a0a2e 100%)",
      }}
    >
      {/* Decorative circles / stage lights */}
      <div className="absolute inset-0">
        <div
          className="absolute top-6 left-6 w-32 h-32 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #a855f7, transparent)",
          }}
        />
        <div
          className="absolute bottom-10 right-4 w-24 h-24 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #7c3aed, transparent)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #c084fc, transparent)",
          }}
        />
      </div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="mb-4 opacity-80">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c084fc"
            strokeWidth="1.5"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <p
          className="text-purple-300 text-sm font-medium mb-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Live Music
        </p>
        <p
          className="text-white text-xl font-bold"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Feel the Beat
        </p>
        <p
          className="text-purple-400 text-xs mt-2 opacity-75"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Book your concert seats
        </p>
        <div className="mt-5 flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-1.5 rounded-full"
              style={{
                height: `${[20, 32, 16, 28, 12][i - 1]}px`,
                background: "#a855f7",
                opacity: 0.6 + i * 0.08,
              }}
            />
          ))}
        </div>
      </div>
      {/* Ticket stub bottom strip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1.5 opacity-40"
        style={{
          background: "linear-gradient(90deg, #a855f7, #7c3aed, #a855f7)",
        }}
      />
    </div>
  );
}

function EventImageRight() {
  return (
    <div
      className="relative w-full h-full min-h-64 overflow-hidden rounded-2xl"
      style={{
        background:
          "linear-gradient(135deg, #0a1a2e 0%, #112d55 50%, #0a1a2e 100%)",
      }}
    >
      {/* Decorative */}
      <div className="absolute inset-0">
        <div
          className="absolute top-6 right-6 w-28 h-28 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #38bdf8, transparent)",
          }}
        />
        <div
          className="absolute bottom-10 left-4 w-20 h-20 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #0ea5e9, transparent)",
          }}
        />
      </div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="mb-4 opacity-80">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <p
          className="text-sky-300 text-sm font-medium mb-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Upcoming Events
        </p>
        <p
          className="text-white text-xl font-bold"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Don&apos;t Miss Out
        </p>
        <p
          className="text-sky-400 text-xs mt-2 opacity-75"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Explore hundreds of shows
        </p>
        <div className="mt-5 grid grid-cols-3 gap-1.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded"
              style={{
                background:
                  i % 3 === 0 ? "rgba(56,189,248,0.5)" : "rgba(56,189,248,0.1)",
                border: "1px solid rgba(56,189,248,0.2)",
              }}
            />
          ))}
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-1.5 opacity-40"
        style={{
          background: "linear-gradient(90deg, #38bdf8, #0ea5e9, #38bdf8)",
        }}
      />
    </div>
  );
}

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
            <div className="flex items-center gap-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  stroke="#a855f7"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="rgba(168,85,247,0.15)"
                />
              </svg>
              <span
                className="text-2xl font-bold italic text-foreground"
                style={{
                  fontFamily: "'Fraunces', serif",
                  letterSpacing: "-0.02em",
                }}
              >
                Eventizo
              </span>
            </div>

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
