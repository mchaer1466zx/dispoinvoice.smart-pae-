"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileX2, Printer } from "lucide-react";
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
import { DOCUMENT_TYPE_LABELS, MOCK_DOCUMENTS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_VARIANTS: Record<string, "secondary" | "success" | "outline"> = {
  draft: "outline",
  terkirim: "secondary",
  dikirim: "secondary",
  lunas: "success",
  selesai: "success",
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
  const doc = MOCK_DOCUMENTS.find((d) => d.id === params.id);

  const { targetRef, toPDF } = usePDF({
    filename: `${doc?.number ?? "dokumen"}.pdf`,
    page: { format: "a4", margin: Margin.MEDIUM },
  });

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

  const total = doc.items?.reduce((sum, item) => sum + item.quantity * item.price, 0) ?? 0;

  return (
    <PageShell>
      <div className="flex items-center justify-between gap-2 print:hidden">
        <BackLink />
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => window.print()}>
            <Printer /> Cetak
          </Button>
          <Button type="button" onClick={() => toPDF()}>
            <Download /> Unduh PDF
          </Button>
        </div>
      </div>

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
              <div className="flex justify-end gap-3 text-sm">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">{formatCurrency(total)}</span>
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
    </PageShell>
  );
}
