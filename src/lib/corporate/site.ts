/**
 * DATA LAYER WEBSITE KORPORAT — PT KARYA SANG PRABU.
 *
 * Sumber tunggal konten halaman marketing (Home, About, Business, Products,
 * Partners, Articles, Career, FAQ, Contact). Pisahkan DATA dari UI: komponen
 * membaca dari sini, sehingga konten mudah diperbarui tanpa menyentuh layout.
 * Saat backend/CMS tersedia, struktur ini tinggal dipindah ke sumber dinamis.
 *
 * ATURAN: JANGAN mengarang fakta (bidang usaha, produk, mitra, sejarah).
 * Bila data belum tersedia, biarkan array kosong / tandai sebagai placeholder.
 */

export type NavItem = { label: string; href: string };

export type Value = { title: string; description: string; icon: string };

export type BusinessUnit = {
  slug: string;
  name: string;
  tagline: string;
  overview: string;
  whatWeDo: string[];
  image: string;
  featured: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  badges: string[];
  featured: boolean;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage: string;
  author: string;
  publishedAt: string; // ISO
  content: string;
  featured: boolean;
};

export type Partner = { name: string; category: string; logo?: string };

export type Faq = { category: string; question: string; answer: string };

export type CareerPosition = {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
};

/** Identitas & kontak resmi (tampil di seluruh situs). */
export const SITE = {
  legalName: "PT KARYA SANG PRABU",
  brand: "SANG PRABU",
  tagline: "THE BEST PARTNER YOUR BUSINESS",
  group: "PRIMA PRABU GROUP",
  logo: "/logos/logo-sang-prabu.png",
  positioning:
    "Perusahaan Indonesia yang bergerak di produksi pangan beku halal, perdagangan, dan kemitraan bisnis — hadir sebagai partner jangka panjang yang mengutamakan mutu, integritas, dan keunggulan.",
  address: {
    line: "Jl. Pertanian Raya No. 64, Lebak Bulus, Cilandak, Jakarta Selatan 12440",
    maps: "https://maps.google.com/?q=Jl.+Pertanian+Raya+No.+64+Lebak+Bulus+Cilandak+Jakarta+Selatan+12440",
  },
  phone: "021 2784 1924",
  email: "ptkaryasangprabu@gmail.com",
  website: "www.karyasangprabu.co.id",
  whatsapp: {
    display: "0889 3663 031",
    url: `https://wa.me/628893663031?text=${encodeURIComponent(
      "Halo PT KARYA SANG PRABU, saya ingin menjajaki kerja sama / kemitraan bisnis.",
    )}`,
  },
  businessHours: "Senin – Jumat · 08.00 – 17.00 WIB",
  // Sosial media — isi bila akun resmi sudah tersedia.
  socials: [] as { label: string; href: string; icon: string }[],
} as const;

/** Menu navigasi utama (urutan sesuai PRD). */
export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Business", href: "/business" },
  { label: "Products", href: "/products" },
  { label: "Partners", href: "/partners" },
  { label: "Articles", href: "/articles" },
  { label: "Career", href: "/career" },
  { label: "Contact", href: "/contact" },
];

export const CTA = { label: "Let's Work Together", href: "/contact" } as const;

/** Nilai perusahaan (Core Values). */
export const VALUES: Value[] = [
  {
    title: "Quality",
    description:
      "Mutu dijaga di setiap proses — dari pemilihan bahan hingga produk sampai ke tangan mitra.",
    icon: "gem",
  },
  {
    title: "Integrity",
    description:
      "Kejujuran dan tanggung jawab menjadi dasar setiap keputusan dan hubungan bisnis.",
    icon: "shield-check",
  },
  {
    title: "Excellence",
    description:
      "Terus meningkatkan standar untuk memberi hasil terbaik yang melampaui harapan.",
    icon: "award",
  },
  {
    title: "Partnership",
    description:
      "Membangun kerja sama jangka panjang yang saling menumbuhkan dan dapat diandalkan.",
    icon: "handshake",
  },
];

/** Alasan memilih (Why Us) — pendukung nilai inti. */
export const WHY_US: Value[] = [
  ...VALUES,
  {
    title: "Professionalism",
    description: "Dikelola dengan tata kelola dan standar kerja yang profesional.",
    icon: "briefcase",
  },
  {
    title: "Reliability",
    description: "Konsisten memenuhi komitmen mutu, waktu, dan pelayanan.",
    icon: "badge-check",
  },
];

/**
 * Lini bisnis. Diambil dari bidang usaha yang benar-benar dijalankan
 * (pangan beku halal + perdagangan/distribusi). Tambah unit lain lewat file
 * ini saja — komponen otomatis mengikuti.
 */
export const BUSINESS_UNITS: BusinessUnit[] = [
  {
    slug: "food-manufacturing",
    name: "Food Manufacturing",
    tagline: "Produksi pangan beku halal",
    overview:
      "Memproduksi aneka pangan beku halal berlabel SANG PRABU — bakso, otak-otak, dimsum, hingga daging beku — dengan proses higienis dan rantai dingin terjaga.",
    whatWeDo: [
      "Produksi frozen food halal (bakso, otak-otak, dimsum)",
      "Pengolahan daging ayam & sapi beku",
      "Kontrol mutu & keamanan pangan",
      "Pengemasan siap distribusi",
    ],
    image: "/sang-prabu/hero-bakso.jpg",
    featured: true,
  },
  {
    slug: "trading-distribution",
    name: "Trading & Distribution",
    tagline: "Perdagangan & distribusi",
    overview:
      "Perdagangan umum dan distribusi produk pangan ke mitra ritel, distributor, dan pelaku usaha kuliner di berbagai wilayah.",
    whatWeDo: [
      "Perdagangan umum produk pangan",
      "Distribusi ke mitra & reseller",
      "Manajemen rantai pasok",
      "Kemitraan penyaluran produk",
    ],
    image: "/sang-prabu/butcher.jpg",
    featured: true,
  },
  {
    slug: "partnership",
    name: "Business Partnership",
    tagline: "Kemitraan & kerja sama usaha",
    overview:
      "Membuka peluang kemitraan bisnis — reseller, distributor, hingga kerja sama strategis — sebagai bagian dari PRIMA PRABU GROUP.",
    whatWeDo: [
      "Program mitra & distributor",
      "Kerja sama pasokan (supply)",
      "Kolaborasi lintas unit grup",
    ],
    image: "/sang-prabu/dapur.jpg",
    featured: false,
  },
];

