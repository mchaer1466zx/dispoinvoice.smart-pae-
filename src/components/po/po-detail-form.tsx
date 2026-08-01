"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PoStatus } from "@/app/actions/purchase-orders";
import { CompanyPicker } from "@/components/procurement/company-picker";
import { DEFAULT_COMPANY, type CompanyId } from "@/config/company-themes";

export const PO_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "dikirim", label: "Dikirim" },
  { value: "selesai", label: "Selesai" },
] as const;

const ROMAN = [
  "I", "II", "III", "IV", "V", "VI",
  "VII", "VIII", "IX", "X", "XI", "XII",
];

const DEFAULT_PAYMENT_TERMS = [
  "50% Uang Muka (DP) setelah PO disetujui",
  "40% Setelah material siap kirim / pekerjaan 80% selesai",
  "10% Pelunasan setelah pekerjaan selesai 100% & QC lulus",
].join("\n");

export type PoSigner = { name: string; jabatan: string };

export type PoDetail = {
  companyId: CompanyId;
  poNumber: string;
  numberCategory: string;
  orderDate: string;
  status: PoStatus;
  tax: number;
  discount: number;
  notes: string;
  /** Berita / isi surat (narasi bebas, muncul di dokumen). */
  berita: string;
  paymentTerms: string;
  /** Pembuat dokumen (Nama + Jabatan) — masuk ke isi barcode pengesahan. */
  signer: PoSigner;
  /** Komentar bebas yang ikut dimuat ke dalam barcode pengesahan. */
  komentar: string;
};

/** Kode jenis dokumen dalam nomor surat resmi (PO = 01). */
const DOC_TYPE_CODE = "01";

/** Ambil nomor urut dari sebuah nomor dokumen (digit awal, mis. "001-01/..."). */
export function extractSeq(poNumber: string): number {
  const lead = poNumber.match(/^\s*(\d+)/);
  if (lead) {
    const n = Number.parseInt(lead[1], 10);
    if (!Number.isNaN(n) && n >= 1) return n;
  }
  const m = poNumber.match(/(\d+)\s*$/);
  const n = m ? Number.parseInt(m[1], 10) : NaN;
  return Number.isNaN(n) || n < 1 ? 1 : n;
}

/**
 * Susun nomor PO sesuai standar surat resmi SANG PRABU:
 * <URUT>-<KODE JENIS>/PO/<KODE>[-<INISIAL MITRA>]/<BULAN ROMAWI>/<TAHUN>
 * contoh: 001-01/PO/KSP-BJP/VIII/2026
 */
export function buildPoNumber(
  companyId: CompanyId,
  mitraInitial: string,
  seq: number,
  date = new Date(),
): string {
  const mitra = mitraInitial.trim()
    ? `-${mitraInitial.trim().toUpperCase().replace(/\s+/g, "")}`
    : "";
  const roman = ROMAN[date.getMonth()] ?? String(date.getMonth() + 1);
  return `${String(seq).padStart(3, "0")}-${DOC_TYPE_CODE}/PO/${companyId}${mitra}/${roman}/${date.getFullYear()}`;
}

export function createDefaultPoDetail(): PoDetail {
  const today = new Date().toISOString().slice(0, 10);
  return {
    companyId: DEFAULT_COMPANY,
    poNumber: buildPoNumber(DEFAULT_COMPANY, "", 1),
    numberCategory: "",
    orderDate: today,
    status: "draft",
    tax: 0,
    discount: 0,
    notes: "",
    berita: "",
    paymentTerms: DEFAULT_PAYMENT_TERMS,
    signer: { name: "", jabatan: "" },
    komentar: "",
  };
}

