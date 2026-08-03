/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteChrome } from "@/components/corporate/site-chrome";
import { Container, SiteButton } from "@/components/corporate/ui";
import { ArticleBody } from "@/components/corporate/article-body";
import { FaqAccordion } from "@/components/corporate/faq-accordion";
import { ARTICLES, SITE, type Article } from "@/lib/corporate/site";

const BASE = "https://primaprabu-group-raul-pae.vercel.app";

export function generateStaticParams() {
  // Hanya artikel internal yang punya halaman detail; artikel bersumber
  // eksternal menaut langsung ke sumbernya dari daftar.
  return ARTICLES.filter((a) => !a.externalUrl).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: "Artikel tidak ditemukan" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
    },
  };
}

/** Perkiraan waktu baca (menit) dari isi artikel; ~200 kata/menit. */
function readingMinutes(article: Article): number {
  const fromBody = (article.body ?? [])
    .flatMap((b) => {
      if (b.type === "heading") return [b.text];
      if (b.type === "paragraph") return b.spans.map((s) => s.text);
      return b.items.flatMap((row) => row.map((s) => s.text));
    })
    .join(" ");
  const text = `${fromBody} ${article.content}`.trim();
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 200));
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  // Artikel eksternal tidak memiliki halaman detail internal.
  if (!article || article.externalUrl) notFound();

  const related = ARTICLES.filter(
    (a) => a.slug !== article.slug && a.category === article.category && !a.externalUrl,
  ).slice(0, 3);

  const minutes = readingMinutes(article);
  const url = `${BASE}/articles/${article.slug}`;

  // JSON-LD: BlogPosting + BreadcrumbList (+ FAQPage bila artikel punya FAQ).
  // Melengkapi Organization/WebSite global tanpa menduplikasinya.
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.excerpt,
      image: `${BASE}${article.coverImage}`,
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      author: { "@type": "Organization", name: article.author },
      publisher: {
        "@type": "Organization",
        name: SITE.legalName,
        logo: { "@type": "ImageObject", url: `${BASE}${SITE.logo}` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      articleSection: article.category,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Beranda", item: BASE },
        { "@type": "ListItem", position: 2, name: "Artikel", item: `${BASE}/articles` },
        { "@type": "ListItem", position: 3, name: article.title, item: url },
      ],
    },
  ];
  if (article.faqs && article.faqs.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return (
    <SiteChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="bg-white pb-20 pt-28 sm:pt-32">
        <Container className="max-w-3xl">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-green hover:underline"
          >
            <ArrowLeft className="size-4" /> Semua Artikel
          </Link>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
            {article.category} ·{" "}
            {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(
              new Date(article.publishedAt),
            )}{" "}
            · {minutes} menit baca
          </p>
          <h1 className="mt-3 font-display text-[2rem] font-semibold leading-[1.12] tracking-[-0.02em] text-brand-green-dark sm:text-[2.8rem]">
            {article.title}
          </h1>
          <p className="mt-3 text-[13px] text-brand-ink/60">Oleh {article.author}</p>
          <img
            src={article.coverImage}
            alt={article.title}
            className="mt-8 aspect-[16/9] w-full rounded-lg object-cover"
          />
          {article.body ? (
            <ArticleBody blocks={article.body} />
          ) : (
            <div className="mt-8 space-y-5 text-[15.5px] leading-[1.8] text-brand-ink/85">
              {article.content.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {article.faqs && article.faqs.length ? (
            <section className="mt-14">
              <h2 className="font-display text-2xl font-semibold text-brand-green-dark">
                Pertanyaan yang Sering Diajukan
              </h2>
              <div className="mt-6">
                <FaqAccordion faqs={article.faqs} />
              </div>
            </section>
          ) : null}

          {article.cta && article.cta.length ? (
            <div className="mt-12 flex flex-wrap gap-3">
              {article.cta.map((c) => (
                <SiteButton
                  key={c.href}
                  href={c.href}
                  variant={c.variant ?? "primary"}
                  withArrow
                >
                  {c.label}
                </SiteButton>
              ))}
            </div>
          ) : null}
        </Container>
      </article>

      {related.length > 0 ? (
        <section className="bg-brand-cream py-16">
          <Container className="max-w-3xl">
            <h2 className="font-display text-xl font-semibold text-brand-green-dark">
              Artikel terkait
            </h2>
            <ul className="mt-5 space-y-3">
              {related.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/articles/${a.slug}`}
                    className="text-[15px] font-medium text-brand-green hover:underline"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <section className="bg-white py-14 text-center">
        <SiteButton href="/contact" variant="outline" withArrow>
          Hubungi Kami
        </SiteButton>
      </section>
    </SiteChrome>
  );
}
