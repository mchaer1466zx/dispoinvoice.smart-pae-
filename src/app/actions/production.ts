"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  rawMaterials,
  finishedGoods,
  productFormulas,
  inventoryItems,
  stockMovements,
} from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";
import { ensureDatabaseTables } from "@/lib/ensure-tables";

export interface RawMaterialItem {
  id: string;
  materialName: string;
  stockQuantity: number;
  unit: string;
  lastPurchasePrice: number;
}

export interface FinishedGoodItem {
  id: string;
  productName: string;
  currentStock: number; // Pack (kantong kemasan 500g) di cold-storage
  currentHpp: number;
  recommendedPrice: number;
}

export interface ProductFormulaItem {
  id: string;
  productId: string;
  materialId: string;
  requiredQuantity: number; // Takaran per 1 pack 500g produk jadi
  materialName?: string;
  unit?: string;
  lastPurchasePrice?: number;
}

export interface RecipeFeasibilityResult {
  productId: string;
  productName: string;
  batchQuantity: number;
  canProduce: boolean;
  totalBatchCost: number;
  hppPerUnit: number;
  newMovingAvgHpp: number;
  ingredientsStatus: Array<{
    formulaId: string;
    materialId: string;
    materialName: string;
    unit: string;
    requiredPerPack: number;
    requiredTotal: number;
    availableStock: number;
    isSufficient: boolean;
    lastPurchasePrice: number;
    subtotalCost: number;
    statusText: string; // e.g. "Daging Ayam Fillet: Dibutuhkan 15 kg | Stok Gudang: 40 kg (Cukup ✅)"
  }>;
}

/**
 * Memastikan data awal Bahan Baku, Produk Jadi WIRIDAN 318, dan Resep BOM (per 1 Pack 500g)
 * sudah terisi di database SQLite.
 */
