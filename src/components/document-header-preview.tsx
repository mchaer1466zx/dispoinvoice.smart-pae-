"use client";

import { CompanyLogo } from "@/components/invoice/company-logo";
import { getCompanyInitials } from "@/lib/company-initials";
import type { CompanyRecord } from "@/app/actions/companies";

/**
 * Header pratinjau dokumen (logo & identitas perusahaan + judul dokumen), dipakai bersama
 * oleh pratinjau invoice, purchase order, dan memo disposisi agar tampilannya konsisten.
 */
export function DocumentHeaderPreview({
  company,
  title,
  subtitle,
}: {
  company: CompanyRecord | null;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-gray-200 pb-6 break-inside-avoid">
      <div className="flex items-center gap-4">
        <CompanyLogo
          logoUrl={company?.logoUrl ?? null}
          initials={company ? getCompanyInitials(company.name) : "?"}
        />
        {company ? (
          <div className="text-sm">
            <p className="text-base font-semibold">{company.name}</p>
            <p className="text-gray-500">{company.address}</p>
          </div>
        ) : (
          <p className="text-sm italic text-gray-400">Perusahaan belum diatur.</p>
        )}
      </div>
      <div className="text-right">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}
