"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createSupplierInvoiceAction } from "@/app/actions/supplier-invoices";
import { createSupplierAction, type SupplierRecord } from "@/app/actions/suppliers";
import { MANUAL_SUPPLIER_ID_PREFIX } from "@/components/po/supplier-picker";
import type { SupplierInvoiceDetail } from "@/components/supplier-invoice/supplier-invoice-detail-form";
import type { SupplierInvoiceItem } from "@/components/supplier-invoice/supplier-invoice-item-list-form";
import type { CompanyRecord } from "@/app/actions/companies";

export function SaveSupplierInvoiceButton({
  detail,
  supplier,
  items,
  company,
}: {
  detail: SupplierInvoiceDetail;
  supplier: SupplierRecord | null;
  items: SupplierInvoiceItem[];
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

    const result = await createSupplierInvoiceAction({
      invoiceNumber: detail.invoiceNumber,
      supplierRef: detail.supplierRef,
      poReference: detail.poReference,
      invoiceDate: detail.invoiceDate,
      dueDate: detail.dueDate,
      status: detail.status,
      tax: detail.tax,
      discount: detail.discount,
      notes: detail.notes,
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
      toast.success("Tagihan pemasok berhasil disimpan", {
        description: `${detail.invoiceNumber} telah disimpan ke riwayat dokumen.`,
      });
      router.push(`/riwayat/${result.supplierInvoice.id}`);
    } else {
      toast.error("Gagal menyimpan tagihan pemasok", {
        description: result.error,
      });
    }
  }

  return (
    <Button type="button" onClick={handleSave} disabled={saving}>
      {saving ? <Loader2 className="animate-spin" /> : <Save />}
      Simpan Tagihan
    </Button>
  );
}
