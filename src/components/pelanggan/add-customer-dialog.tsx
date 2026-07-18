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
import { createCustomerAction } from "@/app/actions/customers";

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
  const [isSaving, setIsSaving] = useState(false);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setForm(createEmptyForm());
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
      const result = await createCustomerAction(form);
      if (!result.success) {
        setNameError(result.error);
        toast.error("Gagal menambah pelanggan", { description: result.error });
        return;
      }

      onAdd(result.customer);
      toast.success("Pelanggan ditambahkan", {
        description: `${result.customer.name} berhasil disimpan ke database.`,
      });
      handleOpenChange(false);
    } catch {
      toast.error("Terjadi kesalahan", {
        description: "Tidak bisa menyimpan pelanggan. Coba lagi.",
      });
    } finally {
      setIsSaving(false);
    }
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
            <Button type="submit" disabled={isSaving}>
              <Plus /> {isSaving ? "Menyimpan..." : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
