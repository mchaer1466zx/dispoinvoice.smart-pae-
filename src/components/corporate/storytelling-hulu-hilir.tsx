import Image from "next/image";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export function StorytellingHuluHilir() {
  const steps = [
    {
      num: "01",
      tag: "Hulu & Bahan Baku",
      title: "Peternakan & Seleksi Bahan Baku Pilihan",
      subtitle: "Bahan Baku Segar, Halal Syar'i, Tanpa Kompromi",
      description:
        "Memastikan pasokan karkas daging sapi dan ayam bermutu tinggi langsung dari peternak terverifikasi. Setiap pemotongan dilakukan sesuai syariat Islam (Juleha) dengan pengawasan ketat terhadap kebersihan dan kualitas daging segar.",
      image: "/images/facilities/peternakan.webp",
      alt: "Peternakan sapi dan sumber bahan baku PT Karya Sang Prabu",
      highlights: [
        "Sertifikasi Halal Pemotongan RPU/RPH",
        "Bahan baku daging sapi segar >80% untuk adonan bakso",
        "Bebas bahan kimia pengawet berbahaya & formalin",
      ],
      kbli: "KBLI 4632 & 46322",
    },
    {
      num: "02",
      tag: "Proses & Manufaktur",
      title: "Pengolahan & Pengawetan Higienis Modern",
      subtitle: "Teknologi Blast Freezing & Resep Rempah Warisan",
      description:
        "Diolah di fasilitas produksi berstandar higienis tinggi dengan kapasitas 250.000 butir per hari. Mengombinasikan formula rempah nusantara asli dengan pembekuan cepat (blast freezer) untuk mengunci kesegaran, tekstur kenyal alami, dan nutrisi.",
      image: "/images/facilities/cleanroom.webp",
      alt: "Fasilitas cleanroom dan pengolahan higienis PT Karya Sang Prabu",
      highlights: [
        "Kapasitas produksi 250.000 butir / hari",
        "SOP higienis ruang produksi terkontrol (Cleanroom)",
        "Uji laboratorium berkala standar BPOM / P-IRT",
      ],
      kbli: "KBLI 10120 & 10790",
    },
    {
      num: "03",
      tag: "Hilir & Logistik",
      title: "Cold Storage -18°C & Distribusi Nasional",
      subtitle: "Rantai Dingin Terjaga hingga ke Meja Konsumen",
      description:
        "Didukung fasilitas pergudangan pendingin (Cold Storage) bersuhu stabil -18°C hingga -25°C dan armada logistik berpendingin. Menjamin produk berlabel SANG PRABU tiba dalam kondisi prima di jaringan distributor, horeka, dan retail se-Indonesia.",
      image: "/images/facilities/dapur.webp",
      alt: "Fasilitas pergudangan dan cold chain PT Karya Sang Prabu",
      highlights: [
        "Fasilitas Cold Storage berkapasitas besar suhu -18°C",
        "Armada distribusi reefer berinsulasi rantai dingin",
        "Jangkauan kemitraan agen, grosir, dan retail nasional",
      ],
      kbli: "KBLI 52102 & 46323",
    },
  ];

  return (
    <section
      aria-label="Storytelling Hulu-Hilir PT Karya Sang Prabu"
      className="relative isolate bg-[#04170c] py-20 sm:py-28 lg:py-32 text-white overflow-hidden"
    >
      {/* Background Decorative Rings */}
      <div className="pointer-events-none absolute -left-36 top-1/3 size-96 rounded-full bg-emerald-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-36 bottom-1/3 size-96 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Story Narrative Lead) */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="size-3.5 text-amber-300" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Integrasi Hulu ke Hilir
            </span>
          </div>

          <h2 className="mt-5 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
            Dedikasi Mutu dari <span className="text-amber-400">Hulu Peternakan</span> hingga{" "}
            <span className="text-emerald-300">Meja Makan</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-emerald-100/80 leading-relaxed">
            Menghadirkan pangan olahan halal berkualitas tinggi bukan sekadar proses memasak, melainkan ekosistem
            terpadu yang mengawal setiap titik kritis dari sumber bahan baku hingga rantai pasok dingin.
          </p>
        </div>

        {/* 3-Step Asymmetrical Storyline Cards */}
        <div className="mt-16 sm:mt-20 space-y-12 sm:space-y-16">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                key={step.num}
                className={`grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-center rounded-3xl border border-white/10 bg-gradient-to-br from-[#072415]/90 via-[#04190e]/90 to-[#020d07]/90 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-amber-400/30`}
              >
                {/* Visual Media Column */}
                <div
                  className={`lg:col-span-6 relative ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-amber-400/20 shadow-xl group">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Badge on Image */}
                    <div className="absolute top-3 left-3 rounded-lg border border-amber-400/40 bg-black/80 px-3 py-1 font-mono text-xs font-bold text-amber-300 backdrop-blur-md">
                      {step.kbli}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="font-serif text-sm font-semibold text-white/90">
                        PT Karya Sang Prabu Standard
                      </span>
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300 border border-emerald-400/30">
                        Terverifikasi
                      </span>
                    </div>
                  </div>
                </div>

                {/* Narrative Text Column */}
                <div
                  className={`lg:col-span-6 flex flex-col items-start ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-3xl sm:text-4xl font-black text-amber-400/80">
                      {step.num}
                    </span>
                    <span className="h-4 w-px bg-amber-400/40" />
                    <span className="rounded-md border border-emerald-400/30 bg-emerald-950/60 px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-emerald-300">
                      {step.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                    {step.title}
                  </h3>

                  <p className="mt-1 font-serif text-sm font-medium italic text-amber-200/90">
                    {step.subtitle}
                  </p>

                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-emerald-100/85">
                    {step.description}
                  </p>

                  {/* Highlights List */}
                  <ul className="mt-6 space-y-2.5 w-full">
                    {step.highlights.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Story Bottom Bridge to Company Profile */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-emerald-950/40 to-black/60 p-6 sm:p-8 backdrop-blur-xl">
          <div>
            <h4 className="font-serif text-lg sm:text-xl font-bold text-white">
              Pelajari Ekosistem Operasional Lengkap Kami
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/80">
              Company profile resmi memuat data kapasitas pabrik, legalitas KBLI, sertifikat Halal, dan struktur manajemen.
            </p>
          </div>
          <Link
            href="/company-profile"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 transition-all hover:bg-amber-300 shadow-lg active:scale-95"
          >
            <span>Buka Company Profile</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
