"use client";

import type { PrDetail } from "@/components/pr/pr-detail-form";
import { type PrItem } from "@/components/pr/pr-item-list-form";
import {
  CbsDocument,
  buildCbsGroups,
} from "@/components/procurement/cbs-document";
import type { CompanyRecord } from "@/app/actions/companies";

export function PrPreview({
  prDetail,
  items,
  company,
}: {
  prDetail: PrDetail;
  items: PrItem[];
  company: CompanyRecord | null;
}) {
  const groups = buildCbsGroups(
    items.map((item) => ({
      group: item.group,
      description: item.description || "-",
      spec: item.spec || undefined,
      qty: item.quantity,
      unit: item.unit || undefined,
      unitPrice: item.estPrice,
      amount: item.quantity * item.estPrice,
    }))
  );

  const subtotal = groups.reduce((sum, g) => sum + g.subtotal, 0);

  return (
    <div className="mx-auto w-full max-w-[210mm] overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <CbsDocument
        docTitle="PURCHASE REQUEST"
        docNumber={prDetail.prNumber}
        company={company}
        perihal="Usulan / Permintaan Pembelian"
        partyLabel="Departemen Peminta"
        partyName={prDetail.department}
        dateLabel="Tanggal Kebutuhan"
        date={prDetail.needDate}
        groups={groups}
        subtotal={subtotal}
        grandTotal={subtotal}
        notes={prDetail.notes}
      />
    </div>
  );
}
