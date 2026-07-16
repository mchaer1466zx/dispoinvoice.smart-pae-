"use client";

import { Download, Printer } from "lucide-react";
import { usePDF, Margin } from "react-to-pdf";
import { Button } from "@/components/ui/button";

export function MemoPreviewActions({
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
        <Button
          type="button"
          variant="outline"
          onClick={() => window.print()}
        >
          <Printer /> Cetak
        </Button>
        <Button type="button" onClick={() => toPDF()}>
          <Download /> Ekspor PDF
        </Button>
      </div>
      <div ref={targetRef} id="memo-printable">
        {children}
      </div>
    </div>
  );
}
