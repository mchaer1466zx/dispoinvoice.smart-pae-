"use client";

import {
  Boxes,
  Edit,
  Trash2,
  History,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { InventoryItemRecord } from "@/app/actions/inventory";

interface InventoryTableProps {
  items: InventoryItemRecord[];
  onEdit: (item: InventoryItemRecord) => void;
  onAdjustStock: (item: InventoryItemRecord) => void;
  onViewHistory: (item: InventoryItemRecord) => void;
  onDelete: (item: InventoryItemRecord) => void;
}

export function InventoryTable({
  items,
  onEdit,
  onAdjustStock,
  onViewHistory,
  onDelete,
}: InventoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center bg-card">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Boxes className="size-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          Belum ada barang di inventaris
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Klik tombol &quot;Tambah Barang Baru&quot; di atas untuk mulai mencatat master stok barang dan memantau pergerakan stok dari dokumen pengadaan.
        </p>
      </div>
    );
  }

  const getStockBadge = (item: InventoryItemRecord) => {
    if (item.currentStock <= 0) {
      return (
        <Badge variant="destructive" className="gap-1 font-mono text-[11px]">
          <XCircle className="size-3" /> Stok Habis
        </Badge>
      );
    }
    if (item.currentStock <= item.minStock) {
      return (
        <Badge className="gap-1 bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 font-mono text-[11px]">
          <AlertTriangle className="size-3" /> Stok Tipis (&le; {item.minStock})
        </Badge>
      );
    }
    return (
      <Badge className="gap-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 font-mono text-[11px]">
        <CheckCircle2 className="size-3" /> Aman
      </Badge>
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-foreground">
          <thead className="border-b border-border bg-muted/50 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3.5">SKU & Barang</th>
              <th scope="col" className="px-4 py-3.5">Kategori</th>
              <th scope="col" className="px-4 py-3.5 text-center">Status Stok</th>
              <th scope="col" className="px-4 py-3.5 text-right">Harga HPP</th>
              <th scope="col" className="px-4 py-3.5 text-right">Harga Jual</th>
              <th scope="col" className="px-4 py-3.5 text-right">Total Nilai Stok</th>
              <th scope="col" className="px-4 py-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => {
              const totalAssetValue = item.currentStock * item.costPrice;
              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-muted/30 group"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                          {item.sku}
                        </span>
                        <span className="font-semibold text-foreground text-sm">
                          {item.name}
                        </span>
                      </div>
                      {item.description && (
                        <span className="mt-1 text-xs text-muted-foreground line-clamp-1">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-md bg-accent/60 px-2 py-1 text-xs font-medium text-accent-foreground">
                      {item.category}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-mono text-base font-bold text-foreground">
                        {item.currentStock}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          {item.unit}
                        </span>
                      </span>
                      {getStockBadge(item)}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-right whitespace-nowrap font-mono text-xs">
                    {formatCurrency(item.costPrice)}
                  </td>

                  <td className="px-4 py-3.5 text-right whitespace-nowrap font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(item.sellingPrice)}
                  </td>

                  <td className="px-4 py-3.5 text-right whitespace-nowrap font-mono text-xs font-bold text-foreground">
                    {formatCurrency(totalAssetValue)}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Input / Adjust Stok"
                        onClick={() => onAdjustStock(item)}
                        className="h-8 px-2 text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 dark:text-emerald-400"
                      >
                        <PlusCircle className="size-3.5 mr-1" />
                        Stok
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        title="Riwayat Mutasi"
                        onClick={() => onViewHistory(item)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <History className="size-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit Master Barang"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="size-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        title="Hapus Barang"
                        onClick={() => onDelete(item)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
