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

export const PO_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "dikirim", label: "Dikirim" },
  { value: "selesai", label: "Selesai" },
] as const;

export type PoDetail = {
  poNumber: string;
  orderDate: string;
  status: (typeof PO_STATUS_OPTIONS)[number]["value"];
  notes: string;
};

function generatePoNumber() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  return `PO-${yyyy}${mm}-0001`;
}

export function createDefaultPoDetail(): PoDetail {
  const today = new Date().toISOString().slice(0, 10);
  return {
    poNumber: generatePoNumber(),
    orderDate: today,
    status: "draft",
    notes: "",
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
          ) : null}
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
      </CardContent>
    </Card>
  );
}
