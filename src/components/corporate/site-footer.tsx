"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AtSign, MapPin, Phone, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { SITE } from "@/lib/corporate/site";

export function SiteFooter() {
  const [kspLogoSrc, setKspLogoSrc] = useState("/images/logo/logo-sang-prabu.webp");
  const [wiridanLogoSrc, setWiridanLogoSrc] = useState("/images/logo/logo-wiridan-318-gold.webp");
  return (
    <footer className="relative isolate border-t border-amber-400/20 bg-gradient-to-b from-[#04150c] via-[#020b06] to-[#010603] text-white">
      {/* Subtle Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle 800px at 50% 100%, #07381e 0%, transparent 80%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:px-8 lg:grid-cols-12">
        {/* Footer Dual Logos */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4">
            {/* PT Karya Sang Prabu */}
            <Link href="/" aria-label="PT Karya Sang Prabu" className="group flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 rounded-xl border border-amber-400/30 bg-black/40 p-1 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
                <Image
                  src={kspLogoSrc}
                  alt="Logo Resmi PT Karya Sang Prabu"
                  fill
                  sizes="48px"
                  className="object-contain p-0.5"
                  onError={() => setKspLogoSrc("/logos/logo-sang-prabu.png")}
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>

            <span className="text-amber-400/50 font-serif text-sm">✕</span>

            {/* Wiridan 318 Food */}
            <Link href="/#products" aria-label="Wiridan 318 Food" className="group flex items-center gap-3">
              <div className="relative h-12 w-14 shrink-0 rounded-xl border border-amber-400/30 bg-black/40 p-1 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
                <Image
                  src={wiridanLogoSrc}
                  alt="Logo Resmi Wiridan 318 Food"
                  fill
                  sizes="56px"
                  className="object-contain"
                  onError={() => setWiridanLogoSrc("/images/logo/logo-wiridan-318-gold.png")}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm font-extrabold tracking-wider text-amber-300">
                  WIRIDAN 318
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  PT KARYA SANG PRABU
                </span>
              </div>
            </Link>
          </div>

          <p className="mt-5 max-w-md text-xs leading-relaxed text-slate-300/85">
            Produsen makanan beku higienis <strong>WIRIDAN 318</strong> dan perusahaan perdagangan
            komoditas nasional terpercaya. Berkomitmen menghadirkan kualitas mutu pangan unggulan,
            sertifikasi Halal resmi BPJPH, dan kepatuhan standar cold-chain terpadu.
          </p>

          {/* Legalitas Badges */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] text-emerald-300">
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3 py-1 font-mono">
              <ShieldCheck className="size-3 text-emerald-400" />
              <span>NIB: 9120413121192</span>
            </span>
            <span className="flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-950/60 px-3 py-1 font-mono text-amber-300">
              <Sparkles className="size-3 text-amber-400" />
              <span>Halal: ID00410000123456721</span>
            </span>
          </div>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Holding: PRIMA PRABU GROUP
          </p>
        </div>

        {/* Menu Navigasi */}
        <div className="lg:col-span-3">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
            Navigasi &amp; Akses
          </p>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
            <li>
              <Link href="/" className="hover:text-amber-300 transition-colors">
                Halaman Utama
              </Link>
            </li>
            <li>
              <Link href="/#products" className="hover:text-amber-300 transition-colors">
                Koleksi Produk Wiridan 318
              </Link>
            </li>
            <li>
              <Link href="/#calculator" className="hover:text-amber-300 transition-colors">
                Kalkulator Grosir &amp; Logistik
              </Link>
            </li>
            <li>
              <Link href="/#lead-form" className="hover:text-amber-300 transition-colors">
                Permohonan SPKPD &amp; Sampel
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-amber-300 transition-colors">
                Tentang PT Karya Sang Prabu
              </Link>
            </li>
            <li>
              <Link href="/company-profile" className="hover:text-amber-300 transition-colors">
                Company Profile &amp; Legalitas
              </Link>
            </li>
            <li>
              <Link href="/admin/sop" className="hover:text-emerald-300 transition-colors font-medium">
                SOP Pabrik &amp; Standar QC
              </Link>
            </li>
          </ul>
        </div>

        {/* Kontak Resmi */}
        <div className="lg:col-span-4">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
            Kantor &amp; Manajemen
          </p>
          <ul className="mt-4 space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-amber-400" />
              <span>{SITE.address.line}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-amber-400" />
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-amber-300 font-mono">
                {SITE.phone} · (0889 3663 031)
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-amber-400" />
              <a href={`mailto:${SITE.email}`} className="hover:text-amber-300 font-mono">
                {SITE.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <AtSign className="size-4 shrink-0 text-amber-400" />
              <a
                href="https://www.instagram.com/karyasangprabu.group"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-300 font-mono"
              >
                @karyasangprabu.group
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 bg-black/50 py-5 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 sm:flex-row">
          <span>
            © {new Date().getFullYear()} PT KARYA SANG PRABU. All Rights Reserved.
          </span>
          <span className="font-serif text-amber-400/80">
            Better Proses, Better Quality &amp; Better Serve
          </span>
        </div>
      </div>
    </footer>
  );
}

