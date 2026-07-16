"use server";

import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { purchaseOrders, poItems } from "@/db/schema";

export type PoStatus = "draft" | "dikirim" | "selesai";

export type PurchaseOrderItemInput = {
  description: string;
  quantity: number;
  price: number;
};

export type PurchaseOrderInput = {
  poNumber: string;
  orderDate: string;
  status: PoStatus;
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
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const purchaseOrder = await db.transaction(async (tx) => {
      const [po] = await tx
        .insert(purchaseOrders)
        .values({
          poNumber: input.poNumber,
          orderDate: input.orderDate,
          status: input.status,
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

/** Server Action untuk menghapus purchase order; item terkait ikut terhapus (cascade). */
export async function deletePurchaseOrderAction(
  id: string
): Promise<DeletePurchaseOrderResult> {
  const [deleted] = await db
    .delete(purchaseOrders)
    .where(eq(purchaseOrders.id, id))
    .returning({ id: purchaseOrders.id });

  if (!deleted) {
    return { success: false, error: "Purchase order tidak ditemukan." };
  }

  return { success: true };
}
