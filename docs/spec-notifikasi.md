# Spec Teknis — Fitur Notifikasi (siap pakai)

> Status: draft spec · Selaras dengan PRD revisi (status lifecycle, audit trail, due date).
> Fitur ini **tidak ada di PRD** — ini tambahan. Pemicunya menempel pada transisi
> **Status Dokumen & Lifecycle** (Fase 3) dan **Due Date** (Fase 1) yang baru masuk PRD revisi.

## 1. Tujuan & ruang lingkup

Memberi karyawan pemberitahuan saat ada kejadian penting pada dokumen yang ia buat/pegang,
tanpa harus memeriksa manual. Dibangun bertahap agar tiap tahap berdiri sendiri:

| Tahap | Isi | Ketergantungan |
| --- | --- | --- |
| **N1 — In-app** | Bell di header + daftar notifikasi + badge jumlah belum dibaca | tabel `notifications` |
| **N2 — Email** | Kirim email saat dokumen dibagikan ke atasan | `RESEND_API_KEY` (sudah ada) |
| **N3 — Reminder** | Pengingat invoice mendekati / lewat jatuh tempo (due date) | Vercel Cron + `due_date` |

Spec ini fokus **N1** (lengkap, siap kode) dan menyediakan titik-sambung untuk N2 & N3.

## 2. Kejadian yang memicu notifikasi (event catalog)

| `type` | Kapan | Contoh judul |
| --- | --- | --- |
| `invoice_status` | Status invoice berubah (`draft`→`terkirim`→`lunas`) | "Invoice INV/2026/07/001 → Lunas" |
| `po_status` | Status PO berubah (`draft`→`dikirim`→`selesai`) | "PO PO/2026/012 → Selesai" |
| `memo_status` | Status memo berubah (`terkirim`→`dibaca`→`selesai`) | "Memo 'Disposisi Anggaran' telah Dibaca" |
| `doc_shared` | Dokumen dibagikan via email/tautan | "Invoice INV/2026/07/001 dibagikan ke atasan" |
| `invoice_due_soon` | H-3 sebelum `due_date` & belum `lunas` | "Invoice INV/2026/07/001 jatuh tempo 3 hari lagi" |
| `invoice_overdue` | Lewat `due_date` & belum `lunas` | "Invoice INV/2026/07/001 telah jatuh tempo" |

Enum ini dipakai kolom `notifications.type`.

## 3. Skema database (Drizzle)

Tambahkan ke `src/db/schema.ts`, mengikuti pola tabel yang sudah ada
(text-UUID PK via `crypto.randomUUID()`, `created_at` default `current_timestamp`,
indeks lewat array pada argumen ketiga):

```ts
export const notifications = sqliteTable(
  "notifications",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    // Penerima notifikasi = karyawan internal (users.id). Nullable selama
    // audit trail (created_by) belum diisi — lihat §7 "Ketergantungan".
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    type: text("type", {
      enum: [
        "invoice_status",
        "po_status",
        "memo_status",
        "doc_shared",
        "invoice_due_soon",
        "invoice_overdue",
      ],
    }).notNull(),
    title: text("title").notNull(),
    body: text("body"),
    // Deep-link ke dokumen terkait (dipakai bell untuk navigasi).
    docType: text("doc_type", { enum: ["invoice", "po", "memo"] }),
    docId: text("doc_id"),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    // Kunci idempotensi supaya reminder tidak dobel (§6). NULL = tidak dijaga unik.
    dedupeKey: text("dedupe_key"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.userId),
    index("notifications_is_read_idx").on(table.isRead),
    uniqueIndex("notifications_dedupe_key_uq").on(table.dedupeKey),
  ]
);
```

Tambahkan `uniqueIndex` ke import `drizzle-orm/sqlite-core` yang sudah ada.

**Migrasi:** `npm run db:generate` (menghasilkan `drizzle/00XX_*.sql`) lalu
`npm run db:migrate`. Sesuai pola migrasi 0000–0009 yang sudah ada.

## 4. Helper server-only: `src/lib/notify.ts`

Satu titik masuk untuk membuat notifikasi. Dipanggil dari Server Actions lain.
Bukan `"use server"` (bukan action; helper internal), tapi hanya diimpor di kode server.

