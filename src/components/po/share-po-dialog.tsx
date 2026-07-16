"use client";

import { useEffect, useId, useState } from "react";
import { Copy, Loader2, Send, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getPoPublicLinkAction } from "@/app/actions/po-public";
import { sendPoEmailAction } from "@/app/actions/share-po";

export function SharePoDialog({
  poId,
  poNumber,
}: {
  poId: string;
  poNumber: string;
}) {
  const idPrefix = useId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    getPoPublicLinkAction(poId).then((result) => {
      if (cancelled) return;
      if (result.success) setShareLink(result.url);
    });

    return () => {
      cancelled = true;
    };
  }, [open, poId]);

  async function handleSendEmail() {
    if (!email.trim()) return;

    setIsSending(true);
    const result = await sendPoEmailAction({ poId, recipientEmail: email });
    setIsSending(false);

    if (!result.success) {
      toast.error("Gagal mengirim email", { description: result.error });
      return;
    }

    toast.success("Purchase order terkirim", {
      description: `${poNumber} telah dikirim ke ${email}.`,
    });
    setEmail("");
    setOpen(false);
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareLink);
    toast.success("Tautan disalin", {
      description: "Tautan purchase order telah disalin ke clipboard.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <Share2 /> Bagikan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bagikan Purchase Order</DialogTitle>
          <DialogDescription>
            Kirim {poNumber} ke pemasok atau atasan lewat email, atau salin
            tautannya.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-share-email`}>Email Penerima</Label>
          <div className="flex gap-2">
            <Input
              id={`${idPrefix}-share-email`}
              type="email"
              placeholder="pemasok@perusahaan.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="button"
              size="icon"
              onClick={handleSendEmail}
              disabled={isSending}
              aria-label="Kirim email"
            >
              {isSending ? <Loader2 className="animate-spin" /> : <Send />}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-share-link`}>Tautan Purchase Order</Label>
          <div className="flex gap-2">
            <Input
              id={`${idPrefix}-share-link`}
              readOnly
              value={shareLink}
              placeholder="Memuat tautan..."
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              aria-label="Salin tautan"
              disabled={!shareLink}
            >
              <Copy />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
