import path from "path";

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

  const isValidDatabaseUrl = (u: unknown): u is string => {
    if (typeof u !== "string" || !u.trim()) return false;
    const str = u.trim();
    if (str === "DATABASE_URL" || str === "TURSO_DATABASE_URL") return false;
    if (str.startsWith("libsql://") || str.startsWith("file:") || str.startsWith("sqlite:")) {
      return true;
    }
    if ((str.startsWith("https://") || str.startsWith("http://")) && (str.includes(".turso.io") || str.includes("libsql"))) {
      return true;
    }
    return false;
  };

  // 1) URL — utamakan nama umum, lalu cari env apa pun yang nilainya valid untuk database libSQL/Turso.
  let url = "";
  const candidateUrls = [
    env.DATABASE_URL,
    env.TURSO_DATABASE_URL,
    env.DATABASE_DATABASE_URL,
    env.TURSO_URL,
    env.LIBSQL_URL,
  ];

  for (const candidate of candidateUrls) {
    if (isValidDatabaseUrl(candidate)) {
      url = candidate.trim();
      break;
    }
  }

  if (!url) {
    for (const [key, value] of Object.entries(env)) {
      if (
        /database|turso|libsql/i.test(key) &&
        isValidDatabaseUrl(value)
      ) {
        url = value.trim();
        break;
      }
    }
  }

  // 2) Auth token — abaikan placeholder nama variabel
  const isValidAuthToken = (t: unknown): t is string => {
    if (typeof t !== "string" || !t.trim()) return false;
    const str = t.trim();
    if (str === "DATABASE_AUTH_TOKEN" || str === "TURSO_AUTH_TOKEN" || str === "DATABASE_TOKEN") {
      return false;
    }
    return str.length > 10;
  };

  let authToken: string | undefined;
  const candidateTokens = [
    env.DATABASE_AUTH_TOKEN,
    env.TURSO_AUTH_TOKEN,
    env.DATABASE_TOKEN,
    env.TURSO_TOKEN,
    env.LIBSQL_AUTH_TOKEN,
  ];

  for (const candidate of candidateTokens) {
    if (isValidAuthToken(candidate)) {
      authToken = candidate.trim();
      break;
    }
  }

  if (!authToken) {
    for (const [key, value] of Object.entries(env)) {
      if (
        /token/i.test(key) &&
        /(turso|database|storage|libsql)/i.test(key) &&
        isValidAuthToken(value)
      ) {
        authToken = value.trim();
        break;
      }
    }
  }

  const defaultLocalDb = `file:${path.join(process.cwd(), "local.db")}`;
  return { url: url || defaultLocalDb, authToken };
}
