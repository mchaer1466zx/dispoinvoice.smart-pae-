"use server";

import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { supplierInvoices, supplierInvoiceItems } from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";
import { createNotification } from "@/lib/notify";
import { recordAudit } from "@/lib/audit";
import { generateSupplierInvoiceNumberAction } from "@/app/actions/numbering";

export type SupplierInvoiceStatus =
  | "draft"
  | "belum_dibayar"
  | "dibayar_sebagian"
  | "lunas"
  | "dibatalkan";

export type SupplierInvoiceItemInput = {
  group: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
};

export type SupplierInvoiceInput = {
  invoiceNumber: string;
  supplierRef: string;
  poReference: string;
  invoiceDate: string;
  dueDate: string;
  status: SupplierInvoiceStatus;
  tax: number;
  discount: number;
  notes: string;
  supplierId: string | null;
  companyId: string | null;
  items: SupplierInvoiceItemInput[];
};

export type SupplierInvoiceItemRecord = {
  id: string;
  group: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
};

export type SupplierInvoiceRecord = {
  id: string;
  invoiceNumber: string;
  supplierRef: string | null;
  poReference: string | null;
  invoiceDate: string;
  dueDate: string | null;
  status: SupplierInvoiceStatus;
  tax: number;
  discount: number;
  notes: string | null;
  supplierId: string | null;
  companyId: string | null;
  createdAt: string;
};

export type SupplierInvoiceWithItems = SupplierInvoiceRecord & {
  items: SupplierInvoiceItemRecord[];
};

export type SupplierInvoiceActionResult =
  | { success: true; supplierInvoice: SupplierInvoiceWithItems }
  | { success: false; error: string };

export type DeleteSupplierInvoiceResult =
  | { success: true }
  | { success: false; error: string };

const SI_COLUMNS = {
  id: supplierInvoices.id,
  invoiceNumber: supplierInvoices.invoiceNumber,
  supplierRef: supplierInvoices.supplierRef,
  poReference: supplierInvoices.poReference,
  invoiceDate: supplierInvoices.invoiceDate,
  dueDate: supplierInvoices.dueDate,
  status: supplierInvoices.status,
  tax: supplierInvoices.tax,
  discount: supplierInvoices.discount,
  notes: supplierInvoices.notes,
  supplierId: supplierInvoices.supplierId,
  companyId: supplierInvoices.companyId,
  createdAt: supplierInvoices.createdAt,
};

const SI_ITEM_COLUMNS = {
  id: supplierInvoiceItems.id,
  groupLabel: supplierInvoiceItems.groupLabel,
  description: supplierInvoiceItems.description,
  quantity: supplierInvoiceItems.quantity,
  unit: supplierInvoiceItems.unit,
  price: supplierInvoiceItems.price,
};

/** Memetakan baris item DB (groupLabel/unit nullable) ke SupplierInvoiceItemRecord. */
function toItemRecord(row: {
  id: string;
  groupLabel: string | null;
  description: string;
  quantity: number;
  unit: string | null;
  price: number;
}): SupplierInvoiceItemRecord {
  return {
    id: row.id,
    group: row.groupLabel ?? "",
    description: row.description,
    quantity: row.quantity,
    unit: row.unit ?? "",
    price: row.price,
  };
}

function validateInput(input: SupplierInvoiceInput): string | null {
  if (!input.invoiceNumber.trim()) {
    return "Nomor tagihan wajib diisi.";
  }
  if (!input.items.some((item) => item.description.trim())) {
    return "Minimal satu item dengan deskripsi wajib diisi.";
  }
  return null;
}

/** Server Action untuk mengambil daftar tagihan pemasok, dipakai pada halaman riwayat. */
export async function listSupplierInvoicesAction(): Promise<SupplierInvoiceRecord[]> {
  await requireSessionUser();
  return db
    .select(SI_COLUMNS)
    .from(supplierInvoices)
    .orderBy(asc(supplierInvoices.invoiceNumber));
}

