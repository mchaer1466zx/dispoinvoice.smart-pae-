import { and, eq, isNotNull, lt, ne } from "drizzle-orm";
import { db } from "@/db";
import { invoices } from "@/db/schema";
import { createNotification } from "@/lib/notify";

/** Format tanggal ISO (YYYY-MM-DD) untuk pembandingan dengan kolom due_date (text). */
function isoDate(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/**
 * Route reminder jatuh tempo invoice, dipanggil harian oleh Vercel Cron.
 * - Invoice belum "lunas" & jatuh tempo H-3 → notifikasi invoice_due_soon.
 * - Invoice belum "lunas" & sudah lewat jatuh tempo → notifikasi invoice_overdue.
 *
 * dedupeKey mencegah notifikasi berganda meski cron berjalan berulang:
 * - due_soon sekali per invoice, overdue sekali per invoice per hari.
 *
 * Dilindungi CRON_SECRET bila env tersebut diset (Vercel mengirim header
 * `Authorization: Bearer <CRON_SECRET>`).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const today = isoDate(0);
  const inThreeDays = isoDate(3);

  // Invoice yang akan jatuh tempo tepat 3 hari lagi (H-3) & belum lunas.
  const dueSoon = await db
    .select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      userId: invoices.userId,
    })
    .from(invoices)
    .where(
      and(
        ne(invoices.status, "lunas"),
        eq(invoices.dueDate, inThreeDays)
      )
    );

  // Invoice yang sudah lewat jatuh tempo & belum lunas.
  const overdue = await db
    .select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      userId: invoices.userId,
    })
    .from(invoices)
    .where(
      and(
        ne(invoices.status, "lunas"),
        isNotNull(invoices.dueDate),
        lt(invoices.dueDate, today)
      )
    );

  let dueSoonCount = 0;
  for (const inv of dueSoon) {
    if (!inv.userId) continue; // tanpa pemilik dokumen, tak ada tujuan notifikasi
    await createNotification({
      userId: inv.userId,
      type: "invoice_due_soon",
      title: `Invoice ${inv.invoiceNumber} jatuh tempo 3 hari lagi`,
      docType: "invoice",
      docId: inv.id,
      dedupeKey: `due_soon:${inv.id}`,
    });
    dueSoonCount += 1;
  }

  let overdueCount = 0;
  for (const inv of overdue) {
    if (!inv.userId) continue;
    await createNotification({
      userId: inv.userId,
      type: "invoice_overdue",
      title: `Invoice ${inv.invoiceNumber} telah jatuh tempo`,
      docType: "invoice",
      docId: inv.id,
      dedupeKey: `overdue:${inv.id}:${today}`,
    });
    overdueCount += 1;
  }

  return Response.json({
    ok: true,
    date: today,
    dueSoon: dueSoonCount,
    overdue: overdueCount,
  });
}
