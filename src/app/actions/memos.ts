"use server";

import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { memos } from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";

export type MemoRecord = {
  id: string;
  recipientName: string;
  subject: string;
  instructions: string | null;
  content: string;
  memoDate: string;
  companyId: string | null;
  createdAt: string;
};

const MEMO_COLUMNS = {
  id: memos.id,
  recipientName: memos.recipientName,
  subject: memos.subject,
  instructions: memos.instructions,
  content: memos.content,
  memoDate: memos.memoDate,
  companyId: memos.companyId,
  createdAt: memos.createdAt,
};

export type MemoInput = {
  recipientName: string;
  subject: string;
  instructions: string;
  content: string;
  memoDate: string;
  companyId: string | null;
};

export type MemoActionResult =
  | { success: true; memo: MemoRecord }
  | { success: false; error: string };

export type DeleteMemoResult =
  | { success: true }
  | { success: false; error: string };

function validateInput(input: MemoInput): string | null {
  if (!input.recipientName.trim()) {
    return "Penerima wajib diisi.";
  }
  if (!input.content.trim()) {
    return "Isi memo wajib diisi.";
  }
  return null;
}

/** Server Action untuk mengambil daftar memo, dipakai pada halaman riwayat. */
export async function listMemosAction(): Promise<MemoRecord[]> {
  await requireSessionUser();
  return db.select(MEMO_COLUMNS).from(memos).orderBy(asc(memos.memoDate));
}

/** Server Action untuk mengambil satu memo. */
export async function getMemoAction(id: string): Promise<MemoRecord | null> {
  const [memo] = await db
    .select(MEMO_COLUMNS)
    .from(memos)
    .where(eq(memos.id, id))
    .limit(1);

  return memo ?? null;
}

/** Server Action untuk menyimpan memo disposisi baru ke database. */
export async function createMemoAction(
  input: MemoInput
): Promise<MemoActionResult> {
  await requireSessionUser();
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const [created] = await db
    .insert(memos)
    .values({
      recipientName: input.recipientName.trim(),
      subject: input.subject.trim(),
      instructions: input.instructions.trim() || null,
      content: input.content.trim(),
      memoDate: input.memoDate,
      companyId: input.companyId,
    })
    .returning(MEMO_COLUMNS);

  return { success: true, memo: created };
}

/** Server Action untuk mengubah memo disposisi. */
export async function updateMemoAction(
  id: string,
  input: MemoInput
): Promise<MemoActionResult> {
  await requireSessionUser();
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const [updated] = await db
    .update(memos)
    .set({
      recipientName: input.recipientName.trim(),
      subject: input.subject.trim(),
      instructions: input.instructions.trim() || null,
      content: input.content.trim(),
      memoDate: input.memoDate,
      companyId: input.companyId,
    })
    .where(eq(memos.id, id))
    .returning(MEMO_COLUMNS);

  if (!updated) {
    return { success: false, error: "Memo tidak ditemukan." };
  }

  return { success: true, memo: updated };
}

/** Server Action untuk menghapus memo disposisi. */
export async function deleteMemoAction(id: string): Promise<DeleteMemoResult> {
  await requireSessionUser();
  const [deleted] = await db
    .delete(memos)
    .where(eq(memos.id, id))
    .returning({ id: memos.id });

  if (!deleted) {
    return { success: false, error: "Memo tidak ditemukan." };
  }

  return { success: true };
}
