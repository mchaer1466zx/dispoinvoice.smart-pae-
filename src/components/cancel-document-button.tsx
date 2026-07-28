"use client";

import { useId, useState } from "react";
import { Ban, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cancelDocumentAction, type DocKind } from "@/app/actions/audit";

/**
 * Tombol "Batalkan" dokumen dengan alasan WAJIB (pengganti hapus). Dokumen tidak
 * dihapus, hanya di-set status "dibatalkan" dan tercatat di jejak audit.
 */
export function CancelDocumentButton({
  kind,
  id,
  onCancelled,
}: {
  kind: DocKind;
  id: string;
  onCancelled: () => void;
}) {
  const reasonId = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    if (!reason.trim()) return;
    setLoading(true);
    const result = await cancelDocumentAction(kind, id, reason.trim());
    setLoading(false);

    if (result.success) {
      toast.success("Dokumen dibatalkan", {
        description: "Status diubah menjadi Dibatalkan dan tercatat di jejak audit.",
      });
      setOpen(false);
      setReason("");
      onCancelled();
    } else {
      toast.error("Gagal membatalkan", { description: result.error });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="text-destructive hover:text-destructive"
        >
          <Ban /> Batalkan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Batalkan dokumen</DialogTitle>
          <DialogDescription>
            Dokumen tidak dihapus, hanya ditandai Dibatalkan. Alasan wajib diisi
            dan akan tercatat di jejak audit.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-1.5">
          <Label htmlFor={reasonId}>Alasan pembatalan *</Label>
          <Textarea
            id={reasonId}
            placeholder="Contoh: dibuat ganda / salah pelanggan / dibatalkan oleh atasan"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Kembali
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleCancel}
            disabled={loading || !reason.trim()}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Ban />} Batalkan
            dokumen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
