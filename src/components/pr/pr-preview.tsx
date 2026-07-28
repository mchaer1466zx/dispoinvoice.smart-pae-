"use client";

import { DocumentHeaderPreview } from "@/components/document-header-preview";
import type { PrDetail } from "@/components/pr/pr-detail-form";
import {
  type PrItem,
  calculatePrItemsTotal,
} from "@/components/pr/pr-item-list-form";
import { formatCurrency, formatDate } from "@/lib/format";
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
  const total = calculatePrItemsTotal(items);

  return (
    <div className="mx-auto w-full max-w-[210mm] overflow-hidden rounded-lg border border-gray-200 bg-white text-black">
      <div
        aria-hidden
        className="h-1.5 w-full"
        style={{ background: "linear-gradient(to right, #116ABE, #8ABA49)" }}
      />
      <div className="p-8 sm:p-12">
        <DocumentHeaderPreview
          company={company}
          title="PURCHASE REQUEST"
          subtitle={prDetail.prNumber}
        />

        <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="mb-1 font-medium text-gray-500">Departemen Peminta</p>
            <p className="font-semibold">{prDetail.department || "-"}</p>
          </div>
          <div className="text-right">
            <dl className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5 justify-end">
              <dt className="text-gray-500">Tanggal Kebutuhan</dt>
              <dd>{formatDate(prDetail.needDate)}</dd>
            </dl>
          </div>
        </div>

        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2 font-medium">Deskripsi</th>
              <th className="py-2 font-medium">Spesifikasi</th>
              <th className="py-2 text-right font-medium">Jumlah</th>
              <th className="py-2 text-right font-medium">Est. Harga</th>
              <th className="py-2 text-right font-medium">Est. Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-2">{item.description || "-"}</td>
                <td className="py-2 text-gray-500">{item.spec || "-"}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{formatCurrency(item.estPrice)}</td>
                <td className="py-2 text-right">
                  {formatCurrency(item.quantity * item.estPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <div className="flex w-64 justify-between border-t border-gray-200 pt-2 text-base font-semibold">
            <span>Estimasi Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {prDetail.notes ? (
          <div className="mt-8 border-t border-gray-200 pt-4 text-sm">
            <p className="mb-1 font-medium text-gray-500">Catatan</p>
            <p>{prDetail.notes}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
