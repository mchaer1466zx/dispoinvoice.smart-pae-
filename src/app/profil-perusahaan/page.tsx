"use client";

import Link from "next/link";
import { ArrowLeft, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompanyLogo } from "@/components/invoice/company-logo";
import { COMPANY_LOGO_URL, MOCK_COMPANY } from "@/lib/mock-data";
import { useCompanyProfile } from "@/lib/company-profile-store";

export default function ProfilPerusahaanPage() {
  const { logoUrl, setLogoUrl } = useCompanyProfile();

  function handleSimulateUpload() {
    setLogoUrl(COMPANY_LOGO_URL);
    toast.success("Logo berhasil diunggah", {
      description: "Simulasi unggahan logo tersimpan dan langsung dipakai di semua dokumen.",
    });
  }

  function handleRemoveLogo() {
    setLogoUrl(null);
    toast.info("Logo dihapus", {
      description: "Dokumen akan kembali menampilkan placeholder logo.",
    });
  }

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="w-fit" asChild>
            <Link href="/">
              <ArrowLeft /> Kembali ke Buat Invoice
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            Profil Perusahaan
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola identitas perusahaan yang tampil di seluruh dokumen.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Logo Perusahaan</CardTitle>
            <CardDescription>
              Logo ini akan otomatis tampil di header invoice, purchase order,
              dan memo.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4">
            <CompanyLogo logoUrl={logoUrl} initials={MOCK_COMPANY.logoInitials} />
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleSimulateUpload}>
                <UploadCloud /> {logoUrl ? "Ganti Logo" : "Unggah Logo"}
              </Button>
              {logoUrl ? (
                <Button type="button" variant="destructive" onClick={handleRemoveLogo}>
                  <Trash2 /> Hapus Logo
                </Button>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">
              Unggah berkas sungguhan akan tersedia setelah penyimpanan berkas
              dipasang; tombol ini mensimulasikan hasilnya untuk saat ini.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
