"use client";

/* eslint-disable @next/next/no-img-element */

import { Fragment } from "react";
import { formatCurrency, formatDate } from "@/lib/format";
import { terbilangRupiah } from "@/lib/terbilang";
import {
  getCompanyTheme,
  type CompanyId,
  type CompanyTheme,
  type DividerOrnament,
} from "@/config/company-themes";

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
  /** Perusahaan penerbit; menentukan SELURUH identitas & tema visual dokumen. */
  companyId: CompanyId;
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
  /** Isi/berita dokumen (narasi bebas, bisa diedit) — tampil sebelum tanda tangan. */
  bodyText?: string;
  /** Penandatangan dokumen: peran + nama + jabatan (cukup satu). */
  signers?: { role: string; name?: string; jabatan?: string }[];
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

function fmtQty(qty: number): string {
  return Number.isInteger(qty) ? String(qty) : qty.toFixed(1).replace(".", ",");
}

/** Ornamen tengah garis pemisah kop — beda tiap perusahaan (sesuai gambar kop). */
function DividerMark({
  type,
  theme,
}: {
  type: DividerOrnament;
  theme: CompanyTheme;
}) {
  const base: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: -7,
    transform: "translateX(-50%)",
    background: "#FFFFFF",
    padding: "0 8px",
    display: "flex",
    alignItems: "center",
    gap: 3,
    lineHeight: 1,
  };
  if (type === "TWO_TONE_DOT") {
    return (
      <span style={base}>
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: theme.colors.primary,
          }}
        />
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: theme.colors.accent2 ?? theme.colors.accent,
          }}
        />
      </span>
    );
  }
  // SINFUL_KNOT (simpul merah) & INFINITY_LOOP (∞) memakai glyph tak-hingga.
  const color = type === "SINFUL_KNOT" ? "#C0392B" : theme.colors.accent;
  return (
    <span style={{ ...base, color, fontSize: 13, fontWeight: 700 }}>∞</span>
  );
}

/** Ornamen lengkung bertingkat pojok kanan bawah, warna dari theme.footerCurve. */
function FooterCurve({ theme }: { theme: CompanyTheme }) {
  const layers = theme.visuals.footerCurve.layers;
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        bottom: 0,
        width: 210,
        height: 100,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {layers.map((color, i) => {
        const inset = i * 11;
        return (
          <div
            key={`${color}-${i}`}
            style={{
              position: "absolute",
              right: -40 + inset,
              bottom: -40 + inset,
              width: 210 - inset * 2,
              height: 125 - inset * 2,
              borderTopLeftRadius: "100%",
              background: color,
            }}
          />
        );
      })}
      {/* tutup putih supaya tampak sebagai pita bertingkat */}
      <div
        style={{
          position: "absolute",
          right: -40 + layers.length * 11,
          bottom: -40 + layers.length * 11,
          width: 210 - layers.length * 22,
          height: 125 - layers.length * 22,
          borderTopLeftRadius: "100%",
          background: "#FFFFFF",
        }}
      />
    </div>
  );
}

/**
 * Template dokumen procurement gaya CBS yang SEPENUHNYA bertema: seluruh
 * identitas, palet, ornamen garis, watermark, blok judul, blok total, dan
 * ornamen sudut dibaca dari COMPANY_THEMES[companyId]. Tidak ada identitas
 * yang di-hardcode — ganti companyId → semua elemen visual berubah.
 */
