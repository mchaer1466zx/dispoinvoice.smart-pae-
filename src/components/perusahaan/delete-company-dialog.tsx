"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { deleteCompanyAction, type CompanyRecord } from "@/app/actions/companies";

export function DeleteCompanyDialog({ company }: { company: CompanyRecord }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteCompanyAction(company.id);
      if (!result.success) {
        toast.error("Gagal menghapus perusahaan", { description: result.error });
        return;
      }

      toast.success("Perusahaan dihapus", {
        description: `${company.name} telah dihapus dari daftar perusahaan.`,
      });
      setOpen(false);
      router.refresh();
    });
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
          <DialogTitle>Hapus Perusahaan</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus <strong>{company.name}</strong> dari daftar
            perusahaan? Invoice/PO yang sudah dibuat atas nama perusahaan ini
            akan kehilangan data perusahaannya. Tindakan ini tidak dapat
            dibatalkan.
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
            disabled={isPending}
          >
            <Trash2 /> Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
