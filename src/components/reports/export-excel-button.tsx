"use client";

import * as XLSX from "xlsx";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DOCUMENT_TYPE_LABELS } from "@/lib/mock-data";
import type { ReportRow } from "@/app/actions/reports";

/**
 * Tombol ekspor ke Excel (.xlsx) memakai SheetJS di sisi klien dari daftar
 * baris laporan yang sedang tampil.
 */
export function ExportExcelButton({
  rows,
  filename = "laporan-dokumen",
}: {
  rows: ReportRow[];
  filename?: string;
}) {
  function handleExport() {
    const data = rows.map((r) => ({
      Jenis: DOCUMENT_TYPE_LABELS[r.type],
      Nomor: r.number,
      Pihak: r.partyName,
      Tanggal: r.date,
      Status: r.status,
      Nilai: r.value,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [
      { wch: 22 },
      { wch: 24 },
      { wch: 26 },
      { wch: 12 },
      { wch: 18 },
      { wch: 16 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `${filename}-${stamp}.xlsx`);
  }

  return (
    <Button type="button" onClick={handleExport} disabled={rows.length === 0}>
      <FileDown /> Export Excel
    </Button>
  );
}
