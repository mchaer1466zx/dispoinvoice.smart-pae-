"use client";

import Link from "next/link";
import { CompanySwitcher } from "@/components/company-switcher";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { UserMenu } from "@/components/user-menu";
import { useCompany } from "@/lib/company-store";
import { BRAND } from "@/lib/brand";

export function AppHeader() {
  const { activeCompany } = useCompany();
  const name = activeCompany?.name ?? BRAND.name;
  const logoUrl = activeCompany?.logoUrl ?? BRAND.logoPath;

  return (
    <header className="border-b-2 border-primary bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={`Logo ${name}`}
              width={36}
              height={36}
              className="h-9 w-9 rounded-md object-contain"
            />
          ) : null}
          <span className="text-sm font-bold uppercase leading-tight tracking-tight text-foreground sm:text-base">
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
