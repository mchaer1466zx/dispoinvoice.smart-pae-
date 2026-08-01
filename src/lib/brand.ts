/**
 * Identitas resmi aplikasi — PT KARYA SANG PRABU. Dipakai untuk metadata, header,
 * footer, pengirim email, dan teks yang tampil ke pengguna. Sumber tunggal agar
 * tidak ada identitas lama (PAE/DispoInvoice) yang tertinggal.
 */
export const BRAND = {
  name: "PT KARYA SANG PRABU",
  shortName: "PT KSP",
  tagline: "THE BEST PARTNER YOUR BUSINESS",
  address: "Jl. Pertanian Raya No. 64, Lebak Bulus, Cilandak, Jakarta Selatan 12440",
  phone: "021 29862350",
  email: "ptkaryasangprabu@gmail.com",
  website: "www.karyasangprabu.co.id",
  appName: "Sistem Pengadaan Digital",
  emailFrom: "PT Karya Sang Prabu <no-reply@karyasangprabu.co.id>",
  logoPath: "/logos/logo-sang-prabu.png",
  // Identitas GRUP (payung PT KSP, PAE, PUB) untuk headline halaman depan.
  groupName: "PRIMA PRABU GROUP",
  groupTagline: "INTERGRITY • COMMITMENT • EXCELLENCE",
  // Perusahaan anggota grup — ditampilkan sebagai penegas kredibilitas di depan.
  groupMembers: [
    "PT Karya Sang Prabu",
    "PT Prima Andalas Energi",
    "PT Prabu Unggul Bersama",
  ],
} as const;

/** Palet warna resmi dari kop surat PT Karya Sang Prabu. */
export const BRAND_COLORS = {
  green: "#0B4D21",
  gold: "#D4AF37",
  goldLight: "#F1C40F",
  red: "#C0392B",
  text: "#1A1A1A",
  gray: "#555555",
  white: "#FFFFFF",
  black: "#000000",
  yellowBlock: "#FFF3B0",
  groupBg: "#F5F5F5",
  watermark: "rgba(212, 175, 55, 0.08)",
} as const;
