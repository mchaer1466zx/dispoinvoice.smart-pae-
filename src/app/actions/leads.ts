"use server";

/**
 * Penerimaan inquiry / lead dari form Contact & Partners.
 *
 * Struktur data sudah final (siap dipindah ke tabel DB / CMS). Untuk saat ini
 * lead divalidasi lalu dicatat di log server; ganti bagian "persist" dengan
 * insert ke database saat tabel contact_submissions tersedia.
 */

export type LeadSource = "contact" | "partner";

export type LeadInput = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  subject?: string;
  businessType?: string;
  message: string;
  source: LeadSource;
};

export type LeadResult =
  | { ok: true }
  | { ok: false; error: string; fields?: string[] };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitLeadAction(input: LeadInput): Promise<LeadResult> {
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const message = input.message?.trim() ?? "";

  const missing: string[] = [];
  if (!name) missing.push("name");
  if (!email) missing.push("email");
  if (!message) missing.push("message");
  if (missing.length > 0) {
    return { ok: false, error: "Mohon lengkapi kolom wajib.", fields: missing };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Format email tidak valid.", fields: ["email"] };
  }
  // Anti-spam sederhana: pesan terlalu panjang / tautan berlebih ditolak.
  if (message.length > 4000) {
    return { ok: false, error: "Pesan terlalu panjang.", fields: ["message"] };
  }

  const record = {
    name,
    company: input.company?.trim() || null,
    email,
    phone: input.phone?.trim() || null,
    subject: input.subject?.trim() || null,
    businessType: input.businessType?.trim() || null,
    message,
    source: input.source,
    createdAt: new Date().toISOString(),
  };

  // TODO(persist): simpan `record` ke tabel contact_submissions (Drizzle/Turso)
  // atau teruskan ke email/CRM. Sementara dicatat di log server.
  console.info("[lead] inquiry diterima:", record);

  return { ok: true };
}
