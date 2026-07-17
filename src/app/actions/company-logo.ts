"use server";

import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { companies } from "@/db/schema";
import { validateAndOptimizeLogo } from "@/lib/optimize-logo";
import { requireSessionUser } from "@/app/actions/auth";

const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export type UploadCompanyLogoResult =
  | { success: true; logoUrl: string }
  | { success: false; error: string };

/** Server Action untuk mengambil logo sebuah perusahaan saat ini (null jika belum diunggah). */
export async function getCompanyLogoAction(companyId: string): Promise<string | null> {
  const [company] = await db
    .select({ logoUrl: companies.logoUrl })
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  return company?.logoUrl ?? null;
}

/** Server Action untuk mengunggah/mengganti logo sebuah perusahaan, dipakai di halaman Profil Perusahaan. */
export async function uploadCompanyLogoAction(
  companyId: string,
  formData: FormData
): Promise<UploadCompanyLogoResult> {
  await requireSessionUser();
  const file = formData.get("logo");

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Berkas logo wajib diunggah." };
  }

  if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Format berkas tidak didukung. Gunakan PNG, JPG, WEBP, atau SVG.",
    };
  }

  if (file.size > MAX_LOGO_SIZE_BYTES) {
    return { success: false, error: "Ukuran berkas maksimal 2MB." };
  }

  const rawBuffer = Buffer.from(await file.arrayBuffer());

  let optimized;
  try {
    optimized = await validateAndOptimizeLogo(rawBuffer, file.type);
  } catch {
    return { success: false, error: "Berkas logo tidak valid atau rusak." };
  }

  const logoUrl = `data:${optimized.contentType};base64,${optimized.buffer.toString("base64")}`;

  const [updated] = await db
    .update(companies)
    .set({ logoUrl, updatedAt: sql`(current_timestamp)` })
    .where(eq(companies.id, companyId))
    .returning({ id: companies.id });

  if (!updated) {
    return { success: false, error: "Perusahaan tidak ditemukan." };
  }

  return { success: true, logoUrl };
}

export type RemoveCompanyLogoResult =
  | { success: true }
  | { success: false; error: string };

/** Server Action untuk menghapus logo sebuah perusahaan (kembali ke placeholder inisial). */
export async function removeCompanyLogoAction(
  companyId: string
): Promise<RemoveCompanyLogoResult> {
  await requireSessionUser();
  const [updated] = await db
    .update(companies)
    .set({ logoUrl: null, updatedAt: sql`(current_timestamp)` })
    .where(eq(companies.id, companyId))
    .returning({ id: companies.id });

  if (!updated) {
    return { success: false, error: "Perusahaan tidak ditemukan." };
  }

  return { success: true };
}