export async function seedProductionDataAction(): Promise<{
  success: boolean;
  message: string;
}> {
  await ensureDatabaseTables();

  // 1. Cek atau Buat Raw Materials
  const existingRaw = await db.select().from(rawMaterials);
  const rawMap = new Map(existingRaw.map((r) => [r.materialName, r]));

  const defaultRawList = [
    {
      materialName: "Daging Ayam Fillet",
      stockQuantity: 40, // 40 kg di gudang (sesuai contoh instruksi)
      unit: "kg",
      lastPurchasePrice: 42000,
    },
    {
      materialName: "Kulit Dimsum",
      stockQuantity: 300, // 300 pcs di gudang (sesuai contoh instruksi)
      unit: "pcs",
      lastPurchasePrice: 400,
    },
    {
      materialName: "Daging Sapi Pilihan",
      stockQuantity: 65, // kg
      unit: "kg",
      lastPurchasePrice: 110000,
    },
    {
      materialName: "Ikan Segar Tenggiri / Surimi",
      stockQuantity: 50, // kg
      unit: "kg",
      lastPurchasePrice: 60000,
    },
    {
      materialName: "Udang Kupas Segar",
      stockQuantity: 25, // kg
      unit: "kg",
      lastPurchasePrice: 85000,
    },
    {
      materialName: "Tepung Tapioka / Sagu Super",
      stockQuantity: 200, // kg
      unit: "kg",
      lastPurchasePrice: 14000,
    },
    {
      materialName: "Bumbu Racik Rempah & Bawang",
      stockQuantity: 50, // kg
      unit: "kg",
      lastPurchasePrice: 35000,
    },
    {
      materialName: "Santan & Daun Bawang",
      stockQuantity: 30, // kg
      unit: "kg",
      lastPurchasePrice: 30000,
    },
    {
      materialName: "Kemasan Vacuum WIRIDAN 318 (500g)",
      stockQuantity: 1500, // pcs
      unit: "pcs",
      lastPurchasePrice: 1200,
    },
  ];

  if (existingRaw.length === 0) {
    for (const r of defaultRawList) {
      const [inserted] = await db
        .insert(rawMaterials)
        .values({
          materialName: r.materialName,
          stockQuantity: r.stockQuantity,
          unit: r.unit,
          lastPurchasePrice: r.lastPurchasePrice,
        })
        .returning();
      rawMap.set(inserted.materialName, inserted);
    }
  } else {
    // Sinkronisasi data jika ada yang kurang
    for (const r of defaultRawList) {
      if (!rawMap.has(r.materialName)) {
        const [inserted] = await db
          .insert(rawMaterials)
          .values({
            materialName: r.materialName,
            stockQuantity: r.stockQuantity,
            unit: r.unit,
            lastPurchasePrice: r.lastPurchasePrice,
          })
          .returning();
        rawMap.set(inserted.materialName, inserted);
      }
    }
  }

  // 2. Cek atau Buat Finished Goods (WIRIDAN 318 Pack 500g)
  const existingFinished = await db.select().from(finishedGoods);
  const finishedMap = new Map(existingFinished.map((f) => [f.productName, f]));

  const defaultFinishedList = [
    {
      productName: "Dimsum Siap Kukus WIRIDAN 318 (500g)",
      currentStock: 120, // 120 pack di cold-storage
      currentHpp: 22500,
      recommendedPrice: 32000,
    },
    {
      productName: "Bakso Sapi Premium WIRIDAN 318 (500g)",
      currentStock: 250, // 250 pack di cold-storage
      currentHpp: 46500,
      recommendedPrice: 65000,
    },
    {
      productName: "Bakso Reguler Sapi-Ayam WIRIDAN 318 (500g)",
      currentStock: 180, // 180 pack di cold-storage
      currentHpp: 28000,
      recommendedPrice: 39000,
    },
    {
      productName: "Otak-Otak Ikan Super WIRIDAN 318 (500g)",
      currentStock: 95, // 95 pack di cold-storage
      currentHpp: 25500,
      recommendedPrice: 36000,
    },
  ];

  if (existingFinished.length === 0) {
    for (const f of defaultFinishedList) {
      const [inserted] = await db
        .insert(finishedGoods)
        .values({
          productName: f.productName,
          currentStock: f.currentStock,
          currentHpp: f.currentHpp,
          recommendedPrice: f.recommendedPrice,
        })
        .returning();
      finishedMap.set(inserted.productName, inserted);
    }
  } else {
    for (const f of defaultFinishedList) {
      if (!finishedMap.has(f.productName)) {
        const [inserted] = await db
          .insert(finishedGoods)
          .values({
            productName: f.productName,
            currentStock: f.currentStock,
            currentHpp: f.currentHpp,
            recommendedPrice: f.recommendedPrice,
          })
          .returning();
        finishedMap.set(inserted.productName, inserted);
      }
    }
  }

  // 3. Cek atau Buat Formula / Resep (BOM per 1 Pack 500g)
  const existingFormulas = await db.select().from(productFormulas);

  if (existingFormulas.length === 0) {
    // Formula 1: Dimsum Siap Kukus 500g
    // Takaran per 1 pack: Daging Ayam 0.3 kg (15 kg per 50 pack), Kulit Dimsum 10 pcs (500 pcs per 50 pack), Udang 0.05 kg, Tepung 0.05 kg, Kemasan 1 pcs
    const dimsum = finishedMap.get("Dimsum Siap Kukus WIRIDAN 318 (500g)");
    if (dimsum) {
      const ayam = rawMap.get("Daging Ayam Fillet");
      const kulit = rawMap.get("Kulit Dimsum");
      const udang = rawMap.get("Udang Kupas Segar");
      const tepung = rawMap.get("Tepung Tapioka / Sagu Super");
      const kemasan = rawMap.get("Kemasan Vacuum WIRIDAN 318 (500g)");

      if (ayam) await db.insert(productFormulas).values({ productId: dimsum.id, materialId: ayam.id, requiredQuantity: 0.30 });
      if (kulit) await db.insert(productFormulas).values({ productId: dimsum.id, materialId: kulit.id, requiredQuantity: 10 });
      if (udang) await db.insert(productFormulas).values({ productId: dimsum.id, materialId: udang.id, requiredQuantity: 0.05 });
      if (tepung) await db.insert(productFormulas).values({ productId: dimsum.id, materialId: tepung.id, requiredQuantity: 0.05 });
      if (kemasan) await db.insert(productFormulas).values({ productId: dimsum.id, materialId: kemasan.id, requiredQuantity: 1 });
    }

    // Formula 2: Bakso Sapi Premium 500g
    // Takaran per 1 pack: Daging Sapi 0.36 kg, Tepung 0.10 kg, Bumbu 0.04 kg, Kemasan 1 pcs
    const baksoPrem = finishedMap.get("Bakso Sapi Premium WIRIDAN 318 (500g)");
    if (baksoPrem) {
      const sapi = rawMap.get("Daging Sapi Pilihan");
      const tepung = rawMap.get("Tepung Tapioka / Sagu Super");
      const bumbu = rawMap.get("Bumbu Racik Rempah & Bawang");
      const kemasan = rawMap.get("Kemasan Vacuum WIRIDAN 318 (500g)");

      if (sapi) await db.insert(productFormulas).values({ productId: baksoPrem.id, materialId: sapi.id, requiredQuantity: 0.36 });
      if (tepung) await db.insert(productFormulas).values({ productId: baksoPrem.id, materialId: tepung.id, requiredQuantity: 0.10 });
      if (bumbu) await db.insert(productFormulas).values({ productId: baksoPrem.id, materialId: bumbu.id, requiredQuantity: 0.04 });
      if (kemasan) await db.insert(productFormulas).values({ productId: baksoPrem.id, materialId: kemasan.id, requiredQuantity: 1 });
    }

    // Formula 3: Otak-Otak Ikan Super 500g
    // Takaran per 1 pack: Ikan Tenggiri 0.30 kg, Tepung 0.15 kg, Santan & Bumbu 0.05 kg, Kemasan 1 pcs
    const otak = finishedMap.get("Otak-Otak Ikan Super WIRIDAN 318 (500g)");
    if (otak) {
      const ikan = rawMap.get("Ikan Segar Tenggiri / Surimi");
      const tepung = rawMap.get("Tepung Tapioka / Sagu Super");
      const santan = rawMap.get("Santan & Daun Bawang");
      const kemasan = rawMap.get("Kemasan Vacuum WIRIDAN 318 (500g)");

      if (ikan) await db.insert(productFormulas).values({ productId: otak.id, materialId: ikan.id, requiredQuantity: 0.30 });
      if (tepung) await db.insert(productFormulas).values({ productId: otak.id, materialId: tepung.id, requiredQuantity: 0.15 });
      if (santan) await db.insert(productFormulas).values({ productId: otak.id, materialId: santan.id, requiredQuantity: 0.05 });
      if (kemasan) await db.insert(productFormulas).values({ productId: otak.id, materialId: kemasan.id, requiredQuantity: 1 });
    }

    // Formula 4: Bakso Reguler Sapi-Ayam 500g
    // Takaran per 1 pack: Daging Sapi 0.15 kg, Daging Ayam 0.15 kg, Tepung 0.15 kg, Bumbu 0.05 kg, Kemasan 1 pcs
    const baksoReg = finishedMap.get("Bakso Reguler Sapi-Ayam WIRIDAN 318 (500g)");
    if (baksoReg) {
      const sapi = rawMap.get("Daging Sapi Pilihan");
      const ayam = rawMap.get("Daging Ayam Fillet");
      const tepung = rawMap.get("Tepung Tapioka / Sagu Super");
      const bumbu = rawMap.get("Bumbu Racik Rempah & Bawang");
      const kemasan = rawMap.get("Kemasan Vacuum WIRIDAN 318 (500g)");

      if (sapi) await db.insert(productFormulas).values({ productId: baksoReg.id, materialId: sapi.id, requiredQuantity: 0.15 });
      if (ayam) await db.insert(productFormulas).values({ productId: baksoReg.id, materialId: ayam.id, requiredQuantity: 0.15 });
      if (tepung) await db.insert(productFormulas).values({ productId: baksoReg.id, materialId: tepung.id, requiredQuantity: 0.15 });
      if (bumbu) await db.insert(productFormulas).values({ productId: baksoReg.id, materialId: bumbu.id, requiredQuantity: 0.05 });
      if (kemasan) await db.insert(productFormulas).values({ productId: baksoReg.id, materialId: kemasan.id, requiredQuantity: 1 });
    }
  }

  return { success: true, message: "Database Master Formula BOM WIRIDAN 318 siap digunakan." };
}

