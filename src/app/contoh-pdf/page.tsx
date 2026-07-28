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
 * Contoh dokumen PO "Pengadaan & Instalasi Cold Storage" dengan angka tetap
 * yang cocok persis: Subtotal Rp195.000.000, PPN 11% Rp21.450.000, Grand
 * Total Rp216.450.000 (Dua Ratus Enam Belas Juta Empat Ratus Lima Puluh Ribu
 * Rupiah). Dipakai sebagai referensi tampilan tabel bertingkat (Romawi).
 */
const EXAMPLE_GROUPS: CbsGroup[] = [
  {
    label: "Persiapan Pekerjaan",
    subtotal: 5_000_000,
    items: [
      {
        description: "Mobilisasi & demobilisasi alat kerja",
        qty: 1,
        unit: "ls",
        unitPrice: 3_000_000,
        amount: 3_000_000,
      },
      {
        description: "Pembersihan & persiapan lokasi ruang",
        qty: 1,
        unit: "ls",
        unitPrice: 2_000_000,
        amount: 2_000_000,
      },
    ],
  },
  {
    label: "Pekerjaan Ruangan Cold Storage",
    subtotal: 87_310_000,
    items: [
      {
        description: "Panel insulasi PU ketebalan 100 mm",
        spec: "sandwich panel, food grade",
        qty: 120,
        unit: "m²",
        unitPrice: 450_000,
        amount: 54_000_000,
      },
      {
        description: "Pintu cold storage sliding berinsulasi",
        spec: "lengkap frame & heater",
        qty: 2,
        unit: "unit",
        unitPrice: 12_500_000,
        amount: 25_000_000,
      },
      {
        description: "Lantai epoxy anti-slip",
        qty: 60,
        unit: "m²",
        unitPrice: 138_500,
        amount: 8_310_000,
      },
    ],
  },
  {
    label: "Pekerjaan Mesin Refrigerasi",
    subtotal: 102_690_000,
    items: [
      {
        description: "Condensing unit suhu -20°C",
        spec: "kompresor semi-hermetic",
        qty: 1,
        unit: "unit",
        unitPrice: 68_000_000,
        amount: 68_000_000,
      },
      {
        description: "Evaporator ceiling type",
        qty: 2,
        unit: "unit",
        unitPrice: 13_345_000,
        amount: 26_690_000,
      },
      {
        description: "Instalasi pipa, refrigeran & panel kontrol",
        qty: 1,
        unit: "ls",
        unitPrice: 8_000_000,
        amount: 8_000_000,
      },
    ],
  },
];

const EXAMPLE_SUBTOTAL = 195_000_000;
const EXAMPLE_EXTRA_ROWS: CbsTotalRow[] = [
  { label: "PPN (11%)", value: 21_450_000 },
];
const EXAMPLE_GRAND_TOTAL = 216_450_000;

const EXAMPLE_PAYMENT_TERMS = [
  "50% Uang Muka (DP) setelah PO disetujui",
  "40% Setelah material siap kirim / pekerjaan 80% selesai",
  "10% Pelunasan setelah pekerjaan selesai 100% & QC lulus",
];

export default function ContohPdfPage() {
  const { activeCompany } = useCompany();

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="w-fit" asChild>
            <Link href="/purchase-order">
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
                docNumber="PO/KSP/2026/07/001"
                company={activeCompany}
                perihal="Pengadaan & Instalasi Cold Storage"
                partyLabel="Kepada Pemasok"
                partyName="CV Sumber Dingin Sejahtera"
                partyLines={[
                  "Jl. Industri Raya No. 12, Bekasi",
                  "0812-3456-7890",
                ]}
                dateLabel="Tanggal Pemesanan"
                date="2026-07-28"
                groups={EXAMPLE_GROUPS}
                subtotal={EXAMPLE_SUBTOTAL}
                extraRows={EXAMPLE_EXTRA_ROWS}
                grandTotal={EXAMPLE_GRAND_TOTAL}
                notes="Garansi mesin 1 tahun. Termasuk uji coba & training operator."
                paymentTerms={EXAMPLE_PAYMENT_TERMS}
              />
            </PoPreviewActions>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
