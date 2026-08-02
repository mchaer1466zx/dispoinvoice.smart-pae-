/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SiteChrome, PageHero } from "@/components/corporate/site-chrome";
import { Container, Overline, SiteButton } from "@/components/corporate/ui";
import { Reveal } from "@/components/reveal";
import { BUSINESS_UNITS } from "@/lib/corporate/site";

export const metadata: Metadata = {
  title: "Business",
  description:
    "Lini bisnis PT KARYA SANG PRABU — Food Manufacturing (pangan beku halal), Trading & Distribution, dan Business Partnership.",
  alternates: { canonical: "/business" },
};

export default function BusinessPage() {
  return (
    <SiteChrome heroTransparent>
      <PageHero
        overline="Our Business"
        title="Lini bisnis kami"
        description="Bidang usaha yang dijalankan PT KARYA SANG PRABU. Setiap unit dirancang modular sehingga mudah dikembangkan."
      />

      {BUSINESS_UNITS.map((unit, i) => (
        <section
          key={unit.slug}
          id={unit.slug}
          className={`scroll-mt-24 py-16 sm:py-24 ${i % 2 === 0 ? "bg-white" : "bg-brand-cream"}`}
        >
          <Container>
            <div
              className={`grid items-center gap-10 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Reveal>
                <img
                  src={unit.image}
                  alt={unit.name}
                  className="aspect-[4/3] w-full rounded-lg object-cover shadow-[0_20px_60px_-30px_rgba(11,77,33,0.5)]"
                />
              </Reveal>
              <Reveal delayMs={120}>
                <Overline>{unit.tagline}</Overline>
                <h2 className="mt-3 font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.015em] text-brand-green-dark sm:text-[2.4rem]">
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
