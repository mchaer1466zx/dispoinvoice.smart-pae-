"use client";

import { useState } from "react";
import {
  PoDetailForm,
  createDefaultPoDetail,
} from "@/components/po/po-detail-form";
import {
  PoItemListForm,
  createDefaultPoItems,
} from "@/components/po/po-item-list-form";
import { SupplierPicker } from "@/components/po/supplier-picker";
import { PoPreview } from "@/components/po/po-preview";
import { PoPreviewActions } from "@/components/po/po-preview-actions";
import { SavePoButton } from "@/components/po/save-po-button";
import { CompanyLogoUploadHint } from "@/components/invoice/company-logo-upload-hint";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SupplierRecord } from "@/app/actions/suppliers";
import { useCompany } from "@/lib/company-store";

export default function PurchaseOrderPage() {
  const [poDetail, setPoDetail] = useState(createDefaultPoDetail);
  const [items, setItems] = useState(createDefaultPoItems);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRecord | null>(
    null
  );
  const { activeCompany } = useCompany();

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Buat Purchase Order
            </h1>
            <p className="text-sm text-muted-foreground">
              Isi detail purchase order, lalu pratinjau dan cetak dalam satu
              halaman.
            </p>
          </div>
          <SavePoButton
            poDetail={poDetail}
            supplier={selectedSupplier}
            items={items}
            company={activeCompany}
          />
        </div>

        <PoDetailForm value={poDetail} onChange={setPoDetail} />

        <SupplierPicker
          selected={selectedSupplier}
          onSelectedChange={setSelectedSupplier}
        />

        <PoItemListForm items={items} onChange={setItems} />

        <Card>
          <CardHeader>
            <CardTitle>Pratinjau</CardTitle>
            <CardDescription>
              Tampilan akhir purchase order, lengkap dengan logo perusahaan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeCompany?.logoUrl ? null : <CompanyLogoUploadHint />}
            <PoPreviewActions filename={`${poDetail.poNumber}.pdf`}>
              <PoPreview
                poDetail={poDetail}
                supplier={selectedSupplier}
                items={items}
                company={activeCompany}
              />
            </PoPreviewActions>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
