"use client";

import { useId, useState } from "react";
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
import {
  getInvoiceShareLinkAction,
  sendInvoiceEmailAction,
} from "@/app/actions/share-invoice";

/**
 * Dialog "Bagikan" invoice. Membutuhkan invoice yang SUDAH tersimpan (punya
 * invoiceId) agar bisa mengirim email berlampiran PDF atau menyalin tautan
 * unduh PDF asli. Bila invoiceId null (belum disimpan / baru diubah), tombol
 * dinonaktifkan dan pengguna diminta menyimpan dulu.
 */
export function ShareInvoiceDialog({
  invoiceNumber,
  invoiceId,
}: {
  invoiceNumber: string;
  invoiceId: string | null;
}) {
  const idPrefix = useId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [loadingLink, setLoadingLink] = useState(false);

  const isSaved = Boolean(invoiceId);

  async function handleOpenChange(next: boolean) {
    setOpen(next);
    // Saat dibuka & invoice sudah tersimpan, ambil tautan unduh PDF asli.
    if (next && invoiceId) {
      setLoadingLink(true);
      try {
        const result = await getInvoiceShareLinkAction(invoiceId);
        setShareLink(result.success ? result.url : "");
      } catch {
        setShareLink("");
      } finally {
        setLoadingLink(false);
      }
    }
  }

  async function handleSendEmail() {
    if (!invoiceId) {
      toast.error("Simpan invoice dulu", {
        description: "Invoice harus disimpan sebelum bisa dibagikan via email.",
      });
      return;
    }
    if (!email.trim()) return;

    setSending(true);
    const result = await sendInvoiceEmailAction({
      invoiceId,
      recipientEmail: email.trim(),
    });
    setSending(false);

    if (result.success) {
      toast.success("Invoice terkirim", {
        description: `Invoice ${invoiceNumber} telah dikirim ke ${email.trim()}.`,
      });
      setEmail("");
      setOpen(false);
    } else {
      toast.error("Gagal mengirim invoice", { description: result.error });
    }
  }

  async function handleCopyLink() {
    if (!invoiceId) {
      toast.error("Simpan invoice dulu", {
        description: "Tautan tersedia setelah invoice disimpan.",
      });
      return;
    }
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    toast.success("Tautan disalin", {
      description: "Tautan unduh PDF invoice telah disalin ke clipboard.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <Share2 /> Bagikan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bagikan Invoice</DialogTitle>
          <DialogDescription>
            Kirim {invoiceNumber} ke atasan lewat email, atau salin tautan unduh
            PDF-nya.
          </DialogDescription>
        </DialogHeader>

        {!isSaved && (
          <p className="rounded-md border border-dashed bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            Simpan invoice dulu (tombol &ldquo;Simpan Invoice&rdquo;) agar bisa
            dikirim via email atau dibagikan tautannya.
          </p>
        )}

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-share-email`}>Email Penerima</Label>
          <div className="flex gap-2">
            <Input
              id={`${idPrefix}-share-email`}
              type="email"
              placeholder="atasan@perusahaan.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isSaved || sending}
            />
            <Button
              type="button"
              size="icon"
              onClick={handleSendEmail}
              disabled={!isSaved || sending || !email.trim()}
              aria-label="Kirim email"
            >
              {sending ? <Loader2 className="animate-spin" /> : <Send />}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-share-link`}>Tautan Invoice</Label>
          <div className="flex gap-2">
            <Input
              id={`${idPrefix}-share-link`}
              readOnly
              value={
                isSaved
                  ? loadingLink
                    ? "Memuat tautan…"
                    : shareLink
                  : "Tersedia setelah invoice disimpan"
              }
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              disabled={!isSaved || loadingLink || !shareLink}
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
