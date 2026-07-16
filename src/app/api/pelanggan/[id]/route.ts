import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customers } from "@/db/schema";

/** PUT /api/pelanggan/:id — mengubah data pelanggan. */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

  const [updated] = await db
    .update(customers)
    .set({
      name,
      email: typeof input.email === "string" ? input.email.trim() : "",
      phone: typeof input.phone === "string" ? input.phone.trim() : "",
      address: typeof input.address === "string" ? input.address.trim() : "",
    })
    .where(eq(customers.id, id))
    .returning({
      id: customers.id,
      name: customers.name,
      email: customers.email,
      phone: customers.phone,
      address: customers.address,
    });

  if (!updated) {
    return NextResponse.json(
      { error: "Pelanggan tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

/** DELETE /api/pelanggan/:id — menghapus data pelanggan. */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [deleted] = await db
    .delete(customers)
    .where(eq(customers.id, id))
    .returning({ id: customers.id });

  if (!deleted) {
    return NextResponse.json(
      { error: "Pelanggan tidak ditemukan." },
      { status: 404 }
    );
  }

  return new NextResponse(null, { status: 204 });
}
