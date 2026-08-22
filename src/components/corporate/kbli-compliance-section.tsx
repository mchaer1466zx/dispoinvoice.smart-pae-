"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileCheck2,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Layers,
  Snowflake,
  Truck,
  Warehouse,
  Factory,
  Scale,
  Award,
  ArrowRight,
} from "lucide-react";
import { KBLI_OFFICIAL_LIST } from "@/lib/corporate/sang-prabu-data";

export function KbliComplianceSection() {
  const [filterCategory, setFilterCategory] = useState<string>("Semua");

  const categories = ["Semua", "Produksi & Pengolahan", "Perdagangan Besar", "Pergudangan & Retail"];

  const filteredList =
    filterCategory === "Semua"
      ? KBLI_OFFICIAL_LIST
      : KBLI_OFFICIAL_LIST.filter((k) => k.category === filterCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Layers":
        return <Layers className="size-5 text-amber-400" />;
      case "Snowflake":
        return <Snowflake className="size-5 text-sky-400" />;
      case "Truck":
        return <Truck className="size-5 text-emerald-400" />;
      case "Building2":
        return <Building2 className="size-5 text-amber-400" />;
      case "ShieldCheck":
        return <ShieldCheck className="size-5 text-emerald-400" />;
      case "Scale":
        return <Scale className="size-5 text-sky-400" />;
      case "FileCheck2":
        return <FileCheck2 className="size-5 text-amber-400" />;
      case "Award":
        return <Award className="size-5 text-emerald-400" />;
      case "Warehouse":
        return <Warehouse className="size-5 text-amber-400" />;
      case "Factory":
        return <Factory className="size-5 text-emerald-400" />;
      default:
        return <CheckCircle2 className="size-5 text-amber-400" />;
    }
  };

  return (
    <section
      id="kbli-matrix"
      aria-label="Tujuan & Subjek Legalitas KBLI PT Karya Sang Prabu"
      className="relative isolate bg-[#04170c] py-20 sm:py-28 lg:py-32 text-white overflow-hidden"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1.5 backdrop-blur-md">
            <FileCheck2 className="size-3.5 text-emerald-300" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Legalitas &amp; Subjek Usaha Resmi
            </span>
          </div>

          <h2 className="mt-5 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            10 Subjek KBLI Terdaftar <span className="text-amber-400">PT KARYA SANG PRABU</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-emerald-100/80 leading-relaxed">
            Legalitas komprehensif yang menjamin operasional dari industri pengolahan pangan, perdagangan besar daging &amp; unggas, hingga pergudangan rantai dingin berizin resmi OSS RBA &amp; Kemenkumham RI.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                filterCategory === cat
                  ? "bg-amber-400 text-slate-950 shadow-md font-bold"
                  : "border border-white/15 bg-black/40 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 10 KBLI Cards Matrix (2-column on desktop, full-width on mobile) */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {filteredList.map((item) => (
            <div
              key={`${item.no}-${item.code}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-[#062414] to-[#020d07] p-5 sm:p-6 shadow-lg transition-all duration-200 hover:border-amber-400/40 hover:bg-[#082d1a]"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-amber-400/30">
                      {getIcon(item.iconName)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm sm:text-base font-extrabold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/20">
                        KBLI {item.code}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">#{item.no}</span>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-300 border border-emerald-400/20">
                    {item.category}
                  </span>
                </div>

                <h3 className="mt-4 font-serif text-lg sm:text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/10 text-[11px]">
                <span className="text-emerald-300/80 font-mono">Status: Legal &amp; Aktif</span>
                <span className="font-semibold text-amber-300/90">Karya Sang Prabu 2026</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Banner with Single Focus Action: View Company Profile */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-emerald-950 via-[#062414] to-black/80 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
              <Building2 className="size-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg sm:text-xl font-bold text-white">
                Dokumen Legalitas &amp; Sertifikasi Perusahaan
              </h4>
              <p className="text-xs sm:text-sm text-emerald-100/80">
                NIB terdaftar, sertifikat Halal BPJPH, uji lab BPOM, dan akta pendirian dapat diakses pada Company Profile resmi.
              </p>
            </div>
          </div>

          <Link
            href="/company-profile"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-950 shadow-lg transition-all hover:scale-102 active:scale-95"
          >
            <span>Lihat Profil Perusahaan</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
