"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Resend } from "resend";
import { db } from "@/db";
import { memos } from "@/db/schema";
import { generateMemoPdf } from "@/lib/pdf/generate-memo-pdf";

export type GetMemoShareLinkResult =
  | { success: true; url: string }
  | { success: false; error: string };

/** Server Action untuk mendapatkan tautan berbagi (unduh PDF) sebuah memo disposisi. */
export async function getMemoShareLinkAction(
  memoId: string
): Promise<GetMemoShareLinkResult> {
  const [memo] = await db
    .select({ id: memos.id })
    .from(memos)
    .where(eq(memos.id, memoId))
    .limit(1);

  if (!memo) {
    return { success: false, error: "Memo tidak ditemukan." };
  }

  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) {
    return { success: false, error: "Tidak dapat menentukan alamat server." };
  }

  const protocol =
    host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";

  return { success: true, url: `${protocol}://${host}/api/memos/${memoId}/pdf` };
}

export type SendMemoEmailInput = {
  memoId: string;
  recipientEmail: string;
};

export type SendMemoEmailResult =
  | { success: true }
  | { success: false; error: string };

/** Server Action untuk mengirim memo disposisi ke penerima via email dengan lampiran PDF. */
export async function sendMemoEmailAction(
  input: SendMemoEmailInput
): Promise<SendMemoEmailResult> {
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

  const pdfBuffer = await generateMemoPdf(input.memoId);
  if (!pdfBuffer) {
    return { success: false, error: "Memo tidak ditemukan." };
  }

  const [memo] = await db
    .select({ subject: memos.subject })
    .from(memos)
    .where(eq(memos.id, input.memoId))
    .limit(1);

  const subject = memo?.subject || "Memo Disposisi";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.INVOICE_EMAIL_FROM ?? "DispoInvoice <invoice@dispoinvoice.app>",
    to: input.recipientEmail,
    subject: `Memo Disposisi: ${subject}`,
    text: `Berikut memo disposisi "${subject}" terlampir dalam format PDF.`,
    attachments: [
      {
        filename: `${subject}.pdf`,
        content: pdfBuffer.toString("base64"),
      },
    ],
  });

  if (error) {
    return { success: false, error: "Gagal mengirim email." };
  }

  return { success: true };
}
