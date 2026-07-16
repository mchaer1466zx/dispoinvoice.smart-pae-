"use server";

import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { companyProfile } from "@/db/schema";
import { validateAndOptimizeLogo } from "@/lib/optimize-logo";

const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

const DEFAULT_PROFILE_ID = "default";

export type UploadCompanyLogoResult =
  | { success: true; logoUrl: string }
  | { success: false; error: string };

/** Server Action untuk mengambil logo perusahaan saat ini (null jika belum diunggah). */
export async function getCompanyLogoAction(): Promise<string | null> {
  const [profile] = await db
    .select({ logoUrl: companyProfile.logoUrl })
    .from(companyProfile)
    .where(eq(companyProfile.id, DEFAULT_PROFILE_ID))
    .limit(1);

  return profile?.logoUrl ?? null;
}

/** Server Action untuk mengunggah/mengganti logo perusahaan, dipakai di halaman Profil Perusahaan. */
export async function uploadCompanyLogoAction(
  formData: FormData
): Promise<UploadCompanyLogoResult> {
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

  await db
    .insert(companyProfile)
    .values({
      id: DEFAULT_PROFILE_ID,
      name: "",
      address: "",
      email: "",
      phone: "",
      logoUrl,
    })
    .onConflictDoUpdate({
      target: companyProfile.id,
      set: { logoUrl, updatedAt: sql`(current_timestamp)` },
    });

  return { success: true, logoUrl };
}
