/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteChrome } from "@/components/corporate/site-chrome";
import { Container, SiteButton } from "@/components/corporate/ui";
import { ARTICLES } from "@/lib/corporate/site";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
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
    openGraph: { title: article.title, description: article.excerpt, images: [article.coverImage] },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = ARTICLES.filter(
    (a) => a.slug !== article.slug && a.category === article.category,
  ).slice(0, 3);

  return (
    <SiteChrome>
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
            )}
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
          <div className="mt-8 space-y-5 text-[15.5px] leading-[1.8] text-brand-ink/85">
            {article.content.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
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
