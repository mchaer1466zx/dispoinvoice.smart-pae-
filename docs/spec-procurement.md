# Spec — Modul Procurement + Fitur Lanjutan

> Rancangan (belum dikoding). Disusun mengikuti arsitektur yang sudah ada:
> Next.js App Router + Server Actions, Drizzle ORM + SQLite/Turso, komponen
> form/pratinjau/PDF per dokumen, sistem notifikasi (`createNotification`),
> penomoran otomatis, riwayat dokumen terpadu (`documents.ts`), dan sesi/audit
> (`user_id`, tabel `sessions`).

## 0. Prinsip
- **Meniru pola dokumen yang sudah terbukti** (Invoice/PO/Memo): tiap dokumen =
  tabel induk + tabel item + server actions + form + pratinjau + PDF + status +
  nomor otomatis + masuk Riwayat.
- **Tidak ada hard-delete** untuk dokumen procurement — hanya **pembatalan**
  dengan alasan wajib, dan semua perubahan **tercatat di jejak audit**.
- Kerjakan **bertahap** (satu PR per potongan), bukan sekaligus.

---

## 1. Rantai dokumen (pipeline)

```
PR  →  RFQ  →  Quotation (bandingkan 2-3)  →  PO  →  GRN  →  Invoice(Supplier)
minta   tanya-harga    penawaran            pesan   terima    tagih
```

Keterkaitan (referensi antar dokumen, disimpan sebagai kolom `*_id`):
- **RFQ** merujuk **PR** (`pr_id`).
- **Quotation** merujuk **RFQ** (`rfq_id`) + **Supplier** (`supplier_id`).
- **PO** merujuk **Quotation terpilih** (`quotation_id`) + **PR** (`pr_id`).
- **GRN** merujuk **PO** (`po_id`).
- **Invoice supplier** merujuk **PO** (`po_id`) — untuk *matching*.

Status:
| Dokumen | Status |
|---|---|
| PR | `draft → menunggu_approval → disetujui / ditolak → dibatalkan` |
| RFQ | `draft → terkirim → selesai → dibatalkan` |
| Quotation | `diterima → dibandingkan → dipilih / ditolak → dibatalkan` |
| PO (perluasan yang ada) | `draft → dikirim → diterima_sebagian → selesai → dibatalkan` |
| GRN | `draft → diterima → sesuai / selisih → dibatalkan` |
| Invoice supplier | `draft → dicocokkan(match/mismatch) → disetujui → lunas → dibatalkan` |

---

## 2. Skema database (Drizzle) — dokumen baru

Pola sama seperti `purchaseOrders`/`poItems` (text-UUID PK, `created_at` default,
`user_id` created_by, `parent_id` untuk duplikat, `status`, indeks status/tanggal).

```ts
// Purchase Request
export const purchaseRequests = sqliteTable("purchase_requests", {
  id, userId, companyId, prNumber, status, needDate /* deadline kebutuhan */,
  budgetEstimate: real, department: text, notes, parentId, createdAt, updatedAt,
});
export const prItems = sqliteTable("pr_items", {
  id, prId (FK cascade), description, spec: text, quantity, estPrice: real,
});

// RFQ
export const rfqs = sqliteTable("rfqs", {
  id, userId, companyId, rfqNumber, prId (FK), status, dueDate /* batas jawab */,
  notes, createdAt, updatedAt,
});
export const rfqItems = ... // description, spec, quantity (dari PR)
// RFQ → banyak supplier: tabel jembatan rfq_recipients (rfqId, supplierId)

// Quotation (penawaran satu supplier atas satu RFQ)
export const quotations = sqliteTable("quotations", {
  id, userId, companyId, quotationNumber, rfqId (FK), supplierId (FK), status,
  validUntil, deliveryTime: text, warranty: text, paymentTerm: text,
  tax: real, discount: real, notes, createdAt, updatedAt,
});
export const quotationItems = ... // description, spec, quantity, price

// GRN
export const grns = sqliteTable("grns", {
  id, userId, companyId, grnNumber, poId (FK), status, receivedDate,
  receivedBy: text, notes, createdAt, updatedAt,
});
export const grnItems = ... // description, orderedQty, receivedQty, condition: text, note

// Invoice supplier (lihat §10 — keputusan: tabel baru vs perluas invoices)
```

