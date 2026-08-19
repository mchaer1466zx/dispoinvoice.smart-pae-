"use client";

import React, { useState } from "react";
import { MessageCircle, X, Send, ChevronRight } from "lucide-react";

export function FloatingWhatsappWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const quickMessages = [
    {
      title: "Katalog & Daftar Harga Grosir",
      desc: "Minta pricelist terbaru 4 produk Wiridan 318",
      msg: "Halo Sales PT KARYA SANG PRABU, saya ingin meminta katalog resmi dan daftar harga grosir (kartonan) produk Wiridan 318.",
    },
    {
      title: "Permintaan Sampel Uji Coba Horeka",
      desc: "Tester untuk restoran, hotel, atau katering",
      msg: "Halo PT KARYA SANG PRABU, saya berminat mengajukan sampel uji coba produk frozen food untuk usaha kuliner kami.",
    },
    {
      title: "Peluang Kemitraan Distributor",
      desc: "Menjadi agen / distributor resmi wilayah",
      msg: "Halo Manajemen PT KARYA SANG PRABU, saya ingin mendiskusikan peluang kemitraan distributor produk Wiridan 318 di wilayah saya.",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Pop-up Box */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-b from-[#082a18] via-[#051c10] to-[#020b06] shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-emerald-950/80 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-bold">
                  <MessageCircle className="size-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 ring-2 ring-emerald-950" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Sales Management Resmi</p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online · Siap Melayani</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Selamat datang di <strong>PT KARYA SANG PRABU</strong>. Pilih topik konsultasi cepat
              untuk terhubung langsung dengan tim kami:
            </p>

            <div className="space-y-2">
              {quickMessages.map((item, idx) => (
                <a
                  key={idx}
                  href={`https://wa.me/628893663031?text=${encodeURIComponent(item.msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-black/40 p-3 text-left transition-all hover:border-amber-400/60 hover:bg-amber-400/10"
                >
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                  <ChevronRight className="size-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10">
              <a
                href={`https://wa.me/628893663031?text=${encodeURIComponent(
                  "Halo PT KARYA SANG PRABU, saya ingin berkonsultasi mengenai produk dan pasokan komoditas."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:from-amber-300 hover:to-yellow-400 transition-all"
              >
                <Send className="size-3.5" />
                <span>Chat Langsung di WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Buka Chat WhatsApp Sales"
        className="group flex items-center gap-2.5 rounded-full border border-amber-400/60 bg-gradient-to-r from-emerald-950 via-[#0a3821] to-emerald-950 px-4 py-3 text-white shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-amber-400 hover:shadow-[0_8px_35px_rgba(212,175,55,0.3)]"
      >
        <div className="relative flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold shadow-inner">
          <MessageCircle className="size-4.5" />
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-amber-300">Hubungi Sales Resmi</span>
          <span className="text-[10px] text-emerald-200/80">Kemitraan &amp; Grosir 318</span>
        </div>
      </button>
    </div>
  );
}
