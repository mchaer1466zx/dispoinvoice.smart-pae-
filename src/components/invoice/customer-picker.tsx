"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, User } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { MOCK_CUSTOMERS, type Customer } from "@/lib/mock-data";

export function CustomerPicker({
  selected,
  onSelectedChange,
}: {
  selected: Customer | null;
  onSelectedChange: (customer: Customer) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pelanggan</CardTitle>
        <CardDescription>Pilih pelanggan yang akan ditagih.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal"
            >
              {selected ? selected.name : "Pilih pelanggan..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command>
              <CommandInput placeholder="Cari nama pelanggan..." />
              <CommandList>
                <CommandEmpty>Pelanggan tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {MOCK_CUSTOMERS.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      value={customer.name}
                      onSelect={() => {
                        onSelectedChange(customer);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          selected?.id === customer.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {customer.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selected ? (
          <div className="flex items-start gap-3 rounded-lg border p-3">
            <User className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="grid gap-0.5 text-sm">
              <span className="font-medium">{selected.name}</span>
              <span className="text-muted-foreground">{selected.email}</span>
              <span className="text-muted-foreground">{selected.phone}</span>
              <span className="text-muted-foreground">{selected.address}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Belum ada pelanggan dipilih.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
