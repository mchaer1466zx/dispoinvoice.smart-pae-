import type { Metadata } from "next";
import { Handshake } from "lucide-react";
import { SiteChrome, PageHero } from "@/components/corporate/site-chrome";
import { Container, SectionHeader } from "@/components/corporate/ui";
import { Reveal } from "@/components/reveal";
import { LeadForm } from "@/components/corporate/lead-form";
import { BUSINESS_TYPES, PARTNERS } from "@/lib/corporate/site";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Jadilah mitra bisnis PT KARYA SANG PRABU — distributor, reseller, atau kerja sama strategis. Ajukan kemitraan melalui formulir kami.",
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  return (
    <SiteChrome heroTransparent>
      <PageHero
        overline="Partnership"
        title="Become Our Business Partner"
        description="Kami membuka peluang kemitraan yang saling menumbuhkan — mari bangun kerja sama jangka panjang bersama PT KARYA SANG PRABU."
      />

      {/* Our Partners */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader
              overline="Our Partners"
              title="Mitra yang bertumbuh bersama kami"
              description="Kepercayaan mitra adalah bagian dari perjalanan kami."
            />
          </Reveal>
          {PARTNERS.length > 0 ? (
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {PARTNERS.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col items-center justify-center gap-2 rounded-lg border border-black/5 bg-brand-cream/40 px-4 py-8 text-center"
                >
                  <span className="font-display text-sm font-semibold text-brand-green-dark">
                    {p.name}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
                    {p.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Reveal className="mt-10">
              <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-black/10 bg-brand-cream/40 px-6 py-14 text-center">
                <Handshake className="size-8 text-brand-gold" />
                <p className="max-w-md text-[14px] leading-[1.65] text-brand-ink/70">
                  Daftar mitra resmi akan ditampilkan di sini. Ingin menjadi salah
                  satunya? Ajukan kemitraan melalui formulir di bawah.
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      {/* Form kemitraan */}
      <section className="bg-brand-cream py-16 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeader
              align="center"
              overline="Become a Partner"
              title="Ajukan Kemitraan"
              description="Ceritakan bisnis Anda — tim kami akan menindaklanjuti pengajuan kerja sama Anda."
            />
          </Reveal>
          <Reveal delayMs={120} className="mt-10">
            <div className="rounded-xl border border-black/5 bg-white p-6 sm:p-8">
              <LeadForm
                source="partner"
                select={{
                  name: "businessType",
                  label: "Jenis Bisnis",
                  options: BUSINESS_TYPES,
                }}
              />
            </div>
          </Reveal>
        </Container>
      </section>
    </SiteChrome>
  );
}
