"use client";

import { Badge } from "@/components/ui/badge";
import { DocumentHeaderPreview } from "@/components/document-header-preview";
import { PO_STATUS_OPTIONS, type PoDetail } from "@/components/po/po-detail-form";
import type { PoItem } from "@/components/po/po-item-list-form";
import type { SupplierRecord } from "@/app/actions/suppliers";
import { calculateInvoiceTotals } from "@/lib/invoice-totals";
import { formatCurrency, formatDate } from "@/lib/format";
import type { CompanyRecord } from "@/app/actions/companies";

function statusLabel(status: PoDetail["status"]) {
  return PO_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function statusBadgeVariant(
  status: PoDetail["status"]
): "outline" | "default" | "success" {
  if (status === "selesai") return "success";
  if (status === "dikirim") return "default";
  return "outline";
}

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
  const totals = calculateInvoiceTotals(items, poDetail.tax, poDetail.discount);

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
          title="PURCHASE ORDER"
          subtitle={poDetail.poNumber}
        />

        <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="mb-1 font-medium text-gray-500">Kepada Pemasok</p>
            {supplier ? (
              <div>
                <p className="font-semibold">{supplier.name}</p>
                <p className="text-gray-500">{supplier.address}</p>
                <p className="text-gray-500">{supplier.contactInfo}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">Belum ada pemasok dipilih.</p>
            )}
          </div>
          <div className="text-right">
            <dl className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5 justify-end">
              <dt className="text-gray-500">Tanggal Pemesanan</dt>
              <dd>{formatDate(poDetail.orderDate)}</dd>
              <dt className="text-gray-500">Status</dt>
              <dd className="justify-self-end">
                <Badge variant={statusBadgeVariant(poDetail.status)}>
                  {statusLabel(poDetail.status)}
                </Badge>
              </dd>
            </dl>
          </div>
        </div>

        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2 font-medium">Deskripsi</th>
              <th className="py-2 text-right font-medium">Jumlah</th>
              <th className="py-2 text-right font-medium">Harga</th>
              <th className="py-2 text-right font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-2">{item.description || "-"}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{formatCurrency(item.price)}</td>
                <td className="py-2 text-right">
                  {formatCurrency(item.quantity * item.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <div className="flex w-64 flex-col gap-1 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 ? (
              <div className="flex justify-between text-gray-500">
                <span>Diskon</span>
                <span>-{formatCurrency(totals.discount)}</span>
              </div>
            ) : null}
            {totals.taxPercent > 0 ? (
              <div className="flex justify-between text-gray-500">
                <span>PPN ({totals.taxPercent}%)</span>
                <span>{formatCurrency(totals.taxAmount)}</span>
              </div>
            ) : null}
            <div className="mt-1 flex justify-between border-t border-gray-200 pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </div>

        {poDetail.notes ? (
          <div className="mt-8 border-t border-gray-200 pt-4 text-sm">
            <p className="mb-1 font-medium text-gray-500">Catatan</p>
            <p>{poDetail.notes}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
