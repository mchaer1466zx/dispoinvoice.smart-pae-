import type { Metadata } from "next";
import { SiteChrome, PageHero } from "@/components/corporate/site-chrome";
import { Container } from "@/components/corporate/ui";
import { ProductsExplorer } from "@/components/corporate/products-explorer";
import { PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/corporate/site";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Katalog produk SANG PRABU — bakso, otak-otak, dimsum, dan daging beku halal. Higienis, bergizi, dengan rantai dingin terjaga.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <SiteChrome heroTransparent>
      <PageHero
        overline="Products"
        title="Produk pangan beku halal SANG PRABU"
        description="Higienis, bergizi, dan berkualitas — cita rasa nusantara dengan mutu yang dijaga."
      />
      <section className="bg-white py-16 sm:py-20">
        <Container>
          <ProductsExplorer products={PRODUCTS} categories={PRODUCT_CATEGORIES} />
        </Container>
      </section>
    </SiteChrome>
  );
}
