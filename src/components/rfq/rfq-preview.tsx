"use client";

import type { RfqDetail } from "@/components/rfq/rfq-detail-form";
import type { RfqItem } from "@/components/rfq/rfq-item-list-form";
import type { SupplierRecord } from "@/app/actions/suppliers";
import {
  CbsDocument,
  buildCbsGroups,
} from "@/components/procurement/cbs-document";

export function RfqPreview({
  rfqDetail,
  supplier,
  items,
}: {
  rfqDetail: RfqDetail;
  supplier: SupplierRecord | null;
  items: RfqItem[];
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

  return (
    <div className="mx-auto w-full max-w-[210mm] overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <CbsDocument
        docTitle="REQUEST FOR QUOTATION"
        docNumber={rfqDetail.rfqNumber}
        companyId={rfqDetail.companyId}
        perihal="Permintaan Penawaran Harga"
        partyLabel="Kepada"
        partyName={supplier?.name ?? ""}
        partyLines={[supplier?.address ?? "", supplier?.contactInfo ?? ""]}
        dateLabel="Tanggal Permintaan"
        date={rfqDetail.requestDate}
        validity={rfqDetail.deadline || undefined}
        groups={groups}
        subtotal={subtotal}
        grandTotal={subtotal}
        notes={rfqDetail.notes}
      />
    </div>
  );
}
