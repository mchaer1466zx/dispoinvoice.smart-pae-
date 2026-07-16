"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Resend } from "resend";
import { db } from "@/db";
import { invoices } from "@/db/schema";
import { generateInvoicePdf } from "@/lib/pdf/generate-invoice-pdf";

export type GetInvoiceShareLinkResult =
  | { success: true; url: string }
  | { success: false; error: string };

/** Server Action untuk mendapatkan tautan berbagi (unduh PDF) sebuah invoice. */
export async function getInvoiceShareLinkAction(
  invoiceId: string
): Promise<GetInvoiceShareLinkResult> {
  const [invoice] = await db
    .select({ id: invoices.id })
    .from(invoices)
    .where(eq(invoices.id, invoiceId))
    .limit(1);

  if (!invoice) {
    return { success: false, error: "Invoice tidak ditemukan." };
  }

  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) {
    return { success: false, error: "Tidak dapat menentukan alamat server." };
  }

  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1")
    ? "http"
    : "https";

  return { success: true, url: `${protocol}://${host}/api/invoices/${invoiceId}/pdf` };
}

export type SendInvoiceEmailInput = {
  invoiceId: string;
  recipientEmail: string;
};

export type SendInvoiceEmailResult =
  | { success: true }
  | { success: false; error: string };

/** Server Action untuk mengirim invoice ke atasan/pihak terkait via email dengan lampiran PDF. */
export async function sendInvoiceEmailAction(
  input: SendInvoiceEmailInput
): Promise<SendInvoiceEmailResult> {
  if (!input.recipientEmail.trim()) {
    return { success: false, error: "Email penerima wajib diisi." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error: "Layanan email belum dikonfigurasi (RESEND_API_KEY belum diatur).",
    };
  }

  const pdfBuffer = await generateInvoicePdf(input.invoiceId);
  if (!pdfBuffer) {
    return { success: false, error: "Invoice tidak ditemukan." };
  }

  const [invoice] = await db
    .select({ invoiceNumber: invoices.invoiceNumber })
    .from(invoices)
    .where(eq(invoices.id, input.invoiceId))
    .limit(1);

  const invoiceNumber = invoice?.invoiceNumber ?? "invoice";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.INVOICE_EMAIL_FROM ?? "DispoInvoice <invoice@dispoinvoice.app>",
    to: input.recipientEmail,
    subject: `Invoice ${invoiceNumber}`,
    text: `Berikut invoice ${invoiceNumber} terlampir dalam format PDF.`,
    attachments: [
      {
        filename: `${invoiceNumber}.pdf`,
        content: pdfBuffer.toString("base64"),
      },
    ],
  });

  if (error) {
    return { success: false, error: "Gagal mengirim email." };
  }

  return { success: true };
}
