import Image from "next/image";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="border-b-2 border-primary bg-white">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-pae.jpg"
            alt="Logo PT Prima Andalas Energi"
            width={36}
            height={36}
            className="rounded-md"
          />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            DispoInvoice
          </span>
        </Link>
      </div>
    </header>
  );
}
