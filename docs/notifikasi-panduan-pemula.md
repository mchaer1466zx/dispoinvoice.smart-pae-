# Panduan Pemula — Fitur Notifikasi (baca ini dulu)

Dokumen ini versi **santai & sederhana** dari `spec-notifikasi.md`. Kalau spec itu
"cetak biru untuk tukang", dokumen ini "penjelasan buat kamu yang baru mulai".
Baca ini dulu, baru buka spec-nya kalau sudah paham gambaran besarnya.

---

## 1. Fitur ini sebenarnya apa? (analogi)

Bayangkan **lonceng di HP** (kayak notif WhatsApp). Di aplikasi kita, karyawan sering
lupa cek: "Invoice-ku udah dibayar belum? Memo-ku udah dibaca atasan belum?"

Fitur notifikasi = **lonceng 🔔 di pojok kanan atas aplikasi**. Setiap ada kejadian
penting, muncul angka merah kecil. Diklik → keluar daftar pesan, misalnya:

> 🔔 "Invoice INV/2026/07/001 sudah **Lunas**"
> 🔔 "Memo 'Disposisi Anggaran' sudah **Dibaca** atasan"

Selesai. Itu inti fiturnya. Sisanya cuma detail cara bikinnya.

---

## 2. Bagian-bagiannya (cukup 4 hal)

Anggap kita membangun 4 "potongan lego". Urutannya penting — bawah dulu, baru atas.

```
        ┌─────────────────────────────┐
   (4)  │  🔔 Lonceng di layar (UI)   │  ← yang dilihat user
        ├─────────────────────────────┤
   (3)  │  "Pintu" ambil/tandai data  │  ← server actions
        ├─────────────────────────────┤
   (2)  │  "Tukang cap" bikin notif   │  ← helper createNotification
        ├─────────────────────────────┤
   (1)  │  Lemari arsip (tabel DB)    │  ← tabel notifications
        └─────────────────────────────┘
```

| No | Nama teknis | Ibaratnya | Kerjanya apa |
| --- | --- | --- | --- |
| 1 | Tabel `notifications` | **Lemari arsip** | Tempat menyimpan semua pesan notifikasi |
| 2 | `createNotification` | **Tukang cap** | Bikin 1 pesan baru lalu taruh di lemari |
| 3 | Server actions | **Petugas loket** | Ambil daftar pesan / tandai "sudah dibaca" |
| 4 | Komponen bell | **Lonceng di layar** | Yang dilihat & diklik user |

Kalau keempatnya jadi, fitur dasarnya (namanya **N1 / in-app**) sudah hidup.

---

## 3. Langkah demi langkah (yang benar-benar kamu ketik)

> Semua perintah dijalankan dari folder proyek (`dispoinvoice.smart-pae-`).
> Kalau ragu, kerjakan **satu langkah, cek, baru lanjut.**

### Langkah 1 — Bikin "lemari arsip" (tabel database)
1. Buka file `src/db/schema.ts`.
2. Tempel blok tabel `notifications` dari `spec-notifikasi.md` bagian **§3**.
3. Simpan, lalu jalankan 2 perintah ini di terminal:
   ```bash
   npm run db:generate    # bikin file migrasi otomatis
   npm run db:migrate     # terapkan ke database
   ```
   Kalau tidak ada error merah → lemari sudah jadi. ✅

### Langkah 2 — Bikin "tukang cap"
1. Buat file baru `src/lib/notify.ts`.
2. Salin isi dari spec bagian **§4** apa adanya.
3. Selesai — file ini tidak perlu dijalankan sendiri, nanti dipanggil kode lain.

### Langkah 3 — Bikin "petugas loket" (server actions)
1. Buat file baru `src/app/actions/notifications.ts`.
2. Salin isi dari spec bagian **§5**.
3. Ini yang nanti dipanggil lonceng buat ambil & menandai pesan.

### Langkah 4 — Bikin "lonceng di layar"
1. Buat file `src/components/notifications/notification-bell.tsx`.
   Contoh polanya ada di spec **§8** (tiru gaya `src/components/user-menu.tsx`).
2. Pasang lonceng ke header: buka `src/components/app-header.tsx`, sisipkan
   `<NotificationBell />` di antara `<CompanySwitcher />` dan `<UserMenu />`.

### Langkah 5 — Coba jalankan
```bash
npm run dev
```
Buka `http://localhost:3000`. Lonceng harusnya muncul di kanan atas.
Masih kosong? Wajar — belum ada pesan. Lanjut ke bagian "cara tes" di bawah.

---

## 4. Cara tes tanpa nunggu fitur lain

Karena beberapa pemicu (perubahan status, audit trail) belum siap, kamu bisa
**bikin pesan contoh manual** untuk memastikan loncengnya jalan:

- Cara termudah: buka Drizzle Studio (`npm run db:studio`), lalu tambah 1 baris di
  tabel `notifications` (isi `user_id` dengan id akunmu, `title` bebas, `type` =
  `invoice_status`).
- Refresh aplikasi → angka merah di lonceng harusnya jadi **1**, dan pesan muncul
  saat diklik.

Kalau ini berhasil, artinya rangka fitur **sudah benar**. 🎉

---

## 5. Yang BELUM bisa dikerjakan sekarang (jangan bingung)

Ada 2 hal yang **sengaja ditunda** karena menunggu bagian lain dari PRD:

1. **Notifikasi otomatis saat status berubah** — perlu fitur "siapa pembuat dokumen"
   (`created_by` / audit trail) yang belum diisi. Sekarang kolom `user_id` di invoice
   masih kosong, jadi belum tahu harus kirim notif ke siapa.
2. **Notifikasi memo dibaca** — tabel memo belum punya kolom `status`, jadi belum ada
   yang bisa diberitahukan.

Ini **bukan bug** — memang urutannya begitu. Kerjakan dulu Langkah 1–5 (rangka
lonceng), sisanya menyusul setelah fitur status & audit trail masuk.

---

## 6. Istilah yang mungkin asing

| Istilah | Artinya sederhana |
| --- | --- |
| **Migrasi (migration)** | "Surat perintah" untuk mengubah struktur database (mis. menambah tabel). |
| **Server Action** | Fungsi yang jalan di server, dipanggil dari tombol/komponen — jembatan UI ↔ database. |
| **Schema** | Cetak biru bentuk tabel database (kolom apa saja, tipenya apa). |
| **Badge** | Angka/titik kecil penanda, mis. angka merah di atas lonceng. |
| **Deep-link** | Tautan yang langsung membuka dokumen tertentu, bukan halaman umum. |

---

## 7. Kalau nyangkut

- Error saat `db:migrate`? Baca baris merah paling atas — biasanya salah ketik di
  `schema.ts`. Bandingkan lagi dengan spec §3.
- Lonceng nggak muncul? Pastikan sudah login (lonceng disembunyikan kalau belum login),
  dan `<NotificationBell />` benar-benar dipasang di `app-header.tsx`.
- Ragu urutan? Ikuti **checklist §10** di `spec-notifikasi.md` dari atas ke bawah.

Selamat mencoba — kerjakan pelan-pelan, satu langkah satu kali. 🙂
