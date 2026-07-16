import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CompanyLogoUploadHint() {
  return (
    <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-900/40">
      <div className="flex items-center gap-2 text-muted-foreground">
        <ImageOff className="size-4 shrink-0" />
        <span>Logo perusahaan belum diunggah. Lengkapi agar dokumen terlihat profesional.</span>
      </div>
      <Button type="button" variant="outline" size="sm" asChild>
        <Link href="/profil-perusahaan">Unggah Logo</Link>
      </Button>
    </div>
  );
}
