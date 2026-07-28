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
import type { PrStatus } from "@/app/actions/purchase-requests";

// Status yang boleh dipilih saat membuat PR (approval terjadi kemudian).
export const PR_CREATE_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "menunggu_approval", label: "Menunggu Approval" },
] as const;

export type PrDetail = {
  prNumber: string;
  department: string;
  needDate: string;
  status: PrStatus;
  notes: string;
};

function generatePrNumber() {
  const yyyy = new Date().getFullYear();
  return `PR/${yyyy}/001`;
}

export function createDefaultPrDetail(): PrDetail {
  const today = new Date().toISOString().slice(0, 10);
  return {
    prNumber: generatePrNumber(),
    department: "",
    needDate: today,
    status: "draft",
    notes: "",
  };
}

export function PrDetailForm({
  value,
  onChange,
}: {
  value: PrDetail;
  onChange: (value: PrDetail) => void;
}) {
  const idPrefix = useId();

  function updateField<K extends keyof PrDetail>(field: K, fieldValue: PrDetail[K]) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Purchase Request</CardTitle>
        <CardDescription>
          Nomor PR, departemen peminta, tanggal kebutuhan, status, dan catatan.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-pr-number`}>Nomor PR *</Label>
          <Input
            id={`${idPrefix}-pr-number`}
            value={value.prNumber}
            onChange={(e) => updateField("prNumber", e.target.value)}
            aria-invalid={!value.prNumber.trim() ? true : undefined}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-status`}>Status</Label>
          <select
            id={`${idPrefix}-status`}
            value={value.status}
            onChange={(e) =>
              updateField("status", e.target.value as PrDetail["status"])
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {PR_CREATE_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-department`}>Departemen Peminta</Label>
          <Input
            id={`${idPrefix}-department`}
            placeholder="Misal: Operasional / IT / HRD"
            value={value.department}
            onChange={(e) => updateField("department", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-need-date`}>Tanggal Kebutuhan</Label>
          <Input
            id={`${idPrefix}-need-date`}
            type="date"
            value={value.needDate}
            onChange={(e) => updateField("needDate", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${idPrefix}-notes`}>Catatan</Label>
          <Textarea
            id={`${idPrefix}-notes`}
            placeholder="Justifikasi/keterangan permintaan (opsional)"
            value={value.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
