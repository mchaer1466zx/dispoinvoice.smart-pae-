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

export type MemoDetail = {
  recipientName: string;
  subject: string;
  instructions: string;
  content: string;
  memoDate: string;
};

export function createDefaultMemoDetail(): MemoDetail {
  const today = new Date().toISOString().slice(0, 10);
  return {
    recipientName: "",
    subject: "",
    instructions: "",
    content: "",
    memoDate: today,
  };
}

export function MemoDetailForm({
  value,
  onChange,
}: {
  value: MemoDetail;
  onChange: (value: MemoDetail) => void;
}) {
  const idPrefix = useId();

  function updateField<K extends keyof MemoDetail>(field: K, fieldValue: MemoDetail[K]) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Memo Disposisi</CardTitle>
        <CardDescription>
          Penerima, perihal, isi memo, dan instruksi yang diperlukan.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-recipient`}>Penerima *</Label>
          <Input
            id={`${idPrefix}-recipient`}
            placeholder="Nama atasan atau departemen tujuan"
            value={value.recipientName}
            onChange={(e) => updateField("recipientName", e.target.value)}
            aria-invalid={!value.recipientName.trim() ? true : undefined}
          />
          {!value.recipientName.trim() ? (
            <p className="text-sm text-destructive">Penerima wajib diisi.</p>
          ) : null}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-memo-date`}>Tanggal Memo</Label>
          <Input
            id={`${idPrefix}-memo-date`}
            type="date"
            value={value.memoDate}
            onChange={(e) => updateField("memoDate", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${idPrefix}-subject`}>Perihal / Tujuan Disposisi</Label>
          <Input
            id={`${idPrefix}-subject`}
            placeholder="Ringkasan tujuan memo ini"
            value={value.subject}
            onChange={(e) => updateField("subject", e.target.value)}
          />
        </div>

        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${idPrefix}-content`}>Isi Memo</Label>
          <Textarea
            id={`${idPrefix}-content`}
            placeholder="Tuliskan isi memo disposisi di sini"
            value={value.content}
            onChange={(e) => updateField("content", e.target.value)}
            rows={4}
          />
        </div>

        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${idPrefix}-instructions`}>Instruksi</Label>
          <Textarea
            id={`${idPrefix}-instructions`}
            placeholder="Instruksi yang perlu ditindaklanjuti (opsional)"
            value={value.instructions}
            onChange={(e) => updateField("instructions", e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