Penomoran: tambah ke helper `numbering.ts` — `PR/2026/NNN`, `RFQ/2026/NNN`,
`QUO/2026/NNN`, `GRN/2026/NNN` (pola sama dgn invoice/PO).

Riwayat: perluas `documents.ts` (`listDocumentsAction`/`getDocumentAction`) agar
mengenali jenis baru, plus filter jenis di halaman Riwayat.

---

## 3. Jejak Audit Lengkap

**Tabel `audit_logs`** (sumber kebenaran "siapa, kapan, apa"):
```ts
export const auditLogs = sqliteTable("audit_logs", {
  id,
  entityType: text, // "purchase_request" | "po" | "grn" | "invoice" | ...
  entityId: text,
  action: text,     // "create" | "update" | "approve" | "reject" | "cancel"
  actorUserId: text.references(() => users.id),
  changes: text,    // JSON: { field: { from, to } } untuk edit
  reason: text,     // WAJIB diisi untuk action "cancel"
  createdAt,        // default current_timestamp
}, (t) => [ index("audit_entity_idx").on(t.entityType, t.entityId) ]);
```

Helper server-only `recordAudit({ entityType, entityId, action, changes?, reason? })`
(mirip `createNotification`) dipanggil di setiap create/update/approve/cancel.

**Kebijakan no-delete:**
- Hapus semua `delete*Action` untuk dokumen procurement. Ganti dengan
  `cancelDocumentAction(ref, reason)` → set `status = "dibatalkan"` **hanya jika
  `reason` terisi**, lalu `recordAudit(action:"cancel", reason)`.
- Edit dokumen: sebelum `db.update`, hitung diff field lama vs baru →
  `recordAudit(action:"update", changes)`.
- Approval PR: `approvePurchaseRequestAction` set `disetujui` + `recordAudit("approve")`.

**Tampilan:** panel "Riwayat Perubahan" di halaman detail dokumen (daftar dari
`listAuditLogsAction(entityType, entityId)`), menampilkan aktor + waktu + ringkasan
perubahan.

---

## 4. Pengingat Jatuh Tempo Otomatis

- Tambah **`paymentTermDays`** (mis. 21) pada dokumen tagihan; `dueDate` dihitung =
  `issueDate + paymentTermDays` (contoh: 15 Juli + 21 = 5 Agustus). Boleh diisi
  manual juga (kolom `dueDate` sudah ada di invoices).
- Perluas cron `src/app/api/cron/due-reminders/route.ts` yang **sudah ada**:
  tambahkan pemicu **H-7** (`invoice_due_soon` saat `dueDate == hari+7`), di samping
  H-3/overdue yang sudah ada. `dedupeKey` mencegah dobel.
- Notifikasi masuk ke lonceng pemilik dokumen (sistem notifikasi sudah jalan).

---

## 5. Dashboard Real-Time

Halaman **`/dashboard`** dengan server action `getDashboardSummaryAction()` yang
mengagregasi (semua query cepat, ter-index status):
- **PR menunggu approval** — `count(status = "menunggu_approval")`.
- **PO belum diterima** — `count(po.status not in ("selesai"))` atau tanpa GRN.
- **Invoice belum bayar** — `count(invoice.status != "lunas")` + total nominal.
- **Vendor harga terbaik** — dari `quotationItems`: harga termurah per
  deskripsi/spec (group), tampil supplier pemenang.

UI: baris kartu KPI (pakai komponen `Card`/`Badge` yang ada) + daftar ringkas
"perlu tindakan" (mis. 5 PR menunggu approval → tautan ke dokumennya).
Angka & warna mengikuti panduan `dataviz` bila ditambah grafik.

---

## 6. Export Dokumen

- **PDF per dokumen** — sudah ada untuk Invoice/PO/Memo. Tambah generator PDF
  (react-pdf) untuk PR/RFQ/Quotation/GRN mengikuti `invoice-document.tsx`
  (header logo perusahaan + tabel item + total). Route unduh per dokumen seperti
  `/api/purchase-orders/[id]/pdf`.
