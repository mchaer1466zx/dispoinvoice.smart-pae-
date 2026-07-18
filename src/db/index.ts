import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { resolveDbCredentials } from "@/lib/db-env";

// Mendeteksi kredensial database dari berbagai kemungkinan nama env (manual atau
// dari integrasi database Vercel/Turso), sehingga "tinggal pasang" tanpa setting
// tambahan. Fallback ke file SQLite lokal untuk pengembangan.
const client = createClient(resolveDbCredentials());

export const db = drizzle(client, { schema });