/**
 * Mengambil data produk jadi, bahan baku, dan formulasi aktif
 */
export async function getProductionMasterDataAction(): Promise<{
  finishedGoodsList: FinishedGoodItem[];
  rawMaterialsList: RawMaterialItem[];
  formulasList: ProductFormulaItem[];
}> {
  await ensureDatabaseTables();
  await seedProductionDataAction();

  const finishedList = await db.select().from(finishedGoods);
  const rawList = await db.select().from(rawMaterials);
  const formList = await db.select().from(productFormulas);

  const rawMap = new Map(rawList.map((r) => [r.id, r]));

  const enrichedFormulas: ProductFormulaItem[] = formList.map((f) => {
    const raw = rawMap.get(f.materialId);
    return {
      id: f.id,
      productId: f.productId,
      materialId: f.materialId,
      requiredQuantity: f.requiredQuantity,
      materialName: raw ? raw.materialName : "Bahan",
      unit: raw ? raw.unit : "kg",
      lastPurchasePrice: raw ? raw.lastPurchasePrice : 0,
    };
  });

  return {
    finishedGoodsList: finishedList,
    rawMaterialsList: rawList,
    formulasList: enrichedFormulas,
  };
}

/**
 * Pengecekan real-time kelayakan produksi berdasarkan input jumlah pack (misal 50 pack).
 */
