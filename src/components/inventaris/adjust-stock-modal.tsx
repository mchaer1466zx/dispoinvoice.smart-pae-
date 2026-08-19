"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, RefreshCw, Loader2, Boxes } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  adjustStockAction,
  type InventoryItemRecord,
  type StockMovementType,
  type StockReferenceType,
} from "@/app/actions/inventory";

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: InventoryItemRecord | null;
}

export function AdjustStockModal({
  isOpen,
  onClose,
  onSuccess,
  item,
}: AdjustStockModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<StockMovementType>("masuk");
  const [quantity, setQuantity] = useState<number>(1);
  const [referenceType, setReferenceType] = useState<StockReferenceType>("manual");
  const [referenceId, setReferenceId] = useState("");
  const [notes, setNotes] = useState("");

  if (!item) return null;

  const handleTypeChange = (newType: StockMovementType) => {
    setType(newType);
    if (newType === "penyesuaian") {
      setQuantity(item.currentStock);
    } else if (quantity <= 0) {
      setQuantity(1);
    }
  };

  const calculatedNewStock = () => {
    const qty = Number(quantity) || 0;
    if (type === "masuk") return item.currentStock + qty;
    if (type === "keluar") return Math.max(0, item.currentStock - qty);
    if (type === "penyesuaian") return qty;
    return item.currentStock;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0 && type !== "penyesuaian") {
      setError("Jumlah mutasi harus lebih besar dari 0.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await adjustStockAction({
        inventoryItemId: item.id,
        type,
        quantity: Number(quantity),
        referenceType,
        referenceId: referenceId.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error);
      }
    } catch {
      setError("Gagal memperbarui stok barang.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Boxes className="size-5 text-primary" />
            Input & Penyesuaian Stok
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {item.name} ({item.sku}) — Stok Saat Ini:{" "}
            <span className="font-bold text-foreground">
              {item.currentStock} {item.unit}
            </span>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-1">
          {/* Opsi Jenis Mutasi */}
          <div className="space-y-1.5">
            <Label>Jenis Perubahan Stok</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange("masuk")}
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition-all ${
                  type === "masuk"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500 shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:bg-accent"
                }`}
              >
                <ArrowDownLeft className="size-4 text-emerald-600" />
                Stok Masuk
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange("keluar")}
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition-all ${
                  type === "keluar"
                    ? "border-rose-600 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-500 shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:bg-accent"
                }`}
              >
                <ArrowUpRight className="size-4 text-rose-600" />
                Stok Keluar
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange("penyesuaian")}
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition-all ${
                  type === "penyesuaian"
                    ? "border-amber-600 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-500 shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:bg-accent"
                }`}
              >
                <RefreshCw className="size-4 text-amber-600" />
                Opnam Fisik
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quantity">
              {type === "penyesuaian"
                ? "Jumlah Stok Hasil Opnam (Set Stok Baru)"
                : `Jumlah (${item.unit})`}
            </Label>
            <Input
              id="quantity"
              type="number"
              min={type === "penyesuaian" ? "0" : "0.01"}
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          {/* Preview Hasil Stok */}
          <div className="rounded-lg border border-border bg-muted/40 p-3 flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Estimasi Stok Akhir:</span>
            <span className="font-mono font-bold text-foreground text-base">
              {calculatedNewStock()} {item.unit}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="referenceType">Referensi Dokumen</Label>
              <select
                id="referenceType"
                value={referenceType}
                onChange={(e) => setReferenceType(e.target.value as StockReferenceType)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="manual">Manual / Direct Input</option>
                <option value="grn">Penerimaan GRN</option>
                <option value="invoice">Invoice Penjualan</option>
                <option value="po">Purchase Order (PO)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="referenceId">No. Dokumen (Opsional)</Label>
              <Input
                id="referenceId"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                placeholder="GRN-001 / INV-001"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Catatan / Alasan Mutasi</Label>
            <Textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Misal: Penerimaan tambahan dari pemasok / Barang rusak / Stock opnam rutin"
            />
          </div>

          <DialogFooter className="mt-3 flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Simpan Mutasi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const StockAdjustmentModal = AdjustStockModal;
