import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Sistem Pengadaan Digital · PT KARYA SANG PRABU",
    template: "%s · PT KSP",
  },
  description:
    "Sistem Pengadaan Digital PT Karya Sang Prabu — Purchase Request, Purchase Order, invoice, dan memo.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
