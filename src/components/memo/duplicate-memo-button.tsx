"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { duplicateMemoAction } from "@/app/actions/memos";

/**
 * Tombol "Duplikat" (Copy as New) untuk memo disposisi: membuat memo baru dari
 * memo ini lalu membuka salinannya. Salinan berstatus awal Terkirim.
 */
export function DuplicateMemoButton({ memoId }: { memoId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDuplicate() {
    setLoading(true);
    const result = await duplicateMemoAction(memoId);
    setLoading(false);

    if (result.success) {
      toast.success("Memo diduplikasi", {
        description: "Salinan baru telah dibuat.",
      });
      router.push(`/riwayat-dokumen/${result.memoId}`);
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
