"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { duplicateGoodsReceiptAction } from "@/app/actions/goods-receipts";

/**
 * Tombol "Duplikat" (Copy as New) untuk goods receipt: membuat GRN baru dari
 * GRN ini lalu membuka salinannya. Salinan berstatus Draft dengan nomor baru.
 */
export function DuplicateGoodsReceiptButton({ grnId }: { grnId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDuplicate() {
    setLoading(true);
    const result = await duplicateGoodsReceiptAction(grnId);
    setLoading(false);

    if (result.success) {
      toast.success("Goods receipt diduplikasi", {
        description: "Salinan baru berstatus Draft telah dibuat.",
      });
      router.push(`/riwayat/${result.goodsReceiptId}`);
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
