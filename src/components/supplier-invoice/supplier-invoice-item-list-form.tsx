"use client";

import { useId, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

export type SupplierInvoiceItem = {
  id: string;
  group: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
};

export function createDefaultSupplierInvoiceItems(): SupplierInvoiceItem[] {
  return [{ id: "si-item-0", group: "", description: "", quantity: 1, unit: "", price: 0 }];
}

export function calculateSupplierInvoiceItemsTotal(items: SupplierInvoiceItem[]) {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

export function SupplierInvoiceItemListForm({
  items,
  onChange,
}: {
  items: SupplierInvoiceItem[];
  onChange: (items: SupplierInvoiceItem[]) => void;
}) {
  const idPrefix = useId();
  const [nextId, setNextId] = useState(1);

  function addItem() {
    const id = `si-item-${nextId}`;
    setNextId((n) => n + 1);
    const lastGroup = items[items.length - 1]?.group ?? "";
    onChange([
      ...items,
      { id, group: lastGroup, description: "", quantity: 1, unit: "", price: 0 },
    ]);
  }

  function removeItem(id: string) {
    if (items.length > 1) {
      onChange(items.filter((item) => item.id !== id));
    }
  }

  function updateItem<K extends keyof SupplierInvoiceItem>(
    id: string,
    field: K,
    value: SupplierInvoiceItem[K]
  ) {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  const total = calculateSupplierInvoiceItemsTotal(items);
  const hasValidItem = items.some((item) => item.description.trim());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Tagihan</CardTitle>
        <CardDescription>
          Rincian barang/jasa yang ditagih pemasok beserta jumlah & nilainya.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-12 items-end gap-2 border-b pb-4 last:border-b-0 last:pb-0"
          >
            <div className="col-span-12 grid gap-1.5">
              <Label htmlFor={`${idPrefix}-group-${item.id}`}>
                Kelompok (opsional, untuk tabel bertingkat)
              </Label>
              <Input
                id={`${idPrefix}-group-${item.id}`}
                placeholder="Misal: Material / Jasa"
                value={item.group}
                onChange={(e) => updateItem(item.id, "group", e.target.value)}
              />
            </div>

            <div className="col-span-12 grid gap-1.5 sm:col-span-5">
              <Label htmlFor={`${idPrefix}-desc-${item.id}`}>
                Deskripsi {index === 0 ? "" : `#${index + 1}`}
              </Label>
              <Input
                id={`${idPrefix}-desc-${item.id}`}
                placeholder="Nama barang/jasa yang ditagih"
                value={item.description}
                aria-invalid={
                  !hasValidItem && items.length === 1 ? true : undefined
                }
                onChange={(e) => updateItem(item.id, "description", e.target.value)}
              />
            </div>

            <div className="col-span-3 grid gap-1.5 sm:col-span-1">
              <Label htmlFor={`${idPrefix}-qty-${item.id}`}>Jml</Label>
              <Input
                id={`${idPrefix}-qty-${item.id}`}
                type="number"
                min={0}
                step="0.1"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(item.id, "quantity", Number(e.target.value) || 0)
                }
              />
            </div>

            <div className="col-span-3 grid gap-1.5 sm:col-span-1">
              <Label htmlFor={`${idPrefix}-unit-${item.id}`}>Sat</Label>
              <Input
                id={`${idPrefix}-unit-${item.id}`}
                placeholder="unit"
                value={item.unit}
                onChange={(e) => updateItem(item.id, "unit", e.target.value)}
              />
            </div>

            <div className="col-span-5 grid gap-1.5 sm:col-span-3">
              <Label htmlFor={`${idPrefix}-price-${item.id}`}>Harga</Label>
              <Input
                id={`${idPrefix}-price-${item.id}`}
                type="number"
                min={0}
                value={item.price}
                onChange={(e) =>
                  updateItem(item.id, "price", Number(e.target.value) || 0)
                }
              />
            </div>

            <div className="col-span-3 flex justify-end sm:col-span-1">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                aria-label="Hapus item"
                disabled={items.length === 1}
                onClick={() => removeItem(item.id)}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus /> Tambah Item
        </Button>

        {!hasValidItem ? (
          <p className="text-sm text-destructive">
            Minimal satu item dengan deskripsi wajib diisi.
          </p>
        ) : null}
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-base font-semibold">{formatCurrency(total)}</span>
      </CardFooter>
    </Card>
  );
}
