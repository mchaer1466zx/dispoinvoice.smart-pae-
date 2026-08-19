"use client";

import { useState } from "react";
import Image from "next/image";
import { BRAND_IMAGES, HERO_IMAGES } from "@/config/images";

export function HeroBrandHeader() {
  const [kspLogo, setKspLogo] = useState<string>(BRAND_IMAGES.sangPrabu.webp);
  const [wiridanLogo, setWiridanLogo] = useState<string>(BRAND_IMAGES.wiridan318.webp);
  const [heroImage, setHeroImage] = useState<string>(HERO_IMAGES.masterWebp);

  return (
    <>
      {/* Dual Brand Crest Center Graphic with Authentic Master Logos */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6">
        {/* PT Karya Sang Prabu Official Corporate Crest */}
        <div className="group relative flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-black/60 px-3.5 py-2 backdrop-blur-md">
          <div className="relative size-8">
            <Image
              src={kspLogo}
              alt={BRAND_IMAGES.sangPrabu.alt}
              fill
              priority
              sizes="32px"
              className="object-contain"
              onError={() => setKspLogo(BRAND_IMAGES.sangPrabu.fallbackPng)}
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
            PT KARYA SANG PRABU
          </span>
        </div>

        {/* Divider */}
        <span className="text-amber-400/60 font-serif text-sm">✕</span>

        {/* Wiridan 318 Food Official Royal Emblem */}
        <div className="group relative flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-black/60 px-3.5 py-2 backdrop-blur-md">
          <div className="relative size-8">
            <Image
              src={wiridanLogo}
              alt={BRAND_IMAGES.wiridan318.alt}
              fill
              priority
              sizes="32px"
              className="object-contain"
              onError={() => setWiridanLogo(BRAND_IMAGES.wiridan318.png)}
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
            WIRIDAN 318 FOOD
          </span>
        </div>
      </div>

      {/* Master Headline Banner Image Container */}
      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border-2 border-amber-400/50 bg-[#061e12] shadow-[0_25px_60px_-15px_rgba(212,175,55,0.35)] transition-all duration-300 hover:border-amber-300">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full">
          <Image
            src={heroImage}
            alt={HERO_IMAGES.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
            className="object-cover object-center"
            onError={() => setHeroImage(HERO_IMAGES.masterJpg)}
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </>
  );
}
