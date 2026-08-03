import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, AI_FALLBACK } from "@/lib/ai/knowledge";
import { rateLimit, clientIp } from "@/lib/ai/rate-limit";

// Endpoint publik: butuh runtime Node (SDK Anthropic) & selalu dinamis.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Batas input (anti-abuse).
const MAX_MESSAGE = 1000;
const MAX_HISTORY = 10;
const MAX_HISTORY_CONTENT = 2000;

// Model bisa dikonfigurasi via env; default aman untuk produksi.
const MODEL = process.env.AI_MODEL || "claude-opus-5";

// System prompt di-build sekali (data statis dari site.ts, tanpa rahasia).
const SYSTEM_PROMPT = buildSystemPrompt();

type ChatTurn = { role: "user" | "assistant"; content: string };

function json(body: unknown, status: number, extraHeaders?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extraHeaders },
  });
}

export async function POST(request: Request) {
  // 1) Rate limit per IP.
  const ip = clientIp(request.headers);
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return json(
      { error: "Terlalu banyak permintaan. Coba lagi sebentar lagi." },
      429,
      { "retry-after": String(rl.retryAfter) },
    );
  }

  // 2) Parse & validasi body.
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Format permintaan tidak valid." }, 400);
  }
  if (typeof payload !== "object" || payload === null) {
    return json({ error: "Format permintaan tidak valid." }, 400);
  }

  const { message, history } = payload as {
    message?: unknown;
    history?: unknown;
  };

  if (typeof message !== "string" || message.trim().length === 0) {
    return json({ error: "Pesan tidak boleh kosong." }, 400);
  }
  if (message.length > MAX_MESSAGE) {
    return json({ error: "Pesan terlalu panjang." }, 400);
  }

  const turns: ChatTurn[] = [];
  if (history !== undefined) {
    if (!Array.isArray(history) || history.length > MAX_HISTORY) {
      return json({ error: "Riwayat percakapan tidak valid." }, 400);
    }
    for (const item of history) {
      if (
        typeof item !== "object" ||
        item === null ||
        ((item as ChatTurn).role !== "user" &&
          (item as ChatTurn).role !== "assistant") ||
        typeof (item as ChatTurn).content !== "string" ||
        (item as ChatTurn).content.length > MAX_HISTORY_CONTENT
      ) {
        return json({ error: "Riwayat percakapan tidak valid." }, 400);
      }
      turns.push({
        role: (item as ChatTurn).role,
        content: (item as ChatTurn).content,
      });
    }
  }

  // 3) Konfigurasi — API key WAJIB server-side.
  if (!process.env.ANTHROPIC_API_KEY) {
    return json(
      { error: "Asisten AI belum dikonfigurasi. Silakan coba lagi nanti." },
      503,
    );
  }

  // 4) Panggil Claude (grounded, tanpa tools, read-only).
  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 900,
      output_config: { effort: "low" },
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        ...turns.map((t) => ({ role: t.role, content: t.content })),
        { role: "user" as const, content: message },
      ],
    });

    if (response.stop_reason === "refusal") {
      return json({ reply: AI_FALLBACK }, 200);
    }

    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return json({ reply: reply || AI_FALLBACK }, 200);
  } catch (err) {
    // Jangan bocorkan detail internal ke klien.
    console.error("[ai/chat] error:", err instanceof Error ? err.message : err);
    return json(
      { error: "Layanan AI sedang sibuk. Silakan coba lagi sebentar lagi." },
      502,
    );
  }
}
