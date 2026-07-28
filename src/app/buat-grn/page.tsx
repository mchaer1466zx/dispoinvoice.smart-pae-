"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  GrnDetailForm,
  createDefaultGrnDetail,
} from "@/components/grn/grn-detail-form";
import {
  GrnItemListForm,
  createDefaultGrnItems,
} from "@/components/grn/grn-item-list-form";
import { SupplierPicker } from "@/components/po/supplier-picker";
import { GrnPreview } from "@/components/grn/grn-preview";
import { PoPreviewActions } from "@/components/po/po-preview-actions";
import { SaveGrnButton } from "@/components/grn/save-grn-button";
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
import { useAuth } from "@/lib/auth-store";
import { generateGoodsReceiptNumberAction } from "@/app/actions/numbering";

export default function GoodsReceiptPage() {
  const [grnDetail, setGrnDetail] = useState(createDefaultGrnDetail);
  const [items, setItems] = useState(createDefaultGrnItems);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRecord | null>(
    null
  );
  const { activeCompany } = useCompany();
  const { user } = useAuth();
  const appliedDefaultCompany = useRef(false);

  // Terapkan "Perusahaan Default" akun sekali saat sesi termuat.
  useEffect(() => {
    if (!appliedDefaultCompany.current && user?.defaultCompany) {
      appliedDefaultCompany.current = true;
      setGrnDetail((prev) => ({ ...prev, companyId: user.defaultCompany }));
    }
  }, [user?.defaultCompany]);

  // Prefill/segarkan nomor GRN sesuai perusahaan penerbit terpilih.
  useEffect(() => {
    let active = true;
    generateGoodsReceiptNumberAction(grnDetail.companyId)
      .then((grnNumber) => {
        if (active) {
          setGrnDetail((prev) => ({ ...prev, grnNumber }));
        }
      })
      .catch(() => {
        // Pakai placeholder bila gagal mengambil nomor dari server.
      });
    return () => {
      active = false;
    };
  }, [grnDetail.companyId]);

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Buat Goods Receipt (GRN)
            </h1>
            <p className="text-sm text-muted-foreground">
              Catat barang yang diterima dari pemasok sebagai bukti penerimaan.
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/contoh-pdf">
                <FileText /> Lihat Contoh PDF
              </Link>
            </Button>
            <SaveGrnButton
              grnDetail={grnDetail}
              supplier={selectedSupplier}
              items={items}
              company={activeCompany}
            />
          </div>
        </div>

        <GrnDetailForm value={grnDetail} onChange={setGrnDetail} />

        <SupplierPicker
          selected={selectedSupplier}
          onSelectedChange={setSelectedSupplier}
        />

        <GrnItemListForm items={items} onChange={setItems} />

        <Card>
          <CardHeader>
            <CardTitle>Pratinjau</CardTitle>
            <CardDescription>
              Tampilan akhir goods receipt, lengkap dengan logo perusahaan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeCompany?.logoUrl ? null : <CompanyLogoUploadHint />}
            <PoPreviewActions filename={`${grnDetail.grnNumber}.pdf`}>
              <GrnPreview
                grnDetail={grnDetail}
                supplier={selectedSupplier}
                items={items}
              />
            </PoPreviewActions>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
