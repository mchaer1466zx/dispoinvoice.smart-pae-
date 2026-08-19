"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  X,
  Factory,
  RefreshCw,
  Save,
  Warehouse,
  Coins,
  PackageCheck,
  Scale,
} from "lucide-react";
import { toast } from "sonner";
import {
  listInventoryItemsAction,
  createInventoryItemAction,
  adjustStockAction,
  type InventoryItemRecord,
  type InventoryItemInput,
  type StockMovementType,
} from "@/app/actions/inventory";
import {
  getProductionMasterDataAction,
  quickRestockRawMaterialsAction,
  type FinishedGoodItem,
  type RawMaterialItem,
} from "@/app/actions/production";
import { formatCurrency } from "@/lib/utils";

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItemRecord[]>([]);
  const [finishedGoodsList, setFinishedGoodsList] = useState<FinishedGoodItem[]>([]);
  const [rawMaterialsList, setRawMaterialsList] = useState<RawMaterialItem[]>([]);
  const [, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tabFilter, setTabFilter] = useState<"cold_storage" | "raw_materials" | "all">("cold_storage");

  // State Modal Tambah Item
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<InventoryItemInput>({
    sku: "",
    name: "",
    category: "Bahan Baku",
    unit: "kg",
    minStock: 10,
    currentStock: 0,
    costPrice: 0,
    sellingPrice: 0,
    description: "",
  });

  // State Modal Mutasi Stok Cepat
  const [adjustingItem, setAdjustingItem] = useState<InventoryItemRecord | null>(null);
  const [adjustType, setAdjustType] = useState<StockMovementType>("masuk");
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustNotes, setAdjustNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    try {
      const [invData, prodMaster] = await Promise.all([
        listInventoryItemsAction(),
        getProductionMasterDataAction(),
      ]);
      setItems(invData);
      setFinishedGoodsList(prodMaster.finishedGoodsList);
      setRawMaterialsList(prodMaster.rawMaterialsList);
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const [invData, prodMaster] = await Promise.all([
          listInventoryItemsAction(),
          getProductionMasterDataAction(),
        ]);
        if (active) {
          setItems(invData);
          setFinishedGoodsList(prodMaster.finishedGoodsList);
          setRawMaterialsList(prodMaster.rawMaterialsList);
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

  // Total Valuasi Cold-Storage
  const totalColdStorageValue = finishedGoodsList.reduce(
    (sum, fg) => sum + fg.currentStock * fg.currentHpp,
    0
  );
  const totalColdStoragePacks = finishedGoodsList.reduce(
    (sum, fg) => sum + fg.currentStock,
    0
  );

  // Total Valuasi Raw Material
  const totalRawMaterialValue = rawMaterialsList.reduce(
    (sum, rm) => sum + rm.stockQuantity * rm.lastPurchasePrice,
    0
  );

  async function handleCreateItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.sku || !newItem.name) {
      toast.error("SKU dan Nama Barang wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createInventoryItemAction(newItem);
      if (res.success) {
        toast.success(`Berhasil menambahkan ${res.item.name}`);
        setShowAddModal(false);
        setNewItem({
          sku: "",
          name: "",
          category: "Bahan Baku",
          unit: "kg",
          minStock: 10,
          currentStock: 0,
          costPrice: 0,
          sellingPrice: 0,
          description: "",
        });
        await loadData();
      } else {
        toast.error(res.error || "Gagal menambahkan item");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAdjustStock(e: React.FormEvent) {
    e.preventDefault();
    if (!adjustingItem || adjustQty <= 0) {
      toast.error("Jumlah penyesuaian stok harus lebih dari 0");
      return;
    }

    setSubmitting(true);
    try {
      const res = await adjustStockAction({
        inventoryItemId: adjustingItem.id,
        type: adjustType,
        quantity: adjustQty,
        notes: adjustNotes || `Penyesuaian stok manual via Admin Panel`,
      });

      if (res.success) {
        toast.success(`Stok ${adjustingItem.name} berhasil diperbarui`);
        setAdjustingItem(null);
        setAdjustNotes("");
        setAdjustQty(10);
        await loadData();
      } else {
        toast.error(res.error || "Gagal menyesuaikan stok");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleQuickRestock() {
    try {
      const res = await quickRestockRawMaterialsAction();
      toast.success(res.message);
      await loadData();
    } catch {
      toast.error("Gagal melakukan restock bahan baku");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-semibold mb-2">
              <Warehouse className="w-3.5 h-3.5" />
              <span>Logistik Cold-Storage & Pelacakan Nilai HPP Aset</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Manajemen Inventaris Pabrik WIRIDAN 318
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Pelacakan kuantitas fisik di cold-storage, HPP real-time hasil formulasi belanja bahan baku, rekomendasi margin jual, dan mutasi stok.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleQuickRestock}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Restock Bahan Cepat</span>
            </button>
            <Link
              href="/admin/produksi"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/60"
            >
              <Factory className="w-3.5 h-3.5 text-slate-950" />
              <span>Eksekusi Formulasi Batch</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Valuasi Stok Cold-Storage</span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1">
              {formatCurrency(totalColdStorageValue)}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Total {totalColdStoragePacks} pack produk beku siap kirim
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Valuasi Bahan Baku Gudang</span>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-1">
              {formatCurrency(totalRawMaterialValue)}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Daging, bumbu, tepung & kemasan
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Nilai Gabungan Gudang</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-1">
              {formatCurrency(totalColdStorageValue + totalRawMaterialValue)}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Aset lancar persediaan pabrik
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <Warehouse className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTabFilter("cold_storage")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tabFilter === "cold_storage"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            Pelacakan Aset Cold-Storage ({finishedGoodsList.length})
          </button>
          <button
            onClick={() => setTabFilter("raw_materials")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tabFilter === "raw_materials"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            Stok Bahan Baku & Kemasan ({rawMaterialsList.length})
          </button>
          <button
            onClick={() => setTabFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tabFilter === "all"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            Semua Master Inventaris ({items.length})
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk / bahan baku..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* 1. SECTION: TABEL RINGKAS PELACAKAN NILAI ASET PRODUK BEKU COLD-STORAGE */}
      {tabFilter === "cold_storage" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-100">
                Tabel Pelacakan Nilai Aset Produk Beku WIRIDAN 318 (Cold-Storage)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Standar Suhu: -18°C s/d -22°C
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-4">Nama Varian Produk WIRIDAN 318</th>
                  <th className="py-3.5 px-4 text-center">Jumlah Fisik di Cold-Storage</th>
                  <th className="py-3.5 px-4">Nilai HPP Real-Time</th>
                  <th className="py-3.5 px-4">Rekomendasi Harga Jual</th>
                  <th className="py-3.5 px-4">Target Margin</th>
                  <th className="py-3.5 px-4 text-right">Total Valuasi Stok</th>
                  <th className="py-3.5 px-4 text-center">Aksi Formulasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 bg-slate-900/40">
                {finishedGoodsList
                  .filter((fg) =>
                    search.trim() === "" ||
                    fg.productName.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((fg) => {
                    const margin =
                      fg.recommendedPrice > 0
                        ? Math.round(((fg.recommendedPrice - fg.currentHpp) / fg.recommendedPrice) * 100)
                        : 0;
                    const itemValuation = fg.currentStock * fg.currentHpp;

                    return (
                      <tr key={fg.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-100 text-sm">{fg.productName}</div>
                          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                            Kemasan Pack 500g • Halal MUI / BPOM RI
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-950 border border-slate-700 text-slate-100 font-mono">
                            <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
                            {fg.currentStock} Pack
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-slate-200">
                            {formatCurrency(fg.currentHpp)}
                          </div>
                          <div className="text-[10px] text-slate-500">per pack 500g</div>
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-emerald-400">
                            {formatCurrency(fg.recommendedPrice)}
                          </div>
                          <div className="text-[10px] text-slate-500">harga eceran / mitra</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                            +{margin}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-100 text-sm">
                          {formatCurrency(itemValuation)}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <Link
                            href={`/admin/produksi`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 text-xs font-bold transition-all"
                          >
                            <Factory className="w-3.5 h-3.5" />
                            <span>Produksi Batch</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SECTION: TABEL STOK BAHAN BAKU & KEMASAN */}
      {tabFilter === "raw_materials" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-slate-100">
                Stok Bahan Baku & Kemasan Gudang (Siap Olah)
              </h2>
            </div>
            <button
              onClick={handleQuickRestock}
              className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Isi Ulang Semua Bahan (+Stok)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Nama Bahan / Komponen</th>
                  <th className="py-3 px-4 text-center">Stok Gudang</th>
                  <th className="py-3 px-4">Harga Beli Terakhir (Nota)</th>
                  <th className="py-3 px-4 text-right">Total Nilai Bahan</th>
                  <th className="py-3 px-4 text-center">Status Kelayakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 bg-slate-900/40">
                {rawMaterialsList
                  .filter((rm) =>
                    search.trim() === "" ||
                    rm.materialName.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((rm) => {
                    const isLow = rm.stockQuantity <= 15;
                    const subtotal = rm.stockQuantity * rm.lastPurchasePrice;

                    return (
                      <tr key={rm.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-200">{rm.materialName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Bahan Baku Olahan Pabrik</div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                              isLow
                                ? "bg-rose-950 text-rose-300 border border-rose-800"
                                : "bg-slate-950 text-slate-200 border border-slate-800"
                            }`}
                          >
                            {rm.stockQuantity} {rm.unit}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-slate-300">
                          {formatCurrency(rm.lastPurchasePrice)} / {rm.unit}
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-100">
                          {formatCurrency(subtotal)}
                        </td>

                        <td className="py-3 px-4 text-center">
                          {!isLow ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Aman</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                              <AlertCircle className="w-3 h-3 text-rose-400" />
                              <span>Menipis</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SECTION: SEMUA MASTER INVENTARIS */}
      {tabFilter === "all" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100">Daftar Lengkap Master SKU & Mutasi Stok</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Master Item</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">SKU / Nama Barang</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4 text-center">Stok Saat Ini</th>
                  <th className="py-3 px-4">Harga HPP</th>
                  <th className="py-3 px-4">Harga Jual</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 bg-slate-900/40">
                {items
                  .filter((i) =>
                    search.trim() === "" ||
                    i.name.toLowerCase().includes(search.toLowerCase()) ||
                    i.sku.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-200">{item.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">{item.sku}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{item.category}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-100">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {formatCurrency(item.costPrice)}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                        {formatCurrency(item.sellingPrice)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setAdjustingItem(item)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition-all cursor-pointer"
                        >
                          Sesuaikan Stok
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Mutasi Stok */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Penyesuaian Mutasi Stok</h3>
                <p className="text-xs text-slate-400">{adjustingItem.name} ({adjustingItem.sku})</p>
              </div>
              <button
                onClick={() => setAdjustingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Jenis Pergerakan Stok</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as StockMovementType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="masuk">Stok Masuk (Penerimaan / Belanja Bahan)</option>
                  <option value="keluar">Stok Keluar (Penggunaan / Penjualan)</option>
                  <option value="penyesuaian">Audit Fisik (Set Ulang Kuantitas)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Kuantitas ({adjustingItem.unit})</label>
                <input
                  type="number"
                  min={1}
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Catatan / Alasan</label>
                <input
                  type="text"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  placeholder="misal: Nota Belanja Pasar / Stock Opname"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Penyesuaian</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Item Master */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">Tambah Master Item Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">SKU / Kode Barang *</label>
                  <input
                    type="text"
                    required
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value.toUpperCase() })}
                    placeholder="misal: RAW-DGG-01"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Kategori</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Bahan Baku">Bahan Baku (Raw)</option>
                    <option value="Bahan Penolong">Bahan Penolong</option>
                    <option value="Kemasan">Kemasan & Plastik</option>
                    <option value="Bakso & Frozen Food">Produk Jadi (Finished Good)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Nama Barang / Komponen *</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="misal: Daging Sapi Paha Belakang"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Satuan (Unit)</label>
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    placeholder="kg / pcs / pack"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Stok Awal</label>
                  <input
                    type="number"
                    value={newItem.currentStock}
                    onChange={(e) => setNewItem({ ...newItem, currentStock: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Stok Minimum (Alert)</label>
                  <input
                    type="number"
                    value={newItem.minStock}
                    onChange={(e) => setNewItem({ ...newItem, minStock: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Harga Pokok (HPP / Beli)</label>
                  <input
                    type="number"
                    value={newItem.costPrice}
                    onChange={(e) => setNewItem({ ...newItem, costPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Harga Jual Rekomendasi</label>
                  <input
                    type="number"
                    value={newItem.sellingPrice}
                    onChange={(e) => setNewItem({ ...newItem, sellingPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
