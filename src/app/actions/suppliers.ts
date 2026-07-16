"use server";

import { asc, eq, like } from "drizzle-orm";
import { db } from "@/db";
import { suppliers } from "@/db/schema";

export type SupplierRecord = {
  id: string;
  name: string;
  contactInfo: string;
  address: string;
};

const SUPPLIER_COLUMNS = {
  id: suppliers.id,
  name: suppliers.name,
  contactInfo: suppliers.contactInfo,
  address: suppliers.address,
};

export type SupplierInput = {
  name: string;
  contactInfo: string;
  address: string;
};

export type SupplierActionResult =
  | { success: true; supplier: SupplierRecord }
  | { success: false; error: string };

export type DeleteSupplierResult =
  | { success: true }
  | { success: false; error: string };

/** Server Action untuk mengambil daftar pemasok, opsional disaring berdasarkan nama. */
export async function listSuppliersAction(query?: string): Promise<SupplierRecord[]> {
  const trimmed = query?.trim();

  return db
    .select(SUPPLIER_COLUMNS)
    .from(suppliers)
    .where(trimmed ? like(suppliers.name, `%${trimmed}%`) : undefined)
    .orderBy(asc(suppliers.name));
}

/** Server Action untuk menambahkan pemasok baru. */
export async function createSupplierAction(
  input: SupplierInput
): Promise<SupplierActionResult> {
  const name = input.name.trim();
  if (!name) {
    return { success: false, error: "Nama pemasok wajib diisi." };
  }

  const [created] = await db
    .insert(suppliers)
    .values({
      name,
      contactInfo: input.contactInfo.trim(),
      address: input.address.trim(),
    })
    .returning(SUPPLIER_COLUMNS);

  return { success: true, supplier: created };
}

/** Server Action untuk mengubah data pemasok. */
export async function updateSupplierAction(
  id: string,
  input: SupplierInput
): Promise<SupplierActionResult> {
  const name = input.name.trim();
  if (!name) {
    return { success: false, error: "Nama pemasok wajib diisi." };
  }

  const [updated] = await db
    .update(suppliers)
    .set({
      name,
      contactInfo: input.contactInfo.trim(),
      address: input.address.trim(),
    })
    .where(eq(suppliers.id, id))
    .returning(SUPPLIER_COLUMNS);

  if (!updated) {
    return { success: false, error: "Pemasok tidak ditemukan." };
  }

  return { success: true, supplier: updated };
}

/** Server Action untuk menghapus pemasok. */
export async function deleteSupplierAction(id: string): Promise<DeleteSupplierResult> {
  const [deleted] = await db
    .delete(suppliers)
    .where(eq(suppliers.id, id))
    .returning({ id: suppliers.id });

  if (!deleted) {
    return { success: false, error: "Pemasok tidak ditemukan." };
  }

  return { success: true };
}
