import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { rawMaterials, finishedGoods, productFormulas, inventoryItems, stockMovements } from "@/db/schema";
import { ensureDatabaseTables } from "@/lib/ensure-tables";
import { getSessionUserAction } from "@/app/actions/auth";

/**
 * GET /api/admin/produksi
 * Mengambil daftar produk jadi (finished goods), bahan baku (raw materials), dan formulasi resep (BOM)
 */
export async function GET(request: Request) {
  await ensureDatabaseTables();
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const checkQty = searchParams.get("checkQty");

    // Ambil data produk jadi
    const allFinishedGoods = await db.select().from(finishedGoods);
    const allRawMaterials = await db.select().from(rawMaterials);
    const allFormulas = await db.select().from(productFormulas);

    if (productId && checkQty) {
      const targetProduct = allFinishedGoods.find((fg) => fg.id === productId);
      const formulas = allFormulas.filter((f) => f.productId === productId);
      const batchQuantity = Math.max(1, parseFloat(checkQty) || 1);

      let canProduce = true;
      let totalBatchCost = 0;

      const ingredientsStatus = formulas.map((f) => {
        const material = allRawMaterials.find((m) => m.id === f.materialId);
        const requiredTotal = f.requiredQuantity * batchQuantity;
        const availableStock = material ? material.stockQuantity : 0;
        const isSufficient = availableStock >= requiredTotal;
        if (!isSufficient) canProduce = false;

        const subtotalCost = requiredTotal * (material ? material.lastPurchasePrice : 0);
        totalBatchCost += subtotalCost;

        return {
          formulaId: f.id,
          materialId: f.materialId,
          materialName: material ? material.materialName : "Bahan Baku",
          unit: material ? material.unit : "kg",
          requiredPerPack: f.requiredQuantity,
          requiredTotal,
          availableStock,
          isSufficient,
          lastPurchasePrice: material ? material.lastPurchasePrice : 0,
          subtotalCost,
          // Format ringkas sesuai spesifikasi instruksi
          statusText: `${material ? material.materialName : "Bahan"}: Dibutuhkan ${requiredTotal} ${material?.unit || "kg"} | Stok Gudang: ${availableStock} ${material?.unit || "kg"} (${isSufficient ? "Cukup ✅" : "Kurang ❌"})`,
        };
      });

      const hppPerUnit = batchQuantity > 0 ? Math.round(totalBatchCost / batchQuantity) : 0;
      const existingStock = targetProduct?.currentStock || 0;
      const existingHpp = targetProduct?.currentHpp || 0;
      const totalNewStock = existingStock + batchQuantity;
      const newMovingAvgHpp = totalNewStock > 0
        ? Math.round(((existingStock * existingHpp) + totalBatchCost) / totalNewStock)
        : hppPerUnit;

      return NextResponse.json({
        success: true,
        productId,
        productName: targetProduct?.productName,
        batchQuantity,
        canProduce,
        totalBatchCost,
        hppPerUnit,
        newMovingAvgHpp,
        ingredientsStatus,
      });
    }

    return NextResponse.json({
      success: true,
      finishedGoods: allFinishedGoods,
      rawMaterials: allRawMaterials,
      formulas: allFormulas,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal memuat data formulasi produksi";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

/**
 * POST /api/admin/produksi
 * Eksekusi Konversi Batch Produksi (Atomic Stock Decrement Raw Material -> Increment Finished Good + Moving Average HPP)
 */
export async function POST(request: Request) {
  await ensureDatabaseTables();
  try {
    // 1. Ambil input data dari Client/Front-end
    const body = await request.json();
    const { productId, batchQuantity, batchNotes } = body;

    // Validasi input awal
    if (!productId || !batchQuantity || Number(batchQuantity) <= 0) {
      return NextResponse.json(
        { success: false, message: "ID produk dan jumlah produksi tidak valid." },
        { status: 400 }
      );
    }

    const qty = Number(batchQuantity);

    // 2. Ambil resep / formula produk berdasarkan productId
    const [targetProduct] = await db
      .select()
      .from(finishedGoods)
      .where(eq(finishedGoods.id, String(productId)))
      .limit(1);

    if (!targetProduct) {
      return NextResponse.json(
        { success: false, message: "Produk jadi WIRIDAN 318 tidak ditemukan di database." },
        { status: 404 }
      );
    }

    const formulas = await db
      .select()
      .from(productFormulas)
      .where(eq(productFormulas.productId, String(productId)));

    if (formulas.length === 0) {
      return NextResponse.json(
        { success: false, message: "Formula/resep untuk produk ini belum dikonfigurasi." },
        { status: 404 }
      );
    }

    // Ambil seluruh raw materials untuk verifikasi
    const allMaterials = await db.select().from(rawMaterials);
    const materialMap = new Map(allMaterials.map((m) => [m.id, m]));

    let totalBatchCost = 0;
    const requiredList: Array<{
      materialId: string;
      materialName: string;
      unit: string;
      requiredTotal: number;
      availableStock: number;
      unitPrice: number;
      subtotal: number;
    }> = [];

    // Iterasi cek stok bahan baku dan kalkulasi biaya HPP aktual
    for (const formula of formulas) {
      const mat = materialMap.get(formula.materialId);
      if (!mat) {
        throw new Error(`Data bahan baku dengan ID ${formula.materialId} tidak ditemukan.`);
      }

      const totalNeeded = formula.requiredQuantity * qty;

      // Cek kecukupan stok di gudang saat ini
      if (mat.stockQuantity < totalNeeded) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Stok tidak cukup untuk bahan: ${mat.materialName}. ` +
              `Dibutuhkan: ${totalNeeded} ${mat.unit}, ` +
              `Tersedia: ${mat.stockQuantity} ${mat.unit}.`,
          },
          { status: 400 }
        );
      }

      // Hitung biaya modal batch ini berdasarkan harga beli terakhir di database
      const costForThis = totalNeeded * mat.lastPurchasePrice;
      totalBatchCost += costForThis;

      requiredList.push({
        materialId: mat.id,
        materialName: mat.materialName,
        unit: mat.unit,
        requiredTotal: totalNeeded,
        availableStock: mat.stockQuantity,
        unitPrice: mat.lastPurchasePrice,
        subtotal: costForThis,
      });
    }

    // 3. Jalankan pemotongan stok bahan baku
    for (const req of requiredList) {
      const newStock = Math.max(0, req.availableStock - req.requiredTotal);
      await db
        .update(rawMaterials)
        .set({
          stockQuantity: newStock,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(rawMaterials.id, req.materialId));

      // Sinkronkan juga ke inventory_items jika ada
      const [invItem] = await db
        .select()
        .from(inventoryItems)
        .where(eq(inventoryItems.name, req.materialName))
        .limit(1);

      if (invItem) {
        await db
          .update(inventoryItems)
          .set({
            currentStock: newStock,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(inventoryItems.id, invItem.id));
      }
    }

    // Hitung HPP per unit (pack) untuk produksi batch ini
    const hppPerUnitForThisBatch = totalBatchCost / qty;

    const existingStock = targetProduct.currentStock || 0;
    const existingHpp = targetProduct.currentHpp || 0;
    const totalNewStock = existingStock + qty;

    // Kalkulasi rata-rata tertimbang HPP baru (Moving Average)
    let newCalculatedHpp = hppPerUnitForThisBatch;
    if (totalNewStock > 0) {
      newCalculatedHpp = ((existingStock * existingHpp) + totalBatchCost) / totalNewStock;
    }
    const finalHppRounded = Math.round(newCalculatedHpp);

    // B. Eksekusi Penambahan Stok Produk Jadi & Update HPP Aktual
    const [updatedProduct] = await db
      .update(finishedGoods)
      .set({
        currentStock: totalNewStock,
        currentHpp: finalHppRounded,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(finishedGoods.id, targetProduct.id))
      .returning();

    // Sinkronkan juga ke inventory_items jika ada
    const [invFinished] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.name, targetProduct.productName))
      .limit(1);

    const user = await getSessionUserAction();
    const batchNumber = `BATCH-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (invFinished) {
      await db
        .update(inventoryItems)
        .set({
          currentStock: totalNewStock,
          costPrice: finalHppRounded,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(inventoryItems.id, invFinished.id));

      if (user) {
        await db.insert(stockMovements).values({
          inventoryItemId: invFinished.id,
          type: "masuk",
          quantity: qty,
          balanceAfter: totalNewStock,
          referenceType: "manual",
          referenceId: batchNumber,
          notes: `Hasil Produksi Batch ${batchNumber} (${qty} pack) - ${batchNotes || "Formulasi WIRIDAN 318"}`,
          userId: user.id,
        });
      }
    }

    // 4. Kirim respon sukses ke client jika transaksi berhasil
    return NextResponse.json({
      success: true,
      message: `Proses konversi produksi berhasil. Stok telah diperbarui (+${qty} pack ${targetProduct.productName}).`,
      data: updatedProduct,
      batchNumber,
      batchQuantity: qty,
      totalBatchCost,
      hppPerUnitThisBatch: Math.round(hppPerUnitForThisBatch),
      newMovingAvgHpp: finalHppRounded,
      totalStockAfter: totalNewStock,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan sistem pada server internal.";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 400 } // Bad request agar pesan error bahan baku terbaca di front-end
    );
  }
}
