/**
 * DATA LAYER WEBSITE KORPORAT — PT KARYA SANG PRABU.
 *
 * Sumber tunggal konten halaman marketing. Konten substantif (tentang kami,
 * visi, misi, lini bisnis, legalitas, kontak) diambil dari COMPANY PROFILE
 * RESMI SANG PRABU. Pisahkan DATA dari UI agar mudah diperbarui / dipindah ke
 * CMS. JANGAN mengarang fakta; bila data belum tersedia, biarkan kosong.
 */

export type NavItem = { label: string; href: string };

export type Value = { title: string; description: string; icon: string };

export type BusinessUnit = {
  slug: string;
  name: string;
  tagline: string;
  overview: string;
  whatWeDo: string[];
  icon: string;
  image?: string;
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

/** Potongan teks berformat di dalam paragraf / butir daftar artikel. */
export type ArticleSpan = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  /** Tautan aktif; diawali "/" untuk internal, "http" untuk eksternal. */
  href?: string;
};

/** Blok konten artikel bergaya (untuk artikel internal yang ditulis penuh). */
export type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; spans: ArticleSpan[] }
  | { type: "list"; ordered?: boolean; items: ArticleSpan[][] };

export type Article = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  content: string;
  featured: boolean;
  /** Jika diisi, kartu artikel menaut langsung ke sumber eksternal (tab baru). */
  externalUrl?: string;
  /** Nama sumber eksternal (mis. domain) untuk label kartu. */
  source?: string;
  /**
   * Isi artikel berformat (heading, paragraf, daftar, tautan). Bila diisi,
   * halaman detail memakainya alih-alih `content` polos.
   */
  body?: ArticleBlock[];
  /** FAQ artikel (dirender dengan komponen FaqAccordion existing + FAQ schema). */
  faqs?: { question: string; answer: string }[];
  /** Tombol CTA di akhir artikel (memakai SiteButton existing). */
  cta?: { label: string; href: string; variant?: "gold" | "outline" }[];
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

/** Identitas & kontak resmi (sumber: Company Profile SANG PRABU). */
export const SITE = {
  legalName: "PT KARYA SANG PRABU",
  brand: "SANG PRABU",
  // Tagline utama yang dipakai di seluruh identitas visual perusahaan
  // (gaya tebal serif seragam untuk tampilan; versi polos untuk SEO/schema).
  tagline: "𝐁𝐞𝐭𝐭𝐞𝐫 𝐏𝐫𝐨𝐬𝐞𝐬, 𝐁𝐞𝐭𝐭𝐞𝐫 𝐐𝐮𝐚𝐥𝐢𝐭𝐲 & 𝐁𝐞𝐭𝐭𝐞𝐫 𝐒𝐞𝐫𝐯𝐞",
  taglinePlain: "Better Proses, Better Quality & Better Serve",
  // Tagline pada company profile resmi.
  taglineOfficial: "Better Proses, Better Quality & Better Serve",
  group: "PRIMA PRABU GROUP",
  logo: "/sang-prabu/sang-prabu-haki-logo.png",
  logoDark: "/sang-prabu/sang-prabu-haki-logo.png",
  positioning:
    "PT KARYA SANG PRABU adalah perusahaan nasional yang bergerak di bidang komoditas dan general trading berbasis di Indonesia — mitra terpercaya dalam penyediaan dan distribusi berbagai komoditas unggulan untuk memenuhi kebutuhan pasar domestik dan internasional.",
  address: {
    line: "Jl. Tole Iskandar No.77, Sukamaju, Kec. Cilodong, Kota Depok, Jawa Barat 16415",
    maps: "https://maps.google.com/?q=Jl.+Tole+Iskandar+No.77+Sukamaju+Cilodong+Kota+Depok+Jawa+Barat+16415",
  },
  phone: "(021) 2784 1924",
  email: "ptkaryasangprabu@gmail.com",
  website: "www.sangprabugroup.com",
  whatsapp: {
    number: "628893663031",
    display: "0889 3663 031",
    url: `https://wa.me/628893663031?text=${encodeURIComponent(
      "Halo PT KARYA SANG PRABU, saya ingin menjajaki kerja sama / kemitraan bisnis.",
    )}`,
  },
  businessHours: "Senin – Jumat · 08.00 – 17.00 WIB",
  socials: [
    {
      label: "Instagram",
      handle: "@karyasangprabu.group",
      href: "https://www.instagram.com/karyasangprabu.group",
    },
  ] as { label: string; handle: string; href: string }[],
} as const;

/** Cerita perusahaan (About) — dari company profile. */
export const COMPANY_STORY = [
  "PT KARYA SANG PRABU adalah perusahaan nasional yang bergerak di bidang komoditas dan general trading berbasis di Indonesia. Kami berperan sebagai mitra terpercaya dalam penyediaan dan distribusi berbagai komoditas unggulan untuk memenuhi kebutuhan pasar domestik dan internasional.",
  "Didukung oleh sumber daya alam Indonesia yang melimpah, jaringan pemasok yang luas, serta manajemen dan tenaga kerja berpengalaman, kami berkomitmen menjalankan sistem perdagangan yang profesional, transparan, dan berkelanjutan, serta terus beradaptasi dengan perkembangan pasar global.",
] as const;

/** Visi resmi. */
export const VISION =
  "Menjadi perusahaan komoditas dan general trading terkemuka di Indonesia yang berdaya saing global, terpercaya, dan berkontribusi nyata terhadap pertumbuhan ekonomi nasional.";

/** Misi resmi. */
export const MISSION: string[] = [
  "Menyediakan produk komoditas berkualitas tinggi sesuai standar nasional dan internasional.",
  "Membangun kemitraan jangka panjang yang saling menguntungkan dengan pelanggan dan pemasok.",
  "Menerapkan sistem perdagangan yang profesional, transparan, dan berintegritas.",
  "Mendukung produk lokal Indonesia agar mampu bersaing di pasar global.",
  "Mengutamakan prinsip keberlanjutan dan tanggung jawab sosial perusahaan.",
];

/** Legalitas resmi (dari company profile) — memperkuat kredibilitas. */
export const LEGALITY: { label: string; value: string }[] = [
  { label: "SK Pengesahan Kemenkumham", value: "AHU-0059668.AH.01.01.Tahun 2019" },
  { label: "Akta Pendirian", value: "No. 28 Tahun 2019" },
  { label: "Notaris", value: "Hery Kurniawan, S.H., M.Kn." },
  { label: "NPWP", value: "93.421.295.2-609.000" },
  { label: "SIUP", value: "9120413121192" },
  { label: "NIB", value: "9120413121192" },
];

export const TRACTION_STATS = [
  {
    value: "350+ Ton",
    label: "Throughput Komoditas / Thn",
    description: "Distribusi rempah, beras, karkas ayam, dan hasil bumi nasional.",
  },
  {
    value: "25 Ton",
    label: "Kapasitas Cold Storage / Bln",
    description: "Fasilitas rantai dingin -18°C terintegrasi untuk olahan pangan beku.",
  },
  {
    value: "120+",
    label: "Jaringan Agen & Mitra B2B",
    description: "Mitra reseller, distributor, Horeka, dan klien korporat tier-1.",
  },
  {
    value: "100%",
    label: "Halal BPJPH & Higienis",
    description: "Sertifikasi halal resmi dan kepatuhan standar keamanan pangan BPOM.",
  },
] as const;

