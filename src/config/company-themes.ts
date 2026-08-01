/**
 * FILE MASTER MULTI-PERUSAHAAN — sumber tunggal identitas, palet, & elemen
 * visual tiap perusahaan penerbit dokumen. Komponen UI/PDF membaca dari sini;
 * JANGAN hardcode identitas lagi. Menambah perusahaan baru = cukup tambah 1
 * objek pada COMPANY_THEMES.
 */

export type CompanyId = "KSP" | "PAE" | "PUB";

export type DividerOrnament = "SINFUL_KNOT" | "INFINITY_LOOP" | "TWO_TONE_DOT";

export interface CompanyTheme {
  id: CompanyId;
  fullName: string; // Nama besar di kop
  initialName: string; // Nama kecil di logo / watermark
  tagline: string; // Tagline bawah nama
  subTagline?: string; // Keterangan bidang usaha
  // Kontak resmi (persis sesuai gambar kop)
  address: string;
  phone: string;
  email: string;
  website: string;
  // Format nomor dokumen otomatis, contoh: PR/KSP/YYYY/MM/XXX
  docFormat: { pr: string; po: string; grn: string; rfq: string; quotation: string; supplierInvoice: string; invoice: string };
  // PALET WARNA RESMI (diambil dari gambar kop surat)
  colors: {
    primary: string; // Warna utama nama perusahaan
    accent: string; // Warna tagline + ornamen aksen
    accent2?: string; // Warna ornamen tambahan (PUB oranye)
    dark: string; // Teks utama
    muted: string; // Teks kecil
    blockBg: string; // Blok judul kanan atas
    blockText: string; // Teks blok judul
    totalBg: string; // Latar blok grand total
    borderTop: string; // Garis pemisah atas kop
    borderBottom: string; // Garis pemisah bawah kop
    watermark: string; // Warna watermark (opacity rendah)
  };
  // ELEMEN VISUAL KHUSUS TIAP PERUSAHAAN
  visuals: {
    divider: {
      leftColor: string;
      centerOrnament: DividerOrnament;
      rightColor: string;
      thicknessPx: number;
    };
    watermark: {
      showText: boolean; // tampilkan teks besar nama perusahaan
      opacity: number; // 0.06 - 0.1
      sizePercent: number; // 55-70% lebar halaman
    };
    footerCurve: {
      layers: string[]; // urutan WARNA dari PALING BAWAH ke ATAS
      heightPercent: number; // tinggi ornamen terhadap halaman
    };
  };
  logoPath: string;
  /** Font nama perusahaan di kop (opsional; default sans). */
  nameFont?: string;
  /** Warna nama perusahaan di kop (opsional; default colors.primary). */
  nameColor?: string;
}

