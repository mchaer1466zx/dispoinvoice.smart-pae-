"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SupplierInvoiceDetailForm,
  createDefaultSupplierInvoiceDetail,
} from "@/components/supplier-invoice/supplier-invoice-detail-form";
import {
  SupplierInvoiceItemListForm,
  createDefaultSupplierInvoiceItems,
} from "@/components/supplier-invoice/supplier-invoice-item-list-form";
import { SupplierPicker } from "@/components/po/supplier-picker";
import { SupplierInvoicePreview } from "@/components/supplier-invoice/supplier-invoice-preview";
import { PoPreviewActions } from "@/components/po/po-preview-actions";
import { SaveSupplierInvoiceButton } from "@/components/supplier-invoice/save-supplier-invoice-button";
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
import { generateSupplierInvoiceNumberAction } from "@/app/actions/numbering";

export default function SupplierInvoicePage() {
  const [detail, setDetail] = useState(createDefaultSupplierInvoiceDetail);
  const [items, setItems] = useState(createDefaultSupplierInvoiceItems);
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
      setDetail((prev) => ({ ...prev, companyId: user.defaultCompany }));
    }
  }, [user?.defaultCompany]);

  // Prefill/segarkan nomor tagihan sesuai perusahaan penerbit terpilih.
  useEffect(() => {
    let active = true;
    generateSupplierInvoiceNumberAction(detail.companyId)
      .then((invoiceNumber) => {
        if (active) {
          setDetail((prev) => ({ ...prev, invoiceNumber }));
        }
      })
      .catch(() => {
        // Pakai placeholder bila gagal mengambil nomor dari server.
      });
    return () => {
      active = false;
    };
  }, [detail.companyId]);

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Buat Tagihan Pemasok
            </h1>
            <p className="text-sm text-muted-foreground">
              Catat tagihan (invoice) yang diterima dari pemasok dan lacak
              pembayarannya.
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/contoh-pdf">
                <FileText /> Lihat Contoh PDF
              </Link>
            </Button>
            <SaveSupplierInvoiceButton
              detail={detail}
              supplier={selectedSupplier}
              items={items}
              company={activeCompany}
            />
          </div>
        </div>

        <SupplierInvoiceDetailForm value={detail} onChange={setDetail} />

        <SupplierPicker
          selected={selectedSupplier}
          onSelectedChange={setSelectedSupplier}
        />

        <SupplierInvoiceItemListForm items={items} onChange={setItems} />

        <Card>
          <CardHeader>
            <CardTitle>Pratinjau</CardTitle>
            <CardDescription>
              Tampilan akhir tagihan pemasok, lengkap dengan logo perusahaan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeCompany?.logoUrl ? null : <CompanyLogoUploadHint />}
            <PoPreviewActions filename={`${detail.invoiceNumber}.pdf`}>
              <SupplierInvoicePreview
                detail={detail}
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
