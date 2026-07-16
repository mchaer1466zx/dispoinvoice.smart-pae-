"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DOCUMENT_TYPE_LABELS,
  MOCK_DOCUMENTS,
  type DocumentType,
} from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_VARIANTS: Record<string, "secondary" | "success" | "outline"> = {
  draft: "outline",
  terkirim: "secondary",
  dikirim: "secondary",
  lunas: "success",
  selesai: "success",
};

const TYPE_FILTERS: { value: DocumentType | "semua"; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "invoice", label: DOCUMENT_TYPE_LABELS.invoice },
  { value: "po", label: DOCUMENT_TYPE_LABELS.po },
  { value: "memo", label: DOCUMENT_TYPE_LABELS.memo },
];

export default function RiwayatDokumenPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "semua">("semua");

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return MOCK_DOCUMENTS.filter((doc) => {
      if (typeFilter !== "semua" && doc.type !== typeFilter) return false;
      if (!query) return true;
      return (
        doc.number.toLowerCase().includes(query) ||
        doc.partyName.toLowerCase().includes(query)
      );
    });
  }, [search, typeFilter]);

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-3xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="w-fit" asChild>
            <Link href="/">
              <ArrowLeft /> Kembali ke Buat Invoice
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">Riwayat Dokumen</h1>
          <p className="text-sm text-muted-foreground">
            Semua invoice, purchase order, dan memo disposisi yang pernah dibuat.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Dokumen</CardTitle>
            <CardDescription>
              {filteredDocuments.length} dari {MOCK_DOCUMENTS.length} dokumen
              ditampilkan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <InputGroup>
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Cari nomor dokumen atau nama pelanggan/pemasok..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>

            <div className="flex flex-wrap gap-2">
              {TYPE_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setTypeFilter(filter.value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    typeFilter === filter.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {MOCK_DOCUMENTS.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
                <FileText className="size-8" />
                <p className="text-sm">Belum ada dokumen tersimpan.</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
                <Search className="size-8" />
                <p className="text-sm">Tidak ada dokumen yang cocok dengan pencarian.</p>
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/riwayat-dokumen/${doc.id}`}
                  className="flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{DOCUMENT_TYPE_LABELS[doc.type]}</Badge>
                      <p className="font-semibold">{doc.number}</p>
                    </div>
                    <div className="mt-1 flex flex-col gap-0.5 text-sm text-muted-foreground sm:flex-row sm:gap-4">
                      <span>{doc.partyName}</span>
                      <span>{formatDate(doc.date)}</span>
                    </div>
                  </div>
                  <Badge variant={STATUS_VARIANTS[doc.status] ?? "outline"}>
                    {doc.status}
                  </Badge>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
