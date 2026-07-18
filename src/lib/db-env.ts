/**
 * Mencari kredensial database libSQL/Turso dari berbagai kemungkinan nama env.
 *
 * Ini membuat aplikasi "tinggal pasang": bekerja baik saat variabel diisi manual
 * (DATABASE_URL / DATABASE_AUTH_TOKEN) maupun saat dibuat otomatis oleh integrasi
 * database Vercel/Turso yang memakai prefix apa pun (mis. TURSO_, STORAGE_,
 * DATABASE_). Sebagai fallback, dipakai file SQLite lokal untuk pengembangan.
 */
export function resolveDbCredentials(): { url: string; authToken?: string } {
  const env = process.env;

  // 1) URL — utamakan nama umum, lalu cari env apa pun yang nilainya "libsql://".
  let url =
    env.DATABASE_URL ||
    env.TURSO_DATABASE_URL ||
    env.DATABASE_DATABASE_URL ||
    "";

  if (!url) {
    for (const [, value] of Object.entries(env)) {
      if (typeof value === "string" && value.startsWith("libsql://")) {
        url = value;
        break;
      }
    }
  }

  // 2) Auth token — nama umum dulu, lalu env apa pun yang namanya mengandung
  //    "token" dan berkaitan dengan database (hindari token tak terkait).
  let authToken =
    env.DATABASE_AUTH_TOKEN ||
    env.TURSO_AUTH_TOKEN ||
    env.DATABASE_TOKEN ||
    undefined;

  if (!authToken) {
    for (const [key, value] of Object.entries(env)) {
      if (
        typeof value === "string" &&
        value &&
        /token/i.test(key) &&
        /(turso|database|storage|libsql)/i.test(key)
      ) {
        authToken = value;
        break;
      }
    }
  }

  return { url: url || "file:./local.db", authToken };
}
