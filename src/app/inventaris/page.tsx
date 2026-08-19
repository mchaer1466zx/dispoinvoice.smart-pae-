"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Boxes,
  Plus,
  Search,
  Filter,
  ArrowLeftRight,
  AlertTriangle,
  PackageCheck,
  BadgeDollarSign,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InventoryTable } from "@/components/inventaris/inventory-table";
import { InventoryModal } from "@/components/inventaris/inventory-modal";
import { AdjustStockModal } from "@/components/inventaris/adjust-stock-modal";
import { ItemHistoryDialog } from "@/components/inventaris/item-history-dialog";
import { formatCurrency } from "@/lib/format";
import { BRAND } from "@/lib/brand";
import {
  listInventoryItemsAction,
  deleteInventoryItemAction,
  type InventoryItemRecord,
} from "@/app/actions/inventory";

export default function InventarisPage() {
  const [items, setItems] = useState<InventoryItemRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockStatusFilter, setStockStatusFilter] = useState<
    "all" | "low" | "out" | "available"
  >("all");

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItemRecord | null>(null);

  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [itemToAdjust, setItemToAdjust] = useState<InventoryItemRecord | null>(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [itemForHistory, setItemForHistory] = useState<InventoryItemRecord | null>(null);

  const [deleteCandidate, setDeleteCandidate] = useState<InventoryItemRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    listInventoryItemsAction({
      search,
      category: categoryFilter,
      stockStatus: stockStatusFilter,
    })
      .then((data) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [search, categoryFilter, stockStatusFilter]);

  useEffect(() => {
    let ignore = false;
    listInventoryItemsAction({
      search,
      category: categoryFilter,
      stockStatus: stockStatusFilter,
    })
      .then((data) => {
        if (!ignore) setItems(data);
      })
      .catch(() => {
        if (!ignore) setItems([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [search, categoryFilter, stockStatusFilter]);

  // Calculated Stats
  const totalItemTypes = items.length;
  const totalAvailableStock = items.reduce((acc, i) => acc + i.currentStock, 0);
  const lowStockCount = items.filter((i) => i.currentStock <= i.minStock).length;
  const totalAssetValue = items.reduce(
    (acc, i) => acc + i.currentStock * i.costPrice,
    0
  );

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(items.map((i) => i.category))).filter(
    Boolean
  );

  const handleOpenAdd = () => {
    setItemToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (item: InventoryItemRecord) => {
    setItemToEdit(item);
    setIsAddEditOpen(true);
  };

  const handleOpenAdjust = (item: InventoryItemRecord) => {
    setItemToAdjust(item);
    setIsAdjustOpen(true);
  };

  const handleOpenHistory = (item: InventoryItemRecord) => {
    setItemForHistory(item);
    setIsHistoryOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setDeleteLoading(true);
    try {
      const res = await deleteInventoryItemAction(deleteCandidate.id);
      if (res.success) {
        setDeleteCandidate(null);
        loadData();
      } else {
        alert(res.error || "Gagal menghapus barang.");
      }
    } catch {
      alert("Terjadi kesalahan saat menghapus barang.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-[#f7f4ec] dark:bg-black min-h-screen">
      {/* Header Masthead */}
      <header
        className="relative overflow-hidden border-b-2 border-gold/50 text-white"
        style={{
          background:
            "radial-gradient(120% 140% at 100% -20%, #0f5c2a 0%, #0b4d21 45%, #06331a 100%)",
        }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 pb-16 pt-10 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-gold/80 font-mono text-xs uppercase tracking-widest">
                <Boxes className="size-4" />
                <span>{BRAND.appName} — Logistik & Gudang</span>
              </div>
              <h1 className="mt-2 font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.25rem]">
                Manajemen Stok & Inventaris
              </h1>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/70">
                Pencatatan master data barang, batas stok minimum, serta pelacakan stok masuk dari Goods Receipt (GRN) dan stok keluar dari Invoice/PO.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white gap-2 text-sm font-medium"
                asChild
              >
                <Link href="/inventaris/mutasi">
                  <ArrowLeftRight className="size-4" />
                  Riwayat Mutasi Stok
                </Link>
              </Button>

              <Button
                onClick={handleOpenAdd}
                className="bg-gold text-primary hover:bg-gold-bright font-semibold gap-2 shadow-sm text-sm"
              >
                <Plus className="size-4" />
                Tambah Barang Baru
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto -mt-8 flex w-full max-w-6xl flex-col gap-6 px-5 pb-20 sm:px-8">
        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-t-2 border-border border-t-gold bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="font-mono text-xs uppercase tracking-wider">
                Total Jenis Barang
              </span>
              <Boxes className="size-4 text-primary" />
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-foreground">
              {totalItemTypes} <span className="text-sm font-normal text-muted-foreground">SKU</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Master barang terdaftar</p>
          </div>

          <div className="rounded-xl border border-t-2 border-border border-t-gold bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="font-mono text-xs uppercase tracking-wider">
                Total Kuantitas Stok
              </span>
              <PackageCheck className="size-4 text-emerald-600" />
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {totalAvailableStock.toLocaleString("id-ID")} <span className="text-sm font-normal text-muted-foreground">unit</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Tersedia di gudang</p>
          </div>

          <div className="rounded-xl border border-t-2 border-border border-t-gold bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="font-mono text-xs uppercase tracking-wider">
                Stok Tipis / Habis
              </span>
              <AlertTriangle className="size-4 text-amber-600" />
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-amber-600 dark:text-amber-400">
              {lowStockCount} <span className="text-sm font-normal text-muted-foreground">item</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Perlu pengadaan ulang (PR/PO)</p>
          </div>

          <div className="rounded-xl border border-t-2 border-border border-t-gold bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="font-mono text-xs uppercase tracking-wider">
                Nilai Aset Stok (HPP)
              </span>
              <BadgeDollarSign className="size-4 text-primary" />
            </div>
            <p className="mt-3 font-display text-xl font-bold text-foreground">
              {formatCurrency(totalAssetValue)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Estimasi modal persediaan</p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari SKU, Nama Barang, Kategori..."
              className="pl-9 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Filter className="size-3.5" /> Filter:
            </div>

            {/* Kategori Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Status Stok Filter */}
            <select
              value={stockStatusFilter}
              onChange={(e) =>
                setStockStatusFilter(
                  e.target.value as "all" | "low" | "out" | "available"
                )
              }
              className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">Semua Status Stok</option>
              <option value="available">Stok Aman</option>
              <option value="low">Stok Tipis (&le; Min)</option>
              <option value="out">Stok Habis (= 0)</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={loadData}
              title="Refresh Data"
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Table View */}
        {loading ? (
          <div className="flex items-center justify-center p-16 rounded-xl border border-border bg-card text-muted-foreground gap-2">
            <Loader2 className="size-5 animate-spin text-primary" />
            Memuat data stok barang...
          </div>
        ) : (
          <InventoryTable
            items={items}
            onEdit={handleOpenEdit}
            onAdjustStock={handleOpenAdjust}
            onViewHistory={handleOpenHistory}
            onDelete={(item) => setDeleteCandidate(item)}
          />
        )}
      </main>

      {/* Modals */}
      <InventoryModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSuccess={loadData}
        itemToEdit={itemToEdit}
      />

      <AdjustStockModal
        isOpen={isAdjustOpen}
        onClose={() => setIsAdjustOpen(false)}
        onSuccess={loadData}
        item={itemToAdjust}
      />

      <ItemHistoryDialog
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        item={itemForHistory}
      />

      {/* Confirm Delete Dialog */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-foreground">
              Konfirmasi Hapus Barang
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Apakah Anda yakin ingin menghapus{" "}
              <strong className="text-foreground">{deleteCandidate.name}</strong> ({deleteCandidate.sku}) dari master inventaris?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteCandidate(null)}
                disabled={deleteLoading}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="gap-2"
              >
                {deleteLoading && <Loader2 className="size-4 animate-spin" />}
                Hapus Permanen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