/** Produk unggulan (frozen food SANG PRABU). */
export const PRODUCTS: Product[] = [
  {
    id: "bakso",
    name: "Bakso Sang Prabu",
    slug: "bakso",
    category: "Frozen Food",
    description: "Kenyal, padat daging, dengan kaldu yang kaya rasa.",
    image: "/sang-prabu/bakso.jpg",
    badges: ["Halal", "Frozen", "Higienis"],
    featured: true,
  },
  {
    id: "otak-otak",
    name: "Otak-otak Sang Prabu",
    slug: "otak-otak",
    category: "Frozen Food",
    description: "Ikan pilihan, gurih, siap digoreng renyah.",
    image: "/sang-prabu/otak-otak.jpg",
    badges: ["Halal", "Frozen", "Higienis"],
    featured: true,
  },
  {
    id: "dimsum",
    name: "Dimsum Sang Prabu",
    slug: "dimsum",
    category: "Frozen Food",
    description: "Siomay lembut dengan isian padat, matang kukus.",
    image: "/sang-prabu/dimsum.jpg",
    badges: ["Halal", "Frozen", "Higienis"],
    featured: true,
  },
  {
    id: "daging-ayam",
    name: "Daging Ayam",
    slug: "daging-ayam",
    category: "Daging Beku",
    description: "Frozen · halal · higienis — sehat & bergizi.",
    image: "/sang-prabu/daging-ayam.jpg",
    badges: ["Halal", "Frozen", "Sehat"],
    featured: false,
  },
  {
    id: "daging-sapi",
    name: "Daging Sapi",
    slug: "daging-sapi",
    category: "Daging Beku",
    description: "Frozen · halal · higienis — sehat & bergizi.",
    image: "/sang-prabu/daging-sapi.jpg",
    badges: ["Halal", "Frozen", "Sehat"],
    featured: false,
  },
  {
    id: "karkas",
    name: "Daging Karkas Halal",
    slug: "karkas",
    category: "Daging Beku",
    description: "Karkas ayam beku, potong higienis, siap distribusi.",
    image: "/sang-prabu/karkas.jpg",
    badges: ["Halal", "Frozen", "Higienis"],
    featured: false,
  },
];

export const PRODUCT_CATEGORIES = ["Semua", "Frozen Food", "Daging Beku"] as const;

/** Artikel/berita — CMS-ready. Kosong sampai konten resmi tersedia. */
export const ARTICLES: Article[] = [];

export const ARTICLE_CATEGORIES = [
  "Company News",
  "Business",
  "Product",
  "Industry",
  "Partnership",
  "CSR",
  "Insights",
] as const;

/** Mitra — isi bila logo/nama mitra resmi sudah tersedia. */
export const PARTNERS: Partner[] = [];

/** FAQ. */
export const FAQS: Faq[] = [
  {
    category: "Company",
    question: "Apa itu PT KARYA SANG PRABU?",
    answer:
      "PT KARYA SANG PRABU adalah perusahaan yang bergerak di produksi pangan beku halal (brand SANG PRABU), perdagangan, dan kemitraan bisnis — bagian dari PRIMA PRABU GROUP.",
  },
  {
    category: "Products",
    question: "Apakah semua produk halal?",
    answer:
      "Ya. Produk SANG PRABU diproses secara halal dan higienis dengan menjaga mutu serta rantai dingin hingga sampai ke mitra.",
  },
  {
    category: "Partnership",
    question: "Bagaimana cara menjadi mitra/distributor?",
    answer:
      "Silakan isi formulir pada halaman Partners atau hubungi kami via WhatsApp/email. Tim kami akan menindaklanjuti pengajuan kerja sama Anda.",
  },
  {
    category: "Order",
    question: "Bagaimana cara memesan atau bertanya soal produk?",
    answer:
      "Gunakan tombol Inquire/Contact pada halaman Products atau hubungi kami langsung melalui kontak resmi yang tertera.",
  },
  {
    category: "General",
    question: "Di mana lokasi kantor PT KARYA SANG PRABU?",
    answer: `${SITE.address.line}. Jam operasional ${SITE.businessHours}.`,
  },
];

export const FAQ_CATEGORIES = [
  "Company",
  "Products",
  "Partnership",
  "Order",
  "General",
] as const;

/** Lowongan karier — kosong = tampilkan status "belum ada lowongan". */
export const CAREERS: CareerPosition[] = [];

/** Subjek pesan pada form kontak/kemitraan. */
export const CONTACT_SUBJECTS = [
  "Kemitraan / Distributor",
  "Pemesanan Produk",
  "Kerja Sama Bisnis",
  "Karier",
  "Lainnya",
] as const;

export const BUSINESS_TYPES = [
  "Distributor",
  "Reseller",
  "Retail / Toko",
  "HORECA (Hotel/Resto/Kafe)",
  "Manufaktur",
  "Lainnya",
] as const;
