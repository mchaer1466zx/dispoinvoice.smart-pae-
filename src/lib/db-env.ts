function isValidLibsqlUrl(rawUrl?: string): boolean {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  const trimmed = rawUrl.trim();
  if (
    !trimmed ||
    trimmed === "DATABASE_URL" ||
    trimmed === "TURSO_DATABASE_URL" ||
    trimmed === "DATABASE_DATABASE_URL" ||
    trimmed === "undefined" ||
    trimmed === "null" ||
    trimmed.startsWith("<") ||
    trimmed.startsWith("${")
  ) {
    return false;
  }
  return (
    trimmed.startsWith("file:") ||
    trimmed.startsWith("libsql://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("ws://") ||
    trimmed.startsWith("wss://")
  );
}

function isValidAuthToken(rawToken?: string): boolean {
  if (!rawToken || typeof rawToken !== "string") return false;
  const trimmed = rawToken.trim();
  if (
    !trimmed ||
    trimmed.length < 15 ||
    trimmed === "DATABASE_AUTH_TOKEN" ||
    trimmed === "TURSO_AUTH_TOKEN" ||
    trimmed === "DATABASE_TOKEN" ||
    trimmed === "undefined" ||
    trimmed === "null" ||
    trimmed.startsWith("libsql://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("file:") ||
    trimmed.startsWith("<") ||
    trimmed.startsWith("${")
  ) {
    return false;
  }
  return true;
}

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

  // 1) URL — periksa kandidat umum yang valid
  const candidates = [
    env.DATABASE_URL_SANG_PRABU,
    env.DATABASE_URL,
    env.TURSO_DATABASE_URL,
    env.DATABASE_DATABASE_URL,
    env.TURSO_URL,
    // Jika user tak sengaja memasukkan URL ke variabel token
    env.DATABASE_AUTH_TOKEN,
  ];

  let url = candidates.find(isValidLibsqlUrl);

  if (!url) {
    for (const [key, value] of Object.entries(env)) {
      if (
        typeof value === "string" &&
        isValidLibsqlUrl(value) &&
        (/database_url/i.test(key) || /turso/i.test(key) || value.startsWith("libsql://"))
      ) {
        url = value;
        break;
      }
    }
  }

  // 2) Auth token — cari token valid (bukan URL dan bukan placeholder)
  const tokenCandidates = [
    env.DATABASE_AUTH_TOKEN,
    env.TURSO_AUTH_TOKEN,
    env.DATABASE_TOKEN,
  ];

  let authToken = tokenCandidates.find(isValidAuthToken);

  if (!authToken) {
    for (const [key, value] of Object.entries(env)) {
      if (
        typeof value === "string" &&
        isValidAuthToken(value) &&
        /token/i.test(key) &&
        /(turso|database|storage|libsql)/i.test(key)
      ) {
        authToken = value;
        break;
      }
    }
  }

  const finalUrl = url?.trim();

  // Jika URL remote Turso/libsql tapi authToken tidak ada/invalid,
  // gunakan file SQLite lokal agar aplikasi tidak crash karena auth failure
  const isRemote =
    finalUrl &&
    (finalUrl.startsWith("libsql://") ||
      finalUrl.startsWith("https://") ||
      finalUrl.includes(".turso.io"));

  if (isRemote && !authToken) {
    console.warn(
      "[db-env] Remote database URL detected without a valid DATABASE_AUTH_TOKEN. Falling back to local database."
    );
    return { url: "file:./local.db" };
  }

  if (!finalUrl || finalUrl.startsWith("file:")) {
    return { url: finalUrl || "file:./local.db" };
  }

  return { url: finalUrl, authToken: authToken?.trim() };
}
