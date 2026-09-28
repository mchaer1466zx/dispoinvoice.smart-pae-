import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Penampil Company Profile RESMI PT Karya Sang Prabu — halaman PDF asli
 * dirender jadi gambar (isi dipertahankan persis), plus tombol unduh PDF.
 * Halaman ini publik.
 */
export const metadata: Metadata = {
  title: "Company Profile",
  description:
    "Company Profile resmi PT Karya Sang Prabu — Property Investment & General Trading.",
};

const PDF = "/sang-prabu/compro/company-profile.pdf";
const TOTAL = 15;
const PAGES = Array.from(
  { length: TOTAL },
  (_, i) => `/sang-prabu/compro/hal-${String(i + 1).padStart(2, "0")}.jpg`,
);

export default function CompanyProfilePage() {
  return (
    <div className="flex flex-1 flex-col bg-[#f1efe6] font-jakarta text-[#23271f]">
      {/* Masthead */}
      <header
        className="border-b-2 border-gold/50 text-white"
        style={{
          background:
            "radial-gradient(120% 140% at 100% -20%, #0f5c2a 0%, #0b4d21 45%, #06331a 100%)",
        }}
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/80">
              Company Profile
            </p>
            <h1 className="mt-2 font-display text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.015em] sm:text-[2.25rem]">
              PT Karya Sang Prabu
            </h1>
            <p className="mt-1 text-[14px] text-white/70">
              Dokumen resmi — {TOTAL} halaman.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-gold text-[#3a2c05] hover:bg-gold-bright"
            >
              <a href={PDF} target="_blank" rel="noopener noreferrer" download>
                <Download /> Unduh PDF
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/profil-perusahaan">
                <ArrowLeft /> Profil
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Halaman-halaman compro */}
      <main className="mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-4 py-8 sm:px-8 sm:py-10">
        {PAGES.map((src, i) => (
          <figure
            key={src}
            className="w-full overflow-hidden rounded-xl border border-[#dcd6c8] bg-white shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Company Profile halaman ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              className="block h-auto w-full"
            />
          </figure>
        ))}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="bg-primary text-white hover:bg-primary/90">
            <a href={PDF} target="_blank" rel="noopener noreferrer" download>
              <Download /> Unduh PDF ({TOTAL} halaman)
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft /> Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
