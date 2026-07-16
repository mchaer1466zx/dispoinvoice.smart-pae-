"use client";

import { useEffect, useId, useState } from "react";
import { Copy, Send, Share2 } from "lucide-react";
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
import type { PoDetail } from "@/components/po/po-detail-form";
import type { PoItem } from "@/components/po/po-item-list-form";
import type { Supplier } from "@/lib/mock-data";
import { buildPoPublicShareUrl } from "@/lib/po-share-link";

export function SharePoDialog({
  poDetail,
  supplier,
  items,
}: {
  poDetail: PoDetail;
  supplier: Supplier | null;
  items: PoItem[];
}) {
  const idPrefix = useId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.resolve(
      buildPoPublicShareUrl(window.location.origin, { poDetail, supplier, items })
    ).then((url) => {
      if (!cancelled) setShareLink(url);
    });

    return () => {
      cancelled = true;
    };
  }, [poDetail, supplier, items]);

  function handleSendEmail() {
    if (!email.trim()) return;
    toast.success("Purchase order terkirim", {
      description: `Tautan ${poDetail.poNumber} telah dikirim ke ${email}.`,
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
            Kirim {poDetail.poNumber} ke pemasok atau atasan lewat email, atau
            salin tautannya.
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
              aria-label="Kirim email"
            >
              <Send />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-share-link`}>Tautan Purchase Order</Label>
          <div className="flex gap-2">
            <Input id={`${idPrefix}-share-link`} readOnly value={shareLink} />
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
