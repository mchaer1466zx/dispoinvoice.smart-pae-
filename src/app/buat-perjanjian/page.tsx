"use client";

import { useState } from "react";
import { AgreementForm } from "@/components/agreement/agreement-form";
import { AgreementDocument } from "@/components/agreement/agreement-document";
import { AgreementActions } from "@/components/agreement/agreement-actions";
import { createAgreement } from "@/lib/agreement";
import { useCompany } from "@/lib/company-store";
import { isCompanyId } from "@/config/company-themes";

export default function BuatPerjanjianPage() {
  const { activeCompany } = useCompany();
  // Default mengikuti perusahaan aktif (tersedia dari provider saat render).
  const [detail, setDetail] = useState(() =>
    createAgreement(
      "perjanjian-kerja-sama",
      activeCompany && isCompanyId(activeCompany.id) ? activeCompany.id : undefined,
    ),
  );

  const filename = `${detail.title.replace(/\s+/g, "-")}-${detail.number.replace(/\//g, "-")}.pdf`;

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-8 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-7xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Buat Perjanjian</h1>
          <p className="text-sm text-muted-foreground">
            Dokumen resmi kerja sama berpasal, berita acara, & LOI — kop premium,
            ekspor PDF, dan cetak dalam satu halaman.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
          <div className="min-w-0">
            <AgreementForm value={detail} onChange={setDetail} />
          </div>
          <div className="min-w-0">
            <AgreementActions filename={filename}>
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <AgreementDocument detail={detail} />
              </div>
            </AgreementActions>
          </div>
        </div>
      </main>
    </div>
  );
}
