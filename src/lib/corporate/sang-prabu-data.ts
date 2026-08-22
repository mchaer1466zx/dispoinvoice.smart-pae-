export interface KbliItem {
  no: number;
  code: string;
  title: string;
  category: "Produksi & Pengolahan" | "Perdagangan Besar" | "Pergudangan & Retail";
  description: string;
  iconName: string;
}

export const KBLI_OFFICIAL_LIST: KbliItem[] = [
  {
    no: 1,
    code: "10790",
    title: "Industri Makanan Lainnya",
    category: "Produksi & Pengolahan",
    description:
      "Formulasi bumbu rempah olahan, kaldu, adonan premiks, dan aneka olahan pangan pelengkap berstandar mutu BPOM & Halal.",
    iconName: "Layers",
  },
  {
    no: 2,
    code: "10120",
    title: "Pengolahan & Pengawetan Daging dan Produk Daging",
    category: "Produksi & Pengolahan",
    description:
      "Fasilitas pemotongan, pembekuan cepat (blast freezing), dan pengawetan daging sapi serta ayam secara higienis cold-chain.",
    iconName: "Snowflake",
  },
  {
    no: 3,
    code: "46322",
    title: "Perdagangan Besar Ayam dan Produk Olahannya",
    category: "Perdagangan Besar",
    description:
      "Distribusi partai besar ayam karkas segar/beku, fillet dada/paha, dan produk turunan unggas ke jaringan modern market & industri.",
    iconName: "Truck",
  },
  {
    no: 4,
    code: "4632",
    title: "Perdagangan Besar Bahan Makanan Hasil Peternakan",
    category: "Perdagangan Besar",
    description:
      "Penyediaan komoditas hasil peternakan nasional untuk kebutuhan industri olahan daging, katering besar, dan rantai pasok horeka.",
    iconName: "Building2",
  },
  {
    no: 5,
    code: "46323",
    title: "Perdagangan Besar Daging dan Produk Olahannya",
    category: "Perdagangan Besar",
    description:
      "Suplai grosir bakso, sosis, daging cincang, dan produk olahan daging beku bersertifikasi resmi ke agen serta distributor se-Indonesia.",
    iconName: "ShieldCheck",
  },
  {
    no: 6,
    code: "46324",
    title: "Perdagangan Besar Perikanan dan Produk Olahannya",
    category: "Perdagangan Besar",
    description:
      "Penyaluran komoditas perikanan dan produk olahan ikan seperti Otak-Otak Sang Prabu berbahan baku ikan tenggiri murni pilihan.",
    iconName: "Scale",
  },
  {
    no: 7,
    code: "46322",
    title: "Perdagangan Besar Daging Sapi dan Daging Ayam",
    category: "Perdagangan Besar",
    description:
      "Grosir daging sapi impor/lokal (prime cut & manufacturing cut) dan daging ayam utuh standar RPU dengan sertifikat halal MUI/BPJPH.",
    iconName: "FileCheck2",
  },
  {
    no: 8,
    code: "47245",
    title: "Perdagangan Eceran Daging Olahan",
    category: "Pergudangan & Retail",
    description:
      "Layanan distribusi retail dan kemitraan toko beku (frozen food mart) untuk menjangkau konsumen akhir rumah tangga.",
    iconName: "Award",
  },
  {
    no: 9,
    code: "52102",
    title: "Pergudangan dan Penyimpanan (Cold Storage / Gudang)",
    category: "Pergudangan & Retail",
    description:
      "Fasilitas cold storage suhu terkontrol -18°C hingga -25°C dengan kapasitas ratusan ton guna menjaga stabilitas rantai dingin nasional.",
    iconName: "Warehouse",
  },
  {
    no: 10,
    code: "10120",
    title: "Pengolahan dan Pengawetan Daging (Produksi Bakso Daging)",
    category: "Produksi & Pengolahan",
    description:
      "Lini manufaktur otomatis berkapasitas 250.000 butir/hari khusus produksi Bakso Sang Prabu kualitas premium dengan tekstur kenyal alami.",
    iconName: "Factory",
  },
];

export interface SangPrabuProductItem {
  id: string;
  name: string;
  tagline: string;
  category: "Produk Utama" | "Produk Tambahan";
  description: string;
  image: string;
  weightOptions: string[];
  keySpecs: string[];
  shelfLife: string;
  storageTemp: string;
  bpjphHalal: string;
  badgeColor: "gold" | "emerald" | "ruby";
}

