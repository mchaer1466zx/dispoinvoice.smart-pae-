import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Building2,
  CheckCircle2,
  Factory,
  Globe,
  AtSign,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { BRAND } from "@/lib/brand";

/**
 * Profil Perusahaan PUBLIK — PT KARYA SANG PRABU (produsen frozen food).
 * Company Profile 2026, versi publik: TANPA data rahasia (proyeksi keuangan,
 * investasi, ROI, risiko) — bagian itu disiapkan sebagai dokumen investor
 * terpisah. Desain senada brand SANG PRABU (krem · hijau · emas).
 */
export const metadata: Metadata = {
  title: "Profil Perusahaan",
  description:
    "PT Karya Sang Prabu — produsen frozen food premium Indonesia (bakso, dimsum, otak-otak). Company Profile 2026.",
};

const KONTAK = {
  alamat: "Jl. Pertanian Raya No. 64, Lebak Bulus, Cilandak, Jakarta Selatan 12440",
  telepon: "(021) 2784 1924",
  email: "ptkaryasangprabu@gmail.com",
  website: "www.karyasangprabu.com",
  instagram: "@karyasangprabu.group",
};

const PERJALANAN = [
  { th: "2000", d: "Awal pengembangan resep makanan olahan premium." },
  { th: "2010", d: "Penyempurnaan formula dan proses produksi." },
  { th: "2020", d: "Pengembangan jaringan distribusi dan pemasaran." },
  { th: "2026", d: "Pendirian PT Karya Sang Prabu sebagai badan usaha resmi." },
  { th: "2027", d: "Target pengembangan kapasitas produksi nasional." },
];

const NILAI = [
  {
    k: "Quality",
    d: "Produk dengan standar mutu terbaik — bahan baku berkualitas, proses higienis, dan pengawasan mutu yang konsisten.",
  },
  {
    k: "Integrity",
    d: "Bisnis yang jujur dan bertanggung jawab, membangun kepercayaan lewat tata kelola yang profesional.",
  },
  {
    k: "Excellence",
    d: "Inovasi dan peningkatan kualitas berkelanjutan untuk memberi nilai tambah bagi pelanggan dan mitra.",
  },
];

const MISI = [
  "Menghasilkan produk pangan berkualitas premium.",
  "Mengutamakan keamanan pangan dan kepuasan pelanggan.",
  "Mengembangkan inovasi produk secara berkelanjutan.",
  "Membangun kemitraan yang saling menguntungkan.",
  "Menjalankan bisnis secara profesional, transparan, dan berintegritas.",
  "Meningkatkan nilai perusahaan secara berkelanjutan.",
];

const PRODUK = [
  {
    img: "/sang-prabu/bakso.jpg",
    kat: "Bakso Premium",
    items: ["Bakso Sapi Premium", "Bakso Urat", "Bakso Ayam", "Bakso Super"],
  },
  {
    img: "/sang-prabu/dimsum.jpg",
    kat: "Dimsum",
    items: ["Siomay Ayam", "Hakau", "Lumpia Udang", "Dimsum Premium"],
  },
  {
    img: "/sang-prabu/otak-otak.jpg",
    kat: "Otak-otak",
    items: ["Otak-otak Ikan", "Otak-otak Premium"],
  },
  {
    img: "/sang-prabu/karkas.jpg",
    kat: "Inovasi & Karkas",
    items: ["Ayam Marinasi", "Nugget Premium", "Daging Karkas Halal", "OEM / Private Label"],
  },
];

const BIDANG = [
  "Industri pengolahan frozen food (bakso, dimsum, otak-otak, olahan daging).",
  "Perdagangan besar bahan pangan.",
  "Distribusi nasional melalui jaringan mitra.",
  "Layanan OEM (Original Equipment Manufacturer).",
  "Private label untuk kebutuhan pelanggan korporasi.",
  "Pengembangan produk inovatif sesuai tren pasar.",
];

const ALUR = [
  "Penerimaan Bahan Baku",
  "Pemeriksaan Mutu",
  "Penyimpanan Dingin",
  "Persiapan Bahan",
  "Mixing",
  "Forming",
  "Cooking",
  "Cooling",
  "Packaging",
  "Metal Detection",
  "Cold Storage",
  "Distribusi",
];

const STANDAR = [
  "HACCP",
  "GMP (Good Manufacturing Practices)",
  "SSOP (Sanitation SOP)",
  "Halal Assurance System",
  "Cold Chain Management",
  "Traceability Product",
];

