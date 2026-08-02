"use client";

/* eslint-disable @next/next/no-img-element */

import { formatDate } from "@/lib/format";
import { getCompanyTheme } from "@/config/company-themes";
import {
  hariIndo,
  type AgreementDetail,
} from "@/lib/agreement";

/** Angka → romawi kecil untuk penomoran PASAL. */
const ROMAN = [
  "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI",
  "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
];

/**
 * Dokumen resmi kerja sama (perjanjian berpasal / berita acara / LOI) di atas
 * kop surat premium perusahaan penerbit. Seluruh identitas dibaca dari tema.
 */
export function AgreementDocument({ detail }: { detail: AgreementDetail }) {
  const theme = getCompanyTheme(detail.companyId);
  const c = theme.colors;

  const preamble = detail.preamble
    .replace("[hari]", hariIndo(detail.date))
    .replace("[tanggal]", formatDate(detail.date))
    .replace("[tempat]", detail.place || "-");

  return (
    <div
      style={{
        position: "relative",
        width: "210mm",
        minHeight: "297mm",
        padding: "16mm 16mm 20mm",
        margin: "0 auto",
        background: "#FFFFFF",
        color: c.dark,
        fontFamily: "'Times New Roman', Georgia, serif",
        fontSize: 11,
        lineHeight: 1.5,
        boxSizing: "border-box",
      }}
    >
      {/* ===== KOP SURAT ===== */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <img
          src={theme.logoPath}
          alt={theme.fullName}
          style={{ height: 62, width: "auto", objectFit: "contain" }}
        />
        <div>
          <p
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: theme.nameColor ?? c.primary,
              fontFamily: theme.nameFont ?? "inherit",
              letterSpacing: 0.5,
              textTransform: "uppercase",
              lineHeight: 1,
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
              marginTop: 2,
            }}
          >
            {theme.tagline}
          </p>
          <p style={{ fontSize: 8.5, color: c.dark, marginTop: 3 }}>
            {theme.address}
          </p>
          <p style={{ fontSize: 8.5, color: c.dark }}>
            Telp {theme.phone} · {theme.email} · {theme.website}
          </p>
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ height: 3, background: c.borderTop }} />
        <div style={{ height: 1, background: c.borderBottom, marginTop: 1.5 }} />
      </div>

      {/* ===== JUDUL ===== */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <p style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>
          {detail.title}
        </p>
        {detail.subtitle ? (
          <p style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>
            {detail.subtitle}
          </p>
        ) : null}
        <p style={{ fontSize: 10.5, marginTop: 4 }}>
          Nomor: {detail.number}
        </p>
      </div>

      {/* ===== PEMBUKA ===== */}
      <p style={{ marginTop: 18, textAlign: "justify" }}>{preamble}</p>

      {/* ===== PARA PIHAK ===== */}
      <div style={{ marginTop: 10 }}>
        {detail.parties.map((p, i) => (
          <div key={i} style={{ marginTop: i === 0 ? 0 : 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontWeight: 700 }}>{i + 1}.</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700 }}>{p.name || "—"}</p>
                {p.description ? (
                  <p style={{ textAlign: "justify" }}>{p.description}</p>
                ) : null}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 10px 1fr",
                    rowGap: 1,
                    marginTop: 2,
                  }}
                >
                  {p.jabatan ? (
                    <>
                      <span>Jabatan</span>
                      <span>:</span>
                      <span>{p.jabatan}</span>
                    </>
                  ) : null}
                  {p.address ? (
                    <>
                      <span>Alamat</span>
                      <span>:</span>
                      <span>{p.address}</span>
                    </>
                  ) : null}
                </div>
                <p style={{ marginTop: 4 }}>
                  Selanjutnya disebut sebagai <b>{p.label}</b>.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== KOMPARISI ===== */}
      <p style={{ marginTop: 14, textAlign: "justify" }}>
        {detail.agreementIntro}
      </p>

      {/* ===== PASAL ===== */}
      {detail.pasals.map((pasal, pi) => (
        <div key={pi} style={{ marginTop: 14 }}>
          <p style={{ textAlign: "center", fontWeight: 700 }}>
            PASAL {ROMAN[pi + 1] ?? pi + 1}
          </p>
          <p style={{ textAlign: "center", fontWeight: 700 }}>{pasal.title}</p>
          <div style={{ marginTop: 4 }}>
            {pasal.ayat.map((a, ai) => (
              <div key={ai} style={{ display: "flex", gap: 6, marginTop: 2 }}>
                <span style={{ minWidth: 22 }}>({ai + 1})</span>
                <span style={{ flex: 1, textAlign: "justify" }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ===== NARASI (berita acara / LOI) ===== */}
      {detail.narrative.trim() ? (
        <div
          style={{
            marginTop: 14,
            textAlign: "justify",
            whiteSpace: "pre-line",
          }}
        >
          {detail.narrative}
        </div>
      ) : null}

      {/* ===== PENUTUP ===== */}
      <p style={{ marginTop: 16, textAlign: "justify" }}>{detail.closing}</p>

      {/* ===== TANDA TANGAN ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 40,
          marginTop: 34,
        }}
      >
        {detail.signatories.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <p style={{ fontWeight: 700 }}>{s.label}</p>
            <div style={{ height: 62 }} />
            <p style={{ fontWeight: 700, textDecoration: "underline" }}>
              {s.name?.trim() ? s.name : "(...........................)"}
            </p>
            {s.jabatan ? <p>{s.jabatan}</p> : null}
          </div>
        ))}
      </div>

      {/* materai hint */}
      <p style={{ marginTop: 18, fontSize: 8, color: c.muted, textAlign: "center" }}>
        Dokumen ini sah setelah ditandatangani PARA PIHAK dan dibubuhi materai secukupnya.
      </p>
    </div>
  );
}
