"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createRfqAction } from "@/app/actions/rfqs";
import { createSupplierAction, type SupplierRecord } from "@/app/actions/suppliers";
import { MANUAL_SUPPLIER_ID_PREFIX } from "@/components/po/supplier-picker";
import type { RfqDetail } from "@/components/rfq/rfq-detail-form";
import type { RfqItem } from "@/components/rfq/rfq-item-list-form";
import type { CompanyRecord } from "@/app/actions/companies";

export function SaveRfqButton({
  rfqDetail,
  supplier,
  items,
  company,
}: {
  rfqDetail: RfqDetail;
  supplier: SupplierRecord | null;
  items: RfqItem[];
  company: CompanyRecord | null;
}) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);

    let supplierId = supplier?.id ?? null;

    if (supplier && supplierId?.startsWith(MANUAL_SUPPLIER_ID_PREFIX)) {
      const created = await createSupplierAction({
        name: supplier.name,
        contactInfo: supplier.contactInfo,
        address: supplier.address,
      });
      if (!created.success) {
        setSaving(false);
        toast.error("Gagal menyimpan data pemasok", { description: created.error });
        return;
      }
      supplierId = created.supplier.id;
    }

    const result = await createRfqAction({
      rfqNumber: rfqDetail.rfqNumber,
      requestDate: rfqDetail.requestDate,
      status: rfqDetail.status,
      deadline: rfqDetail.deadline,
      notes: rfqDetail.notes,
      supplierId,
      companyId: company?.id ?? null,
      items: items.map((item) => ({
        group: item.group,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
      })),
    });
    setSaving(false);

    if (result.success) {
      toast.success("RFQ berhasil disimpan", {
        description: `${rfqDetail.rfqNumber} telah disimpan ke riwayat dokumen.`,
      });
      router.push(`/riwayat/${result.rfq.id}`);
    } else {
      toast.error("Gagal menyimpan RFQ", {
        description: result.error,
      });
    }
  }

  return (
    <Button type="button" onClick={handleSave} disabled={saving}>
      {saving ? <Loader2 className="animate-spin" /> : <Save />}
      Simpan RFQ
    </Button>
  );
}
