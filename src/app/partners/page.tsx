import type { Metadata } from "next";
import { Handshake } from "lucide-react";
import { SiteChrome, PageHero } from "@/components/corporate/site-chrome";
import { Container, SectionHeader } from "@/components/corporate/ui";
import { Reveal } from "@/components/reveal";
import { LeadForm } from "@/components/corporate/lead-form";
import { ValueIcon } from "@/components/corporate/icon";
import { BUSINESS_TYPES, PARTNERS, WHY_US } from "@/lib/corporate/site";

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

      {/* Mengapa bermitra (Our Advantages) */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader
              align="center"
              overline="Why Partner Us"
              title="Mengapa bermitra dengan kami"
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((adv, i) => (
              <Reveal key={adv.title} delayMs={i * 60}>
                <div className="flex h-full items-start gap-4 rounded-lg border border-black/5 bg-brand-cream/40 p-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                    <ValueIcon name={adv.icon} className="size-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-[15px] font-semibold text-brand-green-dark">
                      {adv.title}
                    </h3>
                    <p className="mt-1 text-[13px] leading-[1.6] text-brand-ink/65">
                      {adv.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Clients */}
      <section className="bg-brand-cream py-16 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader
              overline="Our Clients"
              title="Dipercaya oleh berbagai mitra & klien"
              description="Sebagian klien dan mitra kerja sama yang telah mempercayakan kebutuhan mereka kepada kami."
            />
          </Reveal>
          {PARTNERS.length > 0 ? (
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PARTNERS.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-3 rounded-lg border border-black/5 bg-white px-4 py-3.5"
                >
                  <span className="size-2 shrink-0 rounded-full bg-brand-gold" />
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-medium text-brand-green-dark">
                      {p.name}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-brand-gold">
                      {p.category}
                    </span>
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
