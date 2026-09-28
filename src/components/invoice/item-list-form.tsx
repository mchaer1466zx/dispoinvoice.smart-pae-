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

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
};

export function createDefaultItems(): InvoiceItem[] {
  return [{ id: "item-0", description: "", quantity: 1, price: 0 }];
}

export function calculateItemsTotal(items: InvoiceItem[]) {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

export function ItemListForm({
  items,
  onChange,
}: {
  items: InvoiceItem[];
  onChange: (items: InvoiceItem[]) => void;
}) {
  const idPrefix = useId();
  const [nextId, setNextId] = useState(1);

  function addItem() {
    const id = `item-${nextId}`;
    setNextId((n) => n + 1);
    onChange([...items, { id, description: "", quantity: 1, price: 0 }]);
  }

  function removeItem(id: string) {
    if (items.length > 1) {
      onChange(items.filter((item) => item.id !== id));
    }
  }

  function updateItem<K extends keyof InvoiceItem>(
    id: string,
    field: K,
    value: InvoiceItem[K]
  ) {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  const total = calculateItemsTotal(items);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Produk/Jasa</CardTitle>
        <CardDescription>
          Tambahkan rincian produk atau layanan beserta jumlahnya.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-12 items-end gap-2 border-b pb-4 last:border-b-0 last:pb-0"
          >
            <div className="col-span-12 grid gap-1.5 sm:col-span-6">
              <Label htmlFor={`${idPrefix}-desc-${item.id}`}>
                Deskripsi {index === 0 ? "" : `#${index + 1}`}
              </Label>
              <Input
                id={`${idPrefix}-desc-${item.id}`}
                placeholder="Nama produk atau jasa"
                value={item.description}
                onChange={(e) => updateItem(item.id, "description", e.target.value)}
              />
            </div>

            <div className="col-span-4 grid gap-1.5 sm:col-span-2">
              <Label htmlFor={`${idPrefix}-qty-${item.id}`}>Jumlah</Label>
              <Input
                id={`${idPrefix}-qty-${item.id}`}
                type="number"
                min={0}
                value={item.quantity}
                onChange={(e) =>
                  updateItem(item.id, "quantity", Number(e.target.value) || 0)
                }
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
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-base font-semibold">{formatCurrency(total)}</span>
      </CardFooter>
    </Card>
  );
}
