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
  // Tagline utama yang dipakai di seluruh identitas visual perusahaan.
  tagline: "THE BEST PARTNER YOUR BUSINESS",
  // Tagline pada company profile resmi.
  taglineOfficial: "YOUR TRUSTED BUSINESS PARTNER",
  group: "PRIMA PRABU GROUP",
  logo: "/logos/logo-sang-prabu.png",
  positioning:
    "PT KARYA SANG PRABU adalah perusahaan nasional yang bergerak di bidang komoditas dan general trading berbasis di Indonesia — mitra terpercaya dalam penyediaan dan distribusi berbagai komoditas unggulan untuk memenuhi kebutuhan pasar domestik dan internasional.",
  address: {
    line: "Graha Mustika Ratu, Jl. Gatot Subroto No. 74-75, RT.002 RW.001, Menteng Dalam, Jakarta",
    maps: "https://maps.google.com/?q=Graha+Mustika+Ratu+Jl+Gatot+Subroto+74-75+Menteng+Dalam+Jakarta",
  },
  phone: "0811 3885 700",
  email: "sangprabugroup@gmail.com",
  website: "www.sangprabugroup.com",
  whatsapp: {
    display: "0811 3885 700",
    url: `https://wa.me/628113885700?text=${encodeURIComponent(
      "Halo PT KARYA SANG PRABU, saya ingin menjajaki kerja sama / kemitraan bisnis.",
    )}`,
  },
  businessHours: "Senin – Jumat · 08.00 – 17.00 WIB",
  socials: [] as { label: string; href: string; icon: string }[],
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

export const WHY_US: Value[] = [
  ...VALUES,
  {
    title: "Professionalism",
    description: "Dikelola manajemen & tenaga kerja berpengalaman.",
    icon: "briefcase",
  },
  {
    title: "Reliability",
    description: "Jaringan pemasok luas & sumber daya alam Indonesia yang melimpah.",
    icon: "badge-check",
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

/** Produk pangan (lini Food & Beverages — brand SANG PRABU). */
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

export const FAQS: Faq[] = [
  {
    category: "Company",
    question: "Apa itu PT KARYA SANG PRABU?",
    answer:
      "PT KARYA SANG PRABU adalah perusahaan nasional yang bergerak di bidang komoditas dan general trading berbasis di Indonesia, dengan enam lini bisnis inti — bagian dari PRIMA PRABU GROUP.",
  },
  {
    category: "Company",
    question: "Sejak kapan perusahaan berdiri?",
    answer:
      "PT KARYA SANG PRABU berdiri sejak 2019 (Akta Pendirian No. 28 Tahun 2019, SK Kemenkumham AHU-0059668.AH.01.01.Tahun 2019).",
  },
  {
    category: "Products",
    question: "Komoditas & produk apa saja yang ditangani?",
    answer:
      "Kami menangani berbagai komoditas unggulan serta produk pada lini Property & Konstruksi, Export & Import, Alat Kesehatan, Komoditas, Food & Beverages, dan Jasa Konsultan.",
  },
  {
    category: "Partnership",
    question: "Bagaimana cara menjadi mitra?",
    answer:
      "Silakan isi formulir pada halaman Partners atau hubungi kami via WhatsApp/email. Tim kami akan menindaklanjuti pengajuan kerja sama Anda.",
  },
  {
    category: "Order",
    question: "Bagaimana cara mengajukan permintaan/penawaran?",
    answer:
      "Gunakan tombol Inquire/Contact atau hubungi kontak resmi kami. Sampaikan kebutuhan Anda dan tim kami akan merespons.",
  },
  {
    category: "General",
    question: "Di mana kantor PT KARYA SANG PRABU?",
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

export const CAREERS: CareerPosition[] = [];

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
