"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export interface ProductImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  showPlaceholderOnFail?: boolean;
}

function getIntelligentFallback(originalSrc: string, fallbackSrc?: string): string {
  if (fallbackSrc) return fallbackSrc;
  const s = originalSrc.toLowerCase();
  if (s.includes("wiridan") || s.includes("logo") || s.includes("emblem")) {
    return "/images/logo/logo-wiridan-318-gold.png";
  }
  if (s.includes("bakso")) {
    return "/sang-prabu/bakso.jpg";
  }
  if (s.includes("dimsum")) {
    return "/sang-prabu/dimsum.jpg";
  }
  if (s.includes("otak-otak")) {
    return "/sang-prabu/otak-otak.jpg";
  }
  if (s.includes("ayam") || s.includes("poultry") || s.includes("karkas")) {
    return "/sang-prabu/ayam.jpg";
  }
  if (s.includes("daging") || s.includes("butcher") || s.includes("sapi")) {
    return "/sang-prabu/daging-sapi.jpg";
  }
  if (s.includes("dapur") || s.includes("factory") || s.includes("mesin") || s.includes("site-2")) {
    return "/sang-prabu/dapur.jpg";
  }
  if (s.includes("compro") || s.includes("slide") || s.includes("hal-")) {
    return "/sang-prabu/compro/hal-01.jpg";
  }
  return "/sang-prabu/hero-bakso.jpg";
}

export function ProductImage({
  src,
  alt,
  className = "",
  fallbackSrc,
  showPlaceholderOnFail = true,
  loading = "lazy",
  style,
  ...rest
}: ProductImageProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [overrideSrc, setOverrideSrc] = useState<string | null>(null);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setOverrideSrc(null);
    setHasFailedAll(false);
  }

  const currentSrc = overrideSrc ?? src;

  const handleError = () => {
    const fallback = getIntelligentFallback(src, fallbackSrc);
    if (currentSrc !== fallback && !hasFailedAll) {
      setOverrideSrc(fallback);
    } else {
      setHasFailedAll(true);
    }
  };

  if (hasFailedAll && showPlaceholderOnFail) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-amber-400/20 bg-gradient-to-br from-[#062112] to-[#0d381e] p-4 text-center text-white ${className}`}
        style={style}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(222,164,2,0.15),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/30 shadow-inner">
            <Sparkles className="size-5" />
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
            SANG PRABU
          </span>
          <p className="max-w-[200px] text-[11px] font-medium leading-tight text-emerald-100/80 line-clamp-2">
            {alt || "Dokumentasi Operasional"}
          </p>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading={loading}
      decoding="async"
      style={style}
      {...rest}
    />
  );
}

/** Alias for universal corporate usage */
export const SafeImage = ProductImage;
export const CorporateImage = ProductImage;
