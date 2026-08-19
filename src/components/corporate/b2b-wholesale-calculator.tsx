"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  Truck,
  Package,
  CheckCircle2,
  Layers,
  Building2,
  Sparkles,
  PhoneCall,
  FileText,
} from "lucide-react";

interface ProductPriceConfig {
  id: string;
  code: string;
  name: string;
  category: string;
  piecesPerPack: number;
  packPerCarton: number;
  weightPerCartonKg: number;
  basePricePerPack: number; // Harga acuan satuan
  color: string;
}

const PRODUCTS_CONFIG: ProductPriceConfig[] = [
  {
    id: "b-01-bakso-goreng",
    code: "B-01",
    name: "Bakso Goreng (500g)",
    category: "Bakso",
    piecesPerPack: 22,
    packPerCarton: 24,
    weightPerCartonKg: 12,
    basePricePerPack: 34000,
    color: "#f59e0b",
  },
  {
    id: "b-02-bakso-ayam",
    code: "B-02",
    name: "Bakso Ayam Kenyal (500g)",
    category: "Bakso",
    piecesPerPack: 32,
    packPerCarton: 24,
    weightPerCartonKg: 12,
    basePricePerPack: 32000,
    color: "#f43f5e",
  },
  {
    id: "b-03-bakso-medium",
    code: "B-03",
    name: "Bakso Sapi Medium (500g)",
    category: "Bakso",
    piecesPerPack: 32,
    packPerCarton: 24,
    weightPerCartonKg: 12,
    basePricePerPack: 38000,
    color: "#10b981",
  },
  {
    id: "b-04-bakso-urat",
    code: "B-04",
    name: "Bakso Urat Sapi (500g)",
    category: "Bakso",
    piecesPerPack: 28,
    packPerCarton: 24,
    weightPerCartonKg: 12,
    basePricePerPack: 44000,
    color: "#3b82f6",
  },
  {
    id: "b-05-bakso-premium",
    code: "B-05",
    name: "Bakso Sapi Premium (500g)",
    category: "Bakso",
    piecesPerPack: 28,
    packPerCarton: 24,
    weightPerCartonKg: 12,
    basePricePerPack: 49000,
    color: "#eab308",
  },
  {
    id: "c-01-otak-otak",
    code: "C-01",
    name: "Otak-Otak Ikan Tenggiri (500g)",
    category: "Otak-Otak",
    piecesPerPack: 24,
    packPerCarton: 24,
    weightPerCartonKg: 12,
    basePricePerPack: 33000,
    color: "#059669",
  },
  {
    id: "d-01-dimsum-ayam",
    code: "D-01",
    name: "Dimsum Siomay Ayam (500g)",
    category: "Dimsum",
    piecesPerPack: 19,
    packPerCarton: 24,
    weightPerCartonKg: 12,
    basePricePerPack: 42000,
    color: "#06b6d4",
  },
  {
    id: "d-02-dimsum-mix",
    code: "D-02",
    name: "Dimsum Mix Platter (500g)",
    category: "Dimsum",
    piecesPerPack: 19,
    packPerCarton: 24,
    weightPerCartonKg: 12,
    basePricePerPack: 45000,
    color: "#8b5cf6",
  },
];

