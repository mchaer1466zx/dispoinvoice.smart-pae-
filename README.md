# dispoinvoice.smart-pae-

Smart aplikasi document Prima Andalas Energi

## Tentang Aplikasi

Aplikasi ini adalah solusi manajemen dokumen cerdas untuk Prima Andalas Energi (PAE), dengan dukungan integrasi produk dan brand showcase.

## 📦 Brand Products

### Wiridan 318

**Wiridan 318** adalah merek produk makanan berkualitas dari Prima Andalas Energi yang menyediakan berbagai pilihan daging olahan premium.

#### Produk Tersedia:

| Kategori | Varian | Deskripsi |
|----------|--------|-----------|
| **BAKSO** | Bakso Goreng | Daging & Renyah |
| | Bakso Ayam | Lembut & Gurih |
| | Bakso Medium | Ukuran Pas, Rasa Seimbang |
| | Bakso Urat | Kenyal & Berurat |
| | Bakso Premium | Lezat, Gurih, Nikmat |
| **OTAK-OTAK** | Otak-otak | Ikan Pilihan, Lezat, Bergizi |
| **DIMSUM** | Dimsum Ayam | Lembut, Gurih & Praktis |
| | Dimsum Mix | Aneka Dimsum, Varian Lezat |

**Kualitas Terjamin:**
- ✓ Halal
- ✓ Higienis
- ✓ Praktis
- ✓ Simpan Beku -18°C

**Berat:** 500g per kemasan

---

## 📁 Struktur Direktori Assets

```
public/
├── images/              # Gambar produk Wiridan 318
├── sang-prabu/         # Assets brand Sang Prabu
├── logos/              # Logo perusahaan dan brand
├── articles/           # Konten artikel
├── file.svg            # Icon file
├── globe.svg           # Icon globe
└── window.svg          # Icon window
```

---

## 🖼️ Optimasi Gambar - Rekomendasi

### Format & Kompresi

Untuk performa optimal, disarankan untuk mengoptimalkan semua gambar produk dengan kriteria berikut:

| Aspek | Rekomendasi | Alasan |
|-------|-------------|--------|
| **Format** | WebP (primary), PNG (fallback) | Ukuran lebih kecil, kualitas sama |
| **Ukuran File** | < 200KB per gambar | Kecepatan loading halaman |
| **Resolusi** | 1200x1500px (product cards) | Sharp di layar modern + 2x DPI |
| **Compression** | 80-85% quality | Balance antara kualitas & ukuran |
| **Naming** | `wiridan-318-bakso-ayam.webp` | Deskriptif dan SEO-friendly |

### Tools Rekomendasi

```bash
# Konversi ke WebP dengan ImageMagick
convert input.jpg -quality 85 output.webp

# Batch processing dengan FFmpeg
for file in *.jpg; do 
  ffmpeg -i "$file" -c:v libwebp -quality 85 "${file%.jpg}.webp"
done

# Atau gunakan Online Tools:
# - TinyPNG/TinyJPG
# - Squoosh (Google)
# - ImageOptim (Mac)
```

### Implementasi di HTML

```html
<!-- Responsive Image dengan WebP fallback -->
<picture>
  <source srcset="wiridan-318-bakso-ayam.webp" type="image/webp">
  <img src="wiridan-318-bakso-ayam.png" alt="Bakso Ayam Wiridan 318">
</picture>
```

---

## 🚀 Teknologi

- **Frontend:** TypeScript
- **Build:** Modern bundler (Vite/Next.js)
- **Deployment:** Vercel ([sistem-pae.vercel.app](https://sistem-pae.vercel.app))

---

## 📋 TODO

- [ ] Optimasi semua gambar produk ke format WebP
- [ ] Implementasi lazy loading untuk gambar
- [ ] Buat image fallback untuk network lambat
- [ ] Setup CDN untuk asset delivery
- [ ] Tambahkan SEO metadata untuk produk

---

## 📄 Lisensi

Privacy Andalas Energi © 2026

---

**Last Updated:** 2026-08-17
