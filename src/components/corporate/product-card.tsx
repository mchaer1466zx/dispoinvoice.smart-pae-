"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, ChevronRight, Sparkles, ThermometerSnowflake, PackageCheck } from "lucide-react";
import type { WiridanProduct } from "@/data/products";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: WiridanProduct;
  priority?: boolean;
  onSelect?: (product: WiridanProduct) => void;
  className?: string;
}

export function ProductCard({
  product,
  priority = false,
  onSelect,
  className,
}: ProductCardProps) {
  const [imageSrc, setImageSrc] = useState(product.image);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    // Tier 1 Fallback: try JPG counterpart if WebP fails
    if (imageSrc.endsWith(".webp")) {
      setImageSrc(imageSrc.replace(/\.webp$/, ".jpg"));
    } else {
      // Tier 2 Fallback: Branded placeholder
      setHasError(true);
      setImageLoaded(true);
    }
  };

  // Dynamic badge accent color mapping
  const badgeColorStyles: Record<string, string> = {
    amber: "border-amber-500/40 bg-amber-500/15 text-amber-300",
    blue: "border-blue-500/40 bg-blue-500/15 text-blue-300",
    emerald: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
    rose: "border-rose-500/40 bg-rose-500/15 text-rose-300",
    cyan: "border-cyan-500/40 bg-cyan-500/15 text-cyan-300",
    indigo: "border-indigo-500/40 bg-indigo-500/15 text-indigo-300",
  };

  const badgeStyle = badgeColorStyles[product.color] || badgeColorStyles.amber;

  // Derive SKU Code if present in id or slug (e.g., B-01, B-02, C-01, D-01)
  const skuCodeMatch = product.id.match(/^([bcd]-\d{2})/i);
  const skuCode = skuCodeMatch ? skuCodeMatch[1].toUpperCase() : null;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelect?.(product)}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#071d12]/90 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/50 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.3)] cursor-pointer backdrop-blur-md",
        className,
      )}
    >
      {/* Visual Accent Glow on Card Hover */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-amber-500/10 via-emerald-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* 1. Image Thumbnail Container: Aspect 3/4 with Brand Color Placeholder */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-amber-500/20 bg-gradient-to-b from-[#062416] via-[#04190f] to-[#020d08] p-3 flex items-center justify-center">
        {/* Top-Left Badge: SKU Code or Halal */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-black/80 px-2.5 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-md shadow-md">
          <ShieldCheck className="size-3.5 text-emerald-400" />
          <span>{skuCode ? `${skuCode} • Halal` : "✓ Halal BPJPH"}</span>
        </div>

        {/* Top-Right Badge: Net Weight Pill */}
        <div
          className={cn(
            "absolute top-3 right-3 z-10 rounded-full border px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md shadow-md",
            badgeStyle,
          )}
        >
          {product.weight}
        </div>

        {/* Next.js Image with Aspect Ratio & SEO alt */}
        <div className="relative h-full w-full">
          {!hasError ? (
            <Image
              src={imageSrc}
              alt={product.alt}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn(
                "object-contain p-1 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] transition-all duration-500 group-hover:scale-105",
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95",
              )}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-center p-4">
              <div className="size-16 rounded-full border border-amber-400/30 bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2">
                <Sparkles className="size-8" />
              </div>
              <span className="font-serif font-bold text-amber-200 text-sm">{product.name}</span>
              <span className="text-[11px] text-emerald-400 font-mono mt-1">Wiridan 318 Official</span>
            </div>
          )}
        </div>

        {/* Bottom Category Badge Overlay */}
        <div className="absolute bottom-2.5 left-2.5 z-10 rounded-md bg-black/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-400/30 backdrop-blur-sm">
          {product.category}
        </div>
      </div>

      {/* 2. Card Content & Typography Hierarchy */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          {/* Accent Sub-heading / Tagline */}
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-400/90">
            <Sparkles className="size-3 text-amber-400 shrink-0" />
            <span className="truncate">{product.tagline}</span>
          </div>

          {/* Main Product Title */}
          <h3 className="mb-2 font-serif text-lg font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-amber-200 line-clamp-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="mb-4 font-sans text-xs leading-relaxed text-slate-300/80 line-clamp-2">
            {product.shortDesc}
          </p>

          {/* Key Specifications Grid (Portion & Storage) */}
          <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-white/5 bg-black/40 p-2.5 text-[11px]">
            <div className="space-y-0.5">
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-400">
                <PackageCheck className="size-3 text-amber-400/80" />
                Porsi / Pack:
              </span>
              <span className="block font-semibold text-white truncate">
                {product.portion}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-400">
                <ThermometerSnowflake className="size-3 text-sky-400/80" />
                Suhu Simpan:
              </span>
              <span className="block font-semibold text-amber-300 truncate">
                {product.storage}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button (CTA) */}
        <button
          type="button"
          aria-label={`Lihat detail spesifikasi ${product.name}`}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-2.5 text-xs font-extrabold uppercase tracking-wider text-slate-950 shadow-md transition-all duration-300 hover:from-amber-400 hover:to-amber-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] active:scale-[0.98]"
        >
          <span>Lihat Detail &amp; Spesifikasi</span>
          <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
