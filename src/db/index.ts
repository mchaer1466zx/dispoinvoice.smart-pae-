import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";
import { resolveDbCredentials } from "@/lib/db-env";
import path from "path";
import fs from "fs";

// Mendeteksi kredensial database dari berbagai kemungkinan nama env (manual atau
// dari integrasi database Vercel/Turso), sehingga "tinggal pasang" tanpa setting
// tambahan. Fallback ke file SQLite lokal untuk pengembangan.
const creds = resolveDbCredentials();
const client = createClient(creds);

export const db = drizzle(client, { schema });

let initPromise: Promise<void> | null = null;

export async function ensureDbReady(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const migrationsFolder = path.join(process.cwd(), "drizzle");
      if (fs.existsSync(migrationsFolder)) {
        await migrate(db, { migrationsFolder });
      }
      // Seed default company if none exists
      const existing = await client.execute("SELECT count(*) as count FROM companies;");
      const count = Number(existing.rows[0]?.count ?? 0);
      if (count === 0) {
        await client.execute({
          sql: `INSERT INTO companies (id, name, address, email, phone, logo_url) VALUES (?, ?, ?, ?, ?, ?);`,
          args: [
            "ksp-default",
            "PT KARYA SANG PRABU",
            "Jl. Pertanian Raya No. 64, Lebak Bulus, Cilandak, Jakarta Selatan 12440",
            "ptkaryasangprabu@gmail.com",
            "021 29862350",
            "/logos/logo-sang-prabu.png",
          ],
        });
      }
    } catch (error) {
      console.warn("ensureDbReady warning:", error);
    }
  })();
  return initPromise;
}

// Trigger initial check
if (typeof window === "undefined") {
  ensureDbReady().catch(() => {});
}

