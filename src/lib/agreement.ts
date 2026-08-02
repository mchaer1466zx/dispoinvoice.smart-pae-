/**
 * Model data & template DOKUMEN RESMI KERJA SAMA (perjanjian berpasal,
 * success fee, berita acara, LOI). Dipakai oleh form & preview premium.
 * Konten mudah diedit; template hanya titik awal.
 */

import { DEFAULT_COMPANY, type CompanyId } from "@/config/company-themes";

export type Pasal = { title: string; ayat: string[] };

export type Party = {
  /** "PIHAK PERTAMA", "PIHAK KEDUA", dst. */
  label: string;
  name: string; // nama perusahaan / orang
  jabatan?: string;
  address?: string;
  /** Keterangan pembuka, mis. "Perusahaan yang didirikan berdasarkan hukum RI…". */
  description?: string;
};

export type Signatory = { label: string; name: string; jabatan?: string };

export type AgreementType =
  | "perjanjian-kerja-sama"
  | "perjanjian-success-fee"
  | "berita-acara"
  | "loi";

export type AgreementDetail = {
  companyId: CompanyId;
  type: AgreementType;
  title: string;
  subtitle?: string;
  number: string;
  place: string;
  date: string; // ISO yyyy-mm-dd
  /** Kalimat pembuka sebelum daftar pihak. */
  preamble: string;
  parties: Party[];
  /** Kalimat setelah daftar pihak (komparisi). */
  agreementIntro: string;
  /** Isi berpasal (perjanjian). */
  pasals: Pasal[];
  /** Isi naratif (berita acara / LOI) — dipakai bila pasal kosong / tipe naratif. */
  narrative: string;
  closing: string;
  signatories: Signatory[];
};

export const AGREEMENT_TYPES: { value: AgreementType; label: string }[] = [
  { value: "perjanjian-kerja-sama", label: "Perjanjian Kerja Sama" },
  { value: "perjanjian-success-fee", label: "Perjanjian Success Fee" },
  { value: "berita-acara", label: "Berita Acara" },
  { value: "loi", label: "Letter of Intent (LOI)" },
];

const HARI = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
];
const ROMAN = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII",
];

/** Nama hari untuk kalimat pembuka. */
export function hariIndo(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : HARI[d.getDay()] ?? "";
}

/** Kode singkat tipe dokumen untuk nomor surat. */
function typeCode(type: AgreementType): string {
  switch (type) {
    case "perjanjian-success-fee":
      return "PSF";
    case "berita-acara":
      return "BA";
    case "loi":
      return "LOI";
    default:
      return "PKS";
  }
}

/** Susun nomor surat resmi: 001/<KODE>/<COMPANY>/<ROMAWI>/<TAHUN>. */
export function buildAgreementNumber(
  type: AgreementType,
  companyId: CompanyId,
  seq = 1,
  date = new Date(),
): string {
  const roman = ROMAN[date.getMonth()] ?? String(date.getMonth() + 1);
  return `${String(seq).padStart(3, "0")}/${typeCode(type)}/${companyId}/${roman}/${date.getFullYear()}`;
}

