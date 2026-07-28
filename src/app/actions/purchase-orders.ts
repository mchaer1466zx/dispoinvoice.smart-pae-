"use server";

import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { purchaseOrders, poItems } from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";
import { createNotification } from "@/lib/notify";
import { recordAudit } from "@/lib/audit";
import { generatePurchaseOrderNumberAction } from "@/app/actions/numbering";

export type PoStatus = "draft" | "dikirim" | "selesai" | "dibatalkan";

export type PurchaseOrderItemInput = {
  description: string;
  quantity: number;
  price: number;
};

export type PurchaseOrderInput = {
  poNumber: string;
  orderDate: string;
  status: PoStatus;
  tax: number;
  discount: number;
  notes: string;
  supplierId: string | null;
  companyId: string | null;
  items: PurchaseOrderItemInput[];
};

export type PurchaseOrderItemRecord = {
  id: string;
  description: string;
  quantity: number;
  price: number;
};

export type PurchaseOrderRecord = {
  id: string;
  poNumber: string;
  orderDate: string;
  status: PoStatus;
  tax: number;
  discount: number;
  notes: string | null;
  supplierId: string | null;
  companyId: string | null;
  createdAt: string;
};

export type PurchaseOrderWithItems = PurchaseOrderRecord & {
  items: PurchaseOrderItemRecord[];
};

export type PurchaseOrderActionResult =
  | { success: true; purchaseOrder: PurchaseOrderWithItems }
  | { success: false; error: string };

export type DeletePurchaseOrderResult =
  | { success: true }
  | { success: false; error: string };

const PO_COLUMNS = {
  id: purchaseOrders.id,
  poNumber: purchaseOrders.poNumber,
  orderDate: purchaseOrders.orderDate,
  status: purchaseOrders.status,
  tax: purchaseOrders.tax,
  discount: purchaseOrders.discount,
  notes: purchaseOrders.notes,
  supplierId: purchaseOrders.supplierId,
  companyId: purchaseOrders.companyId,
  createdAt: purchaseOrders.createdAt,
};

const PO_ITEM_COLUMNS = {
  id: poItems.id,
  description: poItems.description,
  quantity: poItems.quantity,
  price: poItems.price,
};

function validateInput(input: PurchaseOrderInput): string | null {
  if (!input.poNumber.trim()) {
    return "Nomor PO wajib diisi.";
  }
  if (!input.items.some((item) => item.description.trim())) {
    return "Minimal satu item dengan deskripsi wajib diisi.";
  }
  return null;
}

/** Server Action untuk mengambil daftar purchase order, dipakai pada halaman riwayat. */
export async function listPurchaseOrdersAction(): Promise<PurchaseOrderRecord[]> {
  await requireSessionUser();
  return db
    .select(PO_COLUMNS)
    .from(purchaseOrders)
    .orderBy(asc(purchaseOrders.poNumber));
}

/** Server Action untuk mengambil satu purchase order beserta item-itemnya. */
export async function getPurchaseOrderAction(
  id: string
): Promise<PurchaseOrderWithItems | null> {
  const [po] = await db
    .select(PO_COLUMNS)
    .from(purchaseOrders)
    .where(eq(purchaseOrders.id, id))
    .limit(1);

  if (!po) return null;

  const items = await db
    .select(PO_ITEM_COLUMNS)
    .from(poItems)
    .where(eq(poItems.poId, id));

  return { ...po, items };
}

/** Server Action untuk menyimpan purchase order baru beserta item-itemnya ke database. */
export async function createPurchaseOrderAction(
  input: PurchaseOrderInput
): Promise<PurchaseOrderActionResult> {
  const user = await requireSessionUser();
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const purchaseOrder = await db.transaction(async (tx) => {
      const [po] = await tx
        .insert(purchaseOrders)
        .values({
          userId: user.id,
          poNumber: input.poNumber,
          orderDate: input.orderDate,
          status: input.status,
          tax: input.tax,
          discount: input.discount,
          notes: input.notes || null,
          supplierId: input.supplierId,
          companyId: input.companyId,
        })
        .returning(PO_COLUMNS);

      const items = await tx
        .insert(poItems)
        .values(
          input.items.map((item) => ({
            poId: po.id,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          }))
        )
        .returning(PO_ITEM_COLUMNS);

      return { ...po, items };
    });

    await recordAudit({
      entityType: "po",
      entityId: purchaseOrder.id,
      action: "create",
      actorUserId: user.id,
    });

    return { success: true, purchaseOrder };
  } catch {
    return { success: false, error: "Gagal menyimpan purchase order ke database." };
  }
}

