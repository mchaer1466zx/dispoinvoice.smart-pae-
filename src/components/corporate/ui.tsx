import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Kontainer lebar maksimum yang konsisten untuk semua seksi. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6 sm:px-8", className)}>
      {children}
    </div>
  );
}

/** Overline kecil (label seksi) — huruf kapital, tracking lebar, aksen emas. */
export function Overline({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Judul seksi bergaya korporat: overline + heading serif + garis emas opsional. */
export function SectionHeader({
  overline,
  title,
  description,
  align = "left",
  invert = false,
  className,
}: {
  overline?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {overline ? <Overline>{overline}</Overline> : null}
      <h2
        className={cn(
          "max-w-3xl font-display text-[1.9rem] font-semibold leading-[1.1] tracking-[-0.015em] sm:text-[2.6rem]",
          invert ? "text-white" : "text-brand-green-dark",
        )}
      >
        {title}
      </h2>
      <span
        className={cn(
          "h-[3px] w-14 rounded-full bg-brand-gold",
          align === "center" && "mx-auto",
        )}
      />
      {description ? (
        <p
          className={cn(
            "mt-1 max-w-2xl text-[15px] leading-[1.75] sm:text-base",
            invert ? "text-white/75" : "text-brand-ink/70",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

type ButtonVariant = "primary" | "gold" | "outline" | "ghost";

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-green text-white hover:bg-brand-green-dark focus-visible:ring-brand-green/40",
  gold: "bg-brand-gold text-[#3a2c05] hover:brightness-105 focus-visible:ring-brand-gold/40",
  outline:
    "border border-brand-green text-brand-green-dark hover:bg-brand-green hover:text-white focus-visible:ring-brand-green/30",
  ghost:
    "border border-white/40 text-white hover:bg-white/10 focus-visible:ring-white/30",
};

/** Tombol/CTA korporat konsisten (Link). */
export function SiteButton({
  href,
  children,
  variant = "primary",
  withArrow = false,
  external = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  withArrow?: boolean;
  external?: boolean;
  className?: string;
}) {
  const cls = cn(
    "group inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] outline-none transition-[background-color,color,box-shadow,filter] duration-200 focus-visible:ring-2",
    VARIANT[variant],
    className,
  );
  const inner = (
    <>
      {children}
      {withArrow ? (
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      ) : null}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
