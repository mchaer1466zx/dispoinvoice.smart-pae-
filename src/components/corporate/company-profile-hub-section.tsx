"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Download,
  ArrowRight,
  ShieldCheck,
  Award,
  Factory,
  FileText,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export function CompanyProfileHubSection() {
  const keyHighlights = [
    {
      title: "Identitas Resmi",
      desc: "PT KARYA SANG PRABU (Prima Prabu Group)",
      icon: <Building2 className="size-5 text-amber-400" />,
    },
    {
      title: "Kapasitas Manufaktur",
      desc: "250.000 Butir / Hari dengan Lini Otomatisasi Modern",
      icon: <Factory className="size-5 text-emerald-400" />,
    },
    {
      title: "Jaminan Mutu & Rantai Dingin",
      desc: "Sertifikasi Halal BPJPH & Cold Storage Suhu -18°C",
      icon: <ShieldCheck className="size-5 text-amber-400" />,
    },
    {
      title: "Legalitas 10 KBLI",
      desc: "Izin Usaha Lengkap Sektor Pangan, Daging, & Pergudangan",
      icon: <Award className="size-5 text-emerald-400" />,
    },
  ];

  return (
    <section
      id="company-profile-hub"
      aria-label="Profil Perusahaan PT KARYA SANG PRABU"
      className="relative isolate bg-[#031109] py-20 sm:py-28 lg:py-32 text-white overflow-hidden"
    >
      {/* Background Radiance */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(222,164,2,0.15) 0%, rgba(11,77,33,0.2) 50%, transparent 80%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Editorial Card Container */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400/40 bg-gradient-to-br from-[#062414] via-[#04190e] to-[#020b06] p-8 sm:p-12 lg:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          
          {/* Subtle Decorative Golden Ring */}
          <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full border border-amber-400/20 opacity-30" />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-center">
            
            {/* Left Content Column: Lead Description & Direct Single Focus CTA */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 backdrop-blur-md">
                <Sparkles className="size-3.5 text-amber-300" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                  Dokumen Korporat Resmi 2026
                </span>
              </div>

              <h2 className="mt-5 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Profil Perusahaan <span className="text-amber-400">PT KARYA SANG PRABU</span>
              </h2>

              <p className="mt-3 font-serif text-lg font-semibold italic text-amber-200/90">
                Karya Sang Prabu 2026 · Better Proses, Better Quality &amp; Better Serve
              </p>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-emerald-100/90">
                Dapatkan informasi mendalam mengenai visi misi, susunan legalitas 10 KBLI, standarisasi fasilitas produksi higienis, sertifikasi Halal BPJPH, portofolio produk berlabel SANG PRABU, dan skema kemitraan strategis B2B.
              </p>

              {/* 4 Pillars Matrix */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 w-full">
                {keyHighlights.map((item, hIdx) => (
                  <div
                    key={hIdx}
                    className="flex items-start gap-3 rounded-2xl border border-white/5 bg-black/40 p-3.5 backdrop-blur-sm"
                  >
                    <div className="mt-0.5 shrink-0 rounded-lg bg-white/5 p-1.5 border border-white/10">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-300 leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTION AREA: Single Primary Focus Button "Lihat Profil Perusahaan" */}
              <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
                <Link
                  href="/company-profile"
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-8 py-4 text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-950 shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] active:scale-98"
                >
                  <Building2 className="size-5 text-slate-950 shrink-0" />
                  <span>Lihat Profil Perusahaan</span>
                  <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="/images/hero/hero-sang-prabu.jpg"
                  download="Company-Profile-PT-Karya-Sang-Prabu-2026.jpg"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-amber-400 active:scale-98"
                >
                  <Download className="size-4 text-amber-400" />
                  <span>Unduh Dokumen Resmi</span>
                </a>
              </div>

            </div>

            {/* Right Preview Column: Authentic Slide Preview Deck */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm lg:max-w-none rounded-2xl border-2 border-amber-400/40 bg-black/60 p-3 shadow-2xl backdrop-blur-md">
                
                {/* 15 Slides Snapshot Graphic */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#061e12]">
                  <Image
                    src="/images/hero/hero-sang-prabu.webp"
                    alt="Company Profile Resmi PT Karya Sang Prabu 2026"
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2 rounded-lg border border-amber-400/30 bg-black/80 px-2.5 py-1 font-mono text-[10px] font-bold text-amber-300">
                    <FileText className="size-3 text-amber-400" />
                    <span>Edisi 2026 · 15 Slide Terverifikasi</span>
                  </div>

                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-white">
                    <span className="font-serif font-bold text-amber-300">PT KARYA SANG PRABU</span>
                    <span className="font-mono text-[10px] text-emerald-300">Prima Prabu Group</span>
                  </div>
                </div>

                <div className="mt-3 p-2 text-center">
                  <p className="text-xs text-slate-300">
                    Akses presentasi interaktif lengkap meliputi legalitas, lini produk, dan fasilitas cold-chain.
                  </p>
                  <Link
                    href="/company-profile"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4"
                  >
                    <span>Buka Tampilan Slide Presentasi</span>
                    <ExternalLink className="size-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
