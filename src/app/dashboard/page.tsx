import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList,
  FileText,
  History,
  Settings,
  ShoppingCart,
  StickyNote,
  Users,
  Receipt,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Dashboard",
};

const LINKS = [
  {
    href: "/buat-pr",
    title: "Buat Purchase Request",
    description: "Ajukan permintaan pembelian dari departemen.",
    icon: ClipboardList,
  },
  {
    href: "/buat-po",
    title: "Buat Purchase Order",
    description: "Terbitkan pesanan pembelian ke pemasok.",
    icon: ShoppingCart,
  },
  {
    href: "/buat-invoice",
    title: "Buat Invoice",
    description: "Susun dan cetak invoice pelanggan.",
    icon: Receipt,
  },
  {
    href: "/memo",
    title: "Buat Memo",
    description: "Catatan/instruksi internal antar bagian.",
    icon: StickyNote,
  },
  {
    href: "/riwayat",
    title: "Riwayat Dokumen",
    description: "Semua PR, PO, invoice, dan memo tersimpan.",
    icon: History,
  },
  {
    href: "/pelanggan",
    title: "Pelanggan",
    description: "Kelola data pelanggan penerima invoice.",
    icon: Users,
  },
  {
    href: "/contoh-pdf",
    title: "Contoh Dokumen PDF",
    description: "Lihat contoh format PDF gaya resmi perusahaan.",
    icon: FileText,
  },
  {
    href: "/pengaturan",
    title: "Pengaturan",
    description: "Master data perusahaan penerbit & logo.",
    icon: Settings,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Selamat datang di {BRAND.appName} {BRAND.name}. Pilih modul untuk
            mulai bekerja.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map(({ href, title, description, icon: Icon }) => (
            <Link key={href} href={href} className="group">
              <Card className="h-full transition-colors group-hover:border-primary">
                <CardHeader>
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle className="mt-2 text-base">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm font-medium text-primary">
                  Buka →
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
