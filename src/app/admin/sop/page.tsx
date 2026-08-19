import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Factory,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Standard Operating Procedures (SOP) Pabrik & QC | PAE & Sang Prabu",
  description:
    "Panduan operasional harian terstandarisasi untuk penerimaan bahan baku, pengolahan daging, kontrol suhu cold-chain, dan higienitas BPOM/HACCP.",
};

const MASTER_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1mAAp_WJxcn_6HicYvZOZFnRCltDLOOY7/edit?usp=sharing&ouid=104881329468353555970&rtpof=true&sd=true";

export default function AdminSopPage() {
  return (
    <div className="flex-1 bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Masthead Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="size-3.5" />
              <span>SOP Standardized Operational Guide &bull; Site 2 &amp; Site 1</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Portal SOP &amp; Kontrol Mutu Pabrik Pangan
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Standar baku operasional PT Prima Andalas Energi (PAE) &amp; PT Karya Sang Prabu — Wiridan 318.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={MASTER_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950 transition hover:bg-emerald-500"
            >
              <ExternalLink className="size-4" />
              <span>Buka Master Google Sheets</span>
            </a>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <Factory className="size-4 text-emerald-400" />
              <span>Dashboard HPP &amp; Batch</span>
            </Link>
          </div>
        </div>

        {/* CONSTRAINT SITE 2 CALLOUT */}
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/30 p-5 text-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="font-bold text-amber-300">
                Constraint Fasilitas Site 2 (Pilot Skala Kecil &bull; Lebar 2,5m):
              </p>
              <p className="text-amber-200/90 leading-relaxed">
                Karena keterbatasan lebar 2,5 meter, lini produksi <strong>TIDAK BOLEH</strong> berjalan simultan untuk banyak kategori. Gunakan <strong>Sistem Produksi Bergantian per Hari/Shift</strong> (contoh: Shift A: Bakso Sapi, Shift B: Dimsum/Otak-otak) dengan sanitasi total (Clean-In-Place) antar-batch.
              </p>
            </div>
          </div>
        </div>

        {/* SOP GRID */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* SOP 01 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-mono font-bold text-xs">
                  01
                </span>
                <h2 className="font-bold text-base text-white">
                  Penerimaan Bahan Baku &amp; QC Masuk
                </h2>
              </div>
              <span className="rounded bg-blue-950/60 px-2 py-0.5 text-[10px] font-semibold text-blue-300 border border-blue-800/40">
                Raw Material QC
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Pemeriksaan Suhu Dingin:</strong> Daging beku wajib &le; -18&deg;C; daging segar/chilled 0&deg;C s.d. 4&deg;C saat tiba. Catat pada thermo-log penerimaan.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Verifikasi Halal &amp; Dokumen:</strong> Cek sertifikat halal RPH (Rumah Potong Hewan) resmi &amp; surat jalan pemasok Sang Prabu.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Uji Organoleptik:</strong> Warna daging merah segar/alami, tekstur kenyal elastis, bebas bau asam/busuk, tidak berlendir.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Timbangan Presisi (Scale Calibration):</strong> Timbang berat tara &amp; netto setiap karung/box untuk mencegah selisih rendemen HPP.</span>
              </li>
            </ul>
          </div>

          {/* SOP 02 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs">
                  02
                </span>
                <h2 className="font-bold text-base text-white">
                  Alur Produksi &amp; Pencetakan Site 2
                </h2>
              </div>
              <span className="rounded bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-800/40">
                Manufacturing
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Meat Washing Sink:</strong> Daging dicuci bersih di sink 3 kompartemen stainless steel 304 sebelum masuk gilingan.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Penggilingan &amp; Silent Cutter:</strong> Giling kasar &rarr; giling halus dengan penambahan es batu serut. Jaga suhu emulsi adonan &lt; 12&deg;C.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Pencetakan &amp; Pre-Cooking Tank:</strong> Mesin cetak bakso mencetak butir seragam ke tangki pre-cook suhu 60–70&deg;C (15 menit).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Tangki Pematangan (Boiling Tank):</strong> Rebus di suhu 85–90&deg;C selama 20 menit hingga matang sempurna, lalu tiriskan ke cooling bath.</span>
              </li>
            </ul>
          </div>

          {/* SOP 03 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold text-xs">
                  03
                </span>
                <h2 className="font-bold text-base text-white">
                  Cold Chain, Blast Freezing &amp; Logistik
                </h2>
              </div>
              <span className="rounded bg-cyan-950/60 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-800/40">
                -18&deg;C Cold Chain
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Blast Freezer (-35&deg;C s.d. -40&deg;C):</strong> Masukkan produk pasca-tiris ke blast freezer selama 2–3 jam hingga inti beku sempurna.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Vakum Kedap Udara &amp; Kartonisasi:</strong> Kemas dengan vacuum sealer 500g, print batch code &amp; exp date, susun 20–24 pack/karton.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Penyimpanan Cold Storage:</strong> Suhu freezer room wajib stabil di &le; -18&deg;C. Log suhu dicek 3x sehari (08.00, 13.00, 17.00 WIB).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Distribusi FIFO:</strong> Pengeluaran stok mengikuti prinsip First-In First-Out menggunakan armada thermo-box berpendingin.</span>
              </li>
            </ul>
          </div>

          {/* SOP 04 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 font-mono font-bold text-xs">
                  04
                </span>
                <h2 className="font-bold text-base text-white">
                  Sanitasi, Higienitas &amp; Standar BPOM/HACCP
                </h2>
              </div>
              <span className="rounded bg-amber-950/60 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-800/40">
                K3 &amp; Compliance
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Protokol APD Personil:</strong> Wajib memakai hairnet, masker 3-ply, celemek karet, sarung tangan nitril, &amp; boots khusus area basah.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Handwashing &amp; Footbath:</strong> Cuci tangan sabun antibakteri 20 detik + semprot alkohol 70% sebelum menyentuh peralatan.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Sanitasi Mesin Pasca-Produksi:</strong> Bersihkan silent cutter, grinder, dan cetakan dengan air panas 80&deg;C + desinfektan food grade.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Metal Detector &amp; QC Sampel:</strong> Uji sampel acak dengan metal detector untuk menjamin 0% kontaminan fisik logam.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* GOOGLE SHEETS LIVE INTEGRATION CARD */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-6 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <FileText className="size-3.5" />
                <span>Live Google Sheets Operational Database</span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-white sm:text-xl">
                Sinkronisasi Spreadsheet Finansial, Inventaris &amp; Log Harian
              </h3>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm text-slate-300">
                Dokumen operasional multi-sheet yang memuat data RAB, stok bahan baku hulu, biaya konversi manufaktur, dan rekapitulasi penjualan B2B.
              </p>
            </div>

            <div className="shrink-0">
              <a
                href={MASTER_SHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-950 transition hover:bg-emerald-400"
              >
                <span>Buka Master Google Spreadsheet</span>
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
