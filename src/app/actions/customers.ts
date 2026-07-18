"use server";

import { db } from "@/db";
import { customers } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireSessionUser } from "@/app/actions/auth";

export type CustomerListItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

const CUSTOMER_COLUMNS = {
  id: customers.id,
  name: customers.name,
  email: customers.email,
  phone: customers.phone,
  address: customers.address,
};

export type CustomerInput = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type CustomerActionResult =
  | { success: true; customer: CustomerListItem }
  | { success: false; error: string };

export type DeleteCustomerResult =
  | { success: true }
  | { success: false; error: string };

/** Server Action untuk mengambil daftar pelanggan, dipakai pada halaman & dropdown pemilih pelanggan. */
export async function listCustomersAction(): Promise<CustomerListItem[]> {
  await requireSessionUser();
  return db
    .select(CUSTOMER_COLUMNS)
    .from(customers)
    .orderBy(asc(customers.name));
}

/** Server Action untuk menambah pelanggan baru ke database. */
export async function createCustomerAction(
  input: CustomerInput
): Promise<CustomerActionResult> {
  await requireSessionUser();
  const name = input.name.trim();
  if (!name) {
    return { success: false, error: "Nama pelanggan wajib diisi." };
  }

  const [created] = await db
    .insert(customers)
    .values({
      name,
      email: input.email.trim(),
      phone: input.phone.trim(),
      address: input.address.trim(),
    })
    .returning(CUSTOMER_COLUMNS);

  return { success: true, customer: created };
}

/** Server Action untuk memperbarui data pelanggan. */
export async function updateCustomerAction(
  id: string,
  input: CustomerInput
): Promise<CustomerActionResult> {
  await requireSessionUser();
  const name = input.name.trim();
  if (!name) {
    return { success: false, error: "Nama pelanggan wajib diisi." };
  }

  const [updated] = await db
    .update(customers)
    .set({
      name,
      email: input.email.trim(),
      phone: input.phone.trim(),
      address: input.address.trim(),
    })
    .where(eq(customers.id, id))
    .returning(CUSTOMER_COLUMNS);

  if (!updated) {
    return { success: false, error: "Pelanggan tidak ditemukan." };
  }

  return { success: true, customer: updated };
}

/** Server Action untuk menghapus pelanggan. */
export async function deleteCustomerAction(
  id: string
): Promise<DeleteCustomerResult> {
  await requireSessionUser();
  await db.delete(customers).where(eq(customers.id, id));
  return { success: true };
}
