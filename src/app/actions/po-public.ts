"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { companies, suppliers } from "@/db/schema";
import {
  getPurchaseOrderAction,
  type PurchaseOrderWithItems,
} from "@/app/actions/purchase-orders";
import { getActiveCompanyAction, type CompanyRecord } from "@/app/actions/companies";
import type { SupplierRecord } from "@/app/actions/suppliers";

export type PublicPurchaseOrder = PurchaseOrderWithItems & {
  supplier: SupplierRecord | null;
  company: CompanyRecord | null;
};

export type GetPoPublicLinkResult =
  | { success: true; url: string }
  | { success: false; error: string };

/**
 * Server Action untuk membangun tautan publik pratinjau PO tanpa login.
 * Token yang dipakai adalah id PO itu sendiri (UUID acak, tidak tertebak),
 * sehingga tidak memerlukan tabel token terpisah.
 */
export async function getPoPublicLinkAction(
  poId: string
): Promise<GetPoPublicLinkResult> {
  const po = await getPurchaseOrderAction(poId);
  if (!po) {
    return { success: false, error: "Purchase order tidak ditemukan." };
  }

  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) {
    return { success: false, error: "Tidak dapat menentukan alamat server." };
  }

  const protocol =
    host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";

  return { success: true, url: `${protocol}://${host}/po/publik/${poId}` };
}

/**
 * Server Action untuk mengambil data PO secara publik (tanpa login) berdasarkan token.
 * Dipakai oleh halaman pratinjau publik yang diakses lewat tautan berbagi.
 */
export async function getPublicPurchaseOrderAction(
  token: string
): Promise<PublicPurchaseOrder | null> {
  const po = await getPurchaseOrderAction(token);
  if (!po) return null;

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

  return { ...po, supplier, company };
}
