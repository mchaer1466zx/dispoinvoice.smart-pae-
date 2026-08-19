import type { Metadata } from "next";
/* eslint-disable @next/next/no-page-custom-font */
import { Toaster } from "@/components/ui/sonner";
import { AppHeader } from "@/components/app-header";
import { CompanyProvider } from "@/lib/company-store";
import { AuthProvider } from "@/lib/auth-store";
import { listCompaniesAction, getActiveCompanyAction } from "@/app/actions/companies";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.karyasangprabu.co.id",
  ),
  title: {
    default: "PT KARYA SANG PRABU — Better Proses, Better Quality & Better Serve",
    template: "%s · PT KARYA SANG PRABU",
  },
  description:
    "PT KARYA SANG PRABU — Distributor resmi frozen food halal WIRIDAN 318 & perusahaan komoditas general trading terpercaya di Depok & Jabodetabek. Better Proses, Better Quality & Better Serve.",
  applicationName: "PT KARYA SANG PRABU",
  keywords: [
    "PT KARYA SANG PRABU",
    "Distributor Bakso Halal Wiridan 318",
    "Frozen Food Halal Depok",
    "Pabrik Bakso Sapi Depok",
    "Supplier Dimsum & Otak-Otak Halal",
    "Distributor Frozen Food Jabodetabek",
    "Supplier Bahan Baku Restoran & Horeka",
    "Komoditas Ekspor Impor Indonesia",
    "General Trading Indonesia",
    "PRIMA PRABU GROUP",
  ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://www.karyasangprabu.co.id",
  },
  verification: { google: "6ZK-0mOdS5NeCCj4XhKkI4jwuHFQ9QZvaKKhsrYxiH8" },
  openGraph: {
    type: "website",
    siteName: "PT KARYA SANG PRABU",
    title: "PT KARYA SANG PRABU — Better Proses, Better Quality & Better Serve",
    description:
      "Distributor resmi frozen food halal WIRIDAN 318 (Bakso Sapi Premium, Bakso Urat, Bakso Goreng, Otak-Otak Ikan, Dimsum) & komoditas perdagangan nasional — bagian dari PRIMA PRABU GROUP.",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.karyasangprabu.co.id",
    images: [
      {
        url: "/images/hero/hero-wiridan-master.jpg",
        width: 1376,
        height: 768,
        alt: "WIRIDAN 318 Food & PT KARYA SANG PRABU — Pilihan Terbaik Untuk Keluarga",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PT KARYA SANG PRABU — Better Proses, Better Quality & Better Serve",
    description:
      "Distributor resmi frozen food halal WIRIDAN 318 & komoditas perdagangan nasional.",
    images: ["/images/hero/hero-wiridan-master.jpg"],
  },
  icons: {
    icon: "/images/logo/logo-sang-prabu-favicon.svg",
    shortcut: "/images/logo/logo-sang-prabu-favicon.svg",
    apple: "/images/logo/logo-sang-prabu-favicon.svg",
  },
  themeColor: "#0A3D2A",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [companies, activeCompany] = await Promise.all([
    listCompaniesAction(),
    getActiveCompanyAction(),
  ]);

  return (
    <html lang="id" className="h-full antialiased font-sans">
      <head>
        <meta name="theme-color" content="#0A3D2A" />
        <link rel="preload" href="/images/logo/logo-sang-prabu.webp" as="image" type="image/webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Fraunces:opsz,wght@9..144,400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CompanyProvider companies={companies} activeCompany={activeCompany}>
            <AppHeader />
            {children}
            <Toaster />
          </CompanyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
