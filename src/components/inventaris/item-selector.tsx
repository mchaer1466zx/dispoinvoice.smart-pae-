"use client";

import { useEffect, useState } from "react";
import { Package, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  listInventoryItemsAction,
  type InventoryItemRecord,
} from "@/app/actions/inventory";

interface ItemSelectorProps {
  onSelectItem: (item: InventoryItemRecord) => void;
  className?: string;
}

export function ItemSelector({ onSelectItem, className }: ItemSelectorProps) {
  const [items, setItems] = useState<InventoryItemRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let active = true;
    listInventoryItemsAction()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className={`relative ${className || ""}`}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2 text-xs border-dashed border-primary/50 text-primary hover:bg-primary/5"
        >
          <Package className="size-3.5" />
          Pilih dari Master Stok
          <ChevronsUpDown className="size-3 text-muted-foreground ml-1" />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-1 max-h-60 w-72 overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center p-3 text-xs text-muted-foreground gap-1.5">
              <Loader2 className="size-3.5 animate-spin" />
              Memuat master stok...
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              <div className="px-2 py-1 text-[11px] font-mono uppercase text-muted-foreground border-b border-border">
                Pilih Barang Master
              </div>
              {items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => {
                    onSelectItem(it);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between rounded px-2 py-1.5 text-left text-xs hover:bg-accent transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{it.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      SKU: {it.sku} | Stok: {it.currentStock} {it.unit}
                    </span>
                  </div>
                  <Check className="size-3.5 text-primary opacity-0 hover:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
