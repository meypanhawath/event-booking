"use client";

import Image from "next/image";
import { Star } from "lucide-react";

import type { ProductResponse } from "@/lib/types/product";

type ProductCardProps = {
  product: ProductResponse;
};

export function ProductCard({ product }: ProductCardProps) {
  const rating = Number.isFinite(product.rating) ? product.rating : 0;
  const priceLabel =
    product.price > 0 ? `$${product.price.toLocaleString()}` : "Free";
  const thumbnail = product.thumbnailUrl || "/hero.jpg";

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-accent/50 hover:shadow-lg">
      <div className="relative aspect-16/11 overflow-hidden bg-muted">
        <Image
          src={thumbnail}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm dark:bg-black/80 dark:text-white">
          {product.category.name}
        </span>

        {rating > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-foreground">
          {product.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-semibold tracking-wide text-brand-main">
            {priceLabel}
          </span>
          {rating > 0 ? (
            <span className="text-xs text-muted-foreground">
              Rated {rating.toFixed(1)}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">New item</span>
          )}
        </div>
      </div>
    </article>
  );
}