"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Resend } from "resend";
import { db } from "@/db";
import { purchaseOrders } from "@/db/schema";
import { generatePoPdf } from "@/lib/pdf/generate-po-pdf";

export type GetPoShareLinkResult =
  | { success: true; url: string }
  | { success: false; error: string };

/** Server Action untuk mendapatkan tautan berbagi (unduh PDF) sebuah purchase order. */
export async function getPoShareLinkAction(
  poId: string
): Promise<GetPoShareLinkResult> {
  const [po] = await db
    .select({ id: purchaseOrders.id })
    .from(purchaseOrders)
    .where(eq(purchaseOrders.id, poId))
    .limit(1);

  if (!po) {
    return { success: false, error: "Purchase order tidak ditemukan." };
  }

  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) {
    return { success: false, error: "Tidak dapat menentukan alamat server." };
  }

  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1")
    ? "http"
    : "https";

  return { success: true, url: `${protocol}://${host}/api/purchase-orders/${poId}/pdf` };
}

export type SendPoEmailInput = {
  poId: string;
  recipientEmail: string;
};

export type SendPoEmailResult =
  | { success: true }
  | { success: false; error: string };

/** Server Action untuk mengirim purchase order ke pemasok/atasan via email dengan lampiran PDF. */
export async function sendPoEmailAction(
  input: SendPoEmailInput
): Promise<SendPoEmailResult> {
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

  const pdfBuffer = await generatePoPdf(input.poId);
  if (!pdfBuffer) {
    return { success: false, error: "Purchase order tidak ditemukan." };
  }

  const [po] = await db
    .select({ poNumber: purchaseOrders.poNumber })
    .from(purchaseOrders)
    .where(eq(purchaseOrders.id, input.poId))
    .limit(1);

  const poNumber = po?.poNumber ?? "purchase-order";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.INVOICE_EMAIL_FROM ?? "DispoInvoice <invoice@dispoinvoice.app>",
    to: input.recipientEmail,
    subject: `Purchase Order ${poNumber}`,
    text: `Berikut purchase order ${poNumber} terlampir dalam format PDF.`,
    attachments: [
      {
        filename: `${poNumber}.pdf`,
        content: pdfBuffer.toString("base64"),
      },
    ],
  });

  if (error) {
    return { success: false, error: "Gagal mengirim email." };
  }

  return { success: true };
}
