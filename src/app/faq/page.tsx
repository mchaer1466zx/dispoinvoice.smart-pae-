import type { Metadata } from "next";
import { SiteChrome, PageHero } from "@/components/corporate/site-chrome";
import { Container, SiteButton } from "@/components/corporate/ui";
import { FaqAccordion } from "@/components/corporate/faq-accordion";
import { FAQS, FAQ_CATEGORIES } from "@/lib/corporate/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Pertanyaan yang sering diajukan tentang PT KARYA SANG PRABU — perusahaan, produk, kemitraan, pemesanan, dan umum.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <SiteChrome heroTransparent>
      <PageHero
        overline="FAQ"
        title="Pertanyaan yang sering diajukan"
        description="Temukan jawaban seputar perusahaan, produk, kemitraan, dan pemesanan."
      />
      <section className="bg-brand-cream py-16 sm:py-24">
        <Container className="max-w-3xl">
          <FaqAccordion faqs={FAQS} categories={FAQ_CATEGORIES} />

          <div className="mt-12 flex flex-col items-center gap-4 rounded-xl border border-brand-gold/30 bg-white px-6 py-10 text-center">
            <p className="font-display text-lg font-semibold text-brand-green-dark">
              Tidak menemukan jawaban Anda?
            </p>
            <p className="max-w-md text-[14px] text-brand-ink/65">
              Tim kami siap membantu pertanyaan lebih lanjut.
            </p>
            <SiteButton href="/contact" variant="primary" withArrow>
              Contact Us
            </SiteButton>
          </div>
        </Container>
      </section>
    </SiteChrome>
  );
}
