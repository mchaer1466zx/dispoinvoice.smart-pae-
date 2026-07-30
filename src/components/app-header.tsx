"use client";

import Link from "next/link";
import { CompanySwitcher } from "@/components/company-switcher";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { UserMenu } from "@/components/user-menu";
import { useCompany } from "@/lib/company-store";
import { BRAND } from "@/lib/brand";

export function AppHeader() {
  const { activeCompany } = useCompany();
  const name = activeCompany?.name ?? BRAND.groupName;
  // Logo grup belum ditetapkan: tampilkan logo hanya bila perusahaan aktif
  // punya logonya sendiri; jangan pakai logo KSP sebagai lambang grup.
  const logoUrl = activeCompany?.logoUrl ?? null;

  return (
    <header className="border-b-2 border-primary bg-white shadow-[0_2px_0_0_var(--gold)] dark:bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={`Logo ${name}`}
              width={36}
              height={36}
              className="h-9 w-9 rounded-md object-contain ring-1 ring-gold/30"
            />
          ) : null}
          <span className="font-display text-[1.0625rem] font-semibold leading-[1.15] tracking-[-0.01em] text-foreground sm:text-xl">
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
