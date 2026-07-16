"use server";

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

/**
 * Server Action pertama untuk menyimpan invoice.
 *
 * Ini masih memakai penyimpanan tiruan (belum tersambung ke database).
 * Setelah skema Drizzle ORM & koneksi SQLite dipasang pada fase backend,
 * ganti bagian bertanda TODO dengan query insert ke tabel Invoices/InvoiceItems.
 */
export async function createInvoiceAction(
  input: CreateInvoiceInput
): Promise<CreateInvoiceResult> {
  if (!input.invoiceNumber.trim()) {
    return { success: false, error: "Nomor invoice wajib diisi." };
  }

  if (input.items.length === 0) {
    return { success: false, error: "Invoice harus memiliki minimal satu item." };
  }

  // Simulasi latensi penyimpanan (data tiruan, belum ke database).
  await new Promise((resolve) => setTimeout(resolve, 400));

  // TODO: ganti dengan insert Drizzle ke tabel Invoices & InvoiceItems.
  return { success: true, invoiceId: `mock-${input.invoiceNumber}` };
}
