import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { SiteChrome, PageHero } from "@/components/corporate/site-chrome";
import { Container } from "@/components/corporate/ui";

export default function NotFound() {
  return (
    <SiteChrome>
      <PageHero
        overline="404 — Halaman Tidak Ditemukan"
        title="Halaman yang Anda tuju tidak tersedia"
        description="Maaf, halaman yang Anda cari mungkin telah dipindahkan, diubah alamatnya, atau sudah tidak aktif."
      />
      <section className="bg-white py-16 sm:py-24">
        <Container className="text-center">
          <div className="mx-auto max-w-md">
            <p className="text-[15px] leading-relaxed text-brand-ink/70">
              Silakan kembali ke beranda atau jelajahi lini bisnis dan produk PT KARYA SANG PRABU.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-md bg-brand-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark"
              >
                <Home className="size-4" />
                Kembali ke Beranda
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-md border border-brand-green px-5 py-2.5 text-sm font-medium text-brand-green transition-colors hover:bg-brand-green hover:text-white"
              >
                <ArrowLeft className="size-4" />
                Lihat Produk
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </SiteChrome>
  );
}
