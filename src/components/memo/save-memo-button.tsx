"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { MemoDetail } from "@/components/memo/memo-detail-form";

/** Simpan memo masih memakai penyimpanan tiruan (belum tersambung ke database). */
export function SaveMemoButton({ memoDetail }: { memoDetail: MemoDetail }) {
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!memoDetail.recipientName.trim()) {
      toast.error("Gagal menyimpan memo", {
        description: "Penerima wajib diisi.",
      });
      return;
    }

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSaving(false);

    toast.success("Memo berhasil disimpan", {
      description: `Memo untuk ${memoDetail.recipientName} telah disimpan ke riwayat dokumen.`,
    });
  }

  return (
    <Button type="button" onClick={handleSave} disabled={saving}>
      {saving ? <Loader2 className="animate-spin" /> : <Save />}
      Simpan Memo
    </Button>
  );
}
