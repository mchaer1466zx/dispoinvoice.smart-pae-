"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateRfqStatusAction, type RfqStatus } from "@/app/actions/rfqs";

const STATUSES: { value: RfqStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "terkirim", label: "Terkirim" },
  { value: "dijawab", label: "Dijawab" },
  { value: "ditutup", label: "Ditutup" },
];

/**
 * Kontrol ubah status RFQ (draft/terkirim/dijawab/ditutup). Memanggil
 * updateRfqStatusAction yang memicu notifikasi bila status berubah.
 */
export function RfqStatusControl({
  rfqId,
  currentStatus,
  onChanged,
}: {
  rfqId: string;
  currentStatus: string;
  onChanged: (status: RfqStatus) => void;
}) {
  const [pending, setPending] = useState<RfqStatus | null>(null);

  async function handleChange(next: RfqStatus) {
    if (next === currentStatus || pending) return;
    setPending(next);
    const result = await updateRfqStatusAction(rfqId, next);
    setPending(null);

    if (result.success) {
      onChanged(next);
      toast.success("Status diperbarui", {
        description: `RFQ ditandai sebagai ${
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
