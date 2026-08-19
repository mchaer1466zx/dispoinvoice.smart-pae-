"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Factory,
  Boxes,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { loginAction, adminQuickLoginAction } from "@/app/actions/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@primaprabu.co.id");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<"admin" | "gudang" | null>(null);

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email dan kata sandi wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await loginAction({ email, password });
      if (res.success) {
        toast.success(`Selamat datang kembali, ${res.user.name}!`);
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        toast.error(res.error || "Email atau kata sandi tidak cocok.");
      }
    } catch {
      toast.error("Terjadi kendala saat login. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickLogin(roleType: "admin" | "gudang") {
    setQuickLoading(roleType);
    try {
      const res = await adminQuickLoginAction(roleType);
      if (res.success) {
        toast.success(`Berhasil masuk sebagai ${res.user.name}`);
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        toast.error(res.error || "Gagal melakukan quick login.");
      }
    } catch {
      toast.error("Terjadi kendala login otomatis.");
    } finally {
      setQuickLoading(null);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-xl shadow-emerald-950/60 mb-2">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-emerald-400">
              <Factory className="w-7 h-7" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Gerbang Tim Gudang & Admin
          </h1>
          <p className="text-sm text-slate-400">
            Akses Manajemen Inventaris & Formulasi Batch Produksi WIRIDAN 318
          </p>
        </div>

        {/* Quick Instant Access Buttons */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Akses Cepat (Demo / Staf Gudang)
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">1-Klik Langsung Masuk</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleQuickLogin("gudang")}
              disabled={!!quickLoading || loading}
              className="flex flex-col text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 transition-all group disabled:opacity-50"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Boxes className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] bg-emerald-950/80 text-emerald-300 font-semibold px-1.5 py-0.5 rounded border border-emerald-800/50">
                  Gudang
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                Tim Produksi & Gudang
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Stok bahan baku & eksekusi batch
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("admin")}
              disabled={!!quickLoading || loading}
              className="flex flex-col text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 transition-all group disabled:opacity-50"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] bg-amber-950/80 text-amber-300 font-semibold px-1.5 py-0.5 rounded border border-amber-800/50">
                  Admin
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                Admin Operasional
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                HPP, valuasi & kontrol menyeluruh
              </span>
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase tracking-wider">
              Atau Masuk dengan Kredensial
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Manual Form */}
          <form onSubmit={handleManualSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Akun
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@primaprabu.co.id"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Kata Sandi
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!quickLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <span>Masuk ke Dashboard Gudang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Note */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sesi diamankan dengan otentikasi terenkripsi PT KARYA SANG PRABU</span>
        </div>
      </div>
    </div>
  );
}
