"use client";

import { useEffect, useRef, useState } from "react";
import { Award, Star, Users, Zap } from "lucide-react";

const stats = [
  {
    value: "50K+",
    label: "Active People",
    icon: Users,
    target: 50000,
    suffix: "+",
  },
  {
    value: "12K+",
    label: "Events Booked",
    icon: Zap,
    target: 120000,
    suffix: "+",
  },
  {
    value: "98%",
    label: "Satisfaction Rate",
    icon: Star,
    target: 98,
    suffix: "%",
  },
  {
    value: "4.9",
    label: "App Store Rating",
    icon: Award,
    target: 49,
    decimal: true,
  },
] as const;

type StatItem = (typeof stats)[number] & {
  decimal?: boolean;
  suffix?: string;
};

export function TrustByPeople() {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStatsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsInView) {
      return;
    }

    const duration = 2000;
    const steps = 60;

    const timers = stats.map((stat, index) => {
      const increment = stat.target / steps;
      let current = 0;
      const timer = window.setInterval(() => {
        current += increment;

        if (current >= stat.target) {
          setCounts((prev) => {
            const next = [...prev];
            next[index] = stat.target;
            return next;
          });
          window.clearInterval(timer);
          return;
        }

        setCounts((prev) => {
          const next = [...prev];
          next[index] = Math.floor(current);
          return next;
        });
      }, duration / steps);

      return timer;
    });

    return () => {
      timers.forEach((timer) => window.clearInterval(timer));
    };
  }, [statsInView]);

  const formatCount = (index: number) => {
    const stat = stats[index] as StatItem;

    if (stat.decimal) {
      return `${(counts[index] / 10).toFixed(1)}`;
    }

    if (stat.suffix) {
      return `${counts[index].toLocaleString()}${stat.suffix}`;
    }

    return counts[index].toLocaleString();
  };

  return (
    <section className="px-4 py-20">
      <div className="max-w-5xl mx-auto" ref={statsRef}>
        {/* <AnimatedSection className="text-center mb-16">
          <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3 uppercase tracking-wider text-sm">
            Why People Choose Us
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by a growing community
          </h2>
        </AnimatedSection> */}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="p-2 text-left sm:p-3"
              >
                <div className="flex items-center justify-center gap-3 sm:justify-start">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#C14FE6]/10 text-[#C14FE6] sm:size-12">
                    <Icon className="size-4 sm:size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight text-foreground sm:text-3xl dark:text-white">
                    {statsInView ? formatCount(index) : "0"}
                    </p>
                    <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
