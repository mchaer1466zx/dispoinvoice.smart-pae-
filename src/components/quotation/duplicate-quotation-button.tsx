"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { duplicateQuotationAction } from "@/app/actions/quotations";

/**
 * Tombol "Duplikat" (Copy as New) untuk quotation: membuat penawaran baru dari
 * penawaran ini lalu membuka salinannya. Salinan berstatus Draft, nomor baru.
 */
export function DuplicateQuotationButton({ quotationId }: { quotationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDuplicate() {
    setLoading(true);
    const result = await duplicateQuotationAction(quotationId);
    setLoading(false);

    if (result.success) {
      toast.success("Penawaran diduplikasi", {
        description: "Salinan baru berstatus Draft telah dibuat.",
      });
      router.push(`/riwayat/${result.quotationId}`);
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
