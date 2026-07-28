import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Purchase Order",
};

export default function SegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
