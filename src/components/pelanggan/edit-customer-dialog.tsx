"use client";

import { useState } from "react";
import { Pencil, Save } from "lucide-react";
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
import { CustomerFormFields } from "@/components/pelanggan/customer-form-fields";
import type { Customer } from "@/lib/mock-data";
import { updateCustomerAction } from "@/app/actions/customers";

export function EditCustomerDialog({
  customer,
  onSave,
}: {
  customer: Customer;
  onSave: (customer: Customer) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Customer>(customer);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setForm(customer);
      setNameError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      setNameError("Nama pelanggan wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateCustomerAction(customer.id, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      });
      if (!result.success) {
        setNameError(result.error);
        toast.error("Gagal memperbarui", { description: result.error });
        return;
      }

      onSave(result.customer);
      toast.success("Pelanggan diperbarui", {
        description: `Data ${result.customer.name} berhasil diperbarui.`,
      });
      setOpen(false);
    } catch {
      toast.error("Terjadi kesalahan", {
        description: "Tidak bisa memperbarui pelanggan. Coba lagi.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Pencil /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Pelanggan</DialogTitle>
            <DialogDescription>
              Perbarui data {customer.name}.
            </DialogDescription>
          </DialogHeader>

          <CustomerFormFields
            value={form}
            onChange={(value) => {
              setForm({ ...form, ...value });
              if (nameError) setNameError(null);
            }}
            nameError={nameError}
          />

          <DialogFooter>
            <Button type="submit" disabled={isSaving}>
              <Save /> {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
