"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createPurchaseOrderAction } from "@/app/actions/purchase-orders";
import { createSupplierAction, type SupplierRecord } from "@/app/actions/suppliers";
import { MANUAL_SUPPLIER_ID_PREFIX } from "@/components/po/supplier-picker";
import type { PoDetail } from "@/components/po/po-detail-form";
import type { PoItem } from "@/components/po/po-item-list-form";
import type { CompanyRecord } from "@/app/actions/companies";

export function SavePoButton({
  poDetail,
  supplier,
  items,
  company,
}: {
  poDetail: PoDetail;
  supplier: SupplierRecord | null;
  items: PoItem[];
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

    const result = await createPurchaseOrderAction({
      poNumber: poDetail.poNumber,
      orderDate: poDetail.orderDate,
      status: poDetail.status,
      notes: poDetail.notes,
      supplierId,
      companyId: company?.id ?? null,
      items: items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      })),
    });
    setSaving(false);

    if (result.success) {
      toast.success("Purchase order berhasil disimpan", {
        description: `${poDetail.poNumber} telah disimpan ke riwayat dokumen.`,
      });
      router.push(`/purchase-order/${result.purchaseOrder.id}`);
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