const KEUNGGULAN = [
  { t: "Pengalaman Resep", d: "Lebih dari 25 tahun pengembangan cita rasa sejak tahun 2000." },
  { t: "Kualitas Premium", d: "Bahan baku terbaik dengan proses produksi terstandarisasi." },
  { t: "Produksi Modern", d: "Fasilitas dengan konsep One-Way Production Flow." },
  { t: "Distribusi Nasional", d: "Didukung jaringan distribusi yang terus berkembang." },
  { t: "Inovasi Berkelanjutan", d: "Pengembangan produk sesuai kebutuhan pasar." },
  { t: "Kemitraan Strategis", d: "Terbuka untuk distributor, retail, HORECA, dan mitra usaha." },
];

const ROADMAP = [
  { th: "2026", d: "Pendirian perusahaan, persiapan fasilitas & pengadaan mesin." },
  { th: "2027", d: "Produksi komersial dan ekspansi distribusi Jabodetabek." },
  { th: "2028", d: "Distribusi Pulau Jawa dan penambahan kapasitas produksi." },
  { th: "2029", d: "Distribusi nasional serta pengembangan OEM & private label." },
  { th: "2030–2032", d: "Ekspansi ekspor, lini produk baru, dan penguatan merek nasional." },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/70">
      {children}
    </p>
  );
}

