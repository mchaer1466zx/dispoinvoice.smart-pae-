import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Unggahan logo perusahaan boleh sampai 2MB (dicek di server action). Batas
    // bawaan Server Actions hanya 1MB, sehingga file 1-2MB ditolak framework
    // sebelum action jalan. Naikkan agar muat file + overhead multipart.
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-Robots-Tag",
            value: "all",
          },
        ],
      },
    ];
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
