"use client";

import { useState } from "react";
import {
  MemoDetailForm,
  createDefaultMemoDetail,
} from "@/components/memo/memo-detail-form";
import { MemoPreview } from "@/components/memo/memo-preview";
import { MemoPreviewActions } from "@/components/memo/memo-preview-actions";
import { SaveMemoButton } from "@/components/memo/save-memo-button";
import { ShareMemoDialog } from "@/components/memo/share-memo-dialog";
import { CompanyLogoUploadHint } from "@/components/invoice/company-logo-upload-hint";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCompany } from "@/lib/company-store";

export default function MemoPage() {
  const [memoDetail, setMemoDetail] = useState(createDefaultMemoDetail);
  const { activeCompany } = useCompany();

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Buat Memo Disposisi
            </h1>
            <p className="text-sm text-muted-foreground">
              Isi detail memo, lalu pratinjau dan cetak dalam satu halaman.
            </p>
          </div>
          <div className="flex gap-2">
            <ShareMemoDialog recipientName={memoDetail.recipientName} />
            <SaveMemoButton memoDetail={memoDetail} />
          </div>
        </div>

        <MemoDetailForm value={memoDetail} onChange={setMemoDetail} />

        <Card>
          <CardHeader>
            <CardTitle>Pratinjau</CardTitle>
            <CardDescription>
              Tampilan akhir memo disposisi, lengkap dengan logo perusahaan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeCompany?.logoUrl ? null : <CompanyLogoUploadHint />}
            <MemoPreviewActions filename={`Memo-Disposisi-${memoDetail.memoDate}.pdf`}>
              <MemoPreview memoDetail={memoDetail} company={activeCompany} />
            </MemoPreviewActions>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
