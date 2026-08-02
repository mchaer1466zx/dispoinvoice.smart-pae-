/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { SiteChrome, PageHero } from "@/components/corporate/site-chrome";
import { Container } from "@/components/corporate/ui";
import { Reveal } from "@/components/reveal";
import { ARTICLES } from "@/lib/corporate/site";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Artikel & berita PT KARYA SANG PRABU — kabar perusahaan, produk, industri, kemitraan, dan wawasan bisnis.",
  alternates: { canonical: "/articles" },
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(iso));
}

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
                  <Link
                    href={`/articles/${article.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-lg border border-black/5 bg-white transition-shadow hover:shadow-[0_18px_50px_-30px_rgba(11,77,33,0.5)]"
                  >
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="h-44 w-full object-cover"
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
                        {article.category} · {formatDate(article.publishedAt)}
                      </p>
                      <h3 className="mt-2 font-display text-lg font-semibold text-brand-green-dark">
                        {article.title}
                      </h3>
                      <p className="mt-2 flex-1 text-[13px] leading-[1.6] text-brand-ink/70">
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
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
