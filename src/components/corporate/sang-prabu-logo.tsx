"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

interface SangPrabuLogoProps {
  variant?: "dark" | "light" | "auto";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
}

/**
 * Logo Resmi & Terdaftar HAKI — PT KARYA SANG PRABU
 * Menggunakan file aset master autentik tanpa modifikasi bentuk, tipografi, atau elemen grafis.
 */
export function SangPrabuLogo({
  className = "",
  size = "md",
}: SangPrabuLogoProps) {
  const [logoSrc, setLogoSrc] = useState("/sang-prabu/sang-prabu-haki-logo.png");

  const sizeClasses = {
    sm: "h-10 w-auto max-w-full",
    md: "h-14 w-auto sm:h-16 max-w-full",
    lg: "h-24 w-auto sm:h-28 max-w-full",
    xl: "h-36 w-auto sm:h-44 max-w-full",
    hero: "h-48 w-auto sm:h-60 lg:h-64 max-w-full",
  };

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      role="img"
      aria-label="Logo Resmi Terdaftar HAKI SANG PRABU — PT KARYA SANG PRABU"
    >
      <img
        src={logoSrc}
        alt="Logo Resmi Terdaftar HAKI SANG PRABU — PT KARYA SANG PRABU"
        className={`${sizeClasses[size]} object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-105`}
        loading="eager"
        onError={() => setLogoSrc("/logos/logo-sang-prabu.png")}
      />
    </div>
  );
}

export default SangPrabuLogo;

