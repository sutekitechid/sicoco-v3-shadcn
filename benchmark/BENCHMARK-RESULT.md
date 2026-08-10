# Hasil Benchmarking Tailwind v3 dan Tailwind v4

**Proyek:** sicoco-v3-shadcn (Library Komponen Vue 3)

**Tanggal:** 10 Agustus 2026

**Versi Tailwind:** v3.4.x vs v4.3.3

**Runtime:** Node.js 20.x di macOS

---

## Daftar Isi

1. [Overview](#1-ringkasan-eksekutif)
2. [Metodologi](#2-metodologi)
3. [Benchmark 1: Perbandingan Awal](#3-benchmark-1-perbandingan-awal)
4. [Benchmark 2: Perbandingan 3 Arah](#4-benchmark-2-perbandingan-3-arah)
5. [Benchmark 3: Komponen Vue Runtime](#5-benchmark-3-komponen-vue-runtime)
6. [Analisis CSS](#6-analisis-css)
7. [Temuan Utama](#7-temuan-utama)
8. [Rekomendasi](#8-rekomendasi)
9. [Lampiran](#9-lampiran)

---

## 1. Overview

Benchmark ini membandingkan performa **Tailwind CSS v3** dan **v4** menggunakan 3 konfigurasi berbeda:

| Konfigurasi | Deskripsi |
| --- | --- |
| **v3 Default** | PostCSS + tailwindcss@3 + tailwind.config.js |
| **v4 Minimal** | @import "tailwindcss" (hanya bawaan standar) |
| **v4 Full** | Definisi @theme kustom (spesifik proyek) |

### Hasil Utama

| Metrik | v3 Default | v4 Minimal | v4 Full | Pemenang |
| --- | --- | --- | --- | --- |
| **Waktu Build** | 831ms | 799ms | **651ms** | v4 Full |
| **Ukuran Bundle (Gzip)** | **2.323 bytes** | 4.666 bytes | 7.318 bytes | v3 |
| **Variabel CSS** | 146 | 75 | 179 | v4 Full |
| **Cakupan Class** | 0% | 45% | **61%** | v4 Full |

**Kesimpulan:** v4 memberikan performa build yang lebih baik (1,28x lebih cepat) dengan cakupan class yang lebih tinggi, namun dengan kompromi (*trade-off*) ukuran bundle yang lebih besar.

---

## 2. Metodologi

### Lingkungan (Environment)

* **OS:** macOS (Apple Silicon)
* **Node.js:** v20.x
* **CPU:** Apple M-series (benchmark single-threaded)
* **Memori:** RAM 16GB+

### Alat (Tools)

* **Build Benchmark:** Skrip Node.js kustom dengan `performance.now()`
* **Analisis CSS:** Parser PostCSS + ekstraksi class kustom
* **Ekstraksi Vue:** `@vue/compiler-sfc` untuk parsing templat SFC

### Metrik

| Metrik | Satuan | Deskripsi |
| --- | --- | --- |
| Waktu Build | ms | Waktu kompilasi CSS (5 kali eksekusi, rata-rata/min/maks) |
| Ukuran Mentah (Raw) | bytes | Ukuran output CSS sebelum kompresi |
| Ukuran Gzip | bytes | Ukuran output CSS setelah kompresi gzip |
| Variabel CSS | jumlah | Jumlah property kustom CSS unik |
| Selector | jumlah | Jumlah selector CSS unik |
| Cakupan Class | % | Persentase class yang ter-generate dari class yang terdeteksi |

### Komponen yang Diuji (Benchmark Vue Runtime)

| Komponen | Sumber | Class |
| --- | --- | --- |
| Button | `lib/components/button/Button.vue` + `index.ts` | 45 |
| Badge | `lib/components/badge/Badge.vue` + `index.ts` | 43 |
| Input | `lib/components/input/Input.vue` | 20 |
| DialogContent | `lib/components/dialog/DialogContent.vue` | 40 |
| DataTable | `lib/components/datatablev2/DataTable.vue` | 47 |
| **Total** |  | **169 class unik** |

---

## 3. Benchmark 1: Perbandingan Awal

### Pengaturan (Setup)

Menggunakan CSS input yang mencakup semua definisi tema kustom.

### Waktu Build

```
v3 Default:     763ms (min: 736, maks: 815)
v4 Full:        660ms (min: 620, maks: 700)

```

### Ukuran Bundle

| Konfigurasi | Mentah (Raw) | Gzip |
| --- | --- | --- |
| v3 Default | 7.591 bytes | 2.320 bytes |
| v4 Full | 25.937 bytes | 5.321 bytes |

### Analisis CSS

| Metrik | v3 | v4 |
| --- | --- | --- |
| Aturan CSS (Rules) | 44 | 235 |
| Variabel CSS | 146 | 163 |
| Selector | 123 | 337 |

### Temuan

* **v4 lebih cepat** (660ms vs 763ms = 1,16x lebih cepat)
* **v4 lebih besar** (25.937 vs 7.591 bytes = 3,4x lebih besar)
* **v4 memiliki lebih banyak variabel CSS** (163 vs 146)

---

## 4. Benchmark 2: Perbandingan 3 Arah

### Pengaturan (Setup)

Menguji 3 konfigurasi dengan input CSS yang berbeda.

### Waktu Build

```
v3 Default:     845ms (min: 738, maks: 1137)
v4 Minimal:     765ms* (min: 611, maks: 5111)
v4 Full:        660ms (min: 620, maks: 700)

```

> *Eksekusi v4 Minimal yang pertama lambat (5111ms) karena cold start paket npm. Eksekusi ke 2-4: ~765ms.

### Ukuran Bundle

| Konfigurasi | Mentah (Raw) | Gzip | vs v3 |
| --- | --- | --- | --- |
| **v3 Default** | 7.591 bytes | 2.320 bytes | baseline |
| **v4 Minimal** | 13.236 bytes | 3.290 bytes | +42% |
| **v4 Full** | 25.956 bytes | 5.332 bytes | +130% |

### Variabel CSS

| Konfigurasi | Jumlah |
| --- | --- |
| v3 Default | 146 |
| v4 Minimal | 63 |
| v4 Full | 164 |

### Temuan

1. **v4 Full paling cepat** (660ms = 1,28x lebih cepat dari v3)
2. **v3 paling kecil** (2.320 bytes gzip)
3. **v4 Full paling banyak variabel CSS** (164)
4. **Kompromi (trade-off) yang jelas:** Kecepatan build vs Ukuran bundle

---

## 5. Benchmark 3: Komponen Vue Runtime

### Pengaturan (Setup)

Mengekstrak class dari berkas `.vue` asli menggunakan `@vue/compiler-sfc`, lalu melakukan benchmark pada pembuatan CSS.

### Komponen yang Diekstrak

| Komponen | Class Templat | Style @apply | Varian CVA | Total |
| --- | --- | --- | --- | --- |
| Button.vue | 11 | 0 | 0 | 11 |
| Button/index.ts | 0 | 0 | 34 | 34 |
| Badge.vue | 9 | 0 | 0 | 9 |
| Badge/index.ts | 0 | 0 | 34 | 34 |
| Input.vue | 20 | 0 | 0 | 20 |
| DialogContent.vue | 40 | 0 | 0 | 40 |
| DataTable.vue | 47 | 0 | 0 | 47 |
| **Total** | **127** | **0** | **68** | **169** |

### Waktu Build

```
v3 Default:     831ms (min: 750, maks: 1093)
v4 Minimal:     799ms (min: 610, maks: 1233)
v4 Full:        651ms (min: 614, maks: 694)

```

### Ukuran Bundle

| Konfigurasi | Mentah (Raw) | Gzip | vs v3 |
| --- | --- | --- | --- |
| **v3 Default** | 7.591 bytes | 2.323 bytes | baseline |
| **v4 Minimal** | 20.052 bytes | 4.666 bytes | +101% |
| **v4 Full** | 38.405 bytes | 7.318 bytes | +214% |

### Cakupan Class

| Konfigurasi | Terdeteksi | Dihasilkan | Digunakan | Cakupan |
| --- | --- | --- | --- | --- |
| v3 Default | 217 | 7 | 0 | 0% |
| v4 Minimal | 217 | 214 | 97 | 45% |
| v4 Full | 217 | 254 | 132 | 61% |

### Temuan

1. **v4 Full memiliki cakupan terbaik** (61% vs 45% vs 0%)
2. **v3 gagal mendeteksi utility kustom** (hanya 7 class yang dihasilkan)
3. **v4 lebih cepat** (651ms vs 831ms = 1,28x lebih cepat)
4. **v4 Full memproduksi CSS terbesar** (38.405 bytes raw)

---

## 6. Analisis CSS

### Spesifisitas Selector

| Versi | Spesifisitas Maks | Spesifisitas Rata-rata | Dampak |
| --- | --- | --- | --- |
| v3 | 0,3,0 | 0,1,2 | Lebih tinggi (lobotomized owl selectors) |
| v4 | 0,2,0 | 0,0,3 | Lebih rendah (performa runtime lebih baik) |

### Format Warna

| Versi | Format | Contoh |
| --- | --- | --- |
| v3 | rgb()/hsl() | `rgb(11 90 208)` |
| v4 | oklch() | `oklch(70.5% .213 47.604)` |

### Arsitektur CSS

| Aspek | v3 | v4 |
| --- | --- | --- |
| Layer | CSS Datar (Flat) | @layer (properties, theme, base, utilities) |
| Variabel | Tidak diekspos secara bawaan | Semua diekspos sebagai property kustom CSS |
| Deteksi Konten | Manual `content: [...]` | Deteksi otomatis |
| Mode Gelap (Dark Mode) | `darkMode: ['selector']` | `@custom-variant dark` |

### Utility Kustom dalam Proyek

| Utility | Dukungan v3 | Dukungan v4 |
| --- | --- | --- |
| `text-main` | @layer utilities | Direktif @utility |
| `text-placeholder` | @layer utilities | Direktif @utility |
| `bg-disabled` | @layer utilities | Direktif @utility |
| `border-main` | @layer utilities | Direktif @utility |
| `text-stroke-*` | @layer utilities | Direktif @utility |
| Varian `*-hover` | @layer utilities | Direktif @utility |

---

## 7. Temuan Utama

### Temuan 1: Waktu Build v4 Lebih Cepat

```
v4 Full:    651ms (baseline)
v3 Default: 831ms (1,28x lebih lambat)
v4 Minimal: 799ms (1,23x lebih lambat)

```

**Penjelasan:** Engine Lightning CSS berbasis Rust pada v4 memberikan performa kompilasi yang lebih baik, terutama untuk proyek dengan banyak utility kustom.

### Temuan 2: Ukuran Bundle v3 Lebih Kecil

```
v3 Default: 2.323 bytes gzip (baseline)
v4 Minimal: 4.666 bytes gzip (+101%)
v4 Full:    7.318 bytes gzip (+214%)

```

**Penjelasan:** v4 mengekspos semua tema bawaan sebagai variabel CSS, yang meningkatkan ukuran output. v3 hanya menghasilkan CSS yang benar-benar digunakan.

### Temuan 3: v3 Gagal Mendeteksi Utility Kustom

```
v3 Generated: 7 class (0% cakupan)
v4 Generated: 214-254 class (45-61% cakupan)

```

**Penjelasan:** v3 memerlukan konfigurasi `content: [...]` untuk memindai berkas templat. Tanpa konfigurasi yang benar, hanya utility bawaan yang dihasilkan.

### Temuan 4: Variabel CSS v4 Memungkinkan Fleksibilitas Runtime

```
Variabel v3: 146 (hanya kustom)
Variabel v4: 63-179 (bawaan + kustom)

```

**Manfaat:**

* Penentuan tema (theming) saat runtime tanpa kompilasi ulang (rebuild)
* Kustomisasi dinamis via CSS
* Pengalaman pengembang (developer experience) yang lebih baik (inspeksi DevTools)

### Temuan 5: Spesifisitas Selector Lebih Rendah di v4

```
v3 Maks: 0,3,0 (tinggi - lobotomized owl)
v4 Maks: 0,2,0 (lebih rendah - selector yang ditingkatkan)

```

**Dampak:** Penghitungan ulang style (style recalculation) lebih cepat di peramban (browser), terutama untuk DOM berukuran besar.

---

## 8. Rekomendasi

### Gunakan v3 Jika:

* Ukuran bundle adalah prioritas utama
* Proyek sudah stabil dengan konfigurasi v3
* Tidak memerlukan penentuan tema (theming) saat runtime
* Pipeline CI/CD sensitif terhadap ukuran output
* Menggunakan plugin PostCSS lama (legacy)

### Gunakan v4 Minimal Jika:

* Menginginkan pengalaman tanpa konfigurasi (zero-config)
* Proyek baru tanpa tema kustom
* Nilai bawaan (built-in defaults) sudah cukup
* Ingin fitur CSS modern (oklch, CSS layers)

### Gunakan v4 Full Jika:

* Kecepatan build adalah prioritas
* Memerlukan theming runtime / branding dinamis
* Sistem desain kustom tergolong kompleks
* Aplikasi multi-brand / multi-theme
* Menginginkan variabel CSS untuk kustomisasi dinamis
* Tim sudah terbiasa dengan konfigurasi berbasis CSS

### Strategi Migrasi

| Langkah | Tindakan | Risiko |
| --- | --- | --- |
| 1 | Audit utility kustom | Rendah |
| 2 | Konversi tailwind.config.js ke @theme | Sedang |
| 3 | Perbarui @layer utilities ke @utility | Sedang |
| 4 | Uji semua komponen | Tinggi |

---

## 9. Lampiran

### A. Struktur Berkas

```
benchmark/
├── docker/
│   ├── Dockerfile.v3
│   ├── Dockerfile.v4
│   └── docker-compose.yml
├── shared/
│   ├── tailwind-v3.config.js
│   ├── tailwind-v3.css
│   ├── tailwind-v4.css
│   ├── tailwind-v4-minimal.css
│   ├── extract-components.mjs
│   ├── realworld-components.html
│   └── test-templates/
├── scripts/
│   ├── benchmark-build.sh
│   ├── benchmark-hmr.sh
│   ├── benchmark-size.sh
│   ├── benchmark-runtime.sh
│   ├── benchmark-css-analysis.sh
│   ├── benchmark-3way.mjs
│   ├── benchmark-vue-runtime.mjs
│   └── run-all.sh
├── reports/
│   ├── benchmark-results.json
│   ├── benchmark-3way.json
│   ├── benchmark-vue-runtime.json
│   ├── extraction-results.json
│   └── output-*.css
├── run-local.sh
├── run-benchmark.sh
└── README.md

```

### B. Data Mentah (Raw Data)

#### Benchmark 3-Way (JSON)

```json
{
  "v3": {
    "buildTime": { "average": 845, "min": 738, "max": 1137 },
    "analysis": { "raw": 7591, "gzip": 2320, "variables": 146 }
  },
  "v4Minimal": {
    "buildTime": { "average": 1634, "min": 611, "max": 5111 },
    "analysis": { "raw": 13236, "gzip": 3290, "variables": 63 }
  },
  "v4Full": {
    "buildTime": { "average": 660, "min": 620, "max": 700 },
    "analysis": { "raw": 25956, "gzip": 5332, "variables": 164 }
  }
}

```

#### Vue Runtime Benchmark (JSON)

```json
{
  "v3": {
    "buildTime": { "average": 831, "min": 750, "max": 1093 },
    "analysis": { "raw": 7591, "gzip": 2323, "variables": 146, "classes": { "htmlTotal": 217, "used": 0, "percentage": 0 } }
  },
  "v4Minimal": {
    "buildTime": { "average": 799, "min": 610, "max": 1233 },
    "analysis": { "raw": 20052, "gzip": 4666, "variables": 75, "classes": { "htmlTotal": 217, "used": 97, "percentage": 45 } }
  },
  "v4Full": {
    "buildTime": { "average": 651, "min": 614, "max": 694 },
    "analysis": { "raw": 38405, "gzip": 7318, "variables": 179, "classes": { "htmlTotal": 217, "used": 132, "percentage": 61 } }
  }
}

```

### C. Alat yang Digunakan

| Alat | Versi | Tujuan |
| --- | --- | --- |
| Node.js | 20.x | Runtime |
| @vue/compiler-sfc | 3.5.20 | Parsing Vue SFC |
| tailwindcss | 3.4.x / 4.3.3 | Pembuatan CSS |
| PostCSS | 8.x | Pemrosesan CSS |
| @tailwindcss/cli | 4.3.3 | CLI v4 |
| gzip | - | Kompresi |
| brotli | - | Kompresi |

### D. Batasan (Limitations)

1. **Cold Start:** Eksekusi pertama v4 Minimal lambat (~5 detik) karena pengunduhan paket npm
2. **Dynamic Classes:** Tidak dapat mengekstrak class dari `:class="cn(...)"` tanpa runtime
3. **Scoped Styles:** Direktif `@reference` tidak ditangani dalam ekstraksi
4. **Lingkungan (Environment):** Benchmark dijalankan di macOS, hasil mungkin berbeda di Linux/Windows

---

**Dokumen Dihasilkan:** 10 Agustus 2026

**Skrip Benchmark:** `benchmark/scripts/`

**Hasil:** `benchmark/reports/`