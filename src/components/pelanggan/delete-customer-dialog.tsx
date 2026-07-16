"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Customer } from "@/lib/mock-data";

export function DeleteCustomerDialog({
  customer,
  onConfirm,
}: {
  customer: Customer;
  onConfirm: (customerId: string) => void;
}) {
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    onConfirm(customer.id);
    toast.success("Pelanggan dihapus", {
      description: `${customer.name} telah dihapus dari daftar pelanggan.`,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Trash2 /> Hapus
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Pelanggan</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus <strong>{customer.name}</strong> dari daftar
            pelanggan? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            <Trash2 /> Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
