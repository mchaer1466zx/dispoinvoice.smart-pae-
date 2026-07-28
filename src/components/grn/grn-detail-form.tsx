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
import type { GrnStatus } from "@/app/actions/goods-receipts";
import { CompanyPicker } from "@/components/procurement/company-picker";
import { DEFAULT_COMPANY, type CompanyId } from "@/config/company-themes";

export const GRN_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "diterima", label: "Diterima" },
  { value: "sebagian", label: "Diterima Sebagian" },
  { value: "ditolak", label: "Ditolak" },
] as const;

export type GrnDetail = {
  companyId: CompanyId;
  grnNumber: string;
  receiptDate: string;
  status: GrnStatus;
  poReference: string;
  notes: string;
};

function generateGrnNumber() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `GRN/KSP/${yyyy}/${mm}/001`;
}

export function createDefaultGrnDetail(): GrnDetail {
  const today = new Date().toISOString().slice(0, 10);
  return {
    companyId: DEFAULT_COMPANY,
    grnNumber: generateGrnNumber(),
    receiptDate: today,
    status: "draft",
    poReference: "",
    notes: "",
  };
}

export function GrnDetailForm({
  value,
  onChange,
}: {
  value: GrnDetail;
  onChange: (value: GrnDetail) => void;
}) {
  const idPrefix = useId();

  function updateField<K extends keyof GrnDetail>(field: K, fieldValue: GrnDetail[K]) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Goods Receipt (Bukti Penerimaan Barang)</CardTitle>
        <CardDescription>
          Nomor GRN, tanggal terima, nomor PO acuan, status, dan catatan.
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
          <Label htmlFor={`${idPrefix}-grn-number`}>Nomor GRN *</Label>
          <Input
            id={`${idPrefix}-grn-number`}
            value={value.grnNumber}
            onChange={(e) => updateField("grnNumber", e.target.value)}
            aria-invalid={!value.grnNumber.trim() ? true : undefined}
          />
          {!value.grnNumber.trim() ? (
            <p className="text-sm text-destructive">Nomor GRN wajib diisi.</p>
          ) : null}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-status`}>Status</Label>
          <select
            id={`${idPrefix}-status`}
            value={value.status}
            onChange={(e) =>
              updateField("status", e.target.value as GrnDetail["status"])
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {GRN_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-receipt-date`}>Tanggal Terima</Label>
          <Input
            id={`${idPrefix}-receipt-date`}
            type="date"
            value={value.receiptDate}
            onChange={(e) => updateField("receiptDate", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-po-ref`}>Nomor PO Acuan (opsional)</Label>
          <Input
            id={`${idPrefix}-po-ref`}
            placeholder="Misal: PO/KSP/2026/07/009"
            value={value.poReference}
            onChange={(e) => updateField("poReference", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${idPrefix}-notes`}>Catatan</Label>
          <Textarea
            id={`${idPrefix}-notes`}
            placeholder="Kondisi barang, kekurangan, atau keterangan lain (opsional)"
            value={value.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
