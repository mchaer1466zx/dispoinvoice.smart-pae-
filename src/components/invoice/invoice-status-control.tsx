"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  updateInvoiceStatusAction,
  type InvoiceStatus,
} from "@/app/actions/invoices";

const STATUSES: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "terkirim", label: "Terkirim" },
  { value: "lunas", label: "Lunas" },
];

/**
 * Kontrol ubah status invoice (draft/terkirim/lunas). Memanggil
 * updateInvoiceStatusAction — yang memicu notifikasi in-app bila status berubah.
 * Controlled: status aktif berasal dari prop `currentStatus`, dan perubahan yang
 * berhasil dilaporkan lewat `onChanged` agar sumber kebenaran tetap di halaman.
 */
export function InvoiceStatusControl({
  invoiceId,
  currentStatus,
  onChanged,
}: {
  invoiceId: string;
  currentStatus: string;
  onChanged: (status: InvoiceStatus) => void;
}) {
  const [pending, setPending] = useState<InvoiceStatus | null>(null);

  async function handleChange(next: InvoiceStatus) {
    if (next === currentStatus || pending) return;
    setPending(next);
    const result = await updateInvoiceStatusAction(invoiceId, next);
    setPending(null);

    if (result.success) {
      onChanged(next);
      toast.success("Status diperbarui", {
        description: `Invoice ditandai sebagai ${
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
