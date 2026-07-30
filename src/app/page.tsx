import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Leaf,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { BRAND } from "@/lib/brand";

/**
 * Halaman depan publik — brand makanan SANG PRABU (PT Karya Sang Prabu),
 * gabung dengan penyebutan naungan PRIMA PRABU GROUP. Gaya food-brand:
 * foto asli full-bleed, hijau + emas, wordmark regal (Prabu = raja).
 *
 * Skala tipografi (strict): overline 11px/0.2em · body 15→17px/1.65 ·
 * judul seksi 32→44px · wordmark 52→96px/0.95 · -0.02em.
 */
const PRODUCTS = [
  {
    img: "/sang-prabu/bakso.jpg",
    name: "Bakso Sang Prabu",
    desc: "Kenyal, padat daging, kaldunya nendang.",
  },
  {
    img: "/sang-prabu/otak-otak.jpg",
    name: "Otak-otak Sang Prabu",
    desc: "Ikan pilihan, gurih, digoreng renyah.",
  },
  {
    img: "/sang-prabu/dimsum.jpg",
    name: "Dimsum Sang Prabu",
    desc: "Siomay lembut, isian padat, matang kukus.",
  },
  {
    img: "/sang-prabu/daging-ayam.jpg",
    name: "Daging Ayam",
    desc: "Frozen · halal · higienis — sehat & bergizi.",
  },
  {
    img: "/sang-prabu/daging-sapi.jpg",
    name: "Daging Sapi",
    desc: "Frozen · halal · higienis — sehat & bergizi.",
  },
  {
    img: "/sang-prabu/karkas.jpg",
    name: "Daging Karkas Halal",
    desc: "Karkas ayam beku, potong higienis, siap distribusi.",
  },
] as const;

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Halal",
    desc: "Disembelih & diproses sesuai syariat Islam.",
  },
  {
    icon: Sparkles,
    title: "Higienis",
    desc: "Rumah potong bersih, standar keamanan pangan.",
  },
  {
    icon: Leaf,
    title: "Tanpa Pengawet Berlebih",
    desc: "Bahan segar, cita rasa asli tetap terjaga.",
  },
  {
    icon: Snowflake,
    title: "Rantai Dingin",
    desc: "Cold storage menjaga kesegaran sampai tujuan.",
  },
] as const;

