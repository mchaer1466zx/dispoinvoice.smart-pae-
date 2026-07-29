"use server";

import { desc, eq, like, or } from "drizzle-orm";
import { db } from "@/db";
import { requireSessionUser } from "@/app/actions/auth";
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
  suppliers,
} from "@/db/schema";

export type DocumentType = "invoice" | "po" | "grn" | "memo" | "pr";

export type DocumentSummary = {
  id: string;
  type: DocumentType;
  number: string;
  partyName: string;
  date: string;
  status: string;
};

export type ListDocumentsParams = {
  type?: DocumentType;
  search?: string;
};

/**
 * Server Action untuk mengambil daftar dokumen (invoice, PO, memo) tergabung dalam satu
 * daftar riwayat, dengan filter jenis dan pencarian nomor/nama pelanggan-pemasok/penerima.
 */
export async function listDocumentsAction(
  params: ListDocumentsParams = {}
): Promise<DocumentSummary[]> {
  await requireSessionUser();
  const query = params.search?.trim();
  const results: DocumentSummary[] = [];

  if (!params.type || params.type === "invoice") {
    const rows = await db
      .select({
        id: invoices.id,
        number: invoices.invoiceNumber,
        partyName: customers.name,
        date: invoices.issueDate,
        status: invoices.status,
      })
      .from(invoices)
      .leftJoin(customers, eq(invoices.customerId, customers.id))
      .where(
        query
          ? or(
              like(invoices.invoiceNumber, `%${query}%`),
              like(customers.name, `%${query}%`)
            )
          : undefined
      )
      .orderBy(desc(invoices.issueDate));

    results.push(
      ...rows.map((row) => ({
        id: row.id,
        type: "invoice" as const,
        number: row.number,
        partyName: row.partyName ?? "-",
        date: row.date,
        status: row.status,
      }))
    );
  }

  if (!params.type || params.type === "po") {
    const rows = await db
      .select({
        id: purchaseOrders.id,
        number: purchaseOrders.poNumber,
        partyName: suppliers.name,
        date: purchaseOrders.orderDate,
        status: purchaseOrders.status,
      })
      .from(purchaseOrders)
      .leftJoin(suppliers, eq(purchaseOrders.supplierId, suppliers.id))
      .where(
        query
          ? or(
              like(purchaseOrders.poNumber, `%${query}%`),
              like(suppliers.name, `%${query}%`)
            )
          : undefined
      )
      .orderBy(desc(purchaseOrders.orderDate));

    results.push(
      ...rows.map((row) => ({
        id: row.id,
        type: "po" as const,
        number: row.number,
        partyName: row.partyName ?? "-",
        date: row.date,
        status: row.status,
      }))
    );
  }

  if (!params.type || params.type === "grn") {
    const rows = await db
      .select({
        id: goodsReceipts.id,
        number: goodsReceipts.grnNumber,
        partyName: suppliers.name,
        date: goodsReceipts.receiptDate,
        status: goodsReceipts.status,
      })
      .from(goodsReceipts)
      .leftJoin(suppliers, eq(goodsReceipts.supplierId, suppliers.id))
      .where(
        query
          ? or(
              like(goodsReceipts.grnNumber, `%${query}%`),
              like(suppliers.name, `%${query}%`)
            )
          : undefined
      )
      .orderBy(desc(goodsReceipts.receiptDate));

    results.push(
      ...rows.map((row) => ({
        id: row.id,
        type: "grn" as const,
        number: row.number,
        partyName: row.partyName ?? "-",
        date: row.date,
        status: row.status,
      }))
    );
  }

  if (!params.type || params.type === "memo") {
    const rows = await db
      .select({
        id: memos.id,
        number: memos.subject,
        partyName: memos.recipientName,
        date: memos.memoDate,
        status: memos.status,
      })
      .from(memos)
      .where(
        query
          ? or(
              like(memos.subject, `%${query}%`),
              like(memos.recipientName, `%${query}%`)
            )
          : undefined
      )
      .orderBy(desc(memos.memoDate));

    results.push(
      ...rows.map((row) => ({
        id: row.id,
        type: "memo" as const,
        number: row.number,
        partyName: row.partyName,
        date: row.date,
        status: row.status,
      }))
    );
  }

  if (!params.type || params.type === "pr") {
    const rows = await db
      .select({
        id: purchaseRequests.id,
        number: purchaseRequests.prNumber,
        partyName: purchaseRequests.department,
        date: purchaseRequests.needDate,
        createdAt: purchaseRequests.createdAt,
        status: purchaseRequests.status,
      })
      .from(purchaseRequests)
      .where(
        query
          ? like(purchaseRequests.prNumber, `%${query}%`)
          : undefined
      )
      .orderBy(desc(purchaseRequests.createdAt));

    results.push(
      ...rows.map((row) => ({
        id: row.id,
        type: "pr" as const,
        number: row.number,
        partyName: row.partyName ?? "-",
        date: row.date ?? row.createdAt.slice(0, 10),
        status: row.status,
      }))
    );
  }

  return results.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export type DocumentLineItem = {
  description: string;
  quantity: number;
  price: number;
};

export type DocumentDetail = DocumentSummary & {
  items?: DocumentLineItem[];
  tax?: number;
  discount?: number;
  content?: string;
  instructions?: string;
  notes?: string;
};

/**
 * Server Action untuk mengambil detail satu dokumen (invoice, PO, atau memo) berdasarkan
 * id-nya. Id dokumen adalah UUID unik per tabel sehingga aman dicari di ketiga tabel.
 */
export async function getDocumentAction(id: string): Promise<DocumentDetail | null> {
  await requireSessionUser();
  const [invoice] = await db
    .select()
    .from(invoices)
    .where(eq(invoices.id, id))
    .limit(1);

  if (invoice) {
    const items = await db
      .select()
      .from(invoiceItems)
      .where(eq(invoiceItems.invoiceId, id));

    const customer = invoice.customerId
      ? ((
          await db
            .select({ name: customers.name })
            .from(customers)
            .where(eq(customers.id, invoice.customerId))
            .limit(1)
        )[0] ?? null)
      : null;

    return {
      id: invoice.id,
      type: "invoice",
      number: invoice.invoiceNumber,
      partyName: customer?.name ?? "-",
      date: invoice.issueDate,
      status: invoice.status,
      items: items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      })),
      tax: invoice.tax,
      discount: invoice.discount,
      notes: invoice.notes ?? undefined,
    };
  }

  const [po] = await db
    .select()
    .from(purchaseOrders)
    .where(eq(purchaseOrders.id, id))
    .limit(1);

  if (po) {
    const items = await db.select().from(poItems).where(eq(poItems.poId, id));

    const supplier = po.supplierId
      ? ((
          await db
            .select({ name: suppliers.name })
            .from(suppliers)
            .where(eq(suppliers.id, po.supplierId))
            .limit(1)
        )[0] ?? null)
      : null;

    return {
      id: po.id,
      type: "po",
      number: po.poNumber,
      partyName: supplier?.name ?? "-",
      date: po.orderDate,
      status: po.status,
      items: items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      })),
      tax: po.tax,
      discount: po.discount,
      notes: po.notes ?? undefined,
    };
  }

  const [grn] = await db
    .select()
    .from(goodsReceipts)
    .where(eq(goodsReceipts.id, id))
    .limit(1);

  if (grn) {
    const items = await db.select().from(grnItems).where(eq(grnItems.grnId, id));

    const supplier = grn.supplierId
      ? ((
          await db
            .select({ name: suppliers.name })
            .from(suppliers)
            .where(eq(suppliers.id, grn.supplierId))
            .limit(1)
        )[0] ?? null)
      : null;

    return {
      id: grn.id,
      type: "grn",
      number: grn.grnNumber,
      partyName: supplier?.name ?? "-",
      date: grn.receiptDate,
      status: grn.status,
      items: items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      })),
      notes: grn.notes ?? undefined,
    };
  }

  const [memo] = await db.select().from(memos).where(eq(memos.id, id)).limit(1);

  if (memo) {
    return {
      id: memo.id,
      type: "memo",
      number: memo.subject,
      partyName: memo.recipientName,
      date: memo.memoDate,
      status: memo.status,
      content: memo.content,
      instructions: memo.instructions ?? undefined,
    };
  }

  const [pr] = await db
    .select()
    .from(purchaseRequests)
    .where(eq(purchaseRequests.id, id))
    .limit(1);

  if (pr) {
    const items = await db
      .select()
      .from(prItems)
      .where(eq(prItems.prId, id));

    return {
      id: pr.id,
      type: "pr",
      number: pr.prNumber,
      partyName: pr.department ?? "-",
      date: pr.needDate ?? pr.createdAt.slice(0, 10),
      status: pr.status,
      items: items.map((item) => ({
        description: item.spec
          ? `${item.description} (${item.spec})`
          : item.description,
        quantity: item.quantity,
        price: item.estPrice,
      })),
      notes: pr.notes ?? undefined,
    };
  }

  return null;
}
