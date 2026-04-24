"use client";

import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { useGetEventsQuery } from "@/lib/features/events/eventsApi";
import type { ProductResponse } from "@/lib/types/product";

function toProduct(event: {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  rating: number;
  category: { id: number; name: string };
  tickets: { price: number }[];
}): ProductResponse {
  const lowestPrice = event.tickets.length
    ? Math.min(...event.tickets.map((ticket) => ticket.price))
    : 0;

  return {
    id: event.id,
    title: event.title,
    price: lowestPrice,
    description: event.description,
    category: {
      id: event.category.id,
      name: event.category.name,
    },
    rating: event.rating,
    thumbnailUrl: event.thumbnailUrl,
  };
}

export function FeaturedProductsSection() {
  const { data: events, isLoading } = useGetEventsQuery({
    page: 0,
    size: 50,
  });

  const products = (events?.content ?? [])
    .filter((event) => event.category?.name?.toLowerCase().includes("concert"))
    .slice(0, 8)
    .map(toProduct);

  return (
    <section className="container mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          Featured Concerts
        </h2>
        <Link
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          href="/events"
        >
          See all
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-xl border border-border bg-card/60 p-6 text-center text-muted-foreground">
          No concert events found.
        </div>
      )}
    </section>
  );
}
