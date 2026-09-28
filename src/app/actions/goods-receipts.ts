"use server";

import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { goodsReceipts, grnItems } from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";
import { createNotification } from "@/lib/notify";
import { recordAudit } from "@/lib/audit";
import { generateGoodsReceiptNumberAction } from "@/app/actions/numbering";

export type GrnStatus =
  | "draft"
  | "diterima"
  | "sebagian"
  | "ditolak"
  | "dibatalkan";

export type GoodsReceiptItemInput = {
  group: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
};

export type GoodsReceiptInput = {
  grnNumber: string;
  receiptDate: string;
  status: GrnStatus;
  poReference: string;
  notes: string;
  supplierId: string | null;
  companyId: string | null;
  items: GoodsReceiptItemInput[];
};

export type GoodsReceiptItemRecord = {
  id: string;
  group: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
};

export type GoodsReceiptRecord = {
  id: string;
  grnNumber: string;
  receiptDate: string;
  status: GrnStatus;
  poReference: string | null;
  notes: string | null;
  supplierId: string | null;
  companyId: string | null;
  createdAt: string;
};

export type GoodsReceiptWithItems = GoodsReceiptRecord & {
  items: GoodsReceiptItemRecord[];
};

export type GoodsReceiptActionResult =
  | { success: true; goodsReceipt: GoodsReceiptWithItems }
  | { success: false; error: string };

export type DeleteGoodsReceiptResult =
  | { success: true }
  | { success: false; error: string };

const GRN_COLUMNS = {
  id: goodsReceipts.id,
  grnNumber: goodsReceipts.grnNumber,
  receiptDate: goodsReceipts.receiptDate,
  status: goodsReceipts.status,
  poReference: goodsReceipts.poReference,
  notes: goodsReceipts.notes,
  supplierId: goodsReceipts.supplierId,
  companyId: goodsReceipts.companyId,
  createdAt: goodsReceipts.createdAt,
};

const GRN_ITEM_COLUMNS = {
  id: grnItems.id,
  groupLabel: grnItems.groupLabel,
  description: grnItems.description,
  quantity: grnItems.quantity,
  unit: grnItems.unit,
  price: grnItems.price,
};

/** Memetakan baris item DB (groupLabel/unit nullable) ke GoodsReceiptItemRecord. */
function toItemRecord(row: {
  id: string;
  groupLabel: string | null;
  description: string;
  quantity: number;
  unit: string | null;
  price: number;
}): GoodsReceiptItemRecord {
  return {
    id: row.id,
    group: row.groupLabel ?? "",
    description: row.description,
    quantity: row.quantity,
    unit: row.unit ?? "",
    price: row.price,
  };
}

function validateInput(input: GoodsReceiptInput): string | null {
  if (!input.grnNumber.trim()) {
    return "Nomor GRN wajib diisi.";
  }
  if (!input.items.some((item) => item.description.trim())) {
    return "Minimal satu item dengan deskripsi wajib diisi.";
  }
  return null;
}

/** Server Action untuk mengambil daftar goods receipt, dipakai pada halaman riwayat. */
export async function listGoodsReceiptsAction(): Promise<GoodsReceiptRecord[]> {
  await requireSessionUser();
  return db
    .select(GRN_COLUMNS)
    .from(goodsReceipts)
    .orderBy(asc(goodsReceipts.grnNumber));
}

/** Server Action untuk mengambil satu goods receipt beserta item-itemnya. */
export async function getGoodsReceiptAction(
  id: string
): Promise<GoodsReceiptWithItems | null> {
  const [grn] = await db
    .select(GRN_COLUMNS)
    .from(goodsReceipts)
    .where(eq(goodsReceipts.id, id))
    .limit(1);

  if (!grn) return null;

  const items = await db
    .select(GRN_ITEM_COLUMNS)
    .from(grnItems)
    .where(eq(grnItems.grnId, id));

  return { ...grn, items: items.map(toItemRecord) };
}

/** Server Action untuk menyimpan goods receipt baru beserta item-itemnya. */
export async function createGoodsReceiptAction(
  input: GoodsReceiptInput
): Promise<GoodsReceiptActionResult> {
  const user = await requireSessionUser();
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const goodsReceipt = await db.transaction(async (tx) => {
      const [grn] = await tx
        .insert(goodsReceipts)
        .values({
          userId: user.id,
          grnNumber: input.grnNumber,
          receiptDate: input.receiptDate,
          status: input.status,
          poReference: input.poReference || null,
          notes: input.notes || null,
          supplierId: input.supplierId,
          companyId: input.companyId,
        })
        .returning(GRN_COLUMNS);

      const items = await tx
        .insert(grnItems)
        .values(
          input.items.map((item) => ({
            grnId: grn.id,
            groupLabel: item.group || null,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit || null,
            price: item.price,
          }))
        )
        .returning(GRN_ITEM_COLUMNS);

      return { ...grn, items: items.map(toItemRecord) };
    });

    await recordAudit({
      entityType: "grn",
      entityId: goodsReceipt.id,
      action: "create",
      actorUserId: user.id,
    });

    return { success: true, goodsReceipt };
  } catch {
    return { success: false, error: "Gagal menyimpan goods receipt ke database." };
  }
}

