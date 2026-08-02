import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { SiteChrome, PageHero } from "@/components/corporate/site-chrome";
import { Container } from "@/components/corporate/ui";
import { ArticleCard } from "@/components/corporate/article-card";
import { Reveal } from "@/components/reveal";
import { ARTICLES } from "@/lib/corporate/site";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Artikel & berita PT KARYA SANG PRABU — kabar perusahaan, produk, industri, kemitraan, dan wawasan bisnis.",
  alternates: { canonical: "/articles" },
};

export default function ArticlesPage() {
  return (
    <SiteChrome heroTransparent>
      <PageHero
        overline="Articles & News"
        title="Kabar & wawasan"
        description="Informasi seputar perusahaan, produk, industri, dan kemitraan PT KARYA SANG PRABU."
      />
      <section className="bg-white py-16 sm:py-24">
        <Container>
          {ARTICLES.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ARTICLES.map((article, i) => (
                <Reveal key={article.id} delayMs={i * 80}>
                  <ArticleCard article={article} showDate />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-black/10 bg-brand-cream/40 px-6 py-20 text-center">
              <Newspaper className="size-9 text-brand-gold" />
              <p className="font-display text-xl font-semibold text-brand-green-dark">
                Artikel segera hadir
              </p>
              <p className="max-w-md text-[14px] leading-[1.65] text-brand-ink/65">
                Kami sedang menyiapkan kabar dan wawasan terbaru. Nantikan publikasi
                resmi PT KARYA SANG PRABU.
              </p>
            </div>
          )}
        </Container>
      </section>
    </SiteChrome>
  );
}
