"use client";

/* eslint-disable @next/next/no-img-element */

import { Fragment } from "react";
import { formatCurrency, formatDate } from "@/lib/format";
import { terbilangRupiah } from "@/lib/terbilang";
import { BRAND, BRAND_COLORS as C } from "@/lib/brand";
import type { CompanyRecord } from "@/app/actions/companies";

export type CbsItem = {
  description: string;
  spec?: string;
  qty: number;
  unit?: string;
  unitPrice: number;
  amount: number;
};

export type CbsGroup = { label?: string; items: CbsItem[]; subtotal: number };

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
  groups: CbsGroup[];
  subtotal: number;
  extraRows?: CbsTotalRow[];
  grandTotal: number;
  notes?: string;
  paymentTerms?: string[];
  bankInfo?: string;
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

function fmtQty(qty: number): string {
  return Number.isInteger(qty) ? String(qty) : qty.toFixed(1).replace(".", ",");
}

const cell: React.CSSProperties = {
  border: `0.5px solid ${C.text}`,
  padding: "4px 6px",
  verticalAlign: "top",
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span style={{ color: C.gray }}>{label}</span>
      <span style={{ fontWeight: 600 }}>: {value}</span>
    </>
  );
}

function Signature({ role }: { role: string }) {
  return (
    <div style={{ flex: 1, textAlign: "center", fontSize: 8.5 }}>
      <p style={{ color: C.gray, marginBottom: 38 }}>{role}</p>
      <div style={{ borderTop: `1px solid ${C.gold}`, margin: "0 10px" }} />
      <p style={{ fontWeight: 700, marginTop: 3 }}>(............................)</p>
      <p style={{ color: C.gray }}>Nama Terang · Jabatan</p>
      <p style={{ color: C.gray }}>Tanggal : ..............</p>
    </div>
  );
}

