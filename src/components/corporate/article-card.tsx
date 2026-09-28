/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/corporate/site";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(
    new Date(iso),
  );
}

const CARD_CLASS =
  "group flex h-full flex-col overflow-hidden rounded-lg border border-black/5 bg-white transition-shadow hover:shadow-[0_18px_50px_-30px_rgba(11,77,33,0.5)]";

/**
 * Kartu artikel (thumbnail + judul). Menaut ke halaman detail internal, atau —
 * bila `externalUrl` diisi — langsung ke sumber aslinya di tab baru.
 */
export function ArticleCard({
  article,
  showDate = false,
}: {
  article: Article;
  showDate?: boolean;
}) {
  const isExternal = Boolean(article.externalUrl);

  const inner = (
    <>
      <div className="relative">
        <img
          src={article.coverImage}
          alt={article.title}
          className="h-44 w-full object-cover"
        />
        {isExternal ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
            <ArrowUpRight className="size-3" />
            {article.source ?? "Sumber"}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
          {article.category}
          {showDate ? ` · ${formatDate(article.publishedAt)}` : ""}
        </p>
        <h3 className="mt-2 font-display text-lg font-semibold text-brand-green-dark">
          {article.title}
        </h3>
        <p className="mt-2 flex-1 text-[13px] leading-[1.6] text-brand-ink/70">
          {article.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-green">
          {isExternal ? "Baca di sumber" : "Baca selengkapnya"}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={article.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={CARD_CLASS}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={`/articles/${article.slug}`} className={CARD_CLASS}>
      {inner}
    </Link>
  );
}
