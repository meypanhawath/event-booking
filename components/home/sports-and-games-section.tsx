"use client";

import { useMemo } from "react";
import Link from "next/link";

import { useGetCategoriesQuery } from "@/lib/features/admin/adminApi";
import { useGetEventsQuery } from "@/lib/features/events/eventsApi";
import { ProductCard } from "@/components/product-card";
import type { ProductResponse } from "@/lib/types/product";
import type { EventResponse } from "@/lib/types/event";

type CategoryConfig = {
  title: string;
  query: string;
};

const categoryConfig: CategoryConfig = {
  title: "Sport Events",
  query: "sport",
};

const normalize = (value: string) => value.trim().toLowerCase();

function toProduct(event: EventResponse): ProductResponse {
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

function CategorySection({
  title,
  products,
  isLoading,
}: {
  title: string;
  products: ProductResponse[];
  isLoading: boolean;
}) {
  return (
    <section className="container mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
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
          No sport products found in this category.
        </div>
      )}
    </section>
  );
}

export function SportsAndGamesSections() {
  const { data: categories } = useGetCategoriesQuery();

  const resolvedSportCategory = useMemo(() => {
    const categoryNames = categories?.map((category) => category.name) ?? [];

    return (
      categoryNames.find((name) => normalize(name).includes("sport")) ??
      categoryNames.find((name) => normalize(name).includes("football")) ??
      categoryConfig.query
    );
  }, [categories]);

  const { data, isLoading } = useGetEventsQuery({
    page: 0,
    size: 50,
  });

  const products = useMemo(
    () =>
      (data?.content ?? [])
        .filter((event) => event.category?.name === resolvedSportCategory)
        .slice(0, 8)
        .map(toProduct),
    [data, resolvedSportCategory],
  );

  return (
    <CategorySection
      title={categoryConfig.title}
      products={products}
      isLoading={isLoading}
    />
  );
}
