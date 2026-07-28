const SATUAN = [
  "",
  "Satu",
  "Dua",
  "Tiga",
  "Empat",
  "Lima",
  "Enam",
  "Tujuh",
  "Delapan",
  "Sembilan",
  "Sepuluh",
  "Sebelas",
];

function threeDigits(n: number): string {
  let words = "";
  const ratus = Math.floor(n / 100);
  const sisa = n % 100;

  if (ratus === 1) words += "Seratus ";
  else if (ratus > 1) words += `${SATUAN[ratus]} Ratus `;

  if (sisa < 12) {
    words += SATUAN[sisa];
  } else if (sisa < 20) {
    words += `${SATUAN[sisa - 10]} Belas`;
  } else {
    const puluh = Math.floor(sisa / 10);
    const satuan = sisa % 10;
    words += `${SATUAN[puluh]} Puluh`;
    if (satuan > 0) words += ` ${SATUAN[satuan]}`;
  }

  return words.trim();
}

/**
 * Mengubah nominal rupiah (bilangan bulat) menjadi terbilang bahasa Indonesia.
 * Contoh: 195000000 → "Seratus Sembilan Puluh Lima Juta Rupiah".
 */
export function terbilangRupiah(value: number): string {
  const angka = Math.floor(Math.abs(value));
  if (angka === 0) return "Nol Rupiah";

  const groups: { divisor: number; label: string }[] = [
    { divisor: 1_000_000_000_000, label: "Triliun" },
    { divisor: 1_000_000_000, label: "Miliar" },
    { divisor: 1_000_000, label: "Juta" },
    { divisor: 1_000, label: "Ribu" },
    { divisor: 1, label: "" },
  ];

  let remaining = angka;
  const parts: string[] = [];

  for (const { divisor, label } of groups) {
    const count = Math.floor(remaining / divisor);
    remaining %= divisor;
    if (count === 0) continue;

    if (divisor === 1000 && count === 1) {
      parts.push("Seribu");
    } else {
      parts.push(`${threeDigits(count)}${label ? ` ${label}` : ""}`.trim());
    }
  }

  return `${parts.join(" ")} Rupiah`.replace(/\s+/g, " ").trim();
}
