import { asc, like } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customers } from "@/db/schema";

/** GET /api/pelanggan?q=<pencarian> — daftar pelanggan, opsional disaring berdasarkan nama. */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  const rows = await db
    .select({
      id: customers.id,
      name: customers.name,
      email: customers.email,
      phone: customers.phone,
      address: customers.address,
    })
    .from(customers)
    .where(query ? like(customers.name, `%${query}%`) : undefined)
    .orderBy(asc(customers.name));

  return NextResponse.json(rows);
}

/** POST /api/pelanggan — menambahkan pelanggan baru. */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Data yang dikirim tidak valid." },
      { status: 400 }
    );
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";

  if (!name) {
    return NextResponse.json(
      { error: "Nama pelanggan wajib diisi." },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(customers)
    .values({
      name,
      email: typeof input.email === "string" ? input.email.trim() : "",
      phone: typeof input.phone === "string" ? input.phone.trim() : "",
      address: typeof input.address === "string" ? input.address.trim() : "",
    })
    .returning({
      id: customers.id,
      name: customers.name,
      email: customers.email,
      phone: customers.phone,
      address: customers.address,
    });

  return NextResponse.json(created, { status: 201 });
}
