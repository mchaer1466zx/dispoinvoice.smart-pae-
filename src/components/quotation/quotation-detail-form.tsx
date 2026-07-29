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
import type { QuotationStatus } from "@/app/actions/quotations";
import { CompanyPicker } from "@/components/procurement/company-picker";
import { DEFAULT_COMPANY, type CompanyId } from "@/config/company-themes";

export const QUOTATION_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "terkirim", label: "Terkirim" },
  { value: "diterima", label: "Diterima" },
  { value: "ditolak", label: "Ditolak" },
] as const;

export type QuotationDetail = {
  companyId: CompanyId;
  quotationNumber: string;
  quotationDate: string;
  status: QuotationStatus;
  validUntil: string;
  tax: number;
  discount: number;
  notes: string;
};

function generateQuotationNumber() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `QUO/KSP/${yyyy}/${mm}/001`;
}

export function createDefaultQuotationDetail(): QuotationDetail {
  const today = new Date().toISOString().slice(0, 10);
  return {
    companyId: DEFAULT_COMPANY,
    quotationNumber: generateQuotationNumber(),
    quotationDate: today,
    status: "draft",
    validUntil: "",
    tax: 0,
    discount: 0,
    notes: "",
  };
}

export function QuotationDetailForm({
  value,
  onChange,
}: {
  value: QuotationDetail;
  onChange: (value: QuotationDetail) => void;
}) {
  const idPrefix = useId();

  function updateField<K extends keyof QuotationDetail>(
    field: K,
    fieldValue: QuotationDetail[K]
  ) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Penawaran (Quotation)</CardTitle>
        <CardDescription>
          Nomor penawaran, tanggal, masa berlaku, pajak/diskon, dan catatan.
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
          <Label htmlFor={`${idPrefix}-quo-number`}>Nomor Penawaran *</Label>
          <Input
            id={`${idPrefix}-quo-number`}
            value={value.quotationNumber}
            onChange={(e) => updateField("quotationNumber", e.target.value)}
            aria-invalid={!value.quotationNumber.trim() ? true : undefined}
          />
          {!value.quotationNumber.trim() ? (
            <p className="text-sm text-destructive">Nomor penawaran wajib diisi.</p>
          ) : null}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-status`}>Status</Label>
          <select
            id={`${idPrefix}-status`}
            value={value.status}
            onChange={(e) =>
              updateField("status", e.target.value as QuotationDetail["status"])
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {QUOTATION_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-quo-date`}>Tanggal Penawaran</Label>
          <Input
            id={`${idPrefix}-quo-date`}
            type="date"
            value={value.quotationDate}
            onChange={(e) => updateField("quotationDate", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-valid-until`}>Berlaku Sampai (opsional)</Label>
          <Input
            id={`${idPrefix}-valid-until`}
            type="date"
            value={value.validUntil}
            onChange={(e) => updateField("validUntil", e.target.value)}
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
            placeholder="Syarat & ketentuan penawaran (opsional)"
            value={value.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
