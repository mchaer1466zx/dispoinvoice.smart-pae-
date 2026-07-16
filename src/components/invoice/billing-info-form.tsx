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

export const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "terkirim", label: "Terkirim" },
  { value: "lunas", label: "Lunas" },
] as const;

export type BillingInfo = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: (typeof STATUS_OPTIONS)[number]["value"];
  notes: string;
};

function generateInvoiceNumber() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  return `INV-${yyyy}${mm}-0001`;
}

export function createDefaultBillingInfo(): BillingInfo {
  const today = new Date().toISOString().slice(0, 10);
  return {
    invoiceNumber: generateInvoiceNumber(),
    issueDate: today,
    dueDate: today,
    status: "draft",
    notes: "",
  };
}

export function BillingInfoForm({
  value,
  onChange,
}: {
  value: BillingInfo;
  onChange: (value: BillingInfo) => void;
}) {
  const idPrefix = useId();

  function updateField<K extends keyof BillingInfo>(field: K, fieldValue: BillingInfo[K]) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Penagihan</CardTitle>
        <CardDescription>
          Nomor invoice, tanggal, status, dan catatan tambahan.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-invoice-number`}>Nomor Invoice</Label>
          <Input
            id={`${idPrefix}-invoice-number`}
            value={value.invoiceNumber}
            onChange={(e) => updateField("invoiceNumber", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-status`}>Status</Label>
          <select
            id={`${idPrefix}-status`}
            value={value.status}
            onChange={(e) =>
              updateField("status", e.target.value as BillingInfo["status"])
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-issue-date`}>Tanggal Terbit</Label>
          <Input
            id={`${idPrefix}-issue-date`}
            type="date"
            value={value.issueDate}
            onChange={(e) => updateField("issueDate", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-due-date`}>Tanggal Jatuh Tempo</Label>
          <Input
            id={`${idPrefix}-due-date`}
            type="date"
            value={value.dueDate}
            onChange={(e) => updateField("dueDate", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${idPrefix}-notes`}>Catatan</Label>
          <Textarea
            id={`${idPrefix}-notes`}
            placeholder="Catatan tambahan untuk invoice ini (opsional)"
            value={value.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
