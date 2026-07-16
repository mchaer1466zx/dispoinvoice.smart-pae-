"use client";

import { useState } from "react";
import { Plus, UserPlus } from "lucide-react";
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
import {
  CustomerFormFields,
  type CustomerFormValues,
} from "@/components/pelanggan/customer-form-fields";
import type { Customer } from "@/lib/mock-data";

function createEmptyForm(): CustomerFormValues {
  return { name: "", email: "", phone: "", address: "" };
}

export function AddCustomerDialog({
  onAdd,
}: {
  onAdd: (customer: Customer) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CustomerFormValues>(createEmptyForm);
  const [nameError, setNameError] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setForm(createEmptyForm());
      setNameError(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      setNameError("Nama pelanggan wajib diisi.");
      return;
    }

    onAdd({
      id: `cust-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    });

    toast.success("Pelanggan ditambahkan", {
      description: `${form.name.trim()} berhasil ditambahkan ke daftar pelanggan.`,
    });
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button">
          <UserPlus /> Tambah Pelanggan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Pelanggan</DialogTitle>
            <DialogDescription>
              Isi data pelanggan baru untuk ditambahkan ke daftar.
            </DialogDescription>
          </DialogHeader>

          <CustomerFormFields
            value={form}
            onChange={(value) => {
              setForm(value);
              if (nameError) setNameError(null);
            }}
            nameError={nameError}
          />

          <DialogFooter>
            <Button type="submit">
              <Plus /> Tambah
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
