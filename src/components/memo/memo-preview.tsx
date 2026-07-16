"use client";

import { DocumentHeaderPreview } from "@/components/document-header-preview";
import type { MemoDetail } from "@/components/memo/memo-detail-form";
import { formatDate } from "@/lib/format";
import type { CompanyRecord } from "@/app/actions/companies";

export function MemoPreview({
  memoDetail,
  company,
}: {
  memoDetail: MemoDetail;
  company: CompanyRecord | null;
}) {
  return (
    <div className="mx-auto w-full max-w-[210mm] overflow-hidden rounded-lg border border-gray-200 bg-white text-black">
      <div
        aria-hidden
        className="h-1.5 w-full"
        style={{ background: "linear-gradient(to right, #3A67AE, #76B843)" }}
      />
      <div className="p-8 sm:p-12">
        <DocumentHeaderPreview
          company={company}
          title="MEMO DISPOSISI"
          subtitle={formatDate(memoDetail.memoDate)}
        />

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
