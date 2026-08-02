"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Commodity } from "@/lib/corporate/site";

/** Katalog komoditas dengan filter kategori + pencarian (client-side). */
export function CommodityCatalog({
  commodities,
  categories,
}: {
  commodities: Commodity[];
  categories: readonly string[];
}) {
  const [category, setCategory] = useState<string>("Semua");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return commodities.filter((c) => {
      const catOk = category === "Semua" || c.category === category;
      const qOk =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.en.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [commodities, category, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors",
                category === cat
                  ? "border-brand-green bg-brand-green text-white"
                  : "border-black/10 text-brand-ink/70 hover:border-brand-green/40 hover:text-brand-green",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative sm:w-60">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-ink/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari komoditas…"
            className="h-11 w-full rounded-md border border-black/10 bg-white pl-9 pr-3 text-sm outline-none focus-visible:border-brand-green focus-visible:ring-2 focus-visible:ring-brand-green/20"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div
              key={c.name}
              className="group flex items-start justify-between gap-3 rounded-lg border border-black/5 bg-white px-4 py-3.5 transition-colors hover:border-brand-green/30"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-brand-green-dark">{c.name}</p>
                <p className="truncate text-[12px] italic text-brand-ink/55">{c.en}</p>
                <span className="mt-1.5 inline-block rounded-full bg-brand-green/8 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-brand-green">
                  {c.category}
                </span>
              </div>
              <Link
                href={`/contact?subject=${encodeURIComponent("Permintaan / Penawaran")}`}
                aria-label={`Ajukan permintaan ${c.name}`}
                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-brand-green/30 text-brand-green transition-colors hover:bg-brand-green hover:text-white"
              >
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-[14px] text-brand-ink/60">
          Tidak ada komoditas yang cocok dengan pencarian Anda.
        </p>
      )}
    </div>
  );
}
