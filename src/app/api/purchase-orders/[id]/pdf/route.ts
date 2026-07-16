import { eq } from "drizzle-orm";
import { db } from "@/db";
import { purchaseOrders } from "@/db/schema";
import { generatePoPdf } from "@/lib/pdf/generate-po-pdf";

/** Route handler untuk mengunduh/membuka PDF purchase order — dipakai sebagai tautan berbagi. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const buffer = await generatePoPdf(id);

  if (!buffer) {
    return new Response("Purchase order tidak ditemukan.", { status: 404 });
  }

  const [po] = await db
    .select({ poNumber: purchaseOrders.poNumber })
    .from(purchaseOrders)
    .where(eq(purchaseOrders.id, id))
    .limit(1);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${po?.poNumber ?? "purchase-order"}.pdf"`,
    },
  });
}
