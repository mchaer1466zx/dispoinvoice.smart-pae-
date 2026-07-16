import QRCode from "qrcode";

export type DocumentJenis = "invoice" | "po" | "memo";

export function buildVerificationUrl(jenis: DocumentJenis, nomor: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/verify/${jenis}/${encodeURIComponent(nomor)}`;
}

/** Menghasilkan QR code (data URL PNG) berisi tautan verifikasi sebuah dokumen. */
export function generateVerificationQrDataUrl(
  jenis: DocumentJenis,
  nomor: string
): Promise<string> {
  const url = buildVerificationUrl(jenis, nomor);
  return QRCode.toDataURL(url, { margin: 1, width: 200 });
}
