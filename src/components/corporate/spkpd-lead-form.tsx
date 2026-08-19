"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Send,
  CheckCircle2,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export function SpkpdLeadForm() {
  const [formData, setFormData] = useState({
    picName: "",
    jobTitle: "",
    companyName: "",
    businessType: "Restoran / Horeka",
    whatsapp: "",
    email: "",
    sampleRequests: ["Bakso Sapi Premium", "Dimsum Siap Kukus"],
    monthlyVolumeKg: "500–1.000 Kg",
    address: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSample = (product: string) => {
    setFormData((prev) => {
      const exists = prev.sampleRequests.includes(product);
      if (exists) {
        return {
          ...prev,
          sampleRequests: prev.sampleRequests.filter((p) => p !== product),
        };
      } else {
        return {
          ...prev,
          sampleRequests: [...prev.sampleRequests, product],
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Permohonan Berhasil Dikirim!", {
        description:
          "Draf SPKPD dan sampel produk Wiridan 318 Anda telah dicatat. Tim Sales akan segera menghubungi WhatsApp Anda.",
        duration: 5000,
      });
    }, 800);
  };

  const getWhatsAppForwardUrl = () => {
    const text = `*PENGAJUAN DRAFT SPKPD & SAMPEL PRODUK — PT KARYA SANG PRABU*
=========================================
• *Nama PIC*: ${formData.picName} (${formData.jobTitle || "Penanggung Jawab"})
• *Perusahaan / Usaha*: ${formData.companyName}
• *Kategori*: ${formData.businessType}
• *WhatsApp*: ${formData.whatsapp}
• *Email*: ${formData.email || "-"}
• *Kebutuhan Rutin*: ${formData.monthlyVolumeKg} / bulan
• *Sampel yang Diminta*: ${formData.sampleRequests.join(", ") || "Semua Varian 318"}
• *Alamat Pengiriman*: ${formData.address}
• *Catatan Tambahan*: ${formData.notes || "-"}
=========================================
Mohon dapat dikirimkan konfirmasi pengiriman sampel uji coba dan draf resmi SPKPD. Terima kasih.`;

    return `https://wa.me/628893663031?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="lead-form" className="relative isolate bg-[#020b05] py-24 text-white sm:py-32">
      {/* Background Ambience */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, #06331c 0%, #03140a 60%, #000000 100%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 backdrop-blur-md">
            <FileText className="size-4 text-amber-300" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
              Kemitraan Institusi &amp; B2B
            </span>
          </div>

          <h2 className="mt-5 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Permohonan Draft SPKPD &amp; Sampel Uji Coba
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-emerald-100/80 sm:text-base">
            Bagi pengelola Horeka, distributor, katering, dan jaringan ritel: Dapatkan{" "}
            <strong>Surat Pra Kontrak Perjanjian Dagang (SPKPD)</strong> resmi serta paket tester
            sampel produk beku Wiridan 318 yang dikirim langsung dengan rantai dingin.
          </p>
        </div>

        <div className="mt-14 mx-auto max-w-4xl">
          {submitted ? (
            <div className="rounded-3xl border border-amber-400/50 bg-gradient-to-b from-[#082b19] via-[#051c10] to-[#020b06] p-8 text-center shadow-2xl backdrop-blur-md sm:p-12">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/40">
                <CheckCircle2 className="size-9" />
              </div>

              <h3 className="mt-5 font-serif text-2xl font-bold text-white sm:text-3xl">
                Permohonan Anda Telah Berhasil Dicatat
              </h3>

              <p className="mt-3 text-sm text-emerald-100/85 max-w-xl mx-auto leading-relaxed">
                Terima kasih <strong>{formData.picName}</strong> dari{" "}
                <strong>{formData.companyName}</strong>. Tim Manajemen Penjualan PT KARYA SANG
                PRABU akan memverifikasi alamat pengiriman dan menghubungi Anda via WhatsApp dalam
                1x24 jam kerja.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={getWhatsAppForwardUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3.5 text-xs font-bold text-slate-950 shadow-lg hover:from-amber-300 hover:to-yellow-400 transition-all"
                >
                  <Send className="size-4" />
                  <span>Kirim Tembusan Langsung ke WhatsApp Sales</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-semibold text-white hover:bg-white/10 transition-all"
                >
                  <span>Isi Formulir Baru</span>
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-amber-400/30 bg-[#051c10]/90 p-6 shadow-2xl backdrop-blur-md sm:p-10"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* 1. Nama PIC */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                    Nama Lengkap Penanggung Jawab (PIC) *
                  </label>
                  <div className="relative mt-2">
                    <User className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={formData.picName}
                      onChange={(e) => setFormData({ ...formData, picName: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-black/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* 2. Jabatan */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                    Jabatan / Posisi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Purchasing Manager / Owner"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* 3. Nama Perusahaan */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                    Nama Perusahaan / Brand Usaha *
                  </label>
                  <div className="relative mt-2">
                    <Building2 className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: PT Kuliner Nusantara / Resto Berkah"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-black/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* 4. Kategori Usaha */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                    Bidang / Kategori Usaha
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="Restoran / Horeka" className="bg-slate-900">
                      Restoran / Jaringan Horeka
                    </option>
                    <option value="Distributor Pangan" className="bg-slate-900">
                      Distributor Frozen Food
                    </option>
                    <option value="Supermarket / Retail Modern" className="bg-slate-900">
                      Supermarket / Retail Modern
                    </option>
                    <option value="Katering Industri & Hajatan" className="bg-slate-900">
                      Katering Industri &amp; Hajatan
                    </option>
                    <option value="Agen Wilayah" className="bg-slate-900">
                      Agen Wilayah / Reseller
                    </option>
                    <option value="Lainnya" className="bg-slate-900">
                      Lainnya
                    </option>
                  </select>
                </div>

                {/* 5. WhatsApp */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                    Nomor WhatsApp Aktif *
                  </label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-black/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* 6. Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                    Email Bisnis
                  </label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="purchasing@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-black/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* 7. Estimasi Kebutuhan Bulanan */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                    Estimasi Kebutuhan Rutin Per Bulan
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {["< 200 Kg", "200–500 Kg", "500–1.000 Kg", "> 1.000 Kg (Kontrak Khusus)"].map(
                      (vol) => (
                        <button
                          key={vol}
                          type="button"
                          onClick={() => setFormData({ ...formData, monthlyVolumeKg: vol })}
                          className={`rounded-xl border p-2.5 text-center text-xs transition-all ${
                            formData.monthlyVolumeKg === vol
                              ? "border-amber-400 bg-amber-400/20 font-bold text-amber-300 ring-1 ring-amber-400"
                              : "border-white/10 bg-black/20 text-slate-400 hover:bg-white/5"
                          }`}
                        >
                          {vol}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* 8. Pilihan Sampel Produk */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                    Pilih Varian Sampel Tester yang Ingin Diuji (Official 8 SKU)
                  </label>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {[
                      { code: "B-01", name: "Bakso Goreng Renyah (500g)" },
                      { code: "B-02", name: "Bakso Ayam Kenyal (500g)" },
                      { code: "B-03", name: "Bakso Sapi Medium (500g)" },
                      { code: "B-04", name: "Bakso Urat Sapi (500g)" },
                      { code: "B-05", name: "Bakso Sapi Premium (500g)" },
                      { code: "C-01", name: "Otak-Otak Ikan Tenggiri (500g)" },
                      { code: "D-01", name: "Dimsum Siomay Ayam (500g)" },
                      { code: "D-02", name: "Dimsum Mix Platter (500g)" },
                    ].map((item) => {
                      const itemLabel = `[${item.code}] ${item.name}`;
                      const checked = formData.sampleRequests.includes(itemLabel);
                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => toggleSample(itemLabel)}
                          className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                            checked
                              ? "border-amber-400 bg-amber-400/15 text-white font-semibold ring-1 ring-amber-400"
                              : "border-white/10 bg-black/30 text-slate-400 hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                              {item.code}
                            </span>
                            <span className="text-xs">{item.name}</span>
                          </div>
                          <div
                            className={`flex size-4 items-center justify-center rounded border ${
                              checked ? "border-amber-400 bg-amber-400 text-slate-950" : "border-slate-500"
                            }`}
                          >
                            {checked && <CheckCircle2 className="size-3.5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 9. Alamat Pengiriman Sample */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                    Alamat Lengkap Pengiriman Sampel / Gudang *
                  </label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                    <textarea
                      required
                      rows={2}
                      placeholder="Nama jalan, nomor gedung, kelurahan, kecamatan, kota/kabupaten, dan kode pos untuk kirim tester cold-chain..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-black/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* 10. Catatan Tambahan */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                    Catatan Kebutuhan Khusus (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Jadwal pengiriman rutin mingguan, kebutuhan OEM / Maklon, syarat term pembayaran, dll..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                  <span>Data Anda terlindungi &amp; hanya digunakan untuk proses SPKPD resmi.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-8 py-3.5 text-xs font-bold text-slate-950 shadow-lg hover:from-amber-300 hover:to-yellow-400 transition-all disabled:opacity-60 active:scale-98"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Memproses Pengajuan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      <span>Kirim Permohonan SPKPD &amp; Sampel</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
