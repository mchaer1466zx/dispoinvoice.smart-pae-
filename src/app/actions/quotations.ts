"use server";

import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { quotations, quotationItems } from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";
import { createNotification } from "@/lib/notify";
import { recordAudit } from "@/lib/audit";
import { generateQuotationNumberAction } from "@/app/actions/numbering";

export type QuotationStatus =
  | "draft"
  | "terkirim"
  | "diterima"
  | "ditolak"
  | "dibatalkan";

export type QuotationItemInput = {
  group: string;
  description: string;
  spec: string;
  quantity: number;
  unit: string;
  price: number;
};

export type QuotationInput = {
  quotationNumber: string;
  quotationDate: string;
  status: QuotationStatus;
  validUntil: string;
  tax: number;
  discount: number;
  notes: string;
  customerId: string | null;
  companyId: string | null;
  items: QuotationItemInput[];
};

export type QuotationItemRecord = {
  id: string;
  group: string;
  description: string;
  spec: string;
  quantity: number;
  unit: string;
  price: number;
};

export type QuotationRecord = {
  id: string;
  quotationNumber: string;
  quotationDate: string;
  status: QuotationStatus;
  validUntil: string | null;
  tax: number;
  discount: number;
  notes: string | null;
  customerId: string | null;
  companyId: string | null;
  createdAt: string;
};

export type QuotationWithItems = QuotationRecord & {
  items: QuotationItemRecord[];
};

export type QuotationActionResult =
  | { success: true; quotation: QuotationWithItems }
  | { success: false; error: string };

export type DeleteQuotationResult =
  | { success: true }
  | { success: false; error: string };

const QUOTATION_COLUMNS = {
  id: quotations.id,
  quotationNumber: quotations.quotationNumber,
  quotationDate: quotations.quotationDate,
  status: quotations.status,
  validUntil: quotations.validUntil,
  tax: quotations.tax,
  discount: quotations.discount,
  notes: quotations.notes,
  customerId: quotations.customerId,
  companyId: quotations.companyId,
  createdAt: quotations.createdAt,
};

const QUOTATION_ITEM_COLUMNS = {
  id: quotationItems.id,
  groupLabel: quotationItems.groupLabel,
  description: quotationItems.description,
  spec: quotationItems.spec,
  quantity: quotationItems.quantity,
  unit: quotationItems.unit,
  price: quotationItems.price,
};

/** Memetakan baris item DB (groupLabel/spec/unit nullable) ke QuotationItemRecord. */
function toItemRecord(row: {
  id: string;
  groupLabel: string | null;
  description: string;
  spec: string | null;
  quantity: number;
  unit: string | null;
  price: number;
}): QuotationItemRecord {
  return {
    id: row.id,
    group: row.groupLabel ?? "",
    description: row.description,
    spec: row.spec ?? "",
    quantity: row.quantity,
    unit: row.unit ?? "",
    price: row.price,
  };
}

function validateInput(input: QuotationInput): string | null {
  if (!input.quotationNumber.trim()) {
    return "Nomor penawaran wajib diisi.";
  }
  if (!input.items.some((item) => item.description.trim())) {
    return "Minimal satu item dengan deskripsi wajib diisi.";
  }
  return null;
}

/** Server Action untuk mengambil daftar quotation, dipakai pada halaman riwayat. */
export async function listQuotationsAction(): Promise<QuotationRecord[]> {
  await requireSessionUser();
  return db
    .select(QUOTATION_COLUMNS)
    .from(quotations)
    .orderBy(asc(quotations.quotationNumber));
}

/** Server Action untuk mengambil satu quotation beserta item-itemnya. */
export async function getQuotationAction(
  id: string
): Promise<QuotationWithItems | null> {
  const [quotation] = await db
    .select(QUOTATION_COLUMNS)
    .from(quotations)
    .where(eq(quotations.id, id))
    .limit(1);

  if (!quotation) return null;

  const items = await db
    .select(QUOTATION_ITEM_COLUMNS)
    .from(quotationItems)
    .where(eq(quotationItems.quotationId, id));

  return { ...quotation, items: items.map(toItemRecord) };
}

/** Server Action untuk menyimpan quotation baru beserta item-itemnya. */
export async function createQuotationAction(
  input: QuotationInput
): Promise<QuotationActionResult> {
  const user = await requireSessionUser();
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const quotation = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(quotations)
        .values({
          userId: user.id,
          quotationNumber: input.quotationNumber,
          quotationDate: input.quotationDate,
          status: input.status,
          validUntil: input.validUntil || null,
          tax: input.tax,
          discount: input.discount,
          notes: input.notes || null,
          customerId: input.customerId,
          companyId: input.companyId,
        })
        .returning(QUOTATION_COLUMNS);

      const items = await tx
        .insert(quotationItems)
        .values(
          input.items.map((item) => ({
            quotationId: created.id,
            groupLabel: item.group || null,
            description: item.description,
            spec: item.spec || null,
            quantity: item.quantity,
            unit: item.unit || null,
            price: item.price,
          }))
        )
        .returning(QUOTATION_ITEM_COLUMNS);

      return { ...created, items: items.map(toItemRecord) };
    });

    await recordAudit({
      entityType: "quotation",
      entityId: quotation.id,
      action: "create",
      actorUserId: user.id,
    });

    return { success: true, quotation };
  } catch {
    return { success: false, error: "Gagal menyimpan quotation ke database." };
  }
}

