import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.karyasangprabu.co.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Area aplikasi (procurement) & privat tidak perlu diindeks.
      disallow: [
        "/api/",
        "/dashboard",
        "/buat-po",
        "/buat-pr",
        "/buat-rfq",
        "/buat-quotation",
        "/buat-invoice",
        "/buat-tagihan",
        "/riwayat",
        "/riwayat-dokumen",
        "/pengaturan",
        "/profil",
        "/pelanggan",
        "/login",
        "/daftar",
      ],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
