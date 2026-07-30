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
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowRail } from "@/components/flow-rail";
import { Reveal } from "@/components/reveal";
import { BRAND } from "@/lib/brand";
import { isAdminAction } from "@/app/actions/auth";
import { getDashboardSummaryAction } from "@/app/actions/dashboard";
import { getMonthlyTrendAction } from "@/app/actions/reports";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: "Dashboard",
};

type ModuleLink = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

// Modul dikelompokkan sesuai peran nyatanya — pengelompokan ini menyampaikan
// struktur kerja, bukan sekadar daftar rata.
const GROUPS: { title: string; caption: string; items: ModuleLink[] }[] = [
  {
    title: "Alur Pengadaan",
    caption: "Dari permintaan pembelian sampai barang diterima.",
    items: [
      {
        href: "/buat-pr",
        title: "Purchase Request",
        description: "Ajukan permintaan pembelian dari departemen.",
        icon: ClipboardList,
      },
      {
        href: "/buat-rfq",
        title: "RFQ — Permintaan Penawaran",
        description: "Minta penawaran harga ke pemasok.",
        icon: FileQuestion,
      },
      {
        href: "/buat-po",
        title: "Purchase Order",
        description: "Terbitkan pesanan pembelian ke pemasok.",
        icon: ShoppingCart,
      },
      {
        href: "/buat-grn",
        title: "Goods Receipt (GRN)",
        description: "Catat barang yang diterima dari pemasok.",
        icon: PackageCheck,
      },
    ],
  },
  {
    title: "Penjualan & Tagihan",
    caption: "Penawaran ke pelanggan, invoice, dan tagihan pemasok.",
    items: [
      {
        href: "/buat-quotation",
        title: "Penawaran (Quotation)",
        description: "Terbitkan penawaran harga ke pelanggan.",
        icon: BadgeDollarSign,
      },
      {
        href: "/buat-invoice",
        title: "Invoice",
        description: "Susun dan cetak invoice pelanggan.",
        icon: Receipt,
      },
      {
        href: "/buat-tagihan",
        title: "Tagihan Pemasok",
        description: "Catat tagihan masuk & lacak pembayaran.",
        icon: ReceiptText,
      },
    ],
  },
  {
    title: "Arsip & Data",
    caption: "Riwayat dokumen, master data, dan laporan.",
    items: [
      {
        href: "/memo",
        title: "Memo",
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
    ],
  },
];

export default async function DashboardPage() {
  const [isAdmin, summary, trend] = await Promise.all([
    isAdminAction(),
    getDashboardSummaryAction(),
    getMonthlyTrendAction(),
  ]);

  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  const stats = [
    {
      label: "Piutang belum lunas",
      value: formatCurrency(summary.piutang.total),
      sub: `${summary.piutang.count} invoice`,
      accent: "text-emerald-700 dark:text-emerald-400",
    },
    {
      label: "Hutang ke pemasok",
      value: formatCurrency(summary.hutang.total),
      sub: `${summary.hutang.count} tagihan`,
      accent: "text-seal",
    },
    {
      label: "PR menunggu approval",
      value: String(summary.prMenungguApproval),
      sub: "perlu ditinjau",
      accent: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Penawaran diterima",
      value: String(summary.quotationDiterima),
      sub: "siap ditindaklanjuti",
      accent: "text-emerald-700 dark:text-emerald-400",
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
    <div className="flex flex-1 flex-col bg-[#f7f4ec] dark:bg-black">
      {/* Masthead hijau — kop dashboard (tampil langsung, tanpa reveal) */}
      <header
        className="relative overflow-hidden border-b-2 border-gold/50 text-white"
        style={{
          background:
            "radial-gradient(120% 140% at 100% -20%, #0f5c2a 0%, #0b4d21 45%, #06331a 100%)",
        }}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-5 pb-20 pt-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase leading-[1.4] tracking-[0.28em] text-gold/80">
              {BRAND.appName}
            </p>
            <h1 className="mt-3 font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.015em] sm:text-[2.5rem]">
              Dashboard
            </h1>
            <p className="mt-2 max-w-md text-[15px] leading-[1.6] text-white/70">
              Ruang kerja {BRAND.groupName}. Pilih modul untuk mulai menyusun
              dokumen.
            </p>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/70">
            {today}
          </p>
        </div>
      </header>

      <main className="relative z-10 mx-auto -mt-12 flex w-full max-w-5xl flex-col gap-14 px-5 pb-20 sm:px-8">
        {/* Kartu ledger — angka penting (reveal berjenjang) */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delayMs={i * 70}>
              <div className="rounded-xl border border-t-2 border-border border-t-gold bg-card p-5 shadow-sm">
                <p className="font-mono text-[11px] uppercase leading-[1.4] tracking-[0.2em] text-muted-foreground">
                  {s.label}
                </p>
                <p
                  className={`mt-3 font-display text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.01em] ${s.accent}`}
                >
                  {s.value}
                </p>
                <p className="mt-2 text-[13px] leading-[1.5] text-muted-foreground">
                  {s.sub}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Modul, dikelompokkan per peran */}
        {GROUPS.map((group, gi) => {
          const items = group.items.filter((it) => !it.adminOnly || isAdmin);
          if (items.length === 0) return null;
          return (
            <Reveal key={group.title}>
              <section className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-4">
                    <h2 className="font-display text-[1.5rem] font-semibold leading-[1.2] tracking-[-0.01em] text-foreground">
                      {group.title}
                    </h2>
                    <span className="h-px flex-1 bg-gold/25" aria-hidden />
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {String(gi + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-[15px] leading-[1.6] text-muted-foreground">
                    {group.caption}
                  </p>
                </div>

                {/* Echo alur pengadaan (tenang) di atas grup pertama */}
                {gi === 0 && (
                  <div className="rounded-xl border border-border bg-card p-6">
                    <FlowRail tone="light" />
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map(({ href, title, description, icon: Icon }) => (
                    <Link key={href} href={href} className="group">
                      <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-[transform,border-color,box-shadow] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:border-gold group-hover:shadow-md">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-gold/20 transition-colors duration-300 ease-out group-hover:bg-primary/15">
                          <Icon className="size-5" />
                        </span>
                        <h3 className="mt-4 text-[1.0625rem] font-semibold leading-[1.3] text-foreground">
                          {title}
                        </h3>
                        <p className="mt-2 flex-1 text-[14px] leading-[1.6] text-muted-foreground">
                          {description}
                        </p>
                        <span className="mt-4 text-[14px] font-medium text-primary">
                          Buka →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </Reveal>
          );
        })}

        {/* Analitik */}
        <Reveal>
          <div className="grid gap-5 lg:grid-cols-5">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-[1.25rem] font-semibold leading-[1.2]">
                    Tren Dokumen
                  </h2>
                  <p className="mt-1 text-[14px] leading-[1.6] text-muted-foreground">
                    Jumlah dokumen dibuat per bulan (6 bulan terakhir).
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/laporan">
                    <FileSpreadsheet /> Laporan
                  </Link>
                </Button>
              </div>
              <div className="mt-6">
                <TrendChart points={trend} />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
              <h2 className="font-display text-[1.25rem] font-semibold leading-[1.2]">
                Jumlah Dokumen
              </h2>
              <p className="mt-1 text-[14px] leading-[1.6] text-muted-foreground">
                Total tersimpan per jenis.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {countItems.map((c) => (
                  <div
                    key={c.label}
                    className="rounded-lg border border-border p-4 transition-colors duration-300 ease-out hover:border-gold/40"
                  >
                    <p className="font-mono text-[1.75rem] font-semibold leading-[1.1] text-foreground">
                      {c.value}
                    </p>
                    <p className="mt-1 text-[13px] leading-[1.4] text-muted-foreground">
                      {c.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
