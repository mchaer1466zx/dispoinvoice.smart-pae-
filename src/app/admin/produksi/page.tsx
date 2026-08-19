"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Factory,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  Scale,
  RefreshCw,
  FileSpreadsheet,
  Check,
  X,
  Coins,
  Warehouse,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  getProductionMasterDataAction,
  checkProductionFeasibilityAction,
  executeProductionBatchAction,
  quickRestockRawMaterialsAction,
  type FinishedGoodItem,
  type RecipeFeasibilityResult,
} from "@/app/actions/production";
import { formatCurrency } from "@/lib/utils";

export default function AdminProduksiPage() {
  const [finishedGoodsList, setFinishedGoodsList] = useState<FinishedGoodItem[]>([]);
  
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [batchQuantity, setBatchQuantity] = useState<number>(50); // Default 50 pack sesuai contoh instruksi
  const [batchNotes, setBatchNotes] = useState<string>("");
  
  const [feasibility, setFeasibility] = useState<RecipeFeasibilityResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [executing, setExecuting] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  const [lastExecutionResult, setLastExecutionResult] = useState<{
    batchNumber: string;
    outputQty: number;
    outputItemName: string;
    totalCost: number;
    newHpp: number;
    totalStockAfter: number;
  } | null>(null);

  // 1. Initial Load Master Data
  useEffect(() => {
    let active = true;
    async function loadMasterData() {
      try {
        const data = await getProductionMasterDataAction();
        if (!active) return;
        setFinishedGoodsList(data.finishedGoodsList);

        // Pilih Dimsum atau produk pertama secara default
        const defaultProd =
          data.finishedGoodsList.find((p) => p.productName.toLowerCase().includes("dimsum")) ||
          data.finishedGoodsList[0];

        if (defaultProd) {
          setSelectedProductId(defaultProd.id);
        }
        setLoading(false);
      } catch {
        if (active) setLoading(false);
      }
    }
    loadMasterData();
    return () => {
      active = false;
    };
  }, []);

  // 2. Real-Time Client Feasibility Check saat selectedProductId atau batchQuantity berubah
  useEffect(() => {
    if (!selectedProductId) return;

    let active = true;
    async function updateFeasibility() {
      try {
        const res = await checkProductionFeasibilityAction(selectedProductId, batchQuantity);
        if (active && res) {
          setFeasibility(res);
        }
      } catch {
        // error handling
      }
    }

    updateFeasibility();
    return () => {
      active = false;
    };
  }, [selectedProductId, batchQuantity]);

  const currentProduct = finishedGoodsList.find((p) => p.id === selectedProductId);

  // Handler Konfirmasi & Potong Stok
  async function handleConfirmAndExecute() {
    if (!selectedProductId || !feasibility) return;

    if (!feasibility.canProduce) {
      toast.error("Stok bahan baku belum mencukupi. Tombol eksekusi dinonaktifkan.");
      return;
    }

    setExecuting(true);
    try {
      const res = await executeProductionBatchAction({
        productId: selectedProductId,
        batchQuantity,
        batchNotes: batchNotes || `Batch Produksi WIRIDAN 318 - ${currentProduct?.productName}`,
      });

      if (res.success && res.batchNumber) {
        toast.success(res.message);
        setLastExecutionResult({
          batchNumber: res.batchNumber,
          outputQty: res.outputQty || batchQuantity,
          outputItemName: res.outputItemName || currentProduct?.productName || "Produk",
          totalCost: res.totalCost || 0,
          newHpp: res.newHpp || 0,
          totalStockAfter: res.totalStockAfter || 0,
        });

        // Refresh master data & status ketersediaan bahan baku
        const updatedMaster = await getProductionMasterDataAction();
        setFinishedGoodsList(updatedMaster.finishedGoodsList);

        const updatedFeasibility = await checkProductionFeasibilityAction(
          selectedProductId,
          batchQuantity
        );
        if (updatedFeasibility) {
          setFeasibility(updatedFeasibility);
        }
      } else {
        toast.error(res.message || "Gagal memproses eksekusi batch.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem.";
      toast.error(msg);
    } finally {
      setExecuting(false);
    }
  }

  // Quick Restock Bahan Baku untuk pengujian
  async function handleQuickRestock() {
    startTransition(async () => {
      try {
        const res = await quickRestockRawMaterialsAction();
        toast.success(res.message);

        const updatedMaster = await getProductionMasterDataAction();
        setFinishedGoodsList(updatedMaster.finishedGoodsList);

        if (selectedProductId) {
          const updatedFeas = await checkProductionFeasibilityAction(
            selectedProductId,
            batchQuantity
          );
          if (updatedFeas) setFeasibility(updatedFeas);
        }
      } catch {
        toast.error("Gagal melakukan restock bahan baku.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/50 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-semibold mb-2">
              <Factory className="w-3.5 h-3.5" />
              <span>Bill of Materials (BOM) & Konversi Stok WIRIDAN 318</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Workstation Formulasi & Eksekusi Batch Pabrik
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Sistem pengecekan real-time kebutuhan bahan baku vs stok gudang aktual, perhitungan HPP otomatis, dan pemotongan stok terintegrasi cold-storage.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleQuickRestock}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Isi ulang stok bahan baku di gudang untuk simulasi"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Restock Bahan Cepat</span>
            </button>
            <Link
              href="/admin/inventory"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <Warehouse className="w-3.5 h-3.5 text-emerald-400" />
              <span>Logistik & Cold-Storage</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Product Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {finishedGoodsList.map((prod) => {
          const isSelected = prod.id === selectedProductId;
          return (
            <button
              key={prod.id}
              onClick={() => {
                setSelectedProductId(prod.id);
                setLastExecutionResult(null);
              }}
              className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-500"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                    Kemasan 500g
                  </span>
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <h3 className="text-xs font-bold text-slate-100 line-clamp-2">
                  {prod.productName}
                </h3>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Stok Cold-Storage:</span>
                <span className="font-bold text-slate-200">
                  {prod.currentStock} Pack
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Formulasi & Live Status Pengecekan Bahan Baku */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
            {/* Target Production & Input Jumlah Pack */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  Produk Terpilih
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-100">
                  {currentProduct?.productName || "Pilih Produk"}
                </h2>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                  <span>HPP Saat Ini: <strong className="text-slate-200">{formatCurrency(currentProduct?.currentHpp || 0)}/pack</strong></span>
                  <span>•</span>
                  <span>Rekomendasi Jual: <strong className="text-emerald-400">{formatCurrency(currentProduct?.recommendedPrice || 0)}/pack</strong></span>
                </div>
              </div>

              {/* Input Angka Jumlah Pack (Contoh Input: 50 pack) */}
              <div className="flex flex-col gap-1.5 min-w-[200px]">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Jumlah Produksi (Pack):</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={5000}
                    value={batchQuantity || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setBatchQuantity(isNaN(val) ? 0 : Math.max(1, val));
                    }}
                    placeholder="Contoh: 50"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-slate-400">pack</span>
                </div>
                {/* Quick Presets */}
                <div className="flex items-center gap-1 mt-1">
                  {[25, 50, 100, 200].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setBatchQuantity(preset)}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        batchQuantity === preset
                          ? "bg-emerald-500 text-slate-950 font-extrabold"
                          : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Verification Box (Sisi Klien): Status Kelayakan Tiap Bahan Baku */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Sistem Pengecekan Kebutuhan Bahan (BOM Real-Time)</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Target Batch: <strong className="text-emerald-400">{batchQuantity} Pack</strong> @ 500g
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-400 mb-2" />
                  <span>Mengecek ketersediaan bahan baku di gudang...</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {feasibility?.ingredientsStatus.map((ing) => (
                    <div
                      key={ing.formulaId}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 ${
                        ing.isSufficient
                          ? "bg-slate-950/60 border-emerald-900/40 hover:border-emerald-700/60"
                          : "bg-rose-950/30 border-rose-800/60 hover:border-rose-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-100">
                            {ing.materialName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({ing.requiredPerPack} {ing.unit} / pack)
                          </span>
                        </div>

                        {/* Exact Status Output Format matching prompt */}
                        <div className="text-xs text-slate-300 mt-1 font-mono">
                          Dibutuhkan: <strong className="text-slate-100">{ing.requiredTotal} {ing.unit}</strong> | Stok Gudang: <span className={ing.isSufficient ? "text-slate-300" : "text-rose-400 font-bold"}>{ing.availableStock} {ing.unit}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <div className="text-[10px] text-slate-400">Subtotal Biaya</div>
                          <div className="text-xs font-mono font-semibold text-slate-200">
                            {formatCurrency(ing.subtotalCost)}
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                            ing.isSufficient
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800/80"
                              : "bg-rose-950 text-rose-300 border border-rose-800/80 animate-pulse"
                          }`}
                        >
                          {ing.isSufficient ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Cukup ✅</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5 text-rose-400" />
                              <span>Kurang ❌ ({Number((ing.requiredTotal - ing.availableStock).toFixed(2))} {ing.unit})</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Batch Notes Input */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                <span>Catatan Batch / Shift Operator:</span>
              </label>
              <input
                type="text"
                value={batchNotes}
                onChange={(e) => setBatchNotes(e.target.value)}
                placeholder="misal: Shift Pagi Tim 1 - Batch Olahan Daging Super"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Kalkulasi Biaya, HPP Moving Average & Tombol Eksekusi */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>Kalkulasi Biaya & HPP Real-time</span>
            </h3>

            <div className="space-y-3 divide-y divide-slate-800 text-xs">
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Rencana Batch:</span>
                <span className="font-bold text-slate-100">
                  {batchQuantity} Pack ({Number((batchQuantity * 0.5).toFixed(1))} Kg)
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <span className="text-slate-400">Total Biaya Bahan Baku:</span>
                <span className="font-mono font-bold text-slate-200">
                  {formatCurrency(feasibility?.totalBatchCost || 0)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <span className="text-slate-400">HPP Produksi Batch Ini:</span>
                <span className="font-mono font-extrabold text-emerald-400 text-base">
                  {formatCurrency(feasibility?.hppPerUnit || 0)} / pack
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <span className="text-slate-400">HPP Terupdate (Moving Avg):</span>
                <span className="font-mono font-bold text-amber-400">
                  {formatCurrency(feasibility?.newMovingAvgHpp || 0)} / pack
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <span className="text-slate-400">Rekomendasi Harga Jual:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatCurrency(currentProduct?.recommendedPrice || 0)}
                </span>
              </div>
            </div>

            {/* Verdict Box */}
            <div
              className={`p-3.5 rounded-xl border text-xs ${
                feasibility?.canProduce
                  ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                  : "bg-rose-950/40 border-rose-800/60 text-rose-300"
              }`}
            >
              {feasibility?.canProduce ? (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Seluruh Bahan Baku Cukup</span>
                    <span className="text-[11px] text-emerald-400/90">
                      Stok di gudang mencukupi untuk produksi {batchQuantity} pack.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Bahan Baku Tidak Cukup</span>
                    <span className="text-[11px] text-rose-300/90">
                      Beberapa komponen berstatus Kurang ❌. Tombol eksekusi dinonaktifkan.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Tombol Eksekusi: "Konfirmasi & Potong Stok" */}
            <button
              onClick={handleConfirmAndExecute}
              disabled={!feasibility?.canProduce || executing || loading}
              className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
                feasibility?.canProduce && !executing && !loading
                  ? "bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 shadow-emerald-950/60 cursor-pointer"
                  : "bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-60"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>
                {executing
                  ? "Memproses Potong Stok & Menambah Produk..."
                  : "Konfirmasi & Potong Stok"}
              </span>
            </button>
            {!feasibility?.canProduce && (
              <p className="text-[11px] text-center text-slate-500">
                Tombol hanya aktif jika seluruh bahan baku berstatus Cukup.
              </p>
            )}
          </div>

          {/* Success Banner if batch executed */}
          {lastExecutionResult && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500 shadow-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Konversi Produksi Berhasil!</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
                <div className="text-slate-400">No. Batch: <strong className="text-emerald-400">{lastExecutionResult.batchNumber}</strong></div>
                <div className="text-slate-400">Hasil Tambah: <strong className="text-slate-100">+{lastExecutionResult.outputQty} Pack {lastExecutionResult.outputItemName}</strong></div>
                <div className="text-slate-400">Total Stok Cold-Storage: <strong className="text-emerald-400">{lastExecutionResult.totalStockAfter} Pack</strong></div>
                <div className="text-slate-400">HPP Baru: <strong className="text-slate-200">{formatCurrency(lastExecutionResult.newHpp)}</strong></div>
              </div>
              <Link
                href="/admin/inventory"
                className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-semibold pt-1 text-[11px]"
              >
                <span>Lihat Tabel Nilai Aset Produk Beku di Inventaris</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
