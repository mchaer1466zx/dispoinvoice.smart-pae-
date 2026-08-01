import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Fraunces,
  Plus_Jakarta_Sans,
  Cinzel,
} from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AppHeader } from "@/components/app-header";
import { CompanyProvider } from "@/lib/company-store";
import { AuthProvider } from "@/lib/auth-store";
import { listCompaniesAction, getActiveCompanyAction } from "@/app/actions/companies";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Serif tampil (Fraunces) untuk wordmark & judul — memberi kesan resmi/terukir
// khas kop surat, dipakai terbatas. Body & data tetap Geist.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Plus Jakarta Sans — sans ramah buatan Indonesia, dipakai untuk isi brand
// makanan SANG PRABU di halaman depan (hangat & mudah didekati).
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Cinzel — serif klasik/terukir (all-caps) untuk wordmark "PT KARYA SANG PRABU"
// pada kop dokumen, selaras identitas visual logo SANG PRABU.
const cinzel = Cinzel({
  variable: "--font-crest",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sistem Pengadaan Digital · PRIMA PRABU GROUP",
    template: "%s · Prima Prabu Group",
  },
  description:
    "Sistem Pengadaan Digital Prima Prabu Group — Purchase Request, Purchase Order, penawaran, invoice, dan tagihan.",
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${jakarta.variable} ${cinzel.variable} h-full antialiased`}
    >
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