export async function checkProductionFeasibilityAction(
  productId: string,
  batchQuantity: number
): Promise<RecipeFeasibilityResult | null> {
  await ensureDatabaseTables();
  await seedProductionDataAction();

  const [product] = await db
    .select()
    .from(finishedGoods)
    .where(eq(finishedGoods.id, productId))
    .limit(1);

  if (!product) return null;

  const formulas = await db
    .select()
    .from(productFormulas)
    .where(eq(productFormulas.productId, productId));

  const allRaw = await db.select().from(rawMaterials);
  const rawMap = new Map(allRaw.map((r) => [r.id, r]));

  const qty = Math.max(1, batchQuantity || 1);
  let canProduce = true;
  let totalBatchCost = 0;

  const ingredientsStatus = formulas.map((f) => {
    const material = rawMap.get(f.materialId);
    const requiredTotal = Number((f.requiredQuantity * qty).toFixed(2));
    const availableStock = material ? material.stockQuantity : 0;
    const isSufficient = availableStock >= requiredTotal;

    if (!isSufficient) {
      canProduce = false;
    }

    const unitPrice = material ? material.lastPurchasePrice : 0;
    const subtotalCost = requiredTotal * unitPrice;
    totalBatchCost += subtotalCost;

    const unit = material ? material.unit : "kg";
    const matName = material ? material.materialName : "Bahan Baku";

    return {
      formulaId: f.id,
      materialId: f.materialId,
      materialName: matName,
      unit,
      requiredPerPack: f.requiredQuantity,
      requiredTotal,
      availableStock,
      isSufficient,
      lastPurchasePrice: unitPrice,
      subtotalCost,
      statusText: `${matName}: Dibutuhkan ${requiredTotal} ${unit} | Stok Gudang: ${availableStock} ${unit} (${isSufficient ? "Cukup ✅" : "Kurang ❌"})`,
    };
  });

  const hppPerUnit = qty > 0 ? Math.round(totalBatchCost / qty) : 0;
  const existingStock = product.currentStock || 0;
  const existingHpp = product.currentHpp || 0;
  const totalNewStock = existingStock + qty;

  const newMovingAvgHpp =
    totalNewStock > 0
      ? Math.round(((existingStock * existingHpp) + totalBatchCost) / totalNewStock)
      : hppPerUnit;

  return {
    productId: product.id,
    productName: product.productName,
    batchQuantity: qty,
    canProduce,
    totalBatchCost,
    hppPerUnit,
    newMovingAvgHpp,
    ingredientsStatus,
  };
}

/**
 * Server Action: Konfirmasi & Potong Stok
 */
