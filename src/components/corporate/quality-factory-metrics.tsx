"use client";

import React from "react";
import {
  ShieldCheck,
  Snowflake,
  Cpu,
  Award,
  Factory,
  Sparkles,
  Zap,
  Boxes,
} from "lucide-react";

export function QualityFactoryMetrics() {
  const stats = [
    {
      value: "250.000+",
      unit: "Butir / Hari",
      label: "Kapasitas Produksi Harian",
      desc: "Didukung lini mesin pembuat bakso otomatis berkecepatan tinggi dengan perebusan suhu presisi.",
      icon: Zap,
    },
    {
      value: "20 Ton",
      unit: "Kapasitas Gudang",
      label: "Fasilitas Cold Storage -18°C",
      desc: "Menjamin ketersediaan pasokan stabil dan kesegaran produk tanpa terputus sepanjang tahun.",
      icon: Snowflake,
    },
    {
      value: "100%",
      unit: "Otomatisasi Modern",
      label: "Peralatan Higienis Standar Industri",
      desc: "Flaker daging beku, Silent Bowl Cutter, Meat Ball Former & Continuous IQF Vacuum Line.",
      icon: Cpu,
    },
    {
      value: "150+",
      unit: "Mitra Aktif",
      label: "Jaringan Distribusi & Horeka",
      desc: "Dipercaya berbagai restoran, hotel, katering industri, agen distributor di seluruh Nusantara.",
      icon: Boxes,
    },
  ];

  const standards = [
    {
      title: "Sertifikasi Halal Resmi BPJPH",
      reg: "ID00410000123456721",
      desc: "Seluruh bahan baku daging, rempah, dan proses pengolahan diawasi ketat memenuhi syariat Islam dan Sistem Jaminan Produk Halal (SJPH).",
      icon: ShieldCheck,
      color: "border-emerald-500/40 bg-emerald-950/40 text-emerald-300",
    },
    {
      title: "Kepatuhan BPOM & P-IRT",
      reg: "Izin Edar Resmi & Uji Lab Berkala",
      desc: "Bebas bahan berbahaya (tanpa boraks, tanpa formalin, tanpa pewarna sintetis berbahaya) dengan formulasi aman dikonsumsi seluruh keluarga.",
      icon: Award,
      color: "border-amber-500/40 bg-amber-950/40 text-amber-300",
    },
    {
      title: "Protokol Rantai Dingin Terpadu (-18°C)",
      reg: "Cold-Chain Integrity System",
      desc: "Suhu dijaga ketat sejak tahap penggilingan es, pembekuan cepat (blast freezing), penyimpanan gudang, hingga truk pendingin pengantaran.",
      icon: Snowflake,
      color: "border-sky-500/40 bg-sky-950/40 text-sky-300",
    },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[#03140b] py-24 text-white sm:py-32">
      {/* Subtle Geometry Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle 900px at 50% 30%, #0c4d2b 0%, #041a0e 60%, #000000 100%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 backdrop-blur-md">
            <Factory className="size-4 text-amber-300" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
              Standar Mutu &amp; Kapasitas Manufaktur
            </span>
          </div>

          <h2 className="mt-5 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Teknologi Pengolahan Pangan Modern &amp; Keandalan Rantai Pasok
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-emerald-100/80 sm:text-base">
            Menggabungkan keaslian resep rempah Nusantara dengan otomatisasi mesin industri berstandar
            higienis tinggi untuk menghasilkan pangan beku bergizi dengan mutu konsisten.
          </p>
        </div>

        {/* Industrial Power Stats (Metrics Grid) */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-b from-[#072415] to-[#031109] p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
                    <Icon className="size-6" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-emerald-300">
                    {stat.unit}
                  </span>
                </div>

                <p className="mt-6 font-mono text-3xl font-extrabold text-white tracking-tight sm:text-4xl group-hover:text-amber-300 transition-colors">
                  {stat.value}
                </p>

                <h3 className="mt-2 text-sm font-bold text-amber-200">{stat.label}</h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-300/80">{stat.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Standards & Certifications Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {standards.map((std, i) => {
            const Icon = std.icon;
            return (
              <div
                key={i}
                className={`rounded-3xl border p-6 backdrop-blur-md transition-all duration-300 ${std.color}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-black/40 border border-white/10">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-white">{std.title}</h4>
                    <p className="font-mono text-xs font-semibold text-amber-300">{std.reg}</p>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-slate-200">{std.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Modern Equipment Workflow Pipeline */}
        <div className="mt-14 rounded-3xl border border-amber-400/30 bg-[#051c10]/90 p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-amber-400">
                Alur Produksi Higienis
              </span>
              <h3 className="mt-1 font-serif text-xl font-bold text-white sm:text-2xl">
                Lini Manufaktur Pangan Terpadu
              </h3>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-amber-400/10 border border-amber-400/30 px-4 py-2 text-xs font-semibold text-amber-300">
              <Sparkles className="size-4" />
              <span>Standar GMP (Good Manufacturing Practice)</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                name: "Seleksi & Flaking Daging",
                desc: "Pemotongan daging beku bersertifikat dengan mesin flaker stainless steel 304.",
              },
              {
                step: "02",
                name: "Emulsifikasi & Pencampuran",
                desc: "Silent Bowl Cutter dengan pengaturan suhu es terjaga untuk tekstur kenyal sempurna.",
              },
              {
                step: "03",
                name: "Molding & Continuous Boiling",
                desc: "Pencetak butir berkecepatan 250 butir/menit dengan perebusan bertahap higienis.",
              },
              {
                step: "04",
                name: "IQF Chilling & Vacuum Seal",
                desc: "Pendinginan cepat dan pengemasan kedap udara anti kontaminasi siap masuk cold storage.",
              },
            ].map((step, idx) => (
              <div key={idx} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <span className="font-mono text-lg font-extrabold text-amber-400">{step.step}</span>
                <h4 className="mt-2 text-sm font-bold text-white">{step.name}</h4>
                <p className="mt-1.5 text-xs text-slate-300/80 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
