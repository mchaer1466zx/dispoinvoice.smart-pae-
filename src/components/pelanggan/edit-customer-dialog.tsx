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

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setForm(customer);
      setNameError(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      setNameError("Nama pelanggan wajib diisi.");
      return;
    }

    const updated: Customer = {
      id: customer.id,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    };

    onSave(updated);
    toast.success("Pelanggan diperbarui", {
      description: `Data ${updated.name} berhasil diperbarui.`,
    });
    setOpen(false);
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
            <Button type="submit">
              <Save /> Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
