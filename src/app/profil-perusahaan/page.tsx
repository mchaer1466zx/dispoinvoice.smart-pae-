"use client";

import Link from "next/link";
import { ArrowLeft, Building2, Check, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddCompanyDialog } from "@/components/perusahaan/add-company-dialog";
import { EditCompanyDialog } from "@/components/perusahaan/edit-company-dialog";
import { DeleteCompanyDialog } from "@/components/perusahaan/delete-company-dialog";
import { CompanyLogoUpload } from "@/components/perusahaan/company-logo-upload";
import { useCompany } from "@/lib/company-store";

export default function ProfilPerusahaanPage() {
  const { companies, activeCompany, isSwitching, setActiveCompanyId } = useCompany();

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Button variant="ghost" size="sm" className="w-fit" asChild>
              <Link href="/">
                <ArrowLeft /> Kembali ke Buat Invoice
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold tracking-tight">
              Kelola Perusahaan
            </h1>
            <p className="text-sm text-muted-foreground">
              Semua perusahaan yang dapat dipilih sebagai penerbit invoice, PO,
              dan memo.
            </p>
          </div>
          <AddCompanyDialog />
        </div>

        {companies.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
              <Building2 className="size-8" />
              <p className="text-sm">Belum ada perusahaan terdaftar.</p>
              <p className="text-sm">
                Tambahkan perusahaan pertama agar bisa dipakai di dokumen.
              </p>
            </CardContent>
          </Card>
        ) : (
          companies.map((company) => {
            const isActive = company.id === activeCompany?.id;
            return (
              <Card key={company.id}>
                <CardHeader className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {company.name}
                      {isActive ? <Badge variant="success">Aktif</Badge> : null}
                    </CardTitle>
                    <CardDescription className="mt-1 flex flex-col gap-0.5">
                      {company.address ? (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 shrink-0" />
                          {company.address}
                        </span>
                      ) : null}
                    </CardDescription>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <EditCompanyDialog company={company} />
                    <DeleteCompanyDialog company={company} />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <CompanyLogoUpload
                    companyId={company.id}
                    companyName={company.name}
                    logoUrl={company.logoUrl}
                  />
                  {!isActive ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      disabled={isSwitching}
                      onClick={() => setActiveCompanyId(company.id)}
                    >
                      <Check /> Jadikan Perusahaan Aktif
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            );
          })
        )}
      </main>
    </div>
  );
}
