"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  updateGoodsReceiptStatusAction,
  type GrnStatus,
} from "@/app/actions/goods-receipts";

const STATUSES: { value: GrnStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "diterima", label: "Diterima" },
  { value: "sebagian", label: "Diterima Sebagian" },
  { value: "ditolak", label: "Ditolak" },
];

/**
 * Kontrol ubah status goods receipt (draft/diterima/sebagian/ditolak).
 * Memanggil updateGoodsReceiptStatusAction yang memicu notifikasi bila berubah.
 */
export function GoodsReceiptStatusControl({
  grnId,
  currentStatus,
  onChanged,
}: {
  grnId: string;
  currentStatus: string;
  onChanged: (status: GrnStatus) => void;
}) {
  const [pending, setPending] = useState<GrnStatus | null>(null);

  async function handleChange(next: GrnStatus) {
    if (next === currentStatus || pending) return;
    setPending(next);
    const result = await updateGoodsReceiptStatusAction(grnId, next);
    setPending(null);

    if (result.success) {
      onChanged(next);
      toast.success("Status diperbarui", {
        description: `Goods receipt ditandai sebagai ${
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
