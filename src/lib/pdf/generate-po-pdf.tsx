import path from "node:path";
import { eq } from "drizzle-orm";
import { renderToBuffer } from "@react-pdf/renderer";
import { db } from "@/db";
import { companies, poItems, purchaseOrders, suppliers } from "@/db/schema";
import { PoDocument, type PoPdfData } from "@/lib/pdf/po-document";
import { generateVerificationQrDataUrl } from "@/lib/verification";
import { getActiveCompanyAction } from "@/app/actions/companies";

function resolveLogoSource(logoUrl: string | null): string | null {
  if (!logoUrl) return null;
  if (/^https?:\/\//.test(logoUrl)) return logoUrl;
  return path.join(process.cwd(), "public", logoUrl);
}

/**
 * Menghasilkan PDF purchase order (A4) berformat siap cetak, lengkap dengan logo perusahaan.
 * Dipakai oleh Server Action/route handler untuk unduh, kirim email, atau bagikan tautan.
 */
export async function generatePoPdf(poId: string): Promise<Buffer | null> {
  const [po] = await db
    .select()
    .from(purchaseOrders)
    .where(eq(purchaseOrders.id, poId))
    .limit(1);

  if (!po) return null;

  const items = await db
    .select()
    .from(poItems)
    .where(eq(poItems.poId, poId));

  const supplier = po.supplierId
    ? ((
        await db
          .select()
          .from(suppliers)
          .where(eq(suppliers.id, po.supplierId))
          .limit(1)
      )[0] ?? null)
    : null;

  const company = po.companyId
    ? ((
        await db
          .select()
          .from(companies)
          .where(eq(companies.id, po.companyId))
          .limit(1)
      )[0] ?? null)
    : await getActiveCompanyAction();

  const verificationQrDataUrl = await generateVerificationQrDataUrl(
    "po",
    po.poNumber
  );

  const data: PoPdfData = {
    poNumber: po.poNumber,
    orderDate: po.orderDate,
    status: po.status,
    notes: po.notes,
    company: {
      name: company?.name ?? "",
      address: company?.address ?? "",
      email: company?.email ?? "",
      phone: company?.phone ?? "",
      logoSource: resolveLogoSource(company?.logoUrl ?? null),
    },
    supplier: supplier
      ? {
          name: supplier.name,
          address: supplier.address,
          contactInfo: supplier.contactInfo,
        }
      : null,
    items: items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      price: item.price,
    })),
    verificationQrDataUrl,
  };

  return renderToBuffer(<PoDocument data={data} />);
}
