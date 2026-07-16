import path from "node:path";
import { eq } from "drizzle-orm";
import { renderToBuffer } from "@react-pdf/renderer";
import { db } from "@/db";
import { companies, customers, invoiceItems, invoices } from "@/db/schema";
import { InvoiceDocument, type InvoicePdfData } from "@/lib/pdf/invoice-document";
import { generateVerificationQrDataUrl } from "@/lib/verification";
import { getActiveCompanyAction } from "@/app/actions/companies";

function resolveLogoSource(logoUrl: string | null): string | null {
  if (!logoUrl) return null;
  if (/^https?:\/\//.test(logoUrl)) return logoUrl;
  return path.join(process.cwd(), "public", logoUrl);
}

/**
 * Menghasilkan PDF invoice (A4) berformat siap cetak, lengkap dengan logo perusahaan.
 * Dipakai oleh Server Action/route handler untuk unduh, kirim email, atau bagikan tautan.
 */
export async function generateInvoicePdf(invoiceId: string): Promise<Buffer | null> {
  const [invoice] = await db
    .select()
    .from(invoices)
    .where(eq(invoices.id, invoiceId))
    .limit(1);

  if (!invoice) return null;

  const items = await db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, invoiceId));

  const customer = invoice.customerId
    ? ((
        await db
          .select()
          .from(customers)
          .where(eq(customers.id, invoice.customerId))
          .limit(1)
      )[0] ?? null)
    : null;

  const company = invoice.companyId
    ? ((
        await db
          .select()
          .from(companies)
          .where(eq(companies.id, invoice.companyId))
          .limit(1)
      )[0] ?? null)
    : await getActiveCompanyAction();

  const verificationQrDataUrl = await generateVerificationQrDataUrl(
    "invoice",
    invoice.invoiceNumber
  );

  const data: InvoicePdfData = {
    invoiceNumber: invoice.invoiceNumber,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate ?? "",
    status: invoice.status,
    notes: invoice.notes,
    company: {
      name: company?.name ?? "",
      address: company?.address ?? "",
      email: company?.email ?? "",
      phone: company?.phone ?? "",
      logoSource: resolveLogoSource(company?.logoUrl ?? null),
    },
    customer: customer
      ? {
          name: customer.name,
          address: customer.address,
          email: customer.email,
          phone: customer.phone,
        }
      : null,
    items: items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      price: item.price,
    })),
    verificationQrDataUrl,
  };

  return renderToBuffer(<InvoiceDocument data={data} />);
}
