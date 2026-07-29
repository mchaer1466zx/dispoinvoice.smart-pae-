"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  QuotationDetailForm,
  createDefaultQuotationDetail,
} from "@/components/quotation/quotation-detail-form";
import {
  QuotationItemListForm,
  createDefaultQuotationItems,
} from "@/components/quotation/quotation-item-list-form";
import { CustomerPicker } from "@/components/invoice/customer-picker";
import { QuotationPreview } from "@/components/quotation/quotation-preview";
import { PoPreviewActions } from "@/components/po/po-preview-actions";
import { SaveQuotationButton } from "@/components/quotation/save-quotation-button";
import { CompanyLogoUploadHint } from "@/components/invoice/company-logo-upload-hint";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Customer } from "@/lib/mock-data";
import { useCompany } from "@/lib/company-store";
import { useAuth } from "@/lib/auth-store";
import { generateQuotationNumberAction } from "@/app/actions/numbering";

export default function QuotationPage() {
  const [quotationDetail, setQuotationDetail] = useState(
    createDefaultQuotationDetail
  );
  const [items, setItems] = useState(createDefaultQuotationItems);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { activeCompany } = useCompany();
  const { user } = useAuth();
  const appliedDefaultCompany = useRef(false);

  // Terapkan "Perusahaan Default" akun sekali saat sesi termuat.
  useEffect(() => {
    if (!appliedDefaultCompany.current && user?.defaultCompany) {
      appliedDefaultCompany.current = true;
      setQuotationDetail((prev) => ({ ...prev, companyId: user.defaultCompany }));
    }
  }, [user?.defaultCompany]);

  // Prefill/segarkan nomor penawaran sesuai perusahaan penerbit terpilih.
  useEffect(() => {
    let active = true;
    generateQuotationNumberAction(quotationDetail.companyId)
      .then((quotationNumber) => {
        if (active) {
          setQuotationDetail((prev) => ({ ...prev, quotationNumber }));
        }
      })
      .catch(() => {
        // Pakai placeholder bila gagal mengambil nomor dari server.
      });
    return () => {
      active = false;
    };
  }, [quotationDetail.companyId]);

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Buat Penawaran (Quotation)
            </h1>
            <p className="text-sm text-muted-foreground">
              Terbitkan penawaran harga barang/jasa kepada pelanggan.
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/contoh-pdf">
                <FileText /> Lihat Contoh PDF
              </Link>
            </Button>
            <SaveQuotationButton
              quotationDetail={quotationDetail}
              customer={selectedCustomer}
              items={items}
              company={activeCompany}
            />
          </div>
        </div>

        <QuotationDetailForm value={quotationDetail} onChange={setQuotationDetail} />

        <CustomerPicker
          selected={selectedCustomer}
          onSelectedChange={setSelectedCustomer}
        />

        <QuotationItemListForm items={items} onChange={setItems} />

        <Card>
          <CardHeader>
            <CardTitle>Pratinjau</CardTitle>
            <CardDescription>
              Tampilan akhir penawaran, lengkap dengan logo perusahaan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeCompany?.logoUrl ? null : <CompanyLogoUploadHint />}
            <PoPreviewActions filename={`${quotationDetail.quotationNumber}.pdf`}>
              <QuotationPreview
                quotationDetail={quotationDetail}
                customer={selectedCustomer}
                items={items}
              />
            </PoPreviewActions>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
