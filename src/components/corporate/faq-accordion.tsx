"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Item FAQ minimal; `category` opsional (dipakai untuk filter di halaman /faq). */
type FaqItem = { question: string; answer: string; category?: string };

/**
 * Accordion FAQ. Baris filter kategori hanya muncul bila `categories` diberikan
 * (mis. halaman /faq); untuk FAQ di dalam artikel, cukup panggil tanpa kategori.
 */
export function FaqAccordion({
  faqs,
  categories,
}: {
  faqs: FaqItem[];
  categories?: readonly string[];
}) {
  const [category, setCategory] = useState<string>("Semua");
  const [open, setOpen] = useState<string | null>(null);

  const cats = categories && categories.length ? ["Semua", ...categories] : [];
  const shown = faqs.filter((f) => category === "Semua" || f.category === category);

  return (
    <div>
      {cats.length ? (
        <div className="flex flex-wrap gap-2">
          {cats.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full border px-4 py-2 text-[12.5px] font-medium transition-colors",
                category === cat
                  ? "border-brand-green bg-brand-green text-white"
                  : "border-black/10 text-brand-ink/70 hover:border-brand-green/40 hover:text-brand-green",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      ) : null}

      <div
        className={cn(
          "divide-y divide-black/8 rounded-lg border border-black/8 bg-white",
          cats.length && "mt-8",
        )}
      >
        {shown.map((faq) => {
          const key = `${faq.category}-${faq.question}`;
          const isOpen = open === key;
          return (
            <div key={key}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : key)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-medium text-brand-green-dark">{faq.question}</span>
                <Plus
                  className={cn(
                    "size-5 shrink-0 text-brand-gold transition-transform duration-200",
                    isOpen && "rotate-45",
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid overflow-hidden transition-all duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-[14px] leading-[1.7] text-brand-ink/70">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
