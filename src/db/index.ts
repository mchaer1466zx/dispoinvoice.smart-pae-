import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Menerima nama env dari pengisian manual (DATABASE_URL) maupun dari integrasi
// database Vercel/Turso (TURSO_DATABASE_URL) supaya "tinggal pasang" tanpa
// setting tambahan. Fallback ke file SQLite lokal untuk pengembangan.
const client = createClient({
  url:
    process.env.DATABASE_URL ??
    process.env.TURSO_DATABASE_URL ??
    "file:./local.db",
  authToken: process.env.DATABASE_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