/** Server Action untuk mengambil satu tagihan pemasok beserta item-itemnya. */
export async function getSupplierInvoiceAction(
  id: string
): Promise<SupplierInvoiceWithItems | null> {
  const [si] = await db
    .select(SI_COLUMNS)
    .from(supplierInvoices)
    .where(eq(supplierInvoices.id, id))
    .limit(1);

  if (!si) return null;

  const items = await db
    .select(SI_ITEM_COLUMNS)
    .from(supplierInvoiceItems)
    .where(eq(supplierInvoiceItems.supplierInvoiceId, id));

  return { ...si, items: items.map(toItemRecord) };
}

/** Server Action untuk menyimpan tagihan pemasok baru beserta item-itemnya. */
export async function createSupplierInvoiceAction(
  input: SupplierInvoiceInput
): Promise<SupplierInvoiceActionResult> {
  const user = await requireSessionUser();
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const supplierInvoice = await db.transaction(async (tx) => {
      const [si] = await tx
        .insert(supplierInvoices)
        .values({
          userId: user.id,
          invoiceNumber: input.invoiceNumber,
          supplierRef: input.supplierRef || null,
          poReference: input.poReference || null,
          invoiceDate: input.invoiceDate,
          dueDate: input.dueDate || null,
          status: input.status,
          tax: input.tax,
          discount: input.discount,
          notes: input.notes || null,
          supplierId: input.supplierId,
          companyId: input.companyId,
        })
        .returning(SI_COLUMNS);

      const items = await tx
        .insert(supplierInvoiceItems)
        .values(
          input.items.map((item) => ({
            supplierInvoiceId: si.id,
            groupLabel: item.group || null,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit || null,
            price: item.price,
          }))
        )
        .returning(SI_ITEM_COLUMNS);

      return { ...si, items: items.map(toItemRecord) };
    });

    await recordAudit({
      entityType: "supplier_invoice",
      entityId: supplierInvoice.id,
      action: "create",
      actorUserId: user.id,
    });

    return { success: true, supplierInvoice };
  } catch {
    return { success: false, error: "Gagal menyimpan tagihan pemasok ke database." };
  }
}

/** Server Action untuk mengubah tagihan pemasok (item lama diganti seluruhnya). */
export async function updateSupplierInvoiceAction(
  id: string,
  input: SupplierInvoiceInput
): Promise<SupplierInvoiceActionResult> {
  await requireSessionUser();
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const supplierInvoice = await db.transaction(async (tx) => {
      const [si] = await tx
        .update(supplierInvoices)
        .set({
          invoiceNumber: input.invoiceNumber,
          supplierRef: input.supplierRef || null,
          poReference: input.poReference || null,
          invoiceDate: input.invoiceDate,
          dueDate: input.dueDate || null,
          status: input.status,
          tax: input.tax,
          discount: input.discount,
          notes: input.notes || null,
          supplierId: input.supplierId,
          companyId: input.companyId,
        })
        .where(eq(supplierInvoices.id, id))
        .returning(SI_COLUMNS);

      if (!si) return null;

      await tx
        .delete(supplierInvoiceItems)
        .where(eq(supplierInvoiceItems.supplierInvoiceId, id));

      const items = await tx
        .insert(supplierInvoiceItems)
        .values(
          input.items.map((item) => ({
            supplierInvoiceId: si.id,
            groupLabel: item.group || null,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit || null,
            price: item.price,
          }))
        )
        .returning(SI_ITEM_COLUMNS);

      return { ...si, items: items.map(toItemRecord) };
    });

    if (!supplierInvoice) {
      return { success: false, error: "Tagihan pemasok tidak ditemukan." };
    }

    return { success: true, supplierInvoice };
  } catch {
    return { success: false, error: "Gagal mengubah tagihan pemasok." };
  }
}

export const SUPPLIER_INVOICE_STATUS_LABELS: Record<
  SupplierInvoiceStatus,
  string
> = {
  draft: "Draft",
  belum_dibayar: "Belum Dibayar",
  dibayar_sebagian: "Dibayar Sebagian",
  lunas: "Lunas",
  dibatalkan: "Dibatalkan",
};

