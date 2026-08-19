"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter,
  Loader2,
  Boxes,
  Calendar,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  listStockMovementsAction,
  type StockMovementRecord,
  type StockMovementType,
  type StockReferenceType,
} from "@/app/actions/inventory";

export default function StockMovementsPage() {
  const [movements, setMovements] = useState<StockMovementRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [refFilter, setRefFilter] = useState<string>("all");

  const loadMovements = useCallback(() => {
    setLoading(true);
    listStockMovementsAction({
      type: typeFilter !== "all" ? (typeFilter as StockMovementType) : undefined,
      referenceType: refFilter !== "all" ? (refFilter as StockReferenceType) : undefined,
      limit: 200,
    })
      .then((data) => setMovements(data))
      .catch(() => setMovements([]))
      .finally(() => setLoading(false));
  }, [typeFilter, refFilter]);

  useEffect(() => {
    let ignore = false;
    listStockMovementsAction({
      type: typeFilter !== "all" ? (typeFilter as StockMovementType) : undefined,
      referenceType: refFilter !== "all" ? (refFilter as StockReferenceType) : undefined,
      limit: 200,
    })
      .then((data) => {
        if (!ignore) setMovements(data);
      })
      .catch(() => {
        if (!ignore) setMovements([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [typeFilter, refFilter]);

  const filteredMovements = movements.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.itemName?.toLowerCase().includes(q) ||
      m.itemSku?.toLowerCase().includes(q) ||
      m.referenceId?.toLowerCase().includes(q) ||
      m.notes?.toLowerCase().includes(q)
    );
  });

  const formatDate = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  const getMovementBadge = (type: string) => {
    if (type === "masuk") {
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 gap-1 font-mono text-[11px]">
          <ArrowDownLeft className="size-3" /> Stok Masuk
        </Badge>
      );
    }
    if (type === "keluar") {
      return (
        <Badge variant="destructive" className="gap-1 font-mono text-[11px]">
          <ArrowUpRight className="size-3" /> Stok Keluar
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 gap-1 font-mono text-[11px]">
        <RefreshCw className="size-3" /> Opnam / Penyesuaian
      </Badge>
    );
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
              <Link
                href="/inventaris"
                className="inline-flex items-center gap-1.5 text-xs text-gold/80 hover:text-gold font-medium mb-2 transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                Kembali ke Master Inventaris
              </Link>
              <h1 className="font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.25rem]">
                Riwayat Mutasi & Pergerakan Stok
              </h1>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/70">
                Log terperinci mengenai penerimaan stok masuk (GRN), pengeluaran stok (Invoice/PO), dan penyesuaian opnam fisik.
              </p>
            </div>

            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white gap-2 text-sm font-medium"
              asChild
            >
              <Link href="/inventaris">
                <Boxes className="size-4" />
                Master Inventaris
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto -mt-8 flex w-full max-w-6xl flex-col gap-6 px-5 pb-20 sm:px-8">
        {/* Controls Bar */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari barang, SKU, no. dokumen..."
              className="pl-9 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Filter className="size-3.5" /> Filter Mutasi:
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">Semua Jenis Mutasi</option>
              <option value="masuk">Stok Masuk (+)</option>
              <option value="keluar">Stok Keluar (-)</option>
              <option value="penyesuaian">Opnam Penyesuaian</option>
            </select>

            <select
              value={refFilter}
              onChange={(e) => setRefFilter(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">Semua Sumber Dokumen</option>
              <option value="grn">GRN (Goods Receipt)</option>
              <option value="invoice">Invoice Penjualan</option>
              <option value="po">PO (Purchase Order)</option>
              <option value="manual">Input Manual / Direct</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={loadMovements}
              title="Refresh"
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Movements Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center p-16 text-muted-foreground gap-2">
              <Loader2 className="size-5 animate-spin text-primary" />
              Memuat data riwayat mutasi stok...
            </div>
          ) : filteredMovements.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <ArrowLeftRight className="size-8 text-muted-foreground opacity-50" />
              <p className="mt-2 text-sm font-medium text-foreground">
                Tidak ada data mutasi stok ditemukan
              </p>
              <p className="text-xs text-muted-foreground">
                Coba sesuaikan kata kunci pencarian atau filter yang dipilih.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-foreground">
                <thead className="border-b border-border bg-muted/50 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3.5">Waktu Transaksi</th>
                    <th scope="col" className="px-4 py-3.5">Barang & SKU</th>
                    <th scope="col" className="px-4 py-3.5">Jenis Mutasi</th>
                    <th scope="col" className="px-4 py-3.5 text-right">Jumlah</th>
                    <th scope="col" className="px-4 py-3.5 text-right">Stok Akhir</th>
                    <th scope="col" className="px-4 py-3.5">Referensi Dokumen & Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMovements.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-muted-foreground font-mono">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5" />
                          {formatDate(m.createdAt)}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground text-sm">
                            {m.itemName}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            SKU: {m.itemSku}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getMovementBadge(m.type)}
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap font-mono font-bold text-base">
                        <span
                          className={
                            m.type === "masuk"
                              ? "text-emerald-700 dark:text-emerald-400"
                              : m.type === "keluar"
                              ? "text-rose-600"
                              : "text-amber-600"
                          }
                        >
                          {m.type === "masuk" ? "+" : m.type === "keluar" ? "-" : ""}
                          {m.quantity}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap font-mono font-bold text-foreground">
                        {m.balanceAfter}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-0.5 text-xs">
                          {m.referenceId ? (
                            <span className="font-mono font-semibold text-primary flex items-center gap-1">
                              <FileText className="size-3" />
                              [{m.referenceType.toUpperCase()}] {m.referenceId}
                            </span>
                          ) : (
                            <span className="font-mono text-muted-foreground">
                              [{m.referenceType.toUpperCase()}]
                            </span>
                          )}
                          {m.notes && (
                            <span className="text-muted-foreground text-xs">
                              {m.notes}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