export const LEADERSHIP_TEAM = [
  {
    name: "M. Chaerul",
    role: "President Director & Group CEO",
    focus: "Strategic Expansion & Commodity Trading",
    bio: "Memimpin arah strategis Prima Prabu Group, pengembangan kemitraan institusi, dan tata kelola korporat terintegrasi.",
  },
  {
    name: "Operational Director",
    role: "Director of Food Manufacturing (PAE)",
    focus: "Plant Operations & HACCP/BPOM Compliance",
    bio: "Bertanggung jawab atas efisiensi lini manufaktur Site 2 & Site 1, standarisasi mutu pangan Wiridan 138, dan manajemen rantai pasok dingin.",
  },
  {
    name: "Head of Quality & Supply Chain",
    role: "Head of Procurement & QC",
    focus: "Raw Material Sourcing & Cold-Chain Logistics",
    bio: "Mengawasi seleksi bahan baku hulu komoditas dari petani/peternak binaan hingga distribusi logistik beku tepat waktu.",
  },
] as const;

export const GROUP_SYNERGY = {
  holding: "PRIMA PRABU GROUP",
  upstream: {
    entity: "PT KARYA SANG PRABU",
    role: "Pemilik Brand Resmi WIRIDAN 138 & Trading Komoditas",
    brand: "WIRIDAN 138",
    capabilities: [
      "Pemilik resmi brand pangan beku WIRIDAN 138 (Bakso, Dimsum, Otak-otak)",
      "Pengadaan komoditas langsung dari petani & peternak binaan",
      "Pasokan stabil daging sapi segar, karkas ayam, dan rempah bumbu",
      "Perdagangan komoditas ekspor-impor & kontrak korporat B2B nasional",
    ],
  },
  downstream: {
    entity: "PT PRIMA ANDALAS ENERGI (PAE)",
    role: "Fasilitas Pengolahan Pangan & Cold-Chain Manufaktur",
    capabilities: [
      "Pabrik pengolahan pangan beku higienis & modern",
      "Sistem cold-chain terpadu -18°C & sertifikasi Halal BPJPH",
      "Dukungan lini fasilitas Site 2 & Site 1 untuk pemenuhan kapasitas skala besar",
    ],
  },
  roadmap: [
    {
      period: "Q3 2026",
      milestone: "Site 2 Pilot Facility Soft Opening",
      target: "Validasi kapasitas harian, kepatuhan BPOM/HACCP, & penetrasi 150+ agen Jabodetabek.",
    },
    {
      period: "2027",
      milestone: "Site 1 Industrial Scale Plant",
      target: "Skalabilitas otomatisasi manufaktur 100+ ton/bulan & ekspansi distribusi nasional.",
    },
  ],
} as const;

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Unit Bisnis", href: "/business" },
  { label: "Produk Wiridan 318", href: "/products" },
  { label: "Kemitraan", href: "/partners" },
  { label: "Berita", href: "/articles" },
  { label: "Karier", href: "/careers" },
  { label: "Company Profile", href: "/company-profile" },
  { label: "Kontak", href: "/contact" },
];

export const CTA = { label: "Minta Penawaran", href: "/contact" } as const;

/** Nilai perusahaan. */
export const VALUES: Value[] = [
  {
    title: "Quality",
    description:
      "Menyediakan komoditas berkualitas tinggi sesuai standar nasional dan internasional.",
    icon: "gem",
  },
  {
    title: "Integrity",
    description:
      "Menjalankan sistem perdagangan yang profesional, transparan, dan berintegritas.",
    icon: "shield-check",
  },
  {
    title: "Excellence",
    description:
      "Terus beradaptasi dengan perkembangan pasar global untuk hasil terbaik.",
    icon: "award",
  },
  {
    title: "Partnership",
    description:
      "Membangun kemitraan jangka panjang yang saling menguntungkan dan berkelanjutan.",
    icon: "handshake",
  },
];

/** Keunggulan kami (Our Advantages) — dari company profile resmi. */
export const WHY_US: Value[] = [
  {
    title: "Sumber Langsung",
    description: "Produk langsung dari produsen dan petani.",
    icon: "sprout",
  },
  {
    title: "Mutu Terkontrol",
    description: "Kualitas produk terkontrol dan dapat disesuaikan kebutuhan buyer.",
    icon: "badge-check",
  },
  {
    title: "Harga Kompetitif",
    description: "Harga yang bersaing untuk berbagai kebutuhan.",
    icon: "tag",
  },
  {
    title: "Pengiriman Profesional",
    description: "Pengemasan dan pengiriman yang profesional.",
    icon: "package",
  },
  {
    title: "Lokal & Ekspor",
    description: "Siap melayani kebutuhan pasar lokal maupun ekspor.",
    icon: "globe",
  },
  {
    title: "Fleksibel",
    description: "Fleksibel terhadap permintaan volume besar maupun kecil.",
    icon: "scale",
  },
];

/** Lini bisnis (Core Business) — 6 unit sesuai company profile resmi. */
export const BUSINESS_UNITS: BusinessUnit[] = [
  {
    slug: "property-konstruksi",
    name: "Property & Konstruksi",
    tagline: "Properti & konstruksi",
    overview:
      "Pengembangan dan layanan di bidang properti serta konstruksi untuk mendukung pertumbuhan dan kebutuhan pembangunan.",
    whatWeDo: ["Pengembangan properti", "Layanan konstruksi", "Kerja sama proyek"],
    icon: "building",
    featured: true,
  },
  {
    slug: "export-import",
    name: "Export & Import",
    tagline: "Ekspor & impor",
    overview:
      "Layanan ekspor dan impor komoditas serta produk untuk menjangkau pasar domestik dan internasional.",
    whatWeDo: ["Ekspor komoditas unggulan", "Impor produk & bahan", "Logistik & distribusi lintas negara"],
    icon: "ship",
    featured: true,
  },
  {
    slug: "alat-kesehatan",
    name: "Alat Kesehatan",
    tagline: "Alat kesehatan",
    overview:
      "Penyediaan dan distribusi alat kesehatan untuk mendukung kebutuhan layanan kesehatan.",
    whatWeDo: ["Penyediaan alat kesehatan", "Distribusi ke fasilitas kesehatan", "Kemitraan pengadaan"],
    icon: "stethoscope",
    featured: true,
  },
  {
    slug: "komoditas",
    name: "Komoditas",
    tagline: "Komoditas unggulan",
    overview:
      "Penyediaan dan distribusi berbagai komoditas unggulan Indonesia dengan mutu sesuai standar nasional & internasional.",
    whatWeDo: ["Perdagangan komoditas", "Sourcing & pasokan", "Distribusi domestik & ekspor"],
    icon: "wheat",
    image: "/sang-prabu/butcher.jpg",
    featured: true,
  },
  {
    slug: "food-beverages",
    name: "Food & Beverages",
    tagline: "Makanan & minuman",
    overview:
      "Produk makanan & minuman — termasuk lini pangan beku halal berlabel SANG PRABU — untuk pasar ritel dan mitra usaha.",
    whatWeDo: ["Produk pangan beku halal", "Distribusi F&B", "Kemitraan penyaluran"],
    icon: "utensils",
    image: "/sang-prabu/hero-bakso.jpg",
    featured: true,
  },
  {
    slug: "jasa-konsultan",
    name: "Jasa Konsultan",
    tagline: "Jasa konsultan",
    overview:
      "Layanan konsultasi bisnis untuk mendukung mitra dalam perdagangan, pengadaan, dan pengembangan usaha.",
    whatWeDo: ["Konsultasi bisnis & perdagangan", "Pendampingan pengadaan", "Pengembangan kemitraan"],
    icon: "users",
    featured: true,
  },
];

