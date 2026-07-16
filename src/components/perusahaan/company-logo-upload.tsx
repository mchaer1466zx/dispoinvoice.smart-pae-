"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "@/components/invoice/company-logo";
import {
  uploadCompanyLogoAction,
  removeCompanyLogoAction,
} from "@/app/actions/company-logo";
import { getCompanyInitials } from "@/lib/company-initials";

export function CompanyLogoUpload({
  companyId,
  companyName,
  logoUrl,
}: {
  companyId: string;
  companyName: string;
  logoUrl: string | null;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const formData = new FormData();
    formData.set("logo", file);

    startTransition(async () => {
      const result = await uploadCompanyLogoAction(companyId, formData);
      if (!result.success) {
        toast.error("Gagal mengunggah logo", { description: result.error });
        return;
      }
      toast.success("Logo berhasil diunggah", {
        description: "Logo langsung dipakai di semua dokumen perusahaan ini.",
      });
      router.refresh();
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeCompanyLogoAction(companyId);
      if (!result.success) {
        toast.error("Gagal menghapus logo", { description: result.error });
        return;
      }
      toast.info("Logo dihapus", {
        description: "Dokumen akan kembali menampilkan placeholder logo.",
      });
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3">
      <CompanyLogo logoUrl={logoUrl} initials={getCompanyInitials(companyName)} />
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud /> {logoUrl ? "Ganti Logo" : "Unggah Logo"}
        </Button>
        {logoUrl ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={handleRemove}
          >
            <Trash2 /> Hapus
          </Button>
        ) : null}
      </div>
    </div>
  );
}
