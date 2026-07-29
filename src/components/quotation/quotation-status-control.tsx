"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  updateQuotationStatusAction,
  type QuotationStatus,
} from "@/app/actions/quotations";

const STATUSES: { value: QuotationStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "terkirim", label: "Terkirim" },
  { value: "diterima", label: "Diterima" },
  { value: "ditolak", label: "Ditolak" },
];

/**
 * Kontrol ubah status quotation (draft/terkirim/diterima/ditolak). Memanggil
 * updateQuotationStatusAction yang memicu notifikasi bila status berubah.
 */
export function QuotationStatusControl({
  quotationId,
  currentStatus,
  onChanged,
}: {
  quotationId: string;
  currentStatus: string;
  onChanged: (status: QuotationStatus) => void;
}) {
  const [pending, setPending] = useState<QuotationStatus | null>(null);

  async function handleChange(next: QuotationStatus) {
    if (next === currentStatus || pending) return;
    setPending(next);
    const result = await updateQuotationStatusAction(quotationId, next);
    setPending(null);

    if (result.success) {
      onChanged(next);
      toast.success("Status diperbarui", {
        description: `Penawaran ditandai sebagai ${
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
