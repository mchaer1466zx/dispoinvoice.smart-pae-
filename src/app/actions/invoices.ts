"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { invoices, invoiceItems } from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";
import { createNotification } from "@/lib/notify";
import { generateInvoiceNumberAction } from "@/app/actions/numbering";

export type CreateInvoiceItemInput = {
  description: string;
  quantity: number;
  price: number;
};

export type CreateInvoiceInput = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: "draft" | "terkirim" | "lunas";
  tax: number;
  discount: number;
  notes: string;
  customerId: string | null;
  companyId: string | null;
  items: CreateInvoiceItemInput[];
};

export type CreateInvoiceResult =
  | { success: true; invoiceId: string }
  | { success: false; error: string };

/** Server Action untuk menyimpan invoice beserta item-itemnya ke database. */
export async function createInvoiceAction(
  input: CreateInvoiceInput
): Promise<CreateInvoiceResult> {
  const user = await requireSessionUser();
  if (!input.invoiceNumber.trim()) {
    return { success: false, error: "Nomor invoice wajib diisi." };
  }

  if (input.items.length === 0) {
    return { success: false, error: "Invoice harus memiliki minimal satu item." };
  }

  try {
    const invoiceId = await db.transaction(async (tx) => {
      const [invoice] = await tx
        .insert(invoices)
        .values({
          userId: user.id,
          invoiceNumber: input.invoiceNumber,
          issueDate: input.issueDate,
          dueDate: input.dueDate || null,
          status: input.status,
          tax: input.tax,
          discount: input.discount,
          notes: input.notes || null,
          customerId: input.customerId,
          companyId: input.companyId,
        })
        .returning({ id: invoices.id });

      await tx.insert(invoiceItems).values(
        input.items.map((item) => ({
          invoiceId: invoice.id,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
        }))
      );

      return invoice.id;
    });

    return { success: true, invoiceId };
  } catch {
    return { success: false, error: "Gagal menyimpan invoice ke database." };
  }
}

export type InvoiceStatus = "draft" | "terkirim" | "lunas";

const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft",
  terkirim: "Terkirim",
  lunas: "Lunas",
};

export type UpdateInvoiceStatusResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Server Action untuk mengubah status sebuah invoice (mis. draft → lunas).
 * Memicu notifikasi in-app `invoice_status` HANYA bila status benar-benar
 * berubah, sehingga tidak ada notifikasi palsu saat status diset ke nilai
 * yang sama. Kegagalan notifikasi tidak memengaruhi hasil pembaruan status.
 */
export async function updateInvoiceStatusAction(
  invoiceId: string,
  newStatus: InvoiceStatus
): Promise<UpdateInvoiceStatusResult> {
  const user = await requireSessionUser();

  const [invoice] = await db
    .select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      status: invoices.status,
      userId: invoices.userId,
    })
    .from(invoices)
    .where(eq(invoices.id, invoiceId))
    .limit(1);

  if (!invoice) {
    return { success: false, error: "Invoice tidak ditemukan." };
  }

  // Tidak ada perubahan → sukses tanpa notifikasi.
  if (invoice.status === newStatus) {
    return { success: true };
  }

  try {
    await db
      .update(invoices)
      .set({ status: newStatus })
      .where(eq(invoices.id, invoiceId));
  } catch {
    return { success: false, error: "Gagal memperbarui status invoice." };
  }

  // Pemicu notifikasi: penerima memakai pemilik dokumen bila sudah terisi
  // (audit trail), jika belum fallback ke pengguna sesi yang mengubah.
  await createNotification({
    userId: invoice.userId ?? user.id,
    type: "invoice_status",
    title: `Invoice ${invoice.invoiceNumber} → ${INVOICE_STATUS_LABELS[newStatus]}`,
    docType: "invoice",
    docId: invoice.id,
  });

  return { success: true };
}

export type DuplicateInvoiceResult =
  | { success: true; invoiceId: string }
  | { success: false; error: string };

/**
 * Server Action "Duplikat" (Copy as New): membuat invoice baru dari invoice lama
 * untuk mempercepat input data serupa. Salinan selalu berstatus `draft`, memakai
 * nomor urut baru & tanggal terbit hari ini, mencatat parentId sebagai jejak asal,
 * dan menyalin pelanggan, perusahaan, pajak, diskon, catatan, serta item.
 */
export async function duplicateInvoiceAction(
  sourceId: string
): Promise<DuplicateInvoiceResult> {
  const user = await requireSessionUser();

  const [source] = await db
    .select()
    .from(invoices)
    .where(eq(invoices.id, sourceId))
    .limit(1);

  if (!source) {
    return { success: false, error: "Invoice tidak ditemukan." };
  }

  const items = await db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, sourceId));

  const newNumber = await generateInvoiceNumberAction();
  const today = new Date().toISOString().slice(0, 10);

  try {
    const invoiceId = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(invoices)
        .values({
          userId: user.id,
          invoiceNumber: newNumber,
          status: "draft",
          issueDate: today,
          dueDate: source.dueDate,
          tax: source.tax,
          discount: source.discount,
          notes: source.notes,
          customerId: source.customerId,
          companyId: source.companyId,
          parentId: source.id,
        })
        .returning({ id: invoices.id });

      if (items.length > 0) {
        await tx.insert(invoiceItems).values(
          items.map((item) => ({
            invoiceId: created.id,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          }))
        );
      }

      return created.id;
    });

    return { success: true, invoiceId };
  } catch {
    return { success: false, error: "Gagal menduplikasi invoice." };
  }
}
