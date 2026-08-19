import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Building2, CheckCircle2, Clock, MapPin, Send, Sparkles } from "lucide-react";
import { SiteChrome, PageHero } from "@/components/corporate/site-chrome";
import { Container, SectionHeader } from "@/components/corporate/ui";
import { Reveal } from "@/components/reveal";
import { CAREERS, SITE } from "@/lib/corporate/site";

export const metadata: Metadata = {
  title: "Karier & Lapangan Pekerjaan — Prima Prabu Group",
  description:
    "Lowongan pekerjaan dan kesempatan berkarier di PT Karya Sang Prabu dan PT Prima Andalas Energi (Site 2 Pilot Facility). Bergabung bersama tim profesional komoditas dan manufaktur pangan.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <SiteChrome heroTransparent>
      <PageHero
        overline="Karier & Peluang Kerja"
        title="Bergabung Bersama Prima Prabu Group"
        description="Membangun masa depan industri rantai pasok komoditas nasional dan fasilitas manufaktur pangan modern berstandar higienis & halal."
      />

      {/* Nilai Budaya Kerja */}
      <section className="border-b border-black/5 bg-white py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeader
              align="center"
              overline="Work Culture"
              title="Mengapa Berkarier Bersama Kami?"
              description="Kami mengedepankan integritas, keselamatan kerja, pengembangan kompetensi teknis, serta jenjang karier yang terstruktur."
            />
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal delayMs={60}>
              <div className="rounded-xl border border-black/5 bg-emerald-50/50 p-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                  Standar Industri &amp; Sertifikasi
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">
                  Penerapan ketat standar HACCP, GMP, dan Sistem Jaminan Produk Halal (SJPH) membekali Anda dengan keahlian teknis bernilai tinggi.
                </p>
              </div>
            </Reveal>

            <Reveal delayMs={120}>
              <div className="rounded-xl border border-black/5 bg-amber-50/50 p-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold">
                  <Building2 className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                  Ekspansi Fasilitas Site 2 &amp; Site 1
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">
                  Menjadi bagian awal dari pengembangan pabrik pilot Site 2 menuju skala industri 100+ ton/bulan di Site 1 pada tahun 2027.
                </p>
              </div>
            </Reveal>

            <Reveal delayMs={180}>
              <div className="rounded-xl border border-black/5 bg-emerald-50/50 p-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-800 text-white font-bold">
                  <Briefcase className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                  Kompensasi &amp; Lingkungan Sehat
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">
                  Paket remunerasi kompetitif, insentif performa, perlindungan kerja, serta ekosistem kerja yang profesional dan saling mendukung.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Daftar Lowongan Pekerjaan Terbuka */}
      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-700">
                Open Positions
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                Lowongan Lapangan Pekerjaan Terbuka
              </h2>
            </div>
            <p className="text-sm text-slate-600 font-medium">
              Menampilkan {CAREERS.length} posisi aktif untuk periode rekrutmen Q3–Q4 2026
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {CAREERS.map((job, idx) => (
              <Reveal key={job.title} delayMs={idx * 60}>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs transition-all hover:border-amber-400 hover:shadow-md">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        {job.department}
                      </span>
                      <h3 className="mt-3 font-display text-xl sm:text-2xl font-bold text-slate-900">
                        {job.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-4 text-amber-600" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-4 text-emerald-600" />
                          {job.type}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${SITE.whatsapp.number}?text=${encodeURIComponent(
                        `Halo HRD Prima Prabu Group, saya ingin melamar untuk posisi: ${job.title}. Mohon informasi pengiriman berkas CV dan portofolio.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm transition-transform hover:scale-[1.02]"
                    >
                      <Send className="size-4" />
                      Lamar via WhatsApp HRD
                    </a>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <p className="text-sm leading-relaxed text-slate-700 font-medium">
                      {job.description}
                    </p>

                    <h4 className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-900">
                      Kualifikasi &amp; Persyaratan:
                    </h4>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-xs leading-relaxed text-slate-600">
                      {job.requirements.map((req, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Form Kirim Lamaran Terbuka / CV Dropzone */}
          <Reveal delayMs={240} className="mt-12">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-bold text-amber-300">
                  Talent Network &amp; Magang
                </span>
                <h3 className="mt-4 font-display text-2xl sm:text-3xl font-bold">
                  Tidak menemukan posisi yang sesuai?
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-emerald-100/80">
                  Kirimkan CV dan portofolio Anda ke bank data rekrutmen kami. Kami akan menghubungi Anda saat ada posisi baru yang cocok di unit bisnis komoditas atau fasilitas manufaktur makanan.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href={`mailto:${SITE.email}?subject=${encodeURIComponent(
                      "Lamaran Terbuka — [Nama Lengkap] — [Keahlian / Posisi]",
                    )}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-900 hover:bg-slate-100"
                  >
                    Kirim CV via Email Resmi
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10"
                  >
                    Hubungi HRD Kami
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </SiteChrome>
  );
}
