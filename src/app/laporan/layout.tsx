import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan Dokumen",
};

export default function SegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