/** Server Action untuk mengubah purchase order beserta item-itemnya (item lama diganti seluruhnya). */
export async function updatePurchaseOrderAction(
  id: string,
  input: PurchaseOrderInput
): Promise<PurchaseOrderActionResult> {
  await requireSessionUser();
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const purchaseOrder = await db.transaction(async (tx) => {
      const [po] = await tx
        .update(purchaseOrders)
        .set({
          poNumber: input.poNumber,
          orderDate: input.orderDate,
          status: input.status,
          tax: input.tax,
          discount: input.discount,
          notes: input.notes || null,
          supplierId: input.supplierId,
          companyId: input.companyId,
        })
        .where(eq(purchaseOrders.id, id))
        .returning(PO_COLUMNS);

      if (!po) return null;

      await tx.delete(poItems).where(eq(poItems.poId, id));

      const items = await tx
        .insert(poItems)
        .values(
          input.items.map((item) => ({
            poId: po.id,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          }))
        )
        .returning(PO_ITEM_COLUMNS);

      return { ...po, items };
    });

    if (!purchaseOrder) {
      return { success: false, error: "Purchase order tidak ditemukan." };
    }

    return { success: true, purchaseOrder };
  } catch {
    return { success: false, error: "Gagal mengubah purchase order." };
  }
}

const PO_STATUS_LABELS: Record<PoStatus, string> = {
  draft: "Draft",
  dikirim: "Dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export type UpdatePurchaseOrderStatusResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Server Action untuk mengubah status purchase order (mis. draft → selesai).
 * Memicu notifikasi in-app `po_status` HANYA bila status benar-benar berubah,
 * mengikuti pola updateInvoiceStatusAction. Kegagalan notifikasi tidak
 * memengaruhi hasil pembaruan status.
 */
export async function updatePurchaseOrderStatusAction(
  poId: string,
  newStatus: PoStatus
): Promise<UpdatePurchaseOrderStatusResult> {
  const user = await requireSessionUser();

  const [po] = await db
    .select({
      id: purchaseOrders.id,
      poNumber: purchaseOrders.poNumber,
      status: purchaseOrders.status,
      userId: purchaseOrders.userId,
    })
    .from(purchaseOrders)
    .where(eq(purchaseOrders.id, poId))
    .limit(1);

  if (!po) {
    return { success: false, error: "Purchase order tidak ditemukan." };
  }

  // Tidak ada perubahan → sukses tanpa notifikasi.
  if (po.status === newStatus) {
    return { success: true };
  }

  try {
    await db
      .update(purchaseOrders)
      .set({ status: newStatus })
      .where(eq(purchaseOrders.id, poId));
  } catch {
    return { success: false, error: "Gagal memperbarui status purchase order." };
  }

  await createNotification({
    userId: po.userId ?? user.id,
    type: "po_status",
    title: `PO ${po.poNumber} → ${PO_STATUS_LABELS[newStatus]}`,
    docType: "po",
    docId: po.id,
  });

  await recordAudit({
    entityType: "po",
    entityId: po.id,
    action: "update",
    actorUserId: user.id,
    changes: { status: { from: po.status, to: newStatus } },
  });

  return { success: true };
}

export type DuplicatePurchaseOrderResult =
  | { success: true; purchaseOrderId: string }
  | { success: false; error: string };

/**
 * Server Action "Duplikat" (Copy as New) untuk purchase order: membuat PO baru
 * dari PO lama. Salinan berstatus `draft`, memakai nomor urut baru & tanggal
 * pemesanan hari ini, mencatat parentId, serta menyalin pemasok, perusahaan,
 * pajak, diskon, catatan, dan item.
 */
export async function duplicatePurchaseOrderAction(
  sourceId: string
): Promise<DuplicatePurchaseOrderResult> {
  const user = await requireSessionUser();

  const [source] = await db
    .select()
    .from(purchaseOrders)
    .where(eq(purchaseOrders.id, sourceId))
    .limit(1);

  if (!source) {
    return { success: false, error: "Purchase order tidak ditemukan." };
  }

  const items = await db
    .select()
    .from(poItems)
    .where(eq(poItems.poId, sourceId));

  const newNumber = await generatePurchaseOrderNumberAction();
  const today = new Date().toISOString().slice(0, 10);

  try {
    const purchaseOrderId = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(purchaseOrders)
        .values({
          userId: user.id,
          poNumber: newNumber,
          status: "draft",
          orderDate: today,
          tax: source.tax,
          discount: source.discount,
          notes: source.notes,
          supplierId: source.supplierId,
          companyId: source.companyId,
          parentId: source.id,
        })
        .returning({ id: purchaseOrders.id });

      if (items.length > 0) {
        await tx.insert(poItems).values(
          items.map((item) => ({
            poId: created.id,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          }))
        );
      }

      return created.id;
    });

    return { success: true, purchaseOrderId };
  } catch {
    return { success: false, error: "Gagal menduplikasi purchase order." };
  }
}

/** Server Action untuk menghapus purchase order; item terkait ikut terhapus (cascade). */
export async function deletePurchaseOrderAction(
  id: string
): Promise<DeletePurchaseOrderResult> {
  await requireSessionUser();
  const [deleted] = await db
    .delete(purchaseOrders)
    .where(eq(purchaseOrders.id, id))
    .returning({ id: purchaseOrders.id });

  if (!deleted) {
    return { success: false, error: "Purchase order tidak ditemukan." };
  }

  return { success: true };
}
