"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  RfqDetailForm,
  createDefaultRfqDetail,
} from "@/components/rfq/rfq-detail-form";
import {
  RfqItemListForm,
  createDefaultRfqItems,
} from "@/components/rfq/rfq-item-list-form";
import { SupplierPicker } from "@/components/po/supplier-picker";
import { RfqPreview } from "@/components/rfq/rfq-preview";
import { PoPreviewActions } from "@/components/po/po-preview-actions";
import { SaveRfqButton } from "@/components/rfq/save-rfq-button";
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
import { generateRfqNumberAction } from "@/app/actions/numbering";

export default function RfqPage() {
  const [rfqDetail, setRfqDetail] = useState(createDefaultRfqDetail);
  const [items, setItems] = useState(createDefaultRfqItems);
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
      setRfqDetail((prev) => ({ ...prev, companyId: user.defaultCompany }));
    }
  }, [user?.defaultCompany]);

  // Prefill/segarkan nomor RFQ sesuai perusahaan penerbit terpilih.
  useEffect(() => {
    let active = true;
    generateRfqNumberAction(rfqDetail.companyId)
      .then((rfqNumber) => {
        if (active) {
          setRfqDetail((prev) => ({ ...prev, rfqNumber }));
        }
      })
      .catch(() => {
        // Pakai placeholder bila gagal mengambil nomor dari server.
      });
    return () => {
      active = false;
    };
  }, [rfqDetail.companyId]);

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Buat RFQ (Permintaan Penawaran)
            </h1>
            <p className="text-sm text-muted-foreground">
              Minta penawaran harga ke pemasok atas barang/jasa yang dibutuhkan.
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/contoh-pdf">
                <FileText /> Lihat Contoh PDF
              </Link>
            </Button>
            <SaveRfqButton
              rfqDetail={rfqDetail}
              supplier={selectedSupplier}
              items={items}
              company={activeCompany}
            />
          </div>
        </div>

        <RfqDetailForm value={rfqDetail} onChange={setRfqDetail} />

        <SupplierPicker
          selected={selectedSupplier}
          onSelectedChange={setSelectedSupplier}
        />

        <RfqItemListForm items={items} onChange={setItems} />

        <Card>
          <CardHeader>
            <CardTitle>Pratinjau</CardTitle>
            <CardDescription>
              Tampilan akhir RFQ, lengkap dengan logo perusahaan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeCompany?.logoUrl ? null : <CompanyLogoUploadHint />}
            <PoPreviewActions filename={`${rfqDetail.rfqNumber}.pdf`}>
              <RfqPreview
                rfqDetail={rfqDetail}
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
