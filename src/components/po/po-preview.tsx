"use client";

import type { PoDetail } from "@/components/po/po-detail-form";
import type { PoItem } from "@/components/po/po-item-list-form";
import type { SupplierRecord } from "@/app/actions/suppliers";
import { calculateInvoiceTotals } from "@/lib/invoice-totals";
import {
  CbsDocument,
  buildCbsGroups,
  type CbsTotalRow,
} from "@/components/procurement/cbs-document";
import type { CompanyRecord } from "@/app/actions/companies";

const DEFAULT_PAYMENT_TERMS = [
  "50% Uang Muka (DP) setelah PO disetujui",
  "40% Setelah material siap kirim / pekerjaan 80% selesai",
  "10% Pelunasan setelah pekerjaan selesai 100% & QC lulus",
];

export function PoPreview({
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

  const totals = calculateInvoiceTotals(items, poDetail.tax, poDetail.discount);

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
        docTitle="PURCHASE ORDER"
        docNumber={poDetail.poNumber}
        company={company}
        perihal="Pesanan Pembelian Barang/Jasa"
        partyLabel="Kepada Pemasok"
        partyName={supplier?.name ?? ""}
        partyLines={[supplier?.address ?? "", supplier?.contactInfo ?? ""]}
        dateLabel="Tanggal Pemesanan"
        date={poDetail.orderDate}
        groups={groups}
        subtotal={totals.subtotal}
        extraRows={extraRows}
        grandTotal={totals.total}
        notes={poDetail.notes}
        paymentTerms={DEFAULT_PAYMENT_TERMS}
      />
    </div>
  );
}
