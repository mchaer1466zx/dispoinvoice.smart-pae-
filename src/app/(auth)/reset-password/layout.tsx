import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Kata Sandi",
};

export default function SegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