- **Laporan bulanan Excel** — route `GET /api/reports/monthly?month=YYYY-MM&type=...`
  yang menghasilkan `.xlsx` (satu sheet per jenis atau gabungan). Butuh
  dependency **`exceljs`** (server-side; stream Buffer sebagai
  `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).
  Kolom: nomor, tanggal, pihak, status, subtotal/pajak/total, dibuat oleh.

---

## 7. Lampiran Bukti

**Tabel `attachments`:**
```ts
export const attachments = sqliteTable("attachments", {
  id, entityType, entityId, filename, contentType, size: integer,
  url: text,               // lokasi berkas (lihat keputusan penyimpanan §10)
  uploadedByUserId: text, createdAt,
}, (t) => [ index("attachments_entity_idx").on(t.entityType, t.entityId) ]);
```
- Komponen upload di detail dokumen (mirip upload logo): pilih berkas → server
  action simpan → daftar lampiran (unduh/hapus-dibatalkan).
- **Penyimpanan:** scan/foto bisa besar (beberapa MB) dan banyak → **jangan**
  ditaruh sebagai base64 di SQLite (membengkakkan DB). **Rekomendasi: Vercel Blob**
  (`@vercel/blob`) — simpan file di Blob, simpan URL-nya di `attachments.url`.
  (Batas body Server Actions sudah dinaikkan ke 4MB di `next.config.ts`; untuk
  berkas lebih besar pakai upload langsung ke Blob.)

---

## 8. Matching & Validasi (inti procurement)

- **Invoice ↔ PO:** saat invoice supplier dibuat/di-set `dicocokkan`, bandingkan
  `po_number`, tanggal, qty, dan harga terhadap PO rujukan. Hasil: `match` (boleh
  lanjut bayar) atau `mismatch` (tandai selisih, blokir "lunas" sampai
  di-override dengan alasan → audit).
- **GRN ↔ PO:** `receivedQty` per item dibandingkan `orderedQty`; status
  `sesuai`/`selisih`. PO jadi `selesai` bila semua item diterima penuh.
- **Approval PR:** hanya PR `disetujui` yang boleh diteruskan ke RFQ/PO.

---

## 9. Rencana implementasi bertahap (urutan PR)

**Fase A — fondasi lintas-dokumen**
1. `audit_logs` + helper `recordAudit` + kebijakan cancel (no-delete) + panel
   "Riwayat Perubahan". (dipakai semua dokumen berikutnya)
2. `attachments` + upload (Vercel Blob) + daftar lampiran di detail.

**Fase B — dokumen procurement (satu PR per dokumen, mirror PO)**
3. Purchase Request (+ approval) 4. RFQ 5. Quotation (+ perbandingan harga)
6. GRN 7. Invoice supplier (+ matching ke PO)

**Fase C — lintas fitur**
8. Keterkaitan pipeline (tombol "buat RFQ dari PR", dst.) + status otomatis.
9. Dashboard real-time.
10. Reminder H-7 (perluas cron) + laporan bulanan Excel.

Tiap langkah: migrasi Drizzle, server actions, UI, PDF (bila perlu), verifikasi
`tsc`/`lint`/`build`, satu PR.

---

## 10. Keputusan yang perlu kamu konfirmasi

1. **"Invoice" procurement** = tagihan **dari supplier** (beda arah dgn invoice
   pelanggan yang sudah ada). Pilih: **(a)** tabel baru `supplier_invoices`
   (paling bersih, tidak mengubah invoice pelanggan), atau **(b)** perluas
   `invoices` dengan `kind` + `po_id`/`supplier_id`. **Rekomendasi: (a).**
2. **Penyimpanan lampiran**: **Vercel Blob** (rekomendasi) vs base64-di-DB
   (sederhana tapi membengkak). Blob perlu env `BLOB_READ_WRITE_TOKEN`.
3. **Approval PR**: cukup satu tingkat (atasan menyetujui) atau berjenjang
   (mis. > nominal tertentu perlu approval lebih tinggi)?
4. **Excel**: satu file multi-sheet per bulan, atau per jenis dokumen terpisah?
5. **Reminder**: H-7 saja, atau H-7 **dan** H-3 (yang sudah ada) sekaligus?

Setelah kamu jawab (atau bilang "pakai rekomendasi"), aku mulai **Fase A langkah 1
(jejak audit + kebijakan no-delete/cancel)** sebagai PR pertama.