export async function executeProductionBatchAction(params: {
  productId: string;
  batchQuantity: number;
  batchNotes?: string;
}): Promise<{
  success: boolean;
  message: string;
  batchNumber?: string;
  outputQty?: number;
  outputItemName?: string;
  totalCost?: number;
  newHpp?: number;
  totalStockAfter?: number;
  error?: string;
}> {
  await ensureDatabaseTables();
  const user = await requireSessionUser();

  const { productId, batchQuantity, batchNotes } = params;
  if (!productId || !batchQuantity || batchQuantity <= 0) {
    return { success: false, message: "ID produk dan jumlah produksi tidak valid." };
  }

  const feasibility = await checkProductionFeasibilityAction(productId, batchQuantity);
  if (!feasibility) {
    return { success: false, message: "Formula atau data produk tidak ditemukan." };
  }

  if (!feasibility.canProduce) {
    const insufficient = feasibility.ingredientsStatus
      .filter((i) => !i.isSufficient)
      .map((i) => `${i.materialName} (Butuh ${i.requiredTotal} ${i.unit}, Stok: ${i.availableStock} ${i.unit})`)
      .join(", ");
    return {
      success: false,
      message: `Stok tidak cukup untuk bahan: ${insufficient}. Silakan restock bahan baku terlebih dahulu.`,
    };
  }

  const batchNumber = `BATCH-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    // 1. Kurangi stok bahan baku
    for (const ing of feasibility.ingredientsStatus) {
      const newStock = Math.max(0, ing.availableStock - ing.requiredTotal);
      await db
        .update(rawMaterials)
        .set({
          stockQuantity: newStock,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(rawMaterials.id, ing.materialId));
    }

    // 2. Ambil data produk jadi saat ini & tambahkan stok
    const [currentProd] = await db
      .select()
      .from(finishedGoods)
      .where(eq(finishedGoods.id, productId))
      .limit(1);

    const existingStock = currentProd ? currentProd.currentStock : 0;
    const totalNewStock = existingStock + batchQuantity;
    const newCalculatedHpp = feasibility.newMovingAvgHpp;

    await db
      .update(finishedGoods)
      .set({
        currentStock: totalNewStock,
        currentHpp: newCalculatedHpp,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(finishedGoods.id, productId));

    // Sinkronkan juga ke master inventory_items & stock_movements jika ada
    const [invItem] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.name, feasibility.productName))
      .limit(1);

    if (invItem) {
      await db
        .update(inventoryItems)
        .set({
          currentStock: totalNewStock,
          costPrice: newCalculatedHpp,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(inventoryItems.id, invItem.id));

      await db.insert(stockMovements).values({
        inventoryItemId: invItem.id,
        type: "masuk",
        quantity: batchQuantity,
        balanceAfter: totalNewStock,
        referenceType: "manual",
        referenceId: batchNumber,
        notes: `Hasil Produksi Batch ${batchNumber} (${batchQuantity} pack) - ${batchNotes || "Formulasi WIRIDAN 318"}`,
        userId: user.id,
      });
    }

    return {
      success: true,
      message: `Proses konversi produksi berhasil. Stok telah diperbarui (+${batchQuantity} pack ${feasibility.productName}).`,
      batchNumber,
      outputQty: batchQuantity,
      outputItemName: feasibility.productName,
      totalCost: feasibility.totalBatchCost,
      newHpp: newCalculatedHpp,
      totalStockAfter: totalNewStock,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan sistem eksekusi batch";
    return {
      success: false,
      message: `Gagal memproses batch produksi: ${errorMsg}`,
      error: errorMsg,
    };
  }
}

/**
 * Mengisi ulang stok bahan baku cepat untuk simulasi operasional pabrik
 */
export async function quickRestockRawMaterialsAction(): Promise<{
  success: boolean;
  message: string;
}> {
  await ensureDatabaseTables();
  await seedProductionDataAction();

  const allRaw = await db.select().from(rawMaterials);
  for (const raw of allRaw) {
    let topUp = 50;
    if (raw.unit === "pcs") topUp = 500;
    if (raw.materialName.includes("Daging Ayam")) topUp = 100;
    if (raw.materialName.includes("Kulit Dimsum")) topUp = 1000;

    await db
      .update(rawMaterials)
      .set({
        stockQuantity: raw.stockQuantity + topUp,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(rawMaterials.id, raw.id));
  }

  return {
    success: true,
    message: "Stok bahan baku gudang berhasil diisi ulang!",
  };
}
