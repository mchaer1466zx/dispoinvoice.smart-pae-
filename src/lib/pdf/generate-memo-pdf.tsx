import path from "node:path";
import { eq } from "drizzle-orm";
import { renderToBuffer } from "@react-pdf/renderer";
import { db } from "@/db";
import { companies, memos } from "@/db/schema";
import { MemoDocument, type MemoPdfData } from "@/lib/pdf/memo-document";
import { generateVerificationQrDataUrl } from "@/lib/verification";
import { getActiveCompanyAction } from "@/app/actions/companies";

function resolveLogoSource(logoUrl: string | null): string | null {
  if (!logoUrl) return null;
  if (/^https?:\/\//.test(logoUrl)) return logoUrl;
  return path.join(process.cwd(), "public", logoUrl);
}

/**
 * Menghasilkan PDF memo disposisi (A4) berformat siap cetak, lengkap dengan logo perusahaan.
 * Dipakai oleh Server Action/route handler untuk unduh, kirim email, atau bagikan tautan.
 */
export async function generateMemoPdf(memoId: string): Promise<Buffer | null> {
  const [memo] = await db
    .select()
    .from(memos)
    .where(eq(memos.id, memoId))
    .limit(1);

  if (!memo) return null;

  const company = memo.companyId
    ? ((
        await db
          .select()
          .from(companies)
          .where(eq(companies.id, memo.companyId))
          .limit(1)
      )[0] ?? null)
    : await getActiveCompanyAction();

  const verificationQrDataUrl = await generateVerificationQrDataUrl("memo", memo.id);

  const data: MemoPdfData = {
    recipientName: memo.recipientName,
    subject: memo.subject,
    instructions: memo.instructions,
    content: memo.content,
    memoDate: memo.memoDate,
    company: {
      name: company?.name ?? "",
      address: company?.address ?? "",
      email: company?.email ?? "",
      phone: company?.phone ?? "",
      logoSource: resolveLogoSource(company?.logoUrl ?? null),
    },
    verificationQrDataUrl,
  };

  return renderToBuffer(<MemoDocument data={data} />);
}
