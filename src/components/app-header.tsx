"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CompanySwitcher } from "@/components/company-switcher";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { UserMenu } from "@/components/user-menu";
import { useCompany } from "@/lib/company-store";
import { BRAND } from "@/lib/brand";

/**
 * Rute publik/marketing yang memakai navbar korporat (SiteNav) sendiri —
 * header aplikasi (procurement) disembunyikan di sini agar tidak dobel.
 */
const MARKETING_PREFIXES = [
  "/about",
  "/business",
  "/products",
  "/partners",
  "/articles",
  "/career",
  "/contact",
  "/faq",
  "/profil-perusahaan",
  "/company-profile",
];

export function AppHeader() {
  const pathname = usePathname();
  const isMarketing =
    pathname === "/" ||
    MARKETING_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  const { activeCompany } = useCompany();
  const name = activeCompany?.name ?? BRAND.name;
  // Logo utama aplikasi: Logo Original SANG PRABU (dipakai seragam di semua
  // halaman). Bila perusahaan aktif punya logo sendiri, pakai itu.
  const logoUrl = activeCompany?.logoUrl || "/logos/logo-sang-prabu.png";

  // Halaman marketing memakai navbar korporatnya sendiri.
  if (isMarketing) return null;

  return (
    <header className="border-b-2 border-primary bg-white shadow-[0_2px_0_0_var(--gold)] dark:bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt={`Logo ${name}`}
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 object-contain"
          />
          <span className="truncate font-display text-[1rem] font-semibold leading-[1.15] tracking-[-0.01em] text-foreground sm:text-lg">
            {name}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <CompanySwitcher />
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
