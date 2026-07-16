"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createInvoiceAction } from "@/app/actions/invoices";
import type { BillingInfo } from "@/components/invoice/billing-info-form";
import type { InvoiceItem } from "@/components/invoice/item-list-form";
import type { Customer } from "@/lib/mock-data";

export function SaveInvoiceButton({
  billingInfo,
  customer,
  items,
  companyId,
}: {
  billingInfo: BillingInfo;
  customer: Customer | null;
  items: InvoiceItem[];
  companyId: string | null;
}) {
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const result = await createInvoiceAction({
      invoiceNumber: billingInfo.invoiceNumber,
      issueDate: billingInfo.issueDate,
      dueDate: billingInfo.dueDate,
      status: billingInfo.status,
      notes: billingInfo.notes,
      customerId: customer?.id ?? null,
      companyId,
      items: items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      })),
    });
    setSaving(false);

    if (result.success) {
      toast.success("Invoice berhasil disimpan", {
        description: `${billingInfo.invoiceNumber} telah disimpan ke riwayat dokumen.`,
      });
    } else {
      toast.error("Gagal menyimpan invoice", { description: result.error });
    }
  }

  return (
    <Button type="button" onClick={handleSave} disabled={saving}>
      {saving ? <Loader2 className="animate-spin" /> : <Save />}
      Simpan Invoice
    </Button>
  );
}