/** Produk pangan beku unggulan — Lini Frozen Food Halal WIRIDAN 318 (Brand Resmi: PT KARYA SANG PRABU). */
export const PRODUCTS: Product[] = [
  {
    id: "bakso-premium-wiridan",
    name: "Bakso Sapi Premium WIRIDAN 318 (500g)",
    slug: "bakso-premium-wiridan",
    category: "Bakso & Frozen Food",
    description: "Daging sapi pilihan bertekstur kenyal alami dengan bumbu rempah istimewa. 100% Halal BPJPH, higienis dan tanpa pengawet berbahaya.",
    image: "/images/products/bakso-premium.webp",
    badges: ["Halal ID00410000123456721", "Daging Sapi Pilihan", "500g"],
    featured: true,
  },
  {
    id: "bakso-urat-wiridan",
    name: "Bakso Urat Sapi WIRIDAN 318 (500g)",
    slug: "bakso-urat-wiridan",
    category: "Bakso & Frozen Food",
    description: "Paduan daging sapi segar dengan cacahan urat sapi pilihan yang memberikan sensasi 'kriuk' bertekstur mantap di setiap gigitan.",
    image: "/images/products/bakso-urat.webp",
    badges: ["Halal Indonesia", "Kenyal Berurat", "500g"],
    featured: true,
  },
  {
    id: "bakso-medium-wiridan",
    name: "Bakso Sapi Medium WIRIDAN 318 (500g)",
    slug: "bakso-medium-wiridan",
    category: "Bakso & Frozen Food",
    description: "Ukuran pas, rasa seimbang dengan formulasi daging gurih bernutrisi. Pilihan utama untuk pedagang mie ayam & katering.",
    image: "/images/products/bakso-medium.webp",
    badges: ["Halal Indonesia", "Ukuran Pas", "500g"],
    featured: true,
  },
  {
    id: "bakso-goreng-wiridan",
    name: "Bakso Goreng Renyah WIRIDAN 318 (500g)",
    slug: "bakso-goreng-wiridan",
    category: "Bakso & Frozen Food",
    description: "Gurih, renyah di luar dan lembut di dalam. Siap goreng mekar sempurna untuk camilan keluarga dan menu cafe.",
    image: "/images/products/bakso-goreng.webp",
    badges: ["Halal Indonesia", "Renyah Mekar", "500g"],
    featured: true,
  },
  {
    id: "bakso-ayam-wiridan",
    name: "Bakso Ayam Kenyal WIRIDAN 318 (500g)",
    slug: "bakso-ayam-wiridan",
    category: "Bakso & Frozen Food",
    description: "Daging ayam segar pilihan dengan bumbu bawang putih gurih alami, tekstur kenyal empuk dan tinggi protein.",
    image: "/images/products/bakso-ayam.webp",
    badges: ["Halal Indonesia", "Kenyal & Gurih", "500g"],
    featured: false,
  },
  {
    id: "dimsum-ayam-wiridan",
    name: "Dimsum Siomay Ayam WIRIDAN 318 (500g)",
    slug: "dimsum-ayam-wiridan",
    category: "Dimsum & Kudapan",
    description: "Siomay dimsum ayam lembut dengan isian padat juicy, dibungkus kulit pangsit tipis siap kukus 8-10 menit.",
    image: "/images/products/dimsum-ayam.webp",
    badges: ["Halal Indonesia", "Siap Kukus", "500g"],
    featured: true,
  },
  {
    id: "dimsum-mix-wiridan",
    name: "Dimsum Mix Platter WIRIDAN 318 (500g)",
    slug: "dimsum-mix-wiridan",
    category: "Dimsum & Kudapan",
    description: "Kombinasi siomay aneka topping (keju, jamur, nori, dan wortel) dalam satu pack praktis keluarga.",
    image: "/images/products/dimsum-mix.webp",
    badges: ["Halal Indonesia", "Aneka Topping", "500g"],
    featured: false,
  },
  {
    id: "otak-otak-wiridan",
    name: "Otak-Otak Ikan WIRIDAN 318 (500g)",
    slug: "otak-otak-wiridan",
    category: "Olahan Ikan & Seafood",
    description: "Dibuat dari ikan segar pilihan, gurih lezat bertekstur empuk kenyal, siap digoreng renyah atau dikukus hangat.",
    image: "/images/products/otak-otak.webp",
    badges: ["Halal Indonesia", "Ikan Pilihan", "500g"],
    featured: true,
  },
  {
    id: "daging-sapi",
    name: "Daging Sapi Segar & Beku",
    slug: "daging-sapi",
    category: "Daging Beku",
    description: "Daging sapi pilihan potongan higienis rantai dingin terjaga (cold chain) untuk kebutuhan horeka & industri.",
    image: "/sang-prabu/daging-sapi.jpg",
    badges: ["Halal", "Frozen Cold Chain", "Higienis"],
    featured: false,
  },
  {
    id: "karkas",
    name: "Daging Ayam & Karkas Halal",
    slug: "karkas",
    category: "Daging Beku",
    description: "Karkas ayam beku potong higienis standar rumah potong bersertifikat, siap distribusi rutin skala besar.",
    image: "/sang-prabu/karkas.jpg",
    badges: ["Halal", "Frozen", "Higienis"],
    featured: false,
  },
];

export const PRODUCT_CATEGORIES = [
  "Semua",
  "Bakso & Frozen Food",
  "Olahan Ikan & Seafood",
  "Dimsum & Kudapan",
  "Daging Beku",
] as const;

export type Commodity = { name: string; en: string; category: string };

/** Katalog komoditas (Our Product Commodities) — sumber: company profile resmi. */
export const COMMODITIES: Commodity[] = [
  { name: "Cengkeh AB6 Kualitas Ekspor", en: "Clove AB6 Export Quality", category: "Rempah & Herbal" },
  { name: "Kapulaga Jawa", en: "Java Cardamom", category: "Rempah & Herbal" },
  { name: "Buah Pala Jawa", en: "Java Nutmeg", category: "Rempah & Herbal" },
  { name: "Kayu Manis Pilihan", en: "Cinnamon of Choice", category: "Rempah & Herbal" },
  { name: "Ketumbar Super", en: "Super Coriander", category: "Rempah & Herbal" },
  { name: "Laos, Kunyit & Temulawak", en: "Galangal, Turmeric & Curcuma", category: "Rempah & Herbal" },
  { name: "Aneka Rempah Kualitas Ekspor", en: "Assorted Export Quality Spices", category: "Rempah & Herbal" },
  { name: "Jahe Gajah & Jahe Emprit", en: "Elephant & Emprit Ginger", category: "Rempah & Herbal" },
  { name: "Bawang Putih Ekspor", en: "Export Garlic", category: "Rempah & Herbal" },
  { name: "Bawang Merah Jawa", en: "Java Red Onion", category: "Rempah & Herbal" },
  { name: "Cabai", en: "Chili", category: "Rempah & Herbal" },
  { name: "Kemiri Super Premium Bulat", en: "Super Premium Round Candlenut", category: "Kacang & Biji" },
  { name: "Kacang Super 2529", en: "Super Peanut 2529", category: "Kacang & Biji" },
  { name: "Kedelai Impor Super", en: "Super Imported Soybean", category: "Kacang & Biji" },
  { name: "Kacang Hijau", en: "Mung Beans", category: "Kacang & Biji" },
  { name: "Jagung Pipil Kering", en: "Dried Corn", category: "Kacang & Biji" },
  { name: "Getah Karet Alami (Lump)", en: "Natural Rubber", category: "Hasil Bumi" },
  { name: "Gula Aren Asli UMKM", en: "SME's Original Palm Sugar", category: "Hasil Bumi" },
  { name: "Kopra", en: "Dry Coconut", category: "Hasil Bumi" },
  { name: "Porang", en: "Porang", category: "Hasil Bumi" },
  { name: "Arang", en: "Charcoal", category: "Hasil Bumi" },
  { name: "Umbi-umbian", en: "Tubers", category: "Hasil Bumi" },
  { name: "Buah Pinang", en: "Betel Nut", category: "Hasil Bumi" },
  { name: "Beras Premium Cap Sang Prabu", en: "Sang Prabu Premium Rice", category: "Pangan" },
  { name: "Gula Pasir", en: "Sugar", category: "Pangan" },
  { name: "Minyak Goreng", en: "Cooking Oil", category: "Pangan" },
  { name: "Telur", en: "Egg", category: "Pangan" },
  { name: "Hasil Laut", en: "Seafood", category: "Hasil Laut" },
  { name: "Rumput Laut", en: "Seaweed", category: "Hasil Laut" },
  { name: "Tokek Kering", en: "Dried Gecko", category: "Lainnya" },
];

