import type { Metadata } from "next";
import { SiteChrome, PageHero } from "@/components/corporate/site-chrome";
import { Container, SectionHeader } from "@/components/corporate/ui";
import { ProductsExplorer } from "@/components/corporate/products-explorer";
import { CommodityCatalog } from "@/components/corporate/commodity-catalog";
import {
  COMMODITIES,
  COMMODITY_CATEGORIES,
  PRODUCTS,
  PRODUCT_CATEGORIES,
} from "@/lib/corporate/site";
import { ProductImage } from "@/components/corporate/product-image";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Produk & komoditas PT KARYA SANG PRABU — rempah, hasil bumi, pangan, hasil laut, hingga lini pangan beku halal SANG PRABU. Kualitas ekspor.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <SiteChrome heroTransparent>
      <PageHero
        overline="Products & Commodities"
        title="Produk & komoditas unggulan"
        description="Berbagai komoditas berkualitas ekspor serta lini pangan beku halal berlabel SANG PRABU — siap untuk pasar domestik maupun internasional."
      />

      {/* Katalog komoditas (utama) */}
      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeader
            overline="Our Commodities"
            title="Komoditas unggulan"
            description="Bersumber langsung dari produsen dan petani, dengan mutu terkontrol dan dapat disesuaikan kebutuhan buyer."
          />
          <div className="mt-10">
            <CommodityCatalog
              commodities={COMMODITIES}
              categories={COMMODITY_CATEGORIES}
            />
          </div>
        </Container>
      </section>

      {/* Lini pangan beku WIRIDAN 318 & SANG PRABU */}
      <section className="bg-brand-cream py-16 sm:py-20">
        <Container>
          {/* Header Banner Brand Resmi Wiridan 318 — PT KARYA SANG PRABU */}
          <div className="mb-12 rounded-2xl border border-amber-400/50 bg-gradient-to-br from-[#3b060a] via-[#1f0508] to-[#04140b] p-6 sm:p-10 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="size-28 sm:size-32 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-400/80 bg-black/60 p-1.5 shadow-[0_10px_30px_rgba(212,175,55,0.3)]">
                <ProductImage
                  src="/wiridan/wiridan_logo_gold_1786791750372.png"
                  fallbackSrc="/wiridan/logo-wiridan.jpg"
                  alt="Logo Resmi WIRIDAN 318 — PT KARYA SANG PRABU"
                  className="h-full w-full object-contain rounded-xl"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
                  <span>★ BRAND RESMI PT KARYA SANG PRABU</span>
                </div>
                <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Lini Produk Frozen Food &amp; Bakso WIRIDAN 318
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-amber-100/90 max-w-3xl">
                  <strong className="text-amber-300">WIRIDAN 318</strong> adalah brand resmi olahan pangan beku milik <strong className="text-white">PT KARYA SANG PRABU</strong> yang memproduksi aneka bakso sapi premium, bakso reguler, otak-otak ikan, dan dimsum siap kukus berstandar 100% Halal Indonesia (BPJPH). Melayani pesanan ritel, keagenan, grosir, restoran, katering, dan supermarket.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-amber-200">
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                    ✓ Kemasan Kedap Udara 500g
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                    ✓ 100% Halal BPJPH
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                    ✓ Rantai Dingin Terjaga (-18°C)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <SectionHeader
            overline="Food & Beverages"
            title="Katalog Pangan Olahan & Frozen Food"
            description="Produk olahan daging sapi, ikan, dan ayam bermutu tinggi dengan rantai dingin (cold chain) higienis."
          />
          <div className="mt-10">
            <ProductsExplorer products={PRODUCTS} categories={PRODUCT_CATEGORIES} />
          </div>
        </Container>
      </section>
    </SiteChrome>
  );
}
