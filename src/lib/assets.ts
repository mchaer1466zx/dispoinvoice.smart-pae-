/**
 * Source of Truth untuk seluruh static asset image PT KARYA SANG PRABU.
 * Semua path berformat root-relative ("/...") yang valid untuk Next.js static assets di folder public/.
 */

export const ASSETS = {
  logos: {
    sangPrabu: "/logos/logo-sang-prabu.png",
    ksp: "/logos/logo-ksp.png",
    pae: "/logos/logo-pae.png",
    pub: "/logos/logo-pub.png",
  },
  brand: {
    emblem: "/sang-prabu/emblem.png",
    emblemDark: "/sang-prabu/emblem-dark.png",
    logoText: "/sang-prabu/logo-text.jpg",
  },
  products: {
    bakso: "/sang-prabu/bakso.jpg",
    heroBakso: "/sang-prabu/hero-bakso.jpg",
    otakOtak: "/sang-prabu/otak-otak.jpg",
    dimsum: "/sang-prabu/dimsum.jpg",
    dagingAyam: "/sang-prabu/daging-ayam.jpg",
    dagingSapi: "/sang-prabu/daging-sapi.jpg",
    karkas: "/sang-prabu/karkas.jpg",
    butcher: "/sang-prabu/butcher.jpg",
    dapur: "/sang-prabu/dapur.jpg",
    kantor: "/sang-prabu/kantor.jpg",
    sapiFarm: "/sang-prabu/sapi-farm.jpg",
    sapi: "/sang-prabu/sapi.jpg",
    sapiTray: "/sang-prabu/sapi-tray.jpg",
    ayamProses: "/sang-prabu/ayam-proses.jpg",
    comproPage: (page: number) =>
      `/sang-prabu/compro/hal-${String(page).padStart(2, "0")}.jpg`,
  },
  articles: {
    caraMenyimpan: "/articles/cara-menyimpan-frozen-food.svg",
    frozenFoodHalal: "/articles/frozen-food-halal.svg",
    lansiaDirampok: "/articles/lansia-dirampok-terlakban.svg",
    ukrainaRusia: "/articles/ukraina-rusia-serangan.svg",
    israelGaza: "/articles/israel-gaza-akhir-pekan.svg",
    rupiahMaestro: "/articles/rupiah-maestro-bi.svg",
    upacara17Agustus: "/articles/upacara-17-agustus-2026.svg",
    singapuraAi: "/articles/singapura-ai-produktivitas.svg",
    dharmaJaya: "/articles/dharma-jaya-ternak-sapi.svg",
    aiIdeBisnis: "/articles/ai-ide-bisnis.svg",
    elonMusk: "/articles/elon-musk-triliuner-spacex.svg",
  },
} as const;
