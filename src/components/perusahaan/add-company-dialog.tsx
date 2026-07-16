"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, Plus } from "lucide-react";
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
  CompanyFormFields,
  type CompanyFormValues,
} from "@/components/perusahaan/company-form-fields";
import { createCompanyAction } from "@/app/actions/companies";

function createEmptyForm(): CompanyFormValues {
  return { name: "", address: "", email: "", phone: "" };
}

export function AddCompanyDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CompanyFormValues>(createEmptyForm);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
      setNameError("Nama perusahaan wajib diisi.");
      return;
    }

    startTransition(async () => {
      const result = await createCompanyAction(form);
      if (!result.success) {
        toast.error("Gagal menambahkan perusahaan", {
          description: result.error,
        });
        return;
      }

      toast.success("Perusahaan ditambahkan", {
        description: `${result.company.name} berhasil ditambahkan.`,
      });
      handleOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button">
          <Building2 /> Tambah Perusahaan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Perusahaan</DialogTitle>
            <DialogDescription>
              Isi data perusahaan baru yang akan tampil di dokumen.
            </DialogDescription>
          </DialogHeader>

          <CompanyFormFields
            value={form}
            onChange={(value) => {
              setForm(value);
              if (nameError) setNameError(null);
            }}
            nameError={nameError}
          />

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              <Plus /> Tambah
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
