import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Tailwind v4 emits color-mix()/oklch() rules that upstream html2canvas
      // cannot parse; html2canvas-pro is a drop-in fork that supports them.
      html2canvas: "html2canvas-pro",
    },
  },
};

export default nextConfig;
