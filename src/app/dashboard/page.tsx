import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeDollarSign,
  ClipboardList,
  FileQuestion,
  FileSpreadsheet,
  FileText,
  History,
  PackageCheck,
  Receipt,
  ReceiptText,
  Settings,
  ShoppingCart,
  StickyNote,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BRAND } from "@/lib/brand";
import { isAdminAction } from "@/app/actions/auth";
import { getDashboardSummaryAction } from "@/app/actions/dashboard";
import { getMonthlyTrendAction } from "@/app/actions/reports";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { formatCurrency } from "@/lib/format";

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
    href: "/buat-rfq",
    title: "Buat RFQ (Permintaan Penawaran)",
    description: "Minta penawaran harga ke pemasok.",
    icon: FileQuestion,
  },
  {
    href: "/buat-po",
    title: "Buat Purchase Order",
    description: "Terbitkan pesanan pembelian ke pemasok.",
    icon: ShoppingCart,
  },
  {
    href: "/buat-grn",
    title: "Buat Goods Receipt (GRN)",
    description: "Catat barang yang diterima dari pemasok.",
    icon: PackageCheck,
  },
  {
    href: "/buat-quotation",
    title: "Buat Penawaran (Quotation)",
    description: "Terbitkan penawaran harga ke pelanggan.",
    icon: BadgeDollarSign,
  },
  {
    href: "/buat-invoice",
    title: "Buat Invoice",
    description: "Susun dan cetak invoice pelanggan.",
    icon: Receipt,
  },
  {
    href: "/buat-tagihan",
    title: "Buat Tagihan Pemasok",
    description: "Catat tagihan masuk dari pemasok & lacak pembayaran.",
    icon: ReceiptText,
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
    href: "/laporan",
    title: "Laporan & Export Excel",
    description: "Rekap seluruh dokumen + nilai, ekspor ke Excel.",
    icon: FileSpreadsheet,
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
    adminOnly: true,
  },
];

export default async function DashboardPage() {
  const [isAdmin, summary, trend] = await Promise.all([
    isAdminAction(),
    getDashboardSummaryAction(),
    getMonthlyTrendAction(),
  ]);
  const links = LINKS.filter((link) => !link.adminOnly || isAdmin);

  const stats = [
    {
      label: "Piutang (invoice belum lunas)",
      value: formatCurrency(summary.piutang.total),
      sub: `${summary.piutang.count} dokumen`,
      accent: "text-emerald-600",
    },
    {
      label: "Hutang (tagihan pemasok belum lunas)",
      value: formatCurrency(summary.hutang.total),
      sub: `${summary.hutang.count} dokumen`,
      accent: "text-rose-600",
    },
    {
      label: "PR menunggu approval",
      value: String(summary.prMenungguApproval),
      sub: "perlu ditinjau",
      accent: "text-amber-600",
    },
    {
      label: "Penawaran diterima",
      value: String(summary.quotationDiterima),
      sub: "siap ditindaklanjuti",
      accent: "text-sky-600",
    },
  ];

  const countItems: { label: string; value: number }[] = [
    { label: "RFQ", value: summary.counts.rfq },
    { label: "PR", value: summary.counts.pr },
    { label: "PO", value: summary.counts.po },
    { label: "GRN", value: summary.counts.grn },
    { label: "Penawaran", value: summary.counts.quotation },
    { label: "Invoice", value: summary.counts.invoice },
    { label: "Tagihan Pemasok", value: summary.counts.supplierInvoice },
    { label: "Memo", value: summary.counts.memo },
  ];

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

        {/* Ringkasan angka */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">{s.label}</CardDescription>
                <CardTitle className={`text-xl ${s.accent}`}>{s.value}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-xs text-muted-foreground">
                {s.sub}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tren dokumen 6 bulan */}
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3 pb-2">
            <div>
              <CardTitle className="text-base">Tren Dokumen</CardTitle>
              <CardDescription>
                Jumlah dokumen dibuat per bulan (6 bulan terakhir).
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/laporan">
                <FileSpreadsheet /> Laporan &amp; Export
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <TrendChart points={trend} />
          </CardContent>
        </Card>

        {/* Jumlah dokumen per jenis */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Jumlah Dokumen</CardTitle>
            <CardDescription>Total dokumen tersimpan per jenis.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {countItems.map((c) => (
              <div key={c.label} className="rounded-lg border p-3">
                <p className="text-2xl font-semibold">{c.value}</p>
                <p className="text-xs text-muted-foreground">{c.label}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map(({ href, title, description, icon: Icon }) => (
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
