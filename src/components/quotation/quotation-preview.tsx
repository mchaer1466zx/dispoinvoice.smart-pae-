"use client";

import type { QuotationDetail } from "@/components/quotation/quotation-detail-form";
import type { QuotationItem } from "@/components/quotation/quotation-item-list-form";
import type { Customer } from "@/lib/mock-data";
import { calculateInvoiceTotals } from "@/lib/invoice-totals";
import {
  CbsDocument,
  buildCbsGroups,
  type CbsTotalRow,
} from "@/components/procurement/cbs-document";

const DEFAULT_TERMS = [
  "Harga berlaku selama masa berlaku penawaran ini.",
  "Harga belum termasuk ongkos kirim kecuali disebutkan.",
  "Pembayaran sesuai kesepakatan pada PO.",
];

export function QuotationPreview({
  quotationDetail,
  customer,
  items,
}: {
  quotationDetail: QuotationDetail;
  customer: Customer | null;
  items: QuotationItem[];
}) {
  const groups = buildCbsGroups(
    items.map((item) => ({
      group: item.group,
      description: item.description || "-",
      spec: item.spec || undefined,
      qty: item.quantity,
      unit: item.unit || undefined,
      unitPrice: item.price,
      amount: item.quantity * item.price,
    }))
  );

  const totals = calculateInvoiceTotals(
    items,
    quotationDetail.tax,
    quotationDetail.discount
  );

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

  return (
    <div className="mx-auto w-full max-w-[210mm] overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <CbsDocument
        docTitle="QUOTATION"
        docNumber={quotationDetail.quotationNumber}
        companyId={quotationDetail.companyId}
        perihal="Penawaran Harga"
        partyLabel="Kepada Yth (Pelanggan)"
        partyName={customer?.name ?? ""}
        partyLines={[customer?.address ?? "", customer?.phone ?? "", customer?.email ?? ""]}
        dateLabel="Tanggal Penawaran"
        date={quotationDetail.quotationDate}
        validity={quotationDetail.validUntil || undefined}
        groups={groups}
        subtotal={totals.subtotal}
        extraRows={extraRows}
        grandTotal={totals.total}
        notes={quotationDetail.notes}
        paymentTerms={DEFAULT_TERMS}
      />
    </div>
  );
}
