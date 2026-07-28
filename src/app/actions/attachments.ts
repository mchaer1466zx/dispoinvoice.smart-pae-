"use server";

import { and, desc, eq } from "drizzle-orm";
import { put, del } from "@vercel/blob";
import { db } from "@/db";
import { attachments } from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";
import { recordAudit } from "@/lib/audit";

const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024; // selaras dengan bodySizeLimit 4MB
const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];

export type AttachmentRecord = {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  url: string;
  createdAt: string;
};

export type UploadAttachmentResult =
  | { success: true; attachment: AttachmentRecord }
  | { success: false; error: string };

/**
 * Mengunggah lampiran bukti (scan/foto/PDF) untuk sebuah dokumen ke Vercel Blob
 * lalu menyimpan metadatanya. Butuh env BLOB_READ_WRITE_TOKEN (aktifkan Blob di
 * Vercel); bila belum ada, mengembalikan pesan ramah tanpa crash.
 */
export async function uploadAttachmentAction(
  entityType: string,
  entityId: string,
  formData: FormData
): Promise<UploadAttachmentResult> {
  const user = await requireSessionUser();

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      success: false,
      error:
        "Penyimpanan lampiran belum dikonfigurasi (BLOB_READ_WRITE_TOKEN belum diatur).",
    };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Berkas lampiran wajib dipilih." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Format tidak didukung. Gunakan PDF, PNG, JPG, atau WEBP.",
    };
  }
  if (file.size > MAX_ATTACHMENT_BYTES) {
    return { success: false, error: "Ukuran berkas maksimal 4MB." };
  }

  let url: string;
  try {
    const blob = await put(
      `attachments/${entityType}/${entityId}/${crypto.randomUUID()}-${file.name}`,
      file,
      { access: "public", addRandomSuffix: false }
    );
    url = blob.url;
  } catch {
    return { success: false, error: "Gagal mengunggah lampiran." };
  }

  const [created] = await db
    .insert(attachments)
    .values({
      entityType,
      entityId,
      filename: file.name,
      contentType: file.type,
      size: file.size,
      url,
      uploadedByUserId: user.id,
    })
    .returning({
      id: attachments.id,
      filename: attachments.filename,
      contentType: attachments.contentType,
      size: attachments.size,
      url: attachments.url,
      createdAt: attachments.createdAt,
    });

  await recordAudit({
    entityType,
    entityId,
    action: "update",
    actorUserId: user.id,
    changes: { lampiran: { from: null, to: file.name } },
  });

  return { success: true, attachment: created };
}

/** Daftar lampiran sebuah dokumen (terbaru dulu). */
export async function listAttachmentsAction(
  entityType: string,
  entityId: string
): Promise<AttachmentRecord[]> {
  await requireSessionUser();
  return db
    .select({
      id: attachments.id,
      filename: attachments.filename,
      contentType: attachments.contentType,
      size: attachments.size,
      url: attachments.url,
      createdAt: attachments.createdAt,
    })
    .from(attachments)
    .where(
      and(
        eq(attachments.entityType, entityType),
        eq(attachments.entityId, entityId)
      )
    )
    .orderBy(desc(attachments.createdAt));
}

export type RemoveAttachmentResult =
  | { success: true }
  | { success: false; error: string };

/** Menghapus satu lampiran (berkas di Blob + metadata) dan mencatatnya di audit. */
export async function removeAttachmentAction(
  id: string
): Promise<RemoveAttachmentResult> {
  const user = await requireSessionUser();

  const [row] = await db
    .select()
    .from(attachments)
    .where(eq(attachments.id, id))
    .limit(1);
  if (!row) {
    return { success: false, error: "Lampiran tidak ditemukan." };
  }

  try {
    await del(row.url);
  } catch {
    // Berkas Blob mungkin sudah hilang; tetap lanjut hapus metadata.
  }

  await db.delete(attachments).where(eq(attachments.id, id));

  await recordAudit({
    entityType: row.entityType,
    entityId: row.entityId,
    action: "update",
    actorUserId: user.id,
    changes: { lampiran: { from: row.filename, to: null } },
  });

  return { success: true };
}
