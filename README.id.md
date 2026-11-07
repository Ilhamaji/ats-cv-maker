<div align="center">

# ATS CV Maker

Editor CV **ATS-friendly** berbasis Nuxt 4 — tulis di form, lihat preview langsung, lalu ekspor ke PDF.

[![Status](https://img.shields.io/badge/status-%F0%9F%9A%A7%20work%20in%20progress-orange?style=flat-square)](#)
[![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?style=flat-square&logo=nuxt&logoColor=white)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

<!-- lang-switcher -->
[English](README.md) · **Bahasa Indonesia**

</div>

---

> ## 🚧 Project ini belum selesai
>
> Editor dan ekspor PDF sudah berjalan, tetapi belum ada penyimpanan data — **CV akan hilang saat halaman di-refresh**. Belum ada preset tema, autosave, atau validasi input. Lihat [Roadmap](#-roadmap) di bawah.

---

## Tentang

Banyak CV gagal di tahap awal karena formatnya tidak terbaca oleh **Applicant Tracking System (ATS)** — kolom ganda, tabel, ikon, atau font aneh membuat teks tidak ter-parse. Project ini membuat CV dengan struktur teks polos yang aman untuk ATS, tapi tetap rapi secara visual.

Dibangun dengan Nuxt 4, editor reaktif di sisi klien, dan **Puppeteer** di server untuk merender PDF asli (bukan `print` bawaan browser).

## Fitur yang Sudah Jalan

- Form terstruktur untuk data pribadi, ringkasan, pengalaman kerja, pendidikan, dan skill.
- Preview di panel sebelah langsung ikut berubah saat mengetik.
- Dua slider: ukuran font (4–24pt) dan jarak antar-elemen (8–32px).
- PDF dirender di server lewat `/api/generate-pdf` (Puppeteer), bukan `window.print()` — hasilnya sama di semua browser.
- Di layar kecil, editor dan preview dipisah jadi tab.

## Tech Stack

| Bagian | Teknologi |
| --- | --- |
| Framework | Nuxt 4 |
| UI | Vue 3 + SCSS |
| Bahasa | TypeScript |
| Ikon | `@lucide/vue` |
| PDF | Puppeteer (server-side) |
| Font | `@nuxt/fonts` |

## Menjalankan

```bash
git clone https://github.com/Ilhamaji/ats-cv-maker.git
cd ats-cv-maker
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

> Puppeteer mengunduh Chromium (~150 MB) saat `npm install` — perkirakan waktu dan ruang disk.

## Struktur

```
app/
  app.vue                    # layout utama, tab mobile, kontrol slider
  components/
    CvEditor.vue             # form editor CV
    CvPreview.vue            # preview dokumen
  assets/scss/main.scss      # styling & sistem glass
server/api/generate-pdf.post.ts   # render PDF via Puppeteer
public/pdf/CV_John_Doe.pdf        # contoh hasil
```

## 🗺️ Roadmap

### Prioritas Tinggi
- [ ] **Penyimpanan data** — persistensi ke `localStorage` (atau IndexedDB) agar CV tidak hilang saat refresh.
- [ ] **Autosave & draft recovery** — simpan otomatis tiap beberapa detik, pulihkan draft terakhir.
- [ ] **Validasi input** — cek format email, telepon, dan URL LinkedIn sebelum ekspor.
- [ ] **Import/Export JSON** — simpan CV sebagai file agar bisa diedit ulang di perangkat lain.

### Prioritas Menengah
- [ ] **Preset template** — 3–5 varian layout yang semuanya lolos uji ATS.
- [ ] **Manajemen multi-CV** — simpan beberapa versi CV (mis. per posisi yang dilamar).
- [ ] **Reorder drag-and-drop** — susun ulang section dan item pengalaman.
- [ ] **Reorder pendidikan & sertifikasi** — tambah section sertifikasi, bahasa, dan project.

### Prioritas Rendah
- [ ] **Skor ATS** — indikator sederhana seberapa "aman" CV untuk parser (hindari tabel/kolom ganda).
- [ ] **Cover letter generator** — template surat lamaran dari data CV.
- [ ] **Dark mode** untuk editor.
- [ ] **Unit test** untuk komponen editor dan endpoint PDF.

### Diketahui Kurang / Bug
- [ ] Contoh `public/pdf/CV_John_Doe.pdf` masih data dummy — perlu diganti contoh nyata.
- [ ] Belum ada penanganan error bila Puppeteer gagal launch (mis. di server tanpa Chromium).
- [ ] Nomor halaman dan header/footer PDF belum bisa dikonfigurasi.

---

<div align="center">
Dibuat oleh <a href="https://github.com/Ilhamaji">Ilham Aji</a>
</div>
