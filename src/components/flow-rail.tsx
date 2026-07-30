import { cn } from "@/lib/utils";

/**
 * Alur pengadaan sebagai deret bernomor (PR → RFQ → PO → GRN → Invoice).
 * Ini elemen tanda tangan sistem: urutan dokumen yang nyata, jadi penomoran
 * memang bermakna (bukan hiasan). Dipakai mencolok di halaman depan (tone
 * "dark", di atas hijau) dan versi tenang di dashboard (tone "light").
 */
const STEPS = [
  { n: "01", code: "PR", label: "Permintaan" },
  { n: "02", code: "RFQ", label: "Penawaran" },
  { n: "03", code: "PO", label: "Pesanan" },
  { n: "04", code: "GRN", label: "Terima" },
  { n: "05", code: "Invoice", label: "Tagih" },
] as const;

export function FlowRail({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const dark = tone === "dark";
  const line = dark ? "bg-gold/25" : "bg-gold/50";
  const nodeBorder = dark ? "border-gold/70" : "border-gold";
  const nodeBg = dark ? "bg-transparent" : "bg-card";
  const num = dark ? "text-gold-bright" : "text-primary";
  const code = dark ? "text-white" : "text-foreground";
  const label = dark ? "text-white/55" : "text-muted-foreground";

  return (
    <ol className={cn("flex w-full items-start", className)}>
      {STEPS.map((s, i) => (
        <li
          key={s.code}
          className="relative flex min-w-0 flex-1 flex-col items-center"
        >
          {/* Garis penghubung kiri/kanan di titik tengah simpul (top-4 = 1rem) */}
          {i > 0 && (
            <span
              className={cn("absolute left-0 right-1/2 top-4 h-px", line)}
              aria-hidden
            />
          )}
          {i < STEPS.length - 1 && (
            <span
              className={cn("absolute left-1/2 right-0 top-4 h-px", line)}
              aria-hidden
            />
          )}
          <span
            className={cn(
              "relative z-10 flex size-8 items-center justify-center rounded-full border font-mono text-[11px] font-semibold",
              nodeBorder,
              nodeBg,
              num,
            )}
          >
            {s.n}
          </span>
          <span
            className={cn(
              "mt-2 font-mono text-[10px] font-semibold uppercase leading-[1.3] tracking-[0.12em] sm:text-[11px]",
              code,
            )}
          >
            {s.code}
          </span>
          <span
            className={cn("text-[10px] leading-[1.3] sm:text-[11px]", label)}
          >
            {s.label}
          </span>
        </li>
      ))}
    </ol>
  );
}
