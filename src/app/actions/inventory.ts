"use server";

import { desc, eq, like, or, sql, and } from "drizzle-orm";
import { db } from "@/db";
import { inventoryItems, stockMovements } from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";
import { recordAudit } from "@/lib/audit";

export type StockMovementType = "masuk" | "keluar" | "penyesuaian";
export type StockReferenceType = "grn" | "invoice" | "po" | "manual";

export type InventoryItemRecord = {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  minStock: number;
  currentStock: number;
  costPrice: number;
  sellingPrice: number;
  description: string | null;
  companyId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StockMovementRecord = {
  id: string;
  inventoryItemId: string;
  type: StockMovementType;
  quantity: number;
  balanceAfter: number;
  referenceType: StockReferenceType;
  referenceId: string | null;
  notes: string | null;
  userId: string | null;
  createdAt: string;
  itemName?: string;
  itemSku?: string;
};

export type InventoryItemInput = {
  sku: string;
  name: string;
  category: string;
  unit: string;
  minStock: number;
  currentStock: number;
  costPrice: number;
  sellingPrice: number;
  description?: string;
  companyId?: string | null;
};

export type AdjustStockInput = {
  inventoryItemId: string;
  type: StockMovementType;
  quantity: number;
  notes?: string;
  referenceType?: StockReferenceType;
  referenceId?: string;
};

export type InventoryActionResult =
  | { success: true; item: InventoryItemRecord }
  | { success: false; error: string };

export type AdjustStockResult =
  | { success: true; movement: StockMovementRecord; newStock: number }
  | { success: false; error: string };

export async function listInventoryItemsAction(params?: {
  search?: string;
  category?: string;
  stockStatus?: "all" | "low" | "out" | "available";
}): Promise<InventoryItemRecord[]> {
  await requireSessionUser();

  const conditions = [];

  if (params?.search && params.search.trim()) {
    const term = `%${params.search.trim()}%`;
    conditions.push(
      or(
        like(inventoryItems.name, term),
        like(inventoryItems.sku, term),
        like(inventoryItems.category, term)
      )
    );
  }

  if (params?.category && params.category !== "all") {
    conditions.push(eq(inventoryItems.category, params.category));
  }

  const query = db
    .select()
    .from(inventoryItems)
    .orderBy(desc(inventoryItems.createdAt));

  let items = conditions.length > 0
    ? await query.where(and(...conditions))
    : await query;

  if (params?.stockStatus) {
    if (params.stockStatus === "low") {
      items = items.filter(
        (i) => i.currentStock > 0 && i.currentStock <= i.minStock
      );
    } else if (params.stockStatus === "out") {
      items = items.filter((i) => i.currentStock <= 0);
    } else if (params.stockStatus === "available") {
      items = items.filter((i) => i.currentStock > i.minStock);
    }
  }

  return items;
}

export async function getInventoryItemAction(
  id: string
): Promise<{ item: InventoryItemRecord; movements: StockMovementRecord[] } | null> {
  await requireSessionUser();

  const [item] = await db
    .select()
    .from(inventoryItems)
    .where(eq(inventoryItems.id, id))
    .limit(1);

  if (!item) return null;

  const movements = await db
    .select()
    .from(stockMovements)
    .where(eq(stockMovements.inventoryItemId, id))
    .orderBy(desc(stockMovements.createdAt))
    .limit(50);

  return { item, movements };
}

export async function createInventoryItemAction(
  input: InventoryItemInput
): Promise<InventoryActionResult> {
  const user = await requireSessionUser();

  if (!input.sku.trim()) {
    return { success: false, error: "SKU / Kode barang wajib diisi." };
  }

  if (!input.name.trim()) {
    return { success: false, error: "Nama barang wajib diisi." };
  }

  // Check unique SKU
  const [existing] = await db
    .select()
    .from(inventoryItems)
    .where(eq(inventoryItems.sku, input.sku.trim()))
    .limit(1);

  if (existing) {
    return { success: false, error: `SKU "${input.sku}" sudah digunakan barang lain.` };
  }

  try {
    const item = await db.transaction(async (tx) => {
      const initialStock = Number(input.currentStock) || 0;

      const [created] = await tx
        .insert(inventoryItems)
        .values({
          sku: input.sku.trim(),
          name: input.name.trim(),
          category: input.category.trim() || "Umum",
          unit: input.unit.trim() || "pcs",
          minStock: Number(input.minStock) || 0,
          currentStock: initialStock,
          costPrice: Number(input.costPrice) || 0,
          sellingPrice: Number(input.sellingPrice) || 0,
          description: input.description?.trim() || null,
          companyId: input.companyId || null,
        })
        .returning();

      if (initialStock > 0) {
        await tx.insert(stockMovements).values({
          inventoryItemId: created.id,
          type: "masuk",
          quantity: initialStock,
          balanceAfter: initialStock,
          referenceType: "manual",
          notes: "Stok Awal Master Barang",
          userId: user.id,
        });
      }

      return created;
    });

    await recordAudit({
      entityType: "inventory",
      entityId: item.id,
      action: "create",
      actorUserId: user.id,
    });

    return { success: true, item };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menambahkan barang ke inventaris.";
    return { success: false, error: message };
  }
}

export async function updateInventoryItemAction(
  id: string,
  input: Omit<InventoryItemInput, "currentStock">
): Promise<InventoryActionResult> {
  const user = await requireSessionUser();

  if (!input.sku.trim()) {
    return { success: false, error: "SKU / Kode barang wajib diisi." };
  }

  if (!input.name.trim()) {
    return { success: false, error: "Nama barang wajib diisi." };
  }

  // Check SKU conflict
  const [existingSku] = await db
    .select()
    .from(inventoryItems)
    .where(and(eq(inventoryItems.sku, input.sku.trim()), sql`${inventoryItems.id} != ${id}`))
    .limit(1);

  if (existingSku) {
    return { success: false, error: `SKU "${input.sku}" sudah dipakai oleh barang lain.` };
  }

  try {
    const [updated] = await db
      .update(inventoryItems)
      .set({
        sku: input.sku.trim(),
        name: input.name.trim(),
        category: input.category.trim() || "Umum",
        unit: input.unit.trim() || "pcs",
        minStock: Number(input.minStock) || 0,
        costPrice: Number(input.costPrice) || 0,
        sellingPrice: Number(input.sellingPrice) || 0,
        description: input.description?.trim() || null,
        companyId: input.companyId || null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(inventoryItems.id, id))
      .returning();

    if (!updated) {
      return { success: false, error: "Barang tidak ditemukan." };
    }

    await recordAudit({
      entityType: "inventory",
      entityId: updated.id,
      action: "update",
      actorUserId: user.id,
    });

    return { success: true, item: updated };
  } catch {
    return { success: false, error: "Gagal memperbarui data barang." };
  }
}

export async function adjustStockAction(
  input: AdjustStockInput
): Promise<AdjustStockResult> {
  const user = await requireSessionUser();

  const qty = Number(input.quantity);
  if (!qty || qty <= 0) {
    return { success: false, error: "Jumlah mutasi harus lebih besar dari 0." };
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [item] = await tx
        .select()
        .from(inventoryItems)
        .where(eq(inventoryItems.id, input.inventoryItemId))
        .limit(1);

      if (!item) {
        throw new Error("Barang tidak ditemukan.");
      }

      let newStock = item.currentStock;

      if (input.type === "masuk") {
        newStock += qty;
      } else if (input.type === "keluar") {
        newStock = Math.max(0, newStock - qty);
      } else if (input.type === "penyesuaian") {
        newStock = qty; // Penyesuaian fisik langsung menetapkan stok baru
      }

      const [updatedItem] = await tx
        .update(inventoryItems)
        .set({
          currentStock: newStock,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(inventoryItems.id, input.inventoryItemId))
        .returning();

      const [movement] = await tx
        .insert(stockMovements)
        .values({
          inventoryItemId: input.inventoryItemId,
          type: input.type,
          quantity: qty,
          balanceAfter: newStock,
          referenceType: input.referenceType || "manual",
          referenceId: input.referenceId || null,
          notes: input.notes || null,
          userId: user.id,
        })
        .returning();

      return { updatedItem, movement, newStock };
    });

    await recordAudit({
      entityType: "inventory",
      entityId: input.inventoryItemId,
      action: "update",
      actorUserId: user.id,
      reason: `Mutasi stok ${input.type}: ${qty} (Stok Baru: ${result.newStock})`,
    });

    return {
      success: true,
      movement: result.movement,
      newStock: result.newStock,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal melakukan penyesuaian stok.";
    return { success: false, error: message };
  }
}

export async function listStockMovementsAction(params?: {
  inventoryItemId?: string;
  type?: StockMovementType;
  referenceType?: StockReferenceType;
  limit?: number;
}): Promise<StockMovementRecord[]> {
  await requireSessionUser();

  const conditions = [];

  if (params?.inventoryItemId) {
    conditions.push(eq(stockMovements.inventoryItemId, params.inventoryItemId));
  }
  if (params?.type) {
    conditions.push(eq(stockMovements.type, params.type));
  }
  if (params?.referenceType) {
    conditions.push(eq(stockMovements.referenceType, params.referenceType));
  }

  const rows = await db
    .select({
      id: stockMovements.id,
      inventoryItemId: stockMovements.inventoryItemId,
      type: stockMovements.type,
      quantity: stockMovements.quantity,
      balanceAfter: stockMovements.balanceAfter,
      referenceType: stockMovements.referenceType,
      referenceId: stockMovements.referenceId,
      notes: stockMovements.notes,
      userId: stockMovements.userId,
      createdAt: stockMovements.createdAt,
      itemName: inventoryItems.name,
      itemSku: inventoryItems.sku,
    })
    .from(stockMovements)
    .innerJoin(inventoryItems, eq(stockMovements.inventoryItemId, inventoryItems.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(stockMovements.createdAt))
    .limit(params?.limit || 100);

  return rows as StockMovementRecord[];
}

export async function deleteInventoryItemAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const user = await requireSessionUser();

  try {
    const [deleted] = await db
      .delete(inventoryItems)
      .where(eq(inventoryItems.id, id))
      .returning();

    if (!deleted) {
      return { success: false, error: "Barang tidak ditemukan." };
    }

    await recordAudit({
      entityType: "inventory",
      entityId: id,
      action: "cancel",
      actorUserId: user.id,
      reason: `Menghapus master barang ${deleted.name} (${deleted.sku})`,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus barang inventaris." };
  }
}

/**
 * Fungsi pembantu otomatis untuk mencatat pergerakan stok ketika dokumen (GRN / Invoice / PO) dibuat atau diubah statusnya.
 */
export async function syncDocumentStockMovementsAction(params: {
  docType: "grn" | "invoice" | "po";
  docNumber: string;
  items: Array<{ description: string; quantity: number }>;
  userId?: string;
}): Promise<{ syncedCount: number }> {
  if (!params.items || params.items.length === 0) return { syncedCount: 0 };

  let syncedCount = 0;
  const allItems = await db.select().from(inventoryItems);

  for (const itemInput of params.items) {
    const desc = itemInput.description.trim().toLowerCase();
    const qty = Number(itemInput.quantity);
    if (!desc || !qty || qty <= 0) continue;

    // Cari matching item berdasar SKU atau Nama Barang
    const matched = allItems.find(
      (inv) =>
        inv.sku.toLowerCase() === desc ||
        inv.name.toLowerCase() === desc ||
        desc.includes(inv.name.toLowerCase()) ||
        inv.name.toLowerCase().includes(desc)
    );

    if (matched) {
      const type: StockMovementType = params.docType === "grn" ? "masuk" : "keluar";
      const newStock =
        type === "masuk"
          ? matched.currentStock + qty
          : Math.max(0, matched.currentStock - qty);

      await db
        .update(inventoryItems)
        .set({ currentStock: newStock, updatedAt: new Date().toISOString() })
        .where(eq(inventoryItems.id, matched.id));

      await db.insert(stockMovements).values({
        inventoryItemId: matched.id,
        type,
        quantity: qty,
        balanceAfter: newStock,
        referenceType: params.docType as StockReferenceType,
        referenceId: params.docNumber,
        notes: `Otomatis dari Dokumen ${params.docType.toUpperCase()} #${params.docNumber}`,
        userId: params.userId || null,
      });

      syncedCount++;
    }
  }

  return { syncedCount };
}

/**
 * Memuat data contoh inventaris (Produk WIRIDAN 318 & Komoditas Unggulan PT KARYA SANG PRABU)
 */
export async function seedSampleInventoryAction(): Promise<{ success: boolean; count: number; error?: string }> {
  const user = await requireSessionUser();

  const sampleItems: Array<{
    sku: string;
    name: string;
    category: string;
    unit: string;
    currentStock: number;
    minStock: number;
    costPrice: number;
    sellingPrice: number;
    description: string;
  }> = [
    {
      sku: "WIR-BKS-01",
      name: "Bakso Premium WIRIDAN 318 (500g)",
      category: "Bakso & Frozen Food",
      unit: "pack",
      currentStock: 120,
      minStock: 25,
      costPrice: 32000,
      sellingPrice: 42000,
      description: "Daging sapi pilihan kenyal alami 500g. Halal ID00410000123456721 - Distributor: PT KARYA SANG PRABU",
    },
    {
      sku: "WIR-BKS-02",
      name: "Bakso Reguler WIRIDAN 318 (500g)",
      category: "Bakso & Frozen Food",
      unit: "pack",
      currentStock: 180,
      minStock: 30,
      costPrice: 24000,
      sellingPrice: 32000,
      description: "Bakso sapi gurih nikmat 500g, cocok untuk sajian keluarga & usaha kuliner.",
    },
    {
      sku: "WIR-OTK-01",
      name: "Otak-Otak Ikan WIRIDAN 318 (500g)",
      category: "Olahan Ikan & Seafood",
      unit: "pack",
      currentStock: 95,
      minStock: 20,
      costPrice: 22000,
      sellingPrice: 29000,
      description: "Olahan ikan segar pilihan gurih lezat 500g bersertifikat halal.",
    },
    {
      sku: "WIR-DMS-01",
      name: "Dimsum Siap Kukus WIRIDAN 318 (500g)",
      category: "Dimsum & Kudapan",
      unit: "pack",
      currentStock: 75,
      minStock: 15,
      costPrice: 28000,
      sellingPrice: 38000,
      description: "Siomay dimsum ayam udang lembut juicy 500g siap kukus.",
    },
    {
      sku: "KMD-CGK-01",
      name: "Cengkeh AB6 Kualitas Ekspor",
      category: "Rempah & Herbal",
      unit: "kg",
      currentStock: 450,
      minStock: 100,
      costPrice: 115000,
      sellingPrice: 135000,
      description: "Cengkeh kering AB6 kualitas ekspor kadar air < 12%.",
    },
    {
      sku: "KMD-KPL-01",
      name: "Kapulaga Jawa Super",
      category: "Rempah & Herbal",
      unit: "kg",
      currentStock: 200,
      minStock: 50,
      costPrice: 85000,
      sellingPrice: 105000,
      description: "Kapulaga putih bersih pilihan petani lokal Jawa Tengah.",
    },
    {
      sku: "KMD-BRS-01",
      name: "Beras Premium Cap Sang Prabu (25kg)",
      category: "Pangan",
      unit: "karung",
      currentStock: 60,
      minStock: 15,
      costPrice: 310000,
      sellingPrice: 350000,
      description: "Beras pulen harum bebas pemutih & pengawet kemasan 25kg.",
    },
    {
      sku: "DGG-SP-01",
      name: "Daging Sapi Segar & Beku",
      category: "Daging Beku",
      unit: "kg",
      currentStock: 80,
      minStock: 20,
      costPrice: 98000,
      sellingPrice: 120000,
      description: "Daging sapi halal higienis cold chain terjaga.",
    },
  ];

  try {
    let count = 0;
    for (const item of sampleItems) {
      const [existing] = await db
        .select()
        .from(inventoryItems)
        .where(eq(inventoryItems.sku, item.sku))
        .limit(1);

      if (!existing) {
        const [created] = await db
          .insert(inventoryItems)
          .values({
            sku: item.sku,
            name: item.name,
            category: item.category,
            unit: item.unit,
            currentStock: item.currentStock,
            minStock: item.minStock,
            costPrice: item.costPrice,
            sellingPrice: item.sellingPrice,
            description: item.description,
          })
          .returning();

        if (created && item.currentStock > 0) {
          await db.insert(stockMovements).values({
            inventoryItemId: created.id,
            type: "masuk",
            quantity: item.currentStock,
            balanceAfter: item.currentStock,
            referenceType: "manual",
            referenceId: "INITIAL-SEED",
            notes: "Stok Awal Sample Inventory PT KARYA SANG PRABU",
            userId: user.id,
          });
        }
        count++;
      }
    }

    return { success: true, count };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memuat contoh inventaris";
    return { success: false, count: 0, error: message };
  }
}
