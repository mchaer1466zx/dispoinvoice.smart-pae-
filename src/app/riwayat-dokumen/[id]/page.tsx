"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileX2, Loader2, Printer } from "lucide-react";
import { usePDF, Margin } from "react-to-pdf";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InvoiceStatusControl } from "@/components/invoice/invoice-status-control";
import { DuplicateInvoiceButton } from "@/components/invoice/duplicate-invoice-button";
import { PurchaseOrderStatusControl } from "@/components/po/po-status-control";
import { DuplicatePurchaseOrderButton } from "@/components/po/duplicate-po-button";
import { MemoStatusControl } from "@/components/memo/memo-status-control";
import { DuplicateMemoButton } from "@/components/memo/duplicate-memo-button";
import { DOCUMENT_TYPE_LABELS } from "@/lib/mock-data";
import {
  getDocumentAction,
  type DocumentDetail,
} from "@/app/actions/documents";
import type { InvoiceStatus } from "@/app/actions/invoices";
import type { PoStatus } from "@/app/actions/purchase-orders";
import type { MemoStatus } from "@/app/actions/memos";
import { CancelDocumentButton } from "@/components/cancel-document-button";
import { DocumentAuditPanel } from "@/components/document-audit-panel";
import { calculateInvoiceTotals } from "@/lib/invoice-totals";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_VARIANTS: Record<
  string,
  "secondary" | "success" | "outline" | "destructive"
> = {
  draft: "outline",
  terkirim: "secondary",
  dikirim: "secondary",
  dibaca: "secondary",
  lunas: "success",
  selesai: "success",
  dibatalkan: "destructive",
};

const PARTY_LABELS = {
  invoice: "Ditagih Kepada",
  po: "Kepada Pemasok",
  memo: "Kepada",
} as const;

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-3xl flex-col gap-6">{children}</main>
    </div>
  );
}

function BackLink() {
  return (
    <Button variant="ghost" size="sm" className="w-fit" asChild>
      <Link href="/riwayat-dokumen">
        <ArrowLeft /> Kembali ke Riwayat Dokumen
      </Link>
    </Button>
  );
}

