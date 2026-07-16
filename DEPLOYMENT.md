# Panduan Deploy ke Vercel (untuk Pemula)

Panduan ini menjelaskan langkah demi langkah cara men-deploy project Next.js ini ke Vercel. Ditulis sederhana untuk pemula.

---

## Ringkasan singkat
- Hubungkan repository GitHub ke Vercel
- Tambahkan Environment Variables (rahasia) di dashboard Vercel
- Jalankan migrasi database (Drizzle) dari mesin lokal ke database produksi
- Deploy melalui Vercel (otomatis saat push ke `main`)
- Verifikasi aplikasi berjalan

---

## Prasyarat
- Akun GitHub dan repo: `mchaer1466zx/dispoinvoice.smart-pae-`
- Akun Vercel (https://vercel.com) terhubung ke GitHub
- Database produksi (contoh: Postgres, Planetscale, dsb.) dan `DATABASE_URL`
- Nilai API keys yang diperlukan (lihat bagian `Env vars`)

---

## 1. Hubungkan repo ke Vercel
1. Buka https://vercel.com, daftar atau login.
2. Klik "New Project" → pilih import Git Repository → pilih `mchaer1466zx/dispoinvoice.smart-pae-`.
3. Pastikan Vercel mendeteksi Next.js (Framework Preset: Next.js).
4. Build Command: `npm run build` (default dari `package.json`).
5. Output Directory: kosong (gunakan default).

Catatan: Anda dapat menambahkan Environment Variables sekarang atau setelah mengimpor.

---

## 2. Daftar Environment Variables (harus diisi di Vercel)
Isi nilai nyata untuk environment production di Vercel Dashboard → Project → Settings → Environment Variables.

- `DATABASE_URL` — URL koneksi database produksi, mis. `postgres://user:pass@host:5432/dbname`
- `DATABASE_AUTH_TOKEN` — jika DB provider memerlukannya (opsional)
- `NEXT_PUBLIC_APP_URL` — URL publik aplikasi, mis. `https://your-project.vercel.app`
- `RESEND_API_KEY` — API key untuk layanan Resend (mengirim email)
- `INVOICE_EMAIL_FROM` — alamat email pengirim default, mis. `DispoInvoice <invoice@yourdomain.com>`

Jangan commit file `.env` ke repo. Simpan rahasia di Vercel.

---

## 3. Menjalankan migrasi Drizzle (cara mudah untuk pemula)
Rekomendasi: jalankan migrasi dari komputer Anda (lokal) ke database produksi sekali, sebelum menggunakan aplikasi di production.

1. Pastikan `DATABASE_URL` menunjuk ke database produksi.
2. Jalankan perintah ini di terminal project:

```bash
# pasang dependensi (jika belum)
npm install

# set DATABASE_URL sementara (bash)
export DATABASE_URL="postgres://user:pass@host:5432/dbname"

# jalankan migrasi Drizzle
npm run db:migrate
```

Jika migrasi sukses, tabel dan struktur database akan dibuat.

Catatan alternatif: jika Anda tidak mau menjalankan dari lokal, Anda bisa membuat job CI yang menjalankan `npm run db:migrate` setelah deploy, tapi untuk pemula menjalankan dari lokal lebih sederhana.

---

## 4. Deploy di Vercel
Setelah Environment Variables terpasang dan migrasi (opsional) dijalankan:

- Push branch `main` ke GitHub. Vercel akan mendeteksi push dan memulai build otomatis.
- Atau di Vercel UI klik "Deploy" setelah import.

Pantau proses build di Vercel Dashboard → Deployments → klik deployment terakhir → lihat Build Logs.

Jika build error, salin pesan error dan kirim ke saya agar saya bantu analisa.

---

## 5. Verifikasi setelah deploy
1. Buka URL deployment (mis. `https://<project>.vercel.app`).
2. Coba fitur dasar: buka halaman utama, login, buat invoice, kirim email (jika fitur aktif).
3. Kalau ada error runtime, cek Logs di Vercel → Deployments → Logs.

---

## 6. Troubleshooting umum
- Node version: gunakan Node 18+ di Vercel (Project → Settings → Build & Development Settings → Node Version).
- Jika ada error native module (mis. `sharp`), lihat Build Logs dan beri tahu saya.
- Pastikan semua file penting sudah di-commit dan push.

---

## 7. Opsi lanjutan (pilih bila perlu)
- Menggunakan `vercel` CLI: Anda bisa login dan deploy via terminal dengan `npm i -g vercel`, lalu `vercel login` dan `vercel --prod`.
- Menjalankan migrasi lewat CI/CD: tambahkan step `npm run db:migrate` di pipeline setelah build.

---

## Checklist singkat sebelum klik deploy
- [ ] Akun Vercel terhubung ke GitHub
- [ ] Environment Variables diisi di Vercel
- [ ] `DATABASE_URL` menunjuk ke DB produksi
- [ ] Jalankan `npm run db:migrate` (direkomendasikan)
- [ ] Push `main` ke GitHub (atau klik Deploy di Vercel)

---

Kalau mau, saya bisa melakukan salah satu dari berikut:
- A: Tambahkan file panduan ini ke repo (sudah saya lakukan).
- B: Bantu konfigurasi Vercel CLI (butuh token/izin Anda untuk menjalankannya dari mesin Anda).
- C: Pandu langkah demi langkah sambil Anda melakukan klik (saya akan beri instruksi per langkah).

Beritahu pilihan Anda (B atau C), atau minta saya bantu menjalankan migrasi lokal (saya tidak meminta DB credentials — lebih aman Anda jalankan sendiri dan saya pandu).
