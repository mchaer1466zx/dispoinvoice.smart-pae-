/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { AtSign, MapPin, Phone, Mail } from "lucide-react";
import { NAV, SITE } from "@/lib/corporate/site";

/** Footer korporat: identitas, kontak, menu, copyright. */
export function SiteFooter() {
  return (
    <footer className="bg-brand-green-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1.1fr]">
        {/* Identitas */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src={SITE.logo}
              alt={`Logo ${SITE.legalName}`}
              className="h-14 w-14 object-contain"
            />
            <div>
              <p className="font-display text-lg font-semibold leading-tight">
                {SITE.legalName}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand-gold">
                {SITE.tagline}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-[13px] leading-[1.7] text-white/70">
            {SITE.positioning}
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
            Bagian dari {SITE.group}
          </p>
        </div>

        {/* Menu */}
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-gold">
            Navigasi
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[13px] text-white/75 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-gold">
            Kontak
          </p>
          <ul className="mt-4 space-y-3 text-[13px] text-white/75">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-gold" />
              <span>{SITE.address.line}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-brand-gold" />
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-white">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-brand-gold" />
              <a href={`mailto:${SITE.email}`} className="hover:text-white">
                {SITE.email}
              </a>
            </li>
            {SITE.socials.map((s) => (
              <li key={s.href} className="flex items-center gap-2.5">
                <AtSign className="size-4 shrink-0 text-brand-gold" />
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  {s.handle}{" "}
                  <span className="text-white/45">· {s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-center text-[12px] text-white/55 sm:flex-row sm:px-8 sm:text-left">
          <span>
            © {new Date().getFullYear()} {SITE.legalName}. All Rights Reserved.
          </span>
          <span className="font-mono uppercase tracking-[0.14em]">
            {SITE.tagline}
          </span>
        </div>
      </div>
    </footer>
  );
}
