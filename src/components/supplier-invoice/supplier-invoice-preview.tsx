"use client";

import type { SupplierInvoiceDetail } from "@/components/supplier-invoice/supplier-invoice-detail-form";
import type { SupplierInvoiceItem } from "@/components/supplier-invoice/supplier-invoice-item-list-form";
import type { SupplierRecord } from "@/app/actions/suppliers";
import { calculateInvoiceTotals } from "@/lib/invoice-totals";
import {
  CbsDocument,
  buildCbsGroups,
  type CbsTotalRow,
} from "@/components/procurement/cbs-document";

export function SupplierInvoicePreview({
  detail,
  supplier,
  items,
}: {
  detail: SupplierInvoiceDetail;
  supplier: SupplierRecord | null;
  items: SupplierInvoiceItem[];
}) {
  const groups = buildCbsGroups(
    items.map((item) => ({
      group: item.group,
      description: item.description || "-",
      qty: item.quantity,
      unit: item.unit || undefined,
      unitPrice: item.price,
      amount: item.quantity * item.price,
    }))
  );

  const totals = calculateInvoiceTotals(items, detail.tax, detail.discount);

  const extraRows: CbsTotalRow[] = [];
  if (totals.discount > 0) {
    extraRows.push({ label: "Diskon", value: -totals.discount });
  }
  if (totals.taxPercent > 0) {
    extraRows.push({
      label: `PPN (${totals.taxPercent}%)`,
      value: totals.taxAmount,
    });
  }

  const partyLines = [supplier?.address ?? "", supplier?.contactInfo ?? ""];
  if (detail.supplierRef.trim()) {
    partyLines.push(`No. Invoice Pemasok: ${detail.supplierRef.trim()}`);
  }
  if (detail.poReference.trim()) {
    partyLines.push(`Acuan PO: ${detail.poReference.trim()}`);
  }

  return (
    <div className="mx-auto w-full max-w-[210mm] overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <CbsDocument
        docTitle="SUPPLIER INVOICE"
        docNumber={detail.invoiceNumber}
        companyId={detail.companyId}
        perihal="Tagihan Pemasok (Bill)"
        partyLabel="Kepada"
        partyName={supplier?.name ?? ""}
        partyLines={partyLines}
        dateLabel="Tanggal Tagihan"
        date={detail.invoiceDate}
        validity={detail.dueDate || undefined}
        groups={groups}
        subtotal={totals.subtotal}
        extraRows={extraRows}
        grandTotal={totals.total}
        notes={detail.notes}
      />
    </div>
  );
}
