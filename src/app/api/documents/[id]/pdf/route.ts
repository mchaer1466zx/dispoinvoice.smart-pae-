import { eq } from "drizzle-orm";
import { db } from "@/db";
import { invoices, memos, purchaseOrders } from "@/db/schema";
import { generateInvoicePdf } from "@/lib/pdf/generate-invoice-pdf";
import { generateMemoPdf } from "@/lib/pdf/generate-memo-pdf";
import { generatePoPdf } from "@/lib/pdf/generate-po-pdf";

/**
 * Route handler untuk mengunduh PDF dokumen apa pun (invoice, PO, atau memo) dari
 * halaman Riwayat Dokumen berdasarkan id-nya saja, tanpa perlu tahu jenisnya di client.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [invoice] = await db
    .select({ invoiceNumber: invoices.invoiceNumber })
    .from(invoices)
    .where(eq(invoices.id, id))
    .limit(1);

  if (invoice) {
    const buffer = await generateInvoicePdf(id);
    if (!buffer) {
      return new Response("Dokumen tidak ditemukan.", { status: 404 });
    }
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.pdf"`,
      },
    });
  }

  const [po] = await db
    .select({ poNumber: purchaseOrders.poNumber })
    .from(purchaseOrders)
    .where(eq(purchaseOrders.id, id))
    .limit(1);

  if (po) {
    const buffer = await generatePoPdf(id);
    if (!buffer) {
      return new Response("Dokumen tidak ditemukan.", { status: 404 });
    }
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${po.poNumber}.pdf"`,
      },
    });
  }

  const [memo] = await db
    .select({ subject: memos.subject })
    .from(memos)
    .where(eq(memos.id, id))
    .limit(1);

  if (memo) {
    const buffer = await generateMemoPdf(id);
    if (!buffer) {
      return new Response("Dokumen tidak ditemukan.", { status: 404 });
    }
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${memo.subject || "memo"}.pdf"`,
      },
    });
  }

  return new Response("Dokumen tidak ditemukan.", { status: 404 });
}
