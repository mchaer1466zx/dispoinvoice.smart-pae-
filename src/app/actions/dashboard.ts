"use server";

import { and, count, eq, inArray, ne } from "drizzle-orm";
import { db } from "@/db";
import {
  goodsReceipts,
  invoices,
  invoiceItems,
  memos,
  purchaseOrders,
  purchaseRequests,
  quotations,
  rfqs,
  supplierInvoices,
  supplierInvoiceItems,
} from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";
import { calculateInvoiceTotals } from "@/lib/invoice-totals";

export type DashboardSummary = {
  counts: {
    pr: number;
    rfq: number;
    po: number;
    grn: number;
    quotation: number;
    invoice: number;
    supplierInvoice: number;
    memo: number;
  };
  prMenungguApproval: number;
  quotationDiterima: number;
  piutang: { total: number; count: number };
  hutang: { total: number; count: number };
};

async function tableCount(
  table:
    | typeof purchaseRequests
    | typeof rfqs
    | typeof purchaseOrders
    | typeof goodsReceipts
    | typeof quotations
    | typeof invoices
    | typeof supplierInvoices
    | typeof memos
): Promise<number> {
  const [row] = await db.select({ c: count() }).from(table);
  return row?.c ?? 0;
}

/**
 * Server Action ringkasan dashboard: jumlah dokumen per jenis, PR menunggu
 * approval, penawaran diterima, serta total piutang (invoice pelanggan belum
 * lunas) & hutang (tagihan pemasok belum lunas) dihitung memakai rumus yang
 * sama dengan preview (calculateInvoiceTotals).
 */
export async function getDashboardSummaryAction(): Promise<DashboardSummary> {
  await requireSessionUser();

  const [
    prCount,
    rfqCount,
    poCount,
    grnCount,
    quotationCount,
    invoiceCount,
    supplierInvoiceCount,
    memoCount,
  ] = await Promise.all([
    tableCount(purchaseRequests),
    tableCount(rfqs),
    tableCount(purchaseOrders),
    tableCount(goodsReceipts),
    tableCount(quotations),
    tableCount(invoices),
    tableCount(supplierInvoices),
    tableCount(memos),
  ]);

  const [prMenunggu] = await db
    .select({ c: count() })
    .from(purchaseRequests)
    .where(eq(purchaseRequests.status, "menunggu_approval"));

  const [quoDiterima] = await db
    .select({ c: count() })
    .from(quotations)
    .where(eq(quotations.status, "diterima"));

  const piutang = await sumOpenTotals(
    await db
      .select({
        id: invoices.id,
        tax: invoices.tax,
        discount: invoices.discount,
      })
      .from(invoices)
      .where(
        and(ne(invoices.status, "lunas"), ne(invoices.status, "dibatalkan"))
      ),
    invoiceItems,
    invoiceItems.invoiceId
  );

  const hutang = await sumOpenTotals(
    await db
      .select({
        id: supplierInvoices.id,
        tax: supplierInvoices.tax,
        discount: supplierInvoices.discount,
      })
      .from(supplierInvoices)
      .where(
        and(
          ne(supplierInvoices.status, "lunas"),
          ne(supplierInvoices.status, "dibatalkan")
        )
      ),
    supplierInvoiceItems,
    supplierInvoiceItems.supplierInvoiceId
  );

  return {
    counts: {
      pr: prCount,
      rfq: rfqCount,
      po: poCount,
      grn: grnCount,
      quotation: quotationCount,
      invoice: invoiceCount,
      supplierInvoice: supplierInvoiceCount,
      memo: memoCount,
    },
    prMenungguApproval: prMenunggu?.c ?? 0,
    quotationDiterima: quoDiterima?.c ?? 0,
    piutang,
    hutang,
  };
}

/** Menjumlahkan grand total (dengan pajak/diskon) dari dokumen-dokumen terbuka. */
async function sumOpenTotals(
  docs: { id: string; tax: number; discount: number }[],
  itemsTable: typeof invoiceItems | typeof supplierInvoiceItems,
  fkColumn:
    | typeof invoiceItems.invoiceId
    | typeof supplierInvoiceItems.supplierInvoiceId
): Promise<{ total: number; count: number }> {
  if (docs.length === 0) return { total: 0, count: 0 };

  const ids = docs.map((d) => d.id);
  const rows = await db
    .select({
      docId: fkColumn,
      quantity: itemsTable.quantity,
      price: itemsTable.price,
    })
    .from(itemsTable)
    .where(inArray(fkColumn, ids));

  const itemsByDoc = new Map<string, { quantity: number; price: number }[]>();
  for (const row of rows) {
    const list = itemsByDoc.get(row.docId) ?? [];
    list.push({ quantity: row.quantity, price: row.price });
    itemsByDoc.set(row.docId, list);
  }

  let total = 0;
  for (const doc of docs) {
    const items = itemsByDoc.get(doc.id) ?? [];
    total += calculateInvoiceTotals(items, doc.tax, doc.discount).total;
  }

  return { total, count: docs.length };
}
