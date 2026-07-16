"use client";

import { CompanyLogo } from "@/components/invoice/company-logo";
import type { MemoDetail } from "@/components/memo/memo-detail-form";
import { MOCK_COMPANY } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { useCompanyProfile } from "@/lib/company-profile-store";

export function MemoPreview({ memoDetail }: { memoDetail: MemoDetail }) {
  const { logoUrl } = useCompanyProfile();

  return (
    <div className="mx-auto w-full max-w-[210mm] overflow-hidden rounded-lg border border-gray-200 bg-white text-black">
      <div
        aria-hidden
        className="h-1.5 w-full"
        style={{ background: "linear-gradient(to right, #3A67AE, #76B843)" }}
      />
      <div className="p-8 sm:p-12">
        <div className="flex items-start justify-between gap-6 border-b border-gray-200 pb-6 break-inside-avoid">
          <div className="flex items-center gap-4">
            <CompanyLogo logoUrl={logoUrl} initials={MOCK_COMPANY.logoInitials} />
            <div className="text-sm">
              <p className="text-base font-semibold">{MOCK_COMPANY.name}</p>
              <p className="text-gray-500">{MOCK_COMPANY.address}</p>
              <p className="text-gray-500">
                {MOCK_COMPANY.email} &middot; {MOCK_COMPANY.phone}
              </p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold tracking-tight">MEMO DISPOSISI</h2>
            <p className="text-sm text-gray-500">{formatDate(memoDetail.memoDate)}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
          <dt className="text-gray-500">Kepada</dt>
          <dd className="font-semibold">
            {memoDetail.recipientName || (
              <span className="font-normal italic text-gray-500">
                Belum ada penerima ditentukan.
              </span>
            )}
          </dd>
          <dt className="text-gray-500">Perihal</dt>
          <dd>{memoDetail.subject || "-"}</dd>
        </dl>

        <div className="mt-8 text-sm">
          <p className="mb-1 font-medium text-gray-500">Isi Memo</p>
          <p className="whitespace-pre-wrap">{memoDetail.content || "-"}</p>
        </div>

        {memoDetail.instructions ? (
          <div className="mt-8 border-t border-gray-200 pt-4 text-sm">
            <p className="mb-1 font-medium text-gray-500">Instruksi</p>
            <p className="whitespace-pre-wrap">{memoDetail.instructions}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