export const SANG_PRABU_CORE_PRODUCTS: SangPrabuProductItem[] = [
  {
    id: "bakso-sang-prabu",
    name: "Bakso Sang Prabu",
    tagline: "Kenyal Alami Daging Sapi Pilihan & Resep Warisan Nusantara",
    category: "Produk Utama",
    description:
      "Dibuat dari potongan daging sapi segar berkualitas tinggi yang dipadukan dengan rempah-rempah pilihan tanpa boraks atau pengawet berbahaya. Menghasilkan tekstur kenyal berurat yang mantap dan rasa kuah gurih alami.",
    image: "/images/products/bakso-premium.webp",
    weightOptions: ["500 gr (Isi 25)", "1.000 gr (Isi 50)", "Bal/Kartonan Grosir"],
    keySpecs: [
      "Kandungan daging sapi asli > 80%",
      "Tekstur kenyal padat tanpa bahan kimia berbahaya",
      "Siap rebus/kukus untuk sajian keluarga & Horeka",
    ],
    shelfLife: "12 Bulan pada suhu beku",
    storageTemp: "-18°C Cold-Chain",
    bpjphHalal: "ID00410000123456721",
    badgeColor: "gold",
  },
  {
    id: "otak-otak-sang-prabu",
    name: "Otak-otak Sang Prabu",
    tagline: "Aroma Rempah Wangi & Daging Ikan Segar Berkualitas",
    category: "Produk Utama",
    description:
      "Olahan ikan tenggiri segar dengan adonan tepung tapioka bermutu tinggi dan balutan daun rempah harum. Menghasilkan cita rasa gurih khas nusantara yang lembut di dalam dan renyah saat digoreng.",
    image: "/images/products/otak-otak.webp",
    weightOptions: ["500 gr (Isi 20)", "1.000 gr (Isi 40)", "Kemasan Grosir B2B"],
    keySpecs: [
      "Daging ikan tenggiri segar berkualitas ekspor",
      "Kombinasi bawang merah, santan, dan rempah aromatik",
      "Cocok digoreng, dibakar, atau disajikan dengan saus kacang",
    ],
    shelfLife: "9 Bulan pada suhu beku",
    storageTemp: "-18°C Cold-Chain",
    bpjphHalal: "ID00410000123456721",
    badgeColor: "emerald",
  },
  {
    id: "dimsum-sang-prabu",
    name: "Dimsum Sang Prabu",
    tagline: "Siomay Ayam Lembut, Juicy, & Kulit Tipis Gurih",
    category: "Produk Utama",
    description:
      "Siomay dimsum berbahan dasar paha ayam giling segar yang lembut dan juicy, dibalut kulit tipis elastis dengan variasi topping wortel, jamur, nori, dan keju. Solusi praktis santapan lezat bintang lima.",
    image: "/images/products/dimsum-ayam.webp",
    weightOptions: ["Isi 10 Pcs (Pack)", "Isi 25 Pcs (Family)", "Isi 50 Pcs (Horeka)"],
    keySpecs: [
      "100% Daging ayam segar halal & kaldu alami",
      "Tekstur juicy tidak kering saat dikukus",
      "Disertai saus chili oil / sambal dimsum istimewa",
    ],
    shelfLife: "10 Bulan pada suhu beku",
    storageTemp: "-18°C Cold-Chain",
    bpjphHalal: "ID00410000123456721",
    badgeColor: "gold",
  },
  {
    id: "daging-karkas-halal",
    name: "Daging & Karkas Halal Sang Prabu",
    tagline: "Daging Sapi & Karkas Ayam Higienis Standar RPU Terpadu",
    category: "Produk Tambahan",
    description:
      "Penyediaan daging sapi segar/beku (Prime Cut, Trimming, Knuckle, Tenderloin) dan daging karkas ayam potong higienis. Diproses melalui Rumah Potong Unggas (RPU) dan RPH bersertifikat Halal dengan standar rantai dingin -18°C.",
    image: "/images/facilities/daging-sapi.webp",
    weightOptions: ["Karkas Ayam 0.8 - 1.2 kg", "Daging Sapi Blok 1 - 25 kg", "Custom Cut Horeka"],
    keySpecs: [
      "Penyembelihan syar'i bersertifikat Juleha / BPJPH",
      "Karkas bebas memar, higienis, dan tanpa formalin",
      "Armada reefer pendingin berinsulasi untuk pasokan harian",
    ],
    shelfLife: "12 Bulan pada suhu -18°C",
    storageTemp: "-18°C Cold-Chain",
    bpjphHalal: "ID00410000123456721",
    badgeColor: "ruby",
  },
];
