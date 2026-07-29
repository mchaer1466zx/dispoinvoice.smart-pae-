import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Penawaran",
};

export default function SegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
