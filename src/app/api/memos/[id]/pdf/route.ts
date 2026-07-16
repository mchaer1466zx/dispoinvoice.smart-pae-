import { eq } from "drizzle-orm";
import { db } from "@/db";
import { memos } from "@/db/schema";
import { generateMemoPdf } from "@/lib/pdf/generate-memo-pdf";

/** Route handler untuk mengunduh/membuka PDF memo disposisi — dipakai sebagai tautan berbagi. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const buffer = await generateMemoPdf(id);

  if (!buffer) {
    return new Response("Memo tidak ditemukan.", { status: 404 });
  }

  const [memo] = await db
    .select({ subject: memos.subject })
    .from(memos)
    .where(eq(memos.id, id))
    .limit(1);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${memo?.subject || "memo"}.pdf"`,
    },
  });
}
