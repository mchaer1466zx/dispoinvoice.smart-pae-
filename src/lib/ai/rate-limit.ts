/**
 * Rate limiter in-memory (sliding window) untuk endpoint AI publik.
 *
 * Best-effort untuk MVP: pada serverless, memori bersifat per-instance sehingga
 * batas bersifat lunak. Untuk penegakan global gunakan store durable
 * (mis. Vercel KV / Upstash) — dicatat sebagai peningkatan lanjutan.
 */

const WINDOW_MS = 60_000; // 60 detik
const MAX_HITS = 12; // maksimal request per IP per window

type Bucket = { hits: number[] };
const buckets = new Map<string, Bucket>();

export type RateResult = { ok: boolean; retryAfter: number };

/** Catat 1 hit untuk `key` (IP). Mengembalikan status izin + Retry-After (detik). */
export function rateLimit(key: string): RateResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  // Buang timestamp di luar window.
  bucket.hits = bucket.hits.filter((t) => now - t < WINDOW_MS);

  if (bucket.hits.length >= MAX_HITS) {
    buckets.set(key, bucket);
    const oldest = bucket.hits[0];
    const retryAfter = Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000));
    return { ok: false, retryAfter };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);

  // Housekeeping ringan agar Map tidak tumbuh tanpa batas.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (b.hits.every((t) => now - t >= WINDOW_MS)) buckets.delete(k);
    }
  }

  return { ok: true, retryAfter: 0 };
}

/** Ambil IP klien dari header proxy (Vercel mengisi x-forwarded-for). */
export function clientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return headers.get("x-real-ip")?.trim() || "unknown";
}
