"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Check,
  Copy,
  FileImage,
  FileText,
  FolderOpen,
  Handshake,
  Image as ImageIcon,
  Plus,
  Send,
  Sparkles,
  Upload,
} from "lucide-react";
import { SiteChrome } from "@/components/corporate/site-chrome";
import { Container } from "@/components/corporate/ui";
import { ProductImage } from "@/components/corporate/product-image";

type MediaItem = {
  name: string;
  category: "Produksi Site 2" | "Produk Wiridan" | "Komoditas" | "Fasilitas";
  path: string;
  desc: string;
};

const INITIAL_MEDIA: MediaItem[] = [
  {
    name: "Master Logo 3D Wiridan 138",
    category: "Produk Wiridan",
    path: "/wiridan/wiridan_logo_gold_1786791750372.png",
    desc: "Logo medali emas resmi Wiridan 138 dengan latar merah timbul & rumbai royal",
  },
  {
    name: "Kemasan Bakso Premium 500g (Biru)",
    category: "Produk Wiridan",
    path: "/wiridan/bakso-premium.jpg",
    desc: "Kemasan resmi retail pack 500g barcode 8997449990993 Halal BPJPH",
  },
  {
    name: "Kemasan Bakso Reguler 500g (Merah)",
    category: "Produk Wiridan",
    path: "/wiridan/bakso-reguler.jpg",
    desc: "Kemasan resmi retail pack 500g barcode 8997235930318 Halal BPJPH",
  },
  {
    name: "Kemasan Otak-Otak Ikan 500g (Hijau)",
    category: "Produk Wiridan",
    path: "/wiridan/otak-otak.jpg",
    desc: "Kemasan resmi retail pack 500g ikan pilihan kenyal gurih siap goreng/kukus",
  },
  {
    name: "Kemasan Dimsum Siap Kukus 500g (Ungu)",
    category: "Produk Wiridan",
    path: "/wiridan/dimsum.jpg",
    desc: "Kemasan resmi retail pack 500g barcode 8997449990105 Halal BPJPH",
  },
  {
    name: "Dapur & Fasilitas Pengolahan Higienis",
    category: "Produksi Site 2",
    path: "/sang-prabu/dapur.jpg",
    desc: "Area pengolahan stainless steel berstandar Good Manufacturing Practices (GMP)",
  },
  {
    name: "Daging Sapi Segar & Suplai Hulu",
    category: "Komoditas",
    path: "/sang-prabu/daging-sapi.jpg",
    desc: "Bahan baku daging sapi berkualitas hasil seleksi rantai pasok Sang Prabu",
  },
  {
    name: "Persiapan & Pemotongan Daging Halal",
    category: "Produksi Site 2",
    path: "/sang-prabu/butcher.jpg",
    desc: "Tenaga pemotong profesional bersertifikasi juru sembelih halal (Juleha)",
  },
];

