"use client";

import { Badge } from "@/components/ui/badge";
import { DocumentHeaderPreview } from "@/components/document-header-preview";
import { DocumentQrCode } from "@/components/invoice/document-qr-code";
import type { BillingInfo } from "@/components/invoice/billing-info-form";
import { STATUS_OPTIONS } from "@/components/invoice/billing-info-form";
import type { InvoiceItem } from "@/components/invoice/item-list-form";
import { calculateItemsTotal } from "@/components/invoice/item-list-form";
import type { Customer } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";
import type { CompanyRecord } from "@/app/actions/companies";

function statusLabel(status: BillingInfo["status"]) {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function statusBadgeVariant(
  status: BillingInfo["status"]
): "outline" | "default" | "success" {
  if (status === "lunas") return "success";
  if (status === "terkirim") return "default";
  return "outline";
}

export function InvoicePreview({
  billingInfo,
  customer,
  items,
  company,
}: {
  billingInfo: BillingInfo;
  customer: Customer | null;
  items: InvoiceItem[];
  company: CompanyRecord | null;
}) {
  const total = calculateItemsTotal(items);

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
          title="INVOICE"
          subtitle={billingInfo.invoiceNumber}
        />

        <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="mb-1 font-medium text-gray-500">Ditagih kepada</p>
            {customer ? (
              <div>
                <p className="font-semibold">{customer.name}</p>
                <p className="text-gray-500">{customer.address}</p>
                <p className="text-gray-500">{customer.email}</p>
                <p className="text-gray-500">{customer.phone}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">Belum ada pelanggan dipilih.</p>
            )}
          </div>
          <div className="text-right">
            <dl className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5 justify-end">
              <dt className="text-gray-500">Tanggal Terbit</dt>
              <dd>{formatDate(billingInfo.issueDate)}</dd>
              <dt className="text-gray-500">Jatuh Tempo</dt>
              <dd>{formatDate(billingInfo.dueDate)}</dd>
              <dt className="text-gray-500">Status</dt>
              <dd className="justify-self-end">
                <Badge variant={statusBadgeVariant(billingInfo.status)}>
                  {statusLabel(billingInfo.status)}
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
          <div className="flex w-56 justify-between border-t border-gray-200 pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {billingInfo.notes ? (
          <div className="mt-8 border-t border-gray-200 pt-4 text-sm">
            <p className="mb-1 font-medium text-gray-500">Catatan</p>
            <p>{billingInfo.notes}</p>
          </div>
        ) : null}

        <div className="mt-10 flex justify-end break-inside-avoid">
          <DocumentQrCode jenis="invoice" nomor={billingInfo.invoiceNumber} />
        </div>
      </div>
    </div>
  );
}
