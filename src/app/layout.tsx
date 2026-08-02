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
  metadataBase: new URL("https://primaprabu-group-raul-pae.vercel.app"),
  title: {
    default: "PT KARYA SANG PRABU — The Best Partner Your Business",
    template: "%s · PT KARYA SANG PRABU",
  },
  description:
    "PT KARYA SANG PRABU — perusahaan pangan beku halal, perdagangan, dan kemitraan bisnis. Partner jangka panjang yang mengutamakan mutu, integritas, dan keunggulan.",
  applicationName: "PT KARYA SANG PRABU",
  keywords: [
    "PT KARYA SANG PRABU",
    "SANG PRABU",
    "frozen food halal",
    "bakso",
    "otak-otak",
    "dimsum",
    "kemitraan bisnis",
    "PRIMA PRABU GROUP",
  ],
  verification: { google: "6ZK-0mOdS5NeCCj4XhKkI4jwuHFQ9QZvaKKhsrYxiH8" },
  openGraph: {
    type: "website",
    siteName: "PT KARYA SANG PRABU",
    title: "PT KARYA SANG PRABU — The Best Partner Your Business",
    description:
      "Perusahaan pangan beku halal, perdagangan, dan kemitraan bisnis — bagian dari PRIMA PRABU GROUP.",
    locale: "id_ID",
  },
  robots: { index: true, follow: true },
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
