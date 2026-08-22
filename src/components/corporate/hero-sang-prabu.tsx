"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  Snowflake,
  Factory,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { BRAND_IMAGES, HERO_IMAGES } from "@/config/images";

export function HeroSangPrabu() {
  const [kspLogo, setKspLogo] = useState<string>(BRAND_IMAGES.sangPrabu.webp);
  const [heroImage, setHeroImage] = useState<string>(HERO_IMAGES.masterWebp);

  return (
    <section
      aria-label="PT KARYA SANG PRABU — Karya Sang Prabu 2026"
      className="relative isolate overflow-hidden bg-[#03140a] pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32 text-white"
    >
      {/* Background Ambience: Subtle Radial Depth in Deep Emerald & Dark Gold */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 20% 30%, rgba(11, 77, 33, 0.45) 0%, rgba(4, 25, 12, 0.85) 60%, #03140a 100%)",
        }}
        aria-hidden
      />

      {/* Signature Rotating Geometric Crest Elements */}
      <div className="pointer-events-none absolute -right-24 -top-24 z-0 opacity-15 hidden lg:block" aria-hidden>
        <svg
          className="size-[700px] animate-[spin_240s_linear_infinite]"
          viewBox="0 0 800 800"
          fill="none"
          stroke="#dea402"
          strokeWidth="1"
        >
          <circle cx="400" cy="400" r="380" strokeDasharray="8 12" />
          <circle cx="400" cy="400" r="310" />
          <circle cx="400" cy="400" r="230" strokeDasharray="4 8" />
          <circle cx="400" cy="400" r="150" />
          {[...Array(12)].map((_, idx) => (
            <line
              key={idx}
              x1="400"
              y1="400"
              x2={400 + 380 * Math.cos((idx * 30 * Math.PI) / 180)}
              y2={400 + 380 * Math.sin((idx * 30 * Math.PI) / 180)}
              strokeDasharray="3 9"
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* =========================================================================
              LEFT COLUMN: DISPLAY TYPOGRAPHY & SINGLE PRIMARY FOCUS CTA
              ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top Identity Chip */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1.5 backdrop-blur-md transition-all hover:bg-amber-400/15">
              <div className="relative size-5 shrink-0">
                <Image
                  src={kspLogo}
                  alt={BRAND_IMAGES.sangPrabu.alt}
                  fill
                  priority
                  sizes="20px"
                  className="object-contain"
                  onError={() => setKspLogo(BRAND_IMAGES.sangPrabu.fallbackPng)}
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                PT KARYA SANG PRABU · PRIMA PRABU GROUP
              </span>
            </div>

            {/* Main Headline Display (Fraunces Display Grande) */}
            <h1 className="mt-5 font-serif text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-white leading-[1.05]">
              SANG <span className="text-amber-400">PRABU</span>
            </h1>

            {/* Tagline 2026 */}
            <div className="mt-3 inline-flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="font-serif text-lg sm:text-2xl font-semibold italic text-amber-200/90 tracking-wide">
                Karya Sang Prabu 2026
              </span>
              <span className="h-px w-8 sm:w-12 bg-amber-400/50 hidden xs:inline-block" />
              <span className="rounded-md border border-emerald-400/40 bg-emerald-950/80 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                10 KBLI Certified
              </span>
            </div>

            {/* Editorial Lead Paragraph */}
            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-emerald-100/90">
              Perusahaan agritech &amp; manufaktur olahan daging terintegrasi hulu-hilir di bawah naungan{" "}
              <strong className="text-white">Prima Prabu Group</strong>. Memproduksi produk pangan beku berlabel{" "}
              <strong className="text-amber-300">SANG PRABU</strong> (Bakso, Otak-otak, Dimsum) serta perdagangan komoditas{" "}
              <strong className="text-white">Daging &amp; Karkas Halal</strong> dengan standar rantai dingin -18°C.
            </p>

            {/* SINGLE PRIMARY FOCUS ACTION: "Lihat Profil Perusahaan" */}
            <div className="mt-8 flex flex-col w-full sm:w-auto sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/company-profile"
                className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-8 py-4 text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-950 shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] active:scale-98"
              >
                <Building2 className="size-5 text-slate-950 shrink-0" />
                <span>Lihat Profil Perusahaan</span>
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <a
                href="#products"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-950/60 px-6 py-4 text-sm font-bold uppercase tracking-wider text-emerald-200 backdrop-blur-md transition-all duration-300 hover:bg-emerald-900/60 hover:text-white hover:border-emerald-400 active:scale-98"
              >
                <span>Eksplorasi Produk</span>
                <ChevronRight className="size-4 text-emerald-400" />
              </a>
            </div>

            {/* Quick Metrics Trust Bar */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 w-full pt-6 border-t border-white/10">
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold text-amber-300">250.000</span>
                <span className="text-[11px] text-emerald-200/80 font-medium">Butir Bakso / Hari</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold text-emerald-300">-18°C</span>
                <span className="text-[11px] text-emerald-200/80 font-medium">Cold-Chain Storage</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold text-amber-300">10 KBLI</span>
                <span className="text-[11px] text-emerald-200/80 font-medium">Izin Usaha Resmi</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold text-emerald-300">100%</span>
                <span className="text-[11px] text-emerald-200/80 font-medium">Halal BPJPH &amp; Higienis</span>
              </div>
            </div>

          </div>

          {/* =========================================================================
              RIGHT COLUMN: SIGNATURE SHOWCASE CARD & FLOATING BADGES
              ========================================================================= */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glow Accent */}
              <div
                className="absolute -inset-1 rounded-3xl opacity-50 blur-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(222,164,2,0.4) 0%, rgba(11,77,33,0.6) 100%)",
                }}
                aria-hidden
              />

              {/* Main Visual Container */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400/40 bg-[#051c0f] shadow-2xl p-2 sm:p-3">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={heroImage}
                    alt="PT Karya Sang Prabu - Karya Sang Prabu 2026"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 550px"
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    onError={() => setHeroImage(HERO_IMAGES.masterJpg)}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03140a] via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Top Badge: Signature Seal */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 rounded-xl border border-amber-400/40 bg-black/70 px-3 py-1.5 backdrop-blur-md">
                    <Sparkles className="size-4 text-amber-400" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      Brand Resmi Sang Prabu
                    </span>
                  </div>

                  {/* Floating Bottom Card: Cold Chain Guarantee */}
                  <div className="absolute bottom-3 inset-x-3 rounded-xl border border-white/15 bg-[#03140a]/90 p-3.5 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                          <Snowflake className="size-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Sistem Rantai Dingin Terpadu</p>
                          <p className="font-mono text-[10px] text-amber-300">KBLI 52102 · Cold Storage -18°C</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        Aktif
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub Features Strip inside the card */}
                <div className="mt-3 grid grid-cols-2 gap-2 p-1 text-xs">
                  <div className="flex items-center gap-2 rounded-xl bg-black/40 p-2.5 border border-white/5">
                    <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                    <span className="text-[11px] text-slate-200">Sertifikasi Halal Resmi</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-black/40 p-2.5 border border-white/5">
                    <Factory className="size-4 text-amber-400 shrink-0" />
                    <span className="text-[11px] text-slate-200">Standar Manufaktur GMP</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
