import Link from "next/link";
import { SiteNav } from "@/components/corporate/site-nav";
import { SiteFooter } from "@/components/corporate/site-footer";
import { StructuredData } from "@/components/corporate/structured-data";
import { SangPrabuAi } from "@/components/ai/sang-prabu-ai";
import { SITE } from "@/lib/corporate/site";

// Feature flag: widget AI hanya tampil bila diaktifkan (default aman: mati).
const AI_ENABLED = process.env.NEXT_PUBLIC_AI_ENABLED === "true";

/**
 * Kerangka halaman marketing: navbar korporat + konten + footer + sticky WA CTA.
 * `heroTransparent` = true untuk halaman yang punya hero gelap full-bleed
 * (navbar mulai transparan lalu solid saat scroll).
 */
export function SiteChrome({
  heroTransparent = false,
  children,
}: {
  heroTransparent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-jakarta text-brand-ink">
      <StructuredData />
      <SiteNav transparent={heroTransparent} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      {AI_ENABLED ? <SangPrabuAi /> : null}

      {/* ============ STICKY WHATSAPP B2B CTA ============ */}
      <aside
        id="sticky-whatsapp-cta"
        aria-label="Kontak Cepat WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex items-center print:hidden"
      >
        <Link
          href={SITE.whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 rounded-full border border-emerald-500/40 bg-emerald-700 px-4 py-3 text-white shadow-[0_10px_25px_-5px_rgba(4,120,87,0.5)] transition-all duration-300 hover:scale-105 hover:bg-emerald-600 hover:shadow-[0_15px_30px_-5px_rgba(4,120,87,0.7)] active:scale-95"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-white/20 text-white group-hover:bg-white group-hover:text-emerald-700">
            <svg
              className="size-4 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </span>
          <span className="hidden sm:inline text-xs font-bold tracking-wide">
            Konsultasi / Order B2B
          </span>
          <span className="sm:hidden text-xs font-bold tracking-wide">
            Chat WA
          </span>
        </Link>
      </aside>
    </div>
  );
}

/**
 * Hero standar untuk halaman interior (bukan Home): band hijau tua + overline,
 * judul serif, deskripsi. Memberi konsistensi & ruang untuk navbar transparan.
 */
export function PageHero({
  overline,
  title,
  description,
}: {
  overline: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-green-dark px-6 pb-16 pt-28 text-white sm:px-8 sm:pb-20 sm:pt-36">
      <div
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(closest-side,#dea40255,transparent)" }}
        aria-hidden
      />
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold">
          {overline}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[3.2rem]">
          {title}
        </h1>
        <span className="mt-5 block h-[3px] w-16 rounded-full bg-brand-gold" />
        {description ? (
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.75] text-white/75 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
