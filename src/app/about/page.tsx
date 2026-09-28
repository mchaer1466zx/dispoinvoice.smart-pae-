/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import { Compass, ScrollText, Target } from "lucide-react";
import { SiteChrome, PageHero } from "@/components/corporate/site-chrome";
import { Container, SectionHeader, SiteButton } from "@/components/corporate/ui";
import { ValueIcon } from "@/components/corporate/icon";
import { Reveal } from "@/components/reveal";
import {
  COMPANY_STORY,
  LEGALITY,
  MISSION,
  SITE,
  VALUES,
  VISION,
} from "@/lib/corporate/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tentang PT KARYA SANG PRABU — perusahaan nasional komoditas dan general trading, bagian dari PRIMA PRABU GROUP. Visi, misi, nilai, dan legalitas perusahaan.",
  alternates: { canonical: "/about" },
};

const JOURNEY = [
  {
    year: "2019",
    title: "Pendirian perusahaan",
    desc: "PT KARYA SANG PRABU resmi berdiri (Akta Pendirian No. 28 Tahun 2019), memulai langkah sebagai perusahaan komoditas dan general trading nasional.",
  },
  {
    year: "Kini",
    title: "Pertumbuhan & diversifikasi",
    desc: "Mengembangkan enam lini bisnis inti serta memperluas jaringan pemasok dan kemitraan sebagai bagian dari PRIMA PRABU GROUP.",
  },
];

export default function AboutPage() {
  return (
    <SiteChrome heroTransparent>
      <PageHero
        overline="About Company"
        title="Mitra terpercaya untuk komoditas & general trading"
        description={SITE.positioning}
      />

      {/* Overview */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <img
                src="/sang-prabu/butcher.jpg"
                alt="Aktivitas usaha PT KARYA SANG PRABU"
                className="aspect-[4/3] w-full rounded-lg object-cover shadow-[0_20px_60px_-30px_rgba(11,77,33,0.5)]"
              />
            </Reveal>
            <Reveal delayMs={120}>
              <SectionHeader overline="Tentang Kami" title="Siapa PT KARYA SANG PRABU" />
              <div className="mt-5 space-y-4 text-[15px] leading-[1.8] text-brand-ink/75">
                {COMPANY_STORY.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-7">
                <SiteButton href="/business" variant="outline" withArrow>
                  Lihat Lini Bisnis
                </SiteButton>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Vision & Mission */}
      <section className="bg-brand-cream py-16 sm:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col rounded-xl border border-black/5 bg-white p-7 sm:p-8">
                <span className="flex size-11 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  <Compass className="size-6" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-brand-green-dark">
                  Visi
                </h3>
                <p className="mt-2 text-[14.5px] leading-[1.75] text-brand-ink/75">
                  {VISION}
                </p>
              </div>
            </Reveal>
            <Reveal delayMs={120}>
              <div className="flex h-full flex-col rounded-xl border border-black/5 bg-white p-7 sm:p-8">
                <span className="flex size-11 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                  <Target className="size-6" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-brand-green-dark">
                  Misi
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {MISSION.map((m) => (
                    <li key={m} className="flex gap-2.5 text-[14px] leading-[1.6] text-brand-ink/75">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-gold" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Core Values */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader align="center" overline="Our Values" title="Nilai inti perusahaan" />
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

      {/* Journey */}
      <section className="bg-brand-cream py-16 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeader
              overline="Our Journey"
              title="Perjalanan perusahaan"
              description="Tonggak penting perjalanan kami — mudah diperbarui seiring pertumbuhan."
            />
          </Reveal>
          <div className="mt-10 border-l-2 border-brand-gold/40 pl-6">
            {JOURNEY.map((j) => (
              <Reveal key={j.year} className="relative pb-8 last:pb-0">
                <span className="absolute -left-[31px] top-1 flex size-4 items-center justify-center rounded-full border-2 border-brand-gold bg-white" />
                <p className="font-display text-2xl font-semibold text-brand-green">{j.year}</p>
                <p className="mt-1 font-semibold text-brand-green-dark">{j.title}</p>
                <p className="mt-1 text-[14px] leading-[1.7] text-brand-ink/70">{j.desc}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Legality */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader
              overline="Legality"
              title="Legalitas perusahaan"
              description="PT KARYA SANG PRABU adalah badan usaha resmi dan terdaftar."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEGALITY.map((item, i) => (
              <Reveal key={item.label} delayMs={i * 60}>
                <div className="flex items-start gap-3 rounded-lg border border-black/5 bg-brand-cream/40 p-5">
                  <ScrollText className="mt-0.5 size-5 shrink-0 text-brand-gold" aria-hidden />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[14px] font-medium text-brand-green-dark">
                      {item.value}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </SiteChrome>
  );
}
