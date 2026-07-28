"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createPurchaseRequestAction } from "@/app/actions/purchase-requests";
import { validatePurchaseRequestInput } from "@/lib/pr-validation";
import type { PrDetail } from "@/components/pr/pr-detail-form";
import type { PrItem } from "@/components/pr/pr-item-list-form";
import type { CompanyRecord } from "@/app/actions/companies";

export function SavePrButton({
  prDetail,
  items,
  company,
}: {
  prDetail: PrDetail;
  items: PrItem[];
  company: CompanyRecord | null;
}) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSave() {
    const validationError = validatePurchaseRequestInput({
      prNumber: prDetail.prNumber,
      department: prDetail.department,
      needDate: prDetail.needDate,
      notes: prDetail.notes,
      items,
    });
    if (validationError) {
      toast.error("Lengkapi purchase request", { description: validationError });
      return;
    }

    setSaving(true);
    const result = await createPurchaseRequestAction({
      prNumber: prDetail.prNumber,
      department: prDetail.department,
      needDate: prDetail.needDate,
      status: prDetail.status,
      notes: prDetail.notes,
      companyId: company?.id ?? null,
      items: items.map((item) => ({
        group: item.group,
        description: item.description,
        spec: item.spec,
        quantity: item.quantity,
        unit: item.unit,
        estPrice: item.estPrice,
      })),
    });
    setSaving(false);

    if (result.success) {
      toast.success("Purchase request berhasil disimpan", {
        description: `${prDetail.prNumber} telah disimpan ke riwayat dokumen.`,
      });
      router.push(`/riwayat/${result.purchaseRequestId}`);
    } else {
      toast.error("Gagal menyimpan purchase request", {
        description: result.error,
      });
    }
  }

  return (
    <Button type="button" onClick={handleSave} disabled={saving}>
      {saving ? <Loader2 className="animate-spin" /> : <Save />}
      Simpan PR
    </Button>
  );
}
