"use client";

import { useEffect, useState } from "react";
import {
  generateVerificationQrDataUrl,
  type DocumentJenis,
} from "@/lib/verification";

export function DocumentQrCode({
  jenis,
  nomor,
}: {
  jenis: DocumentJenis;
  nomor: string;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const trimmedNomor = nomor.trim();

  useEffect(() => {
    if (!trimmedNomor) return;

    let cancelled = false;

    generateVerificationQrDataUrl(jenis, trimmedNomor).then((url) => {
      if (!cancelled) setDataUrl(url);
    });

    return () => {
      cancelled = true;
    };
  }, [jenis, trimmedNomor]);

  if (!trimmedNomor || !dataUrl) return null;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* eslint-disable-next-line @next/next/no-img-element -- rendered inside html2canvas-captured preview, next/image is not compatible there */}
      <img
        src={dataUrl}
        alt="QR verifikasi dokumen"
        style={{ width: "2.5cm", height: "2.5cm" }}
      />
      <p className="text-[9px] text-gray-500">Pindai untuk verifikasi</p>
    </div>
  );
}
