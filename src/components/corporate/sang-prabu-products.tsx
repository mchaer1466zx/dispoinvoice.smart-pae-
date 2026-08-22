"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Snowflake,
  ArrowRight,
  Check,
  FileText,
  Building2,
  Package,
} from "lucide-react";
import { SANG_PRABU_CORE_PRODUCTS } from "@/lib/corporate/sang-prabu-data";

export function SangPrabuProducts() {

  return (
    <section
      id="products"
      aria-label="Koleksi Produk Berlabel SANG PRABU"
      className="relative isolate bg-[#031109] py-20 sm:py-28 lg:py-32 text-white overflow-hidden"
    >
      {/* Background Accent Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(rgba(222, 164, 2, 0.4) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Headline */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="size-3.5 text-amber-300" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Katalog Resmi Produk Berlabel SANG PRABU
            </span>
          </div>

          <h2 className="mt-5 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Kelezatan Otentik, <span className="text-amber-400">Halal &amp; Berstandar Pabrik</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-emerald-100/80 leading-relaxed">
            Diproduksi menggunakan bahan baku daging segar pilihan dan formulasi rempah asli Indonesia.
            Tersedia untuk kebutuhan konsumsi rumah tangga, retail modern, hingga kemitraan Horeka &amp; distributor.
          </p>
        </div>

        {/* 3 Produk Utama + 1 Produk Tambahan Grid (Bento Editorial Style) */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {SANG_PRABU_CORE_PRODUCTS.map((prod, idx) => {
            const isMain = prod.category === "Produk Utama";
            return (
              <div
                key={prod.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#062414] via-[#04190e] to-[#020b06] p-6 sm:p-8 shadow-xl transition-all duration-300 hover:border-amber-400/40 hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)]"
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider ${
                        isMain
                          ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                          : "bg-rose-500/20 text-rose-300 border border-rose-400/40"
                      }`}
                    >
                      <Sparkles className="size-3" />
                      {prod.category}
                    </span>

                    <span className="font-mono text-xs text-emerald-300/80">
                      SANG PRABU #{idx + 1}
                    </span>
                  </div>

                  {/* Image Container with Dynamic Aspect */}
                  <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 550px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Temperature Pill */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/70 px-2.5 py-1 text-[11px] font-mono text-sky-300 backdrop-blur-md">
                      <Snowflake className="size-3.5" />
                      <span>{prod.storageTemp}</span>
                    </div>

                    {/* Halal BPJPH Pill */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-black/70 px-2.5 py-1 text-[11px] font-mono text-amber-300 backdrop-blur-md">
                      <ShieldCheck className="size-3.5 text-emerald-400" />
                      <span>Halal BPJPH</span>
                    </div>
                  </div>

                  {/* Product Title & Tagline */}
                  <h3 className="mt-6 font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {prod.name}
                  </h3>

                  <p className="mt-1 font-serif text-xs sm:text-sm font-semibold italic text-amber-200/90">
                    {prod.tagline}
                  </p>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
                    {prod.description}
                  </p>

                  {/* Key Specs */}
                  <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
                    {prod.keySpecs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 text-xs text-emerald-100/90">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* Packaging Options Chips */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">Kemasan:</span>
                    {prod.weightOptions.map((opt, oIdx) => (
                      <span
                        key={oIdx}
                        className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-amber-200"
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="mt-8 flex items-center gap-3 pt-4 border-t border-white/10">
                  <a
                    href={`https://wa.me/628893663031?text=${encodeURIComponent(
                      `Halo PT KARYA SANG PRABU, saya ingin meminta katalog resmi dan penawaran harga grosir untuk produk: ${prod.name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:bg-amber-300 active:scale-95"
                  >
                    <span>Pesan / Minta Penawaran</span>
                    <ArrowRight className="size-3.5" />
                  </a>

                  <Link
                    href="/company-profile"
                    className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <Building2 className="size-4 text-emerald-400" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wholesale & Custom Order Banner */}
        <div className="mt-14 rounded-3xl border border-amber-400/30 bg-gradient-to-r from-[#062414] via-[#08301c] to-[#04170d] p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-lg bg-amber-400/20 px-3 py-1 font-mono text-xs font-bold text-amber-300 border border-amber-400/30">
                <Package className="size-3.5" />
                <span>Kemitraan Distributor, Agen &amp; Horeka</span>
              </div>
              <h4 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
                Butuh Pasokan Rutin atau Private Label (OEM)?
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                Kami melayani kontrak pasokan skala besar untuk jaringan supermarket, restoran, katering, dan distribusi regional dengan spesifikasi kustom serta jaminan pasokan cold-chain stabil.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href="/company-profile"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-950 shadow-lg transition-all hover:scale-102 active:scale-95"
              >
                <FileText className="size-4" />
                <span>Lihat Profil Perusahaan</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