/** Pasal umum untuk Perjanjian Kerja Sama. */
const PKS_PASALS: Pasal[] = [
  {
    title: "MAKSUD DAN TUJUAN",
    ayat: [
      "Perjanjian ini dimaksudkan untuk mengatur kerja sama antara PARA PIHAK dalam rangka mencapai tujuan bersama yang saling menguntungkan.",
    ],
  },
  {
    title: "RUANG LINGKUP KERJA SAMA",
    ayat: [
      "Ruang lingkup kerja sama meliputi hal-hal yang disepakati oleh PARA PIHAK sebagaimana diuraikan dalam Perjanjian ini.",
    ],
  },
  {
    title: "HAK DAN KEWAJIBAN PARA PIHAK",
    ayat: [
      "PIHAK PERTAMA berkewajiban melaksanakan bagiannya sesuai kesepakatan.",
      "PIHAK KEDUA berkewajiban melaksanakan bagiannya sesuai kesepakatan.",
      "PARA PIHAK berhak memperoleh manfaat sesuai porsi yang disepakati.",
    ],
  },
  {
    title: "JANGKA WAKTU",
    ayat: [
      "Perjanjian ini berlaku sejak ditandatangani dan berlaku untuk jangka waktu yang disepakati PARA PIHAK.",
    ],
  },
  {
    title: "PEMBAYARAN",
    ayat: [
      "Ketentuan pembayaran dilakukan sesuai mekanisme yang disepakati PARA PIHAK.",
    ],
  },
  {
    title: "KERAHASIAAN",
    ayat: [
      "PARA PIHAK sepakat menjaga kerahasiaan seluruh informasi, data, dan dokumen yang berkaitan dengan Perjanjian ini.",
      "Ketentuan kerahasiaan tetap berlaku selama dan setelah Perjanjian ini berakhir.",
    ],
  },
  {
    title: "PENYELESAIAN PERSELISIHAN",
    ayat: [
      "Segala perselisihan yang timbul diselesaikan secara musyawarah untuk mufakat.",
      "Apabila musyawarah tidak tercapai, PARA PIHAK memilih penyelesaian melalui jalur hukum yang berlaku.",
    ],
  },
  {
    title: "LAIN-LAIN",
    ayat: [
      "Hal-hal yang belum diatur dalam Perjanjian ini akan diatur kemudian oleh PARA PIHAK secara musyawarah untuk mufakat.",
      "Perjanjian ini dibuat dalam 2 (dua) rangkap, masing-masing bermaterai cukup dan mempunyai kekuatan hukum yang sama.",
    ],
  },
];

/** Pasal Perjanjian Success Fee (mengacu contoh dokumen). */
const PSF_PASALS: Pasal[] = [
  {
    title: "MAKSUD DAN TUJUAN",
    ayat: [
      "Perjanjian ini dimaksudkan untuk mengatur pemberian imbalan (success fee) oleh PIHAK PERTAMA kepada PIHAK KEDUA atas jasa dan peran aktif dalam membantu proses perolehan pembiayaan (pinjaman).",
    ],
  },
  {
    title: "RUANG LINGKUP PEKERJAAN",
    ayat: [
      "PIHAK KEDUA memberikan bantuan, dukungan, dan fasilitasi yang signifikan kepada PIHAK PERTAMA dalam upaya memperoleh pinjaman (pembiayaan) dari lembaga keuangan atau pihak ketiga.",
    ],
  },
  {
    title: "BESARAN SUCCESS FEE",
    ayat: [
      "PIHAK PERTAMA akan memberikan success fee kepada PIHAK KEDUA sebesar 3% (tiga persen) dari nilai pinjaman yang dicairkan.",
      "Pembayaran success fee dilakukan setelah pinjaman dicairkan secara penuh ke rekening perusahaan dan seluruh dokumen pendukung dinyatakan lengkap dan sah oleh PIHAK PERTAMA.",
    ],
  },
  {
    title: "JAMINAN",
    ayat: [
      "Pinjaman yang diajukan menggunakan jaminan sesuai kesepakatan PARA PIHAK.",
      "Data dan dokumen jaminan tersebut digunakan sesuai ketentuan dan persyaratan lembaga keuangan pemberi pinjaman.",
    ],
  },
  {
    title: "PEMBAYARAN",
    ayat: [
      "Success fee dibayarkan selambat-lambatnya 1 x 24 jam setelah dana pinjaman diterima sepenuhnya oleh PIHAK PERTAMA.",
      "Pembayaran dilakukan melalui transfer ke rekening yang diinformasikan oleh PIHAK KEDUA.",
    ],
  },
  {
    title: "KERAHASIAAN",
    ayat: [
      "PARA PIHAK sepakat menjaga kerahasiaan seluruh informasi, data, dokumen, dan hal-hal lain yang berkaitan dengan proses pinjaman dan jaminan yang digunakan.",
      "Ketentuan kerahasiaan berlaku selama dan setelah Perjanjian ini berakhir.",
    ],
  },
  {
    title: "LAIN-LAIN",
    ayat: [
      "Hal-hal yang belum diatur dalam Perjanjian ini akan diatur kemudian oleh PARA PIHAK secara musyawarah untuk mufakat.",
      "Perjanjian ini dibuat dalam 2 (dua) rangkap, masing-masing bermaterai cukup dan mempunyai kekuatan hukum yang sama.",
    ],
  },
];

