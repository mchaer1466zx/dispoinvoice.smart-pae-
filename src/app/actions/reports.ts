"use server";

import { desc, eq, sql } from "drizzle-orm";
import type { AnySQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";
import { db } from "@/db";
import {
  customers,
  goodsReceipts,
  grnItems,
  invoiceItems,
  invoices,
  memos,
  poItems,
  prItems,
  purchaseOrders,
  purchaseRequests,
  quotationItems,
  quotations,
  rfqItems,
  rfqs,
  suppliers,
  supplierInvoiceItems,
  supplierInvoices,
} from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";
import { calculateInvoiceTotals } from "@/lib/invoice-totals";
import type { DocumentType } from "@/lib/mock-data";

export type ReportRow = {
  type: DocumentType;
  number: string;
  partyName: string;
  date: string;
  status: string;
  value: number;
};

/** Menghitung nilai grand total dari subtotal item + pajak/diskon dokumen. */
function docValue(subtotal: number, tax: number, discount: number): number {
  return calculateInvoiceTotals([{ quantity: 1, price: subtotal }], tax, discount)
    .total;
}

/**
 * Server Action laporan: satu daftar seluruh dokumen (semua jenis) lengkap
 * dengan nilai grand total, siap ditampilkan & diekspor ke Excel. Nilai item
 * dijumlah di SQL (SUM qty*price) lalu pajak/diskon diterapkan per dokumen.
 */
export async function getReportRowsAction(): Promise<ReportRow[]> {
  await requireSessionUser();
  const rows: ReportRow[] = [];

  // Peta subtotal item per dokumen (SUM qty*price) untuk tiap jenis.
  async function subtotalMap(
    itemsTable: SQLiteTable,
    fk: AnySQLiteColumn,
    qtyCol: AnySQLiteColumn,
    priceCol: AnySQLiteColumn
  ): Promise<Map<string, number>> {
    const result = await db
      .select({
        docId: fk,
        subtotal: sql<number>`coalesce(sum(${qtyCol} * ${priceCol}), 0)`,
      })
      .from(itemsTable)
      .groupBy(fk);
    return new Map(
      result.map((r) => [String(r.docId), Number(r.subtotal)])
    );
  }

  // PR
  {
    const subs = await subtotalMap(
      prItems,
      prItems.prId,
      prItems.quantity,
      prItems.estPrice
    );
    const docs = await db
      .select({
        id: purchaseRequests.id,
        number: purchaseRequests.prNumber,
        party: purchaseRequests.department,
        date: purchaseRequests.needDate,
        createdAt: purchaseRequests.createdAt,
        status: purchaseRequests.status,
      })
      .from(purchaseRequests)
      .orderBy(desc(purchaseRequests.createdAt));
    for (const d of docs) {
      rows.push({
        type: "pr",
        number: d.number,
        partyName: d.party ?? "-",
        date: d.date ?? d.createdAt.slice(0, 10),
        status: d.status,
        value: subs.get(d.id) ?? 0,
      });
    }
  }

  // RFQ
  {
    const subs = await subtotalMap(
      rfqItems,
      rfqItems.rfqId,
      rfqItems.quantity,
      rfqItems.price
    );
    const docs = await db
      .select({
        id: rfqs.id,
        number: rfqs.rfqNumber,
        party: suppliers.name,
        date: rfqs.requestDate,
        status: rfqs.status,
      })
      .from(rfqs)
      .leftJoin(suppliers, eq(rfqs.supplierId, suppliers.id))
      .orderBy(desc(rfqs.requestDate));
    for (const d of docs) {
      rows.push({
        type: "rfq",
        number: d.number,
        partyName: d.party ?? "-",
        date: d.date,
        status: d.status,
        value: subs.get(d.id) ?? 0,
      });
    }
  }

  // PO
  {
    const subs = await subtotalMap(
      poItems,
      poItems.poId,
      poItems.quantity,
      poItems.price
    );
    const docs = await db
      .select({
        id: purchaseOrders.id,
        number: purchaseOrders.poNumber,
        party: suppliers.name,
        date: purchaseOrders.orderDate,
        status: purchaseOrders.status,
        tax: purchaseOrders.tax,
        discount: purchaseOrders.discount,
      })
      .from(purchaseOrders)
      .leftJoin(suppliers, eq(purchaseOrders.supplierId, suppliers.id))
      .orderBy(desc(purchaseOrders.orderDate));
    for (const d of docs) {
      rows.push({
        type: "po",
        number: d.number,
        partyName: d.party ?? "-",
        date: d.date,
        status: d.status,
        value: docValue(subs.get(d.id) ?? 0, d.tax, d.discount),
      });
    }
  }

  // GRN
  {
    const subs = await subtotalMap(
      grnItems,
      grnItems.grnId,
      grnItems.quantity,
      grnItems.price
    );
    const docs = await db
      .select({
        id: goodsReceipts.id,
        number: goodsReceipts.grnNumber,
        party: suppliers.name,
        date: goodsReceipts.receiptDate,
        status: goodsReceipts.status,
      })
      .from(goodsReceipts)
      .leftJoin(suppliers, eq(goodsReceipts.supplierId, suppliers.id))
      .orderBy(desc(goodsReceipts.receiptDate));
    for (const d of docs) {
      rows.push({
        type: "grn",
        number: d.number,
        partyName: d.party ?? "-",
        date: d.date,
        status: d.status,
        value: subs.get(d.id) ?? 0,
      });
    }
  }

  // Quotation
  {
    const subs = await subtotalMap(
      quotationItems,
      quotationItems.quotationId,
      quotationItems.quantity,
      quotationItems.price
    );
    const docs = await db
      .select({
        id: quotations.id,
        number: quotations.quotationNumber,
        party: customers.name,
        date: quotations.quotationDate,
        status: quotations.status,
        tax: quotations.tax,
        discount: quotations.discount,
      })
      .from(quotations)
      .leftJoin(customers, eq(quotations.customerId, customers.id))
      .orderBy(desc(quotations.quotationDate));
    for (const d of docs) {
      rows.push({
        type: "quotation",
        number: d.number,
        partyName: d.party ?? "-",
        date: d.date,
        status: d.status,
        value: docValue(subs.get(d.id) ?? 0, d.tax, d.discount),
      });
    }
  }

  // Invoice pelanggan
  {
    const subs = await subtotalMap(
      invoiceItems,
      invoiceItems.invoiceId,
      invoiceItems.quantity,
      invoiceItems.price
    );
    const docs = await db
      .select({
        id: invoices.id,
        number: invoices.invoiceNumber,
        party: customers.name,
        date: invoices.issueDate,
        status: invoices.status,
        tax: invoices.tax,
        discount: invoices.discount,
      })
      .from(invoices)
      .leftJoin(customers, eq(invoices.customerId, customers.id))
      .orderBy(desc(invoices.issueDate));
    for (const d of docs) {
      rows.push({
        type: "invoice",
        number: d.number,
        partyName: d.party ?? "-",
        date: d.date,
        status: d.status,
        value: docValue(subs.get(d.id) ?? 0, d.tax, d.discount),
      });
    }
  }

  // Tagihan pemasok
  {
    const subs = await subtotalMap(
      supplierInvoiceItems,
      supplierInvoiceItems.supplierInvoiceId,
      supplierInvoiceItems.quantity,
      supplierInvoiceItems.price
    );
    const docs = await db
      .select({
        id: supplierInvoices.id,
        number: supplierInvoices.invoiceNumber,
        party: suppliers.name,
        date: supplierInvoices.invoiceDate,
        status: supplierInvoices.status,
        tax: supplierInvoices.tax,
        discount: supplierInvoices.discount,
      })
      .from(supplierInvoices)
      .leftJoin(suppliers, eq(supplierInvoices.supplierId, suppliers.id))
      .orderBy(desc(supplierInvoices.invoiceDate));
    for (const d of docs) {
      rows.push({
        type: "supplier_invoice",
        number: d.number,
        partyName: d.party ?? "-",
        date: d.date,
        status: d.status,
        value: docValue(subs.get(d.id) ?? 0, d.tax, d.discount),
      });
    }
  }

  // Memo (tanpa nilai)
  {
    const docs = await db
      .select({
        id: memos.id,
        number: memos.subject,
        party: memos.recipientName,
        date: memos.memoDate,
        status: memos.status,
      })
      .from(memos)
      .orderBy(desc(memos.memoDate));
    for (const d of docs) {
      rows.push({
        type: "memo",
        number: d.number,
        partyName: d.party,
        date: d.date,
        status: d.status,
        value: 0,
      });
    }
  }

  return rows.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export type MonthlyTrendPoint = {
  ym: string;
  label: string;
  count: number;
};

/**
 * Server Action tren: jumlah dokumen dibuat per bulan selama 6 bulan terakhir
 * (semua jenis digabung), untuk grafik tren di dashboard.
 */
export async function getMonthlyTrendAction(): Promise<MonthlyTrendPoint[]> {
  await requireSessionUser();

  const tables = [
    purchaseRequests.createdAt,
    rfqs.createdAt,
    purchaseOrders.createdAt,
    goodsReceipts.createdAt,
    quotations.createdAt,
    invoices.createdAt,
    supplierInvoices.createdAt,
    memos.createdAt,
  ] as const;

  const fromTables = [
    purchaseRequests,
    rfqs,
    purchaseOrders,
    goodsReceipts,
    quotations,
    invoices,
    supplierInvoices,
    memos,
  ] as const;

  // Hitung per (tabel, bulan) lalu gabung.
  const counts = new Map<string, number>();
  for (let i = 0; i < fromTables.length; i++) {
    const createdAt = tables[i];
    const grouped = await db
      .select({
        ym: sql<string>`strftime('%Y-%m', ${createdAt})`,
        c: sql<number>`count(*)`,
      })
      .from(fromTables[i])
      .groupBy(sql`strftime('%Y-%m', ${createdAt})`);
    for (const g of grouped) {
      counts.set(g.ym, (counts.get(g.ym) ?? 0) + Number(g.c));
    }
  }

  const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  const points: MonthlyTrendPoint[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    points.push({
      ym,
      label: `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
      count: counts.get(ym) ?? 0,
    });
  }

  return points;
}