```ts
import "server-only";
import { db } from "@/db";
import { notifications } from "@/db/schema";

type NotifyInput = {
  userId: string | null;
  type:
    | "invoice_status"
    | "po_status"
    | "memo_status"
    | "doc_shared"
    | "invoice_due_soon"
    | "invoice_overdue";
  title: string;
  body?: string;
  docType?: "invoice" | "po" | "memo";
  docId?: string;
  dedupeKey?: string;
};

/** Membuat satu notifikasi in-app. Aman dipanggil di dalam transaksi lain. */
export async function createNotification(input: NotifyInput): Promise<void> {
  try {
    await db
      .insert(notifications)
      .values({
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body ?? null,
        docType: input.docType ?? null,
        docId: input.docId ?? null,
        dedupeKey: input.dedupeKey ?? null,
      })
      .onConflictDoNothing({ target: notifications.dedupeKey });
  } catch {
    // Notifikasi tidak boleh menggagalkan aksi utama (simpan/ubah status).
    // Cukup ditelan; aksi bisnis tetap sukses.
  }
}
```

Prinsip penting: **kegagalan notifikasi tidak boleh menggagalkan aksi bisnis.**
Karena itu `createNotification` menelan error dan dipanggil *setelah* commit aksi utama.

## 5. Server Actions untuk UI: `src/app/actions/notifications.ts`

Mengikuti pola `"use server"` + `requireSessionUser()` + hasil union yang sudah dipakai
di `actions/*.ts`.

```ts
"use server";

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { requireSessionUser } from "@/app/actions/auth";

export type NotificationRecord = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  docType: "invoice" | "po" | "memo" | null;
  docId: string | null;
  isRead: boolean;
  createdAt: string;
};

/** Daftar notifikasi milik user sesi (terbaru dulu, dibatasi 30). */
export async function listNotificationsAction(): Promise<NotificationRecord[]> {
  const user = await requireSessionUser();
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(30);
}

/** Jumlah notifikasi belum dibaca — dipakai badge bell. */
export async function getUnreadCountAction(): Promise<number> {
  const user = await requireSessionUser();
  const rows = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(
      and(eq(notifications.userId, user.id), eq(notifications.isRead, false))
    );
  return rows.length;
}

export async function markNotificationReadAction(
  id: string
): Promise<{ success: boolean }> {
  const user = await requireSessionUser();
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, user.id)));
  return { success: true };
}

export async function markAllNotificationsReadAction(): Promise<{ success: boolean }> {
  const user = await requireSessionUser();
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.userId, user.id));
  return { success: true };
}
```

## 6. Titik-sambung ke aksi yang sudah ada (integrasi)

Panggil `createNotification(...)` dari transisi berikut. Semua bersifat **additive**
(tidak mengubah perilaku lama).

**a. Perubahan status invoice/PO/memo.**
PRD revisi memperkenalkan pengelolaan status. Di action yang mengubah status (mis. buat
`updateInvoiceStatusAction` di `actions/invoices.ts`), setelah `db.update(...)` sukses:

```ts
await createNotification({
  userId: invoice.userId,            // pemilik dokumen (lihat §7)
  type: "invoice_status",
  title: `Invoice ${invoice.invoiceNumber} → ${labelStatus(newStatus)}`,
  docType: "invoice",
  docId: invoice.id,
});
```

**b. Dibagikan ke atasan.**
Di `actions/share-invoice.ts` (`sendInvoiceEmailAction`) / `share-po.ts` / `share-memo.ts`,
setelah email/tautan sukses:

```ts
await createNotification({
  userId: /* pemilik dokumen */ null,
  type: "doc_shared",
  title: `Invoice ${invoiceNumber} dibagikan`,
  body: `Dikirim ke ${input.recipientEmail}`,
  docType: "invoice",
  docId: input.invoiceId,
});
```

**c. Memo dibaca atasan (status → dibaca).**
`actions/memo-public.ts` / `po-public.ts` menangani akses tautan publik. Saat tautan dibuka
pertama kali dan status memo berpindah ke `dibaca`, panggil `createNotification` type
`memo_status`. Gunakan `dedupeKey = "memo_read:" + memoId` agar tidak dobel tiap refresh.

