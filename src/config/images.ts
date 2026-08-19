/**
 * CENTRALIZED IMAGE ASSETS CONFIGURATION
 * PT KARYA SANG PRABU & WIRIDAN 318 FOOD
 * 
 * Standardized, production-safe, and validated paths for all core assets.
 */

export const BRAND_IMAGES = {
  // PT Karya Sang Prabu Official Crest & Logos
  sangPrabu: {
    webp: "/images/logo/logo-sang-prabu.webp",
    png: "/images/logo/logo-sang-prabu.png",
    fallbackPng: "/logos/logo-sang-prabu.png",
    hakiPng: "/sang-prabu/sang-prabu-haki-logo.png",
    faviconSvg: "/assets/logo/logo-sang-prabu-favicon.svg",
    headerSvg: "/assets/logo/logo-sang-prabu-header.svg",
    alt: "Logo Resmi PT Karya Sang Prabu",
  },
  // Wiridan 318 Food Royal Gold Crest & Logos
  wiridan318: {
    webp: "/images/logo/logo-wiridan-318-gold.webp",
    png: "/images/logo/logo-wiridan-318-gold.png",
    jpg: "/images/logo/logo-wiridan-318-gold.jpg",
    alt: "Logo Resmi Wiridan 318 Gold - PT Karya Sang Prabu",
  },
  // Group Logos
  group: {
    ksp: "/logos/logo-ksp.png",
    pae: "/logos/logo-pae.png",
    pub: "/logos/logo-pub.png",
  },
} as const;

export const HERO_IMAGES = {
  masterWebp: "/images/hero/hero-wiridan-master.webp",
  masterJpg: "/images/hero/hero-wiridan-master.jpg",
  groupBanner: "/wiridan/wiridan-group.jpg",
  alt: "WIRIDAN 318 — Pilihan Terbaik Untuk Keluarga — Better Proses, Better Quality & Better Serve",
} as const;

/**
 * 8 Official Wiridan 318 SKUs mapping
 */
export const PRODUCT_IMAGES = {
  "B-01": {
    code: "B-01",
    name: "Bakso Goreng Renyah",
    webp: "/images/products/bakso-goreng.webp",
    jpg: "/images/products/bakso-goreng.jpg",
    alt: "Bakso Goreng Wiridan 318 - gurih renyah luar lembut dalam siap goreng praktis",
  },
  "B-02": {
    code: "B-02",
    name: "Bakso Ayam Kenyal",
    webp: "/images/products/bakso-ayam.webp",
    jpg: "/images/products/bakso-ayam.jpg",
    alt: "Bakso Ayam Wiridan 318 - kenyal gurih nikmat daging ayam segar higienis",
  },
  "B-03": {
    code: "B-03",
    name: "Bakso Sapi Medium",
    webp: "/images/products/bakso-medium.webp",
    jpg: "/images/products/bakso-medium.jpg",
    alt: "Bakso Medium Wiridan 318 - ukuran pas rasa seimbang cocok untuk usaha kuliner",
  },
  "B-04": {
    code: "B-04",
    name: "Bakso Urat Sapi",
    webp: "/images/products/bakso-urat.webp",
    jpg: "/images/products/bakso-urat.jpg",
    alt: "Bakso Urat Wiridan 318 - tekstur kenyal berurat sensasi kriuk daging sapi asli",
  },
  "B-05": {
    code: "B-05",
    name: "Bakso Sapi Premium",
    webp: "/images/products/bakso-premium.webp",
    jpg: "/images/products/bakso-premium.jpg",
    alt: "Bakso Premium Wiridan 318 - tekstur kenyal rasa gurih premium daging sapi pilihan",
  },
  "C-01": {
    code: "C-01",
    name: "Otak-Otak Ikan Tenggiri",
    webp: "/images/products/otak-otak.webp",
    jpg: "/images/products/otak-otak.jpg",
    alt: "Otak-Otak Ikan Wiridan 318 - ikan pilihan lezat bergizi kenyal empuk aroma rempah",
  },
  "D-01": {
    code: "D-01",
    name: "Dimsum Siomay Ayam",
    webp: "/images/products/dimsum-ayam.webp",
    jpg: "/images/products/dimsum-ayam.jpg",
    alt: "Dimsum Siomay Ayam Wiridan 318 - lembut gurih juicy kulit tipis siap kukus praktis",
  },
  "D-02": {
    code: "D-02",
    name: "Dimsum Mix Platter",
    webp: "/images/products/dimsum-mix.webp",
    jpg: "/images/products/dimsum-mix.jpg",
    alt: "Dimsum Mix Platter Wiridan 318 - variasi aneka topping keju wortel nori jamur gurih lezat",
  },
} as const;

export type ProductSkuCode = keyof typeof PRODUCT_IMAGES;
