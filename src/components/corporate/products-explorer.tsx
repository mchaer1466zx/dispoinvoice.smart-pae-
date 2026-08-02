"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/corporate/site";

/** Katalog produk dengan filter kategori + pencarian (client-side). */
export function ProductsExplorer({
  products,
  categories,
}: {
  products: Product[];
  categories: readonly string[];
}) {
  const [category, setCategory] = useState<string>(categories[0] ?? "Semua");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const catOk = category === "Semua" || p.category === category;
      const qOk =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [products, category, query]);

  return (
    <div>
      {/* Kontrol filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full border px-4 py-2 text-[12.5px] font-medium transition-colors",
                category === cat
                  ? "border-brand-green bg-brand-green text-white"
                  : "border-black/10 text-brand-ink/70 hover:border-brand-green/40 hover:text-brand-green",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-ink/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk…"
            className="h-11 w-full rounded-md border border-black/10 bg-white pl-9 pr-3 text-sm outline-none focus-visible:border-brand-green focus-visible:ring-2 focus-visible:ring-brand-green/20"
          />
        </div>
      </div>

      {/* Grid produk */}
      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-[0_14px_40px_-30px_rgba(11,77,33,0.6)]"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-green">
                  {product.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-semibold text-brand-green-dark">
                  {product.name}
                </h3>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-brand-ink/70">
                  {product.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {product.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-full bg-brand-green/8 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-brand-green"
                    >
                      {b}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/contact?subject=${encodeURIComponent("Pemesanan Produk")}`}
                  className="mt-5 inline-flex items-center gap-1.5 self-start rounded-md border border-brand-green px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-green-dark transition-colors hover:bg-brand-green hover:text-white"
                >
                  Inquire Now
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-[14px] text-brand-ink/60">
          Tidak ada produk yang cocok dengan pencarian Anda.
        </p>
      )}
    </div>
  );
}
