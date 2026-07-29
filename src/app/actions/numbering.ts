"use server";

import { like } from "drizzle-orm";
import { db } from "@/db";
import {
  goodsReceipts,
  invoices,
  purchaseOrders,
  purchaseRequests,
} from "@/db/schema";
import {
  buildDocPrefix,
  getCompanyTheme,
  type CompanyId,
} from "@/config/company-themes";

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

function currentPrefix(pattern: string): string {
  const now = new Date();
  return buildDocPrefix(pattern, now.getFullYear(), now.getMonth() + 1);
}

/**
 * Server Action nomor invoice berikutnya, format dari tema perusahaan
 * (mis. INV/KSP/YYYY/MM/XXX). Urut per bulan & per perusahaan, anti-duplikat.
 */
export async function generateInvoiceNumberAction(
  companyId?: CompanyId
): Promise<string> {
  const prefix = currentPrefix(getCompanyTheme(companyId).docFormat.invoice);
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
 * Server Action nomor purchase order berikutnya, format dari tema perusahaan
 * (mis. PO/KSP/YYYY/MM/XXX). Urut per bulan & per perusahaan.
 */
export async function generatePurchaseOrderNumberAction(
  companyId?: CompanyId
): Promise<string> {
  const prefix = currentPrefix(getCompanyTheme(companyId).docFormat.po);
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
 * Server Action nomor Goods Receipt Note berikutnya, format dari tema
 * perusahaan (mis. GRN/KSP/YYYY/MM/XXX). Urut per bulan & per perusahaan.
 */
export async function generateGoodsReceiptNumberAction(
  companyId?: CompanyId
): Promise<string> {
  const prefix = currentPrefix(getCompanyTheme(companyId).docFormat.grn);
  const rows = await db
    .select({ grnNumber: goodsReceipts.grnNumber })
    .from(goodsReceipts)
    .where(like(goodsReceipts.grnNumber, `${prefix}%`));

  const seq = nextSequence(
    rows.map((row) => row.grnNumber),
    prefix
  );
  return `${prefix}${String(seq).padStart(3, "0")}`;
}

/**
 * Server Action nomor Purchase Request berikutnya, format dari tema perusahaan
 * (mis. PR/KSP/YYYY/MM/XXX). Urut per bulan & per perusahaan.
 */
export async function generatePurchaseRequestNumberAction(
  companyId?: CompanyId
): Promise<string> {
  const prefix = currentPrefix(getCompanyTheme(companyId).docFormat.pr);
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
