"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, RotateCcw, Sparkles } from "lucide-react";

type Turn = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "Apa saja bisnis SANG PRABU?",
  "Apa produk SANG PRABU?",
  "Saya ingin menjadi partner.",
  "Bagaimana cara menghubungi SANG PRABU?",
];

export function SangPrabuAi() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const history = messages.slice(-10);
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan. Silakan coba lagi.");
      } else if (data.reply) {
        setMessages((m) => [...m, { role: "assistant", content: data.reply! }]);
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } catch {
      setError("Tidak dapat terhubung. Periksa koneksi Anda dan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([]);
    setError(null);
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] print:hidden">
      {/* ===== PANEL ===== */}
      {open ? (
        <div
          role="dialog"
          aria-label="SANG PRABU AI — asisten virtual"
          className="flex h-[70vh] max-h-[560px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_24px_70px_-24px_rgba(11,77,33,0.55)]"
        >
          {/* Header */}
          <div className="flex items-center gap-2 bg-brand-green-dark px-4 py-3 text-white">
            <span className="flex size-8 items-center justify-center rounded-full bg-brand-gold text-brand-green-dark">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight">SANG PRABU AI</p>
              <p className="text-[11px] leading-tight text-white/70">
                Asisten informasi perusahaan
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label="Mulai percakapan baru"
              title="Percakapan baru"
              className="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup asisten"
              className="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Riwayat pesan */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-brand-cream/40 px-3.5 py-4"
          >
            {/* Empty state */}
            {messages.length === 0 && !loading && !error ? (
              <div className="space-y-3">
                <p className="text-[13px] leading-relaxed text-brand-ink/70">
                  Halo! 👋 Saya <b>SANG PRABU AI</b>. Tanyakan seputar profil, lini
                  bisnis, produk, komoditas, kemitraan, atau kontak PT KARYA SANG PRABU.
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="rounded-lg border border-brand-green/20 bg-white px-3 py-2 text-left text-[13px] font-medium text-brand-green-dark transition-colors hover:border-brand-green/50 hover:bg-brand-green/5"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed " +
                    (m.role === "user"
                      ? "rounded-br-sm bg-brand-green text-white"
                      : "rounded-bl-sm border border-black/5 bg-white text-brand-ink")
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Loading state */}
            {loading ? (
              <div className="flex justify-start" aria-live="polite">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-black/5 bg-white px-3.5 py-2.5">
                  <span className="size-1.5 animate-bounce rounded-full bg-brand-green [animation-delay:-0.2s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-brand-green [animation-delay:-0.1s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-brand-green" />
                </div>
              </div>
            ) : null}

            {/* Error state */}
            {error ? (
              <div
                role="alert"
                className="rounded-lg border border-brand-red/30 bg-brand-red/5 px-3 py-2 text-[12.5px] text-brand-red"
              >
                {error}
              </div>
            ) : null}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 border-t border-black/10 bg-white p-2.5"
          >
            <label htmlFor="spai-input" className="sr-only">
              Tulis pertanyaan Anda
            </label>
            <textarea
              id="spai-input"
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Tulis pertanyaan Anda…"
              maxLength={1000}
              className="max-h-28 min-h-[40px] flex-1 resize-none rounded-lg border border-black/10 bg-brand-cream/40 px-3 py-2 text-[13.5px] text-brand-ink outline-none focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/20"
            />
            <button
              type="submit"
              disabled={loading || input.trim().length === 0}
              aria-label="Kirim pesan"
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-green text-white transition-colors hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      ) : null}

      {/* ===== TOMBOL FLOATING ===== */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka SANG PRABU AI — asisten virtual"
          className="group flex items-center gap-2 rounded-full bg-brand-green py-3 pl-3.5 pr-4 text-white shadow-[0_16px_40px_-12px_rgba(11,77,33,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-brand-green-dark"
        >
          <MessageCircle className="size-5" />
          <span className="text-sm font-semibold">SANG PRABU AI</span>
        </button>
      ) : null}
    </div>
  );
}