export default function ProfilPerusahaanPage() {
  return (
    <div className="flex flex-1 flex-col bg-[#fbf8f1] font-jakarta text-[#23271f]">
      {/* ===== COVER ===== */}
      <section className="relative isolate overflow-hidden bg-[#06331a] px-6 py-20 text-center text-white sm:px-10 sm:py-28">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] max-w-[92vw] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #c9a24c55, transparent)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sang-prabu/emblem.png"
              alt="Lambang Sang Prabu"
              className="mx-auto h-24 w-auto object-contain drop-shadow-[0_4px_16px_rgba(201,162,76,0.28)] sm:h-28"
            />
          </Reveal>
          <Reveal delayMs={90} className="mt-6">
            <h1 className="font-display text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[3.5rem]">
              PT Karya Sang Prabu
            </h1>
          </Reveal>
          <Reveal delayMs={150} className="mt-4">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-gold sm:text-sm">
              Quality • Integrity • Excellence
            </p>
          </Reveal>
          <Reveal delayMs={210} className="mt-6">
            <p className="mx-auto max-w-xl text-[15px] leading-[1.7] text-white/80 sm:text-lg">
              Produsen frozen food premium Indonesia — menghadirkan produk pangan
              berkualitas untuk Indonesia dan pasar global.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
              Company Profile 2026
            </p>
          </Reveal>
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl px-6 sm:px-10">
        {/* ===== SAMBUTAN ===== */}
        <Section>
          <Reveal>
            <SectionLabel>Sambutan Direktur</SectionLabel>
            <h2 className="mt-3 max-w-3xl font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.015em] text-primary sm:text-[2.5rem]">
              Membangun masa depan industri frozen food Indonesia
            </h2>
            <div className="mt-6 max-w-3xl space-y-4 text-[15px] leading-[1.75] text-[#4a4f46] sm:text-[16px]">
              <p>
                PT Karya Sang Prabu hadir dengan komitmen menghadirkan produk
                makanan beku premium yang aman, halal, dan bercita rasa terbaik.
                Berbekal pengalaman pengembangan resep sejak tahun 2000, kami
                memadukan keahlian tradisional dengan teknologi produksi modern.
              </p>
              <p>
                Perusahaan dibangun di atas fondasi Quality, Integrity, dan
                Excellence — pedoman dalam setiap proses, dari pemilihan bahan
                baku, produksi, distribusi, hingga pelayanan pelanggan.
              </p>
              <p>
                Kami percaya pertumbuhan hanya dapat dicapai melalui kemitraan
                yang kuat, inovasi berkelanjutan, dan kepercayaan pelanggan.
                Kami membuka peluang kerja sama untuk bersama membangun industri
                pangan Indonesia yang lebih maju dan berdaya saing.
              </p>
            </div>
          </Reveal>
        </Section>

        {/* ===== TENTANG + INFO ===== */}
        <Section>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <SectionLabel>Tentang Perusahaan</SectionLabel>
              <h2 className="mt-3 font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.015em] text-primary sm:text-[2.25rem]">
                Perusahaan pangan nasional
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[#4a4f46] sm:text-[16px]">
                PT Karya Sang Prabu bergerak di bidang industri pengolahan
                makanan beku (frozen food manufacturing) serta perdagangan dan
                distribusi produk pangan. Berbekal pengalaman resep sejak tahun
                2000 dan resmi berdiri pada 2026, kami berkomitmen menghasilkan
                produk berkualitas tinggi dengan standar keamanan pangan ketat.
              </p>
            </Reveal>
            <Reveal delayMs={120}>
              <dl className="rounded-2xl border border-[#e6e0d2] bg-white p-6 shadow-sm">
                <InfoRow label="Nama Perusahaan" value="PT Karya Sang Prabu" />
                <InfoRow label="Kantor Pusat" value={KONTAK.alamat} />
                <InfoRow
                  label="Bidang Usaha"
                  value="Industri frozen food · Perdagangan besar · Distribusi nasional · OEM & private label"
                />
                <InfoRow label="Motto" value="Quality • Integrity • Excellence" last />
              </dl>
            </Reveal>
          </div>
        </Section>

        {/* ===== PERJALANAN ===== */}
        <Section>
          <Reveal>
            <SectionLabel>Perjalanan Perusahaan</SectionLabel>
            <h2 className="mt-3 font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.015em] text-primary sm:text-[2.25rem]">
              Dari resep menjadi perusahaan
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PERJALANAN.map((p, i) => (
              <Reveal key={p.th} delayMs={i * 70}>
                <div className="h-full rounded-xl border border-t-2 border-[#e6e0d2] border-t-gold bg-white p-5 shadow-sm">
                  <p className="font-mono text-[1.5rem] font-semibold text-primary">
                    {p.th}
                  </p>
                  <p className="mt-2 text-[13px] leading-[1.55] text-[#6e736a]">
                    {p.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ===== VISI & MISI ===== */}
        <Section>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <div className="h-full rounded-2xl bg-primary p-8 text-white">
                <span className="flex size-11 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-inset ring-gold/30">
                  <Target className="size-5" />
                </span>
                <h2 className="mt-5 font-display text-[1.5rem] font-semibold sm:text-[1.75rem]">
                  Visi
                </h2>
                <p className="mt-3 text-[15px] leading-[1.7] text-white/80">
                  Menjadi perusahaan pengolahan makanan beku terkemuka di
                  Indonesia yang menghasilkan produk berkualitas tinggi, aman,
                  halal, inovatif, dan mampu bersaing di pasar nasional maupun
                  internasional.
                </p>
              </div>
            </Reveal>
            <Reveal delayMs={120}>
              <div className="h-full rounded-2xl border border-[#e6e0d2] bg-white p-8 shadow-sm">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-gold/20">
                  <Sparkles className="size-5" />
                </span>
                <h2 className="mt-5 font-display text-[1.5rem] font-semibold text-primary sm:text-[1.75rem]">
                  Misi
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {MISI.map((m) => (
                    <li key={m} className="flex gap-2.5 text-[14px] leading-[1.6] text-[#4a4f46]">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ===== NILAI ===== */}
        <Section>
          <Reveal>
            <SectionLabel>Nilai Perusahaan</SectionLabel>
          </Reveal>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {NILAI.map((n, i) => (
              <Reveal key={n.k} delayMs={i * 80}>
                <div className="h-full rounded-2xl border border-[#e6e0d2] bg-white p-6 shadow-sm">
                  <p className="font-display text-[1.5rem] font-semibold text-primary">
                    {n.k}
                  </p>
                  <span className="mt-3 block h-1 w-10 rounded-full bg-gold" />
                  <p className="mt-4 text-[14px] leading-[1.65] text-[#6e736a]">
                    {n.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ===== PRODUK ===== */}
        <Section>
          <Reveal>
            <SectionLabel>Produk Unggulan</SectionLabel>
            <h2 className="mt-3 font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.015em] text-primary sm:text-[2.25rem]">
              Cita rasa autentik, mutu terjaga
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUK.map((p, i) => (
              <Reveal key={p.kat} delayMs={i * 70}>
                <article className="h-full overflow-hidden rounded-2xl border border-[#e6e0d2] bg-white shadow-sm">
                  <div className="aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.img}
                      alt={p.kat}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-[1.15rem] font-semibold text-[#23271f]">
                      {p.kat}
                    </h3>
                    <ul className="mt-2 space-y-1 text-[13px] leading-[1.55] text-[#6e736a]">
                      {p.items.map((it) => (
                        <li key={it}>· {it}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ===== BIDANG USAHA ===== */}
        <Section>
          <Reveal>
            <SectionLabel>Bidang Usaha</SectionLabel>
          </Reveal>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {BIDANG.map((b, i) => (
              <Reveal key={b} delayMs={i * 50}>
                <div className="flex h-full items-start gap-3 rounded-xl border border-[#e6e0d2] bg-white p-4 shadow-sm">
                  <Building2 className="mt-0.5 size-4 shrink-0 text-gold" />
                  <p className="text-[14px] leading-[1.6] text-[#4a4f46]">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      </main>

      {/* ===== FASILITAS (full-bleed hijau) ===== */}
      <section className="mt-8 bg-primary px-6 py-20 text-white sm:px-10 sm:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
              Fasilitas Produksi
            </p>
            <h2 className="mt-3 font-display text-[1.75rem] font-semibold leading-[1.15] sm:text-[2.25rem]">
              Pabrik modern, standar industri
            </h2>
            <p className="mt-5 text-[15px] leading-[1.7] text-white/80">
              Dirancang dengan konsep One-Way Production Flow untuk meminimalkan
              kontaminasi silang dan meningkatkan efisiensi — dari receiving,
              cold storage, mixing, forming, cooking, hingga cold storage produk
              jadi dan loading dock.
            </p>
            <div className="mt-7 flex flex-wrap gap-6">
              <Stat value="±1.600 m²" label="Luas fasilitas" />
              <Stat value="3 ton/hari" label="Kapasitas saat ini" />
              <Stat value="5–7 ton/hari" label="Target kapasitas" />
            </div>
          </Reveal>
          <Reveal delayMs={120}>
            <div className="overflow-hidden rounded-2xl ring-1 ring-white/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sang-prabu/dapur.jpg"
                alt="Fasilitas produksi Sang Prabu"
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>

        {/* Alur produksi */}
        <div className="mx-auto mt-14 max-w-5xl">
          <Reveal>
            <p className="text-center font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Alur Produksi · One-Way Flow
            </p>
          </Reveal>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {ALUR.map((a, i) => (
              <Reveal key={a} delayMs={i * 40}>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-[12px] text-white/80">
                  <span className="font-mono text-[10px] font-semibold text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {a}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl px-6 sm:px-10">
        {/* ===== QUALITY & STANDAR ===== */}
        <Section>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <SectionLabel>Quality Assurance</SectionLabel>
              <h2 className="mt-3 font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.015em] text-primary sm:text-[2.25rem]">
                Mutu dijaga di setiap tahap
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[#4a4f46]">
                Pengendalian mutu menyeluruh — dari Incoming Quality Control
                (bahan baku, suhu, kemasan), In-Process QC (berat, konsistensi
                adonan, suhu proses, kebersihan), hingga Finished Goods Inspection
                (berat, kemasan, label, tanggal kedaluwarsa, penyimpanan).
              </p>
              <p className="mt-4 rounded-xl border-l-2 border-gold bg-white p-4 text-[14px] italic leading-[1.6] text-[#4a4f46] shadow-sm">
                &ldquo;Kualitas bukan hanya standar kerja, tetapi budaya
                perusahaan.&rdquo;
              </p>
            </Reveal>
            <Reveal delayMs={120}>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/70">
                Standar Mutu
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {STANDAR.map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-2.5 rounded-xl border border-[#e6e0d2] bg-white p-4 text-[13px] font-medium text-[#4a4f46] shadow-sm"
                  >
                    <ShieldCheck className="size-4 shrink-0 text-primary" />
                    {s}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ===== PASAR ===== */}
        <Section>
          <Reveal>
            <SectionLabel>Analisis Pasar</SectionLabel>
            <h2 className="mt-3 font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.015em] text-primary sm:text-[2.25rem]">
              Industri frozen food yang tumbuh
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <Reveal>
              <div className="h-full rounded-2xl border border-t-2 border-[#e6e0d2] border-t-gold bg-white p-6 shadow-sm">
                <p className="font-display text-[1.75rem] font-semibold text-primary">
                  &gt; Rp50 T
                </p>
                <p className="mt-1 text-[13px] text-[#6e736a]">
                  Nilai pasar industri per tahun (nasional).
                </p>
              </div>
            </Reveal>
            <Reveal delayMs={80}>
              <div className="h-full rounded-2xl border border-t-2 border-[#e6e0d2] border-t-gold bg-white p-6 shadow-sm">
                <p className="font-display text-[1.75rem] font-semibold text-primary">
                  12–15%
                </p>
                <p className="mt-1 text-[13px] text-[#6e736a]">
                  Estimasi pertumbuhan industri per tahun.
                </p>
              </div>
            </Reveal>
            <Reveal delayMs={160}>
              <div className="h-full rounded-2xl border border-t-2 border-[#e6e0d2] border-t-gold bg-white p-6 shadow-sm">
                <p className="font-display text-[1.05rem] font-semibold leading-[1.4] text-primary">
                  HORECA · Modern Trade · Pasar Tradisional · B2B
                </p>
                <p className="mt-1 text-[13px] text-[#6e736a]">
                  Segmen pelanggan yang dilayani.
                </p>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ===== KEUNGGULAN ===== */}
        <Section>
          <Reveal>
            <SectionLabel>Keunggulan Kompetitif</SectionLabel>
            <h2 className="mt-3 font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.015em] text-primary sm:text-[2.25rem]">
              Mengapa memilih Karya Sang Prabu
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {KEUNGGULAN.map((k, i) => (
              <Reveal key={k.t} delayMs={i * 60}>
                <div className="h-full rounded-2xl border border-[#e6e0d2] bg-white p-6 shadow-sm">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-gold/20">
                    <Award className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-[1.15rem] font-semibold text-[#23271f]">
                    {k.t}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.6] text-[#6e736a]">
                    {k.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ===== ROADMAP ===== */}
        <Section>
          <Reveal>
            <SectionLabel>Roadmap Pengembangan</SectionLabel>
          </Reveal>
          <div className="mt-6 space-y-3">
            {ROADMAP.map((r, i) => (
              <Reveal key={r.th} delayMs={i * 60}>
                <div className="flex items-start gap-5 rounded-xl border border-[#e6e0d2] bg-white p-5 shadow-sm">
                  <span className="font-mono text-[1.1rem] font-semibold text-primary">
                    {r.th}
                  </span>
                  <span className="mt-1 h-px flex-1 self-center bg-gold/25" aria-hidden />
                  <p className="max-w-md text-[14px] leading-[1.6] text-[#4a4f46]">
                    {r.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      </main>

      {/* ===== KONTAK (footer hijau) ===== */}
      <section className="mt-8 bg-[#06331a] px-6 py-16 text-white sm:px-10 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/80">
              Informasi Perusahaan
            </p>
            <h2 className="mt-3 font-display text-[1.75rem] font-semibold leading-[1.15] sm:text-[2.25rem]">
              Mari tumbuh bersama
            </h2>
            <p className="mt-3 max-w-xl text-[14px] leading-[1.65] text-white/65">
              Terbuka untuk kemitraan distribusi, retail modern, HORECA, OEM,
              private label, dan investasi. Hubungi kami.
            </p>
          </Reveal>
          <Reveal delayMs={120}>
            <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Contact icon={MapPin} label="Kantor Pusat" value={KONTAK.alamat} />
              <Contact icon={Phone} label="Telepon" value={KONTAK.telepon} />
              <Contact icon={Mail} label="Email" value={KONTAK.email} />
              <Contact icon={Globe} label="Website" value={KONTAK.website} />
              <Contact icon={AtSign} label="Instagram" value={KONTAK.instagram} />
              <Contact icon={Factory} label="Naungan" value={BRAND.groupName} />
            </dl>
          </Reveal>
          <Reveal delayMs={200}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-gold text-[#3a2c05] hover:bg-gold-bright"
              >
                <Link href="/">
                  <ArrowLeft /> Kembali ke Beranda
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/login">Masuk ke Sistem</Link>
              </Button>
            </div>
            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
              © 2026 PT Karya Sang Prabu · {BRAND.groupName} · Company Profile
              Edisi 2026
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <section className="py-16 sm:py-20">{children}</section>;
}

function InfoRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-4 border-b border-[#efe9db] pb-4"}>
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9a9e94]">
        {label}
      </dt>
      <dd className="mt-1 text-[14px] leading-[1.55] text-[#23271f]">{value}</dd>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-[1.75rem] font-semibold leading-[1.1] text-gold">
        {value}
      </p>
      <p className="mt-1 text-[12px] uppercase tracking-[0.1em] text-white/60">
        {label}
      </p>
    </div>
  );
}

function Contact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold ring-1 ring-inset ring-gold/25">
        <Icon className="size-4" />
      </span>
      <div>
        <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
          {label}
        </dt>
        <dd className="mt-0.5 text-[14px] leading-[1.5] text-white/85">{value}</dd>
      </div>
    </div>
  );
}
