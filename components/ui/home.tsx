"use client";

import { useEffect, useState } from "react";
import { Goal, Music4, PartyPopper, Ticket } from "lucide-react";

import { ProductResponse } from "@/lib/types/product";
import Navbar from "@/components/ui/navbar";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";

type UserResponse = {
    id: number;
    name: string;
    email: string;
    avatar: string;
    role: string;
};

const categories = [
    { label: "Concerts", icon: Music4, accent: "from-fuchsia-500/20 to-pink-500/10 text-fuchsia-500" },
    { label: "Shows", icon: Ticket, accent: "from-sky-500/20 to-cyan-500/10 text-sky-500" },
    { label: "Sports", icon: Goal, accent: "from-amber-500/20 to-orange-500/10 text-amber-500" },
    { label: "Festivals", icon: PartyPopper, accent: "from-emerald-500/20 to-lime-500/10 text-emerald-500" },
] as const;


export default function Home() {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadData() {
            const response = await fetch("", {
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error(`Home request failed with status ${response.status}`);
            }

            const data: {
                products: ProductResponse[];
                users: UserResponse[];
            } = await response.json();

            if (!cancelled) {
                setProducts(data.products);
                setUsers(data.users);
                setErrorMessage(null);
            }
        }

        void loadData().catch((error) => {
            console.error("Failed to load homepage data", error);
            if (!cancelled) {
                setErrorMessage(error instanceof Error ? error.message : "Failed to load homepage data");
            }
        });

        return () => {
            cancelled = true;
        };
    }, []);

    const categoryFilters = [
        "All",
        ...Array.from(new Set(products.map((product) => product.category.name))),
    ];

    const visibleProducts = products
        .filter(
            (product) =>
                activeCategory === "All" || product.category.name === activeCategory
        )
        .slice(0, 4);


    const topSingers = users.slice(0, 8);

    return (
        <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
            <div>
                <div className="relative isolate min-h-screen top-0">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-12%,rgba(168,85,247,0.2),transparent_40%),linear-gradient(180deg,#fcfcff_0%,#f7f8fc_30%,#f1f5f9_100%)] dark:bg-[radial-gradient(circle_at_50%_-12%,rgba(168,85,247,0.34),transparent_38%),linear-gradient(180deg,#17111f_0%,#100f13_24%,#0d0d10_100%)]"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-[48%] bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.05)_30%,rgba(15,23,42,0.1))] dark:bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.5)_30%,rgba(0,0,0,0.72))]"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-[42%] bg-[radial-gradient(circle_at_10%_100%,rgba(2,6,23,0.04),transparent_18%),radial-gradient(circle_at_20%_100%,rgba(2,6,23,0.04),transparent_14%),radial-gradient(circle_at_32%_100%,rgba(2,6,23,0.04),transparent_16%),radial-gradient(circle_at_45%_100%,rgba(2,6,23,0.04),transparent_18%),radial-gradient(circle_at_60%_100%,rgba(2,6,23,0.04),transparent_16%),radial-gradient(circle_at_74%_100%,rgba(2,6,23,0.04),transparent_18%),radial-gradient(circle_at_88%_100%,rgba(2,6,23,0.04),transparent_16%)] opacity-40 blur-xl dark:bg-[radial-gradient(circle_at_10%_100%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_20%_100%,rgba(255,255,255,0.08),transparent_14%),radial-gradient(circle_at_32%_100%,rgba(255,255,255,0.08),transparent_16%),radial-gradient(circle_at_45%_100%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_60%_100%,rgba(255,255,255,0.08),transparent_16%),radial-gradient(circle_at_74%_100%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_88%_100%,rgba(255,255,255,0.08),transparent_16%)]"
                    />
                    <Navbar />
                    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-9xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
                        <section className="flex flex-1 flex-col items-center justify-center pt-16 text-center sm:pt-20">
                            <div className="max-w-4xl">
                                <h1 className="text-balance text-4xl font-bold leading-none tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                                    What <span className="text-fuchsia-400">Concert</span> would
                                    <br className="hidden sm:block" /> you like to go to?
                                </h1>
                                <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground sm:text-base">
                                    More than 100 concerts in different countries are now available
                                    to you.
                                </p>
                            </div>

                            <div className="mt-12 w-full max-w-5xl rounded-[22px] border border-border bg-card/90 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur dark:shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                                <div className="grid grid-cols-2 gap-2 border-b border-border p-4 sm:grid-cols-4 sm:gap-0 sm:p-5">
                                    {categories.map(({ label, icon: Icon, accent }) => (
                                        <button
                                            key={label}
                                            type="button"
                                            className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-left text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground sm:justify-start"
                                        >
                                            <span className={`inline-flex size-5 items-center justify-center rounded-full bg-gradient-to-br ${accent}`}>
                                                <Icon className="size-3" />
                                            </span>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <section className="container mx-auto mt-12">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">Concert</h2>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {categoryFilters.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => setActiveCategory(item)}
                                        className={`rounded-full border px-3 py-1 text-xs transition ${
                                            activeCategory === item
                                                ? "border-accent/50 bg-accent/15 text-accent"
                                                : "border-border bg-card text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Link className="text-sm text-muted-foreground transition hover:text-foreground" href="/show">
                            See all
                        </Link>
                    </div>

                    {errorMessage ? (
                        <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
                    ) : null}

	                    <div className="mt-6">
	                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
	                          {visibleProducts.map((product) => (
	                            <ProductCard key={product.id} product={product} />
	                          ))}
	                        </div>
	                    </div>
	                </section>

	                <section className="container mx-auto mt-12">
                    <div className="flex items-end justify-between gap-4">
                        <h2 className="text-xl font-semibold text-foreground">Show</h2>
                        <Link className="text-sm text-muted-foreground transition hover:text-foreground" href="/show">
                            See all
                        </Link>
                    </div>

	                    <div className="mt-6">
	                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
	                          {visibleProducts.map((product) => (
	                            <ProductCard key={product.id} product={product} />
	                          ))}
	                        </div>
	                    </div>
	                </section>

                <section className="container mx-auto mt-14">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-foreground">Top singers</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Featured artists pulled from the latest API data.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {topSingers.map((artist, index) => (
                            <article
                                key={artist.id}
                                className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-3 py-3"
                            >
                                <div className="h-12 w-12 overflow-hidden rounded-2xl bg-muted/50">
                                    {artist.avatar ? (
                                        <img
                                            src={artist.avatar}
                                            alt={artist.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className={`h-full w-full bg-gradient-to-br ${
                                                [
                                                    "from-orange-500 to-pink-600",
                                                    "from-blue-400 to-cyan-600",
                                                    "from-violet-500 to-fuchsia-700",
                                                    "from-zinc-500 to-zinc-800",
                                                    "from-red-500 to-amber-500",
                                                    "from-emerald-400 to-teal-600",
                                                    "from-yellow-400 to-orange-600",
                                                    "from-indigo-400 to-purple-600",
                                                ][index % 8]
                                            }`}
                                        />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-medium text-foreground">{artist.name}</h3>
                                    <p className="truncate text-xs text-muted-foreground">{artist.role}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
