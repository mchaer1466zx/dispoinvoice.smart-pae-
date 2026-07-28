"use client";

import { useEffect, useState } from "react";
import {
  PrDetailForm,
  createDefaultPrDetail,
} from "@/components/pr/pr-detail-form";
import {
  PrItemListForm,
  createDefaultPrItems,
} from "@/components/pr/pr-item-list-form";
import { PrPreview } from "@/components/pr/pr-preview";
import { PoPreviewActions } from "@/components/po/po-preview-actions";
import { SavePrButton } from "@/components/pr/save-pr-button";
import { CompanyLogoUploadHint } from "@/components/invoice/company-logo-upload-hint";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCompany } from "@/lib/company-store";
import { generatePurchaseRequestNumberAction } from "@/app/actions/numbering";

export default function PurchaseRequestPage() {
  const [prDetail, setPrDetail] = useState(createDefaultPrDetail);
  const [items, setItems] = useState(createDefaultPrItems);
  const { activeCompany } = useCompany();

  // Prefill nomor PR urut asli dari server (menggantikan placeholder).
  useEffect(() => {
    let active = true;
    generatePurchaseRequestNumberAction()
      .then((prNumber) => {
        if (active) {
          setPrDetail((prev) => ({ ...prev, prNumber }));
        }
      })
      .catch(() => {
        // Pakai placeholder bila gagal mengambil nomor dari server.
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Buat Purchase Request
            </h1>
            <p className="text-sm text-muted-foreground">
              Ajukan permintaan pembelian dari departemen ke Procurement.
            </p>
          </div>
          <SavePrButton prDetail={prDetail} items={items} company={activeCompany} />
        </div>

        <PrDetailForm value={prDetail} onChange={setPrDetail} />

        <PrItemListForm items={items} onChange={setItems} />

        <Card>
          <CardHeader>
            <CardTitle>Pratinjau</CardTitle>
            <CardDescription>
              Tampilan akhir purchase request, lengkap dengan logo perusahaan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeCompany?.logoUrl ? null : <CompanyLogoUploadHint />}
            <PoPreviewActions filename={`${prDetail.prNumber}.pdf`}>
              <PrPreview prDetail={prDetail} items={items} company={activeCompany} />
            </PoPreviewActions>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
