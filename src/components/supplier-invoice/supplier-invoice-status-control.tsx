"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  updateSupplierInvoiceStatusAction,
  type SupplierInvoiceStatus,
} from "@/app/actions/supplier-invoices";

const STATUSES: { value: SupplierInvoiceStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "belum_dibayar", label: "Belum Dibayar" },
  { value: "dibayar_sebagian", label: "Dibayar Sebagian" },
  { value: "lunas", label: "Lunas" },
];

/**
 * Kontrol ubah status pembayaran tagihan pemasok. Memanggil
 * updateSupplierInvoiceStatusAction yang memicu notifikasi bila status berubah.
 */
export function SupplierInvoiceStatusControl({
  supplierInvoiceId,
  currentStatus,
  onChanged,
}: {
  supplierInvoiceId: string;
  currentStatus: string;
  onChanged: (status: SupplierInvoiceStatus) => void;
}) {
  const [pending, setPending] = useState<SupplierInvoiceStatus | null>(null);

  async function handleChange(next: SupplierInvoiceStatus) {
    if (next === currentStatus || pending) return;
    setPending(next);
    const result = await updateSupplierInvoiceStatusAction(supplierInvoiceId, next);
    setPending(null);

    if (result.success) {
      onChanged(next);
      toast.success("Status diperbarui", {
        description: `Tagihan ditandai sebagai ${
          STATUSES.find((s) => s.value === next)?.label
        }.`,
      });
    } else {
      toast.error("Gagal memperbarui status", { description: result.error });
    }
  }

  return (
    <div className="flex flex-col gap-1.5 print:hidden">
      <p className="text-sm text-muted-foreground">Ubah Status Pembayaran</p>
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
