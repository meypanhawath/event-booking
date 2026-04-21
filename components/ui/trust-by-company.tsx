"use client";

import { ArrowRight } from "lucide-react";

const companies = [
  "Spotify",
  "Live Nation",
  "Ticketmaster",
  "Eventbrite",
  "StubHub",
  "AXS",
  "Viagogo",
  "SeatGeek",
] as const;

const repeatedCompanies = [...companies, ...companies];

export function TrustByCompany() {
  return (
    <section className="relative overflow-hidden">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-main">
            Trusted by companies
          </p>
          <h2 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">
            Built for teams that run events at scale
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <span>Continuously moving logos</span>
          <ArrowRight className="size-4" />
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-background via-background/90 to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-background via-background/90 to-transparent sm:w-20" />

        <div className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div
            className="flex w-max items-center gap-3 py-2"
            style={{ animation: "company-marquee 24s linear infinite" }}
          >
            {repeatedCompanies.map((company, index) => (
              <div
                key={`${company}-${index}`}
                className="flex h-16 min-w-38 items-center justify-center rounded-2xl border border-border bg-background/80 px-4 shadow-sm transition hover:border-brand-main/40 hover:shadow-md"
              >
                <div className="text-center">
                  <p className="text-sm font-semibold tracking-tight text-foreground">
                    {company}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    trusted partner
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
