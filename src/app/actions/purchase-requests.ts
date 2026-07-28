"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { purchaseRequests, prItems } from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";
import { createNotification } from "@/lib/notify";
import { recordAudit } from "@/lib/audit";

export type PrStatus =
  | "draft"
  | "menunggu_approval"
  | "disetujui"
  | "ditolak"
  | "dibatalkan";

export const PR_STATUS_LABELS: Record<PrStatus, string> = {
  draft: "Draft",
  menunggu_approval: "Menunggu Approval",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
  dibatalkan: "Dibatalkan",
};

export type PurchaseRequestItemInput = {
  description: string;
  spec: string;
  quantity: number;
  estPrice: number;
};

export type CreatePurchaseRequestInput = {
  prNumber: string;
  department: string;
  needDate: string;
  status: PrStatus;
  notes: string;
  companyId: string | null;
  items: PurchaseRequestItemInput[];
};

export type CreatePurchaseRequestResult =
  | { success: true; purchaseRequestId: string }
  | { success: false; error: string };

/** Server Action untuk menyimpan Purchase Request beserta item-itemnya. */
export async function createPurchaseRequestAction(
  input: CreatePurchaseRequestInput
): Promise<CreatePurchaseRequestResult> {
  const user = await requireSessionUser();

  if (!input.prNumber.trim()) {
    return { success: false, error: "Nomor PR wajib diisi." };
  }
  if (!input.items.some((item) => item.description.trim())) {
    return { success: false, error: "Minimal satu item dengan deskripsi wajib diisi." };
  }

  try {
    const purchaseRequestId = await db.transaction(async (tx) => {
      const [pr] = await tx
        .insert(purchaseRequests)
        .values({
          userId: user.id,
          prNumber: input.prNumber,
          status: input.status,
          department: input.department || null,
          needDate: input.needDate || null,
          notes: input.notes || null,
          companyId: input.companyId,
        })
        .returning({ id: purchaseRequests.id });

      await tx.insert(prItems).values(
        input.items.map((item) => ({
          prId: pr.id,
          description: item.description,
          spec: item.spec || null,
          quantity: item.quantity,
          estPrice: item.estPrice,
        }))
      );

      return pr.id;
    });

    await recordAudit({
      entityType: "pr",
      entityId: purchaseRequestId,
      action: "create",
      actorUserId: user.id,
    });

    return { success: true, purchaseRequestId };
  } catch {
    return { success: false, error: "Gagal menyimpan purchase request." };
  }
}

export type PurchaseRequestItemRecord = {
  description: string;
  spec: string | null;
  quantity: number;
  estPrice: number;
};

export type PurchaseRequestDetail = {
  id: string;
  prNumber: string;
  status: PrStatus;
  department: string | null;
  needDate: string | null;
  notes: string | null;
  items: PurchaseRequestItemRecord[];
};

/** Server Action untuk mengambil satu Purchase Request beserta item-itemnya. */
export async function getPurchaseRequestAction(
  id: string
): Promise<PurchaseRequestDetail | null> {
  const [pr] = await db
    .select()
    .from(purchaseRequests)
    .where(eq(purchaseRequests.id, id))
    .limit(1);
  if (!pr) return null;

  const items = await db
    .select({
      description: prItems.description,
      spec: prItems.spec,
      quantity: prItems.quantity,
      estPrice: prItems.estPrice,
    })
    .from(prItems)
    .where(eq(prItems.prId, id));

  return {
    id: pr.id,
    prNumber: pr.prNumber,
    status: pr.status,
    department: pr.department,
    needDate: pr.needDate,
    notes: pr.notes,
    items,
  };
}

export type UpdatePurchaseRequestStatusResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Mengubah status Purchase Request (mis. draft → menunggu_approval → disetujui).
 * Mencatat approve/reject/update di jejak audit dan memicu notifikasi bila berubah.
 */
export async function updatePurchaseRequestStatusAction(
  prId: string,
  newStatus: PrStatus
): Promise<UpdatePurchaseRequestStatusResult> {
  const user = await requireSessionUser();

  const [pr] = await db
    .select({
      id: purchaseRequests.id,
      prNumber: purchaseRequests.prNumber,
      status: purchaseRequests.status,
      userId: purchaseRequests.userId,
    })
    .from(purchaseRequests)
    .where(eq(purchaseRequests.id, prId))
    .limit(1);

  if (!pr) {
    return { success: false, error: "Purchase request tidak ditemukan." };
  }
  if (pr.status === newStatus) {
    return { success: true };
  }

  try {
    await db
      .update(purchaseRequests)
      .set({ status: newStatus })
      .where(eq(purchaseRequests.id, prId));
  } catch {
    return { success: false, error: "Gagal memperbarui status purchase request." };
  }

  await createNotification({
    userId: pr.userId ?? user.id,
    type: "pr_status",
    title: `PR ${pr.prNumber} → ${PR_STATUS_LABELS[newStatus]}`,
    docType: "pr",
    docId: pr.id,
  });

  await recordAudit({
    entityType: "pr",
    entityId: pr.id,
    action:
      newStatus === "disetujui"
        ? "approve"
        : newStatus === "ditolak"
          ? "reject"
          : "update",
    actorUserId: user.id,
    changes: { status: { from: pr.status, to: newStatus } },
  });

  return { success: true };
}
