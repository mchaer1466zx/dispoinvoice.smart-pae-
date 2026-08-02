"use client";

import { useId, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  submitLeadAction,
  type LeadResult,
  type LeadSource,
} from "@/app/actions/leads";

const SELECT_CLASS =
  "flex h-11 w-full rounded-md border border-black/10 bg-white px-3 text-sm text-brand-ink outline-none focus-visible:border-brand-green focus-visible:ring-2 focus-visible:ring-brand-green/20";

/**
 * Formulir lead reusable untuk halaman Contact & Partners.
 * `select` menampilkan dropdown tambahan (Subject / Business Type).
 */
export function LeadForm({
  source,
  select,
}: {
  source: LeadSource;
  select?: { name: "subject" | "businessType"; label: string; options: readonly string[] };
}) {
  const id = useId();
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<LeadResult | null>(null);

  const invalid = (field: string) =>
    result && !result.ok && result.fields?.includes(field);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setResult(null);
    const res = await submitLeadAction({
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      subject: select?.name === "subject" ? String(fd.get("select") ?? "") : undefined,
      businessType:
        select?.name === "businessType" ? String(fd.get("select") ?? "") : undefined,
      message: String(fd.get("message") ?? ""),
      source,
    });
    setPending(false);
    setResult(res);
    if (res.ok) e.currentTarget.reset();
  }

  if (result?.ok) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-brand-green/20 bg-brand-green/5 px-6 py-12 text-center">
        <CheckCircle2 className="size-10 text-brand-green" />
        <p className="font-display text-lg font-semibold text-brand-green-dark">
          Terima kasih.
        </p>
        <p className="max-w-sm text-[14px] leading-[1.6] text-brand-ink/70">
          Pesan Anda telah kami terima. Tim PT KARYA SANG PRABU akan menghubungi
          Anda sesegera mungkin.
        </p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-2 text-[13px] font-semibold text-brand-green underline underline-offset-4"
        >
          Kirim pesan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <Field label="Nama" required invalid={invalid("name")}>
        <Input name="name" id={`${id}-name`} placeholder="Nama lengkap" />
      </Field>
      <Field label="Perusahaan">
        <Input name="company" id={`${id}-company`} placeholder="Nama perusahaan (opsional)" />
      </Field>
      <Field label="Email" required invalid={invalid("email")}>
        <Input name="email" id={`${id}-email`} type="email" placeholder="nama@email.com" />
      </Field>
      <Field label="Nomor Telepon">
        <Input name="phone" id={`${id}-phone`} placeholder="08xx / 021 xxxx (opsional)" />
      </Field>
      {select ? (
        <Field label={select.label} className="sm:col-span-2">
          <select name="select" id={`${id}-select`} className={SELECT_CLASS} defaultValue="">
            <option value="" disabled>
              Pilih {select.label.toLowerCase()}…
            </option>
            {select.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>
      ) : null}
      <Field label="Pesan" required invalid={invalid("message")} className="sm:col-span-2">
        <Textarea
          name="message"
          id={`${id}-message`}
          rows={5}
          placeholder="Ceritakan kebutuhan atau pertanyaan Anda…"
        />
      </Field>

      {result && !result.ok ? (
        <p className="text-sm font-medium text-brand-red sm:col-span-2">{result.error}</p>
      ) : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-green px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-green-dark disabled:opacity-70"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          {pending ? "Mengirim…" : "Kirim Pesan"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  invalid,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  invalid?: boolean | null;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label className="text-[13px] font-medium text-brand-ink/80">
        {label}
        {required ? <span className="text-brand-red"> *</span> : null}
      </Label>
      <div className={cn(invalid && "[&_input]:border-brand-red [&_textarea]:border-brand-red")}>
        {children}
      </div>
    </div>
  );
}
