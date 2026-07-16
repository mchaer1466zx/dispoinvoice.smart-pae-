"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { savePurchaseOrder } from "@/lib/po-store";
import type { PoDetail } from "@/components/po/po-detail-form";
import type { PoItem } from "@/components/po/po-item-list-form";
import type { Supplier } from "@/lib/mock-data";
import type { CompanyRecord } from "@/app/actions/companies";

export function SavePoButton({
  poDetail,
  supplier,
  items,
  company,
}: {
  poDetail: PoDetail;
  supplier: Supplier | null;
  items: PoItem[];
  company: CompanyRecord | null;
}) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  function handleSave() {
    setSaving(true);
    const result = savePurchaseOrder({ poDetail, supplier, company, items });
    setSaving(false);

    if (result.success) {
      toast.success("Purchase order berhasil disimpan", {
        description: `${poDetail.poNumber} telah disimpan ke riwayat dokumen.`,
      });
      router.push(`/purchase-order/${result.id}`);
    } else {
      toast.error("Gagal menyimpan purchase order", {
        description: result.error,
      });
    }
  }

  return (
    <Button type="button" onClick={handleSave} disabled={saving}>
      {saving ? <Loader2 className="animate-spin" /> : <Save />}
      Simpan PO
    </Button>
  );
}
