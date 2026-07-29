"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * Tombol "Bagikan" memo tersimpan: menyalin tautan publik
 * {origin}/memo/publik/{id} yang bisa dibuka tanpa login. Basis domain
 * mengikuti alamat aplikasi yang sedang berjalan.
 */
export function ShareMemoLinkButton({ memoId }: { memoId: string }) {
  const [origin] = useState(() =>
    typeof window !== "undefined" ? window.location.origin : ""
  );

  async function handleShare() {
    const link = `${origin}/memo/publik/${memoId}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Tautan disalin", {
        description: "Tautan memo publik telah disalin ke clipboard.",
      });
    } catch {
      toast.error("Gagal menyalin tautan", { description: link });
    }
  }

  return (
    <Button type="button" variant="outline" onClick={handleShare}>
      <Share2 /> Bagikan
    </Button>
  );
}
