"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Boxes,
  Factory,
  TrendingUp,
  AlertTriangle,
  Coins,
  PackageCheck,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Warehouse,
} from "lucide-react";
import { toast } from "sonner";
import {
  seedSampleInventoryAction,
} from "@/app/actions/inventory";
import {
  seedProductionDataAction,
  getProductionMasterDataAction,
  type FinishedGoodItem,
  type RawMaterialItem,
  type ProductFormulaItem,
} from "@/app/actions/production";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [finishedGoodsList, setFinishedGoodsList] = useState<FinishedGoodItem[]>([]);
  const [rawMaterialsList, setRawMaterialsList] = useState<RawMaterialItem[]>([]);
  const [formulasList, setFormulasList] = useState<ProductFormulaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  async function loadData() {
    try {
      const prodMaster = await getProductionMasterDataAction();
      setFinishedGoodsList(prodMaster.finishedGoodsList);
      setRawMaterialsList(prodMaster.rawMaterialsList);
      setFormulasList(prodMaster.formulasList);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const prodMaster = await getProductionMasterDataAction();
        if (active) {
          setFinishedGoodsList(prodMaster.finishedGoodsList);
          setRawMaterialsList(prodMaster.rawMaterialsList);
          setFormulasList(prodMaster.formulasList);
          setLoading(false);
        }
      } catch {
        if (active) setLoading(false);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  async function handleAutoSeed() {
    setSeeding(true);
    try {
      await seedProductionDataAction();
      await seedSampleInventoryAction();
      toast.success("Berhasil memuat data bahan baku & produk jadi WIRIDAN 318!");
      await loadData();
    } catch {
      toast.error("Gagal memuat data awal.");
    } finally {
      setSeeding(false);
    }
  }

  // Kalkulasi Metrik Utama
  const totalColdStorageValue = finishedGoodsList.reduce(
    (sum, fg) => sum + fg.currentStock * fg.currentHpp,
    0
  );
  const totalColdStoragePacks = finishedGoodsList.reduce(
    (sum, fg) => sum + fg.currentStock,
    0
  );
  const totalRawMaterialValue = rawMaterialsList.reduce(
    (sum, rm) => sum + rm.stockQuantity * rm.lastPurchasePrice,
    0
  );
  const totalCombinedAssets = totalColdStorageValue + totalRawMaterialValue;

  const lowStockItems = rawMaterialsList.filter((rm) => rm.stockQuantity <= 15);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistem Produksi & Manajemen HPP WIRIDAN 318</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Ikhtisar Stok Gudang & Ringkasan HPP
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Monitoring real-time saldo bahan baku daging/tepung/kulit, stok produk jadi cold-storage, margin keuntungan, dan eksekusi batch formulasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleAutoSeed}
              disabled={seeding}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${seeding ? "animate-spin" : ""}`} />
              <span>{seeding ? "Memuat Data..." : "Inisialisasi Data Gudang"}</span>
            </button>

            <Link
              href="/admin/inventory"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Boxes className="w-3.5 h-3.5 text-emerald-400" />
              <span>Logistik & Nilai Aset</span>
            </Link>

            <Link
              href="/admin/produksi"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all"
            >
              <Factory className="w-3.5 h-3.5" />
              <span>Eksekusi Formulasi Batch</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Valuasi HPP Aset */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Valuasi Gabungan</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-slate-100 tracking-tight block">
              {formatCurrency(totalCombinedAssets)}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Cold-Storage + Bahan Baku</span>
            </span>
          </div>
        </div>

        {/* Card 2: Produk Jadi Cold-Storage */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Aset Cold-Storage</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-emerald-400 tracking-tight block">
              {totalColdStoragePacks} Pack
            </span>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">
              Valuasi: {formatCurrency(totalColdStorageValue)}
            </span>
          </div>
        </div>

        {/* Card 3: Bahan Baku Gudang */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Bahan Baku Gudang</span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-amber-400 tracking-tight block">
              {rawMaterialsList.length} Bahan
            </span>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">
              Valuasi: {formatCurrency(totalRawMaterialValue)}
            </span>
          </div>
        </div>

        {/* Card 4: Alert Stok Kritis */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Peringatan Restock</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${lowStockItems.length > 0 ? "bg-rose-950/80 border border-rose-800/50 text-rose-400" : "bg-emerald-950/60 border border-emerald-800/50 text-emerald-400"}`}>
              {lowStockItems.length > 0 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-3">
            <span className={`text-xl font-bold tracking-tight block ${lowStockItems.length > 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {lowStockItems.length > 0 ? `${lowStockItems.length} Bahan Menipis` : "Stok Aman"}
            </span>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">
              Bahan di bawah batas minimum
            </span>
          </div>
        </div>
      </div>

      {/* Main Content: Table Ringkasan HPP & Varian Produk WIRIDAN 318 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Table HPP Produk Jadi */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-emerald-400" />
                  <span>Ringkasan HPP & Margin Produk Jadi WIRIDAN 318</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pelacakan kuantitas cold-storage, HPP aktual, dan proyeksi margin keuntungan
                </p>
              </div>

              <Link
                href="/admin/inventory"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                <span>Lihat Lengkap</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-500">
                Memuat data HPP produk...
              </div>
            ) : finishedGoodsList.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <Boxes className="w-10 h-10 text-slate-700 mx-auto" />
                <p className="text-xs text-slate-400">Belum ada produk jadi terdaftar di inventaris.</p>
                <button
                  onClick={handleAutoSeed}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Muat Master Produk WIRIDAN 318
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Nama Produk WIRIDAN 318</th>
                      <th className="py-2.5 px-3 text-center">Stok Cold-Storage</th>
                      <th className="py-2.5 px-3">HPP Real-Time</th>
                      <th className="py-2.5 px-3">Rekomendasi Jual</th>
                      <th className="py-2.5 px-3">Margin Laba</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {finishedGoodsList.map((item) => {
                      const marginRp = item.recommendedPrice - item.currentHpp;
                      const marginPct =
                        item.recommendedPrice > 0
                          ? Math.round((marginRp / item.recommendedPrice) * 100)
                          : 0;

                      return (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-200">{item.productName}</div>
                            <div className="text-[11px] font-mono text-emerald-400">Kemasan 500g • Halal</div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-950 border border-slate-700 text-slate-100">
                              {item.currentStock} Pack
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-300">
                            {formatCurrency(item.currentHpp)}
                          </td>
                          <td className="py-3 px-3 font-mono text-emerald-400 font-semibold">
                            {formatCurrency(item.recommendedPrice)}
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              +{marginPct}% ({formatCurrency(marginRp)})
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Link
                              href={`/admin/produksi`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 text-[11px] font-bold transition-all border border-emerald-500/30"
                            >
                              <Factory className="w-3 h-3" />
                              <span>Formulasi</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bahan Baku Quick Monitor */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-amber-400" />
                <span>Stok Bahan Baku Siap Produksi</span>
              </h2>
              <span className="text-xs text-slate-400">{rawMaterialsList.length} Komponen Terpantau</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {rawMaterialsList.slice(0, 6).map((raw) => (
                <div
                  key={raw.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200 truncate">{raw.materialName}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        raw.stockQuantity <= 15
                          ? "bg-rose-950 text-rose-300 border border-rose-800"
                          : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      }`}
                    >
                      {raw.stockQuantity <= 15 ? "Menipis" : "Cukup"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                    <span>Stok: <strong className="text-slate-100 font-mono">{raw.stockQuantity} {raw.unit}</strong></span>
                    <span>Harga: {formatCurrency(raw.lastPurchasePrice)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Formulasi & Quick Action */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Factory className="w-4 h-4 text-emerald-400" />
                <span>Formulasi Batch WIRIDAN 318</span>
              </h2>
            </div>

            <p className="text-xs text-slate-400">
              Sistem otomatis mengalikan kebutuhan resep BOM per pack dan memotong stok bahan baku dari gudang saat eksekusi.
            </p>

            <div className="space-y-2.5">
              {finishedGoodsList.map((fg) => {
                const countIngredients = formulasList.filter((f) => f.productId === fg.id).length || 4;
                return (
                  <div
                    key={fg.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-slate-200">{fg.productName}</h3>
                        <span className="text-[11px] text-emerald-400 font-medium">
                          Stok Saat Ini: {fg.currentStock} Pack
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">
                        {countIngredients} Komponen BOM
                      </span>
                      <Link
                        href={`/admin/produksi`}
                        className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        <span>Buka Formulasi</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-800/40 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Otomasi Siklus Produksi:</span>
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Saat batch (misal 50 pack) dieksekusi, sistem secara instan memotong saldo Daging Ayam/Sapi, Tepung, Kulit Dimsum, Bumbu & Kemasan di gudang bahan, lalu menambahkan stok ke cold-storage disertai moving average HPP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
