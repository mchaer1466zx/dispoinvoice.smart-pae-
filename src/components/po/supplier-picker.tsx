"use client";

import { useId, useState } from "react";
import { Check, ChevronsUpDown, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MOCK_SUPPLIERS, type Supplier } from "@/lib/mock-data";

type PickerMode = "daftar" | "manual";

export function SupplierPicker({
  selected,
  onSelectedChange,
}: {
  selected: Supplier | null;
  onSelectedChange: (supplier: Supplier) => void;
}) {
  const idPrefix = useId();
  const [mode, setMode] = useState<PickerMode>("daftar");
  const [open, setOpen] = useState(false);
  const [manualForm, setManualForm] = useState({ name: "", contactInfo: "", address: "" });

  function updateManualField<K extends keyof typeof manualForm>(
    field: K,
    value: string
  ) {
    const next = { ...manualForm, [field]: value };
    setManualForm(next);
    onSelectedChange({
      id: `manual-${idPrefix}`,
      name: next.name,
      contactInfo: next.contactInfo,
      address: next.address,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemasok</CardTitle>
        <CardDescription>
          Pilih pemasok dari kontak tersimpan atau isi manual.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="inline-flex w-fit rounded-lg border p-1">
          <Button
            type="button"
            size="sm"
            variant={mode === "daftar" ? "default" : "ghost"}
            onClick={() => setMode("daftar")}
          >
            Dari Daftar Kontak
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "manual" ? "default" : "ghost"}
            onClick={() => setMode("manual")}
          >
            Input Manual
          </Button>
        </div>

        {mode === "daftar" ? (
          <>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between font-normal"
                >
                  {selected ? selected.name : "Pilih pemasok..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                  <CommandInput placeholder="Cari nama pemasok..." />
                  <CommandList>
                    <CommandEmpty>Pemasok tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {MOCK_SUPPLIERS.map((supplier) => (
                        <CommandItem
                          key={supplier.id}
                          value={supplier.name}
                          onSelect={() => {
                            onSelectedChange(supplier);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              selected?.id === supplier.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {supplier.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {selected ? (
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <Truck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="grid gap-0.5 text-sm">
                  <span className="font-medium">{selected.name}</span>
                  <span className="text-muted-foreground">{selected.contactInfo}</span>
                  <span className="text-muted-foreground">{selected.address}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Belum ada pemasok dipilih.
              </p>
            )}
          </>
        ) : (
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor={`${idPrefix}-manual-name`}>Nama Pemasok</Label>
              <Input
                id={`${idPrefix}-manual-name`}
                value={manualForm.name}
                onChange={(e) => updateManualField("name", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor={`${idPrefix}-manual-contact`}>Kontak</Label>
              <Input
                id={`${idPrefix}-manual-contact`}
                placeholder="Telepon / email"
                value={manualForm.contactInfo}
                onChange={(e) => updateManualField("contactInfo", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor={`${idPrefix}-manual-address`}>Alamat</Label>
              <Input
                id={`${idPrefix}-manual-address`}
                value={manualForm.address}
                onChange={(e) => updateManualField("address", e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
