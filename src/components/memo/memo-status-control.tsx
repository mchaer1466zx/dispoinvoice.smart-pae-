"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  updateMemoStatusAction,
  type MemoStatus,
} from "@/app/actions/memos";

const STATUSES: { value: MemoStatus; label: string }[] = [
  { value: "terkirim", label: "Terkirim" },
  { value: "dibaca", label: "Dibaca" },
  { value: "selesai", label: "Selesai" },
];

/**
 * Kontrol ubah status memo disposisi (terkirim/dibaca/selesai). Memanggil
 * updateMemoStatusAction — yang memicu notifikasi in-app bila status berubah.
 * Controlled: status aktif dari prop `currentStatus`, perubahan sukses
 * dilaporkan lewat `onChanged` agar sumber kebenaran tetap di halaman.
 */
export function MemoStatusControl({
  memoId,
  currentStatus,
  onChanged,
}: {
  memoId: string;
  currentStatus: string;
  onChanged: (status: MemoStatus) => void;
}) {
  const [pending, setPending] = useState<MemoStatus | null>(null);

  async function handleChange(next: MemoStatus) {
    if (next === currentStatus || pending) return;
    setPending(next);
    const result = await updateMemoStatusAction(memoId, next);
    setPending(null);

    if (result.success) {
      onChanged(next);
      toast.success("Status diperbarui", {
        description: `Memo ditandai sebagai ${
          STATUSES.find((s) => s.value === next)?.label
        }.`,
      });
    } else {
      toast.error("Gagal memperbarui status", { description: result.error });
    }
  }

  return (
    <div className="flex flex-col gap-1.5 print:hidden">
      <p className="text-sm text-muted-foreground">Ubah Status</p>
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Button
            key={s.value}
            type="button"
            size="sm"
            variant={s.value === currentStatus ? "default" : "outline"}
            disabled={pending !== null}
            onClick={() => handleChange(s.value)}
          >
            {pending === s.value ? <Loader2 className="animate-spin" /> : null}
            {s.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
