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
  tagline: "𝐓𝐡𝐞 𝐁𝐞𝐬𝐭 𝐏𝐚𝐫𝐭𝐧𝐞𝐫 𝐘𝐨𝐮𝐫 𝐁𝐮𝐬𝐢𝐧𝐞𝐬𝐬",
  taglinePlain: "The Best Partner Your Business",
  // Tagline pada company profile resmi.
  taglineOfficial: "YOUR TRUSTED BUSINESS PARTNER",
  group: "PRIMA PRABU GROUP",
  logo: "/logos/logo-sang-prabu.png",
  positioning:
    "PT KARYA SANG PRABU adalah perusahaan nasional yang bergerak di bidang komoditas dan general trading berbasis di Indonesia — mitra terpercaya dalam penyediaan dan distribusi berbagai komoditas unggulan untuk memenuhi kebutuhan pasar domestik dan internasional.",
  address: {
    line: "Jl. Pertanian Raya No. 64, Lebak Bulus, Cilandak, Jakarta Selatan 12440",
    maps: "https://maps.google.com/?q=Jl.+Pertanian+Raya+No.+64+Lebak+Bulus+Cilandak+Jakarta+Selatan+12440",
  },
  phone: "(021) 2784 1924",
  email: "ptkaryasangprabu@gmail.com",
  website: "www.sangprabugroup.com",
  whatsapp: {
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
    id: "art-lansia-dirampok",
    title: "Lansia Dirampok Tetangga, Lapor Polisi Mulut Masih Terlakban",
    slug: "lansia-dirampok-tetangga-lapor-polisi",
    category: "Nasional",
    excerpt:
      "Kabar nasional: seorang lansia dirampok tetangganya dan melapor ke polisi dengan kondisi mulut masih terlakban.",
    coverImage: "/articles/lansia-dirampok-terlakban.svg",
    author: "CNN Indonesia",
    source: "cnnindonesia.com",
    publishedAt: "2026-08-02T21:47:49",
    content:
      "Ringkasan berita eksternal. Klik untuk membaca selengkapnya di sumber aslinya.",
    featured: false,
    externalUrl:
      "https://www.cnnindonesia.com/nasional/20260802214749-12-1387798/lansia-dirampok-tetangga-lapor-polisi-mulut-masih-terlakban",
  },
  {
    id: "art-ukraina-serang-rusia",
    title: "Ukraina Serang Berbagai Wilayah Rusia, 8 Tewas",
    slug: "ukraina-serang-berbagai-wilayah-rusia",
    category: "Internasional",
    excerpt:
      "Kabar internasional terkini seputar eskalasi serangan lintas wilayah antara Ukraina dan Rusia.",
    coverImage: "/articles/ukraina-rusia-serangan.svg",
    author: "CNN Indonesia",
    source: "cnnindonesia.com",
    publishedAt: "2026-08-02T20:55:50",
    content:
      "Ringkasan berita eksternal. Klik untuk membaca selengkapnya di sumber aslinya.",
    featured: false,
    externalUrl:
      "https://www.cnnindonesia.com/internasional/20260802205550-134-1387794/ukraina-serang-berbagai-wilayah-rusia-8-tewas",
  },
  {
    id: "art-serangan-israel-gaza",
    title:
      "Serangan Israel ke Gaza Makin Menjadi Akhir Pekan Ini, 11 Orang Tewas",
    slug: "serangan-israel-ke-gaza-akhir-pekan-ini",
    category: "Internasional",
    excerpt:
      "Kabar internasional: eskalasi situasi di Gaza yang memanas pada akhir pekan ini.",
    coverImage: "/articles/israel-gaza-akhir-pekan.svg",
    author: "CNN Indonesia",
    source: "cnnindonesia.com",
    publishedAt: "2026-08-02T20:13:44",
    content:
      "Ringkasan berita eksternal. Klik untuk membaca selengkapnya di sumber aslinya.",
    featured: false,
    externalUrl:
      "https://www.cnnindonesia.com/internasional/20260802201344-120-1387789/serangan-israel-ke-gaza-makin-menjadi-akhir-pekan-ini-11-orang-tewas",
  },
  {
    id: "art-membaca-arah-rupiah",
    title: "Membaca Arah Rupiah di Tengah Pencarian Maestro Baru di BI",
    slug: "membaca-arah-rupiah-pencarian-maestro-baru-bi",
    category: "Ekonomi",
    excerpt:
      "Analisis arah nilai tukar rupiah di tengah proses pencarian pemimpin (gubernur) baru Bank Indonesia.",
    coverImage: "/articles/rupiah-maestro-bi.svg",
    author: "CNN Indonesia",
    source: "cnnindonesia.com",
    publishedAt: "2026-07-30T06:16:35",
    content:
      "Ringkasan berita eksternal. Klik untuk membaca selengkapnya di sumber aslinya.",
    featured: false,
    externalUrl:
      "https://www.cnnindonesia.com/ekonomi/20260730061635-78-1386395/membaca-arah-rupiah-di-tengah-pencarian-maestro-baru-bi",
  },
  {
    id: "art-upacara-17-agustus-2026",
    title:
      "Cara Daftar Upacara 17 Agustus 2026 di Istana Negara, Cek Syarat dan Jadwalnya",
    slug: "cara-daftar-upacara-17-agustus-2026-istana-negara",
    category: "Nasional",
    excerpt:
      "Panduan pendaftaran, syarat, dan jadwal untuk mengikuti Upacara Peringatan HUT Kemerdekaan RI 2026 di Istana Negara.",
    coverImage: "/articles/upacara-17-agustus-2026.svg",
    author: "dlvr.it",
    source: "dlvr.it",
    publishedAt: "2026-07-30",
    content:
      "Ringkasan berita eksternal. Klik untuk membaca selengkapnya di sumber aslinya.",
    featured: false,
    externalUrl: "https://dlvr.it/TTq9dK",
  },
  {
    id: "art-strategi-singapura-ai",
    title: "Strategi Singapura Maksimalkan AI untuk Produktivitas Nasional",
    slug: "strategi-singapura-maksimalkan-ai-produktivitas-nasional",
    category: "Teknologi",
    excerpt:
      "Bagaimana Singapura memanfaatkan kecerdasan buatan (AI) untuk mendongkrak produktivitas nasional.",
    coverImage: "/articles/singapura-ai-produktivitas.svg",
    author: "CNN Indonesia",
    source: "cnnindonesia.com",
    publishedAt: "2026-07-29T18:19:09",
    content:
      "Ringkasan berita eksternal. Klik untuk menonton/membaca selengkapnya di sumber aslinya.",
    featured: false,
    externalUrl:
      "https://www.cnnindonesia.com/tv/20260729181909-407-1386307/video-strategi-singapura-maksimalkan-ai-untuk-produktivitas-nasional",
  },
  {
    id: "art-dharma-jaya-ternak-sapi",
    title: "Dharma Jaya Investasi Rp1 Triliun untuk Ternak Sapi di Ciangir",
    slug: "dharma-jaya-investasi-ternak-sapi-ciangir",
    category: "Industri & Investasi",
    excerpt:
      "Kabar investasi jumbo di sektor peternakan sapi nasional — peluang besar bagi rantai pasok pangan dan mitra komoditas.",
    coverImage: "/articles/dharma-jaya-ternak-sapi.svg",
    author: "share.google",
    source: "share.google",
    publishedAt: "2026-07-28",
    content:
      "Ringkasan berita eksternal. Klik untuk membaca selengkapnya di sumber aslinya.",
    featured: true,
    externalUrl: "https://share.google/nQNXQrG4FO1ah0UKj",
  },
  {
    id: "art-ai-ide-bisnis",
    title:
      "25 Ide Bisnis AI yang Menjanjikan di Berbagai Bidang + Strategi Menjalankannya",
    slug: "25-ide-bisnis-ai-menjanjikan-strategi",
    category: "Bisnis & Teknologi",
    excerpt:
      "25 ide bisnis berbasis AI di berbagai bidang lengkap dengan strategi menjalankannya — inspirasi peluang usaha di era kecerdasan buatan.",
    coverImage: "/articles/ai-ide-bisnis.svg",
    author: "Hostinger",
    source: "hostinger.com",
    // Tutorial tanpa tanggal terbit di URL — tanggal perkiraan.
    publishedAt: "2026-07-25",
    content:
      "Ringkasan artikel eksternal. Klik untuk membaca selengkapnya di sumber aslinya.",
    featured: false,
    externalUrl: "https://www.hostinger.com/id/tutorial/ide-bisnis-menggunakan-ai/",
  },
  {
    id: "art-elon-musk-triliuner-spacex",
    title: "Elon Musk Resmi Jadi Triliuner Pertama di Dunia Usai IPO SpaceX",
    slug: "elon-musk-triliuner-pertama-dunia-ipo-spacex",
    category: "Bisnis Global",
    excerpt:
      "Elon Musk resmi menjadi triliuner pertama di dunia setelah saham SpaceX melonjak tajam dalam IPO terbesar sepanjang sejarah pada Jumat (12/6/2026).",
    coverImage: "/articles/elon-musk-triliuner-spacex.svg",
    author: "YouTube",
    source: "youtube.com",
    publishedAt: "2026-06-13",
    content:
      "Ringkasan berita eksternal. Klik untuk menonton/membaca selengkapnya di sumber aslinya.",
    featured: false,
    externalUrl: "https://youtube.com/shorts/yRXCqwuyXN8?si=7iosU3nZ83k_UkrE",
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