## 7. Ketergantungan penting (baca dulu)

- **`created_by` belum terisi.** Saat ini `invoices.userId` / `purchaseOrders.userId`
  ada di skema tapi **tidak di-set** oleh `createInvoiceAction` dkk. Agar "notifikasi ke
  pemilik dokumen" benar, fitur **Audit Trail (created_by)** dari PRD Fase 3 harus lebih
  dulu mengisi `userId` = `requireSessionUser().id` saat membuat dokumen. **Sampai itu ada,**
  gunakan fallback: kirim notifikasi ke user sesi yang melakukan aksi
  (`(await requireSessionUser()).id`).
- **Status memo belum ada di skema.** Tabel `memos` belum punya kolom `status`. Pemicu
  `memo_status` menunggu kolom `status` (`terkirim`/`dibaca`/`selesai`) masuk — bagian dari
  PRD "Status Dokumen & Lifecycle". Sampai itu ada, lewati pemicu memo.

## 8. UI — bell di header

Komponen client baru `src/components/notifications/notification-bell.tsx`, dipasang di
`src/components/app-header.tsx` di antara `<CompanySwitcher />` dan `<UserMenu />`:

```tsx
<div className="flex items-center gap-3">
  <CompanySwitcher />
  <NotificationBell />
  <UserMenu />
</div>
```

Pola komponen mengikuti `user-menu.tsx`: `"use client"`, radix `Popover`
(`@/components/ui/popover`), ikon `Bell` dari `lucide-react`, `toast` dari `sonner`,
dan gating `useAuth()` (sembunyikan bila belum login).

Perilaku:
- Saat mount & saat window `focus`: panggil `getUnreadCountAction()` untuk badge.
  (Polling ringan opsional tiap ~30 dtk; hindari interval agresif.)
- Buka popover → `listNotificationsAction()`; klik item → `markNotificationReadAction(id)`
  lalu `router.push` ke `docType`/`docId` (mis. `/riwayat-dokumen/{docId}`).
- Tombol "Tandai semua dibaca" → `markAllNotificationsReadAction()`.

Badge merah kecil di atas ikon bila `unread > 0` (pakai util `Badge` yang sudah ada di
`@/components/ui/badge`).

## 9. N3 — reminder due date (opsional, menyusul)

Vercel Cron memanggil route harian. Buat `src/app/api/cron/due-reminders/route.ts`:

- Query invoice `status != 'lunas'` dengan `due_date` = hari-ini+3 → notifikasi
  `invoice_due_soon`, `dedupeKey = "due_soon:" + invoiceId`.
- `due_date < hari-ini` → `invoice_overdue`, `dedupeKey = "overdue:" + invoiceId + ":" + tanggal`.
- Lindungi route dengan header rahasia (`CRON_SECRET`) — cek `request.headers`.

`vercel.json`:

```json
{ "crons": [{ "path": "/api/cron/due-reminders", "schedule": "0 1 * * *" }] }
```

`dedupeKey` + `uniqueIndex` (§3) memastikan reminder tidak berganda meski cron jalan
berkali-kali.

## 10. Checklist implementasi (urut)

1. [ ] Tambah tabel `notifications` di `schema.ts` + `uniqueIndex` import.
2. [ ] `npm run db:generate && npm run db:migrate`.
3. [ ] `src/lib/notify.ts` (`createNotification`).
4. [ ] `src/app/actions/notifications.ts` (list / unread / mark read).
5. [ ] `src/components/notifications/notification-bell.tsx` + pasang di `app-header.tsx`.
6. [ ] (Butuh created_by) set `userId` saat buat dokumen; sambungkan pemicu status & share.
7. [ ] (Opsional) route cron + `vercel.json` untuk reminder due date.

Langkah 1–5 = **N1 berdiri sendiri** dan bisa diverifikasi (bikin baris notifikasi dummy
lewat `createNotification`, lihat muncul di bell). Langkah 6–7 mengikat ke lifecycle & due
date sesuai PRD revisi.
```
