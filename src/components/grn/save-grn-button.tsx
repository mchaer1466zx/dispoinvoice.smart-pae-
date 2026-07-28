"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createGoodsReceiptAction } from "@/app/actions/goods-receipts";
import { createSupplierAction, type SupplierRecord } from "@/app/actions/suppliers";
import { MANUAL_SUPPLIER_ID_PREFIX } from "@/components/po/supplier-picker";
import type { GrnDetail } from "@/components/grn/grn-detail-form";
import type { GrnItem } from "@/components/grn/grn-item-list-form";
import type { CompanyRecord } from "@/app/actions/companies";

export function SaveGrnButton({
  grnDetail,
  supplier,
  items,
  company,
}: {
  grnDetail: GrnDetail;
  supplier: SupplierRecord | null;
  items: GrnItem[];
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

    const result = await createGoodsReceiptAction({
      grnNumber: grnDetail.grnNumber,
      receiptDate: grnDetail.receiptDate,
      status: grnDetail.status,
      poReference: grnDetail.poReference,
      notes: grnDetail.notes,
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
      toast.success("Goods receipt berhasil disimpan", {
        description: `${grnDetail.grnNumber} telah disimpan ke riwayat dokumen.`,
      });
      router.push(`/riwayat/${result.goodsReceipt.id}`);
    } else {
      toast.error("Gagal menyimpan goods receipt", {
        description: result.error,
      });
    }
  }

  return (
    <Button type="button" onClick={handleSave} disabled={saving}>
      {saving ? <Loader2 className="animate-spin" /> : <Save />}
      Simpan GRN
    </Button>
  );
}
