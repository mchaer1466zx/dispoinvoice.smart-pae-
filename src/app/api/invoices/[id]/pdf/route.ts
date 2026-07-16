import { eq } from "drizzle-orm";
import { db } from "@/db";
import { invoices } from "@/db/schema";
import { generateInvoicePdf } from "@/lib/pdf/generate-invoice-pdf";

/** Route handler untuk mengunduh/membuka PDF invoice — dipakai sebagai tautan berbagi. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const buffer = await generateInvoicePdf(id);

  if (!buffer) {
    return new Response("Invoice tidak ditemukan.", { status: 404 });
  }

  const [invoice] = await db
    .select({ invoiceNumber: invoices.invoiceNumber })
    .from(invoices)
    .where(eq(invoices.id, id))
    .limit(1);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice?.invoiceNumber ?? "invoice"}.pdf"`,
    },
  });
}
