import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Factory,
  Snowflake,
  Download,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { SiteChrome } from "@/components/corporate/site-chrome";
import { HeroBrandHeader } from "@/components/corporate/hero-brand-header";
import { WiridanShowcaseInteractive } from "@/components/corporate/wiridan-showcase-interactive";
import { QualityFactoryMetrics } from "@/components/corporate/quality-factory-metrics";
import { B2BWholesaleCalculator } from "@/components/corporate/b2b-wholesale-calculator";
import { SpkpdLeadForm } from "@/components/corporate/spkpd-lead-form";
import { FloatingWhatsappWidget } from "@/components/corporate/floating-whatsapp-widget";
import { GROUP_SYNERGY } from "@/lib/corporate/site";

export const metadata: Metadata = {
  title: "PT KARYA SANG PRABU — Better Proses, Better Quality & Better Serve | Wiridan 318 Food",
  description:
    "PT KARYA SANG PRABU: Indulgence in Every Bite, Rooted in Tradition. Produsen Makanan Beku Berkualitas Tinggi (Wiridan 318) dan Perdagangan Komoditas Nasional Terpercaya.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <SiteChrome heroTransparent>
      {/* =========================================================================
          1. HERO SECTION: FUTURISTIC TRADITIONAL LUXURY
          ========================================================================= */}
      <section
        aria-label="PT KARYA SANG PRABU — Wiridan 318 Food"
        className="relative isolate flex min-h-[92vh] items-center justify-center overflow-hidden bg-[#031109] pt-28 pb-24 sm:pt-36 sm:pb-32 text-white"
      >
        {/* Radial Dark Emerald Gradient Backdrop */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 85% 65% at 50% 35%, #083a20 0%, #041f11 40%, #020b06 100%)",
          }}
          aria-hidden
        />

        {/* Concentric Golden Heritage Geometric Circles */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-20" aria-hidden>
          <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2">
            <svg
              className="size-[600px] sm:size-[850px] animate-[spin_180s_linear_infinite]"
              viewBox="0 0 800 800"
              fill="none"
              stroke="#dea402"
              strokeWidth="0.8"
            >
              <circle cx="400" cy="400" r="380" strokeDasharray="6 8" opacity="0.4" />
              <circle cx="400" cy="400" r="320" opacity="0.6" />
              <circle cx="400" cy="400" r="260" strokeDasharray="4 6" opacity="0.5" />
              <circle cx="400" cy="400" r="190" opacity="0.7" />
              {[...Array(16)].map((_, idx) => (
                <line
                  key={idx}
                  x1="400"
                  y1="400"
                  x2={400 + 380 * Math.cos((idx * 22.5 * Math.PI) / 180)}
                  y2={400 + 380 * Math.sin((idx * 22.5 * Math.PI) / 180)}
                  opacity="0.25"
                  strokeDasharray="2 10"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Halo Glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-[32%] -translate-x-1/2 -translate-y-1/2 size-96 rounded-full opacity-35 blur-[100px]"
          style={{ background: "radial-gradient(circle, #f59e0b 0%, #10b981 50%, transparent 80%)" }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <HeroBrandHeader />

          {/* Sub-headline Description for Corporate Context */}
          <p className="mx-auto mt-8 max-w-3xl text-sm leading-relaxed text-emerald-100/90 sm:text-base">
            <strong className="font-semibold text-white">PT KARYA SANG PRABU</strong> mempersembahkan lini produk makanan beku halal{" "}
            <strong className="text-amber-300">WIRIDAN 318 FOOD</strong> dengan standar mutu higienis pabrik modern,
            resep rempah warisan tradisi, dan sertifikasi resmi BPJPH untuk kebutuhan rumah tangga, retail, horeka, dan distributor se-Indonesia.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <a
              href="#products"
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-slate-950 shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-103 hover:shadow-[0_0_40px_rgba(212,175,55,0.7)]"
            >
              <span>Jelajahi 8 Varian Produk</span>
              <ArrowRight className="size-4" />
            </a>

            <Link
              href="/company-profile"
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl border border-emerald-400/40 bg-emerald-950/60 px-8 py-4 text-sm font-bold uppercase tracking-wider text-emerald-200 backdrop-blur-md transition-all duration-300 hover:bg-emerald-900/60 hover:text-white hover:border-emerald-400"
            >
              <Download className="size-4 text-emerald-400" />
              <span>Download Company Profile</span>
            </Link>
          </div>

          {/* Trust Badges Strip */}
          <div className="mt-14 grid grid-cols-2 gap-3 pt-8 border-t border-white/10 sm:grid-cols-4 text-left">
            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black/30 p-3.5 backdrop-blur-md">
              <ShieldCheck className="size-6 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Halal BPJPH</p>
                <p className="font-mono text-[10px] text-amber-300/80">ID00410000123456721</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black/30 p-3.5 backdrop-blur-md">
              <Award className="size-6 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">BPOM / P-IRT</p>
                <p className="text-[10px] text-slate-300">Standar Uji Higienis</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black/30 p-3.5 backdrop-blur-md">
              <Snowflake className="size-6 text-sky-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Cold-Chain -18°C</p>
                <p className="text-[10px] text-slate-300">Kualitas Terjaga</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black/30 p-3.5 backdrop-blur-md">
              <Factory className="size-6 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">250K Butir / Hari</p>
                <p className="text-[10px] text-slate-300">Lini Otomatisasi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PRODUCT SHOWCASE SECTION: 4 CORE WIRIDAN 318 PRODUCTS
          ========================================================================= */}
      <WiridanShowcaseInteractive />

      {/* =========================================================================
          3. CORPORATE QUALITY & FACTORY CAPABILITY SECTION
          ========================================================================= */}
      <div id="quality">
        <QualityFactoryMetrics />
      </div>

      {/* =========================================================================
          4. B2B & WHOLESALE CALCULATOR (INTERACTIVE SIMULATOR)
          ========================================================================= */}
      <B2BWholesaleCalculator />

      {/* =========================================================================
          5. DIGITAL SPKPD / LEAD FORM SECTION
          ========================================================================= */}
      <SpkpdLeadForm />

      {/* =========================================================================
          6. GROUP SYNERGY & UPSTREAM-DOWNSTREAM INTEGRATION
          ========================================================================= */}
      <section className="relative isolate bg-[#031109] py-24 text-white sm:py-32">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 backdrop-blur-md">
              <Building2 className="size-4 text-amber-300" />
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
                Ekosistem Terpadu
              </span>
            </div>

            <h2 className="mt-5 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Sinergi Hulu-Hilir{" "}
              <span className="text-amber-400">Prima Prabu Group</span>
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-emerald-100/80 sm:text-base">
              Menjamin kestabilan pasokan bahan baku daging &amp; rempah dari sumber terbaik hingga ke
              proses manufaktur pangan beku modern.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Upstream Entity */}
            <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-b from-[#072415] to-[#031109] p-8 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-amber-300">
                    Hulu &amp; Brand Owner
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    {GROUP_SYNERGY.upstream.entity}
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-xs font-semibold text-amber-200">
                {GROUP_SYNERGY.upstream.role}
              </p>

              <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                {GROUP_SYNERGY.upstream.capabilities.map((cap, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Downstream Entity */}
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#062013] to-[#020b06] p-8 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-bold">
                  <Factory className="size-6" />
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-300">
                    Hilir &amp; Manufaktur
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    {GROUP_SYNERGY.downstream.entity}
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-xs font-semibold text-emerald-200">
                {GROUP_SYNERGY.downstream.role}
              </p>

              <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                {GROUP_SYNERGY.downstream.capabilities.map((cap, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. FLOATING WHATSAPP ACTION WIDGET
          ========================================================================= */}
      <FloatingWhatsappWidget />
    </SiteChrome>
  );
}
