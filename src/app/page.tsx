import type { Metadata } from "next";
import { SiteChrome } from "@/components/corporate/site-chrome";
import { HeroSangPrabu } from "@/components/corporate/hero-sang-prabu";
import { StorytellingHuluHilir } from "@/components/corporate/storytelling-hulu-hilir";
import { SangPrabuProducts } from "@/components/corporate/sang-prabu-products";
import { KbliComplianceSection } from "@/components/corporate/kbli-compliance-section";
import { CompanyProfileHubSection } from "@/components/corporate/company-profile-hub-section";
import { FloatingWhatsappWidget } from "@/components/corporate/floating-whatsapp-widget";

export const metadata: Metadata = {
  title: "SANG PRABU — Karya Sang Prabu 2026 | PT KARYA SANG PRABU",
  description:
    "PT KARYA SANG PRABU (Prima Prabu Group): Produsen Pangan Olahan Halal Berlabel SANG PRABU (Bakso Sang Prabu, Otak-otak Sang Prabu, Dimsum Sang Prabu) & Perdagangan Komoditas Daging Karkas Halal Higienis Rantai Dingin -18°C. Terdaftar dalam 10 Subjek KBLI Resmi.",
  keywords: [
    "SANG PRABU",
    "Karya Sang Prabu 2026",
    "PT KARYA SANG PRABU",
    "PRIMA PRABU GROUP",
    "Bakso Sang Prabu",
    "Otak-otak Sang Prabu",
    "Dimsum Sang Prabu",
    "Daging Karkas Halal",
    "Profil Perusahaan PT Karya Sang Prabu",
    "Cold Storage 52102",
    "KBLI 10120",
    "KBLI 10790",
    "Distributor Frozen Food Halal",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "SANG PRABU — Karya Sang Prabu 2026 | PT KARYA SANG PRABU",
    description:
      "PT KARYA SANG PRABU — Produsen Pangan Olahan Halal Berlabel SANG PRABU (Bakso, Otak-otak, Dimsum) & Daging Karkas Halal Rantai Dingin.",
    url: "https://www.karyasangprabu.co.id",
    images: [
      {
        url: "/images/hero/hero-sang-prabu.jpg",
        width: 1200,
        height: 630,
        alt: "SANG PRABU — Karya Sang Prabu 2026",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <SiteChrome heroTransparent>
      {/* =========================================================================
          1. HERO SECTION (SANG PRABU — Karya Sang Prabu 2026)
          Single Primary Goal: Dorong Klik "Lihat Profil Perusahaan"
          ========================================================================= */}
      <HeroSangPrabu />

      {/* =========================================================================
          2. STORYTELLING HULU KE HILIR (Ladang Lima Style Story Arc)
          Bahan Baku Peternakan -> Manufaktur Higienis -> Cold Storage -18°C
          ========================================================================= */}
      <StorytellingHuluHilir />

      {/* =========================================================================
          3. KATALOG PRODUK BERLABEL SANG PRABU
          Produk Utama: Bakso, Otak-otak, Dimsum | Produk Tambahan: Daging Karkas Halal
          ========================================================================= */}
      <SangPrabuProducts />

      {/* =========================================================================
          4. MATRIKS 10 SUBJEK KBLI RESMI PT KARYA SANG PRABU
          KBLI 10790, 10120, 46322, 4632, 46323, 46324, 47245, 52102
          ========================================================================= */}
      <KbliComplianceSection />

      {/* =========================================================================
          5. PUSAT KONVERSI: PROFIL PERUSAHAAN PT KARYA SANG PRABU
          Aksi Utama: Buka Profil Perusahaan & Unduh Dokumen Resmi
          ========================================================================= */}
      <CompanyProfileHubSection />

      {/* =========================================================================
          6. FLOATING QUICK CONSULTATION WIDGET
          ========================================================================= */}
      <FloatingWhatsappWidget />
    </SiteChrome>
  );
}