/**
 * Template dokumen procurement gaya CBS dengan identitas PT Karya Sang Prabu:
 * kop letterhead (logo + nama hijau + tagline emas + kontak), garis hijau-emas
 * dengan simpul merah, watermark logo samar, blok judul hitam, tabel bertingkat
 * (Romawi per kelompok + subtotal), blok total kuning, terbilang, catatan,
 * tanda tangan, ornamen sudut emas-hijau, dan footer. Semua angka dari pemanggil.
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
    groups,
    subtotal,
    extraRows = [],
    grandTotal,
    notes,
    paymentTerms = [],
    bankInfo,
  } = props;

  const name = company?.name ?? BRAND.name;
  const address = company?.address ?? BRAND.address;
  const phone = company?.phone ?? BRAND.phone;
  const email = company?.email ?? BRAND.email;
  const logoUrl = company?.logoUrl ?? null;

  const printedAt = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  let romanIndex = 0;

  return (
    <div
      style={{
        position: "relative",
        width: "210mm",
        minHeight: "297mm",
        padding: "14mm",
        margin: "0 auto",
        background: "#FFFFFF",
        color: C.text,
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 9,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* [2] WATERMARK */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt=""
            style={{ width: "55%", opacity: 0.08, objectFit: "contain" }}
          />
        ) : null}
        <span
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: C.gold,
            opacity: 0.08,
            letterSpacing: 2,
            textAlign: "center",
          }}
        >
          {name}
        </span>
      </div>

      {/* [9] ORNAMEN SUDUT KANAN BAWAH */}
      <div style={{ position: "absolute", right: 0, bottom: 0, width: 190, height: 90, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", right: -40, bottom: -40, width: 200, height: 120, borderTopLeftRadius: "100%", background: C.green }} />
        <div style={{ position: "absolute", right: -30, bottom: -30, width: 180, height: 100, borderTopLeftRadius: "100%", background: C.gold }} />
        <div style={{ position: "absolute", right: -25, bottom: -25, width: 165, height: 88, borderTopLeftRadius: "100%", background: "#FFFFFF" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* [1] KOP SURAT */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" style={{ height: 52, width: "auto", objectFit: "contain" }} />
            ) : null}
            <div>
              <p style={{ fontSize: 17, fontWeight: 800, color: C.green, letterSpacing: 1, textTransform: "uppercase" }}>
                {name}
              </p>
              <p style={{ fontSize: 9, fontWeight: 700, color: C.gold, letterSpacing: 2 }}>
                {BRAND.tagline}
              </p>
              <p style={{ fontSize: 8, color: C.text, marginTop: 2 }}>📍 {address}</p>
              <p style={{ fontSize: 8, color: C.text }}>
                📞 {phone}{email ? `  ✉️ ${email}` : ""}  🌐 {BRAND.website}
              </p>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                background: C.black,
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: 15,
                textAlign: "center",
                padding: "9px 16px",
                letterSpacing: 1,
                minWidth: 170,
              }}
            >
              {docTitle.toUpperCase()}
            </div>
          </div>
        </div>

        {/* garis hijau + emas + simpul merah */}
        <div style={{ position: "relative", marginTop: 8 }}>
          <div style={{ height: 2.5, background: C.green }} />
          <div style={{ height: 1, background: C.gold, marginTop: 1 }} />
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: -6,
              transform: "translateX(-50%)",
              color: C.red,
              fontSize: 12,
              background: "#FFFFFF",
              padding: "0 6px",
            }}
          >
            ∞
          </span>
        </div>

        {/* [4] INFO DASAR */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginTop: 12 }}>
          <div style={{ flex: 1 }}>
            {perihal ? <p style={{ fontWeight: 700 }}>HAL : {perihal}</p> : null}
            <p style={{ color: C.gray, marginTop: 6 }}>{partyLabel} :</p>
            <p style={{ fontWeight: 700 }}>{partyName || "-"}</p>
            {partyLines.filter(Boolean).map((line, i) => (
              <p key={i} style={{ color: C.gray }}>{line}</p>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "auto auto", columnGap: 8, rowGap: 3, alignSelf: "flex-start" }}>
            <InfoRow label="Tanggal" value={formatDate(date)} />
            <InfoRow label="Nomor" value={docNumber} />
            <InfoRow label="Halaman" value="1 dari 1" />
            {validity ? <InfoRow label="Jatuh Tempo" value={formatDate(validity)} /> : null}
            {!validity ? <InfoRow label={dateLabel} value={formatDate(date)} /> : null}
          </div>
        </div>

        {/* [5] TABEL ITEM BERTINGKAT */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, fontSize: 8.5 }}>
          <thead>
            <tr style={{ background: C.yellowBlock }}>
              <th style={{ ...cell, fontWeight: 700, width: 24, textAlign: "center" }}>No</th>
              <th style={{ ...cell, fontWeight: 700, textAlign: "left" }}>Deskripsi Pekerjaan / Barang</th>
              <th style={{ ...cell, fontWeight: 700, width: 70, textAlign: "right" }}>Qty</th>
              <th style={{ ...cell, fontWeight: 700, width: 100, textAlign: "right" }}>Harga Satuan</th>
              <th style={{ ...cell, fontWeight: 700, width: 110, textAlign: "right" }}>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, gi) => {
              const hasLabel = Boolean(group.label);
              const roman = hasLabel ? ROMAN[romanIndex++] ?? String(romanIndex) : "";
              return (
                <Fragment key={`grp-${gi}`}>
                  {hasLabel ? (
                    <tr style={{ background: C.groupBg }}>
                      <td style={{ ...cell, fontWeight: 700, textAlign: "center" }}>{roman}</td>
                      <td style={{ ...cell, fontWeight: 700 }}>{group.label}</td>
                      <td style={cell} />
                      <td style={cell} />
                      <td style={{ ...cell, fontWeight: 700, textAlign: "right", color: C.gold }}>
                        {formatCurrency(group.subtotal)}
                      </td>
                    </tr>
                  ) : null}
                  {group.items.map((item, ii) => (
                    <tr key={`g-${gi}-i-${ii}`}>
                      <td style={{ ...cell, textAlign: "center" }}>{hasLabel ? "" : ii + 1}</td>
                      <td style={{ ...cell, paddingLeft: hasLabel ? 16 : 6 }}>
                        {hasLabel ? "- " : ""}
                        {item.description}
                        {item.spec ? <span style={{ color: C.gray }}> ({item.spec})</span> : null}
                      </td>
                      <td style={{ ...cell, textAlign: "right" }}>
                        {fmtQty(item.qty)}{item.unit ? ` ${item.unit}` : ""}
                      </td>
                      <td style={{ ...cell, textAlign: "right" }}>{formatCurrency(item.unitPrice)}</td>
                      <td style={{ ...cell, textAlign: "right" }}>{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>

        {/* [6] TOTAL */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <table style={{ width: "45%", borderCollapse: "collapse", fontSize: 9 }}>
            <tbody>
              <tr>
                <td style={{ padding: "4px 8px", color: C.gray }}>SUBTOTAL</td>
                <td style={{ padding: "4px 8px", textAlign: "right", fontWeight: 600 }}>{formatCurrency(subtotal)}</td>
              </tr>
              {extraRows.map((row) => (
                <tr key={row.label}>
                  <td style={{ padding: "4px 8px", color: C.gray }}>{row.label}</td>
                  <td style={{ padding: "4px 8px", textAlign: "right", fontWeight: 600 }}>{formatCurrency(row.value)}</td>
                </tr>
              ))}
              <tr style={{ background: C.yellowBlock, borderTop: `2px solid ${C.red}`, borderBottom: `2px solid ${C.green}` }}>
                <td style={{ padding: "7px 8px", fontWeight: 800, fontSize: 11 }}>GRAND TOTAL</td>
                <td style={{ padding: "7px 8px", textAlign: "right", fontWeight: 800, fontSize: 11 }}>{formatCurrency(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 6, fontStyle: "italic", fontWeight: 700 }}>
          Terbilang : {terbilangRupiah(grandTotal)}
        </p>

        {/* [7] CATATAN & PEMBAYARAN */}
        {notes || paymentTerms.length > 0 || bankInfo ? (
          <div style={{ marginTop: 14, fontSize: 8 }}>
            {notes ? (
              <>
                <p style={{ fontWeight: 700, fontSize: 9 }}>CATATAN :</p>
                <p style={{ color: C.gray, whiteSpace: "pre-line" }}>{notes}</p>
              </>
            ) : null}
            {paymentTerms.length > 0 ? (
              <>
                <p style={{ fontWeight: 700, fontSize: 9, marginTop: 6 }}>CARA PEMBAYARAN :</p>
                <ul style={{ color: C.gray, paddingLeft: 16, listStyle: "disc" }}>
                  {paymentTerms.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </>
            ) : null}
            {bankInfo ? <p style={{ color: C.gray, marginTop: 4 }}>{bankInfo}</p> : null}
          </div>
        ) : null}

        {/* [8] TANDA TANGAN */}
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <Signature role="Pemohon / Pembuat" />
          <Signature role="Mengetahui / Menyetujui" />
          <Signature role="Penerima / Vendor" />
        </div>

        {/* [10] FOOTER */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, paddingTop: 6, borderTop: `0.5px solid ${C.text}`, fontSize: 7.5, color: C.gray }}>
          <span>© {new Date().getFullYear()} {name} · {BRAND.appName}</span>
          <span>Halaman 1 dari 1 · Dicetak {printedAt}</span>
        </div>
      </div>
    </div>
  );
}

/** Membentuk kelompok CBS dari daftar item datar berdasarkan groupLabel (urut kemunculan). */
export function buildCbsGroups(
  items: (CbsItem & { group?: string | null })[]
): CbsGroup[] {
  const anyGroup = items.some((i) => (i.group ?? "").trim());
  if (!anyGroup) {
    return [{ items, subtotal: items.reduce((s, i) => s + i.amount, 0) }];
  }
  const order: string[] = [];
  const map = new Map<string, CbsItem[]>();
  for (const item of items) {
    const key = (item.group ?? "").trim() || "Lain-lain";
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(item);
  }
  return order.map((label) => {
    const groupItems = map.get(label)!;
    return {
      label,
      items: groupItems,
      subtotal: groupItems.reduce((s, i) => s + i.amount, 0),
    };
  });
}
