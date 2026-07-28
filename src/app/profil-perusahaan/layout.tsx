import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Perusahaan",
};

export default function SegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
