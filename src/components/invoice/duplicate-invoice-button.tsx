"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { duplicateInvoiceAction } from "@/app/actions/invoices";

/**
 * Tombol "Duplikat" (Copy as New): membuat invoice baru dari invoice ini lalu
 * membuka salinannya. Salinan berstatus Draft dengan nomor urut baru.
 */
export function DuplicateInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDuplicate() {
    setLoading(true);
    const result = await duplicateInvoiceAction(invoiceId);
    setLoading(false);

    if (result.success) {
      toast.success("Invoice diduplikasi", {
        description: "Salinan baru berstatus Draft telah dibuat.",
      });
      router.push(`/riwayat-dokumen/${result.invoiceId}`);
    } else {
      toast.error("Gagal menduplikasi", { description: result.error });
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleDuplicate}
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : <Copy />} Duplikat
    </Button>
  );
}
