"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  updatePurchaseOrderStatusAction,
  type PoStatus,
} from "@/app/actions/purchase-orders";

const STATUSES: { value: PoStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "dikirim", label: "Dikirim" },
  { value: "selesai", label: "Selesai" },
];

/**
 * Kontrol ubah status purchase order (draft/dikirim/selesai). Memanggil
 * updatePurchaseOrderStatusAction — yang memicu notifikasi in-app bila status
 * berubah. Controlled: status aktif dari prop `currentStatus`, perubahan sukses
 * dilaporkan lewat `onChanged` agar sumber kebenaran tetap di halaman.
 */
export function PurchaseOrderStatusControl({
  poId,
  currentStatus,
  onChanged,
}: {
  poId: string;
  currentStatus: string;
  onChanged: (status: PoStatus) => void;
}) {
  const [pending, setPending] = useState<PoStatus | null>(null);

  async function handleChange(next: PoStatus) {
    if (next === currentStatus || pending) return;
    setPending(next);
    const result = await updatePurchaseOrderStatusAction(poId, next);
    setPending(null);

    if (result.success) {
      onChanged(next);
      toast.success("Status diperbarui", {
        description: `Purchase order ditandai sebagai ${
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
