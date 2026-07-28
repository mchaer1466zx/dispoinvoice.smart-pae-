"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PoPreviewActions } from "@/components/po/po-preview-actions";
import {
  CbsDocument,
  type CbsGroup,
  type CbsTotalRow,
} from "@/components/procurement/cbs-document";
import {
  COMPANY_THEMES,
  COMPANY_IDS,
  DEFAULT_COMPANY,
  type CompanyId,
} from "@/config/company-themes";

type Example = {
  docNumber: string;
  perihal: string;
  partyName: string;
  partyLines: string[];
  date: string;
  validity?: string;
  groups: CbsGroup[];
  subtotal: number;
  extraRows: CbsTotalRow[];
  grandTotal: number;
  notes: string;
  paymentTerms: string[];
  bankInfo: string;
  summary: string;
};

const PAYMENT_50_40_10 = [
  "50% Uang Muka (DP) setelah PO disetujui",
  "40% Setelah material kirim",
  "10% Pelunasan setelah selesai 100% & QC lulus",
];

/**
 * Contoh PDF per perusahaan — angka disusun agar foot persis ke subtotalnya.
 * Ganti tab perusahaan → seluruh identitas & tema visual PDF ikut berubah.
 */
const EXAMPLES: Record<CompanyId, Example> = {
  // KSP — cold storage (data CBS, PPN 11%): 195jt → 216,45jt
  KSP: {
    docNumber: "PO/KSP/2026/07/009",
    perihal: "Pekerjaan Panel PU B2 (Anti-Bakar) + Mesin Pendingin Ruang 3x5m",
    partyName: "PT CIPTA BAHARI SEJUK (CBS)",
    partyLines: ["Telp 021 5239 2994 / 0858 6727 4424"],
    date: "2026-07-29",
    validity: "2026-08-19",
    subtotal: 195_000_000,
    extraRows: [{ label: "PPN (11%)", value: 21_450_000 }],
    grandTotal: 216_450_000,
    notes:
      "Harga belum termasuk pekerjaan sipil. Garansi 12 bulan sejak serah terima. Suhu target -18°C s/d -20°C.",
    paymentTerms: PAYMENT_50_40_10,
    bankInfo: "BCA · a/n AKHMAD NASROJIKIN · No. 047 0571 390",
    summary: "Subtotal Rp195.000.000 · PPN 11% Rp21.450.000 · Grand Total Rp216.450.000",
    groups: [
      {
        label: "Persiapan Pekerjaan",
        subtotal: 5_000_000,
        items: [
          { description: "Transportasi Teknisi", qty: 1, unit: "lot", unitPrice: 2_000_000, amount: 2_000_000 },
          { description: "Alat Bantu & Tools", qty: 1, unit: "lot", unitPrice: 1_500_000, amount: 1_500_000 },
          { description: "Expedisi", qty: 1, unit: "lot", unitPrice: 1_500_000, amount: 1_500_000 },
        ],
      },
      {
        label: "Pekerjaan Ruangan 3x5m",
        subtotal: 87_310_000,
        items: [
          { description: "Dinding & Atap Panel PU B2 10cm", spec: "anti-bakar 42-45kg/m³", qty: 86.4, unit: "m²", unitPrice: 800_000, amount: 69_120_000 },
          { description: "Lantai PU Slab 10cm", qty: 18, unit: "m²", unitPrice: 500_000, amount: 9_000_000 },
          { description: "Pintu Swing 1x2 berinsulasi", qty: 1, unit: "unit", unitPrice: 3_500_000, amount: 3_500_000 },
          { description: "Accessories, Lampu LED, Ventilator & Kabel", qty: 1, unit: "lot", unitPrice: 2_000_000, amount: 2_000_000 },
          { description: "Jasa Pemasangan Panel & Pintu", qty: 1, unit: "lot", unitPrice: 3_690_000, amount: 3_690_000 },
        ],
      },
      {
        label: "Pekerjaan Mesin Baru",
        subtotal: 102_690_000,
        items: [
          { description: "Evaporator XMK", qty: 1, unit: "unit", unitPrice: 28_000_000, amount: 28_000_000 },
          { description: "Mesin WCUC 04 (Condensing Unit)", qty: 1, unit: "unit", unitPrice: 35_000_000, amount: 35_000_000 },
          { description: "Panel Kontrol 380/220 Volt", qty: 1, unit: "unit", unitPrice: 4_500_000, amount: 4_500_000 },
          { description: "Pipa Tembaga, Isolasi & Kabel Kontrol", qty: 1, unit: "lot", unitPrice: 5_700_000, amount: 5_700_000 },
          { description: "Freon R404A, Oli & Expansi", qty: 1, unit: "lot", unitPrice: 3_640_000, amount: 3_640_000 },
          { description: "Support Mesin & Evaporator", qty: 1, unit: "lot", unitPrice: 1_250_000, amount: 1_250_000 },
          { description: "Jasa Pasang Mesin", qty: 1, unit: "lot", unitPrice: 15_000_000, amount: 15_000_000 },
          { description: "Commissioning & Test Run", qty: 1, unit: "lot", unitPrice: 9_600_000, amount: 9_600_000 },
        ],
      },
    ],
  },

  // PAE — perdagangan komoditas: 850jt → 943,5jt
  PAE: {
    docNumber: "PO/PAE/2026/07/012",
    perihal: "Pengadaan Komoditas Beras & Minyak Goreng Curah",
    partyName: "CV Mitra Pangan Nusantara",
    partyLines: ["Pasar Induk Cipinang, Jakarta Timur", "Telp 021 4890 1122"],
    date: "2026-07-29",
    validity: "2026-08-12",
    subtotal: 850_000_000,
    extraRows: [{ label: "PPN (11%)", value: 93_500_000 }],
    grandTotal: 943_500_000,
    notes:
      "Harga franco gudang pembeli. Kualitas sesuai sampel yang disetujui. Timbangan di lokasi bongkar.",
    paymentTerms: [
      "30% Uang Muka saat PO terbit",
      "70% Pelunasan saat barang diterima & ditimbang",
    ],
    bankInfo: "Bank Mandiri · a/n PT Prima Andalas Energi · No. 123 000 456 789",
    summary: "Subtotal Rp850.000.000 · PPN 11% Rp93.500.000 · Grand Total Rp943.500.000",
    groups: [
      {
        label: "Komoditas Pangan",
        subtotal: 850_000_000,
        items: [
          { description: "Beras Medium IR64", spec: "kadar air maks 14%", qty: 50, unit: "ton", unitPrice: 11_000_000, amount: 550_000_000 },
          { description: "Minyak Goreng Curah", spec: "CPO olahan", qty: 20, unit: "ton", unitPrice: 15_000_000, amount: 300_000_000 },
        ],
      },
    ],
  },

  // PUB — pengadaan umum kantor + jasa distribusi: 100jt → 111jt
  PUB: {
    docNumber: "PO/PUB/2026/07/007",
    perihal: "Pengadaan Perlengkapan Kantor & Jasa Distribusi",
    partyName: "PT Sinar Office Solusi",
    partyLines: ["Kawasan Pergudangan Bekasi", "Telp 021 8877 6655"],
    date: "2026-07-29",
    validity: "2026-08-19",
    subtotal: 100_000_000,
    extraRows: [{ label: "PPN (11%)", value: 11_000_000 }],
    grandTotal: 111_000_000,
    notes:
      "Termasuk pengiriman & pemasangan di kantor pusat. Garansi produk 12 bulan.",
    paymentTerms: PAYMENT_50_40_10,
    bankInfo: "BNI · a/n PT Prabu Unggul Bersama · No. 088 776 5544",
    summary: "Subtotal Rp100.000.000 · PPN 11% Rp11.000.000 · Grand Total Rp111.000.000",
    groups: [
      {
        label: "Perlengkapan Kantor",
        subtotal: 80_000_000,
        items: [
          { description: "Meja Kerja Kantor", qty: 20, unit: "unit", unitPrice: 2_500_000, amount: 50_000_000 },
          { description: "Kursi Ergonomis", qty: 20, unit: "unit", unitPrice: 1_500_000, amount: 30_000_000 },
        ],
      },
      {
        label: "Jasa Distribusi",
        subtotal: 20_000_000,
        items: [
          { description: "Pengiriman, Bongkar Muat & Pemasangan", qty: 1, unit: "lot", unitPrice: 20_000_000, amount: 20_000_000 },
        ],
      },
    ],
  },
};

