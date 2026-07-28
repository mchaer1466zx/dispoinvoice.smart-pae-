import { isAdminAction } from "@/app/actions/auth";
import { Forbidden } from "@/components/forbidden";
import { PengaturanManager } from "@/app/pengaturan/pengaturan-manager";

/**
 * Halaman Pengaturan (master data perusahaan) — KHUSUS ADMIN. Diperiksa di
 * server: bila sesi bukan admin, tampilkan 403 Forbidden alih-alih konten.
 * (Middleware sudah memastikan pengguna login; ini lapisan hak akses.)
 */
export default async function PengaturanPage() {
  const isAdmin = await isAdminAction();
  if (!isAdmin) {
    return (
      <Forbidden message="Halaman Pengaturan khusus admin. Hubungi admin untuk mengubah master data perusahaan." />
    );
  }
  return <PengaturanManager />;
}
