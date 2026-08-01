"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import type { PoDetail } from "@/components/po/po-detail-form";
import type { PoItem } from "@/components/po/po-item-list-form";
import type { SupplierRecord } from "@/app/actions/suppliers";
import { calculateInvoiceTotals } from "@/lib/invoice-totals";
import {
  CbsDocument,
  buildCbsGroups,
  type CbsTotalRow,
} from "@/components/procurement/cbs-document";

const DOC_PURPOSE = "PURCHASE ORDER";
const DOC_DESCRIPTION = "Pesanan Pembelian Barang/Jasa";

export function PoPreview({
  poDetail,
  supplier,
  items,
}: {
  poDetail: PoDetail;
  supplier: SupplierRecord | null;
  items: PoItem[];
}) {
  // Waktu pembuatan dokumen — stabil selama komponen hidup.
  const [createdAt] = useState(() =>
    new Intl.DateTimeFormat("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date()),
  );

  const maker = poDetail.signer.name.trim()
    ? `${poDetail.signer.name.trim()}${
        poDetail.signer.jabatan.trim() ? ` (${poDetail.signer.jabatan.trim()})` : ""
      }`
    : "";
  const partner = supplier?.name ?? "";

  // Payload barcode: rangkuman metadata pengesahan dokumen.
  const barcodePayload = useMemo(
    () =>
      [
        `Dokumen: ${DOC_PURPOSE}`,
        `Nomor: ${poDetail.poNumber}`,
        `Pembuat: ${maker || "-"}`,
        `Waktu Pembuatan: ${createdAt}`,
        `Tujuan: ${DOC_PURPOSE}`,
        `Deskripsi: ${DOC_DESCRIPTION}`,
        `Mitra: ${partner || "-"}`,
        `Komentar: ${poDetail.komentar.trim() || "-"}`,
      ].join("\n"),
    [poDetail.poNumber, poDetail.komentar, maker, partner, createdAt],
  );

  const [qrDataUrl, setQrDataUrl] = useState("");
  useEffect(() => {
    let active = true;
    QRCode.toDataURL(barcodePayload, {
      margin: 1,
      width: 320,
      // 'H' (pemulihan ~30%) agar tetap terbaca meski ada emblem di tengah.
      errorCorrectionLevel: "H",
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl("");
      });
    return () => {
      active = false;
    };
  }, [barcodePayload]);

  const groups = buildCbsGroups(
    items.map((item) => ({
      group: item.group,
      description: item.description || "-",
      qty: item.quantity,
      unit: item.unit || undefined,
      unitPrice: item.price,
      amount: item.quantity * item.price,
    }))
  );

  const totals = calculateInvoiceTotals(items, poDetail.tax, poDetail.discount);

  const extraRows: CbsTotalRow[] = [];
  if (totals.discount > 0) {
    extraRows.push({ label: "Diskon", value: -totals.discount });
  }
  if (totals.taxPercent > 0) {
    extraRows.push({
      label: `PPN (${totals.taxPercent}%)`,
      value: totals.taxAmount,
    });
  }

  return (
    <div className="mx-auto w-full max-w-[210mm] overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <CbsDocument
        docTitle="PURCHASE ORDER"
        docNumber={poDetail.poNumber}
        companyId={poDetail.companyId}
        perihal="Pesanan Pembelian Barang/Jasa"
        partyLabel="Kepada"
        partyName={supplier?.name ?? ""}
        partyLines={[supplier?.address ?? "", supplier?.contactInfo ?? ""]}
        dateLabel="Tanggal Pemesanan"
        date={poDetail.orderDate}
        groups={groups}
        subtotal={totals.subtotal}
        extraRows={extraRows}
        grandTotal={totals.total}
        notes={poDetail.notes}
        bodyText={poDetail.berita}
        paymentTerms={poDetail.paymentTerms
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)}
        verification={{
          dataUrl: qrDataUrl,
          maker,
          createdAt,
          purpose: DOC_PURPOSE,
          description: DOC_DESCRIPTION,
          partner,
          comment: poDetail.komentar,
          logo: "/sang-prabu/emblem.png",
        }}
      />
    </div>
  );
}
