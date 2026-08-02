import { SiteNav } from "@/components/corporate/site-nav";
import { SiteFooter } from "@/components/corporate/site-footer";

/**
 * Kerangka halaman marketing: navbar korporat + konten + footer.
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
    <div className="flex min-h-screen flex-col bg-white font-jakarta text-brand-ink">
      <SiteNav transparent={heroTransparent} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
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
