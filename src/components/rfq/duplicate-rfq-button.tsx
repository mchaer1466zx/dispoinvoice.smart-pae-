"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { duplicateRfqAction } from "@/app/actions/rfqs";

/**
 * Tombol "Duplikat" (Copy as New) untuk RFQ: membuat RFQ baru dari RFQ ini
 * lalu membuka salinannya. Salinan berstatus Draft dengan nomor baru.
 */
export function DuplicateRfqButton({ rfqId }: { rfqId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDuplicate() {
    setLoading(true);
    const result = await duplicateRfqAction(rfqId);
    setLoading(false);

    if (result.success) {
      toast.success("RFQ diduplikasi", {
        description: "Salinan baru berstatus Draft telah dibuat.",
      });
      router.push(`/riwayat/${result.rfqId}`);
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
