"use client";

import { Download, Printer } from "lucide-react";
import { usePDF, Margin } from "react-to-pdf";
import { Button } from "@/components/ui/button";

/** Aksi cetak + ekspor PDF untuk dokumen perjanjian. */
export function AgreementActions({
  filename,
  children,
}: {
  filename: string;
  children: React.ReactNode;
}) {
  const { targetRef, toPDF } = usePDF({
    filename,
    page: { format: "a4", margin: Margin.NONE },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end gap-2 print:hidden">
        <Button type="button" variant="outline" onClick={() => window.print()}>
          <Printer /> Cetak
        </Button>
        <Button type="button" onClick={() => toPDF()}>
          <Download /> Ekspor PDF
        </Button>
      </div>
      <div ref={targetRef}>{children}</div>
    </div>
  );
}
