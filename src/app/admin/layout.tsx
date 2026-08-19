import Link from "next/link";
import {
  LayoutDashboard,
  Boxes,
  Factory,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { getSessionUserAction } from "@/app/actions/auth";

export const metadata = {
  title: "Admin & Gudang Operasional | PT KARYA SANG PRABU",
  description: "Sistem Manajemen Inventaris Bahan Baku, Produk Jadi WIRIDAN 318 & Eksekusi Batch Produksi",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUserAction();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors py-1 px-2 rounded-lg bg-slate-800/60 border border-slate-700/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website Publik</span>
            </Link>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-emerald-950">
                SP
              </div>
              <div>
                <span className="font-semibold text-sm text-slate-100 tracking-tight block leading-none">
                  PT KARYA SANG PRABU
                </span>
                <span className="text-[11px] text-emerald-400 font-medium tracking-wide">
                  Gudang & Produksi WIRIDAN 318
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/admin/dashboard"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Dashboard HPP</span>
            </Link>
            <Link
              href="/admin/inventory"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Boxes className="w-4 h-4 text-amber-400" />
              <span>Bahan Baku & Produk Jadi</span>
            </Link>
            <Link
              href="/admin/sop"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>SOP Pabrik &amp; QC</span>
            </Link>
            <Link
              href="/admin/produksi"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-900/50"
            >
              <Factory className="w-4 h-4 text-emerald-950" />
              <span>Eksekusi Batch</span>
            </Link>
          </nav>

          {/* User Status / Quick Switch */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 text-xs bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300 font-medium hidden sm:inline">{user.name}</span>
                <span className="text-[10px] text-emerald-400 uppercase font-semibold bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                  {user.role}
                </span>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60"
              >
                Login Tim Gudang
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="md:hidden border-t border-slate-800/80 bg-slate-900/95 px-4 py-2 flex items-center justify-around text-xs">
          <Link
            href="/admin/dashboard"
            className="flex flex-col items-center gap-0.5 text-slate-300 hover:text-emerald-400 py-1"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px]">Dashboard</span>
          </Link>
          <Link
            href="/admin/inventory"
            className="flex flex-col items-center gap-0.5 text-slate-300 hover:text-emerald-400 py-1"
          >
            <Boxes className="w-4 h-4" />
            <span className="text-[10px]">Inventaris</span>
          </Link>
          <Link
            href="/admin/sop"
            className="flex flex-col items-center gap-0.5 text-slate-300 hover:text-cyan-400 py-1"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px]">SOP &amp; QC</span>
          </Link>
          <Link
            href="/admin/produksi"
            className="flex flex-col items-center gap-0.5 text-emerald-400 font-semibold py-1"
          >
            <Factory className="w-4 h-4" />
            <span className="text-[10px]">Produksi</span>
          </Link>
        </div>
      </header>

      {/* Main Admin Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <p>Sistem Operasional Pabrik & Distribusi PT KARYA SANG PRABU — WIRIDAN 318</p>
      </footer>
    </div>
  );
}