// Kontak WhatsApp untuk ajakan kemitraan (0889 3663 031 → format internasional).
const WA_URL = `https://wa.me/628893663031?text=${encodeURIComponent(
  "Halo SANG PRABU, saya tertarik menjadi mitra/distributor. Boleh info produk & kerja samanya?",
)}`;

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col scroll-smooth bg-[#fbf8f1] font-jakarta text-[#23271f]">
      {/* ============ HERO ============ */}
      <section className="relative isolate flex min-h-[86vh] flex-col justify-center overflow-hidden">
        {/* Foto bakso + overlay hijau */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sang-prabu/hero-bakso.jpg"
          alt="Bakso Sang Prabu"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,51,26,0.72) 0%, rgba(6,51,26,0.66) 40%, rgba(6,51,26,0.88) 100%)",
          }}
          aria-hidden
        />

        <div className="mx-auto w-full max-w-4xl px-6 py-20 text-center text-white sm:px-10 sm:py-28">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sang-prabu/emblem.png"
              alt="Lambang Sang Prabu"
              className="mx-auto h-24 w-auto object-contain drop-shadow-[0_4px_16px_rgba(201,162,76,0.28)] sm:h-28"
            />
          </Reveal>

          <Reveal delayMs={90} className="mt-7">
            <h1 className="font-display text-[3.25rem] font-semibold leading-[0.95] tracking-[-0.02em] sm:text-[6rem]">
              SANG PRABU
            </h1>
          </Reveal>

          <Reveal delayMs={150} className="mt-4">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-gold sm:text-sm">
              Karya Sang Prabu 2026
            </p>
          </Reveal>

          <Reveal delayMs={210} className="mt-6">
            <p className="mx-auto max-w-xl text-[15px] leading-[1.65] text-white/80 sm:text-lg">
              Bakso, Otak-otak & Dimsum halal — cita rasa nusantara dengan mutu
              yang dijaga, dari dapur Sang Prabu ke meja Anda.
            </p>
          </Reveal>

          {/* Badge Halal + naungan grup */}
          <Reveal delayMs={270} className="mt-7">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-gold ring-1 ring-gold/40">
                <ShieldCheck className="size-3.5" /> Halal
              </span>
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70 ring-1 ring-white/20">
                Bagian dari Prima Prabu Group
              </span>
            </div>
          </Reveal>

          <Reveal delayMs={330} className="mt-9">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                asChild
                className="bg-gold text-[#3a2c05] transition-colors duration-200 ease-out hover:bg-gold-bright"
              >
                <Link href="#produk">
                  Lihat Produk <ArrowRight />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/25 bg-transparent text-white transition-colors duration-200 ease-out hover:bg-white/10 hover:text-white"
              >
                <Link href="/login">Masuk ke Sistem</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ PRODUK ============ */}
      <section id="produk" className="scroll-mt-20 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/70">
                  Produk Unggulan
                </p>
                <h2 className="mt-3 font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.015em] text-primary sm:text-[2.75rem]">
                  Sajian andalan Sang Prabu
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.name} delayMs={i * 80}>
                <article className="group h-full overflow-hidden rounded-2xl border border-[#e6e0d2] bg-white shadow-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-md">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 h-1 w-8 rounded-full bg-gold" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-[1.25rem] font-semibold leading-[1.2] text-[#23271f]">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.6] text-[#6e736a]">
                      {p.desc}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ NILAI ============ */}
      <section className="bg-primary px-6 py-20 text-white sm:px-10 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-center font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
              Kenapa Sang Prabu
            </p>
          </Reveal>
          <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delayMs={i * 80}>
                <div className="flex flex-col items-start">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-inset ring-gold/30">
                    <v.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-[1.25rem] font-semibold leading-[1.2]">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.6] text-white/70">
                    {v.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CERITA ============ */}
      <section className="px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/70">
              Dari Dapur Sang Prabu
            </p>
            <h2 className="mt-3 font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.015em] text-primary sm:text-[2.75rem]">
              Diproses sendiri, dari hulu ke hilir
            </h2>
            <p className="mt-5 text-[15px] leading-[1.7] text-[#4a4f46] sm:text-[17px]">
              Sang Prabu mengolah daging pilihan di rumah potong sendiri —
              disembelih secara halal, dibersihkan higienis, lalu diolah menjadi
              bakso, otak-otak, dan dimsum. Setiap tahap dijaga rantai dinginnya
              agar mutu dan kesegaran sampai utuh ke tangan Anda.
            </p>
            <div className="mt-7">
              <Button
                asChild
                className="bg-primary text-white transition-colors duration-200 ease-out hover:bg-primary/90"
              >
                <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                  <Store /> Jadi Mitra / Distributor
                </a>
              </Button>
            </div>
          </Reveal>
          <Reveal delayMs={120} className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-2xl border border-[#e6e0d2] shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sang-prabu/dapur.jpg"
                alt="Proses produksi di dapur Sang Prabu"
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ NAUNGAN GRUP ============ */}
      <section className="bg-[#06331a] px-6 py-16 text-white sm:px-10 sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/80">
              Bagian dari
            </p>
            <h2 className="mt-3 font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.01em] sm:text-[2.25rem]">
              {BRAND.groupName}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[14px] leading-[1.65] text-white/65 sm:text-[15px]">
              SANG PRABU adalah brand makanan dari PT Karya Sang Prabu — satu
              dari tiga perusahaan di bawah naungan {BRAND.groupName}.
            </p>
          </Reveal>
          <Reveal delayMs={120}>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {BRAND.groupMembers.map((m) => (
                <div
                  key={m}
                  className="rounded-xl border border-white/12 bg-white/5 px-4 py-4 font-mono text-[12px] uppercase leading-[1.4] tracking-[0.1em] text-white/75"
                >
                  {m}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delayMs={200}>
            <div className="mt-8 flex justify-center">
              <Button
                asChild
                className="bg-gold text-[#3a2c05] transition-colors duration-200 ease-out hover:bg-gold-bright"
              >
                <Link href="/company-profile">
                  <FileText /> Lihat Company Profile
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#fbf8f1] px-6 py-12 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sang-prabu/logo-text.jpg"
            alt="SANG PRABU"
            className="h-16 w-auto object-contain mix-blend-multiply"
          />
          <p className="font-mono text-[11px] uppercase leading-[1.6] tracking-[0.14em] text-[#6e736a]">
            PT Karya Sang Prabu · {BRAND.groupName}
          </p>
          <p className="text-[12px] text-[#9a9e94]">
            © 2026 SANG PRABU — Karya Sang Prabu. Halal, higienis, terpercaya.
          </p>
        </div>
      </footer>
    </div>
  );
}
