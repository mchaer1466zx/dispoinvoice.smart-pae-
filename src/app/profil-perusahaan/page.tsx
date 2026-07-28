"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  COMPANY_THEMES,
  COMPANY_IDS,
  DEFAULT_COMPANY,
  type CompanyId,
} from "@/config/company-themes";

/**
 * Profil PUBLIK 3 perusahaan (KSP · PAE · PUB) dengan tab. Tiap tab memakai
 * identitas + palet warna perusahaan masing-masing dari COMPANY_THEMES.
 * Halaman ini publik (lihat proxy.ts).
 */
export default function ProfilPerusahaanPage() {
  const [active, setActive] = useState<CompanyId>(DEFAULT_COMPANY);
  const theme = COMPANY_THEMES[active];
  const c = theme.colors;

  const contacts = [
    { icon: MapPin, label: "Alamat", value: theme.address },
    { icon: Phone, label: "Telepon", value: theme.phone },
    { icon: Mail, label: "Email", value: theme.email },
    { icon: Globe, label: "Website", value: theme.website },
  ];

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      {/* Tab pemilih perusahaan */}
      <div className="mx-auto flex w-full max-w-3xl flex-wrap gap-2 px-4 pt-6 sm:px-8">
        {COMPANY_IDS.map((cid) => {
          const t = COMPANY_THEMES[cid];
          const isActive = cid === active;
          return (
            <button
              key={cid}
              type="button"
              onClick={() => setActive(cid)}
              className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
              style={
                isActive
                  ? { background: t.colors.primary, color: "#FFFFFF", borderColor: t.colors.primary }
                  : { background: "transparent" }
              }
            >
              <img src={t.logoPath} alt="" className="h-5 w-5 rounded object-contain" />
              {t.id}
            </button>
          );
        })}
      </div>

      {/* Kop dengan tema perusahaan aktif */}
      <header
        className="mt-4 px-6 py-12 text-center sm:px-8"
        style={{ background: c.primary, color: "#FFFFFF" }}
      >
        <img
          src={theme.logoPath}
          alt={`Logo ${theme.fullName}`}
          width={130}
          height={130}
          className="mx-auto h-28 w-28 object-contain sm:h-32 sm:w-32"
        />
        <h1
          className="mt-5 text-2xl font-extrabold uppercase tracking-wide sm:text-3xl"
          style={{ letterSpacing: "0.06em" }}
        >
          {theme.fullName}
        </h1>
        <p
          className="mt-2 text-sm font-semibold uppercase sm:text-base"
          style={{ color: c.accent, letterSpacing: "0.2em" }}
        >
          {theme.tagline}
        </p>
        {theme.subTagline ? (
          <p className="mt-1 text-xs italic text-white/80">{theme.subTagline}</p>
        ) : null}
        <div className="relative mx-auto mt-6 max-w-md">
          <div style={{ height: 3, background: c.accent }} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-8">
        <section
          className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900"
          style={{ borderColor: c.accent }}
        >
          <h2 className="text-lg font-bold" style={{ color: c.primary }}>
            Tentang Perusahaan
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {theme.subTagline
              ? `${theme.fullName} bergerak di bidang ${theme.subTagline}.`
              : `${theme.fullName} — mitra pengadaan tepercaya dengan komitmen ${theme.tagline}.`}
          </p>

          <dl className="mt-6 flex flex-col gap-4">
            {contacts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: c.primary, color: "#FFFFFF" }}
                >
                  <Icon className="size-4" />
                </span>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="text-sm font-medium">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild style={{ background: c.primary, color: "#FFFFFF" }}>
              <Link href="/login">Masuk ke Sistem</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2026 {theme.fullName} · Sistem Pengadaan Digital
        </p>
      </main>
    </div>
  );
}
