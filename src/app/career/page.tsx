/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import { Briefcase, MapPin } from "lucide-react";
import { SiteChrome, PageHero } from "@/components/corporate/site-chrome";
import { Container, SectionHeader, SiteButton } from "@/components/corporate/ui";
import { Reveal } from "@/components/reveal";
import { CAREERS, SITE } from "@/lib/corporate/site";

export const metadata: Metadata = {
  title: "Career",
  description:
    "Berkarier bersama PT KARYA SANG PRABU. Temukan peluang, budaya kerja, dan posisi yang tersedia.",
  alternates: { canonical: "/career" },
};

export default function CareerPage() {
  return (
    <SiteChrome heroTransparent>
      <PageHero
        overline="Career"
        title="Join Our Team"
        description="Tumbuh bersama perusahaan yang mengutamakan mutu, integritas, dan kolaborasi."
      />

      {/* Culture */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <img
                src="/sang-prabu/dapur.jpg"
                alt="Suasana kerja PT KARYA SANG PRABU"
                className="aspect-[4/3] w-full rounded-lg object-cover shadow-[0_20px_60px_-30px_rgba(11,77,33,0.5)]"
              />
            </Reveal>
            <Reveal delayMs={120}>
              <SectionHeader
                overline="Life at Karya Sang Prabu"
                title="Budaya kerja kami"
                description="Kami percaya pada kerja yang profesional, saling menghormati, dan berorientasi pada mutu. Setiap orang didorong untuk bertumbuh, berkontribusi, dan menjadi bagian dari perjalanan panjang perusahaan."
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Positions */}
      <section className="bg-brand-cream py-16 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader overline="Open Positions" title="Posisi yang tersedia" />
          </Reveal>
          {CAREERS.length > 0 ? (
            <div className="mt-10 grid gap-4">
              {CAREERS.map((job) => (
                <div
                  key={job.title}
                  className="flex flex-col gap-4 rounded-lg border border-black/5 bg-white p-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-display text-lg font-semibold text-brand-green-dark">
                      {job.title}
                    </h3>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-brand-ink/65">
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="size-4 text-brand-gold" />
                        {job.department} · {job.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-4 text-brand-gold" />
                        {job.location}
                      </span>
                    </p>
                  </div>
                  <SiteButton
                    href={`/contact?subject=${encodeURIComponent("Karier")}`}
                    variant="outline"
                  >
                    Apply
                  </SiteButton>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-dashed border-black/10 bg-white px-6 py-16 text-center">
              <Briefcase className="size-8 text-brand-gold" />
              <p className="font-display text-lg font-semibold text-brand-green-dark">
                Belum ada lowongan saat ini
              </p>
              <p className="max-w-md text-[14px] leading-[1.65] text-brand-ink/65">
                Saat ini belum ada posisi yang dibuka. Anda tetap dapat mengirimkan
                minat berkarier melalui kontak kami — kami akan menyimpannya.
              </p>
              <div className="mt-2">
                <SiteButton href={SITE.whatsapp.url} variant="gold" external>
                  Kirim Minat via WhatsApp
                </SiteButton>
              </div>
            </div>
          )}
        </Container>
      </section>
    </SiteChrome>
  );
}
