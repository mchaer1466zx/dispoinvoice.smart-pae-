"use server";

import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { rfqs, rfqItems } from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";
import { createNotification } from "@/lib/notify";
import { recordAudit } from "@/lib/audit";
import { generateRfqNumberAction } from "@/app/actions/numbering";

export type RfqStatus =
  | "draft"
  | "terkirim"
  | "dijawab"
  | "ditutup"
  | "dibatalkan";

export type RfqItemInput = {
  group: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
};

export type RfqInput = {
  rfqNumber: string;
  requestDate: string;
  status: RfqStatus;
  deadline: string;
  notes: string;
  supplierId: string | null;
  companyId: string | null;
  items: RfqItemInput[];
};

export type RfqItemRecord = {
  id: string;
  group: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
};

export type RfqRecord = {
  id: string;
  rfqNumber: string;
  requestDate: string;
  status: RfqStatus;
  deadline: string | null;
  notes: string | null;
  supplierId: string | null;
  companyId: string | null;
  createdAt: string;
};

export type RfqWithItems = RfqRecord & {
  items: RfqItemRecord[];
};

export type RfqActionResult =
  | { success: true; rfq: RfqWithItems }
  | { success: false; error: string };

export type DeleteRfqResult =
  | { success: true }
  | { success: false; error: string };

const RFQ_COLUMNS = {
  id: rfqs.id,
  rfqNumber: rfqs.rfqNumber,
  requestDate: rfqs.requestDate,
  status: rfqs.status,
  deadline: rfqs.deadline,
  notes: rfqs.notes,
  supplierId: rfqs.supplierId,
  companyId: rfqs.companyId,
  createdAt: rfqs.createdAt,
};

const RFQ_ITEM_COLUMNS = {
  id: rfqItems.id,
  groupLabel: rfqItems.groupLabel,
  description: rfqItems.description,
  quantity: rfqItems.quantity,
  unit: rfqItems.unit,
  price: rfqItems.price,
};

/** Memetakan baris item DB (groupLabel/unit nullable) ke RfqItemRecord. */
function toItemRecord(row: {
  id: string;
  groupLabel: string | null;
  description: string;
  quantity: number;
  unit: string | null;
  price: number;
}): RfqItemRecord {
  return {
    id: row.id,
    group: row.groupLabel ?? "",
    description: row.description,
    quantity: row.quantity,
    unit: row.unit ?? "",
    price: row.price,
  };
}

function validateInput(input: RfqInput): string | null {
  if (!input.rfqNumber.trim()) {
    return "Nomor RFQ wajib diisi.";
  }
  if (!input.items.some((item) => item.description.trim())) {
    return "Minimal satu item dengan deskripsi wajib diisi.";
  }
  return null;
}

/** Server Action untuk mengambil daftar RFQ, dipakai pada halaman riwayat. */
export async function listRfqsAction(): Promise<RfqRecord[]> {
  await requireSessionUser();
  return db.select(RFQ_COLUMNS).from(rfqs).orderBy(asc(rfqs.rfqNumber));
}

/** Server Action untuk mengambil satu RFQ beserta item-itemnya. */
export async function getRfqAction(id: string): Promise<RfqWithItems | null> {
  const [rfq] = await db
    .select(RFQ_COLUMNS)
    .from(rfqs)
    .where(eq(rfqs.id, id))
    .limit(1);

  if (!rfq) return null;

  const items = await db
    .select(RFQ_ITEM_COLUMNS)
    .from(rfqItems)
    .where(eq(rfqItems.rfqId, id));

  return { ...rfq, items: items.map(toItemRecord) };
}

/** Server Action untuk menyimpan RFQ baru beserta item-itemnya. */
export async function createRfqAction(
  input: RfqInput
): Promise<RfqActionResult> {
  const user = await requireSessionUser();
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const rfq = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(rfqs)
        .values({
          userId: user.id,
          rfqNumber: input.rfqNumber,
          requestDate: input.requestDate,
          status: input.status,
          deadline: input.deadline || null,
          notes: input.notes || null,
          supplierId: input.supplierId,
          companyId: input.companyId,
        })
        .returning(RFQ_COLUMNS);

      const items = await tx
        .insert(rfqItems)
        .values(
          input.items.map((item) => ({
            rfqId: created.id,
            groupLabel: item.group || null,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit || null,
            price: item.price,
          }))
        )
        .returning(RFQ_ITEM_COLUMNS);

      return { ...created, items: items.map(toItemRecord) };
    });

    await recordAudit({
      entityType: "rfq",
      entityId: rfq.id,
      action: "create",
      actorUserId: user.id,
    });

    return { success: true, rfq };
  } catch {
    return { success: false, error: "Gagal menyimpan RFQ ke database." };
  }
}

