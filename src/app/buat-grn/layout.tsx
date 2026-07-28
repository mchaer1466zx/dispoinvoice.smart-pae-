import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Goods Receipt",
};

export default function SegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