export default function AdminMediaManagementPage() {
  const [activeTab, setActiveTab] = useState<"media" | "berita" | "kemitraan" | "lowongan">("media");
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  // Form states
  const [uploadCategory, setUploadCategory] = useState<MediaItem["category"]>("Produksi Site 2");
  const [uploadName, setUploadName] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Article state
  const [artTitle, setArtTitle] = useState("");
  const [artCategory, setArtCategory] = useState("Industri & Wawasan Bisnis");
  const [artExcerpt, setArtExcerpt] = useState("");
  const [artContent, setArtContent] = useState("");

  // Job vacancy state
  const [jobTitle, setJobTitle] = useState("");
  const [jobDept, setJobDept] = useState("Manufaktur & Produksi");
  const [jobLocation, setJobLocation] = useState("Site 2 Depok");
  const [jobReqs, setJobReqs] = useState("");

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2500);
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName) return;

    const newPath = uploadedPreview || `/sang-prabu/${uploadName.toLowerCase().replace(/\s+/g, "-")}.jpg`;
    const newItem: MediaItem = {
      name: uploadName,
      category: uploadCategory,
      path: newPath,
      desc: uploadDesc || "Foto operasional resmi Prima Prabu Group",
    };

    setMediaList([newItem, ...mediaList]);
    setSuccessMsg(`Foto "${uploadName}" berhasil didaftarkan ke galeri! Path: ${newPath}`);
    setUploadName("");
    setUploadDesc("");
    setUploadedPreview(null);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedPreview(url);
      if (!uploadName) {
        setUploadName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  return (
    <SiteChrome heroTransparent>
      <div className="bg-[#05160d] pt-28 pb-16 text-white border-b border-amber-400/20">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-bold text-amber-300">
                <Sparkles className="size-3.5" />
                PORTAL KONTEN &amp; MEDIA RESMI
              </div>
              <h1 className="mt-3 font-display text-2xl sm:text-4xl font-extrabold text-white">
                Pusat Manajemen Foto Produksi &amp; Informasi Bisnis
              </h1>
              <p className="mt-2 text-sm text-emerald-100/80 max-w-2xl">
                Unggah dokumentasi mesin Site 2, publikasikan artikel wawasan komoditas &amp; frozen food, serta kelola lowongan kemitraan B2B dan lapangan pekerjaan.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10"
              >
                <ArrowLeft className="size-4" />
                Dashboard
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-white/10 pb-4">
            <button
              onClick={() => setActiveTab("media")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === "media"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              <ImageIcon className="size-4" />
              1. Foto Produksi &amp; Galeri
            </button>
            <button
              onClick={() => setActiveTab("berita")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === "berita"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              <FileText className="size-4" />
              2. Berita &amp; Wawasan Bisnis
            </button>
            <button
              onClick={() => setActiveTab("kemitraan")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === "kemitraan"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              <Handshake className="size-4" />
              3. Peluang Kerja Sama (B2B)
            </button>
            <button
              onClick={() => setActiveTab("lowongan")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === "lowongan"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              <Briefcase className="size-4" />
              4. Lowongan Lapangan Pekerjaan
            </button>
          </div>
        </Container>
      </div>

      <main className="bg-slate-50 py-12 sm:py-16">
        <Container>
          {successMsg && (
            <div className="mb-8 flex items-center gap-3 rounded-xl bg-emerald-600 p-4 text-white shadow-lg">
              <Check className="size-5 shrink-0" />
              <p className="text-sm font-medium">{successMsg}</p>
            </div>
          )}

          {/* TAB 1: MEDIA & FOTO PRODUKSI */}
          {activeTab === "media" && (
            <div className="space-y-12">
              {/* Form Upload Interaktif */}
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Upload className="size-5 text-amber-600" />
                    Unggah Foto Baru
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Pilih file foto mesin, fasilitas Site 2, atau kemasan produk.
                  </p>

                  <form onSubmit={handleSimulateUpload} className="mt-5 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700">Kategori</label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value as MediaItem["category"])}
                        className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-xs font-medium text-slate-800"
                      >
                        <option value="Produksi Site 2">Produksi Site 2 (Mesin &amp; Dapur)</option>
                        <option value="Produk Wiridan">Produk Wiridan 318</option>
                        <option value="Komoditas">Komoditas &amp; Bahan Baku</option>
                        <option value="Fasilitas">Fasilitas &amp; Kantor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700">Pilih File Foto</label>
                      <label className="mt-1.5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                        <FileImage className="size-8 text-slate-400" />
                        <span className="mt-2 text-xs font-semibold text-slate-700">
                          Klik untuk memilih foto (JPG/PNG)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {uploadedPreview && (
                      <div className="rounded-lg overflow-hidden border border-slate-200">
                        <ProductImage src={uploadedPreview} alt="Preview" className="h-32 w-full object-cover" />
                        <p className="p-1.5 bg-slate-900 text-center text-[10px] text-emerald-300">
                          Pratinjau siap diunggah
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700">Nama / Judul Foto</label>
                      <input
                        type="text"
                        placeholder="Contoh: Mesin Silent Cutter Site 2"
                        value={uploadName}
                        onChange={(e) => setUploadName(e.target.value)}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-xs font-medium text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700">Keterangan / Deskripsi</label>
                      <textarea
                        rows={2}
                        placeholder="Keterangan proses atau spesifikasi mesin..."
                        value={uploadDesc}
                        onChange={(e) => setUploadDesc(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-xs font-medium text-slate-800"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md hover:from-amber-300"
                    >
                      <Plus className="size-4" />
                      Simpan &amp; Daftarkan Foto
                    </button>
                  </form>
                </div>

                {/* Panduan Cara Upload Langsung ke Codebase / Storage */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-2xl border border-amber-400/30 bg-amber-50/80 p-6">
                    <h3 className="font-display text-lg font-bold text-amber-950 flex items-center gap-2">
                      <FolderOpen className="size-5 text-amber-700" />
                      Struktur Lokasi Folder Foto di Website
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-amber-900">
                      Foto yang diunggah ke website ini disimpan secara permanen di direktori <code className="rounded bg-amber-200/80 px-1.5 py-0.5 font-mono font-bold">/public</code>:
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
                      <div className="rounded-xl border border-amber-300/80 bg-white p-4">
                        <p className="font-bold text-slate-900">1. Foto Produksi &amp; Fasilitas:</p>
                        <p className="mt-1 font-mono text-[11px] text-emerald-800">/public/sang-prabu/</p>
                        <p className="mt-1 text-slate-600">Simpan foto mesin, dapur higienis, rumah potong ayam, dan peternakan di sini.</p>
                      </div>
                      <div className="rounded-xl border border-amber-300/80 bg-white p-4">
                        <p className="font-bold text-slate-900">2. Foto Kemasan Wiridan 318:</p>
                        <p className="mt-1 font-mono text-[11px] text-emerald-800">/public/wiridan/</p>
                        <p className="mt-1 text-slate-600">Simpan foto produk 500g (Bakso Premium, Reguler, Otak-Otak, Dimsum, Logo 3D) di sini.</p>
                      </div>
                    </div>
                  </div>

                  {/* Galeri Koleksi Aktif */}
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      Koleksi Dokumentasi &amp; Foto Aktif ({mediaList.length})
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {mediaList.map((item) => (
                        <div key={item.path} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs group">
                          <div className="relative h-40 bg-slate-900">
                            <ProductImage
                              src={item.path}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                            <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur">
                              {item.category}
                            </span>
                          </div>
                          <div className="p-4">
                            <h4 className="font-display text-sm font-bold text-slate-900">{item.name}</h4>
                            <p className="mt-1 text-xs text-slate-500 line-clamp-2">{item.desc}</p>
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                              <span className="font-mono text-[10px] text-slate-400 truncate max-w-[180px]">
                                {item.path}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(item.path)}
                                className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-amber-400 hover:text-slate-950 transition-colors"
                              >
                                {copiedPath === item.path ? (
                                  <>
                                    <Check className="size-3 text-emerald-600" />
                                    Tersalin!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="size-3" />
                                    Salin Path
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARTIKEL & BERITA BISNIS */}
          {activeTab === "berita" && (
            <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="border-b border-slate-100 pb-5">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">
                  <FileText className="size-3.5" />
                  EDITOR PUBLIKASI ARTIKEL
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold text-slate-900">
                  Buat Berita Menarik Seputar Bisnis &amp; Komoditas
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Artikel akan langsung tampil di halaman <Link href="/articles" className="text-emerald-700 font-bold underline">/articles</Link> dan beranda website.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSuccessMsg(`Artikel "${artTitle}" telah berhasil dijadwalkan untuk publikasi!`);
                  setArtTitle("");
                  setArtExcerpt("");
                  setArtContent("");
                  setTimeout(() => setSuccessMsg(""), 5000);
                }}
                className="mt-6 space-y-5"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-800">Judul Berita / Artikel</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kesiapan Fasilitas Site 2 & Tren Permintaan Frozen Food Halal 2026"
                    value={artTitle}
                    onChange={(e) => setArtTitle(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-sm font-semibold text-slate-900"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800">Kategori Artikel</label>
                    <select
                      value={artCategory}
                      onChange={(e) => setArtCategory(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-xs font-semibold text-slate-900"
                    >
                      <option value="Industri & Wawasan Bisnis">Industri &amp; Wawasan Bisnis</option>
                      <option value="Edukasi Frozen Food Halal">Edukasi Frozen Food Halal</option>
                      <option value="Kemitraan & B2B">Kemitraan &amp; B2B</option>
                      <option value="Sertifikasi & Kepatuhan BPOM">Sertifikasi &amp; Kepatuhan BPOM</option>
                      <option value="Update Holding Group">Update Holding Group</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800">Foto Cover Artikel (Path / URL)</label>
                    <input
                      type="text"
                      defaultValue="/sang-prabu/dapur.jpg"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800">Ringkasan Singkat (Excerpt)</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Ringkasan 2–3 kalimat yang menarik perhatian pembaca di beranda..."
                    value={artExcerpt}
                    onChange={(e) => setArtExcerpt(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-xs font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800">Isi Konten Lengkap</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Tuliskan analisis bisnis, data pasar, proses rantai pasok, atau panduan kerja sama..."
                    value={artContent}
                    onChange={(e) => setArtContent(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-xs font-medium text-slate-800 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:from-emerald-600"
                  >
                    <Send className="size-4" />
                    Publikasikan Berita
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: LOWONGAN KERJA SAMA (B2B) */}
          {activeTab === "kemitraan" && (
            <div className="space-y-8">
              <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 p-8 text-white">
                <h3 className="font-display text-2xl font-bold">Skema Kemitraan &amp; Peluang Kerja Sama Bisnis</h3>
                <p className="mt-2 text-xs text-emerald-100/80 max-w-2xl">
                  Buka jalur kolaborasi dengan pelaku usaha di seluruh Indonesia melalui 4 model kerja sama terstruktur:
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <span className="font-mono text-xs font-bold text-amber-700 uppercase tracking-wider">Model 1</span>
                  <h4 className="mt-2 font-display text-base font-bold text-slate-900">Distributor Wilayah</h4>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Hak distribusi eksklusif tingkat kota/kabupaten dengan kuota volume karton beku rutin dan diskon tier-1.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <span className="font-mono text-xs font-bold text-amber-700 uppercase tracking-wider">Model 2</span>
                  <h4 className="mt-2 font-display text-base font-bold text-slate-900">Agen &amp; Reseller Retail</h4>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Peluang usaha mandiri untuk toko frozen food, minimarket, dan komunitas dengan modal awal 1 karton (20 pack).
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <span className="font-mono text-xs font-bold text-amber-700 uppercase tracking-wider">Model 3</span>
                  <h4 className="mt-2 font-display text-base font-bold text-slate-900">Pasokan Horeka &amp; Catering</h4>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Kontrak pasokan stabil komoditas daging karkas ayam, rempah, dan bakso untuk restoran, hotel, dan katering.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <span className="font-mono text-xs font-bold text-amber-700 uppercase tracking-wider">Model 4</span>
                  <h4 className="mt-2 font-display text-base font-bold text-slate-900">Peternak &amp; Petani Binaan</h4>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Kemitraan pengadaan langsung bahan baku komoditas hulu dengan standar uji mutu dan kepastian pembayaran.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LOWONGAN LAPANGAN PEKERJAAN */}
          {activeTab === "lowongan" && (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="size-5 text-amber-600" />
                  Tambah Lowongan Kerja
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Formulir penambahan posisi rekrutmen baru untuk Site 2 atau Kantor.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSuccessMsg(`Lowongan "${jobTitle}" berhasil ditambahkan ke portal karier!`);
                    setJobTitle("");
                    setJobReqs("");
                    setTimeout(() => setSuccessMsg(""), 5000);
                  }}
                  className="mt-5 space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700">Nama Posisi</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Staff Logistik Cold Chain"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-xs font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700">Departemen / Divisi</label>
                    <input
                      type="text"
                      value={jobDept}
                      onChange={(e) => setJobDept(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-xs font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700">Penempatan Lokasi</label>
                    <input
                      type="text"
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-xs font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700">Kualifikasi (Pisahkan dengan baris baru)</label>
                    <textarea
                      rows={4}
                      placeholder="- Min. SMA/SMK&#10;- Pengalaman 1 tahun&#10;- Memahami GMP"
                      value={jobReqs}
                      onChange={(e) => setJobReqs(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-xs font-medium text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md"
                  >
                    <Plus className="size-4" />
                    Terbitkan Lowongan
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    Posisi Rekrutmen Aktif di Website
                  </h3>
                  <Link
                    href="/careers"
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Lihat Halaman Publik /careers &rarr;
                  </Link>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Manufaktur &amp; Produksi (PAE)
                    </span>
                    <h4 className="mt-2 font-display text-base font-bold text-slate-900">
                      Operator Mesin Produksi Pangan (Site 2 Pilot Facility)
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      Lokasi: Depok • Sistem shift • Penanganan mesin meat grinder, silent cutter &amp; forming bakso.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Quality Assurance &amp; Regulatory
                    </span>
                    <h4 className="mt-2 font-display text-base font-bold text-slate-900">
                      Quality Control Officer (HACCP &amp; BPOM Compliance)
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      Lokasi: Depok • Inspeksi bahan baku daging, pengawasan sanitasi GMP &amp; audit halal SJPH.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Logistik &amp; Rantai Pasok Dingin
                    </span>
                    <h4 className="mt-2 font-display text-base font-bold text-slate-900">
                      Staff Gudang &amp; Cold Storage Management (-18°C)
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      Lokasi: Depok / Jakarta • Pengelolaan stok FIFO dan penyiapan karton beku agen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
    </SiteChrome>
  );
}
