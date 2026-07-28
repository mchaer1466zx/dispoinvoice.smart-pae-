"use server";

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs, invoices, memos, purchaseOrders, users } from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";
import { recordAudit } from "@/lib/audit";

export type DocKind = "invoice" | "po" | "memo";

export type CancelDocumentResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Membatalkan dokumen (invoice/PO/memo) dengan alasan WAJIB — pengganti hard
 * delete. Status di-set "dibatalkan" dan dicatat di jejak audit. Menolak bila
 * alasan kosong atau dokumen sudah dibatalkan.
 */
export async function cancelDocumentAction(
  kind: DocKind,
  id: string,
  reason: string
): Promise<CancelDocumentResult> {
  const user = await requireSessionUser();
  const trimmed = reason.trim();
  if (!trimmed) {
    return { success: false, error: "Alasan pembatalan wajib diisi." };
  }

  let currentStatus: string | undefined;
  if (kind === "invoice") {
    const [row] = await db
      .select({ status: invoices.status })
      .from(invoices)
      .where(eq(invoices.id, id))
      .limit(1);
    currentStatus = row?.status;
  } else if (kind === "po") {
    const [row] = await db
      .select({ status: purchaseOrders.status })
      .from(purchaseOrders)
      .where(eq(purchaseOrders.id, id))
      .limit(1);
    currentStatus = row?.status;
  } else {
    const [row] = await db
      .select({ status: memos.status })
      .from(memos)
      .where(eq(memos.id, id))
      .limit(1);
    currentStatus = row?.status;
  }

  if (!currentStatus) {
    return { success: false, error: "Dokumen tidak ditemukan." };
  }
  if (currentStatus === "dibatalkan") {
    return { success: false, error: "Dokumen sudah dibatalkan." };
  }

  try {
    if (kind === "invoice") {
      await db
        .update(invoices)
        .set({ status: "dibatalkan" })
        .where(eq(invoices.id, id));
    } else if (kind === "po") {
      await db
        .update(purchaseOrders)
        .set({ status: "dibatalkan" })
        .where(eq(purchaseOrders.id, id));
    } else {
      await db.update(memos).set({ status: "dibatalkan" }).where(eq(memos.id, id));
    }
  } catch {
    return { success: false, error: "Gagal membatalkan dokumen." };
  }

  await recordAudit({
    entityType: kind,
    entityId: id,
    action: "cancel",
    actorUserId: user.id,
    reason: trimmed,
  });

  return { success: true };
}

export type AuditLogRecord = {
  id: string;
  action: string;
  changes: string | null;
  reason: string | null;
  actorName: string | null;
  createdAt: string;
};

/** Mengambil jejak audit sebuah dokumen (terbaru dulu) untuk panel "Riwayat Perubahan". */
export async function listAuditLogsAction(
  entityType: string,
  entityId: string
): Promise<AuditLogRecord[]> {
  await requireSessionUser();
  return db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      changes: auditLogs.changes,
      reason: auditLogs.reason,
      actorName: users.name,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.actorUserId, users.id))
    .where(
      and(eq(auditLogs.entityType, entityType), eq(auditLogs.entityId, entityId))
    )
    .orderBy(desc(auditLogs.createdAt))
    .limit(50);
}