// ⬇️ PRESET 3 PERUSAHAAN ⬇️
export const COMPANY_THEMES: Record<CompanyId, CompanyTheme> = {
  // 🏢 PT KARYA SANG PRABU (KSP) · Hijau + Emas
  KSP: {
    id: "KSP",
    fullName: "PT KARYA SANG PRABU",
    initialName: "KARYA SANG PRABU",
    // Tagline resmi identitas visual SANG PRABU.
    tagline: "THE BEST PARTNER YOUR BUSINESS",
    address:
      "Jl. Pertanian Raya No. 64, Lebak Bulus, Cilandak, Jakarta Selatan 12440",
    phone: "021 2784 1924",
    email: "ptkaryasangprabu@gmail.com",
    website: "www.karyasangprabu.co.id",
    docFormat: {
      pr: "PR/KSP/YYYY/MM/XXX",
      po: "PO/KSP/YYYY/MM/XXX",
      grn: "GRN/KSP/YYYY/MM/XXX",
      rfq: "RFQ/KSP/YYYY/MM/XXX",
      quotation: "QUO/KSP/YYYY/MM/XXX",
      supplierInvoice: "BILL/KSP/YYYY/MM/XXX",
      invoice: "INV/KSP/YYYY/MM/XXX",
    },
    // PALET RESMI: Gold #DEA402 (mahkota/padi), Green #57A83F (tulisan/daun),
    // Red #D71920 (elemen pengikat), White. Hijau tua #0B4D21 untuk teks & garis.
    colors: {
      primary: "#0B4D21",
      accent: "#DEA402",
      accent2: "#D71920",
      dark: "#1A1A1A",
      muted: "#555555",
      blockBg: "#0B4D21",
      blockText: "#FFFFFF",
      totalBg: "#FBF0CE",
      borderTop: "#0B4D21",
      borderBottom: "#DEA402",
      watermark: "#DEA402",
    },
    visuals: {
      divider: {
        // Garis pembatas identitas: Hijau tua ━ (simpul merah) ━ Hijau tua.
        leftColor: "#0B4D21",
        centerOrnament: "SINFUL_KNOT",
        rightColor: "#0B4D21",
        thicknessPx: 3,
      },
      watermark: { showText: false, opacity: 0.08, sizePercent: 65 },
      footerCurve: { layers: ["#0B4D21", "#DEA402", "#57A83F"], heightPercent: 14 },
    },
    logoPath: "/logos/logo-sang-prabu.png",
    // Selaras identitas logo SANG PRABU: nama serif klasik (Cinzel) hijau daun.
    nameFont: "var(--font-crest), 'Cinzel', 'Times New Roman', serif",
    nameColor: "#57A83F",
  },

  // 🏢 PT PRIMA ANDALAS ENERGI (PAE) · Biru + Hijau
  PAE: {
    id: "PAE",
    fullName: "PT PRIMA ANDALAS ENERGI",
    initialName: "PAE",
    tagline: "INTEGRITY • QUALITY • COMMITMENT",
    subTagline: "Global Commodity Sourcing, Trading & Distribution",
    address:
      "Jl. Pertanian Raya No 64, Lebak Bulus, Cilandak, Jakarta Selatan 12440",
    phone: "021 2784 1924",
    email: "ptprimaandalasenergi@gmail.com",
    website: "www.primaandalasenergi.co.id",
    docFormat: {
      pr: "PR/PAE/YYYY/MM/XXX",
      po: "PO/PAE/YYYY/MM/XXX",
      grn: "GRN/PAE/YYYY/MM/XXX",
      rfq: "RFQ/PAE/YYYY/MM/XXX",
      quotation: "QUO/PAE/YYYY/MM/XXX",
      supplierInvoice: "BILL/PAE/YYYY/MM/XXX",
      invoice: "INV/PAE/YYYY/MM/XXX",
    },
    colors: {
      primary: "#0A3D80",
      accent: "#38A169",
      dark: "#1A1A1A",
      muted: "#555555",
      blockBg: "#0A3D80",
      blockText: "#FFFFFF",
      totalBg: "#DBEAFE",
      borderTop: "#0A3D80",
      borderBottom: "#38A169",
      watermark: "#0A3D80",
    },
    visuals: {
      divider: {
        leftColor: "#0A3D80",
        centerOrnament: "INFINITY_LOOP",
        rightColor: "#38A169",
        thicknessPx: 3,
      },
      watermark: { showText: false, opacity: 0.07, sizePercent: 60 },
      footerCurve: { layers: ["#0A3D80", "#1E6FD9", "#38A169"], heightPercent: 14 },
    },
    logoPath: "/logos/logo-pae.png",
  },

  // 🏢 PT PRABU UNGGUL BERSAMA (PUB) · Biru + Hijau + Oranye
  PUB: {
    id: "PUB",
    fullName: "PT PRABU UNGGUL BERSAMA",
    initialName: "PT. PRABU UNGGUL BERSAMA",
    tagline: "QUALITY • INTERGRITY • EXCELLENCE",
    subTagline:
      "Connecting Markets, Delivering Value • Global Commodity Sourcing, Trading & Distribution",
    address:
      "Jl. Pertanian Raya No. 64, Lebak Bulus, Cilandak, Jakarta Selatan 12440",
    phone: "021 2784 1924",
    email: "info@prabuunggulbersama.co.id",
    website: "www.prabuunggulbersama.co.id",
    docFormat: {
      pr: "PR/PUB/YYYY/MM/XXX",
      po: "PO/PUB/YYYY/MM/XXX",
      grn: "GRN/PUB/YYYY/MM/XXX",
      rfq: "RFQ/PUB/YYYY/MM/XXX",
      quotation: "QUO/PUB/YYYY/MM/XXX",
      supplierInvoice: "BILL/PUB/YYYY/MM/XXX",
      invoice: "INV/PUB/YYYY/MM/XXX",
    },
    colors: {
      primary: "#0A2463",
      accent: "#2E7D32",
      accent2: "#F59E0B",
      dark: "#1A1A1A",
      muted: "#555555",
      blockBg: "#0A2463",
      blockText: "#FFFFFF",
      totalBg: "#FEF3C7",
      borderTop: "#0A2463",
      borderBottom: "#2E7D32",
      watermark: "#0A2463",
    },
    visuals: {
      divider: {
        leftColor: "#0A2463",
        centerOrnament: "TWO_TONE_DOT",
        rightColor: "#2E7D32",
        thicknessPx: 3,
      },
      watermark: { showText: true, opacity: 0.06, sizePercent: 70 },
      footerCurve: {
        layers: ["#0A2463", "#1E6FD9", "#2E7D32", "#F59E0B"],
        heightPercent: 15,
      },
    },
    logoPath: "/logos/logo-pub.png",
  },
};

/** Perusahaan default untuk user baru. */
export const DEFAULT_COMPANY: CompanyId = "KSP";

export const COMPANY_IDS = Object.keys(COMPANY_THEMES) as CompanyId[];

/** Ambil tema; fallback ke default bila id tak dikenal (mis. data lama). */
export function getCompanyTheme(id?: string | null): CompanyTheme {
  if (id && id in COMPANY_THEMES) {
    return COMPANY_THEMES[id as CompanyId];
  }
  return COMPANY_THEMES[DEFAULT_COMPANY];
}

/** Validasi apakah sebuah string adalah CompanyId yang dikenal. */
export function isCompanyId(value: unknown): value is CompanyId {
  return typeof value === "string" && value in COMPANY_THEMES;
}

/**
 * Menebak CompanyId dari nomor dokumen (segmen kedua), mis. "PO/PAE/2026/07/003"
 * → "PAE". Dipakai dokumen tersimpan yang belum menyimpan kode perusahaan
 * terpisah. Fallback ke perusahaan default bila tidak dikenal.
 */
export function companyIdFromDocNumber(docNumber: string): CompanyId {
  const segment = docNumber.split("/")[1];
  return isCompanyId(segment) ? segment : DEFAULT_COMPANY;
}

/**
 * Bentuk prefix nomor dokumen dari pola docFormat + tahun/bulan tertentu.
 * "PR/KSP/YYYY/MM/XXX" → "PR/KSP/2026/07/". Bagian XXX (urut) diisi pemanggil.
 */
export function buildDocPrefix(
  pattern: string,
  year: number,
  month: number
): string {
  const mm = String(month).padStart(2, "0");
  return pattern
    .replace("YYYY", String(year))
    .replace("MM", mm)
    .replace(/XXX$/, "");
}
