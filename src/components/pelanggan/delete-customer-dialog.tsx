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
import { deleteCustomerAction } from "@/app/actions/customers";

export function DeleteCustomerDialog({
  customer,
  onConfirm,
}: {
  customer: Customer;
  onConfirm: (customerId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      const result = await deleteCustomerAction(customer.id);
      if (!result.success) {
        toast.error("Gagal menghapus", { description: result.error });
        return;
      }
      onConfirm(customer.id);
      toast.success("Pelanggan dihapus", {
        description: `${customer.name} telah dihapus dari daftar pelanggan.`,
      });
      setOpen(false);
    } catch {
      toast.error("Terjadi kesalahan", {
        description: "Tidak bisa menghapus pelanggan. Coba lagi.",
      });
    } finally {
      setIsDeleting(false);
    }
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
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            <Trash2 /> {isDeleting ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
