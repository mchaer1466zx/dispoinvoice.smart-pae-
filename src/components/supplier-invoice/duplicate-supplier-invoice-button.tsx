"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { duplicateSupplierInvoiceAction } from "@/app/actions/supplier-invoices";

/**
 * Tombol "Duplikat" (Copy as New) untuk tagihan pemasok: membuat tagihan baru
 * dari tagihan ini lalu membuka salinannya. Salinan berstatus Draft, nomor baru.
 */
export function DuplicateSupplierInvoiceButton({
  supplierInvoiceId,
}: {
  supplierInvoiceId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDuplicate() {
    setLoading(true);
    const result = await duplicateSupplierInvoiceAction(supplierInvoiceId);
    setLoading(false);

    if (result.success) {
      toast.success("Tagihan diduplikasi", {
        description: "Salinan baru berstatus Draft telah dibuat.",
      });
      router.push(`/riwayat/${result.supplierInvoiceId}`);
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
