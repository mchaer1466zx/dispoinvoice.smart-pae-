"use server";

import { like } from "drizzle-orm";
import { db } from "@/db";
import { invoices, purchaseOrders, purchaseRequests } from "@/db/schema";

/** Cari nomor urut berikutnya dari daftar nomor yang berbagi prefix sama. */
function nextSequence(numbers: string[], prefix: string): number {
  let max = 0;
  for (const value of numbers) {
    if (!value.startsWith(prefix)) continue;
    const parsed = Number.parseInt(value.slice(prefix.length), 10);
    if (!Number.isNaN(parsed) && parsed > max) max = parsed;
  }
  return max + 1;
}

/**
 * Server Action untuk menghasilkan nomor invoice unik berikutnya dengan format
 * INV/[TAHUN]/[BULAN]/[URUT] (urut per bulan berjalan). Menghindari duplikasi
 * dengan mengambil nomor urut tertinggi yang sudah ada untuk bulan ini.
 */
export async function generateInvoiceNumberAction(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const prefix = `INV/${year}/${month}/`;

  const rows = await db
    .select({ invoiceNumber: invoices.invoiceNumber })
    .from(invoices)
    .where(like(invoices.invoiceNumber, `${prefix}%`));

  const seq = nextSequence(
    rows.map((row) => row.invoiceNumber),
    prefix
  );
  return `${prefix}${String(seq).padStart(3, "0")}`;
}

/**
 * Server Action untuk menghasilkan nomor purchase order unik berikutnya dengan
 * format PO/[TAHUN]/[URUT] (urut per tahun berjalan).
 */
export async function generatePurchaseOrderNumberAction(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const prefix = `PO/${year}/`;

  const rows = await db
    .select({ poNumber: purchaseOrders.poNumber })
    .from(purchaseOrders)
    .where(like(purchaseOrders.poNumber, `${prefix}%`));

  const seq = nextSequence(
    rows.map((row) => row.poNumber),
    prefix
  );
  return `${prefix}${String(seq).padStart(3, "0")}`;
}

/**
 * Server Action untuk menghasilkan nomor Purchase Request unik berikutnya dengan
 * format PR/[TAHUN]/[URUT] (urut per tahun berjalan).
 */
export async function generatePurchaseRequestNumberAction(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const prefix = `PR/${year}/`;

  const rows = await db
    .select({ prNumber: purchaseRequests.prNumber })
    .from(purchaseRequests)
    .where(like(purchaseRequests.prNumber, `${prefix}%`));

  const seq = nextSequence(
    rows.map((row) => row.prNumber),
    prefix
  );
  return `${prefix}${String(seq).padStart(3, "0")}`;
}
