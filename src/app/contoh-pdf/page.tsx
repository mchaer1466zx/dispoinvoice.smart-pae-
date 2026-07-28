"use client";

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
import { CompanyLogoUploadHint } from "@/components/invoice/company-logo-upload-hint";
import {
  CbsDocument,
  type CbsGroup,
  type CbsTotalRow,
} from "@/components/procurement/cbs-document";
import { useCompany } from "@/lib/company-store";

/**
 * Contoh dokumen PO "Pembuatan Cold Storage 3x5m" (vendor PT Cipta Bahari
 * Sejuk) dengan angka tetap yang cocok persis: Subtotal Rp195.000.000, PPN
 * 11% Rp21.450.000, Grand Total Rp216.450.000 (Dua Ratus Enam Belas Juta
 * Empat Ratus Lima Puluh Ribu Rupiah). Setiap kelompok di-foot tepat ke
 * subtotalnya. Dipakai sebagai referensi tampilan tabel bertingkat (Romawi).
 */
const EXAMPLE_GROUPS: CbsGroup[] = [
  {
    label: "Persiapan Pekerjaan",
    subtotal: 5_000_000,
    items: [
      {
        description: "Transportasi Teknisi",
        qty: 1,
        unit: "lot",
        unitPrice: 2_000_000,
        amount: 2_000_000,
      },
      {
        description: "Alat Bantu & Tools",
        qty: 1,
        unit: "lot",
        unitPrice: 1_500_000,
        amount: 1_500_000,
      },
      {
        description: "Expedisi",
        qty: 1,
        unit: "lot",
        unitPrice: 1_500_000,
        amount: 1_500_000,
      },
    ],
  },
  {
    label: "Pekerjaan Ruangan 3x5m",
    subtotal: 87_310_000,
    items: [
      {
        description: "Dinding & Atap Panel PU B2 10cm",
        spec: "anti-bakar, dencity 42-45kg/m³",
        qty: 86.4,
        unit: "m²",
        unitPrice: 800_000,
        amount: 69_120_000,
      },
      {
        description: "Lantai PU Slab 10cm",
        qty: 18,
        unit: "m²",
        unitPrice: 500_000,
        amount: 9_000_000,
      },
      {
        description: "Pintu Swing 1x2 berinsulasi",
        qty: 1,
        unit: "unit",
        unitPrice: 3_500_000,
        amount: 3_500_000,
      },
      {
        description: "Accessories, Lampu LED, Ventilator & Kabel",
        qty: 1,
        unit: "lot",
        unitPrice: 2_000_000,
        amount: 2_000_000,
      },
      {
        description: "Jasa Pemasangan Panel & Pintu",
        qty: 1,
        unit: "lot",
        unitPrice: 3_690_000,
        amount: 3_690_000,
      },
    ],
  },
  {
    label: "Pekerjaan Mesin Baru",
    subtotal: 102_690_000,
    items: [
      {
        description: "Evaporator XMK",
        qty: 1,
        unit: "unit",
        unitPrice: 28_000_000,
        amount: 28_000_000,
      },
      {
        description: "Mesin WCUC 04 (Condensing Unit)",
        qty: 1,
        unit: "unit",
        unitPrice: 35_000_000,
        amount: 35_000_000,
      },
      {
        description: "Panel Kontrol 380/220 Volt",
        qty: 1,
        unit: "unit",
        unitPrice: 4_500_000,
        amount: 4_500_000,
      },
      {
        description: "Pipa Tembaga, Isolasi & Kabel Kontrol",
        qty: 1,
        unit: "lot",
        unitPrice: 5_700_000,
        amount: 5_700_000,
      },
      {
        description: "Freon R404A, Oli & Expansi",
        qty: 1,
        unit: "lot",
        unitPrice: 3_640_000,
        amount: 3_640_000,
      },
      {
        description: "Support Mesin & Evaporator",
        qty: 1,
        unit: "lot",
        unitPrice: 1_250_000,
        amount: 1_250_000,
      },
      {
        description: "Jasa Pasang Mesin",
        qty: 1,
        unit: "lot",
        unitPrice: 15_000_000,
        amount: 15_000_000,
      },
      {
        description: "Commissioning & Test Run",
        qty: 1,
        unit: "lot",
        unitPrice: 9_600_000,
        amount: 9_600_000,
      },
    ],
  },
];

const EXAMPLE_SUBTOTAL = 195_000_000;
const EXAMPLE_EXTRA_ROWS: CbsTotalRow[] = [
  { label: "PPN (11%)", value: 21_450_000 },
];
const EXAMPLE_GRAND_TOTAL = 216_450_000;

const EXAMPLE_NOTES =
  "Harga belum termasuk pekerjaan sipil. Perubahan di luar penawaran = addendum. Garansi 12 bulan sejak serah terima. Suhu target -18°C s/d -20°C.";

const EXAMPLE_PAYMENT_TERMS = [
  "50% Uang Muka (DP) setelah PO disetujui",
  "40% Setelah material kirim",
  "10% Pelunasan setelah selesai 100% & QC lulus",
];

const EXAMPLE_BANK_INFO = "BCA · a/n AKHMAD NASROJIKIN · No. 047 0571 390";

export default function ContohPdfPage() {
  const { activeCompany } = useCompany();

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="w-fit" asChild>
            <Link href="/buat-po">
              <ArrowLeft /> Kembali
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            Contoh Dokumen PDF
          </h1>
          <p className="text-sm text-muted-foreground">
            Contoh PO pengadaan cold storage dengan tabel bertingkat (Romawi),
            subtotal per-kelompok, PPN 11%, dan terbilang. Angka bersifat
            ilustrasi.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pengadaan &amp; Instalasi Cold Storage</CardTitle>
            <CardDescription>
              Subtotal Rp195.000.000 · PPN 11% Rp21.450.000 · Grand Total
              Rp216.450.000.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeCompany?.logoUrl ? null : <CompanyLogoUploadHint />}
            <PoPreviewActions filename="Contoh-PO-Cold-Storage.pdf">
              <CbsDocument
                docTitle="PURCHASE ORDER"
                docNumber="PO/KSP/2026/07/009"
                company={activeCompany}
                perihal="Pekerjaan Panel PU B2 (Anti-Bakar) + Mesin Pendingin Ruang 3x5m"
                partyLabel="Kepada Yth (Vendor)"
                partyName="PT CIPTA BAHARI SEJUK (CBS)"
                partyLines={["Telp 021 5239 2994 / 0858 6727 4424"]}
                dateLabel="Tanggal Pemesanan"
                date="2026-07-29"
                validity="2026-08-19"
                groups={EXAMPLE_GROUPS}
                subtotal={EXAMPLE_SUBTOTAL}
                extraRows={EXAMPLE_EXTRA_ROWS}
                grandTotal={EXAMPLE_GRAND_TOTAL}
                notes={EXAMPLE_NOTES}
                paymentTerms={EXAMPLE_PAYMENT_TERMS}
                bankInfo={EXAMPLE_BANK_INFO}
              />
            </PoPreviewActions>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
