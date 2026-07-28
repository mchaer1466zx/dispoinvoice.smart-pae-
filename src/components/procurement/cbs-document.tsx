"use client";

/* eslint-disable @next/next/no-img-element */

import { formatCurrency, formatDate } from "@/lib/format";
import { terbilangRupiah } from "@/lib/terbilang";
import type { CompanyRecord } from "@/app/actions/companies";

// Palet resmi PT Karya Sang Prabu (dari warna logo) — tema tetap template.
const COLORS = {
  gold: "#D4A22C",
  green: "#2E7D32",
  red: "#C62828",
  text: "#121212",
  gray: "#555555",
  yellow: "#FFF59D",
  headerLight: "#FFF3C4",
  border: "#333333",
  black: "#000000",
  groupBg: "#F5F5F5",
};

export type CbsItem = {
  no: string;
  description: string;
  spec?: string;
  qty: number;
  unit?: string;
  unitPrice: number;
  amount: number;
};

export type CbsTotalRow = { label: string; value: number };

export type CbsDocumentProps = {
  docTitle: string;
  docNumber: string;
  company: CompanyRecord | null;
  perihal?: string;
  partyLabel: string;
  partyName: string;
  partyLines?: string[];
  dateLabel: string;
  date: string;
  validity?: string;
  items: CbsItem[];
  subtotal: number;
  extraRows?: CbsTotalRow[];
  grandTotal: number;
  notes?: string;
  paymentTerms?: string[];
};

function formatQty(qty: number): string {
  return Number.isInteger(qty) ? String(qty) : qty.toFixed(1);
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span style={{ color: COLORS.gray }}>{label}</span>
      <span style={{ color: COLORS.text, fontWeight: 600 }}>: {value}</span>
    </>
  );
}

function SignatureColumn({ role }: { role: string }) {
  return (
    <div style={{ flex: 1, textAlign: "center", fontSize: 9 }}>
      <p style={{ color: COLORS.gray, marginBottom: 40 }}>{role}</p>
      <div
        style={{ borderTop: `1px solid ${COLORS.gold}`, margin: "0 12px" }}
      />
      <p style={{ fontWeight: 700, marginTop: 4, color: COLORS.text }}>
        (....................................)
      </p>
      <p style={{ color: COLORS.gray }}>Nama Terang</p>
      <p style={{ color: COLORS.gray }}>Jabatan</p>
      <p style={{ color: COLORS.gray, marginTop: 4 }}>Tanggal : ................</p>
    </div>
  );
}

/**
 * Template dokumen procurement gaya CBS (Purchase Request / Purchase Order):
 * kop surat identitas perusahaan (dari Profil Perusahaan) + blok judul hitam,
 * tabel item, blok total kuning, terbilang, catatan, tanda tangan, footer.
 * Semua angka dihitung di pemanggil dan diformat rupiah Indonesia.
 */