/** Server Action untuk mengubah goods receipt (item lama diganti seluruhnya). */
export async function updateGoodsReceiptAction(
  id: string,
  input: GoodsReceiptInput
): Promise<GoodsReceiptActionResult> {
  await requireSessionUser();
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const goodsReceipt = await db.transaction(async (tx) => {
      const [grn] = await tx
        .update(goodsReceipts)
        .set({
          grnNumber: input.grnNumber,
          receiptDate: input.receiptDate,
          status: input.status,
          poReference: input.poReference || null,
          notes: input.notes || null,
          supplierId: input.supplierId,
          companyId: input.companyId,
        })
        .where(eq(goodsReceipts.id, id))
        .returning(GRN_COLUMNS);

      if (!grn) return null;

      await tx.delete(grnItems).where(eq(grnItems.grnId, id));

      const items = await tx
        .insert(grnItems)
        .values(
          input.items.map((item) => ({
            grnId: grn.id,
            groupLabel: item.group || null,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit || null,
            price: item.price,
          }))
        )
        .returning(GRN_ITEM_COLUMNS);

      return { ...grn, items: items.map(toItemRecord) };
    });

    if (!goodsReceipt) {
      return { success: false, error: "Goods receipt tidak ditemukan." };
    }

    return { success: true, goodsReceipt };
  } catch {
    return { success: false, error: "Gagal mengubah goods receipt." };
  }
}

export const GRN_STATUS_LABELS: Record<GrnStatus, string> = {
  draft: "Draft",
  diterima: "Diterima",
  sebagian: "Diterima Sebagian",
  ditolak: "Ditolak",
  dibatalkan: "Dibatalkan",
};

export type UpdateGoodsReceiptStatusResult =
  | { success: true }
  | { success: false; error: string };

/** Server Action untuk mengubah status goods receipt; memicu notifikasi bila berubah. */
export async function updateGoodsReceiptStatusAction(
  grnId: string,
  newStatus: GrnStatus
): Promise<UpdateGoodsReceiptStatusResult> {
  const user = await requireSessionUser();

  const [grn] = await db
    .select({
      id: goodsReceipts.id,
      grnNumber: goodsReceipts.grnNumber,
      status: goodsReceipts.status,
      userId: goodsReceipts.userId,
    })
    .from(goodsReceipts)
    .where(eq(goodsReceipts.id, grnId))
    .limit(1);

  if (!grn) {
    return { success: false, error: "Goods receipt tidak ditemukan." };
  }

  if (grn.status === newStatus) {
    return { success: true };
  }

  try {
    await db
      .update(goodsReceipts)
      .set({ status: newStatus })
      .where(eq(goodsReceipts.id, grnId));
  } catch {
    return { success: false, error: "Gagal memperbarui status goods receipt." };
  }

  await createNotification({
    userId: grn.userId ?? user.id,
    type: "grn_status",
    title: `GRN ${grn.grnNumber} → ${GRN_STATUS_LABELS[newStatus]}`,
    docType: "grn",
    docId: grn.id,
  });

  await recordAudit({
    entityType: "grn",
    entityId: grn.id,
    action: "update",
    actorUserId: user.id,
    changes: { status: { from: grn.status, to: newStatus } },
  });

  return { success: true };
}

export type DuplicateGoodsReceiptResult =
  | { success: true; goodsReceiptId: string }
  | { success: false; error: string };

/** Server Action "Duplikat" (Copy as New) untuk goods receipt. */
export async function duplicateGoodsReceiptAction(
  sourceId: string
): Promise<DuplicateGoodsReceiptResult> {
  const user = await requireSessionUser();

  const [source] = await db
    .select()
    .from(goodsReceipts)
    .where(eq(goodsReceipts.id, sourceId))
    .limit(1);

  if (!source) {
    return { success: false, error: "Goods receipt tidak ditemukan." };
  }

  const items = await db
    .select()
    .from(grnItems)
    .where(eq(grnItems.grnId, sourceId));

  const newNumber = await generateGoodsReceiptNumberAction();
  const today = new Date().toISOString().slice(0, 10);

  try {
    const goodsReceiptId = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(goodsReceipts)
        .values({
          userId: user.id,
          grnNumber: newNumber,
          status: "draft",
          receiptDate: today,
          poReference: source.poReference,
          notes: source.notes,
          supplierId: source.supplierId,
          companyId: source.companyId,
          parentId: source.id,
        })
        .returning({ id: goodsReceipts.id });

      if (items.length > 0) {
        await tx.insert(grnItems).values(
          items.map((item) => ({
            grnId: created.id,
            groupLabel: item.groupLabel,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
          }))
        );
      }

      return created.id;
    });

    return { success: true, goodsReceiptId };
  } catch {
    return { success: false, error: "Gagal menduplikasi goods receipt." };
  }
}

/** Server Action untuk menghapus goods receipt; item terkait ikut terhapus (cascade). */
export async function deleteGoodsReceiptAction(
  id: string
): Promise<DeleteGoodsReceiptResult> {
  await requireSessionUser();
  const [deleted] = await db
    .delete(goodsReceipts)
    .where(eq(goodsReceipts.id, id))
    .returning({ id: goodsReceipts.id });

  if (!deleted) {
    return { success: false, error: "Goods receipt tidak ditemukan." };
  }

  return { success: true };
}
