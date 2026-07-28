import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Tampilan 403 Forbidden — dipakai halaman yang butuh hak akses tertentu
 * (mis. admin) saat pengguna sudah login tapi tidak berwenang.
 */
export function Forbidden({
  title = "403 · Akses Ditolak",
  message = "Halaman ini khusus admin. Akun Anda tidak memiliki hak akses.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-black sm:px-8">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldX className="size-8" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
        <Button asChild className="mt-2">
          <Link href="/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
