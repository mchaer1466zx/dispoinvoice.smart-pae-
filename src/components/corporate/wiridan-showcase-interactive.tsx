"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Flame,
  Layers,
  X,
  PhoneCall,
  Calculator,
} from "lucide-react";
import { WIRIDAN_PRODUCTS, type WiridanProduct } from "@/data/products";
import { ProductCard } from "@/components/corporate/product-card";

export function WiridanShowcaseInteractive() {
  const [selectedProduct, setSelectedProduct] = useState<WiridanProduct | null>(null);
  const [activeCategory, setActiveCategory] = useState<"Semua" | "Bakso" | "Dimsum" | "Otak-Otak">("Semua");
  const [showcaseLogoSrc, setShowcaseLogoSrc] = useState("/images/logo/logo-wiridan-318-gold.webp");
  const [modalImageSrc, setModalImageSrc] = useState<string>("");

  const handleSelectProduct = (product: WiridanProduct) => {
    setSelectedProduct(product);
    setModalImageSrc(product.image);
  };

  const categories = [
    { label: "Semua Varian", value: "Semua", count: WIRIDAN_PRODUCTS.length },
    { label: "Aneka Bakso", value: "Bakso", count: WIRIDAN_PRODUCTS.filter((p) => p.category === "Bakso").length },
    { label: "Dimsum Siomay", value: "Dimsum", count: WIRIDAN_PRODUCTS.filter((p) => p.category === "Dimsum").length },
    { label: "Otak-Otak Ikan", value: "Otak-Otak", count: WIRIDAN_PRODUCTS.filter((p) => p.category === "Otak-Otak").length },
  ] as const;

  const filteredProducts = activeCategory === "Semua"
    ? WIRIDAN_PRODUCTS
    : WIRIDAN_PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section id="products" className="relative overflow-hidden bg-[#041209] py-24 text-white">
      {/* Background Decorative Lighting & Textures */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[900px] rounded-full bg-gradient-to-b from-amber-500/10 via-emerald-600/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Official Wiridan 318 Royal Crest */}
        <div className="text-center flex flex-col items-center">
          {/* Authentic Wiridan 318 Brand Badge */}
          <div className="mb-4 relative h-16 w-20 sm:h-20 sm:w-24 drop-shadow-[0_8px_20px_rgba(212,175,55,0.4)] transition-transform duration-300 hover:scale-105">
            <Image
              src={showcaseLogoSrc}
              alt="Logo Resmi Wiridan 318 Gold & Ruby Red"
              fill
              sizes="96px"
              loading="lazy"
              className="object-contain"
              onError={() => setShowcaseLogoSrc("/images/logo/logo-wiridan-318-gold.png")}
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md">
            <Sparkles className="size-3.5 text-amber-400" />
            <span>Katalog Resmi Frozen Food Pabrik</span>
          </div>

          <h2 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Lini Produk Pangan Beku{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              WIRIDAN 318
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Produk makanan beku halal kualitas terbaik diproduksi dengan standar higienis pabrik modern,
            bumbu rempah warisan Nusantara, dan sertifikasi resmi BPJPH. Tersedia 8 varian untuk kebutuhan
            ritel, hotel, katering, restoran, dan reseller.
          </p>

          {/* Category Filter Chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat.value
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    activeCategory === cat.value
                      ? "bg-slate-950 text-amber-300"
                      : "bg-white/10 text-slate-400"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 8-Product Grid with Next/Image & Responsive Layout */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              priority={false}
              onSelect={handleSelectProduct}
            />
          ))}
        </div>

        {/* Wholesale & Custom Order Banner */}
        <div className="mt-16 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-[#062013] via-[#09331f] to-[#062013] p-6 sm:p-8 text-center shadow-xl">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="font-serif text-xl font-bold text-amber-300">
                Pemesanan Grosir / Kartonan &amp; Peluang Distributor
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Dapatkan harga khusus agen (kartonan) dengan diskon volume tiering hingga 12% dan dukungan pengiriman rantai dingin (cold-chain).
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <a
                href="#calculator"
                className="inline-flex items-center gap-2 rounded-xl border border-amber-400/40 bg-black/40 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-black/60 transition-all"
              >
                <Calculator className="size-4" />
                <span>Simulasi Modal</span>
              </a>
              <a
                href="#lead-form"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-slate-950 shadow-md hover:from-amber-300 hover:to-yellow-400 transition-all"
              >
                <PhoneCall className="size-4" />
                <span>Kontak Sales</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Specification Modal View */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 my-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-amber-400/40 bg-[#071d12] p-6 text-white shadow-2xl sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-slate-300 hover:bg-white/20 hover:text-white transition-all"
                aria-label="Tutup modal"
              >
                <X className="size-5" />
              </button>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                {/* Left Column: Packaging Product Render */}
                <div className="flex flex-col gap-4 md:col-span-5">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#041d11] to-black p-4 flex items-center justify-center">
                    {/* Official Halal Pill */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-emerald-950/90 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-400/40 backdrop-blur-md">
                      <ShieldCheck className="size-3.5 text-emerald-400" />
                      <span>✓ Halal BPJPH</span>
                    </div>

                    {/* Weight Pill */}
                    <div className="absolute top-3 right-3 z-10 rounded-full bg-amber-500/20 px-3 py-1 font-mono text-xs font-bold text-amber-300 border border-amber-400/40 backdrop-blur-md">
                      {selectedProduct.weight}
                    </div>

                    {/* Next/Image inside modal */}
                    <div className="relative h-full w-full">
                      <Image
                        src={modalImageSrc || selectedProduct.image}
                        alt={selectedProduct.alt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.8)] p-2"
                        onError={() => {
                          if (modalImageSrc.endsWith(".webp")) {
                            setModalImageSrc(modalImageSrc.replace(/\.webp$/, ".jpg"));
                          }
                        }}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Storage & Shelf Life Info Box */}
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 text-xs text-slate-300 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Suhu Penyimpanan:</span>
                      <span className="font-semibold text-amber-300">{selectedProduct.storage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Masa Simpan:</span>
                      <span className="font-semibold text-white">{selectedProduct.shelfLife}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Standar BPOM:</span>
                      <span className="font-semibold text-emerald-400">{selectedProduct.bpomStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Detailed Specifications */}
                <div className="flex flex-col justify-between md:col-span-7">
                  <div>
                    {/* Category & Tagline */}
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                      <Sparkles className="size-3.5" />
                      <span>{selectedProduct.tagline}</span>
                    </div>

                    <h3 className="mt-1 font-serif text-2xl font-bold text-white sm:text-3xl">
                      {selectedProduct.name}
                    </h3>

                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
                      {selectedProduct.shortDesc}
                    </p>

                    {/* Ingredients List */}
                    <div className="mt-5">
                      <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                        <Layers className="size-3.5" />
                        <span>Komposisi &amp; Bahan Baku Pilihan:</span>
                      </h4>
                      <ul className="mt-2 grid grid-cols-1 gap-1.5 text-xs text-slate-300">
                        {selectedProduct.ingredients.map((ing, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{ing}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cooking Instructions */}
                    <div className="mt-5">
                      <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                        <Flame className="size-3.5" />
                        <span>Saran Penyajian &amp; Pengolahan:</span>
                      </h4>
                      <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                        {selectedProduct.cookingInstructions.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-[10px] font-bold text-amber-300">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Target Market */}
                    <div className="mt-4 rounded-xl border border-white/5 bg-white/5 p-3 text-xs text-slate-300">
                      <span className="font-semibold text-white">Target Konsumen &amp; Segmen Usaha:</span>{" "}
                      <span>{selectedProduct.targetMarket}</span>
                    </div>
                  </div>

                  {/* Modal Footer CTA */}
                  <div className="mt-6 flex flex-col gap-2 sm:flex-row pt-4 border-t border-white/10">
                    <a
                      href={`https://wa.me/6281318880318?text=${encodeURIComponent(
                        `Halo PT Karya Sang Prabu, saya tertarik untuk order grosir / sampel produk ${selectedProduct.name} (500g). Mohon info pricelist & ketentuan kartonan.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3 text-xs font-extrabold uppercase tracking-wider text-slate-950 shadow-lg hover:from-amber-300 hover:to-yellow-400 transition-all"
                    >
                      <PhoneCall className="size-4" />
                      <span>Pesan Grosir via WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="rounded-xl border border-white/20 px-5 py-3 text-xs font-bold text-white hover:bg-white/10 transition-all"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
