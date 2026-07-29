"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  rfqs,
  rfqItems,
  purchaseRequests,
  prItems,
  purchaseOrders,
  poItems,
  quotations,
  quotationItems,
  invoices,
  invoiceItems,
} from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";
import { recordAudit } from "@/lib/audit";
import {
  generatePurchaseOrderNumberAction,
  generateInvoiceNumberAction,
} from "@/app/actions/numbering";
import { companyIdFromDocNumber } from "@/config/company-themes";

export type ConvertResult =
  | { success: true; id: string }
  | { success: false; error: string };

const today = () => new Date().toISOString().slice(0, 10);

/** Konversi RFQ → Purchase Order (draft). Menyalin pemasok, perusahaan, & item. */
export async function convertRfqToPoAction(rfqId: string): Promise<ConvertResult> {
  const user = await requireSessionUser();

  const [rfq] = await db.select().from(rfqs).where(eq(rfqs.id, rfqId)).limit(1);
  if (!rfq) return { success: false, error: "RFQ tidak ditemukan." };

  const items = await db.select().from(rfqItems).where(eq(rfqItems.rfqId, rfqId));
  const poNumber = await generatePurchaseOrderNumberAction(
    companyIdFromDocNumber(rfq.rfqNumber)
  );

  try {
    const id = await db.transaction(async (tx) => {
      const [po] = await tx
        .insert(purchaseOrders)
        .values({
          userId: user.id,
          poNumber,
          status: "draft",
          orderDate: today(),
          tax: 0,
          discount: 0,
          notes: rfq.notes,
          supplierId: rfq.supplierId,
          companyId: rfq.companyId,
          parentId: rfq.id,
        })
        .returning({ id: purchaseOrders.id });

      if (items.length > 0) {
        await tx.insert(poItems).values(
          items.map((it) => ({
            poId: po.id,
            groupLabel: it.groupLabel,
            description: it.description,
            quantity: it.quantity,
            unit: it.unit,
            price: it.price,
          }))
        );
      }
      return po.id;
    });

    await recordAudit({
      entityType: "po",
      entityId: id,
      action: "create",
      actorUserId: user.id,
      reason: `Konversi dari RFQ ${rfq.rfqNumber}`,
    });

    return { success: true, id };
  } catch {
    return { success: false, error: "Gagal mengonversi RFQ ke PO." };
  }
}

/** Konversi Purchase Request → Purchase Order (draft). Menyalin perusahaan & item. */
export async function convertPrToPoAction(prId: string): Promise<ConvertResult> {
  const user = await requireSessionUser();

  const [pr] = await db
    .select()
    .from(purchaseRequests)
    .where(eq(purchaseRequests.id, prId))
    .limit(1);
  if (!pr) return { success: false, error: "Purchase request tidak ditemukan." };

  const items = await db.select().from(prItems).where(eq(prItems.prId, prId));
  const poNumber = await generatePurchaseOrderNumberAction(
    companyIdFromDocNumber(pr.prNumber)
  );

  try {
    const id = await db.transaction(async (tx) => {
      const [po] = await tx
        .insert(purchaseOrders)
        .values({
          userId: user.id,
          poNumber,
          status: "draft",
          orderDate: today(),
          tax: 0,
          discount: 0,
          notes: pr.notes,
          supplierId: null,
          companyId: pr.companyId,
          parentId: pr.id,
        })
        .returning({ id: purchaseOrders.id });

      if (items.length > 0) {
        await tx.insert(poItems).values(
          items.map((it) => ({
            poId: po.id,
            groupLabel: it.groupLabel,
            description: it.spec ? `${it.description} (${it.spec})` : it.description,
            quantity: it.quantity,
            unit: it.unit,
            price: it.estPrice,
          }))
        );
      }
      return po.id;
    });

    await recordAudit({
      entityType: "po",
      entityId: id,
      action: "create",
      actorUserId: user.id,
      reason: `Konversi dari PR ${pr.prNumber}`,
    });

    return { success: true, id };
  } catch {
    return { success: false, error: "Gagal mengonversi PR ke PO." };
  }
}

/** Konversi Quotation → Invoice pelanggan (draft). Menyalin pelanggan, pajak, diskon, item. */
export async function convertQuotationToInvoiceAction(
  quotationId: string
): Promise<ConvertResult> {
  const user = await requireSessionUser();

  const [quotation] = await db
    .select()
    .from(quotations)
    .where(eq(quotations.id, quotationId))
    .limit(1);
  if (!quotation) return { success: false, error: "Penawaran tidak ditemukan." };

  const items = await db
    .select()
    .from(quotationItems)
    .where(eq(quotationItems.quotationId, quotationId));
  const invoiceNumber = await generateInvoiceNumberAction(
    companyIdFromDocNumber(quotation.quotationNumber)
  );

  try {
    const id = await db.transaction(async (tx) => {
      const [invoice] = await tx
        .insert(invoices)
        .values({
          userId: user.id,
          invoiceNumber,
          status: "draft",
          issueDate: today(),
          dueDate: quotation.validUntil,
          tax: quotation.tax,
          discount: quotation.discount,
          notes: quotation.notes,
          customerId: quotation.customerId,
          companyId: quotation.companyId,
          parentId: quotation.id,
        })
        .returning({ id: invoices.id });

      if (items.length > 0) {
        await tx.insert(invoiceItems).values(
          items.map((it) => ({
            invoiceId: invoice.id,
            description: it.spec ? `${it.description} (${it.spec})` : it.description,
            quantity: it.quantity,
            price: it.price,
          }))
        );
      }
      return invoice.id;
    });

    await recordAudit({
      entityType: "invoice",
      entityId: id,
      action: "create",
      actorUserId: user.id,
      reason: `Konversi dari Penawaran ${quotation.quotationNumber}`,
    });

    return { success: true, id };
  } catch {
    return { success: false, error: "Gagal mengonversi penawaran ke invoice." };
  }
}
