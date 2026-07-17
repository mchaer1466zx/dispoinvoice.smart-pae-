"use server";

import { db } from "@/db";
import { customers } from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireSessionUser } from "@/app/actions/auth";

export type CustomerListItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

/** Server Action untuk mengambil daftar pelanggan, dipakai pada dropdown pemilih pelanggan. */
export async function listCustomersAction(): Promise<CustomerListItem[]> {
  await requireSessionUser();
  return db
    .select({
      id: customers.id,
      name: customers.name,
      email: customers.email,
      phone: customers.phone,
      address: customers.address,
    })
    .from(customers)
    .orderBy(asc(customers.name));
}
