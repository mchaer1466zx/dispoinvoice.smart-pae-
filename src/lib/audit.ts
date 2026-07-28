import "server-only";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";

export type AuditAction = "create" | "update" | "approve" | "reject" | "cancel";

export type AuditChanges = Record<string, { from: unknown; to: unknown }>;

/**
 * Mencatat satu entri jejak audit ("siapa, kapan, apa"). Dipanggil setelah aksi
 * bisnis (create/update/approve/cancel) berhasil. Kegagalan pencatatan ditelan
 * agar tidak menggagalkan aksi utama, mengikuti pola createNotification.
 */
export async function recordAudit(input: {
  entityType: string;
  entityId: string;
  action: AuditAction;
  actorUserId?: string | null;
  changes?: AuditChanges | null;
  reason?: string | null;
}): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      actorUserId: input.actorUserId ?? null,
      changes: input.changes ? JSON.stringify(input.changes) : null,
      reason: input.reason ?? null,
    });
  } catch {
    // Sengaja ditelan: audit bersifat pelengkap; aksi bisnis tetap sukses.
  }
}
