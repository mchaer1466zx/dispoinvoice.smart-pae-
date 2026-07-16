"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getMemoAction, type MemoRecord } from "@/app/actions/memos";
import { getActiveCompanyAction, type CompanyRecord } from "@/app/actions/companies";

export type PublicMemo = MemoRecord & {
  company: CompanyRecord | null;
};

export type GetMemoPublicLinkResult =
  | { success: true; url: string }
  | { success: false; error: string };

/**
 * Server Action untuk membangun tautan publik pratinjau memo tanpa login.
 * Token yang dipakai adalah id memo itu sendiri (UUID acak, tidak tertebak),
 * sehingga tidak memerlukan tabel token terpisah.
 */
export async function getMemoPublicLinkAction(
  memoId: string
): Promise<GetMemoPublicLinkResult> {
  const memo = await getMemoAction(memoId);
  if (!memo) {
    return { success: false, error: "Memo tidak ditemukan." };
  }

  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) {
    return { success: false, error: "Tidak dapat menentukan alamat server." };
  }

  const protocol =
    host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";

  return { success: true, url: `${protocol}://${host}/memo/publik/${memoId}` };
}

/**
 * Server Action untuk mengambil data memo secara publik (tanpa login) berdasarkan token.
 * Dipakai oleh halaman pratinjau publik yang diakses lewat tautan berbagi.
 */
export async function getPublicMemoAction(token: string): Promise<PublicMemo | null> {
  const memo = await getMemoAction(token);
  if (!memo) return null;

  const company = memo.companyId
    ? ((
        await db
          .select()
          .from(companies)
          .where(eq(companies.id, memo.companyId))
          .limit(1)
      )[0] ?? null)
    : await getActiveCompanyAction();

  return { ...memo, company };
}
