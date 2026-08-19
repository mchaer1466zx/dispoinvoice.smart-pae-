"use client";

import { useState } from "react";
import { Plus, Edit2, Loader2, Package } from "lucide-react";
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
  createInventoryItemAction,
  updateInventoryItemAction,
  type InventoryItemRecord,
  type InventoryItemInput,
} from "@/app/actions/inventory";

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemToEdit?: InventoryItemRecord | null;
}

const DEFAULT_CATEGORIES = [
  "General / Umum",
  "Bahan Baku / Komoditas",
  "Produk Jadi / Frozen Food",
  "Perlengkapan / Material",
  "Suku Cadang / Sparepart",
  "Kemasan / Packaging",
];

const DEFAULT_UNITS = ["pcs", "kg", "box", "unit", "ton", "pack", "meter", "liter", "roll", "dus"];

export function InventoryModal({
  isOpen,
  onClose,
  onSuccess,
  itemToEdit,
}: InventoryModalProps) {
  const isEdit = Boolean(itemToEdit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<InventoryItemInput>({
    sku: "",
    name: "",
    category: "General / Umum",
    unit: "pcs",
    minStock: 5,
    currentStock: 0,
    costPrice: 0,
    sellingPrice: 0,
    description: "",
  });

  const [prevItemToEdit, setPrevItemToEdit] = useState<InventoryItemRecord | null>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  if (itemToEdit !== prevItemToEdit || isOpen !== prevIsOpen) {
    setPrevItemToEdit(itemToEdit ?? null);
    setPrevIsOpen(isOpen);
    if (isOpen) {
      if (itemToEdit) {
        setFormData({
          sku: itemToEdit.sku,
          name: itemToEdit.name,
          category: itemToEdit.category,
          unit: itemToEdit.unit,
          minStock: itemToEdit.minStock,
          currentStock: itemToEdit.currentStock,
          costPrice: itemToEdit.costPrice,
          sellingPrice: itemToEdit.sellingPrice,
          description: itemToEdit.description || "",
        });
      } else {
        setFormData({
          sku: "",
          name: "",
          category: "General / Umum",
          unit: "pcs",
          minStock: 5,
          currentStock: 0,
          costPrice: 0,
          sellingPrice: 0,
          description: "",
        });
      }
      setError(null);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Nama Barang wajib diisi.");
      return;
    }

    const finalSku = formData.sku.trim() || `SKU-${1000 + (Date.now() % 9000)}`;
    const finalData = { ...formData, sku: finalSku };

    setLoading(true);
    setError(null);

    try {
      if (isEdit && itemToEdit) {
        const res = await updateInventoryItemAction(itemToEdit.id, finalData);
        if (res.success) {
          onSuccess();
          onClose();
        } else {
          setError(res.error);
        }
      } else {
        const res = await createInventoryItemAction(finalData);
        if (res.success) {
          onSuccess();
          onClose();
        } else {
          setError(res.error);
        }
      }
    } catch {
      setError("Terjadi kesalahan sistem saat menyimpan barang.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Package className="size-5 text-primary" />
            {isEdit ? "Edit Barang Inventaris" : "Tambah Barang Baru ke Inventaris"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEdit
              ? "Ubah data master barang, harga, dan batas stok minimum."
              : "Masukkan data master barang baru untuk dilacak stok masuk & keluar."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="sku">SKU / Kode Barang *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="misal: SKU-1001"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Kategori</Label>
              <div className="relative">
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Kategori barang"
                  list="category-suggestions"
                />
                <datalist id="category-suggestions">
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Barang *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Beras Premium Super 5kg / Pipa PVC 2 inch"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="unit">Satuan</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="pcs / kg / box"
                list="unit-suggestions"
              />
              <datalist id="unit-suggestions">
                {DEFAULT_UNITS.map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
            </div>

            {!isEdit && (
              <div className="space-y-1.5">
                <Label htmlFor="currentStock">Stok Awal</Label>
                <Input
                  id="currentStock"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.currentStock}
                  onChange={(e) =>
                    setFormData({ ...formData, currentStock: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="minStock">Batas Stok Minimum</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                step="any"
                value={formData.minStock}
                onChange={(e) =>
                  setFormData({ ...formData, minStock: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="costPrice">Harga Beli / HPP (Rp)</Label>
              <Input
                id="costPrice"
                type="number"
                min="0"
                step="any"
                value={formData.costPrice}
                onChange={(e) =>
                  setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sellingPrice">Harga Jual (Rp)</Label>
              <Input
                id="sellingPrice"
                type="number"
                min="0"
                step="any"
                value={formData.sellingPrice}
                onChange={(e) =>
                  setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Spesifikasi / Keterangan Tambahan</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Catatan spesifikasi, lokasi gudang, merk, atau informasi penting lainnya..."
            />
          </div>

          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isEdit ? (
                <Edit2 className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}
              {isEdit ? "Simpan Perubahan" : "Tambah Barang"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
