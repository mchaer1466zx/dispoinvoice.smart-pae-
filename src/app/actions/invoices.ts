"use server";

import { db } from "@/db";
import { invoices, invoiceItems } from "@/db/schema";

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
  notes: string;
  customerId: string | null;
  items: CreateInvoiceItemInput[];
};

export type CreateInvoiceResult =
  | { success: true; invoiceId: string }
  | { success: false; error: string };

/** Server Action untuk menyimpan invoice beserta item-itemnya ke database. */
export async function createInvoiceAction(
  input: CreateInvoiceInput
): Promise<CreateInvoiceResult> {
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
          invoiceNumber: input.invoiceNumber,
          issueDate: input.issueDate,
          dueDate: input.dueDate || null,
          status: input.status,
          notes: input.notes || null,
          customerId: input.customerId,
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
