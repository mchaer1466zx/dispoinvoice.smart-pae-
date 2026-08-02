"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CTA, NAV, SITE } from "@/lib/corporate/site";

/**
 * Navbar korporat: sticky, transparan di atas hero lalu menjadi solid saat
 * di-scroll, responsif dengan menu hamburger di mobile, dan CTA menonjol.
 */
export function SiteNav({ transparent = false }: { transparent?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Kunci scroll body saat menu mobile terbuka.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || !transparent || open;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
        solid
          ? "border-b border-black/5 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6 sm:h-[72px] sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src={SITE.logo}
            alt={`Logo ${SITE.legalName}`}
            className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
          />
          <span
            className={cn(
              "whitespace-nowrap font-display text-[14px] font-semibold leading-none tracking-[-0.01em] transition-colors sm:text-[16px]",
              solid ? "text-brand-green-dark" : "text-white",
            )}
          >
            PT KARYA SANG PRABU
          </span>
        </Link>

        {/* Menu desktop */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-[13px] font-medium tracking-[0.01em] transition-colors",
                solid
                  ? isActive(item.href)
                    ? "text-brand-green"
                    : "text-brand-ink/80 hover:text-brand-green"
                  : isActive(item.href)
                    ? "text-white"
                    : "text-white/85 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(
              "hidden rounded-md border px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors lg:inline-flex lg:items-center",
              solid
                ? "border-brand-green/30 text-brand-green-dark hover:bg-brand-green hover:text-white"
                : "border-white/40 text-white hover:bg-white/10",
            )}
          >
            Masuk
          </Link>
          <Link
            href={CTA.href}
            className="hidden items-center gap-2 rounded-md bg-brand-gold px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#3a2c05] transition-[filter] duration-200 hover:brightness-105 lg:inline-flex"
          >
            {CTA.label}
            <ArrowRight className="size-4" />
          </Link>

          {/* Hamburger mobile */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-md transition-colors lg:hidden",
              solid ? "text-brand-green-dark hover:bg-black/5" : "text-white hover:bg-white/10",
            )}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* Panel menu mobile */}
      {open ? (
        <div className="lg:hidden">
          <div className="border-t border-black/5 bg-white px-6 pb-8 pt-2 shadow-lg">
            <div className="flex flex-col">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "border-b border-black/5 py-3.5 text-[15px] font-medium",
                    isActive(item.href) ? "text-brand-green" : "text-brand-ink/85",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              href={CTA.href}
              onClick={() => setOpen(false)}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-green px-5 py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-white"
            >
              {CTA.label}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2.5 inline-flex w-full items-center justify-center rounded-md border border-brand-green/30 px-5 py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-brand-green-dark"
            >
              Masuk ke Sistem
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
