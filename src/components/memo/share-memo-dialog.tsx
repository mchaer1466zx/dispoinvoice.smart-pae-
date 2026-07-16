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

export function ShareMemoDialog({ recipientName }: { recipientName: string }) {
  const idPrefix = useId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const shareLink = `https://dispoinvoice.example.com/memo/${idPrefix.replace(/[^a-zA-Z0-9]/g, "")}`;

  function handleSendEmail() {
    if (!email.trim()) return;
    toast.success("Memo terkirim", {
      description: `Memo untuk ${recipientName || "penerima"} telah dikirim ke ${email}.`,
    });
    setEmail("");
    setOpen(false);
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareLink);
    toast.success("Tautan disalin", {
      description: "Tautan memo disposisi telah disalin ke clipboard.",
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
          <DialogTitle>Bagikan Memo Disposisi</DialogTitle>
          <DialogDescription>
            Kirim memo ini ke penerima lewat email, atau salin tautannya.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-share-email`}>Email Penerima</Label>
          <div className="flex gap-2">
            <Input
              id={`${idPrefix}-share-email`}
              type="email"
              placeholder="penerima@perusahaan.com"
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
          <Label htmlFor={`${idPrefix}-share-link`}>Tautan Memo</Label>
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
