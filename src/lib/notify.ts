import "server-only";
import { db } from "@/db";
import { notifications } from "@/db/schema";

export type NotifyInput = {
  userId: string | null;
  type:
    | "invoice_status"
    | "po_status"
    | "grn_status"
    | "rfq_status"
    | "quotation_status"
    | "memo_status"
    | "pr_status"
    | "doc_shared"
    | "invoice_due_soon"
    | "invoice_overdue";
  title: string;
  body?: string;
  docType?: "invoice" | "po" | "grn" | "rfq" | "quotation" | "memo" | "pr";
  docId?: string;
  dedupeKey?: string;
};

/**
 * Membuat satu notifikasi in-app dan menyimpannya ke tabel `notifications`.
 *
 * Dirancang aman dipanggil SETELAH aksi bisnis (simpan/ubah status) sukses:
 * kegagalan menulis notifikasi tidak boleh menggagalkan aksi utama, sehingga
 * semua error ditelan di sini. `dedupeKey` (opsional) mencegah notifikasi
 * otomatis berganda — baris kedua dengan kunci sama diabaikan.
 */
export async function createNotification(input: NotifyInput): Promise<void> {
  try {
    await db
      .insert(notifications)
      .values({
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body ?? null,
        docType: input.docType ?? null,
        docId: input.docId ?? null,
        dedupeKey: input.dedupeKey ?? null,
      })
      .onConflictDoNothing({ target: notifications.dedupeKey });
  } catch {
    // Sengaja ditelan: notifikasi bersifat pelengkap, aksi bisnis tetap sukses.
  }
}
