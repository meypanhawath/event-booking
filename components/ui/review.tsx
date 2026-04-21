"use client";

const testimonials = [
  {
    id: 1,
    text: "I'm using Evenjoi for the last 3 months and it's amazing. Donec aliquet concert in the show process was so smooth.",
    name: "Esther Howard",
    rating: 3,
    avatar: "EH",
    color: "#c14fe6",
  },
  {
    id: 2,
    text: "Vestibulum eu quam nec neque pellentesque efficitur id eget nisl. Proin porta est convallis lacus blandit.",
    name: "Jane Cooper",
    rating: 4,
    avatar: "JC",
    color: "#8b5cf6",
  },
  {
    id: 3,
    text: "Aliquam porta nisl dolor, molestie pellentesque elit molestie in. Morbi metus neque, elementum ullam.",
    name: "Leslie Alexander",
    rating: 4,
    avatar: "LA",
    color: "#ec4899",
  },
  {
    id: 4,
    text: "Aliquam porta nisl dolor, molestie pellentesque elit molestie in. Morbi metus neque, elementum ullamcorper.",
    name: "Jenny Wilson",
    rating: 4,
    avatar: "JW",
    color: "#f59e0b",
  },
  {
    id: 5,
    text: "In a laoreet purus. Integer turpis quam, laoreet id orci nec, ultrices lacinia nunc. Aliquam erat vo.",
    name: "Ralph Edwards",
    rating: 4,
    avatar: "RE",
    color: "#10b981",
  },
] as const;

const testimonials2 = [
  {
    id: 6,
    text: "I'm using Evenjoi concert in the show process was so tomorrow.",
    name: "Jerome Bell",
    rating: 4,
    avatar: "JB",
    color: "#3b82f6",
  },
  {
    id: 7,
    text: "Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus.",
    name: "Jerome Bell",
    rating: 4,
    avatar: "JB",
    color: "#3b82f6",
  },
  {
    id: 8,
    text: "Vestibulum eu quam nec neque pellentesque efficitur id eget nisl. Proin porta est convallis lacus bl.",
    name: "Kristin Watson",
    rating: 5,
    avatar: "KW",
    color: "#14b8a6",
  },
  {
    id: 9,
    text: "In a laoreet purus. Integer turpis quam, laoreet id orci nec, ultrices lacinia nunc. Aliquam erat vo.",
    name: "Bessie Cooper",
    rating: 4,
    avatar: "BC",
    color: "#f97316",
  },
  {
    id: 10,
    text: "In a laoreet purus. Integer turpis quam, laoreet id orci nec, ultrices lacinia nunc. Aliquam erat.",
    name: "Ralph Edwards",
    rating: 4,
    avatar: "RE",
    color: "#a855f7",
  },
] as const;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="mt-3 flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 1L8.545 5.09L13 5.09L9.545 7.636L10.909 12L7 9.273L3.091 12L4.455 7.636L1 5.09L5.455 5.09L7 1Z"
            fill={star <= rating ? "#FBBF24" : "currentColor"}
            opacity={star <= rating ? 1 : 0.28}
          />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({
  text,
  name,
  rating,
  avatar,
  color,
}: {
  text: string;
  name: string;
  rating: number;
  avatar: string;
  color: string;
}) {
  return (
    <article className="flex h-full w-72 shrink-0 flex-col justify-between rounded-2xl border border-border bg-card/80 p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-card/70">
      <div className="mb-3 text-brand-main/35">
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
          <path
            d="M0 16V9.6C0 7.467 0.533 5.6 1.6 4C2.667 2.4 4.267 1.2 6.4 0.4L7.6 2.4C6.267 2.933 5.267 3.667 4.6 4.6C3.933 5.533 3.6 6.667 3.6 8H6.4V16H0ZM12 16V9.6C12 7.467 12.533 5.6 13.6 4C14.667 2.4 16.267 1.2 18.4 0.4L19.6 2.4C18.267 2.933 17.267 3.667 16.6 4.6C15.933 5.533 15.6 6.667 15.6 8H18.4V16H12Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>

      <div className="mt-5 flex items-center gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ background: color }}
        >
          {avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <StarRating rating={rating} />
        </div>
      </div>
    </article>
  );
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: ReadonlyArray<
    (typeof testimonials)[number] | (typeof testimonials2)[number]
  >;
  reverse?: boolean;
}) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent" />

      <div
        className="flex w-max items-stretch gap-4 py-2"
        style={{
          animation: "company-marquee 36s linear infinite",
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[...items, ...items].map((item, index) => (
          <TestimonialCard key={`${item.id}-${index}`} {...item} />
        ))}
      </div>
    </div>
  );
}

export function Review() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-border bg-card/80 py-16 shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(193,79,230,0.08),transparent_42%)]" />

      <div className="relative z-10 px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-main">
          Reviews
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Loved by thousands
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Smooth, easy ticket buying. Hear what customers say after using the
          platform.
        </p>
      </div>

      <div className="relative z-10 mt-10 flex flex-col gap-4 px-4 sm:px-6 lg:px-8">
        <MarqueeRow items={testimonials} />
        <MarqueeRow items={testimonials2} reverse />
      </div>
    </section>
  );
}
