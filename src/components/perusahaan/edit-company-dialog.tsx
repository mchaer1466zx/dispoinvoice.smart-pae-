"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { CompanyFormFields } from "@/components/perusahaan/company-form-fields";
import { updateCompanyAction, type CompanyRecord } from "@/app/actions/companies";

export function EditCompanyDialog({ company }: { company: CompanyRecord }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CompanyRecord>(company);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setForm(company);
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
      const result = await updateCompanyAction(company.id, form);
      if (!result.success) {
        toast.error("Gagal memperbarui perusahaan", {
          description: result.error,
        });
        return;
      }

      toast.success("Perusahaan diperbarui", {
        description: `Data ${result.company.name} berhasil diperbarui.`,
      });
      setOpen(false);
      router.refresh();
    });
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
            <DialogTitle>Edit Perusahaan</DialogTitle>
            <DialogDescription>Perbarui data {company.name}.</DialogDescription>
          </DialogHeader>

          <CompanyFormFields
            value={form}
            onChange={(value) => {
              setForm({ ...form, ...value });
              if (nameError) setNameError(null);
            }}
            nameError={nameError}
          />

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              <Save /> Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
