"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X, Sparkles, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteNav({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [kspLogoSrc, setKspLogoSrc] = useState("/images/logo/logo-sang-prabu.webp");
  const [wiridanLogoSrc, setWiridanLogoSrc] = useState("/images/logo/logo-wiridan-318-gold.webp");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || !transparent || open;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Produk 318", href: "/#products" },
    { label: "Kualitas & Pabrik", href: "/#quality" },
    { label: "Kemitraan B2B", href: "/#calculator" },
    { label: "Tentang Kami", href: "/about" },
    { label: "Company Profile", href: "/company-profile" },
    { label: "Kontak", href: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-amber-400/20 bg-[#04140b]/95 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          : "border-b border-white/10 bg-[#041209]/70 backdrop-blur-md",
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Header Logo (Brand Wiridan 318 Gold & PT Karya Sang Prabu) */}
        <Link href="/" aria-label="PT Karya Sang Prabu - Wiridan 318" className="flex shrink-0 items-center gap-2 sm:gap-2.5 group">
          {/* PT Karya Sang Prabu Crest */}
          <div className="relative h-10 w-10 shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={kspLogoSrc}
              alt="Logo Resmi PT Karya Sang Prabu"
              fill
              priority
              sizes="40px"
              className="object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
              onError={() => setKspLogoSrc("/logos/logo-sang-prabu.png")}
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-amber-400/40 font-serif text-xs">|</span>
          {/* Wiridan 318 Royal Emblem */}
          <div className="relative h-10 w-12 shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={wiridanLogoSrc}
              alt="Logo Resmi Wiridan 318 Gold - PT Karya Sang Prabu"
              fill
              priority
              sizes="48px"
              className="object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
              onError={() => setWiridanLogoSrc("/images/logo/logo-wiridan-318-gold.png")}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-base font-extrabold tracking-wider text-amber-300 group-hover:text-amber-200 transition-colors">
                WIRIDAN 318
              </span>
              <span className="rounded bg-amber-400/20 px-1.5 py-0.2 text-[8px] font-bold text-amber-300 border border-amber-400/30">
                FOOD
              </span>
            </div>
            <span className="text-[9px] font-medium tracking-wider text-slate-300/80 uppercase">
              PT KARYA SANG PRABU
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <div className="hidden items-center gap-1 xl:flex 2xl:gap-2">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-amber-300"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Action Buttons: Portal Login + Request Quote / Katalog */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden rounded-xl border border-white/20 px-3.5 py-2 text-[12px] font-semibold uppercase tracking-wider text-white transition-all hover:bg-white/10 sm:inline-flex active:scale-95"
          >
            Portal
          </Link>

          <a
            href={`https://wa.me/628893663031?text=${encodeURIComponent(
              "Halo Tim Sales PT KARYA SANG PRABU, saya ingin meminta katalog resmi dan penawaran harga grosir (kartonan) produk Wiridan 318."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative hidden xs:inline-flex sm:inline-flex items-center gap-1.5 sm:gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-extrabold uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-103 hover:shadow-[0_0_30px_rgba(212,175,55,0.7)] active:scale-95"
          >
            <Sparkles className="size-3.5 text-slate-950 shrink-0" />
            <span className="truncate">Request Quote</span>
          </a>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-white/20 text-white hover:bg-white/10 active:scale-95 xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {open ? (
        <div className="xl:hidden">
          <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-amber-400/20 bg-[#041209]/98 px-5 sm:px-6 pb-8 pt-4 text-white shadow-2xl backdrop-blur-2xl">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-medium text-slate-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="size-3.5 opacity-60" />
                </Link>
              ))}
              <Link
                href="/admin/sop"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl border-t border-white/10 mt-2 px-4 py-3 text-[14px] font-semibold text-emerald-400 hover:bg-white/5"
              >
                <span>SOP Pabrik &amp; Kontrol Mutu</span>
                <ArrowRight className="size-3.5 opacity-60" />
              </Link>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`https://wa.me/628893663031?text=${encodeURIComponent(
                  "Halo Tim Sales PT KARYA SANG PRABU, saya ingin meminta katalog resmi dan penawaran harga grosir (kartonan) produk Wiridan 318."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-3.5 text-[13px] font-bold uppercase tracking-wider text-slate-950 shadow-lg active:scale-98 transition-all"
              >
                <FileText className="size-4" />
                <span>Request Quote / Katalog via WhatsApp</span>
              </a>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-[13px] font-bold uppercase tracking-wider text-white hover:bg-white/10 active:scale-98 transition-all"
              >
                Masuk ke Portal Internal
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