export function B2BWholesaleCalculator() {
  const [selectedProductId, setSelectedProductId] = useState<string>("all-mixed");
  const [cartonQty, setCartonQty] = useState<number>(50);
  const [clientType, setClientType] = useState<"agen" | "distributor" | "horeka" | "industri">("distributor");

  // Perhitungan Harga dan Diskon Volume
  const calculation = useMemo(() => {
    // Discount tier berdasarkan volume karton
    let discountPercent = 0;
    let tierName = "Retail / Agen Pemula";

    if (cartonQty >= 500) {
      discountPercent = 22;
      tierName = "Distributor Utama / Nasional (>500 Karton)";
    } else if (cartonQty >= 200) {
      discountPercent = 18;
      tierName = "Distributor Regional (200–499 Karton)";
    } else if (cartonQty >= 50) {
      discountPercent = 12;
      tierName = "Grosir Agen / Horeka Menengah (50–199 Karton)";
    } else {
      discountPercent = 5;
      tierName = "Paket Trial / Outlet Kecil (<50 Karton)";
    }

    const totalPacks = cartonQty * 24;
    const totalWeightKg = cartonQty * 12;
    const totalTonnage = (totalWeightKg / 1000).toFixed(2);

    let avgBasePrice = 39250;
    let totalPieces = 0;

    if (selectedProductId !== "all-mixed") {
      const prod = PRODUCTS_CONFIG.find((p) => p.id === selectedProductId);
      if (prod) {
        avgBasePrice = prod.basePricePerPack;
        totalPieces = totalPacks * prod.piecesPerPack;
      }
    } else {
      // Rata-rata 4 produk
      totalPieces = totalPacks * 26;
    }

    const discountedPricePerPack = Math.round(avgBasePrice * (1 - discountPercent / 100));
    const estimatedTotal = discountedPricePerPack * totalPacks;

    // Rekomendasi Armada Cold-Chain
    let fleetRecommendation = {
      name: "Mobil Box Pendingin CDE Reeffer (Engkel 4 Roda)",
      capacity: "Kapasitas muat s.d. 1.5–2.0 Ton (±120–160 Karton)",
      temp: "-18°C Terjaga Digital Thermometer",
      notes: "Ideal untuk pengiriman intra-kota Jabodetabek & antar kota Jawa Barat.",
    };

    if (cartonQty > 500) {
      fleetRecommendation = {
        name: "Kontainer Cold Storage Reeffer 20ft / Truk Tronton",
        capacity: "Kapasitas muat 10.0–15.0 Ton (±800–1.200 Karton)",
        temp: "-20°C Deep Frozen Bersertifikasi",
        notes: "Pengiriman antar-pulau (Sumatera, Kalimantan, Sulawesi, Bali) via jalur laut & darat.",
      };
    } else if (cartonQty > 150) {
      fleetRecommendation = {
        name: "Truk CDD Reeffer (Double 6 Roda Pendingin)",
        capacity: "Kapasitas muat 4.0–5.0 Ton (±350–420 Karton)",
        temp: "-18°C Terjaga Digital Thermometer",
        notes: "Pengiriman antar provinsi lintas Jawa-Bali dengan insulasi thermo king prima.",
      };
    }

    return {
      totalPacks,
      totalWeightKg,
      totalTonnage,
      totalPieces,
      discountPercent,
      tierName,
      discountedPricePerPack,
      estimatedTotal,
      fleetRecommendation,
    };
  }, [cartonQty, selectedProductId]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getWhatsAppURL = () => {
    const prodName =
      selectedProductId === "all-mixed"
        ? "Paket Campuran 4 Varian Wiridan 318"
        : PRODUCTS_CONFIG.find((p) => p.id === selectedProductId)?.name || "Produk Wiridan";

    const msg = `Halo Manajemen PT KARYA SANG PRABU, saya telah membuat simulasi pesanan grosir di website:
- Produk: ${prodName}
- Kategori Usaha: ${clientType.toUpperCase()}
- Jumlah: ${cartonQty} Karton (${calculation.totalPacks} Pack / ${calculation.totalWeightKg} Kg)
- Estimasi Tier: ${calculation.tierName} (${calculation.discountPercent}% Diskon)
- Estimasi Total: ${formatRupiah(calculation.estimatedTotal)}

Mohon informasi ketersediaan stok, pengiriman armada ${calculation.fleetRecommendation.name}, serta draft SPKPD resmi. Terima kasih.`;

    return `https://wa.me/628893663031?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section id="calculator" className="relative isolate bg-[#04150c] py-24 text-white sm:py-32">
      {/* Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle 800px at 50% 50%, #0a4025 0%, #031208 70%, #000000 100%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 backdrop-blur-md">
            <Calculator className="size-4 text-amber-300" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
              B2B &amp; Wholesale Simulator
            </span>
          </div>

          <h2 className="mt-5 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Kalkulator Pesanan Grosir &amp; Logistik Cold-Chain
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-emerald-100/80 sm:text-base">
            Simulasikan kebutuhan pasokan rutin restoran, jaringan supermarket, hotel, distributor,
            dan agen frozen food Anda dengan skema harga pabrik resmi{" "}
            <strong className="text-amber-300">PT KARYA SANG PRABU</strong>.
          </p>
        </div>

        {/* Interactive Grid: 2 Columns */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Form & Sliders */}
          <div className="rounded-3xl border border-amber-400/30 bg-[#061e12]/80 p-6 backdrop-blur-md lg:col-span-7 sm:p-8">
            <h3 className="flex items-center gap-2.5 font-serif text-xl font-bold text-white">
              <Layers className="size-5 text-amber-400" />
              <span>Parameter Kebutuhan Pasokan</span>
            </h3>

            {/* 1. Pilih Produk */}
            <div className="mt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                1. Pilih Varian Produk
              </label>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setSelectedProductId("all-mixed")}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                    selectedProductId === "all-mixed"
                      ? "border-amber-400 bg-amber-400/20 text-white font-bold ring-1 ring-amber-400"
                      : "border-white/10 bg-black/30 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <span className="text-xs">Campuran Aneka Varian (Semua 8 SKU Wiridan 318)</span>
                  {selectedProductId === "all-mixed" && (
                    <CheckCircle2 className="size-4 text-amber-400 shrink-0 ml-1" />
                  )}
                </button>

                {PRODUCTS_CONFIG.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProductId(p.id)}
                    className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                      selectedProductId === p.id
                        ? "border-amber-400 bg-amber-400/20 text-white font-bold ring-1 ring-amber-400"
                        : "border-white/10 bg-black/30 text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 shrink-0">
                        {p.code}
                      </span>
                      <span className="text-xs truncate">{p.name}</span>
                    </div>
                    {selectedProductId === p.id && (
                      <CheckCircle2 className="size-4 text-amber-400 shrink-0 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Tipe Profil Pembeli */}
            <div className="mt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                2. Profil Usaha / Institusi
              </label>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { id: "distributor", label: "Distributor", icon: Building2 },
                  { id: "horeka", label: "Horeka / Resto", icon: Sparkles },
                  { id: "agen", label: "Agen / Reseller", icon: Package },
                  { id: "industri", label: "Katering / Pabrik", icon: Layers },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setClientType(item.id as "distributor" | "horeka" | "agen" | "industri")}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center text-xs transition-all ${
                        clientType === item.id
                          ? "border-amber-400 bg-amber-400/20 font-bold text-amber-300 ring-1 ring-amber-400"
                          : "border-white/10 bg-black/20 text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Slider Jumlah Karton */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  3. Volume Pemesanan (Master Karton)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={2000}
                    value={cartonQty}
                    onChange={(e) => setCartonQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 rounded-lg border border-amber-400/50 bg-black/60 px-2.5 py-1 text-right font-mono text-sm font-bold text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <span className="text-xs font-semibold text-slate-400">Karton</span>
                </div>
              </div>

              {/* Slider Component */}
              <input
                type="range"
                min={5}
                max={1000}
                step={5}
                value={cartonQty}
                onChange={(e) => setCartonQty(parseInt(e.target.value))}
                className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-emerald-950 accent-amber-400"
              />

              {/* Quick Presets */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-400">Pilihan Cepat:</span>
                {[20, 50, 100, 250, 500, 1000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCartonQty(preset)}
                    className={`rounded-lg border px-2.5 py-1 font-mono text-xs transition-colors ${
                      cartonQty === preset
                        ? "border-amber-400 bg-amber-400 text-slate-950 font-bold"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {preset} Ktn
                  </button>
                ))}
              </div>
            </div>

            {/* Note Kemasan Standard */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <Package className="size-4 shrink-0" />
                <span>Spesifikasi Standar Master Karton:</span>
              </div>
              <p className="text-[11px] text-slate-400">
                • 1 Master Karton = <strong>24 Pack</strong> @ 500 gram (Berat Bersih: 12.0 Kg).
                <br />• Kemasan luar kardus tebal double-wall dengan insulasi suhu beku prima.
              </p>
            </div>
          </div>

          {/* Right Column: Hasil Kalkulasi & Estimasi */}
          <div className="flex flex-col justify-between rounded-3xl border border-amber-400/40 bg-gradient-to-b from-[#082b19] via-[#051c10] to-[#020b06] p-6 shadow-2xl backdrop-blur-md lg:col-span-5 sm:p-8">
            <div>
              <div className="flex items-center justify-between border-b border-amber-400/20 pb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
                    Tier Harga Grosir
                  </span>
                  <h4 className="font-serif text-lg font-bold text-white">
                    {calculation.tierName}
                  </h4>
                </div>
                <div className="rounded-xl bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 text-center">
                  <span className="block font-mono text-xs font-bold text-amber-300">
                    Diskon s.d.
                  </span>
                  <span className="font-mono text-base font-extrabold text-amber-400">
                    {calculation.discountPercent}%
                  </span>
                </div>
              </div>

              {/* Metrics Summary */}
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-3.5">
                  <span className="text-[10px] uppercase text-slate-400">Total Pack</span>
                  <p className="mt-1 font-mono text-lg font-bold text-white">
                    {calculation.totalPacks.toLocaleString("id-ID")}{" "}
                    <span className="text-xs font-normal text-slate-400">Pack (500g)</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-3.5">
                  <span className="text-[10px] uppercase text-slate-400">Tonase Bersih</span>
                  <p className="mt-1 font-mono text-lg font-bold text-emerald-300">
                    {calculation.totalTonnage}{" "}
                    <span className="text-xs font-normal text-slate-400">
                      Ton ({calculation.totalWeightKg.toLocaleString("id-ID")} Kg)
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-3.5 col-span-2">
                  <span className="text-[10px] uppercase text-slate-400">
                    Estimasi Jumlah Butir / Pcs
                  </span>
                  <p className="mt-1 font-mono text-lg font-bold text-amber-300">
                    ± {calculation.totalPieces.toLocaleString("id-ID")}{" "}
                    <span className="text-xs font-normal text-slate-400">Butir/Potong</span>
                  </p>
                </div>
              </div>

              {/* Fleet & Cold Chain Specs */}
              <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Truck className="size-4" />
                  <span>Rekomendasi Distribusi &amp; Armada Cold-Chain</span>
                </div>
                <p className="mt-2 text-xs font-bold text-white">
                  {calculation.fleetRecommendation.name}
                </p>
                <p className="mt-1 text-[11px] text-emerald-200/80">
                  • {calculation.fleetRecommendation.capacity}
                  <br />• Suhu Terjaga:{" "}
                  <strong className="text-amber-300">
                    {calculation.fleetRecommendation.temp}
                  </strong>
                  <br />• {calculation.fleetRecommendation.notes}
                </p>
              </div>

              {/* Estimasi Total Biaya */}
              <div className="mt-6 rounded-2xl border border-amber-400/30 bg-black/60 p-4 text-center">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">
                  Estimasi Nilai Pasokan (FOB Pabrik)
                </span>
                <p className="mt-1 font-mono text-2xl font-extrabold text-amber-400 sm:text-3xl">
                  {formatRupiah(calculation.estimatedTotal)}
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  *Estimasi acuan belum termasuk PPN dan ongkos kirim reeffer luar pulau.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-2.5">
              <a
                href={getWhatsAppURL()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3.5 text-center text-xs font-bold text-slate-950 shadow-lg hover:from-amber-300 hover:to-yellow-400 transition-all"
              >
                <PhoneCall className="size-4" />
                <span>Kirim Estimasi ke WhatsApp Sales</span>
              </a>

              <a
                href="#lead-form"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-white/5 py-3 text-center text-xs font-semibold text-amber-300 hover:bg-white/10 transition-all"
              >
                <FileText className="size-4" />
                <span>Ajukan Draft SPKPD / Sampel Uji Coba</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
