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
import type { RfqStatus } from "@/app/actions/rfqs";
import { CompanyPicker } from "@/components/procurement/company-picker";
import { DEFAULT_COMPANY, type CompanyId } from "@/config/company-themes";

export const RFQ_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "terkirim", label: "Terkirim" },
  { value: "dijawab", label: "Dijawab" },
  { value: "ditutup", label: "Ditutup" },
] as const;

export type RfqDetail = {
  companyId: CompanyId;
  rfqNumber: string;
  requestDate: string;
  status: RfqStatus;
  deadline: string;
  notes: string;
};

function generateRfqNumber() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `RFQ/KSP/${yyyy}/${mm}/001`;
}

export function createDefaultRfqDetail(): RfqDetail {
  const today = new Date().toISOString().slice(0, 10);
  return {
    companyId: DEFAULT_COMPANY,
    rfqNumber: generateRfqNumber(),
    requestDate: today,
    status: "draft",
    deadline: "",
    notes: "",
  };
}

export function RfqDetailForm({
  value,
  onChange,
}: {
  value: RfqDetail;
  onChange: (value: RfqDetail) => void;
}) {
  const idPrefix = useId();

  function updateField<K extends keyof RfqDetail>(field: K, fieldValue: RfqDetail[K]) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail RFQ (Permintaan Penawaran)</CardTitle>
        <CardDescription>
          Nomor RFQ, tanggal permintaan, batas penawaran, status, dan catatan.
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
          <Label htmlFor={`${idPrefix}-rfq-number`}>Nomor RFQ *</Label>
          <Input
            id={`${idPrefix}-rfq-number`}
            value={value.rfqNumber}
            onChange={(e) => updateField("rfqNumber", e.target.value)}
            aria-invalid={!value.rfqNumber.trim() ? true : undefined}
          />
          {!value.rfqNumber.trim() ? (
            <p className="text-sm text-destructive">Nomor RFQ wajib diisi.</p>
          ) : null}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-status`}>Status</Label>
          <select
            id={`${idPrefix}-status`}
            value={value.status}
            onChange={(e) =>
              updateField("status", e.target.value as RfqDetail["status"])
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {RFQ_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-request-date`}>Tanggal Permintaan</Label>
          <Input
            id={`${idPrefix}-request-date`}
            type="date"
            value={value.requestDate}
            onChange={(e) => updateField("requestDate", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-deadline`}>Batas Penawaran (opsional)</Label>
          <Input
            id={`${idPrefix}-deadline`}
            type="date"
            value={value.deadline}
            onChange={(e) => updateField("deadline", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${idPrefix}-notes`}>Catatan</Label>
          <Textarea
            id={`${idPrefix}-notes`}
            placeholder="Syarat pengiriman, kualitas, atau keterangan lain (opsional)"
            value={value.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
