export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type CompanyProfile = {
  name: string;
  address: string;
  email: string;
  phone: string;
  logoInitials: string;
  /** URL logo yang diunggah di Profil Perusahaan; null jika belum ada. */
  logoUrl: string | null;
};

/** Logo resmi perusahaan, disimpan di public/logo-pae.jpg. */
export const COMPANY_LOGO_URL = "/logo-pae.jpg";

export const MOCK_COMPANY: CompanyProfile = {
  name: "PT Prima Andalas Energi",
  address: "Jl. Sudirman Kav. 25, Jakarta Pusat, Indonesia",
  email: "info@primaandalasenergi.co.id",
  phone: "021-2233-4567",
  logoInitials: "PAE",
  logoUrl: COMPANY_LOGO_URL,
};

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "PT Sinar Abadi Sejahtera",
    email: "keuangan@sinarabadi.co.id",
    phone: "021-5551234",
    address: "Jl. Gatot Subroto No. 12, Jakarta Selatan",
  },
  {
    id: "cust-2",
    name: "CV Mitra Teknik Utama",
    email: "admin@mitrateknik.com",
    phone: "022-7778899",
    address: "Jl. Asia Afrika No. 45, Bandung",
  },
  {
    id: "cust-3",
    name: "PT Nusantara Digital Kreasi",
    email: "billing@nusantaradigital.id",
    phone: "031-4443322",
    address: "Jl. Basuki Rahmat No. 8, Surabaya",
  },
  {
    id: "cust-4",
    name: "Toko Berkah Jaya",
    email: "berkahjaya.toko@gmail.com",
    phone: "0811-2233-4455",
    address: "Jl. Ahmad Yani No. 100, Semarang",
  },
];

export type DocumentType = "invoice" | "po" | "memo";

export type DocumentLineItem = {
  description: string;
  quantity: number;
  price: number;
};

export type DocumentSummary = {
  id: string;
  type: DocumentType;
  number: string;
  partyName: string;
  date: string;
  status: string;
  /** Rincian item barang/jasa; hanya dipakai invoice & PO. */
  items?: DocumentLineItem[];
  /** Isi & instruksi memo; hanya dipakai memo disposisi. */
  content?: string;
  instructions?: string;
  notes?: string;
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  invoice: "Invoice",
  po: "Purchase Order",
  memo: "Memo Disposisi",
};

export const MOCK_DOCUMENTS: DocumentSummary[] = [
  {
    id: "doc-inv-1",
    type: "invoice",
    number: "INV-202601-0001",
    partyName: "PT Sinar Abadi Sejahtera",
    date: "2026-01-10",
    status: "lunas",
    items: [
      { description: "Jasa konsultasi implementasi sistem", quantity: 1, price: 15000000 },
      { description: "Lisensi perangkat lunak (tahunan)", quantity: 2, price: 3500000 },
    ],
    notes: "Pembayaran diterima penuh melalui transfer bank.",
  },
  {
    id: "doc-inv-2",
    type: "invoice",
    number: "INV-202602-0002",
    partyName: "CV Mitra Teknik Utama",
    date: "2026-02-14",
    status: "terkirim",
    items: [
      { description: "Instalasi jaringan kantor", quantity: 1, price: 8500000 },
      { description: "Perangkat access point", quantity: 4, price: 950000 },
    ],
    notes: "Menunggu konfirmasi pembayaran dari klien.",
  },
  {
    id: "doc-po-1",
    type: "po",
    number: "PO-202601-0001",
    partyName: "PT Sumber Kertas Nusantara",
    date: "2026-01-18",
    status: "selesai",
    items: [
      { description: "Kertas HVS A4 80gr (rim)", quantity: 50, price: 55000 },
      { description: "Amplop coklat folio", quantity: 200, price: 1500 },
    ],
    notes: "Barang telah diterima sesuai pesanan.",
  },
  {
    id: "doc-po-2",
    type: "po",
    number: "PO-202602-0002",
    partyName: "CV Elektronik Jaya Makmur",
    date: "2026-02-20",
    status: "dikirim",
    items: [
      { description: "Router WiFi 6 kantor", quantity: 3, price: 2200000 },
      { description: "Kabel LAN Cat6 (roll)", quantity: 5, price: 850000 },
    ],
    notes: "Estimasi tiba dalam 3 hari kerja.",
  },
  {
    id: "doc-memo-1",
    type: "memo",
    number: "Persetujuan Anggaran Q1",
    partyName: "Manajer Keuangan",
    date: "2026-01-25",
    status: "draft",
    content:
      "Mohon persetujuan atas anggaran operasional kuartal pertama sebesar Rp250.000.000 untuk kebutuhan pengadaan dan operasional kantor.",
    instructions: "Mohon ditinjau dan disetujui sebelum akhir bulan.",
  },
  {
    id: "doc-memo-2",
    type: "memo",
    number: "Disposisi Rapat Koordinasi",
    partyName: "Kepala Divisi Operasional",
    date: "2026-03-02",
    status: "draft",
    content:
      "Menindaklanjuti hasil rapat koordinasi mingguan, mohon disposisi untuk tindak lanjut ke masing-masing tim terkait target bulan ini.",
    instructions: "Harap diteruskan ke seluruh kepala tim paling lambat Jumat ini.",
  },
];

