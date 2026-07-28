"use server";

import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { memos } from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";
import { createNotification } from "@/lib/notify";

export type MemoStatus = "terkirim" | "dibaca" | "selesai";

export type MemoRecord = {
  id: string;
  recipientName: string;
  subject: string;
  instructions: string | null;
  content: string;
  status: MemoStatus;
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
  status: memos.status,
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
  const user = await requireSessionUser();
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const [created] = await db
    .insert(memos)
    .values({
      userId: user.id,
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

const MEMO_STATUS_LABELS: Record<MemoStatus, string> = {
  terkirim: "Terkirim",
  dibaca: "Dibaca",
  selesai: "Selesai",
};

export type UpdateMemoStatusResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Server Action untuk mengubah status memo (terkirim → dibaca → selesai).
 * Memicu notifikasi in-app `memo_status` HANYA bila status benar-benar berubah,
 * mengikuti pola updateInvoiceStatusAction. Kegagalan notifikasi tidak
 * memengaruhi hasil pembaruan status.
 */
export async function updateMemoStatusAction(
  memoId: string,
  newStatus: MemoStatus
): Promise<UpdateMemoStatusResult> {
  const user = await requireSessionUser();

  const [memo] = await db
    .select({
      id: memos.id,
      subject: memos.subject,
      status: memos.status,
      userId: memos.userId,
    })
    .from(memos)
    .where(eq(memos.id, memoId))
    .limit(1);

  if (!memo) {
    return { success: false, error: "Memo tidak ditemukan." };
  }

  // Tidak ada perubahan → sukses tanpa notifikasi.
  if (memo.status === newStatus) {
    return { success: true };
  }

  try {
    await db
      .update(memos)
      .set({ status: newStatus })
      .where(eq(memos.id, memoId));
  } catch {
    return { success: false, error: "Gagal memperbarui status memo." };
  }

  await createNotification({
    userId: memo.userId ?? user.id,
    type: "memo_status",
    title: `Memo "${memo.subject}" → ${MEMO_STATUS_LABELS[newStatus]}`,
    docType: "memo",
    docId: memo.id,
  });

  return { success: true };
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
