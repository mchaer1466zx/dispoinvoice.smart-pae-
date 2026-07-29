"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExportExcelButton } from "@/components/reports/export-excel-button";
import { getReportRowsAction, type ReportRow } from "@/app/actions/reports";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";

const TYPE_FILTERS: { value: DocumentType | "semua"; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "pr", label: DOCUMENT_TYPE_LABELS.pr },
  { value: "rfq", label: DOCUMENT_TYPE_LABELS.rfq },
  { value: "po", label: DOCUMENT_TYPE_LABELS.po },
  { value: "grn", label: DOCUMENT_TYPE_LABELS.grn },
  { value: "quotation", label: DOCUMENT_TYPE_LABELS.quotation },
  { value: "invoice", label: DOCUMENT_TYPE_LABELS.invoice },
  { value: "supplier_invoice", label: DOCUMENT_TYPE_LABELS.supplier_invoice },
  { value: "memo", label: DOCUMENT_TYPE_LABELS.memo },
];

export default function LaporanPage() {
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<DocumentType | "semua">("semua");

  useEffect(() => {
    let active = true;
    getReportRowsAction()
      .then((data) => {
        if (active) setRows(data);
      })
      .catch(() => {
        // Biarkan kosong bila gagal memuat.
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      typeFilter === "semua"
        ? rows
        : rows.filter((r) => r.type === typeFilter),
    [rows, typeFilter]
  );

  const totalValue = useMemo(
    () => filtered.reduce((sum, r) => sum + r.value, 0),
    [filtered]
  );

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Button variant="ghost" size="sm" className="w-fit" asChild>
              <Link href="/dashboard">
                <ArrowLeft /> Kembali ke Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold tracking-tight">
              Laporan Dokumen
            </h1>
            <p className="text-sm text-muted-foreground">
              Rekap seluruh dokumen beserta nilainya, dapat diekspor ke Excel.
            </p>
          </div>
          <ExportExcelButton
            rows={filtered}
            filename={`laporan-${typeFilter}`}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <Button
              key={f.value}
              type="button"
              size="sm"
              variant={f.value === typeFilter ? "default" : "outline"}
              onClick={() => setTypeFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">
                {filtered.length} dokumen
              </CardTitle>
              <CardDescription>
                Total nilai: {formatCurrency(totalValue)}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" /> Memuat laporan…
              </div>
            ) : filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Belum ada dokumen untuk filter ini.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Jenis</th>
                      <th className="px-3 py-2 font-medium">Nomor</th>
                      <th className="px-3 py-2 font-medium">Pihak</th>
                      <th className="px-3 py-2 font-medium">Tanggal</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 text-right font-medium">Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr key={`${r.type}-${i}`} className="border-b last:border-b-0">
                        <td className="px-3 py-2">
                          <Badge variant="outline">
                            {DOCUMENT_TYPE_LABELS[r.type]}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">{r.number}</td>
                        <td className="px-3 py-2">{r.partyName}</td>
                        <td className="px-3 py-2">{formatDate(r.date)}</td>
                        <td className="px-3 py-2">{r.status}</td>
                        <td className="px-3 py-2 text-right">
                          {r.value ? formatCurrency(r.value) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
