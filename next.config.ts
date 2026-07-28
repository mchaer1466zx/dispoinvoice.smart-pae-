import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Unggahan logo perusahaan boleh sampai 2MB (dicek di server action). Batas
    // bawaan Server Actions hanya 1MB, sehingga file 1-2MB ditolak framework
    // sebelum action jalan. Naikkan agar muat file + overhead multipart.
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  turbopack: {
    resolveAlias: {
      // Tailwind v4 emits color-mix()/oklch() rules that upstream html2canvas
      // cannot parse; html2canvas-pro is a drop-in fork that supports them.
      html2canvas: "html2canvas-pro",
    },
  },
};

export default nextConfig;