export function CbsDocument(props: CbsDocumentProps) {
  const {
    docTitle,
    docNumber,
    company,
    perihal,
    partyLabel,
    partyName,
    partyLines = [],
    dateLabel,
    date,
    validity,
    items,
    subtotal,
    extraRows = [],
    grandTotal,
    notes,
    paymentTerms = [],
  } = props;

  const now = new Date();
  const printedAt = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(now);

  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "15mm",
        margin: "0 auto",
        background: "#FFFFFF",
        color: COLORS.text,
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 9,
        boxSizing: "border-box",
      }}
    >
      {/* [1] KOP SURAT */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {company?.logoUrl ? (
            <img
              src={company.logoUrl}
              alt="Logo"
              style={{ height: 45, width: "auto", objectFit: "contain" }}
            />
          ) : null}
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.green }}>
              {company?.name ?? "Nama Perusahaan"}
            </p>
            <p style={{ fontSize: 9, color: COLORS.gray, maxWidth: 320 }}>
              {company?.address ?? ""}
            </p>
            <p style={{ fontSize: 9, color: COLORS.gray }}>
              {[company?.phone ? `Telp: ${company.phone}` : null, company?.email]
                .filter(Boolean)
                .join(" | ")}
            </p>
          </div>
        </div>

        <div
          style={{
            background: COLORS.black,
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: 16,
            textAlign: "center",
            padding: "10px 18px",
            letterSpacing: 1,
          }}
        >
          {docTitle.toUpperCase()}
        </div>
      </div>

      <div style={{ height: 2, background: COLORS.gold, margin: "10px 0 14px" }} />

      {/* [2] INFO DASAR */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 24 }}>
        <div style={{ flex: 1 }}>
          {perihal ? (
            <p style={{ fontWeight: 700 }}>HAL : {perihal}</p>
          ) : null}
          <p style={{ color: COLORS.gray, marginTop: 6 }}>{partyLabel} :</p>
          <p style={{ fontWeight: 700 }}>{partyName || "-"}</p>
          {partyLines.filter(Boolean).map((line, i) => (
            <p key={i} style={{ color: COLORS.gray }}>
              {line}
            </p>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto",
            columnGap: 8,
            rowGap: 3,
            fontSize: 9,
            alignSelf: "flex-start",
          }}
        >
          <InfoRow label={dateLabel} value={formatDate(date)} />
          <InfoRow label="Nomor" value={docNumber} />
          <InfoRow label="Halaman" value="1 dari 1" />
          {validity ? <InfoRow label="Jatuh Tempo" value={formatDate(validity)} /> : null}
        </div>
      </div>

      {/* [3] TABEL ITEM */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 14,
          fontSize: 9,
        }}
      >
        <thead>
          <tr style={{ background: COLORS.headerLight, color: COLORS.text }}>
            {["No", "Deskripsi Barang/Jasa", "Qty", "Harga Satuan (IDR)", "Jumlah (IDR)"].map(
              (h, i) => (
                <th
                  key={h}
                  style={{
                    border: `0.5px solid ${COLORS.border}`,
                    padding: "5px 6px",
                    fontWeight: 700,
                    fontSize: 10,
                    textAlign: i >= 2 ? "right" : "left",
                    width: i === 0 ? 28 : i === 2 ? 60 : i >= 3 ? 120 : "auto",
                  }}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.no}>
              <td style={{ border: `0.5px solid ${COLORS.border}`, padding: "5px 6px", textAlign: "center" }}>
                {item.no}
              </td>
              <td style={{ border: `0.5px solid ${COLORS.border}`, padding: "5px 6px" }}>
                {item.description}
                {item.spec ? (
                  <span style={{ color: COLORS.gray }}> — {item.spec}</span>
                ) : null}
              </td>
              <td style={{ border: `0.5px solid ${COLORS.border}`, padding: "5px 6px", textAlign: "right" }}>
                {formatQty(item.qty)}
                {item.unit ? ` ${item.unit}` : ""}
              </td>
              <td style={{ border: `0.5px solid ${COLORS.border}`, padding: "5px 6px", textAlign: "right" }}>
                {formatCurrency(item.unitPrice)}
              </td>
              <td style={{ border: `0.5px solid ${COLORS.border}`, padding: "5px 6px", textAlign: "right" }}>
                {formatCurrency(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* [4] TOTAL */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <table style={{ width: "45%", borderCollapse: "collapse", fontSize: 9 }}>
          <tbody>
            <tr>
              <td style={{ padding: "4px 8px", color: COLORS.gray }}>Subtotal</td>
              <td style={{ padding: "4px 8px", textAlign: "right", fontWeight: 600 }}>
                {formatCurrency(subtotal)}
              </td>
            </tr>
            {extraRows.map((row) => (
              <tr key={row.label}>
                <td style={{ padding: "4px 8px", color: COLORS.gray }}>{row.label}</td>
                <td style={{ padding: "4px 8px", textAlign: "right", fontWeight: 600 }}>
                  {formatCurrency(row.value)}
                </td>
              </tr>
            ))}
            <tr
              style={{
                background: COLORS.yellow,
                borderTop: `2px solid ${COLORS.red}`,
                borderBottom: `2px solid ${COLORS.green}`,
              }}
            >
              <td style={{ padding: "6px 8px", fontWeight: 700, fontSize: 11, color: COLORS.black }}>
                GRAND TOTAL
              </td>
              <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 700, fontSize: 11, color: COLORS.black }}>
                {formatCurrency(grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 8, fontStyle: "italic", fontWeight: 700, color: COLORS.text }}>
        Terbilang : {terbilangRupiah(grandTotal)}
      </p>

      {/* [5] CATATAN & PEMBAYARAN */}
      {notes || paymentTerms.length > 0 ? (
        <div style={{ marginTop: 16, fontSize: 8 }}>
          {notes ? (
            <>
              <p style={{ fontWeight: 700, fontSize: 9 }}>CATATAN :</p>
              <p style={{ color: COLORS.gray, whiteSpace: "pre-line" }}>{notes}</p>
            </>
          ) : null}
          {paymentTerms.length > 0 ? (
            <>
              <p style={{ fontWeight: 700, fontSize: 9, marginTop: 8 }}>CARA PEMBAYARAN :</p>
              <ul style={{ color: COLORS.gray, paddingLeft: 16, listStyle: "disc" }}>
                {paymentTerms.map((term, i) => (
                  <li key={i}>{term}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}

      {/* [6] TANDA TANGAN */}
      <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
        <SignatureColumn role="Pemohon / Pembuat" />
        <SignatureColumn role="Mengetahui / Menyetujui" />
        <SignatureColumn role="Penerima / Vendor" />
      </div>

      {/* [7] FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 24,
          paddingTop: 6,
          borderTop: `0.5px solid ${COLORS.border}`,
          fontSize: 8,
          color: COLORS.gray,
        }}
      >
        <span>© {now.getFullYear()} {company?.name ?? ""} · Sistem Pengadaan Digital</span>
        <span>Halaman 1 dari 1 · Dicetak {printedAt}</span>
      </div>
    </div>
  );
}