export function CbsDocument(props: CbsDocumentProps) {
  const {
    docTitle,
    docNumber,
    companyId,
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
    bodyText,
    signers,
  } = props;

  const signer = (signers && signers[0]) ?? {
    role: "Disetujui Oleh,",
    name: "",
    jabatan: "",
  };

  const theme = getCompanyTheme(companyId);
  const c = theme.colors;

  const cell: React.CSSProperties = {
    border: `0.5px solid ${c.dark}`,
    padding: "4px 6px",
    verticalAlign: "top",
  };

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
        color: c.dark,
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
        <img
          src={theme.logoPath}
          alt=""
          style={{
            width: `${theme.visuals.watermark.sizePercent}%`,
            opacity: theme.visuals.watermark.opacity,
            objectFit: "contain",
          }}
        />
        {theme.visuals.watermark.showText ? (
          <span
            style={{
              marginTop: 8,
              fontSize: 34,
              fontWeight: 800,
              color: c.watermark,
              opacity: theme.visuals.watermark.opacity,
              letterSpacing: 2,
              textAlign: "center",
            }}
          >
            {theme.fullName}
          </span>
        ) : null}
      </div>

      {/* [9] ORNAMEN SUDUT KANAN BAWAH */}
      <FooterCurve theme={theme} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* [1] KOP SURAT */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img
              src={theme.logoPath}
              alt={`Logo ${theme.fullName}`}
              style={{ height: 54, width: "auto", objectFit: "contain" }}
            />
            <div>
              <p
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: theme.nameColor ?? c.primary,
                  fontFamily: theme.nameFont ?? "inherit",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {theme.fullName}
              </p>
              <p
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: c.accent,
                  letterSpacing: 2,
                }}
              >
                {theme.tagline}
              </p>
              {theme.subTagline ? (
                <p style={{ fontSize: 7.5, color: c.muted, fontStyle: "italic" }}>
                  {theme.subTagline}
                </p>
              ) : null}
              <p style={{ fontSize: 8, color: c.dark, marginTop: 2 }}>
                📍 {theme.address}
              </p>
              <p style={{ fontSize: 8, color: c.dark }}>
                📞 {theme.phone} ✉️ {theme.email} 🌐 {theme.website}
              </p>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                background: c.blockBg,
                color: c.blockText,
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

        {/* garis pemisah bertema + ornamen tengah */}
        <div style={{ position: "relative", marginTop: 8 }}>
          <div
            style={{
              height: theme.visuals.divider.thicknessPx,
              background: c.borderTop,
            }}
          />
          <div style={{ height: 1, background: c.borderBottom, marginTop: 1 }} />
          <DividerMark type={theme.visuals.divider.centerOrnament} theme={theme} />
        </div>

        {/* [4] INFO DASAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 24,
            marginTop: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            {perihal ? <p style={{ fontWeight: 700 }}>HAL : {perihal}</p> : null}
            <p style={{ color: c.muted, marginTop: 6 }}>{partyLabel} :</p>
            <p style={{ fontWeight: 700 }}>{partyName || "-"}</p>
            {partyLines.filter(Boolean).map((line, i) => (
              <p key={i} style={{ color: c.muted }}>
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
              alignSelf: "flex-start",
            }}
          >
            <span style={{ color: c.muted }}>Tanggal</span>
            <span style={{ fontWeight: 600 }}>: {formatDate(date)}</span>
            <span style={{ color: c.muted }}>Nomor</span>
            <span style={{ fontWeight: 600 }}>: {docNumber}</span>
            <span style={{ color: c.muted }}>Halaman</span>
            <span style={{ fontWeight: 600 }}>: 1 dari 1</span>
            <span style={{ color: c.muted }}>{validity ? "Jatuh Tempo" : dateLabel}</span>
            <span style={{ fontWeight: 600 }}>
              : {formatDate(validity ?? date)}
            </span>
          </div>
        </div>

        {/* [5] TABEL ITEM BERTINGKAT */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 12,
            fontSize: 8.5,
          }}
        >
          <thead>
            <tr style={{ background: c.totalBg }}>
              <th style={{ ...cell, fontWeight: 700, width: 24, textAlign: "center" }}>
                No
              </th>
              <th style={{ ...cell, fontWeight: 700, textAlign: "left" }}>
                Deskripsi Pekerjaan / Barang
              </th>
              <th style={{ ...cell, fontWeight: 700, width: 70, textAlign: "right" }}>
                Qty
              </th>
              <th style={{ ...cell, fontWeight: 700, width: 100, textAlign: "right" }}>
                Harga Satuan
              </th>
              <th style={{ ...cell, fontWeight: 700, width: 110, textAlign: "right" }}>
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, gi) => {
              const hasLabel = Boolean(group.label);
              const roman = hasLabel ? ROMAN[romanIndex++] ?? String(romanIndex) : "";
              return (
                <Fragment key={`grp-${gi}`}>
                  {hasLabel ? (
                    <tr style={{ background: "#F5F5F5" }}>
                      <td style={{ ...cell, fontWeight: 700, textAlign: "center" }}>
                        {roman}
                      </td>
                      <td style={{ ...cell, fontWeight: 700 }}>{group.label}</td>
                      <td style={cell} />
                      <td style={cell} />
                      <td
                        style={{
                          ...cell,
                          fontWeight: 700,
                          textAlign: "right",
                          color: c.accent,
                        }}
                      >
                        {formatCurrency(group.subtotal)}
                      </td>
                    </tr>
                  ) : null}
                  {group.items.map((item, ii) => (
                    <tr key={`g-${gi}-i-${ii}`}>
                      <td style={{ ...cell, textAlign: "center" }}>
                        {hasLabel ? "" : ii + 1}
                      </td>
                      <td style={{ ...cell, paddingLeft: hasLabel ? 16 : 6 }}>
                        {hasLabel ? "- " : ""}
                        {item.description}
                        {item.spec ? (
                          <span style={{ color: c.muted }}> ({item.spec})</span>
                        ) : null}
                      </td>
                      <td style={{ ...cell, textAlign: "right" }}>
                        {fmtQty(item.qty)}
                        {item.unit ? ` ${item.unit}` : ""}
                      </td>
                      <td style={{ ...cell, textAlign: "right" }}>
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td style={{ ...cell, textAlign: "right" }}>
                        {formatCurrency(item.amount)}
                      </td>
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
                <td style={{ padding: "4px 8px", color: c.muted }}>SUBTOTAL</td>
                <td style={{ padding: "4px 8px", textAlign: "right", fontWeight: 600 }}>
                  {formatCurrency(subtotal)}
                </td>
              </tr>
              {extraRows.map((row) => (
                <tr key={row.label}>
                  <td style={{ padding: "4px 8px", color: c.muted }}>{row.label}</td>
                  <td style={{ padding: "4px 8px", textAlign: "right", fontWeight: 600 }}>
                    {formatCurrency(row.value)}
                  </td>
                </tr>
              ))}
              <tr
                style={{
                  background: c.totalBg,
                  borderTop: `2px solid ${c.primary}`,
                  borderBottom: `2px solid ${c.accent}`,
                }}
              >
                <td style={{ padding: "7px 8px", fontWeight: 800, fontSize: 11 }}>
                  GRAND TOTAL
                </td>
                <td
                  style={{
                    padding: "7px 8px",
                    textAlign: "right",
                    fontWeight: 800,
                    fontSize: 11,
                  }}
                >
                  {formatCurrency(grandTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 6, fontStyle: "italic", fontWeight: 700 }}>
          Terbilang : {terbilangRupiah(grandTotal)}
        </p>

        {/* [6b] BERITA / ISI DOKUMEN (bebas, bisa diedit) */}
        {bodyText?.trim() ? (
          <div
            style={{
              marginTop: 12,
              fontSize: 8.5,
              lineHeight: 1.55,
              whiteSpace: "pre-line",
            }}
          >
            {bodyText}
          </div>
        ) : null}

        {/* [7] CATATAN & PEMBAYARAN */}
        {notes || paymentTerms.length > 0 || bankInfo ? (
          <div style={{ marginTop: 14, fontSize: 8 }}>
            {notes ? (
              <>
                <p style={{ fontWeight: 700, fontSize: 9 }}>CATATAN :</p>
                <p style={{ color: c.muted, whiteSpace: "pre-line" }}>{notes}</p>
              </>
            ) : null}
            {paymentTerms.length > 0 ? (
              <>
                <p style={{ fontWeight: 700, fontSize: 9, marginTop: 6 }}>
                  CARA PEMBAYARAN :
                </p>
                <ul style={{ color: c.muted, paddingLeft: 16, listStyle: "disc" }}>
                  {paymentTerms.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </>
            ) : null}
            {bankInfo ? (
              <p style={{ color: c.muted, marginTop: 4 }}>{bankInfo}</p>
            ) : null}
          </div>
        ) : null}

        {/* [8] TANDA TANGAN — satu kolom (Nama & Jabatan) */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
          <div style={{ width: "48%", textAlign: "center", fontSize: 8.5 }}>
            <p style={{ color: c.muted }}>{signer.role || "Disetujui Oleh,"}</p>
            <p style={{ fontWeight: 700, marginTop: 2 }}>{theme.fullName}</p>
            <div style={{ height: 42 }} />
            <div style={{ borderTop: `1px solid ${c.accent}`, margin: "0 20px" }} />
            <p style={{ fontWeight: 700, marginTop: 3 }}>
              {signer.name?.trim()
                ? signer.name.trim()
                : "(............................)"}
            </p>
            <p style={{ color: c.muted }}>
              Jabatan:{" "}
              {signer.jabatan?.trim() ? signer.jabatan.trim() : "..............."}
            </p>
          </div>
        </div>

        {/* [10] FOOTER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 18,
            paddingTop: 6,
            borderTop: `0.5px solid ${c.dark}`,
            fontSize: 7.5,
            color: c.muted,
          }}
        >
          <span>
            © {new Date().getFullYear()} {theme.fullName} · Sistem Pengadaan Digital
          </span>
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