export default function DocumentDetailPage() {
  const params = useParams<{ id: string }>();
  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [auditReloadToken, setAuditReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    getDocumentAction(params.id)
      .then((data) => {
        if (active) setDoc(data);
      })
      .catch(() => {
        // Biarkan doc null bila gagal memuat → tampil "tidak ditemukan".
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.id]);

  const { targetRef, toPDF } = usePDF({
    filename: `${doc?.number ?? "dokumen"}.pdf`,
    page: { format: "a4", margin: Margin.MEDIUM },
  });

  if (isLoading) {
    return (
      <PageShell>
        <BackLink />
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Memuat dokumen…</p>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  if (!doc) {
    return (
      <PageShell>
        <BackLink />
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <FileX2 className="size-8 text-muted-foreground" />
            <p className="font-medium">Dokumen tidak ditemukan</p>
            <p className="text-sm text-muted-foreground">
              Dokumen ini mungkin sudah dihapus atau tautannya tidak valid.
            </p>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  const totals = calculateInvoiceTotals(
    doc.items ?? [],
    doc.tax ?? 0,
    doc.discount ?? 0
  );

  const isCancelled = doc.status === "dibatalkan";

  function handleCancelled() {
    setDoc((prev) => (prev ? { ...prev, status: "dibatalkan" } : prev));
    setAuditReloadToken((token) => token + 1);
  }

  return (
    <PageShell>
      <div className="flex items-center justify-between gap-2 print:hidden">
        <BackLink />
        <div className="flex gap-2">
          {!isCancelled ? (
            <CancelDocumentButton
              kind={doc.type}
              id={doc.id}
              onCancelled={handleCancelled}
            />
          ) : null}
          {doc.type === "invoice" ? (
            <DuplicateInvoiceButton invoiceId={doc.id} />
          ) : null}
          {doc.type === "po" ? (
            <DuplicatePurchaseOrderButton poId={doc.id} />
          ) : null}
          {doc.type === "memo" ? (
            <DuplicateMemoButton memoId={doc.id} />
          ) : null}
          <Button type="button" variant="outline" onClick={() => window.print()}>
            <Printer /> Cetak
          </Button>
          <Button type="button" onClick={() => toPDF()}>
            <Download /> Unduh PDF
          </Button>
        </div>
      </div>

      {doc.type === "invoice" && !isCancelled ? (
        <Card className="print:hidden">
          <CardContent className="pt-6">
            <InvoiceStatusControl
              invoiceId={doc.id}
              currentStatus={doc.status}
              onChanged={(status: InvoiceStatus) => {
                setDoc((prev) => (prev ? { ...prev, status } : prev));
                setAuditReloadToken((token) => token + 1);
              }}
            />
          </CardContent>
        </Card>
      ) : null}

      {doc.type === "po" && !isCancelled ? (
        <Card className="print:hidden">
          <CardContent className="pt-6">
            <PurchaseOrderStatusControl
              poId={doc.id}
              currentStatus={doc.status}
              onChanged={(status: PoStatus) => {
                setDoc((prev) => (prev ? { ...prev, status } : prev));
                setAuditReloadToken((token) => token + 1);
              }}
            />
          </CardContent>
        </Card>
      ) : null}

      {doc.type === "memo" && !isCancelled ? (
        <Card className="print:hidden">
          <CardContent className="pt-6">
            <MemoStatusControl
              memoId={doc.id}
              currentStatus={doc.status}
              onChanged={(status: MemoStatus) => {
                setDoc((prev) => (prev ? { ...prev, status } : prev));
                setAuditReloadToken((token) => token + 1);
              }}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card ref={targetRef} id="document-printable">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{DOCUMENT_TYPE_LABELS[doc.type]}</Badge>
            <Badge variant={STATUS_VARIANTS[doc.status] ?? "outline"}>{doc.status}</Badge>
          </div>
          <CardTitle className="text-xl">{doc.number}</CardTitle>
          <CardDescription>{formatDate(doc.date)}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div>
            <p className="text-sm text-muted-foreground">{PARTY_LABELS[doc.type]}</p>
            <p className="font-medium">{doc.partyName}</p>
          </div>

          {doc.items ? (
            <div className="flex flex-col gap-3">
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Deskripsi</th>
                      <th className="px-3 py-2 text-right font-medium">Jumlah</th>
                      <th className="px-3 py-2 text-right font-medium">Harga</th>
                      <th className="px-3 py-2 text-right font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doc.items.map((item, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="px-3 py-2">{item.description}</td>
                        <td className="px-3 py-2 text-right">{item.quantity}</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(item.price)}</td>
                        <td className="px-3 py-2 text-right">
                          {formatCurrency(item.quantity * item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <div className="flex w-56 flex-col gap-1 text-sm">
                  {totals.discount > 0 || totals.taxPercent > 0 ? (
                    <>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>{formatCurrency(totals.subtotal)}</span>
                      </div>
                      {totals.discount > 0 ? (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Diskon</span>
                          <span>-{formatCurrency(totals.discount)}</span>
                        </div>
                      ) : null}
                      {totals.taxPercent > 0 ? (
                        <div className="flex justify-between text-muted-foreground">
                          <span>PPN ({totals.taxPercent}%)</span>
                          <span>{formatCurrency(totals.taxAmount)}</span>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {doc.content ? (
            <div>
              <p className="text-sm text-muted-foreground">Isi Memo</p>
              <p className="whitespace-pre-line">{doc.content}</p>
            </div>
          ) : null}

          {doc.instructions ? (
            <div>
              <p className="text-sm text-muted-foreground">Instruksi</p>
              <p className="whitespace-pre-line">{doc.instructions}</p>
            </div>
          ) : null}

          {doc.notes ? (
            <div>
              <p className="text-sm text-muted-foreground">Catatan</p>
              <p className="whitespace-pre-line">{doc.notes}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <DocumentAuditPanel
        entityType={doc.type}
        entityId={doc.id}
        reloadToken={auditReloadToken}
      />
    </PageShell>
  );
}
