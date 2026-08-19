export interface WiridanProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  alt: string;
  shortDesc: string;
  portion: string;
  storage: string;
  color: string; // Tailwind color classes for badges & glow accents
  category: "Bakso" | "Dimsum" | "Otak-Otak";
  tagline: string;
  weight: string;
  halalNumber: string;
  bpomStatus: string;
  shelfLife: string;
  ingredients: string[];
  cookingInstructions: string[];
  targetMarket: string;
  featured?: boolean;
}

export const WIRIDAN_PRODUCTS: WiridanProduct[] = [
  {
    id: "b-05-bakso-premium",
    name: "Bakso Sapi Premium Wiridan 318",
    slug: "bakso-premium-wiridan-318",
    image: "/images/products/bakso-premium.webp",
    alt: "Bakso Premium Wiridan 318 - tekstur kenyal rasa gurih premium daging sapi pilihan",
    shortDesc: "Bakso sapi kualitas tertinggi dengan dominasi daging sapi segar pilihan, tekstur kenyal alami tanpa boraks, dan bumbu rempah tradisi istimewa.",
    portion: "± 25 - 30 Butir (500g)",
    storage: "Simpan Beku -18°C",
    color: "amber",
    category: "Bakso",
    tagline: "Lezat, Gurih, Nikmat — Daging Sapi Pilihan",
    weight: "500 Gram",
    halalNumber: "ID00410000123456721",
    bpomStatus: "MD 239928001001",
    shelfLife: "12 Bulan pada suhu -18°C",
    ingredients: [
      "Daging Sapi Segar Pilihan (Kandungan Tinggi)",
      "Tepung Tapioka Berkualitas",
      "Bawang Putih Goreng & Bawang Merah",
      "Garam Beryodium & Ekstrak Kaldu Sapi",
      "Lada Putih & Rempah Racikan Wiridan 318",
    ],
    cookingInstructions: [
      "Rebus dalam air mendidih atau kuah kaldu selama 5-7 menit hingga mengapung sempurna.",
      "Cocok disajikan bersama mie, bihun, tahu bakso, sayuran sawi, dan taburan seledri & bawang goreng.",
      "Bisa juga dibakar dengan olesan saus madu barbekyu atau digoreng krispi.",
    ],
    targetMarket: "Hotel Bintang, Restoran Bakso Premium, Horeka, Katering Pesta, & Konsumsi Keluarga",
    featured: true,
  },
  {
    id: "b-04-bakso-urat",
    name: "Bakso Urat Sapi Wiridan 318",
    slug: "bakso-urat-wiridan-318",
    image: "/images/products/bakso-urat.webp",
    alt: "Bakso Urat Wiridan 318 - tekstur kenyal berurat sensasi kriuk daging sapi asli",
    shortDesc: "Paduan daging sapi segar dengan cacahan urat sapi pilihan yang memberikan sensasi 'kriuk' bertekstur mantap di setiap gigitan.",
    portion: "± 25 - 30 Butir (500g)",
    storage: "Simpan Beku -18°C",
    color: "blue",
    category: "Bakso",
    tagline: "Kenyal & Berurat — Sensasi Gurih Mantap",
    weight: "500 Gram",
    halalNumber: "ID00410000123456721",
    bpomStatus: "MD 239928001002",
    shelfLife: "12 Bulan pada suhu -18°C",
    ingredients: [
      "Daging Sapi & Cacahan Urat Sapi Segar",
      "Tepung Tapioka Premium",
      "Bawang Putih & Bawang Goreng Gurih",
      "Bumbu Rempah Alami & Garam",
      "Kaldu Sapi Konsentrat",
    ],
    cookingInstructions: [
      "Rebus dalam kuah kaldu sapi mendidih selama 6-8 menit agar urat empuk dan juicy.",
      "Sangat nikmat disajikan dengan kuah pedas gurih, sambal taichan, atau kuah rawon.",
    ],
    targetMarket: "Kedai Bakso Urat, Warung Makan, Usaha Kuliner, & Pecinta Tekstur Urat",
    featured: true,
  },
  {
    id: "b-03-bakso-medium",
    name: "Bakso Sapi Medium Wiridan 318",
    slug: "bakso-medium-wiridan-318",
    image: "/images/products/bakso-medium.webp",
    alt: "Bakso Medium Wiridan 318 - ukuran pas rasa seimbang cocok untuk usaha kuliner",
    shortDesc: "Formulasi bakso sapi ukuran ideal dengan harga ekonomis kompetitif tanpa mengorbankan cita rasa gurih dan standar higienis pabrik.",
    portion: "± 30 - 35 Butir (500g)",
    storage: "Simpan Beku -18°C",
    color: "emerald",
    category: "Bakso",
    tagline: "Ukuran Pas, Rasa Seimbang — Solusi Usaha",
    weight: "500 Gram",
    halalNumber: "ID00410000123456721",
    bpomStatus: "MD 239928001003",
    shelfLife: "12 Bulan pada suhu -18°C",
    ingredients: [
      "Daging Sapi & Olahan Daging Higienis",
      "Tepung Pati Pilihan",
      "Bumbu Rempah Tradisional",
      "Garam & Penguat Rasa Alami",
      "Air Es & Minyak Bawang",
    ],
    cookingInstructions: [
      "Rebus dalam kuah kaldu selama 5 menit hingga bakso mengembang kenyal.",
      "Sangat ideal untuk campuran capcay, mie ayam bakso, sup sayur, nasi goreng, dan tumisan.",
    ],
    targetMarket: "Pedagang Mie Ayam Bakso, Katering Prasmanan, Warung Tegal/Makan, & Usaha Ritel",
    featured: true,
  },
  {
    id: "b-01-bakso-goreng",
    name: "Bakso Goreng Renyah Wiridan 318",
    slug: "bakso-goreng-wiridan-318",
    image: "/images/products/bakso-goreng.webp",
    alt: "Bakso Goreng Wiridan 318 - gurih renyah luar lembut dalam siap goreng praktis",
    shortDesc: "Bakso olahan siap goreng yang mengembang cantik dengan lapisan luar renyah keemasan dan bagian dalam tetap lembut gurih.",
    portion: "± 20 - 25 Butir (500g)",
    storage: "Simpan Beku -18°C",
    color: "amber",
    category: "Bakso",
    tagline: "Gurih, Renyah, Siap Goreng — Mekar Sempurna",
    weight: "500 Gram",
    halalNumber: "ID00410000123456721",
    bpomStatus: "MD 239928001004",
    shelfLife: "12 Bulan pada suhu -18°C",
    ingredients: [
      "Daging Pilihan & Olahan Ayam Segar",
      "Tepung Racikan Khusus Bakso Goreng",
      "Minyak Nabati & Bumbu Rempah Gurih",
      "Bawang Putih, Daun Bawang, & Garam",
      "Minyak Wijen & Kaldu Alami",
    ],
    cookingInstructions: [
      "Keluarkan dari freezer, biarkan di suhu ruang 5-10 menit.",
      "Goreng dalam minyak banyak dengan api sedang (150-160°C) selama 8-10 menit sambil dibolak-balik hingga mekar renyah keemasan.",
      "Sajikan hangat bersama saus sambal manis pedas atau bumbu tabur.",
    ],
    targetMarket: "Booth Jajanan Mall, Cafe, Restoran Dimsum, Reseller Frozen Food, & Camilan Keluarga",
    featured: true,
  },
  {
    id: "b-02-bakso-ayam",
    name: "Bakso Ayam Kenyal Wiridan 318",
    slug: "bakso-ayam-wiridan-318",
    image: "/images/products/bakso-ayam.webp",
    alt: "Bakso Ayam Wiridan 318 - kenyal gurih nikmat daging ayam segar higienis",
    shortDesc: "Olahan daging ayam segar bertekstur lembut dan kenyal alami, kaya protein, dengan aroma bawang putih yang menggugah selera.",
    portion: "± 30 - 35 Butir (500g)",
    storage: "Simpan Beku -18°C",
    color: "rose",
    category: "Bakso",
    tagline: "Kenyal, Gurih, Nikmat — Tinggi Protein",
    weight: "500 Gram",
    halalNumber: "ID00410000123456721",
    bpomStatus: "MD 239928001005",
    shelfLife: "12 Bulan pada suhu -18°C",
    ingredients: [
      "Daging Dada & Paha Ayam Segar",
      "Tepung Tapioka Premium",
      "Bawang Putih, Bawang Merah, & Daun Bawang",
      "Garam Beryodium & Bumbu Kaldu Ayam Alami",
      "Lada Putih Halus",
    ],
    cookingInstructions: [
      "Rebus dalam air/kuah sup selama 4-6 menit hingga matang empuk.",
      "Dapat dibakar, ditumis bersama sayur, atau digoreng tepung renyah.",
    ],
    targetMarket: "Kantin Sekolah, Rumah Sakit, Katering Harian, & Menu Sehat Keluarga",
    featured: false,
  },
  {
    id: "d-01-dimsum-ayam",
    name: "Dimsum Siomay Ayam Wiridan 318",
    slug: "dimsum-ayam-wiridan-318",
    image: "/images/products/dimsum-ayam.webp",
    alt: "Dimsum Siomay Ayam Wiridan 318 - lembut gurih juicy kulit tipis siap kukus praktis",
    shortDesc: "Siomay dimsum ayam premium dengan isian daging ayam padat juicy, dibungkus kulit pangsit tipis lembut berhiaskan parutan wortel segar.",
    portion: "± 18 - 20 Pcs (500g)",
    storage: "Simpan Beku -18°C",
    color: "cyan",
    category: "Dimsum",
    tagline: "Lembut, Gurih & Praktis — Siap Kukus 8 Menit",
    weight: "500 Gram",
    halalNumber: "ID00410000123456721",
    bpomStatus: "MD 239928001006",
    shelfLife: "12 Bulan pada suhu -18°C",
    ingredients: [
      "Daging Ayam Cincang Pilihan (Padat Juicy)",
      "Kulit Pangsit Lembut Khusus Dimsum",
      "Parutan Wortel Segar",
      "Minyak Wijen Murni & Kecap Asin",
      "Bawang Putih, Daun Bawang, & Kaldu Alami",
    ],
    cookingInstructions: [
      "Olesi kukusan dengan sedikit minyak agar tidak lengket.",
      "Kukus dimsum dalam keadaan beku selama 8-10 menit dengan api sedang hingga kulit lembut dan isian panas merata.",
      "Nikmati bersama saus chili oil atau saus cocolan asam manis.",
    ],
    targetMarket: "Cafe, Resto Kopi, Kedai Dimsum, Hotel Breakfast, & Reseller Ritel",
    featured: true,
  },
  {
    id: "d-02-dimsum-mix",
    name: "Dimsum Mix Platter Wiridan 318",
    slug: "dimsum-mix-wiridan-318",
    image: "/images/products/dimsum-mix.webp",
    alt: "Dimsum Mix Platter Wiridan 318 - variasi aneka topping keju wortel nori jamur gurih lezat",
    shortDesc: "Koleksi aneka varian siomay dimsum favorit (topping keju, jamur, nori rumput laut, dan wortel) dalam satu kemasan hemat keluarga.",
    portion: "± 18 - 20 Pcs (500g)",
    storage: "Simpan Beku -18°C",
    color: "indigo",
    category: "Dimsum",
    tagline: "Kombinasi Aneka Topping — Kaya Sensasi Rasa",
    weight: "500 Gram",
    halalNumber: "ID00410000123456721",
    bpomStatus: "MD 239928001007",
    shelfLife: "12 Bulan pada suhu -18°C",
    ingredients: [
      "Daging Ayam Segar & Udang Cincang",
      "Aneka Topping: Keju Cheddar, Nori, Jamur Kuping, Wortel",
      "Kulit Dimsum Halus",
      "Minyak Wijen & Rempah Oriental Halal",
      "Bumbu Penyedap Kaldu",
    ],
    cookingInstructions: [
      "Kukus selama 8-10 menit dengan penutup kukusan dialasi kain bersih.",
      "Dapat juga digoreng dalam minyak panas selama 3-4 menit untuk variasi dimsum goreng renyah.",
    ],
    targetMarket: "Pecinta Variasi Dimsum, Pesta Keluarga, Katering Arisan, & Restoran",
    featured: false,
  },
  {
    id: "c-01-otak-otak",
    name: "Otak-Otak Ikan Tenggiri Wiridan 318",
    slug: "otak-otak-ikan-wiridan-318",
    image: "/images/products/otak-otak.webp",
    alt: "Otak-Otak Ikan Wiridan 318 - ikan pilihan lezat bergizi kenyal empuk aroma rempah",
    shortDesc: "Dibuat dari ikan segar pilihan dengan aroma rempah daun bawang yang wangi, bertekstur empuk kenyal pas, nikmat digoreng renyah atau dikukus hangat.",
    portion: "± 20 - 25 Batang (500g)",
    storage: "Simpan Beku -18°C",
    color: "emerald",
    category: "Otak-Otak",
    tagline: "Ikan Pilihan, Lezat, Bergizi — Wangi Rempah",
    weight: "500 Gram",
    halalNumber: "ID00410000123456721",
    bpomStatus: "MD 239928001008",
    shelfLife: "12 Bulan pada suhu -18°C",
    ingredients: [
      "Daging Ikan Segar Pilihan Berkualitas",
      "Tepung Sagu Tani Premium",
      "Santan Kelapa Murni",
      "Daun Bawang Iris Segar & Bawang Merah",
      "Bumbu Rempah Tradisional & Garam Beryodium",
    ],
    cookingInstructions: [
      "Goreng: Goreng dalam minyak panas sedang selama 3-5 menit hingga berwarna kuning keemasan mekar.",
      "Kukus: Kukus selama 6-8 menit untuk sensasi tekstur kenyal lembut bersahaja.",
      "Panggang: Bakar di atas teflon/grill dengan olesan margarin untuk aroma bakar khas tradisi.",
    ],
    targetMarket: "Kantin Sekolah, Restoran Seafood, Booth Jajanan Mall, Reseller Frozen Food, & Konsumsi Santai",
    featured: true,
  },
];

export function getProductBySlug(slug: string): WiridanProduct | undefined {
  return WIRIDAN_PRODUCTS.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): WiridanProduct[] {
  return WIRIDAN_PRODUCTS.filter((p) => p.featured);
}
