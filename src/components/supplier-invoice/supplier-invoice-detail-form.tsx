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
import type { SupplierInvoiceStatus } from "@/app/actions/supplier-invoices";
import { CompanyPicker } from "@/components/procurement/company-picker";
import { DEFAULT_COMPANY, type CompanyId } from "@/config/company-themes";

export const SUPPLIER_INVOICE_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "belum_dibayar", label: "Belum Dibayar" },
  { value: "dibayar_sebagian", label: "Dibayar Sebagian" },
  { value: "lunas", label: "Lunas" },
] as const;

export type SupplierInvoiceDetail = {
  companyId: CompanyId;
  invoiceNumber: string;
  supplierRef: string;
  poReference: string;
  invoiceDate: string;
  dueDate: string;
  status: SupplierInvoiceStatus;
  tax: number;
  discount: number;
  notes: string;
};

function generateNumber() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `BILL/KSP/${yyyy}/${mm}/001`;
}

export function createDefaultSupplierInvoiceDetail(): SupplierInvoiceDetail {
  const today = new Date().toISOString().slice(0, 10);
  return {
    companyId: DEFAULT_COMPANY,
    invoiceNumber: generateNumber(),
    supplierRef: "",
    poReference: "",
    invoiceDate: today,
    dueDate: "",
    status: "draft",
    tax: 0,
    discount: 0,
    notes: "",
  };
}

export function SupplierInvoiceDetailForm({
  value,
  onChange,
}: {
  value: SupplierInvoiceDetail;
  onChange: (value: SupplierInvoiceDetail) => void;
}) {
  const idPrefix = useId();

  function updateField<K extends keyof SupplierInvoiceDetail>(
    field: K,
    fieldValue: SupplierInvoiceDetail[K]
  ) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Tagihan Pemasok</CardTitle>
        <CardDescription>
          Nomor tagihan, referensi invoice pemasok & PO, jatuh tempo, pajak/diskon.
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
          <Label htmlFor={`${idPrefix}-number`}>Nomor Tagihan (internal) *</Label>
          <Input
            id={`${idPrefix}-number`}
            value={value.invoiceNumber}
            onChange={(e) => updateField("invoiceNumber", e.target.value)}
            aria-invalid={!value.invoiceNumber.trim() ? true : undefined}
          />
          {!value.invoiceNumber.trim() ? (
            <p className="text-sm text-destructive">Nomor tagihan wajib diisi.</p>
          ) : null}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-status`}>Status Pembayaran</Label>
          <select
            id={`${idPrefix}-status`}
            value={value.status}
            onChange={(e) =>
              updateField("status", e.target.value as SupplierInvoiceDetail["status"])
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {SUPPLIER_INVOICE_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-supplier-ref`}>
            No. Invoice Pemasok (opsional)
          </Label>
          <Input
            id={`${idPrefix}-supplier-ref`}
            placeholder="Nomor asli dari pemasok"
            value={value.supplierRef}
            onChange={(e) => updateField("supplierRef", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-po-ref`}>No. PO Acuan (opsional)</Label>
          <Input
            id={`${idPrefix}-po-ref`}
            placeholder="Misal: PO/KSP/2026/07/009"
            value={value.poReference}
            onChange={(e) => updateField("poReference", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-invoice-date`}>Tanggal Tagihan</Label>
          <Input
            id={`${idPrefix}-invoice-date`}
            type="date"
            value={value.invoiceDate}
            onChange={(e) => updateField("invoiceDate", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-due-date`}>Jatuh Tempo (opsional)</Label>
          <Input
            id={`${idPrefix}-due-date`}
            type="date"
            value={value.dueDate}
            onChange={(e) => updateField("dueDate", e.target.value)}
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
            placeholder="Keterangan pembayaran atau catatan lain (opsional)"
            value={value.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