/** Buat detail default sesuai tipe dokumen. */
export function createAgreement(
  type: AgreementType = "perjanjian-kerja-sama",
  companyId: CompanyId = DEFAULT_COMPANY,
): AgreementDetail {
  const today = new Date().toISOString().slice(0, 10);
  const base = {
    companyId,
    type,
    number: buildAgreementNumber(type, companyId),
    place: "Jakarta",
    date: today,
    parties: [
      {
        label: "PIHAK PERTAMA",
        name: "",
        jabatan: "Direktur Utama",
        address: "",
        description:
          "Perusahaan yang didirikan berdasarkan hukum Republik Indonesia, dalam hal ini diwakili oleh:",
      },
      {
        label: "PIHAK KEDUA",
        name: "",
        jabatan: "",
        address: "",
        description: "Dalam hal ini bertindak untuk dan atas nama diri sendiri:",
      },
    ] as Party[],
    signatories: [
      { label: "PIHAK PERTAMA", name: "", jabatan: "Direktur Utama" },
      { label: "PIHAK KEDUA", name: "", jabatan: "" },
    ] as Signatory[],
  };

  if (type === "berita-acara") {
    return {
      ...base,
      title: "BERITA ACARA",
      subtitle: "",
      preamble:
        "Pada hari ini, [hari] tanggal [tanggal], bertempat di [tempat], telah dilaksanakan hal-hal sebagaimana diuraikan dalam Berita Acara ini oleh:",
      agreementIntro:
        "Dengan ini menyatakan bahwa telah dilakukan dan disepakati hal-hal sebagai berikut:",
      pasals: [],
      narrative:
        "Uraikan kronologi/hasil kegiatan di sini. Contoh: telah dilaksanakan serah terima, pemeriksaan, kesepakatan, atau hasil rapat sesuai kebutuhan.",
      closing:
        "Demikian Berita Acara ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.",
    };
  }

  if (type === "loi") {
    return {
      ...base,
      title: "LETTER OF INTENT (LOI)",
      subtitle: "Surat Pernyataan Minat",
      preamble:
        "Yang bertanda tangan di bawah ini menyatakan minat dan keseriusan untuk melakukan kerja sama/transaksi dengan ketentuan sebagai berikut:",
      agreementIntro:
        "Adapun pokok-pokok minat dan ketentuan adalah sebagai berikut:",
      pasals: [
        {
          title: "MAKSUD",
          ayat: ["Menyatakan minat untuk (uraikan objek/kerja sama)."],
        },
        {
          title: "KETENTUAN",
          ayat: [
            "LOI ini bersifat non-binding dan bukan merupakan perjanjian final.",
            "Transaksi dilanjutkan setelah dilakukan due diligence dan legal check.",
            "LOI ini berlaku selama 30 (tiga puluh) hari kalender sejak tanggal surat ini.",
            "Ketentuan lebih lanjut dituangkan dalam perjanjian tersendiri.",
          ],
        },
      ],
      narrative: "",
      closing:
        "Demikian Letter of Intent ini dibuat dengan itikad baik untuk dipergunakan sebagaimana mestinya.",
    };
  }

  const isPsf = type === "perjanjian-success-fee";
  return {
    ...base,
    title: isPsf ? "PERJANJIAN SUCCESS FEE" : "PERJANJIAN KERJA SAMA",
    subtitle: "",
    preamble:
      "Pada hari ini, [hari] tanggal [tanggal], bertempat di [tempat], yang bertanda tangan di bawah ini:",
    agreementIntro:
      "PIHAK PERTAMA dan PIHAK KEDUA secara bersama-sama disebut PARA PIHAK, dengan ini sepakat untuk mengadakan Perjanjian dengan ketentuan dan syarat-syarat sebagai berikut:",
    pasals: isPsf ? PSF_PASALS.map(clone) : PKS_PASALS.map(clone),
    narrative: "",
    closing:
      "Demikian Perjanjian ini dibuat dengan semangat saling percaya dan kerja sama yang baik untuk mencapai tujuan bersama.",
  };
}

function clone(p: Pasal): Pasal {
  return { title: p.title, ayat: [...p.ayat] };
}
