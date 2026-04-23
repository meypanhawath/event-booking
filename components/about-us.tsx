import Image from "next/image";
import { Headphones, Search, ShieldCheck, Ticket } from "lucide-react";

import Navbar from "./ui/navbar";

const highlights = [
  {
    title: "Your ticket is on the way",
    description:
      "We make booking simple and reliable, with clear confirmations and a fast path from checkout to inbox.",
    icon: Ticket,
  },
  {
    title: "Online ticket purchasing",
    description:
      "Users can browse events, choose what fits their plans, and complete secure purchases without extra friction.",
    icon: ShieldCheck,
  },
  {
    title: "Customer support",
    description: "Our team is available to help with bookings, access issues, and the questions that matter before an event.",
    icon: Headphones,
  },
  {
    title: "Event discovery",
    description:
      "We help people find events that match their interests with better filtering, clearer details, and a smoother browsing flow.",
    icon: Search,
  },
] as const;

const mentors = [
  { name: "Chan Chhaya", role: "Teacher", badge: "Senior Instructor", image: "/cher chayya.jpg", email: "mailto:chanchhaya@gmail.com" },
  { name: "Mom Reksmey", role: "Teacher", badge: "Instructor Lead", image: "/Mom Reaksmey.jpg", email: "mailto:momreksmey@gmail.com" },
  { name: "Kit Tara", role: "Teacher", badge: "Senior Instructor", image: "/Kit Tara.jpg", email: "mailto:kittara@gmail.com" },
] as const;

const members = [
  { name: "Mey Panhawath", role: "Member", badge: "Team Lead", image: "/panhawath.jpg", email: "mailto:povsoknem@gmail.com", github: "https://github.com/povsoknem" },
  { name: "Sim Menghor", role: "Member", badge: "UX/UI", image: "/menghor.jpg", email: "mailto:longpiseth@gmail.com", github: "https://github.com/longpiseth" },
  { name: "Sithon Samrach", role: "Member", badge: "Front-end", image: "/Q31A6082 copy.JPG", email: "mailto:sanhpanha@gmail.com", github: "https://github.com/sanhpanha" },
  { name: "Yort Konghour", role: "Member", badge: "Front-end", image: "/KongHour.jpg", email: "mailto:hourkong3@gmail.com", github: "https://github.com/nuthchanreaksa" },
] as const;

function SocialLinks({ email, github }: { email: string; github?: string }) {
  return (
    <div className="mt-4 flex gap-3">
      <a
        href={email}
        className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-primary transition hover:border-primary/40 hover:bg-primary/10"
        aria-label="Email"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 7 L12 13 L22 7" />
        </svg>
      </a>
      {github ? (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-primary transition hover:border-primary/40 hover:bg-primary/10"
          aria-label="GitHub"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
      ) : null}
    </div>
  );
}

function PersonCard({
  name,
  role,
  badge,
  image,
  email,
  github,
}: {
  name: string;
  role: string;
  badge: string;
  image: string;
  email: string;
  github?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-[28px] border border-border bg-card p-6 text-center shadow-sm">
      <div className="relative size-36 overflow-hidden rounded-full border-4 border-primary/15 sm:size-40">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-foreground">{name}</h3>
      <p className="text-sm text-muted-foreground">{role}</p>
      <span className="mt-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        {badge}
      </span>
      <SocialLinks email={email} github={github} />
    </div>
  );
}

export default function AboutUs() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <section className="relative isolate border-b border-border">
          <Image src="/rub.webp" alt="Event audience" fill priority className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(18,18,18,0.72),rgba(18,18,18,0.78))] dark:bg-[linear-gradient(180deg,rgba(18,18,18,0.78),rgba(10,10,10,0.86))]" />
          <div className="mx-auto max-w-6xl px-4 pb-20 pt-36 text-center sm:px-6 lg:px-8">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                About Eventizo
              </span>
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              A simpler event booking experience for users, organizers, and teams.
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base text-white/75 sm:text-lg">
              Eventizo helps people discover events, book quickly, and stay informed without noise. Behind the product
              is a team focused on accessibility, clarity, and dependable support.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-10 flex flex-col gap-3 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Why choose us</span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Built around the full event journey</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              The page now follows the same surface, border, and typography system used throughout the rest of the project.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {highlights.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-[28px] border border-border bg-card p-8 shadow-sm transition-colors hover:border-primary/35"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-muted/40">
          <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Mentors</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Guided by experienced instructors</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {mentors.map((mentor) => (
                <PersonCard key={mentor.name} {...mentor} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-10 flex flex-col gap-3 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Members</span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">The team building the platform</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {members.map((member) => (
              <PersonCard key={member.name} {...member} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
