/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SiteChrome, PageHero } from "@/components/corporate/site-chrome";
import { Container, Overline, SiteButton } from "@/components/corporate/ui";
import { ValueIcon } from "@/components/corporate/icon";
import { Reveal } from "@/components/reveal";
import { BUSINESS_UNITS } from "@/lib/corporate/site";

export const metadata: Metadata = {
  title: "Business",
  description:
    "Lini bisnis inti PT KARYA SANG PRABU — Property & Konstruksi, Export & Import, Alat Kesehatan, Komoditas, Food & Beverages, dan Jasa Konsultan.",
  alternates: { canonical: "/business" },
};

export default function BusinessPage() {
  return (
    <SiteChrome heroTransparent>
      <PageHero
        overline="Core Business"
        title="Enam lini bisnis inti"
        description="Cakupan usaha PT KARYA SANG PRABU sebagai perusahaan komoditas dan general trading. Struktur modular — mudah dikembangkan seiring pertumbuhan."
      />

      {/* Ringkasan enam lini */}
      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BUSINESS_UNITS.map((unit, i) => (
              <Reveal key={unit.slug} delayMs={i * 60}>
                <a
                  href={`#${unit.slug}`}
                  className="flex h-full items-start gap-4 rounded-lg border border-black/5 bg-brand-cream/40 p-5 transition-colors hover:border-brand-green/30"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                    <ValueIcon name={unit.icon} className="size-6" />
                  </span>
                  <span>
                    <span className="font-display text-[15px] font-semibold text-brand-green-dark">
                      {unit.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
                      {unit.tagline}
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Detail tiap lini */}
      {BUSINESS_UNITS.map((unit, i) => (
        <section
          key={unit.slug}
          id={unit.slug}
          className={`scroll-mt-24 py-16 sm:py-20 ${i % 2 === 0 ? "bg-brand-cream" : "bg-white"}`}
        >
          <Container>
            <div
              className={`grid items-center gap-10 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Reveal>
                {unit.image ? (
                  <img
                    src={unit.image}
                    alt={unit.name}
                    className="aspect-[4/3] w-full rounded-lg object-cover shadow-[0_20px_60px_-30px_rgba(11,77,33,0.5)]"
                  />
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-brand-green-dark">
                    <ValueIcon name={unit.icon} className="size-24 text-brand-gold/80" />
                  </div>
                )}
              </Reveal>
              <Reveal delayMs={120}>
                <Overline>{unit.tagline}</Overline>
                <h2 className="mt-3 font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.015em] text-brand-green-dark sm:text-[2.3rem]">
                  {unit.name}
                </h2>
                <span className="mt-4 block h-[3px] w-14 rounded-full bg-brand-gold" />
                <p className="mt-5 text-[15px] leading-[1.75] text-brand-ink/75">
                  {unit.overview}
                </p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {unit.whatWeDo.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[14px] text-brand-ink/80">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand-green" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <SiteButton href="/contact" variant="outline" withArrow>
                    Diskusikan Kerja Sama
                  </SiteButton>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      ))}
    </SiteChrome>
  );
}
