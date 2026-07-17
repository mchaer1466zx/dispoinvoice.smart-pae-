import Image from "next/image";
import Link from "next/link";
import { CompanySwitcher } from "@/components/company-switcher";
import { UserMenu } from "@/components/user-menu";

export function AppHeader() {
  return (
    <header className="border-b-2 border-primary bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-pae.jpg"
            alt="Logo PT Prima Andalas Energi"
            width={36}
            height={36}
            className="rounded-md"
            priority
          />
          <span className="text-sm font-bold uppercase leading-tight tracking-tight text-foreground sm:text-base">
            PT Prima Andalas Energi
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <CompanySwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