/** Server Action untuk mengubah RFQ (item lama diganti seluruhnya). */
export async function updateRfqAction(
  id: string,
  input: RfqInput
): Promise<RfqActionResult> {
  await requireSessionUser();
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const rfq = await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(rfqs)
        .set({
          rfqNumber: input.rfqNumber,
          requestDate: input.requestDate,
          status: input.status,
          deadline: input.deadline || null,
          notes: input.notes || null,
          supplierId: input.supplierId,
          companyId: input.companyId,
        })
        .where(eq(rfqs.id, id))
        .returning(RFQ_COLUMNS);

      if (!updated) return null;

      await tx.delete(rfqItems).where(eq(rfqItems.rfqId, id));

      const items = await tx
        .insert(rfqItems)
        .values(
          input.items.map((item) => ({
            rfqId: updated.id,
            groupLabel: item.group || null,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit || null,
            price: item.price,
          }))
        )
        .returning(RFQ_ITEM_COLUMNS);

      return { ...updated, items: items.map(toItemRecord) };
    });

    if (!rfq) {
      return { success: false, error: "RFQ tidak ditemukan." };
    }

    return { success: true, rfq };
  } catch {
    return { success: false, error: "Gagal mengubah RFQ." };
  }
}

export const RFQ_STATUS_LABELS: Record<RfqStatus, string> = {
  draft: "Draft",
  terkirim: "Terkirim",
  dijawab: "Dijawab",
  ditutup: "Ditutup",
  dibatalkan: "Dibatalkan",
};

export type UpdateRfqStatusResult =
  | { success: true }
  | { success: false; error: string };

/** Server Action untuk mengubah status RFQ; memicu notifikasi bila berubah. */
export async function updateRfqStatusAction(
  rfqId: string,
  newStatus: RfqStatus
): Promise<UpdateRfqStatusResult> {
  const user = await requireSessionUser();

  const [rfq] = await db
    .select({
      id: rfqs.id,
      rfqNumber: rfqs.rfqNumber,
      status: rfqs.status,
      userId: rfqs.userId,
    })
    .from(rfqs)
    .where(eq(rfqs.id, rfqId))
    .limit(1);

  if (!rfq) {
    return { success: false, error: "RFQ tidak ditemukan." };
  }

  if (rfq.status === newStatus) {
    return { success: true };
  }

  try {
    await db.update(rfqs).set({ status: newStatus }).where(eq(rfqs.id, rfqId));
  } catch {
    return { success: false, error: "Gagal memperbarui status RFQ." };
  }

  await createNotification({
    userId: rfq.userId ?? user.id,
    type: "rfq_status",
    title: `RFQ ${rfq.rfqNumber} → ${RFQ_STATUS_LABELS[newStatus]}`,
    docType: "rfq",
    docId: rfq.id,
  });

  await recordAudit({
    entityType: "rfq",
    entityId: rfq.id,
    action: "update",
    actorUserId: user.id,
    changes: { status: { from: rfq.status, to: newStatus } },
  });

  return { success: true };
}

export type DuplicateRfqResult =
  | { success: true; rfqId: string }
  | { success: false; error: string };

/** Server Action "Duplikat" (Copy as New) untuk RFQ. */
export async function duplicateRfqAction(
  sourceId: string
): Promise<DuplicateRfqResult> {
  const user = await requireSessionUser();

  const [source] = await db
    .select()
    .from(rfqs)
    .where(eq(rfqs.id, sourceId))
    .limit(1);

  if (!source) {
    return { success: false, error: "RFQ tidak ditemukan." };
  }

  const items = await db
    .select()
    .from(rfqItems)
    .where(eq(rfqItems.rfqId, sourceId));

  const newNumber = await generateRfqNumberAction();
  const today = new Date().toISOString().slice(0, 10);

  try {
    const rfqId = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(rfqs)
        .values({
          userId: user.id,
          rfqNumber: newNumber,
          status: "draft",
          requestDate: today,
          deadline: source.deadline,
          notes: source.notes,
          supplierId: source.supplierId,
          companyId: source.companyId,
          parentId: source.id,
        })
        .returning({ id: rfqs.id });

      if (items.length > 0) {
        await tx.insert(rfqItems).values(
          items.map((item) => ({
            rfqId: created.id,
            groupLabel: item.groupLabel,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
          }))
        );
      }

      return created.id;
    });

    return { success: true, rfqId };
  } catch {
    return { success: false, error: "Gagal menduplikasi RFQ." };
  }
}

/** Server Action untuk menghapus RFQ; item terkait ikut terhapus (cascade). */
export async function deleteRfqAction(id: string): Promise<DeleteRfqResult> {
  await requireSessionUser();
  const [deleted] = await db
    .delete(rfqs)
    .where(eq(rfqs.id, id))
    .returning({ id: rfqs.id });

  if (!deleted) {
    return { success: false, error: "RFQ tidak ditemukan." };
  }

  return { success: true };
}
