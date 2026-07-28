"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { duplicatePurchaseOrderAction } from "@/app/actions/purchase-orders";

/**
 * Tombol "Duplikat" (Copy as New) untuk purchase order: membuat PO baru dari PO
 * ini lalu membuka salinannya. Salinan berstatus Draft dengan nomor urut baru.
 */
export function DuplicatePurchaseOrderButton({ poId }: { poId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDuplicate() {
    setLoading(true);
    const result = await duplicatePurchaseOrderAction(poId);
    setLoading(false);

    if (result.success) {
      toast.success("Purchase order diduplikasi", {
        description: "Salinan baru berstatus Draft telah dibuat.",
      });
      router.push(`/riwayat/${result.purchaseOrderId}`);
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
