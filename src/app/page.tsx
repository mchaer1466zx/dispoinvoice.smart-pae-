"use client";

import { useState } from "react";
import {
  BillingInfoForm,
  createDefaultBillingInfo,
} from "@/components/invoice/billing-info-form";
import { CustomerPicker } from "@/components/invoice/customer-picker";
import {
  ItemListForm,
  createDefaultItems,
} from "@/components/invoice/item-list-form";
import { CompanyLogoUploadHint } from "@/components/invoice/company-logo-upload-hint";
import { InvoicePreview } from "@/components/invoice/invoice-preview";
import { InvoicePreviewActions } from "@/components/invoice/invoice-preview-actions";
import { SaveInvoiceButton } from "@/components/invoice/save-invoice-button";
import { ShareInvoiceDialog } from "@/components/invoice/share-invoice-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Customer } from "@/lib/mock-data";
import { useCompanyProfile } from "@/lib/company-profile-store";

export default function BuatInvoicePage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [billingInfo, setBillingInfo] = useState(createDefaultBillingInfo);
  const [items, setItems] = useState(createDefaultItems);
  const { logoUrl } = useCompanyProfile();

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Buat Invoice
            </h1>
            <p className="text-sm text-muted-foreground">
              Isi detail invoice, lalu pratinjau dan cetak dalam satu halaman.
              {selectedCustomer ? ` Ditagih kepada ${selectedCustomer.name}.` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <ShareInvoiceDialog invoiceNumber={billingInfo.invoiceNumber} />
            <SaveInvoiceButton
              billingInfo={billingInfo}
              customer={selectedCustomer}
              items={items}
            />
          </div>
        </div>

        <BillingInfoForm value={billingInfo} onChange={setBillingInfo} />

        <CustomerPicker
          selected={selectedCustomer}
          onSelectedChange={setSelectedCustomer}
        />

        <ItemListForm items={items} onChange={setItems} />

        <Card>
          <CardHeader>
            <CardTitle>Pratinjau</CardTitle>
            <CardDescription>
              Tampilan akhir invoice, lengkap dengan logo perusahaan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logoUrl ? null : <CompanyLogoUploadHint />}
            <InvoicePreviewActions filename={`${billingInfo.invoiceNumber}.pdf`}>
              <InvoicePreview
                billingInfo={billingInfo}
                customer={selectedCustomer}
                items={items}
              />
            </InvoicePreviewActions>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
