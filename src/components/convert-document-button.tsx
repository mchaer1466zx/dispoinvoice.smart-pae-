"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  convertRfqToPoAction,
  convertPrToPoAction,
  convertQuotationToInvoiceAction,
  type ConvertResult,
} from "@/app/actions/conversions";

type ConvertKind = "rfq" | "pr" | "quotation";

const CONFIG: Record<
  ConvertKind,
  { label: string; run: (id: string) => Promise<ConvertResult>; ok: string }
> = {
  rfq: {
    label: "Buat PO",
    run: convertRfqToPoAction,
    ok: "PO dibuat dari RFQ",
  },
  pr: {
    label: "Buat PO",
    run: convertPrToPoAction,
    ok: "PO dibuat dari PR",
  },
  quotation: {
    label: "Buat Invoice",
    run: convertQuotationToInvoiceAction,
    ok: "Invoice dibuat dari penawaran",
  },
};

/**
 * Tombol konversi antar-dokumen sekali klik: RFQ→PO, PR→PO, Quotation→Invoice.
 * Membuat dokumen tujuan berstatus Draft lalu membuka detailnya.
 */
export function ConvertDocumentButton({
  kind,
  id,
}: {
  kind: ConvertKind;
  id: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const cfg = CONFIG[kind];

  async function handleConvert() {
    setLoading(true);
    const result = await cfg.run(id);
    setLoading(false);

    if (result.success) {
      toast.success(cfg.ok, {
        description: "Dokumen baru berstatus Draft telah dibuat.",
      });
      router.push(`/riwayat/${result.id}`);
    } else {
      toast.error("Gagal konversi", { description: result.error });
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleConvert}
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : <ArrowRightLeft />}{" "}
      {cfg.label}
    </Button>
  );
}
