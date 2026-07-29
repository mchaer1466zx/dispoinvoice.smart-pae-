"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createQuotationAction } from "@/app/actions/quotations";
import type { QuotationDetail } from "@/components/quotation/quotation-detail-form";
import type { QuotationItem } from "@/components/quotation/quotation-item-list-form";
import type { Customer } from "@/lib/mock-data";
import type { CompanyRecord } from "@/app/actions/companies";

export function SaveQuotationButton({
  quotationDetail,
  customer,
  items,
  company,
}: {
  quotationDetail: QuotationDetail;
  customer: Customer | null;
  items: QuotationItem[];
  company: CompanyRecord | null;
}) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);

    const result = await createQuotationAction({
      quotationNumber: quotationDetail.quotationNumber,
      quotationDate: quotationDetail.quotationDate,
      status: quotationDetail.status,
      validUntil: quotationDetail.validUntil,
      tax: quotationDetail.tax,
      discount: quotationDetail.discount,
      notes: quotationDetail.notes,
      customerId: customer?.id ?? null,
      companyId: company?.id ?? null,
      items: items.map((item) => ({
        group: item.group,
        description: item.description,
        spec: item.spec,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
      })),
    });
    setSaving(false);

    if (result.success) {
      toast.success("Penawaran berhasil disimpan", {
        description: `${quotationDetail.quotationNumber} telah disimpan ke riwayat dokumen.`,
      });
      router.push(`/riwayat/${result.quotation.id}`);
    } else {
      toast.error("Gagal menyimpan penawaran", {
        description: result.error,
      });
    }
  }

  return (
    <Button type="button" onClick={handleSave} disabled={saving}>
      {saving ? <Loader2 className="animate-spin" /> : <Save />}
      Simpan Penawaran
    </Button>
  );
}
