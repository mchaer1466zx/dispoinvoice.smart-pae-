import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND, BRAND_COLORS as C } from "@/lib/brand";

/**
 * Landing page publik: headline grup + tagline + tombol "Masuk ke Sistem".
 * Logo grup belum ditetapkan, jadi halaman depan tampil tanpa logo.
 * Halaman ini publik (lihat proxy.ts). Pengguna yang sudah login diarahkan ke
 * /dashboard oleh alur login.
 */
export default function LandingPage() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center"
      style={{ background: C.green, color: C.white }}
    >
      <h1
        className="text-3xl font-extrabold uppercase sm:text-5xl"
        style={{ letterSpacing: "0.06em" }}
      >
        {BRAND.groupName}
      </h1>
      <p
        className="mt-3 text-sm font-semibold uppercase sm:text-lg"
        style={{ color: C.gold, letterSpacing: "0.24em" }}
      >
        {BRAND.groupTagline}
      </p>

      <div className="relative mx-auto mt-6 w-40">
        <div style={{ height: 3, background: C.gold }} />
        <span
          className="absolute left-1/2 -top-3 -translate-x-1/2 px-2 text-xl"
          style={{ color: C.red, background: C.green }}
        >
          ∞
        </span>
      </div>

      <p className="mt-6 max-w-md text-sm text-white/80 sm:text-base">
        {BRAND.appName} — kelola Purchase Request, Purchase Order, invoice, dan
        memo dalam satu sistem yang rapi dan terlacak.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button
          size="lg"
          asChild
          style={{ background: C.gold, color: C.black }}
        >
          <Link href="/login">
            Masuk ke Sistem <ArrowRight />
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          asChild
          className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
        >
          <Link href="/profil-perusahaan">
            <Building2 /> Profil Perusahaan
          </Link>
        </Button>
      </div>

      <p className="mt-12 text-xs text-white/60">
        © 2026 {BRAND.groupName} · {BRAND.appName}
      </p>
    </div>
  );
}
