"use client";

import {
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Grid2x2,
  MapPin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FilterPageProps = {
  categories: string[];
  activeCategory: string;
  whenOptions: string[];
  activeWhen: string;
  whereOptions: string[];
  activeWhere: string;
  priceOptions: string[];
  activePrice: string;
  onCategoryChange: (category: string) => void;
  onWhenChange: (value: string) => void;
  onWhereChange: (value: string) => void;
  onPriceChange: (value: string) => void;
};

export default function FilterPage({
  categories,
  activeCategory,
  whenOptions,
  activeWhen,
  whereOptions,
  activeWhere,
  priceOptions,
  activePrice,
  onCategoryChange,
  onWhenChange,
  onWhereChange,
  onPriceChange,
}: FilterPageProps) {
  return (
    <section className="w-full">
      <div className="mx-auto grid w-full max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-16 rounded-md border border-border bg-background/70 px-4 text-left transition hover:border-muted-foreground/35 hover:bg-muted/45"
            >
              <div className="text-sm leading-none text-muted-foreground">
                Category
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  <Grid2x2
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="max-w-32 truncate">{activeCategory}</span>
                </span>
                <ChevronDown
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-72 overflow-y-auto">
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => onCategoryChange(category)}
                className={
                  activeCategory === category
                    ? "bg-brand-main/10 text-brand-main"
                    : undefined
                }
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-16 rounded-md border border-border bg-background/70 px-4 text-left transition hover:border-muted-foreground/35 hover:bg-muted/45"
            >
              <div className="text-sm leading-none text-muted-foreground">
                When
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  <CalendarDays
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="max-w-32 truncate">{activeWhen}</span>
                </span>
                <ChevronDown
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-72 overflow-y-auto">
            {whenOptions.map((value) => (
              <DropdownMenuItem
                key={value}
                onClick={() => onWhenChange(value)}
                className={
                  activeWhen === value
                    ? "bg-brand-main/10 text-brand-main"
                    : undefined
                }
              >
                {value}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-16 rounded-md border border-border bg-background/70 px-4 text-left transition hover:border-muted-foreground/35 hover:bg-muted/45"
            >
              <div className="text-sm leading-none text-muted-foreground">
                Where
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  <MapPin
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="max-w-32 truncate">{activeWhere}</span>
                </span>
                <ChevronDown
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-72 overflow-y-auto">
            {whereOptions.map((value) => (
              <DropdownMenuItem
                key={value}
                onClick={() => onWhereChange(value)}
                className={
                  activeWhere === value
                    ? "bg-brand-main/10 text-brand-main"
                    : undefined
                }
              >
                {value}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-16 rounded-md border border-border bg-background/70 px-4 text-left transition hover:border-muted-foreground/35 hover:bg-muted/45"
            >
              <div className="text-sm leading-none text-muted-foreground">
                Price
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  <CircleDollarSign
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="max-w-32 truncate">{activePrice}</span>
                </span>
                <ChevronDown
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-72 overflow-y-auto">
            {priceOptions.map((value) => (
              <DropdownMenuItem
                key={value}
                onClick={() => onPriceChange(value)}
                className={
                  activePrice === value
                    ? "bg-brand-main/10 text-brand-main"
                    : undefined
                }
              >
                {value}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
}
