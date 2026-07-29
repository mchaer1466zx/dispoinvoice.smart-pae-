"use client";

import type { GrnDetail } from "@/components/grn/grn-detail-form";
import type { GrnItem } from "@/components/grn/grn-item-list-form";
import type { SupplierRecord } from "@/app/actions/suppliers";
import {
  CbsDocument,
  buildCbsGroups,
} from "@/components/procurement/cbs-document";

export function GrnPreview({
  grnDetail,
  supplier,
  items,
}: {
  grnDetail: GrnDetail;
  supplier: SupplierRecord | null;
  items: GrnItem[];
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

  const subtotal = groups.reduce((sum, g) => sum + g.subtotal, 0);

  const partyLines = [supplier?.address ?? "", supplier?.contactInfo ?? ""];
  if (grnDetail.poReference.trim()) {
    partyLines.push(`Acuan PO: ${grnDetail.poReference.trim()}`);
  }

  return (
    <div className="mx-auto w-full max-w-[210mm] overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <CbsDocument
        docTitle="GOODS RECEIPT NOTE"
        docNumber={grnDetail.grnNumber}
        companyId={grnDetail.companyId}
        perihal="Bukti Penerimaan Barang"
        partyLabel="Diterima Dari Pemasok"
        partyName={supplier?.name ?? ""}
        partyLines={partyLines}
        dateLabel="Tanggal Terima"
        date={grnDetail.receiptDate}
        groups={groups}
        subtotal={subtotal}
        grandTotal={subtotal}
        notes={grnDetail.notes}
      />
    </div>
  );
}
