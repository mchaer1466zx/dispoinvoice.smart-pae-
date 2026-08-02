/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import { Target, Compass } from "lucide-react";
import { SiteChrome, PageHero } from "@/components/corporate/site-chrome";
import { Container, SectionHeader, SiteButton } from "@/components/corporate/ui";
import { ValueIcon } from "@/components/corporate/icon";
import { Reveal } from "@/components/reveal";
import { SITE, VALUES } from "@/lib/corporate/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tentang PT KARYA SANG PRABU — perusahaan pangan beku halal, perdagangan, dan kemitraan bisnis, bagian dari PRIMA PRABU GROUP. Visi, misi, dan nilai perusahaan.",
  alternates: { canonical: "/about" },
};

// Visi & misi bersifat editable (positioning) — sesuaikan dengan dokumen resmi.
const MISSION = [
  "Memproduksi pangan beku halal yang berkualitas, higienis, dan bergizi.",
  "Menjaga mutu dan konsistensi di setiap proses produksi dan distribusi.",
  "Membangun kemitraan bisnis yang saling menumbuhkan dan berjangka panjang.",
  "Memberikan pelayanan yang profesional, andal, dan berintegritas.",
];

const JOURNEY = [
  {
    year: "2026",
    title: "Penguatan identitas & ekspansi",
    desc: "Konsolidasi brand SANG PRABU serta pengembangan lini produk dan kemitraan sebagai bagian dari PRIMA PRABU GROUP.",
  },
];

export default function AboutPage() {
  return (
    <SiteChrome heroTransparent>
      <PageHero
        overline="About Company"
        title="Perjalanan kami membangun mutu & kepercayaan"
        description={SITE.positioning}
      />

      {/* Overview */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <img
                src="/sang-prabu/butcher.jpg"
                alt="Proses produksi PT KARYA SANG PRABU"
                className="aspect-[4/3] w-full rounded-lg object-cover shadow-[0_20px_60px_-30px_rgba(11,77,33,0.5)]"
              />
            </Reveal>
            <Reveal delayMs={120}>
              <SectionHeader
                overline="Company Overview"
                title="Siapa PT KARYA SANG PRABU"
                description="Kami adalah perusahaan yang memproduksi pangan beku halal berlabel SANG PRABU, menjalankan perdagangan dan distribusi, serta membuka kemitraan bisnis. Sebagai bagian dari PRIMA PRABU GROUP, kami berkomitmen menjadi partner bisnis yang dapat diandalkan."
              />
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
                  Menjadi perusahaan pangan dan mitra bisnis terpercaya yang dikenal
                  atas mutu, integritas, dan keunggulan — tumbuh berkelanjutan bersama
                  para mitra.
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
            <SectionHeader
              align="center"
              overline="Our Values"
              title="Nilai inti perusahaan"
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

      {/* Journey */}
      <section className="bg-brand-cream py-16 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeader
              overline="Our Journey"
              title="Perjalanan perusahaan"
              description="Tonggak penting perjalanan kami — struktur dinamis, mudah diperbarui seiring pertumbuhan."
            />
          </Reveal>
          <div className="mt-10 border-l-2 border-brand-gold/40 pl-6">
            {JOURNEY.map((j) => (
              <Reveal key={j.year} className="relative pb-8 last:pb-0">
                <span className="absolute -left-[31px] top-1 flex size-4 items-center justify-center rounded-full border-2 border-brand-gold bg-white" />
                <p className="font-display text-2xl font-semibold text-brand-green">
                  {j.year}
                </p>
                <p className="mt-1 font-semibold text-brand-green-dark">{j.title}</p>
                <p className="mt-1 text-[14px] leading-[1.7] text-brand-ink/70">{j.desc}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </SiteChrome>
  );
}
