/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND, BRAND_COLORS as C } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Profil Perusahaan",
  description: `Profil resmi ${BRAND.name} — ${BRAND.appName}.`,
};

/**
 * Halaman PROFIL PUBLIK PT Karya Sang Prabu (bukan halaman login, bukan
 * manajemen). Menampilkan identitas resmi lengkap dengan palet warna & logo
 * besar. Dapat diakses tanpa login (lihat daftar public path di proxy.ts).
 */
export default function ProfilPerusahaanPage() {
  const contacts = [
    { icon: MapPin, label: "Alamat", value: BRAND.address },
    { icon: Phone, label: "Telepon", value: BRAND.phone },
    { icon: Mail, label: "Email", value: BRAND.email },
    { icon: Globe, label: "Website", value: BRAND.website },
  ];

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      {/* Kop hijau dengan logo besar & tagline emas */}
      <header
        className="px-6 py-12 text-center sm:px-8"
        style={{ background: C.green, color: C.white }}
      >
        <img
          src={BRAND.logoPath}
          alt={`Logo ${BRAND.name}`}
          width={140}
          height={140}
          className="mx-auto h-32 w-32 object-contain sm:h-36 sm:w-36"
        />
        <h1
          className="mt-5 text-3xl font-extrabold uppercase tracking-wide sm:text-4xl"
          style={{ letterSpacing: "0.08em" }}
        >
          {BRAND.name}
        </h1>
        <p
          className="mt-2 text-sm font-semibold uppercase sm:text-base"
          style={{ color: C.gold, letterSpacing: "0.22em" }}
        >
          {BRAND.tagline}
        </p>
        {/* garis hijau-emas dengan simpul */}
        <div className="relative mx-auto mt-6 max-w-md">
          <div style={{ height: 3, background: C.gold }} />
          <span
            className="absolute left-1/2 -top-3 -translate-x-1/2 px-2 text-lg"
            style={{ color: C.red, background: C.green }}
          >
            ∞
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-8">
        <section
          className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900"
          style={{ borderColor: C.gold }}
        >
          <h2
            className="text-lg font-bold"
            style={{ color: C.green }}
          >
            {BRAND.appName}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform pengadaan digital resmi {BRAND.name} untuk pengelolaan
            Purchase Request, Purchase Order, invoice, dan memo secara rapi,
            terlacak, dan berstandar dokumen perusahaan.
          </p>

          <dl className="mt-6 flex flex-col gap-4">
            {contacts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: C.green, color: C.white }}
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
            <Button asChild style={{ background: C.green, color: C.white }}>
              <Link href="/login">Masuk ke Sistem</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2026 {BRAND.name} · {BRAND.appName}
        </p>
      </main>
    </div>
  );
}
