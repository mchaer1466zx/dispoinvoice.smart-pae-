import type { Metadata } from "next";
import { AtSign, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteChrome, PageHero } from "@/components/corporate/site-chrome";
import { Container } from "@/components/corporate/ui";
import { Reveal } from "@/components/reveal";
import { LeadForm } from "@/components/corporate/lead-form";
import { CONTACT_SUBJECTS, SITE } from "@/lib/corporate/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Hubungi PT KARYA SANG PRABU — alamat, telepon, email, dan WhatsApp. Kirimkan pertanyaan atau ajukan kerja sama melalui formulir kontak kami.",
  alternates: { canonical: "/contact" },
};

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  "Jl. Pertanian Raya No. 64, Lebak Bulus, Cilandak, Jakarta Selatan 12440",
)}&output=embed`;

export default function ContactPage() {
  return (
    <SiteChrome heroTransparent>
      <PageHero
        overline="Contact"
        title="Mari terhubung dengan kami"
        description="Kami siap membantu pertanyaan seputar produk, kerja sama, maupun kemitraan bisnis."
      />
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
            {/* Info kontak */}
            <Reveal>
              <div className="flex flex-col gap-5">
                <h2 className="font-display text-2xl font-semibold text-brand-green-dark">
                  {SITE.legalName}
                </h2>
                <ul className="space-y-4 text-[14px] text-brand-ink/80">
                  <ContactRow icon={<MapPin className="size-5" />} label="Alamat">
                    {SITE.address.line}
                  </ContactRow>
                  <ContactRow icon={<Phone className="size-5" />} label="Telepon">
                    <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-brand-green">
                      {SITE.phone}
                    </a>
                  </ContactRow>
                  <ContactRow icon={<Mail className="size-5" />} label="Email">
                    <a href={`mailto:${SITE.email}`} className="hover:text-brand-green">
                      {SITE.email}
                    </a>
                  </ContactRow>
                  <ContactRow icon={<MessageCircle className="size-5" />} label="WhatsApp">
                    <a
                      href={SITE.whatsapp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-green"
                    >
                      {SITE.whatsapp.display}
                    </a>
                  </ContactRow>
                  {SITE.socials.map((s) => (
                    <ContactRow key={s.href} icon={<AtSign className="size-5" />} label={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-green"
                      >
                        {s.handle}
                      </a>
                    </ContactRow>
                  ))}
                  <ContactRow icon={<Clock className="size-5" />} label="Jam Operasional">
                    {SITE.businessHours}
                  </ContactRow>
                </ul>
                <div className="overflow-hidden rounded-lg border border-black/10">
                  <iframe
                    title="Peta lokasi PT KARYA SANG PRABU"
                    src={mapSrc}
                    className="h-64 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delayMs={120}>
              <div className="rounded-xl border border-black/5 bg-brand-cream/40 p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold text-brand-green-dark">
                  Kirim Pesan
                </h2>
                <p className="mt-1 text-[13.5px] text-brand-ink/65">
                  Isi formulir di bawah — kami akan menindaklanjuti secepatnya.
                </p>
                <div className="mt-6">
                  <LeadForm
                    source="contact"
                    select={{
                      name: "subject",
                      label: "Subjek",
                      options: CONTACT_SUBJECTS,
                    }}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </SiteChrome>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3.5">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
          {label}
        </span>
        <span className="mt-0.5">{children}</span>
      </span>
    </li>
  );
}
