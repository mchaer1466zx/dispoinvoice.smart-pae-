"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PoPreview } from "@/components/po/po-preview";
import { PoPreviewActions } from "@/components/po/po-preview-actions";
import { SharePoDialog } from "@/components/po/share-po-dialog";
import { CompanyLogoUploadHint } from "@/components/invoice/company-logo-upload-hint";
import {
  getPublicPurchaseOrderAction,
  type PublicPurchaseOrder,
} from "@/app/actions/po-public";
import { formatDate } from "@/lib/format";

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col gap-6">{children}</main>
    </div>
  );
}

function BackLink() {
  return (
    <Button variant="ghost" size="sm" className="w-fit" asChild>
      <Link href="/purchase-order">
        <ArrowLeft /> Kembali ke Buat Purchase Order
      </Link>
    </Button>
  );
}

export default function PurchaseOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [po, setPo] = useState<PublicPurchaseOrder | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    getPublicPurchaseOrderAction(params.id).then((result) => {
      if (!cancelled) setPo(result);
    });

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (po === undefined) {
    return (
      <PageShell>
        <p className="text-sm text-muted-foreground">Memuat...</p>
      </PageShell>
    );
  }

  if (!po) {
    return (
      <PageShell>
        <BackLink />
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Purchase order tidak ditemukan.
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  const poDetail = {
    poNumber: po.poNumber,
    orderDate: po.orderDate,
    status: po.status,
    notes: po.notes ?? "",
  };

  return (
    <PageShell>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <BackLink />
          <h1 className="text-2xl font-semibold tracking-tight">{po.poNumber}</h1>
          <p className="text-sm text-muted-foreground">
            Disimpan pada {formatDate(po.createdAt.slice(0, 10))}
          </p>
        </div>
        <SharePoDialog poId={po.id} poNumber={po.poNumber} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dokumen Purchase Order</CardTitle>
          <CardDescription>
            Pratinjau, cetak, atau ekspor PDF dokumen yang sudah disimpan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {po.company?.logoUrl ? null : <CompanyLogoUploadHint />}
          <PoPreviewActions filename={`${po.poNumber}.pdf`}>
            <PoPreview
              poDetail={poDetail}
              supplier={po.supplier}
              company={po.company}
              items={po.items}
            />
          </PoPreviewActions>
        </CardContent>
      </Card>
    </PageShell>
  );
}
