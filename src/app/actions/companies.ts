"use server";

import { asc, eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { companies } from "@/db/schema";

const ACTIVE_COMPANY_COOKIE = "active_company_id";
const ACTIVE_COMPANY_COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
};

export type CompanyRecord = {
  id: string;
  name: string;
  address: string;
  logoUrl: string | null;
};

const COMPANY_COLUMNS = {
  id: companies.id,
  name: companies.name,
  address: companies.address,
  logoUrl: companies.logoUrl,
};

export type CompanyInput = {
  name: string;
  address: string;
};

export type CompanyActionResult =
  | { success: true; company: CompanyRecord }
  | { success: false; error: string };

export type DeleteCompanyResult =
  | { success: true }
  | { success: false; error: string };

/** Server Action untuk mengambil daftar perusahaan, dipakai pada switcher & halaman manajemen. */
export async function listCompaniesAction(): Promise<CompanyRecord[]> {
  return db.select(COMPANY_COLUMNS).from(companies).orderBy(asc(companies.name));
}

/** Server Action untuk menambahkan perusahaan baru. Perusahaan pertama otomatis jadi aktif. */
export async function createCompanyAction(
  input: CompanyInput
): Promise<CompanyActionResult> {
  const name = input.name.trim();
  if (!name) {
    return { success: false, error: "Nama perusahaan wajib diisi." };
  }
  const [created] = await db
    .insert(companies)
    .values({
      name,
      address: input.address.trim(),
    })
    .returning(COMPANY_COLUMNS);
  const cookieStore = await cookies();
  if (!cookieStore.get(ACTIVE_COMPANY_COOKIE)?.value) {
    cookieStore.set(ACTIVE_COMPANY_COOKIE, created.id, ACTIVE_COMPANY_COOKIE_OPTIONS);
  }

  return { success: true, company: created };
}

/** Server Action untuk mengubah data perusahaan (bukan logo, lihat company-logo.ts). */
export async function updateCompanyAction(
  id: string,
  input: CompanyInput
): Promise<CompanyActionResult> {
  const name = input.name.trim();
  if (!name) {
    return { success: false, error: "Nama perusahaan wajib diisi." };
  }

  const [updated] = await db
    .update(companies)
    .set({
      name,
      address: input.address.trim(),
      updatedAt: sql`(current_timestamp)`,
    })
    .where(eq(companies.id, id))
    .returning(COMPANY_COLUMNS);

  if (!updated) {
    return { success: false, error: "Perusahaan tidak ditemukan." };
  }

  return { success: true, company: updated };
}

/** Server Action untuk menghapus perusahaan. Jika sedang aktif, cookie aktif ikut dibersihkan. */
export async function deleteCompanyAction(id: string): Promise<DeleteCompanyResult> {
  const [deleted] = await db
    .delete(companies)
    .where(eq(companies.id, id))
    .returning({ id: companies.id });

  if (!deleted) {
    return { success: false, error: "Perusahaan tidak ditemukan." };
  }

  const cookieStore = await cookies();
  if (cookieStore.get(ACTIVE_COMPANY_COOKIE)?.value === id) {
    cookieStore.delete(ACTIVE_COMPANY_COOKIE);
  }

  return { success: true };
}

/** Server Action untuk menandai sebuah perusahaan sebagai perusahaan aktif (dipakai oleh switcher). */
export async function setActiveCompanyAction(id: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_COMPANY_COOKIE, id, ACTIVE_COMPANY_COOKIE_OPTIONS);
}

/**
 * Server Action untuk mengambil perusahaan aktif saat ini. Jatuh ke perusahaan pertama
 * jika belum ada cookie atau perusahaan yang tersimpan sudah terhapus; null jika belum
 * ada satu pun perusahaan terdaftar.
 */
export async function getActiveCompanyAction(): Promise<CompanyRecord | null> {
  const cookieStore = await cookies();
  const activeId = cookieStore.get(ACTIVE_COMPANY_COOKIE)?.value;

  if (activeId) {
    const [company] = await db
      .select(COMPANY_COLUMNS)
      .from(companies)
      .where(eq(companies.id, activeId))
      .limit(1);
    if (company) return company;
  }

  const [first] = await db
    .select(COMPANY_COLUMNS)
    .from(companies)
    .orderBy(asc(companies.name))
    .limit(1);

  return first ?? null;
}
