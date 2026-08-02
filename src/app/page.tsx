/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SiteChrome } from "@/components/corporate/site-chrome";
import {
  Container,
  Overline,
  SectionHeader,
  SiteButton,
} from "@/components/corporate/ui";
import { ValueIcon } from "@/components/corporate/icon";
import {
  ARTICLES,
  BUSINESS_UNITS,
  PRODUCTS,
  SITE,
  VALUES,
} from "@/lib/corporate/site";

export const metadata: Metadata = {
  title: "PT KARYA SANG PRABU — The Best Partner Your Business",
  description:
    "PT KARYA SANG PRABU — perusahaan nasional komoditas dan general trading. Mitra terpercaya penyediaan & distribusi komoditas unggulan untuk pasar domestik dan internasional.",
  alternates: { canonical: "/" },
};

const featuredUnits = BUSINESS_UNITS.filter((u) => u.featured);
const featuredProducts = PRODUCTS.filter((p) => p.featured);
const latestArticles = ARTICLES.slice(0, 3);

export default function HomePage() {
  return (
    <SiteChrome heroTransparent>
      {/* ============ HERO ============ */}
      <section className="relative isolate flex min-h-screen items-end justify-center overflow-hidden bg-[#0b2e18]">
        {/* Logo hero SANG PRABU (persis file yang diunggah, tanpa perubahan) */}
        <img
          src="/sang-prabu/hero-emblem.png"
          alt="Logo SANG PRABU — PT KARYA SANG PRABU"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        {/* Gelapkan bagian bawah saja agar teks & tombol terbaca; emblem tetap utuh */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,32,18,0) 0%, rgba(6,32,18,0) 44%, rgba(6,32,18,0.55) 64%, rgba(6,30,17,0.94) 100%)",
          }}
          aria-hidden
        />
        <Container className="pb-20 pt-[46vh] text-center text-white sm:pb-24">
          <Reveal>
            <h1 className="font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.01em] sm:text-[3.2rem]">
              The Best Partner{" "}
              <span className="text-brand-gold">Your Business</span>
            </h1>
          </Reveal>
          <Reveal delayMs={110} className="mt-5">
            <p className="mx-auto max-w-2xl text-[15px] leading-[1.75] text-white/80 sm:text-lg">
              {SITE.positioning}
            </p>
          </Reveal>
          <Reveal delayMs={190} className="mt-9">
            <div className="flex flex-wrap justify-center gap-3">
              <SiteButton href="/business" variant="gold" withArrow>
                Explore Our Business
              </SiteButton>
              <SiteButton href="/contact" variant="ghost">
                Contact Us
              </SiteButton>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ============ WHO WE ARE ============ */}
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="relative">
                <img
                  src="/sang-prabu/dapur.jpg"
                  alt="Dapur produksi SANG PRABU"
                  className="aspect-[4/3] w-full rounded-lg object-cover shadow-[0_20px_60px_-30px_rgba(11,77,33,0.5)]"
                />
                <span className="absolute -bottom-4 -right-4 hidden h-24 w-24 rounded-lg border-2 border-brand-gold sm:block" />
              </div>
            </Reveal>
            <Reveal delayMs={120}>
              <SectionHeader
                overline="Who We Are"
                title="Mitra terpercaya dalam komoditas & general trading"
                description="PT KARYA SANG PRABU adalah perusahaan nasional yang bergerak di bidang komoditas dan general trading berbasis di Indonesia — mitra terpercaya dalam penyediaan dan distribusi berbagai komoditas unggulan untuk pasar domestik dan internasional. Bagian dari PRIMA PRABU GROUP."
              />
              <div className="mt-7">
                <SiteButton href="/about" variant="outline" withArrow>
                  About Us
                </SiteButton>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============ BUSINESS OVERVIEW ============ */}
      <section className="bg-brand-cream py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeader
              overline="Core Business"
              title="Enam lini bisnis inti kami"
              description="Cakupan usaha PT KARYA SANG PRABU — dari komoditas dan perdagangan lintas negara hingga layanan pendukung bisnis."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredUnits.map((unit, i) => (
              <Reveal key={unit.slug} delayMs={i * 70}>
                <Link
                  href={`/business#${unit.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-black/5 bg-white p-6 transition-shadow duration-300 hover:shadow-[0_20px_50px_-30px_rgba(11,77,33,0.6)]"
                >
                  <span className="flex size-12 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green transition-colors group-hover:bg-brand-green group-hover:text-white">
                    <ValueIcon name={unit.icon} className="size-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-brand-green-dark">
                    {unit.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[13.5px] leading-[1.65] text-brand-ink/70">
                    {unit.overview}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-green">
                    Selengkapnya
                    <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============ WHY US ============ */}
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeader
              align="center"
              overline="Why Karya Sang Prabu"
              title="Nilai yang menjadi fondasi kami"
            />
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delayMs={i * 80}>
                <div className="flex h-full flex-col items-center rounded-lg border border-black/5 bg-brand-cream/50 px-5 py-8 text-center">
                  <span className="flex size-12 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                    <ValueIcon name={value.icon} className="size-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-brand-green-dark">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.6] text-brand-ink/65">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============ PRODUCT HIGHLIGHT ============ */}
      <section className="bg-brand-cream py-20 sm:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <SectionHeader
                overline="Our Products"
                title="Produk unggulan SANG PRABU"
                description="Pangan beku halal berkualitas — higienis, bergizi, dengan rantai dingin terjaga."
              />
            </Reveal>
            <Reveal delayMs={120}>
              <SiteButton href="/products" variant="outline" withArrow>
                Lihat Semua Produk
              </SiteButton>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, i) => (
              <Reveal key={product.id} delayMs={i * 90}>
                <div className="group overflow-hidden rounded-lg bg-white shadow-[0_14px_40px_-30px_rgba(11,77,33,0.6)]">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-green">
                      {product.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-brand-green-dark">
                      {product.name}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-[1.6] text-brand-ink/70">
                      {product.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============ PARTNERSHIP ============ */}
      <section className="relative isolate overflow-hidden bg-brand-green-dark py-20 text-white sm:py-24">
        <div
          className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(closest-side,#dea40255,transparent)" }}
          aria-hidden
        />
        <Container className="relative">
          <div className="grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
            <Reveal>
              <SectionHeader
                invert
                overline="Partnership"
                title="Building Stronger Partnerships"
                description="Kami terbuka untuk kolaborasi — distributor, reseller, hingga kerja sama strategis. Mari tumbuh bersama sebagai partner bisnis jangka panjang."
              />
            </Reveal>
            <Reveal delayMs={120} className="md:justify-self-end">
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <SiteButton href="/partners" variant="gold" withArrow>
                  Become Our Partner
                </SiteButton>
                <SiteButton href={SITE.whatsapp.url} variant="ghost" external>
                  WhatsApp
                </SiteButton>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============ ARTICLES ============ */}
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeader
              overline="Articles & News"
              title="Kabar terbaru dari kami"
              description="Informasi seputar perusahaan, produk, industri, dan kemitraan."
            />
          </Reveal>
          {latestArticles.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {latestArticles.map((article, i) => (
                <Reveal key={article.id} delayMs={i * 90}>
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
                        {article.category}
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
            <Reveal className="mt-10">
              <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-black/10 bg-brand-cream/40 px-6 py-16 text-center">
                <Newspaper className="size-8 text-brand-gold" />
                <p className="font-display text-lg font-semibold text-brand-green-dark">
                  Artikel segera hadir
                </p>
                <p className="max-w-md text-[13.5px] leading-[1.65] text-brand-ink/65">
                  Kami sedang menyiapkan kabar dan wawasan terbaru. Nantikan
                  publikasi resmi PT KARYA SANG PRABU.
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="bg-brand-cream py-20 sm:py-24">
        <Container>
          <Reveal>
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-brand-gold/30 bg-white px-6 py-14 text-center shadow-[0_30px_80px_-50px_rgba(11,77,33,0.5)]">
              <Overline>Let&apos;s Work Together</Overline>
              <h2 className="max-w-2xl font-display text-[1.9rem] font-semibold leading-[1.1] tracking-[-0.015em] text-brand-green-dark sm:text-[2.6rem]">
                Let&apos;s Build Something Great Together
              </h2>
              <p className="max-w-xl text-[15px] leading-[1.7] text-brand-ink/70">
                Diskusikan kebutuhan bisnis Anda dengan tim PT KARYA SANG PRABU.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <SiteButton href="/contact" variant="primary" withArrow>
                  Contact Us
                </SiteButton>
                <SiteButton href="/products" variant="outline">
                  Lihat Produk
                </SiteButton>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </SiteChrome>
  );
}
