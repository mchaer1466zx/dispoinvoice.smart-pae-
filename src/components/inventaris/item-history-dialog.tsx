"use client";

import { useEffect, useState } from "react";
import { History, ArrowDownLeft, ArrowUpRight, RefreshCw, Loader2, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  listStockMovementsAction,
  type InventoryItemRecord,
  type StockMovementRecord,
} from "@/app/actions/inventory";

interface ItemHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItemRecord | null;
}

export function ItemHistoryDialog({
  isOpen,
  onClose,
  item,
}: ItemHistoryDialogProps) {
  const [loading, setLoading] = useState(false);
  const [movements, setMovements] = useState<StockMovementRecord[]>([]);

  useEffect(() => {
    let ignore = false;
    if (item && isOpen) {
      listStockMovementsAction({ inventoryItemId: item.id, limit: 100 })
        .then((data) => {
          if (!ignore) setMovements(data);
        })
        .catch(() => {
          if (!ignore) setMovements([]);
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    }
    return () => {
      ignore = true;
    };
  }, [item, isOpen]);

  if (!item) return null;

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
          <ArrowDownLeft className="size-3" /> Masuk
        </Badge>
      );
    }
    if (type === "keluar") {
      return (
        <Badge variant="destructive" className="gap-1 font-mono text-[11px]">
          <ArrowUpRight className="size-3" /> Keluar
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <History className="size-5 text-primary" />
            Riwayat Mutasi Stok
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {item.name} ({item.sku}) — Stok Saat Ini:{" "}
            <span className="font-bold text-foreground">
              {item.currentStock} {item.unit}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 max-h-[60vh] overflow-y-auto rounded-lg border border-border bg-card">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground gap-2">
              <Loader2 className="size-5 animate-spin text-primary" />
              Memuat data mutasi...
            </div>
          ) : movements.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Belum ada catatatan mutasi stok untuk barang ini.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/50 font-mono uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3.5 py-2.5">Waktu</th>
                  <th className="px-3.5 py-2.5">Jenis</th>
                  <th className="px-3.5 py-2.5 text-right">Jumlah</th>
                  <th className="px-3.5 py-2.5 text-right">Sisa Stok</th>
                  <th className="px-3.5 py-2.5">Referensi Dokumen & Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/20">
                    <td className="px-3.5 py-2.5 whitespace-nowrap text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(m.createdAt)}
                      </div>
                    </td>

                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      {getMovementBadge(m.type)}
                    </td>

                    <td className="px-3.5 py-2.5 text-right font-mono font-bold whitespace-nowrap">
                      {m.type === "masuk" ? "+" : m.type === "keluar" ? "-" : ""}
                      {m.quantity} {item.unit}
                    </td>

                    <td className="px-3.5 py-2.5 text-right font-mono font-semibold text-foreground whitespace-nowrap">
                      {m.balanceAfter} {item.unit}
                    </td>

                    <td className="px-3.5 py-2.5">
                      <div className="flex flex-col gap-0.5">
                        {m.referenceId ? (
                          <span className="font-mono font-semibold text-primary">
                            [{m.referenceType.toUpperCase()}] {m.referenceId}
                          </span>
                        ) : (
                          <span className="font-mono text-muted-foreground">
                            [{m.referenceType.toUpperCase()}]
                          </span>
                        )}
                        {m.notes && (
                          <span className="text-muted-foreground text-[11px]">
                            {m.notes}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