export default function ContohPdfPage() {
  const [companyId, setCompanyId] = useState<CompanyId>(DEFAULT_COMPANY);
  const example = EXAMPLES[companyId];
  const theme = COMPANY_THEMES[companyId];

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="w-fit" asChild>
            <Link href="/dashboard">
              <ArrowLeft /> Kembali
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            Contoh Dokumen PDF
          </h1>
          <p className="text-sm text-muted-foreground">
            Pilih perusahaan untuk melihat bagaimana warna, logo, kop, ornamen,
            watermark, footer, dan nomor dokumen berubah otomatis.
          </p>
        </div>

        {/* Pemilih perusahaan */}
        <div className="flex flex-wrap gap-2">
          {COMPANY_IDS.map((cid) => (
            <Button
              key={cid}
              type="button"
              variant={cid === companyId ? "default" : "outline"}
              size="sm"
              onClick={() => setCompanyId(cid)}
            >
              {COMPANY_THEMES[cid].fullName}
            </Button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{example.perihal}</CardTitle>
            <CardDescription>{example.summary}</CardDescription>
          </CardHeader>
          <CardContent>
            <PoPreviewActions filename={`Contoh-${theme.id}.pdf`}>
              <CbsDocument
                docTitle="PURCHASE ORDER"
                docNumber={example.docNumber}
                companyId={companyId}
                perihal={example.perihal}
                partyLabel="Kepada Yth (Vendor)"
                partyName={example.partyName}
                partyLines={example.partyLines}
                dateLabel="Tanggal Pemesanan"
                date={example.date}
                validity={example.validity}
                groups={example.groups}
                subtotal={example.subtotal}
                extraRows={example.extraRows}
                grandTotal={example.grandTotal}
                notes={example.notes}
                paymentTerms={example.paymentTerms}
                bankInfo={example.bankInfo}
              />
            </PoPreviewActions>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
