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

      {/* Lini pangan beku SANG PRABU */}
      <section className="bg-brand-cream py-16 sm:py-20">
        <Container>
          <SectionHeader
            overline="Food & Beverages"
            title="Produk SANG PRABU"
            description="Lini pangan beku halal — higienis, bergizi, dengan rantai dingin terjaga."
          />
          <div className="mt-10">
            <ProductsExplorer products={PRODUCTS} categories={PRODUCT_CATEGORIES} />
          </div>
        </Container>
      </section>
    </SiteChrome>
  );
}