/** Server Action untuk mengubah quotation (item lama diganti seluruhnya). */
export async function updateQuotationAction(
  id: string,
  input: QuotationInput
): Promise<QuotationActionResult> {
  await requireSessionUser();
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const quotation = await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(quotations)
        .set({
          quotationNumber: input.quotationNumber,
          quotationDate: input.quotationDate,
          status: input.status,
          validUntil: input.validUntil || null,
          tax: input.tax,
          discount: input.discount,
          notes: input.notes || null,
          customerId: input.customerId,
          companyId: input.companyId,
        })
        .where(eq(quotations.id, id))
        .returning(QUOTATION_COLUMNS);

      if (!updated) return null;

      await tx.delete(quotationItems).where(eq(quotationItems.quotationId, id));

      const items = await tx
        .insert(quotationItems)
        .values(
          input.items.map((item) => ({
            quotationId: updated.id,
            groupLabel: item.group || null,
            description: item.description,
            spec: item.spec || null,
            quantity: item.quantity,
            unit: item.unit || null,
            price: item.price,
          }))
        )
        .returning(QUOTATION_ITEM_COLUMNS);

      return { ...updated, items: items.map(toItemRecord) };
    });

    if (!quotation) {
      return { success: false, error: "Quotation tidak ditemukan." };
    }

    return { success: true, quotation };
  } catch {
    return { success: false, error: "Gagal mengubah quotation." };
  }
}

export const QUOTATION_STATUS_LABELS: Record<QuotationStatus, string> = {
  draft: "Draft",
  terkirim: "Terkirim",
  diterima: "Diterima",
  ditolak: "Ditolak",
  dibatalkan: "Dibatalkan",
};

export type UpdateQuotationStatusResult =
  | { success: true }
  | { success: false; error: string };

/** Server Action untuk mengubah status quotation; memicu notifikasi bila berubah. */
export async function updateQuotationStatusAction(
  quotationId: string,
  newStatus: QuotationStatus
): Promise<UpdateQuotationStatusResult> {
  const user = await requireSessionUser();

  const [quotation] = await db
    .select({
      id: quotations.id,
      quotationNumber: quotations.quotationNumber,
      status: quotations.status,
      userId: quotations.userId,
    })
    .from(quotations)
    .where(eq(quotations.id, quotationId))
    .limit(1);

  if (!quotation) {
    return { success: false, error: "Quotation tidak ditemukan." };
  }

  if (quotation.status === newStatus) {
    return { success: true };
  }

  try {
    await db
      .update(quotations)
      .set({ status: newStatus })
      .where(eq(quotations.id, quotationId));
  } catch {
    return { success: false, error: "Gagal memperbarui status quotation." };
  }

  await createNotification({
    userId: quotation.userId ?? user.id,
    type: "quotation_status",
    title: `Penawaran ${quotation.quotationNumber} → ${QUOTATION_STATUS_LABELS[newStatus]}`,
    docType: "quotation",
    docId: quotation.id,
  });

  await recordAudit({
    entityType: "quotation",
    entityId: quotation.id,
    action: "update",
    actorUserId: user.id,
    changes: { status: { from: quotation.status, to: newStatus } },
  });

  return { success: true };
}

export type DuplicateQuotationResult =
  | { success: true; quotationId: string }
  | { success: false; error: string };

/** Server Action "Duplikat" (Copy as New) untuk quotation. */
export async function duplicateQuotationAction(
  sourceId: string
): Promise<DuplicateQuotationResult> {
  const user = await requireSessionUser();

  const [source] = await db
    .select()
    .from(quotations)
    .where(eq(quotations.id, sourceId))
    .limit(1);

  if (!source) {
    return { success: false, error: "Quotation tidak ditemukan." };
  }

  const items = await db
    .select()
    .from(quotationItems)
    .where(eq(quotationItems.quotationId, sourceId));

  const newNumber = await generateQuotationNumberAction();
  const today = new Date().toISOString().slice(0, 10);

  try {
    const quotationId = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(quotations)
        .values({
          userId: user.id,
          quotationNumber: newNumber,
          status: "draft",
          quotationDate: today,
          validUntil: source.validUntil,
          tax: source.tax,
          discount: source.discount,
          notes: source.notes,
          customerId: source.customerId,
          companyId: source.companyId,
          parentId: source.id,
        })
        .returning({ id: quotations.id });

      if (items.length > 0) {
        await tx.insert(quotationItems).values(
          items.map((item) => ({
            quotationId: created.id,
            groupLabel: item.groupLabel,
            description: item.description,
            spec: item.spec,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
          }))
        );
      }

      return created.id;
    });

    return { success: true, quotationId };
  } catch {
    return { success: false, error: "Gagal menduplikasi quotation." };
  }
}

/** Server Action untuk menghapus quotation; item terkait ikut terhapus (cascade). */
export async function deleteQuotationAction(
  id: string
): Promise<DeleteQuotationResult> {
  await requireSessionUser();
  const [deleted] = await db
    .delete(quotations)
    .where(eq(quotations.id, id))
    .returning({ id: quotations.id });

  if (!deleted) {
    return { success: false, error: "Quotation tidak ditemukan." };
  }

  return { success: true };
}