export const COMMODITY_CATEGORIES = [
  "Semua",
  "Rempah & Herbal",
  "Kacang & Biji",
  "Hasil Bumi",
  "Pangan",
  "Hasil Laut",
  "Lainnya",
] as const;

/**
 * Artikel/berita pilihan. Untuk item bersumber eksternal, `externalUrl` diisi
 * sehingga kartu menaut langsung ke sumbernya (dibuka di tab baru).
 *
 * Daftar diurutkan otomatis dari tanggal terbit TERBARU ke terlama
 * (`publishedAt`). Untuk berita CNN, waktu terbit diambil dari kode waktu pada
 * URL (mis. 20260802214749 → 2026-08-02 21:47:49). Tutorial Hostinger tak
 * mencantumkan tanggal terbit di URL, jadi tanggalnya adalah perkiraan.
 */
export const ARTICLES: Article[] = ([
  {
    id: "art-cara-menyimpan-frozen-food",
    title: "Cara Menyimpan Frozen Food agar Tetap Segar dan Aman Dikonsumsi",
    slug: "cara-menyimpan-frozen-food",
    category: "Edukasi Frozen Food Halal",
    excerpt:
      "Panduan lengkap cara menyimpan frozen food agar tetap segar, higienis, dan aman dikonsumsi — mulai dari suhu freezer ideal, masa simpan, cara thawing yang benar, hingga tips saat mati listrik.",
    coverImage: "/articles/cara-menyimpan-frozen-food.svg",
    author: "SANG PRABU",
    publishedAt: "2026-08-03T10:00:00",
    content:
      "Panduan praktis menyimpan frozen food agar tetap segar dan aman dikonsumsi: suhu freezer, masa simpan, cara thawing, dan kesalahan yang harus dihindari.",
    featured: true,
    body: [
      {
        type: "paragraph",
        spans: [
          { text: "Frozen food", italic: true },
          {
            text: " atau makanan beku sudah menjadi andalan banyak keluarga Indonesia karena praktis, tahan lama, dan mudah diolah kapan saja. Namun, kepraktisan itu hanya bertahan jika cara penyimpanannya benar. Salah menyimpan makanan beku bukan hanya membuat rasa dan teksturnya menurun, tetapi juga berisiko menurunkan keamanan pangan bagi keluarga.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          { text: "Melalui panduan ini, " },
          { text: "SANG PRABU", bold: true },
          {
            text: " merangkum cara menyimpan frozen food agar tetap segar, higienis, dan aman dikonsumsi — mulai dari suhu freezer yang ideal, masa simpan tiap jenis produk, cara mencairkan yang benar, hingga langkah yang perlu diambil saat listrik padam.",
          },
        ],
      },
      { type: "heading", text: "Mengapa Cara Menyimpan Frozen Food Sangat Penting" },
      {
        type: "paragraph",
        spans: [
          {
            text: "Pembekuan bekerja dengan cara menghentikan sementara aktivitas bakteri dan mikroorganisme penyebab pembusukan. Selama suhu makanan tetap beku secara stabil, kualitas dan keamanannya terjaga. Masalah muncul ketika suhu naik-turun berulang kali: kristal es mencair lalu membeku kembali, merusak serat makanan, mengeluarkan cairan, dan membuka peluang bakteri kembali aktif.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Karena itu, menyimpan dengan benar bukan sekadar soal menjaga rasa, melainkan bagian penting dari keamanan pangan keluarga. Penyimpanan yang tepat menjaga nilai gizi, mencegah kontaminasi silang, dan memastikan produk tetap layak saat tiba waktunya diolah.",
          },
        ],
      },
      { type: "heading", text: "Suhu Ideal untuk Menyimpan Frozen Food" },
      {
        type: "paragraph",
        spans: [
          { text: "Suhu freezer yang direkomendasikan untuk menyimpan makanan beku adalah " },
          { text: "-18°C atau lebih rendah", bold: true },
          {
            text: ". Pada suhu ini, sebagian besar aktivitas bakteri berhenti sehingga makanan dapat bertahan lama tanpa kehilangan kualitas secara signifikan.",
          },
        ],
      },
      {
        type: "list",
        items: [
          [
            { text: "Jaga suhu tetap stabil: ", bold: true },
            {
              text: "hindari terlalu sering membuka pintu freezer agar suhu tidak naik-turun.",
            },
          ],
          [
            { text: "Jangan penuhi freezer secara berlebihan: ", bold: true },
            {
              text: "sisakan ruang agar udara dingin bersirkulasi merata ke seluruh isi.",
            },
          ],
          [
            { text: "Gunakan termometer freezer: ", bold: true },
            {
              text: "jika ragu, alat sederhana ini membantu memastikan suhu benar-benar berada di titik aman.",
            },
          ],
        ],
      },
      { type: "heading", text: "Kenali Masa Simpan Berbagai Jenis Frozen Food" },
      {
        type: "paragraph",
        spans: [
          {
            text: "Meski beku, makanan tetap memiliki masa simpan terbaik. Melewati batas ini biasanya tidak langsung membuat makanan berbahaya, tetapi kualitas rasa dan teksturnya menurun. Sebagai panduan umum:",
          },
        ],
      },
      {
        type: "list",
        items: [
          [
            { text: "Daging & unggas mentah: ", bold: true },
            { text: "sekitar 6–12 bulan pada suhu beku stabil." },
          ],
          [
            { text: "Seafood (ikan, udang): ", bold: true },
            { text: "sekitar 3–6 bulan untuk kualitas terbaik." },
          ],
          [
            { text: "Olahan beku (nugget, sosis, bakso): ", bold: true },
            { text: "ikuti tanggal kedaluwarsa pada kemasan, umumnya 1–3 bulan setelah dibuka." },
          ],
          [
            { text: "Sayur & buah beku: ", bold: true },
            { text: "sekitar 8–12 bulan." },
          ],
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Selalu utamakan informasi pada label kemasan. Tanggal kedaluwarsa dan petunjuk penyimpanan dari produsen adalah acuan paling akurat untuk setiap produk.",
          },
        ],
      },
      { type: "heading", text: "Cara Menyimpan Frozen Food yang Benar di Freezer" },
      {
        type: "list",
        ordered: true,
        items: [
          [
            { text: "Simpan segera setelah tiba di rumah. ", bold: true },
            {
              text: "Jangan biarkan produk beku berada di suhu ruang terlalu lama; masukkan ke freezer secepatnya setelah belanja.",
            },
          ],
          [
            { text: "Gunakan wadah atau kemasan kedap udara. ", bold: true },
            {
              text: "Bungkus rapat atau gunakan wadah tertutup untuk mencegah freezer burn (kekeringan akibat udara).",
            },
          ],
          [
            { text: "Beri label tanggal. ", bold: true },
            {
              text: "Tuliskan tanggal simpan agar mudah menerapkan prinsip first in, first out — yang lebih dulu disimpan, lebih dulu dipakai.",
            },
          ],
          [
            { text: "Pisahkan bahan mentah dan matang. ", bold: true },
            {
              text: "Cegah kontaminasi silang dengan menyimpannya di wadah terpisah.",
            },
          ],
          [
            { text: "Bagi porsi sesuai kebutuhan. ", bold: true },
            {
              text: "Simpan dalam porsi sekali masak agar tidak perlu mencairkan dan membekukan ulang.",
            },
          ],
        ],
      },
      { type: "heading", text: "Kesalahan Umum Saat Menyimpan Makanan Beku" },
      {
        type: "list",
        items: [
          [
            { text: "Membekukan ulang makanan yang sudah dicairkan. ", bold: true },
            { text: "Ini menurunkan kualitas dan meningkatkan risiko pertumbuhan bakteri." },
          ],
          [
            { text: "Menyimpan makanan panas langsung ke freezer. ", bold: true },
            { text: "Dinginkan dulu hingga suhu ruang agar suhu freezer tidak naik mendadak." },
          ],
          [
            { text: "Membiarkan kemasan terbuka. ", bold: true },
            { text: "Udara mempercepat freezer burn dan menyerap bau dari makanan lain." },
          ],
          [
            { text: "Menjejalkan freezer terlalu penuh. ", bold: true },
            { text: "Sirkulasi udara dingin terganggu sehingga pembekuan tidak merata." },
          ],
        ],
      },
      { type: "heading", text: "Tips Menyimpan Frozen Food Setelah Kemasan Dibuka" },
      {
        type: "paragraph",
        spans: [
          {
            text: "Begitu kemasan dibuka, makanan lebih rentan terhadap udara dan kelembapan. Pindahkan sisa produk ke wadah kedap udara atau kantong beku (freezer bag), keluarkan udara sebanyak mungkin, tutup rapat, lalu beri label tanggal. Usahakan menghabiskan produk yang sudah dibuka dalam rentang waktu yang lebih singkat dibanding kemasan yang masih tersegel.",
          },
        ],
      },
      { type: "heading", text: "Cara Aman Mencairkan (Thawing) Frozen Food" },
      {
        type: "paragraph",
        spans: [
          {
            text: "Proses mencairkan sama pentingnya dengan proses menyimpan. Cara thawing yang benar mencegah bakteri berkembang di permukaan makanan:",
          },
        ],
      },
      {
        type: "list",
        items: [
          [
            { text: "Di dalam kulkas (paling aman): ", bold: true },
            { text: "pindahkan dari freezer ke rak kulkas beberapa jam sebelum diolah." },
          ],
          [
            { text: "Dengan air dingin mengalir: ", bold: true },
            { text: "gunakan kemasan kedap air bila butuh lebih cepat." },
          ],
          [
            { text: "Langsung dimasak: ", bold: true },
            { text: "banyak olahan beku (nugget, bakso, sosis) bisa langsung dimasak tanpa dicairkan lebih dulu." },
          ],
        ],
      },
      {
        type: "paragraph",
        spans: [
          { text: "Hindari mencairkan makanan beku dengan membiarkannya di suhu ruang dalam waktu lama, karena bagian luar makanan bisa mencapai suhu yang memungkinkan bakteri berkembang sebelum bagian dalamnya mencair." },
        ],
      },
      { type: "heading", text: "Tanda-Tanda Frozen Food Sudah Tidak Layak Konsumsi" },
      {
        type: "list",
        items: [
          [{ text: "Bau tidak sedap atau asam ", bold: true }, { text: "yang menyengat saat kemasan dibuka." }],
          [{ text: "Perubahan warna mencolok ", bold: true }, { text: "seperti bercak keabu-abuan atau kecokelatan yang tidak wajar." }],
          [{ text: "Tekstur berlendir ", bold: true }, { text: "atau lembek tidak wajar setelah dicairkan." }],
          [{ text: "Kristal es berlebihan ", bold: true }, { text: "dan lapisan kering (freezer burn) yang tebal — tanda makanan sudah lama atau sempat mencair." }],
        ],
      },
      {
        type: "paragraph",
        spans: [
          { text: "Jika ragu, lebih baik tidak dikonsumsi. Prinsip ", bold: false },
          { text: "\"when in doubt, throw it out\"", italic: true },
          { text: " berlaku untuk menjaga keamanan pangan keluarga." },
        ],
      },
      { type: "heading", text: "Menyimpan Frozen Food Saat Mati Listrik" },
      {
        type: "list",
        items: [
          [
            { text: "Jangan sering membuka freezer. ", bold: true },
            { text: "Freezer yang penuh dan tertutup rapat bisa mempertahankan suhu beku hingga sekitar 24–48 jam." },
          ],
          [
            { text: "Tambahkan es batu atau ice gel ", bold: true },
            { text: "jika mati listrik diperkirakan berlangsung lama." },
          ],
          [
            { text: "Periksa kondisi setelah listrik menyala. ", bold: true },
            { text: "Bila makanan masih mengandung kristal es dan terasa dingin beku, umumnya masih aman disimpan kembali." },
          ],
        ],
      },
      { type: "heading", text: "Menjaga Kualitas Frozen Food Bersama SANG PRABU" },
      {
        type: "paragraph",
        spans: [
          {
            text: "Penyimpanan yang baik dimulai dari produk yang berkualitas sejak awal. ",
          },
          { text: "SANG PRABU", bold: true },
          {
            text: " menghadirkan pilihan produk frozen food yang diproses dengan standar higienis untuk memudahkan keluarga Indonesia menyajikan hidangan praktis setiap hari.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          { text: "Ingin melihat pilihan produknya? Kunjungi halaman " },
          { text: "Lihat Produk Frozen Food SANG PRABU", href: "/products" },
          { text: ". Tertarik menjalankan peluang usaha? Pelajari cara " },
          { text: "Jadi Mitra Reseller SANG PRABU", href: "/partners" },
          { text: ", atau hubungi tim kami melalui " },
          { text: "WhatsApp Business", href: SITE.whatsapp.url },
          { text: " untuk informasi pemesanan dan kerja sama." },
        ],
      },
    ],
    faqs: [
      {
        question: "Berapa suhu ideal untuk menyimpan frozen food?",
        answer:
          "Suhu ideal adalah -18°C atau lebih rendah, dan sebaiknya dijaga tetap stabil. Pada suhu ini aktivitas bakteri berhenti sehingga makanan beku dapat bertahan lama tanpa kehilangan kualitas secara signifikan.",
      },
      {
        question: "Apakah frozen food yang sudah dicairkan boleh dibekukan lagi?",
        answer:
          "Sebaiknya tidak. Membekukan ulang makanan yang sudah dicairkan menurunkan kualitas rasa dan tekstur, serta meningkatkan risiko pertumbuhan bakteri. Bagi porsi sesuai kebutuhan sejak awal agar tidak perlu membekukan ulang.",
      },
      {
        question: "Berapa lama frozen food bisa disimpan?",
        answer:
          "Bergantung jenisnya: daging & unggas mentah sekitar 6–12 bulan, seafood 3–6 bulan, sayur & buah beku 8–12 bulan, dan olahan beku mengikuti tanggal kedaluwarsa pada kemasan. Selalu utamakan informasi pada label produk.",
      },
      {
        question: "Bagaimana cara mencairkan frozen food yang benar?",
        answer:
          "Cara paling aman adalah mencairkan di dalam kulkas beberapa jam sebelum dimasak. Bisa juga dengan air dingin dalam kemasan kedap air, atau langsung dimasak untuk olahan seperti nugget dan bakso. Hindari mencairkan di suhu ruang dalam waktu lama.",
      },
      {
        question: "Apa yang harus dilakukan saat mati listrik agar frozen food tetap aman?",
        answer:
          "Jangan sering membuka pintu freezer. Freezer yang penuh dan tertutup rapat dapat mempertahankan suhu beku hingga sekitar 24–48 jam. Tambahkan es batu atau ice gel bila pemadaman diperkirakan lama, dan periksa kondisi makanan setelah listrik menyala.",
      },
    ],
    cta: [
      { label: "Lihat Produk Kami", href: "/products", variant: "gold" },
      { label: "Jadi Mitra Reseller SANG PRABU", href: "/partners", variant: "outline" },
    ],
  },
  {
    id: "art-frozen-food-halal",
    title: "Apa Itu Frozen Food Halal & Kenapa Penting?",
    slug: "apa-itu-frozen-food-halal",
    category: "Edukasi",
    excerpt:
      "Kenali apa itu frozen food halal, standar sertifikasinya, dan alasan produk ini jadi pilihan aman untuk keluarga Indonesia. Temukan produk terbaik kami di sini!",
    coverImage: "/articles/frozen-food-halal.svg",
    author: "Tim Prima Prabu Group",
    publishedAt: "2026-08-03",
    content:
      "Kenali apa itu frozen food halal, standar sertifikasinya, dan alasan produk ini jadi pilihan aman untuk keluarga Indonesia.",
    featured: true,
    body: [
      {
        type: "paragraph",
        spans: [
          {
            text: "Menyiapkan makanan yang praktis, lezat, dan aman untuk keluarga tercinta setiap hari tentu menjadi prioritas utama bagi setiap ibu rumah tangga di Indonesia. Di tengah kesibukan harian yang padat, ",
          },
          { text: "frozen food", italic: true },
          {
            text: " atau makanan beku sering kali diandalkan sebagai solusi penyelamat waktu di dapur. Namun, sebagai konsumen yang cerdas, memastikan kehalalan dan kualitas makanan yang masuk ke tubuh keluarga tentu tidak boleh dilewatkan begitu saja.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          { text: "Lalu, apa sebenarnya yang dimaksud dengan " },
          { text: "frozen food", italic: true },
          {
            text: " halal, dan mengapa kehadirannya begitu krusial bagi keluarga Indonesia? Mari kita bahas tuntas bersama ",
          },
          { text: "Prima Prabu Group", bold: true },
          { text: "." },
        ],
      },
      { type: "heading", text: "Mengenal Lebih Dekat Apa Itu Frozen Food Halal" },
      {
        type: "paragraph",
        spans: [
          { text: "Secara sederhana, " },
          { text: "frozen food", italic: true },
          {
            text: " halal adalah produk makanan olahan yang telah melalui proses pembekuan untuk menjaga kesegarannya, serta dipastikan seluruh rangkaian prosesnya memenuhi syariat Islam. Proses ini bukan hanya soal jenis bahan baku utamanya saja, melainkan mencakup:",
          },
        ],
      },
      {
        type: "list",
        items: [
          [
            { text: "Sumber Bahan Baku: ", bold: true },
            {
              text: "Dipastikan berasal dari hewan yang disembelih sesuai dengan syariat Islam atau bahan nabati/laut yang suci.",
            },
          ],
          [
            { text: "Proses Pengolahan: ", bold: true },
            {
              text: "Alat, mesin, dan fasilitas produksi bebas dari bahan-bahan yang diharamkan (seperti kontaminasi babi atau alkohol).",
            },
          ],
          [
            { text: "Standar Sertifikasi Resmi: ", bold: true },
            {
              text: "Produk telah mendapatkan label halal dari lembaga berwenang seperti Badan Penyelenggara Jaminan Produk Halal (BPJPH) atau Majelis Ulama Indonesia (MUI).",
            },
          ],
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Dengan standar yang ketat ini, makanan beku tidak lagi dipandang sebelah mata, melainkan bertransformasi menjadi pilihan pangan modern yang higienis dan terjamin.",
          },
        ],
      },
      {
        type: "heading",
        text: "Alasan Frozen Food Halal Penting untuk Keluarga Indonesia",
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Bagi keluarga di Indonesia, label halal pada makanan bukan sekadar formalitas, melainkan bentuk perlindungan dan ketenangan batin. Berikut adalah beberapa alasan utama mengapa ",
          },
          { text: "frozen food", italic: true },
          { text: " halal menjadi pilihan yang sangat penting:" },
        ],
      },
      {
        type: "list",
        ordered: true,
        items: [
          [
            { text: "Ketenangan Hati Konsumen Muslim: ", bold: true },
            {
              text: "Sebagai negara dengan mayoritas penduduk Muslim, memastikan kehalalan makanan adalah kewajiban mutlak. Mengonsumsi makanan yang halal membawa berkah dan kesehatan bagi jasmani maupun rohani keluarga.",
            },
          ],
          [
            { text: "Standar Kebersihan dan Higienitas yang Tinggi: ", bold: true },
            { text: "Untuk mendapatkan sertifikasi halal, pabrik atau produsen " },
            { text: "frozen food", italic: true },
            { text: " wajib menerapkan sistem jaminan halal yang juga mengatur standar kebersihan (" },
            { text: "good manufacturing practices", italic: true },
            {
              text: "). Artinya, produk yang sampai di meja makan Anda dijamin bersih dan aman.",
            },
          ],
          [
            { text: "Solusi Praktis Tanpa Kompromi Kualitas: ", bold: true },
            {
              text: "Gaya hidup modern menuntut efisiensi. Makanan beku halal menawarkan kepraktisan memasak dalam hitungan menit tanpa harus mengorbankan nilai gizi dan prinsip kehalalan yang memegang peranan kunci.",
            },
          ],
        ],
      },
      { type: "heading", text: "Menjaga Kualitas dari Dapur Anda" },
      {
        type: "paragraph",
        spans: [
          {
            text: "Memilih produk makanan beku yang tepat adalah langkah awal melindungi keluarga. Pastikan Anda selalu mengecek kemasan, tanggal kedaluwarsa, serta logo halal resmi sebelum membeli. Kombinasi antara rasa yang lezat, kepraktisan penyajian, dan jaminan kehalalan mutlak akan membuat momen makan bersama keluarga menjadi lebih hangat dan bermakna.",
          },
        ],
      },
      { type: "heading", text: "Yuk, Sediakan yang Terbaik untuk Keluarga!" },
      {
        type: "paragraph",
        spans: [
          {
            text: "Ingin menyajikan hidangan praktis, berkualitas, dan 100% halal untuk keluarga tercinta di rumah? Jangan ragu untuk melihat berbagai pilihan produk unggulan kami yang diolah dengan standar higienis tinggi.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          { text: "Kunjungi halaman " },
          { text: "Produk Kami", href: "/products" },
          {
            text: " sekarang juga untuk menemukan inspirasi menu lezat hari ini, atau hubungi tim layanan pelanggan kami melalui ",
          },
          { text: "WhatsApp Business", href: SITE.whatsapp.url },
          { text: " untuk informasi pemesanan dan peluang kerja sama " },
          { text: "reseller", italic: true },
          { text: "!" },
        ],
      },
    ],
  },
  {
    id: "art-standar-cold-chain-halal",
    title: "Standar Rantai Dingin & Higienitas Produk Frozen Food Wiridan 318",
    slug: "standar-cold-chain-higienitas-frozen-food",
    category: "Industri & Standar Mutu",
    excerpt:
      "Bagaimana sistem cold-chain -18°C menjaga kesegaran, tekstur, dan keamanan pangan olahan daging halal dari dapur produksi hingga ke tangan konsumen.",
    coverImage: "/sang-prabu/dapur.jpg",
    author: "SANG PRABU",
    publishedAt: "2026-08-10T09:00:00",
    content:
      "Komitmen PT KARYA SANG PRABU dalam penerapan rantai dingin terintegrasi dan sertifikasi halal untuk menjamin kualitas terbaik setiap produk Wiridan 318.",
    featured: true,
  },
  {
    id: "art-peluang-kemitraan-reseller",
    title: "Peluang Usaha Reseller & Agen Frozen Food Halal: Panduan Memulai",
    slug: "peluang-kemitraan-reseller-agen-frozen-food",
    category: "Kemitraan & Bisnis",
    excerpt:
      "Panduan lengkap menjadi mitra distributor dan reseller resmi Wiridan 318 — margin kompetitif, dukungan material promosi, dan pasokan stabil.",
    coverImage: "/wiridan/bakso-premium.jpg",
    author: "SANG PRABU",
    publishedAt: "2026-08-08T14:30:00",
    content:
      "Buka peluang usaha mandiri dengan menjadi agen dan reseller produk frozen food halal berkualitas tinggi dari PT KARYA SANG PRABU.",
    featured: true,
  },
  {
    id: "art-sertifikasi-halal-bpjph",
    title: "Jaminan Halal BPJPH & Keamanan Pangan: Komitmen Mutu PT Karya Sang Prabu",
    slug: "jaminan-halal-bpjph-keamanan-pangan-sang-prabu",
    category: "Sertifikasi & Kepatuhan",
    excerpt:
      "Setiap tahapan proses produksi, pemilihan bahan baku daging sapi & ayam, hingga pengemasan telah memenuhi standar halal resmi dan higienis BPOM.",
    coverImage: "/sang-prabu/daging-sapi.jpg",
    author: "SANG PRABU",
    publishedAt: "2026-08-05T11:00:00",
    content:
      "Kepatuhan regulasi dan komitmen sertifikasi halal menjadi pilar utama PT KARYA SANG PRABU dalam melayani konsumen dan mitra bisnis.",
    featured: false,
  },
  {
    id: "art-efisiensi-horeka",
    title: "Strategi Efisiensi Pasokan Bahan Baku Pangan untuk Sektor Horeka & Catering",
    slug: "strategi-efisiensi-pasokan-pangan-horeka-catering",
    category: "Wawasan B2B",
    excerpt:
      "Solusi pengadaan komoditas dan bahan pangan beku terintegrasi untuk restoran, hotel, dan katering dalam menjaga stabilitas harga dan kualitas menu.",
    coverImage: "/sang-prabu/butcher.jpg",
    author: "SANG PRABU",
    publishedAt: "2026-08-01T08:00:00",
    content:
      "Bagaimana sinergi pasokan bahan baku dari PT KARYA SANG PRABU membantu bisnis kuliner meningkatkan profitabilitas dan kepuasan pelanggan.",
    featured: false,
  },
] satisfies Article[]).sort(
  (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
);

export const ARTICLE_CATEGORIES = [
  "Company News",
  "Business",
  "Product",
  "Industry",
  "Partnership",
  "CSR",
  "Insights",
] as const;

/** Klien & mitra kerja sama (Our Client) — sumber: company profile resmi. */
export const PARTNERS: Partner[] = [
  { name: "PT. Sumbercitra Agrilestari Sentosa", category: "Perusahaan" },
  { name: "PT. Biru Fasfood Nusantara (AW)", category: "Perusahaan" },
  { name: "PT. Tetige Citra Khatulistiwa", category: "Perusahaan" },
  { name: "PT. Baker Hughes Balikpapan", category: "Perusahaan" },
  { name: "PT. Japfa Comfeed Indonesia", category: "Perusahaan" },
  { name: "PT. Tiara Sinergy Transindo", category: "Perusahaan" },
  { name: "PT. Pos Logistik Indonesia", category: "Perusahaan" },
  { name: "PT. Dunia Inovasi Cemerlang", category: "Perusahaan" },
  { name: "PT. Sarana Global Jaya", category: "Perusahaan" },
  { name: "PT. Dheca Mandiri Sejahtera", category: "Perusahaan" },
  { name: "PT. Estetika Tata Tiara", category: "Perusahaan" },
  { name: "PT. Freeport Indonesia", category: "Perusahaan" },
  { name: "PT. Agro Indotama Lestari", category: "Perusahaan" },
  { name: "PT. ABC President", category: "Perusahaan" },
  { name: "PT. Madex Indonesia", category: "Perusahaan" },
  { name: "PT. Sumber Makanan Sehat", category: "Perusahaan" },
  { name: "PT. Inti Lumbung Indonesia", category: "Perusahaan" },
  { name: "PT. Sumber Jaya Unggas", category: "Perusahaan" },
  { name: "PT. Sungai Budi Group", category: "Perusahaan" },
  { name: "PT. Pandu Jaya Buana", category: "Perusahaan" },
  { name: "PT. Kaltim Prima Coal", category: "Perusahaan" },
  { name: "PT. Septia Anugrah", category: "Perusahaan" },
  { name: "CV. Mahardika Maulit Sarana", category: "Perusahaan" },
  { name: "CV. Rinjanis Chicken", category: "Perusahaan" },
  { name: "CV. Kaliserayoe", category: "Perusahaan" },
  { name: "Food Station", category: "Food Service" },
  { name: "Rumah Makan Ayam Bakar Pak D", category: "Food Service" },
  { name: "Rumah Makan President", category: "Food Service" },
  { name: "Rumah Makan Pemuda", category: "Food Service" },
  { name: "Rumah Makan Rachmawati", category: "Food Service" },
  { name: "Hisana Fried Chicken", category: "Food Service" },
];

export const FAQS: Faq[] = [
  {
    category: "Products",
    question: "Apakah PT KARYA SANG PRABU distributor resmi WIRIDAN 318?",
    answer:
      "Ya, PT KARYA SANG PRABU adalah distributor resmi untuk produk olahan pangan beku WIRIDAN 318 (Bakso Sapi Premium, Bakso Reguler, Otak-Otak Ikan, dan Dimsum Siap Kukus 500g) yang higienis dan bersertifikat Halal Indonesia BPJPH.",
  },
  {
    category: "Products",
    question: "Berapa lama masa simpan (shelf life) dan bagaimana suhu penyimpanannya?",
    answer:
      "Produk frozen food Wiridan 318 memiliki masa simpan hingga 6–12 bulan dalam kondisi beku stabil di suhu -18°C atau lebih rendah. Hindari membekukan kembali produk yang sudah dicairkan (thawed) demi menjaga tekstur dan higienitas.",
  },
  {
    category: "Products",
    question: "Komoditas dan produk apa saja yang ditangani PT KARYA SANG PRABU?",
    answer:
      "Kami menangani pasokan komoditas rempah ekspor (cengkeh, kapulaga, pala, kayu manis), hasil bumi, komoditas pangan, daging ayam karkas, serta olahan pangan beku halal dan layanan general trading.",
  },
  {
    category: "Partnership",
    question: "Bagaimana cara menjadi Reseller, Agen, atau Mitra B2B Horeka?",
    answer:
      "Anda dapat mendaftar melalui halaman Partnership atau langsung menghubungi WhatsApp Business kami (0889 3663 031). Kami menyediakan skema margin bertingkat, materi promosi, dan kepastian pasokan rutin.",
  },
  {
    category: "Partnership",
    question: "Berapa Minimum Order Quantity (MOQ) untuk pembelian grosir/agen?",
    answer:
      "Untuk area Jabodetabek, minimum pemesanan agen/reseller mulai dari 1 karton (isi 20–24 pack @ 500g) dengan opsi pengiriman berpendingin (cold-chain delivery) atau kurir instan/same-day.",
  },
  {
    category: "Order",
    question: "Bagaimana cara meminta Price List / Katalog Resmi?",
    answer:
      "Klik tombol 'Minta Penawaran' atau chat WhatsApp kami dengan mencantumkan nama usaha, domisili, dan produk yang diminati. Tim sales B2B kami akan mengirimkan daftar harga grosir dan syarat kerja sama.",
  },
  {
    category: "Company",
    question: "Apa legalitas dan profil PT KARYA SANG PRABU?",
    answer:
      "PT KARYA SANG PRABU berdiri sejak 2019 (SK Kemenkumham AHU-0059668.AH.01.01.Tahun 2019, NIB terdaftar di OSS-RBA). Bagian dari PRIMA PRABU GROUP yang melayani klien tier-1 dan pasar domestik/internasional.",
  },
  {
    category: "General",
    question: "Di mana alamat kantor dan fasilitas operasional?",
    answer: `Kantor kami berlokasi di ${SITE.address.line}. Jam operasional ${SITE.businessHours}.`,
  },
];

export const FAQ_CATEGORIES = [
  "Company",
  "Products",
  "Partnership",
  "Order",
  "General",
] as const;

export const CAREERS: CareerPosition[] = [
  {
    title: "Operator Mesin Produksi Pangan (Site 2 Pilot Facility)",
    department: "Manufaktur & Produksi (PAE)",
    location: "Fasilitas Produksi Site 2, Depok",
    type: "Penuh Waktu",
    description:
      "Bertanggung jawab atas pengoperasian mesin meat grinder, silent cutter, mesin forming bakso, dan steamer dimsum dengan kepatuhan tinggi terhadap higienitas & SOP.",
    requirements: [
      "Pendidikan minimal SMA/SMK (Tata Boga/Teknik Mesin/Industri diutamakan)",
      "Pengalaman minimal 1 tahun di industri pengolahan daging/frozen food atau fresh graduate terlatih",
      "Memahami prinsip Good Manufacturing Practices (GMP) dan sanitasi pangan",
      "Bersedia bekerja dalam sistem shift dan lingkungan suhu dingin terkontrol",
      "Disiplin, teliti, dan memiliki fisik yang prima",
    ],
  },
  {
    title: "Quality Control Officer (HACCP & BPOM Compliance)",
    department: "Quality Assurance & Regulatory",
    location: "Fasilitas Pengolahan Pangan, Depok",
    type: "Penuh Waktu",
    description:
      "Memastikan setiap batch bahan baku daging, bumbu rempah, hingga produk jadi Wiridan 318 memenuhi parameter organoleptik, mikrobiologi, dan standar sertifikasi Halal BPJPH & BPOM.",
    requirements: [
      "Pendidikan D3/S1 Teknologi Pangan, Kimia, Biologi, atau bidang terkait",
      "Memiliki sertifikat atau pemahaman mendalam tentang HACCP, GMP, dan Sistem Jaminan Produk Halal (SJPH)",
      "Pengalaman minimal 1–2 tahun di QC pabrik makanan/minuman beku",
      "Mampu melakukan inspeksi bahan baku masuk, in-process control, dan pengujian shelf-life",
      "Keahlian dokumentasi audit mutu dan pelaporan regulasi",
    ],
  },
  {
    title: "Staff Gudang & Cold Storage Management (-18°C)",
    department: "Logistik & Rantai Pasok Dingin",
    location: "Depo Cold Storage, Depok / Jakarta",
    type: "Penuh Waktu",
    description:
      "Mengelola penerimaan, penataan stok FIFO, monitoring suhu ruangan beku -18°C secara berkala, dan persiapan pesanan karton agen/reseller secara akurat.",
    requirements: [
      "Pendidikan minimal SMA/SMK sederajat",
      "Pengalaman kerja di cold storage / gudang logistik berpendingin minimal 1 tahun",
      "Terbiasa dengan sistem pencatatan stock opname, labeling barcode, dan packing karton beku",
      "Mampu bekerja di lingkungan suhu rendah dengan APD termal standar",
      "Jujur, rapi, dan bertanggung jawab terhadap akurasi fisik barang",
    ],
  },
  {
    title: "B2B Sales Executive (Komoditas & Food Service Horeka)",
    department: "Commercial & Business Development",
    location: "Kantor Pusat Depok & Mobilitas Jabodetabek",
    type: "Penuh Waktu",
    description:
      "Mengembangkan kemitraan baru dengan jaringan restoran, hotel, katering, distributor daerah, serta agen reseller untuk produk komoditas Sang Prabu dan frozen food Wiridan 318.",
    requirements: [
      "Pendidikan minimal D3/S1 semua jurusan (Pemasaran/Bisnis diutamakan)",
      "Pengalaman minimal 2 tahun di B2B sales pangan/komoditas/FMCG",
      "Memiliki jaringan relasi aktif di sektor Horeka dan distributor pangan",
      "Kemampuan presentasi, negosiasi kontrak pasokan, dan pemenuhan target revenue",
      "Memiliki kendaraan pribadi dan SIM aktif",
    ],
  },
];

export const CONTACT_SUBJECTS = [
  "Kemitraan / Distributor",
  "Permintaan / Penawaran",
  "Kerja Sama Bisnis",
  "Karier",
  "Lainnya",
] as const;

export const BUSINESS_TYPES = [
  "Distributor",
  "Supplier / Pemasok",
  "Eksportir / Importir",
  "Retail / Toko",
  "Instansi / Perusahaan",
  "Lainnya",
] as const;