export function PoDetailForm({
  value,
  onChange,
}: {
  value: PoDetail;
  onChange: (value: PoDetail) => void;
}) {
  const idPrefix = useId();

  function updateField<K extends keyof PoDetail>(field: K, fieldValue: PoDetail[K]) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Purchase Order</CardTitle>
        <CardDescription>
          Nomor PO, tanggal pemesanan, status, dan catatan tambahan.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <CompanyPicker
            value={value.companyId}
            onChange={(companyId) => updateField("companyId", companyId)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-po-number`}>Nomor PO *</Label>
          <Input
            id={`${idPrefix}-po-number`}
            value={value.poNumber}
            onChange={(e) => updateField("poNumber", e.target.value)}
            aria-invalid={!value.poNumber.trim() ? true : undefined}
          />
          {!value.poNumber.trim() ? (
            <p className="text-sm text-destructive">Nomor PO wajib diisi.</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Format: urut-01/PO/{value.companyId}[-INISIAL MITRA]/bulan-romawi/tahun
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-po-cat`}>Inisial Mitra (opsional)</Label>
          <Input
            id={`${idPrefix}-po-cat`}
            placeholder="mis. BJP"
            value={value.numberCategory}
            onChange={(e) => {
              const category = e.target.value;
              onChange({
                ...value,
                numberCategory: category,
                poNumber: buildPoNumber(
                  value.companyId,
                  category,
                  extractSeq(value.poNumber),
                ),
              });
            }}
          />
          <p className="text-xs text-muted-foreground">
            Disisipkan ke nomor → mis. 001-01/PO/{value.companyId}-BJP/…
          </p>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-status`}>Status</Label>
          <select
            id={`${idPrefix}-status`}
            value={value.status}
            onChange={(e) =>
              updateField("status", e.target.value as PoDetail["status"])
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {PO_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-order-date`}>Tanggal Pemesanan</Label>
          <Input
            id={`${idPrefix}-order-date`}
            type="date"
            value={value.orderDate}
            onChange={(e) => updateField("orderDate", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-tax`}>Pajak / PPN (%)</Label>
          <Input
            id={`${idPrefix}-tax`}
            type="number"
            min={0}
            step="0.1"
            value={value.tax}
            onChange={(e) => updateField("tax", Number(e.target.value) || 0)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-discount`}>Diskon (Rp)</Label>
          <Input
            id={`${idPrefix}-discount`}
            type="number"
            min={0}
            step="1"
            value={value.discount}
            onChange={(e) => updateField("discount", Number(e.target.value) || 0)}
          />
        </div>

        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${idPrefix}-notes`}>Catatan</Label>
          <Textarea
            id={`${idPrefix}-notes`}
            placeholder="Catatan tambahan untuk purchase order ini (opsional)"
            value={value.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${idPrefix}-pay`}>Cara Pembayaran</Label>
          <Textarea
            id={`${idPrefix}-pay`}
            placeholder="Satu poin per baris"
            value={value.paymentTerms}
            onChange={(e) => updateField("paymentTerms", e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Satu baris = satu poin; muncul sebagai daftar di dokumen.
          </p>
        </div>

        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${idPrefix}-berita`}>Berita / Isi Dokumen</Label>
          <Textarea
            id={`${idPrefix}-berita`}
            placeholder="Narasi/keterangan yang tampil di dokumen (mis. ruang lingkup pekerjaan, ketentuan pelaksanaan, dsb.)"
            value={value.berita}
            onChange={(e) => updateField("berita", e.target.value)}
            rows={6}
          />
          <p className="text-xs text-muted-foreground">
            Ditampilkan apa adanya (baris tetap dipertahankan). Kosongkan bila
            tidak perlu.
          </p>
        </div>

        <div className="grid gap-2.5 sm:col-span-2">
          <Label>Pembuat Dokumen</Label>
          <p className="-mt-1 text-xs text-muted-foreground">
            Menggantikan tanda tangan: nama &amp; jabatan pembuat ikut dimuat ke
            dalam barcode pengesahan pada dokumen.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Input
              placeholder="Nama pembuat"
              value={value.signer.name}
              onChange={(e) =>
                onChange({
                  ...value,
                  signer: { ...value.signer, name: e.target.value },
                })
              }
            />
            <Input
              placeholder="Jabatan"
              value={value.signer.jabatan}
              onChange={(e) =>
                onChange({
                  ...value,
                  signer: { ...value.signer, jabatan: e.target.value },
                })
              }
            />
          </div>
        </div>

        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${idPrefix}-komentar`}>Komentar (isi barcode)</Label>
          <Textarea
            id={`${idPrefix}-komentar`}
            placeholder="Komentar/keterangan yang akan tersimpan di dalam barcode pengesahan"
            value={value.komentar}
            onChange={(e) => updateField("komentar", e.target.value)}
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            Dimuat ke barcode bersama nama pembuat, waktu pembuatan, tujuan &amp;
            deskripsi dokumen, dan nama mitra.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
