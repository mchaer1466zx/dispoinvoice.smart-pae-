"use client";

import { useId, useState } from "react";
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

export function ShareInvoiceDialog({ invoiceNumber }: { invoiceNumber: string }) {
  const idPrefix = useId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const shareLink = `https://dispoinvoice.example.com/invoices/${invoiceNumber}`;

  function handleSendEmail() {
    if (!email.trim()) return;
    toast.success("Invoice terkirim", {
      description: `Tautan invoice telah dikirim ke ${email}.`,
    });
    setEmail("");
    setOpen(false);
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareLink);
    toast.success("Tautan disalin", {
      description: "Tautan invoice telah disalin ke clipboard.",
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
          <DialogTitle>Bagikan Invoice</DialogTitle>
          <DialogDescription>
            Kirim {invoiceNumber} ke atasan lewat email, atau salin tautannya.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-share-email`}>Email Penerima</Label>
          <div className="flex gap-2">
            <Input
              id={`${idPrefix}-share-email`}
              type="email"
              placeholder="atasan@perusahaan.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="button" size="icon" onClick={handleSendEmail} aria-label="Kirim email">
              <Send />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-share-link`}>Tautan Invoice</Label>
          <div className="flex gap-2">
            <Input id={`${idPrefix}-share-link`} readOnly value={shareLink} />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              aria-label="Salin tautan"
            >
              <Copy />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
