"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  updatePurchaseRequestStatusAction,
  type PrStatus,
} from "@/app/actions/purchase-requests";

const STATUSES: { value: PrStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "menunggu_approval", label: "Menunggu Approval" },
  { value: "disetujui", label: "Disetujui" },
  { value: "ditolak", label: "Ditolak" },
];

/**
 * Kontrol status Purchase Request (termasuk approval: disetujui/ditolak).
 * Memanggil updatePurchaseRequestStatusAction yang mencatat approve/reject di
 * jejak audit + memicu notifikasi. Controlled via prop `currentStatus`.
 */
export function PurchaseRequestStatusControl({
  prId,
  currentStatus,
  onChanged,
}: {
  prId: string;
  currentStatus: string;
  onChanged: (status: PrStatus) => void;
}) {
  const [pending, setPending] = useState<PrStatus | null>(null);

  async function handleChange(next: PrStatus) {
    if (next === currentStatus || pending) return;
    setPending(next);
    const result = await updatePurchaseRequestStatusAction(prId, next);
    setPending(null);

    if (result.success) {
      onChanged(next);
      toast.success("Status diperbarui", {
        description: `Purchase request ditandai sebagai ${
          STATUSES.find((s) => s.value === next)?.label
        }.`,
      });
    } else {
      toast.error("Gagal memperbarui status", { description: result.error });
    }
  }

  return (
    <div className="flex flex-col gap-1.5 print:hidden">
      <p className="text-sm text-muted-foreground">Ubah Status / Approval</p>
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