export type UpdateSupplierInvoiceStatusResult =
  | { success: true }
  | { success: false; error: string };

/** Server Action untuk mengubah status tagihan pemasok; memicu notifikasi bila berubah. */
export async function updateSupplierInvoiceStatusAction(
  supplierInvoiceId: string,
  newStatus: SupplierInvoiceStatus
): Promise<UpdateSupplierInvoiceStatusResult> {
  const user = await requireSessionUser();

  const [si] = await db
    .select({
      id: supplierInvoices.id,
      invoiceNumber: supplierInvoices.invoiceNumber,
      status: supplierInvoices.status,
      userId: supplierInvoices.userId,
    })
    .from(supplierInvoices)
    .where(eq(supplierInvoices.id, supplierInvoiceId))
    .limit(1);

  if (!si) {
    return { success: false, error: "Tagihan pemasok tidak ditemukan." };
  }

  if (si.status === newStatus) {
    return { success: true };
  }

  try {
    await db
      .update(supplierInvoices)
      .set({ status: newStatus })
      .where(eq(supplierInvoices.id, supplierInvoiceId));
  } catch {
    return { success: false, error: "Gagal memperbarui status tagihan pemasok." };
  }

  await createNotification({
    userId: si.userId ?? user.id,
    type: "supplier_invoice_status",
    title: `Tagihan ${si.invoiceNumber} → ${SUPPLIER_INVOICE_STATUS_LABELS[newStatus]}`,
    docType: "supplier_invoice",
    docId: si.id,
  });

  await recordAudit({
    entityType: "supplier_invoice",
    entityId: si.id,
    action: "update",
    actorUserId: user.id,
    changes: { status: { from: si.status, to: newStatus } },
  });

  return { success: true };
}

export type DuplicateSupplierInvoiceResult =
  | { success: true; supplierInvoiceId: string }
  | { success: false; error: string };

/** Server Action "Duplikat" (Copy as New) untuk tagihan pemasok. */
export async function duplicateSupplierInvoiceAction(
  sourceId: string
): Promise<DuplicateSupplierInvoiceResult> {
  const user = await requireSessionUser();

  const [source] = await db
    .select()
    .from(supplierInvoices)
    .where(eq(supplierInvoices.id, sourceId))
    .limit(1);

  if (!source) {
    return { success: false, error: "Tagihan pemasok tidak ditemukan." };
  }

  const items = await db
    .select()
    .from(supplierInvoiceItems)
    .where(eq(supplierInvoiceItems.supplierInvoiceId, sourceId));

  const newNumber = await generateSupplierInvoiceNumberAction();
  const today = new Date().toISOString().slice(0, 10);

  try {
    const supplierInvoiceId = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(supplierInvoices)
        .values({
          userId: user.id,
          invoiceNumber: newNumber,
          supplierRef: source.supplierRef,
          poReference: source.poReference,
          status: "draft",
          invoiceDate: today,
          dueDate: source.dueDate,
          tax: source.tax,
          discount: source.discount,
          notes: source.notes,
          supplierId: source.supplierId,
          companyId: source.companyId,
          parentId: source.id,
        })
        .returning({ id: supplierInvoices.id });

      if (items.length > 0) {
        await tx.insert(supplierInvoiceItems).values(
          items.map((item) => ({
            supplierInvoiceId: created.id,
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

    return { success: true, supplierInvoiceId };
  } catch {
    return { success: false, error: "Gagal menduplikasi tagihan pemasok." };
  }
}

/** Server Action untuk menghapus tagihan pemasok; item terkait ikut terhapus (cascade). */
export async function deleteSupplierInvoiceAction(
  id: string
): Promise<DeleteSupplierInvoiceResult> {
  await requireSessionUser();
  const [deleted] = await db
    .delete(supplierInvoices)
    .where(eq(supplierInvoices.id, id))
    .returning({ id: supplierInvoices.id });

  if (!deleted) {
    return { success: false, error: "Tagihan pemasok tidak ditemukan." };
  }

  return { success: true };
}
