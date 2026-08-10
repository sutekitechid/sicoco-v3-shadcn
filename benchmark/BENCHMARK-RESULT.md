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
| **Waktu Build** | 1.298ms | 723ms | **711ms** | v4 Full |
| **Ukuran Bundle (Gzip)** | 15.228 bytes | **11.595 bytes** | 17.912 bytes | v4 Minimal |
| **Variabel CSS** | 159 | 166 | **300** | v4 Full |
| **Cakupan Class** | 57% | 45% | **61%** | v4 Full |

**Kesimpulan:** v4 memberikan performa build yang lebih baik (1,80x lebih cepat) dengan ukuran bundle yang lebih kecil (23,9% lebih kecil untuk v4 Minimal). v4 Full menghasilkan lebih banyak CSS variables (300 vs 159) untuk fleksibilitas runtime yang lebih tinggi.

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
v3 Default:     1.298ms (min: 1.143, maks: 1.512)
v4 Minimal:     723ms (min: 666, maks: 823)
v4 Full:        711ms (min: 662, maks: 762)

```

### Ukuran Bundle

| Konfigurasi | Mentah (Raw) | Gzip | vs v3 |
| --- | --- | --- | --- |
| **v3 Default** | 101.450 bytes | 15.228 bytes | baseline |
| **v4 Minimal** | 65.534 bytes | 11.595 bytes | -23,9% |
| **v4 Full** | 120.089 bytes | 17.912 bytes | +17,6% |

### Variabel CSS

| Konfigurasi | Jumlah |
| --- | --- |
| v3 Default | 159 |
| v4 Minimal | 166 |
| v4 Full | 300 |

### Temuan

1. **v4 Full paling cepat** (711ms = 1,83x lebih cepat dari v3)
2. **v4 Minimal paling kecil** (11.595 bytes gzip = 23,9% lebih kecil dari v3)
3. **v4 Full paling banyak variabel CSS** (300 vs 159)
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
v3 Default:     1.210ms (min: 1.147, maks: 1.423)
v4 Minimal:     699ms (min: 662, maks: 738)
v4 Full:        751ms (min: 701, maks: 907)

```

### Ukuran Bundle

| Konfigurasi | Mentah (Raw) | Gzip | vs v3 |
| --- | --- | --- | --- |
| **v3 Default** | 101.450 bytes | 15.231 bytes | baseline |
| **v4 Minimal** | 65.534 bytes | 11.598 bytes | -23,9% |
| **v4 Full** | 120.089 bytes | 17.915 bytes | +17,6% |

### Cakupan Class

| Konfigurasi | Terdeteksi | Dihasilkan | Digunakan | Cakupan |
| --- | --- | --- | --- | --- |
| v3 Default | 217 | 643 | 124 | **57%** |
| v4 Minimal | 217 | 612 | 97 | 45% |
| v4 Full | 217 | 720 | 132 | **61%** |

### Temuan

1. **v4 Full memiliki cakupan terbaik** (61% vs 57% vs 45%)
2. **v3 sekarang mendeteksi class dengan benar** (57% vs 0% sebelumnya)
3. **v4 Minimal paling cepat** (699ms = 1,73x lebih cepat dari v3)
4. **v4 Minimal menghasilkan CSS paling kecil** (11.598 bytes gzip)

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
v4 Full:    711ms (baseline)
v3 Default: 1.298ms (1,83x lebih lambat)
v4 Minimal: 723ms (1,02x lebih lambat)

```

**Penjelasan:** Engine Lightning CSS berbasis Rust pada v4 memberikan performa kompilasi yang lebih baik, terutama untuk proyek dengan banyak utility kustom.

### Temuan 2: v4 Minimal Menghasilkan Bundle Lebih Kecil

```
v4 Minimal: 11.595 bytes gzip (baseline)
v3 Default: 15.228 bytes gzip (+31,3% lebih besar)
v4 Full:    17.912 bytes gzip (+54,5% lebih besar)

```

**Penjelasan:** v4 Minimal menghasilkan CSS yang lebih efisien karena tidak mengekspos semua tema bawaan sebagai variabel CSS. v3 tetap menghasilkan CSS yang relatif besar karena semua custom utilities didefinisikan secara manual.

### Temuan 3: v3 Sekarang Mendeteksi Class dengan Benar

```
v3 Generated: 643 class (57% cakupan)
v4 Generated: 612-720 class (45-61% cakupan)

```

**Penjelasan:** Dengan konfigurasi `content: [...]` yang benar, v3 sekarang dapat mendeteksi class dari seluruh proyek. Namun, v4 tetap memiliki cakupan yang lebih tinggi untuk beberapa konfigurasi karena deteksi otomatis.

### Temuan 4: Variabel CSS v4 Memungkinkan Fleksibilitas Runtime

```
Variabel v3: 159 (hanya kustom)
Variabel v4: 166-300 (bawaan + kustom)

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

* Proyek sudah stabil dengan konfigurasi v3
* Tidak memerlukan penentuan tema (theming) saat runtime
* Menggunakan plugin PostCSS lama (legacy)
* Ingin kompatibilitas dengan ekosistem v3 yang lebih luas

### Gunakan v4 Minimal Jika:

* Menginginkan pengalaman tanpa konfigurasi (zero-config)
* Proyek baru tanpa tema kustom
* Nilai bawaan (built-in defaults) sudah cukup
* Ingin ukuran bundle yang lebih kecil (23,9% lebih kecil dari v3)
* Ingin fitur CSS modern (oklch, CSS layers)

### Gunakan v4 Full Jika:

* Kecepatan build adalah prioritas (1,83x lebih cepat dari v3)
* Memerlukan theming runtime / branding dinamis
* Sistem desain kustom tergolong kompleks
* Aplikasi multi-brand / multi-theme
* Menginginkan variabel CSS untuk kustomisasi dinamis (300 vs 159)
* Tim sudah terbiasa dengan konfigurasi berbasis CSS

### Strategi Migrasi

| Langkah | Tindakan | Risiko |
| --- | --- | --- |
| 1 | Audit utility kustom | Rendah |
| 2 | Konversi tailwind.config.js ke @theme | Sedang |
| 3 | Perbarui @layer utilities ke @utility | Sedang |
| 4 | Uji semua komponen | Tinggi |
| 5 | Terapkan (deploy) dengan feature flag | Rendah |

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
    "buildTime": { "average": 1298, "min": 1143, "max": 1512 },
    "analysis": { "raw": 101450, "gzip": 15228, "variables": 159 }
  },
  "v4Minimal": {
    "buildTime": { "average": 723, "min": 666, "max": 823 },
    "analysis": { "raw": 65534, "gzip": 11595, "variables": 166 }
  },
  "v4Full": {
    "buildTime": { "average": 711, "min": 662, "max": 762 },
    "analysis": { "raw": 120089, "gzip": 17912, "variables": 300 }
  }
}

```

#### Vue Runtime Benchmark (JSON)

```json
{
  "v3": {
    "buildTime": { "average": 1210, "min": 1147, "max": 1423 },
    "analysis": { "raw": 101450, "gzip": 15231, "variables": 159, "classes": { "htmlTotal": 217, "used": 124, "percentage": 57 } }
  },
  "v4Minimal": {
    "buildTime": { "average": 699, "min": 662, "max": 738 },
    "analysis": { "raw": 65534, "gzip": 11598, "variables": 166, "classes": { "htmlTotal": 217, "used": 97, "percentage": 45 } }
  },
  "v4Full": {
    "buildTime": { "average": 751, "min": 701, "max": 907 },
    "analysis": { "raw": 120089, "gzip": 17915, "variables": 300, "classes": { "htmlTotal": 217, "used": 132, "percentage": 61 } }
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

### D. Perubahan Konfigurasi Deteksi Class

Sebelumnya, benchmark hanya mendeteksi class dari file HTML test (`shared/test-templates/`). Setelah perubahan, kedua versi mendeteksi class dari seluruh proyek:

| File | Konfigurasi Lama | Konfigurasi Baru |
| --- | --- | --- |
| `tailwind-v3.config.js` | `content: ['./shared/test-templates/**/*.html']` | `content: ['../lib/**/*.vue', '../lib/**/*.{ts,js}', '../src/**/*.vue', '../src/**/*.{ts,js}', '../index.html', './shared/**/*.html']` |
| `tailwind-v4.css` | Tanpa `@source` | `@source "../../lib/"; @source "../../src/";` |
| `tailwind-v4-minimal.css` | Tanpa `@source` | `@source "../../lib/"; @source "../../src/";` |

### E. Batasan (Limitations)

1. **Dynamic Classes:** Tidak dapat mengekstrak class dari `:class="cn(...)"` tanpa runtime
2. **Scoped Styles:** Direktif `@reference` tidak ditangani dalam ekstraksi
3. **Lingkungan (Environment):** Benchmark dijalankan di macOS, hasil mungkin berbeda di Linux/Windows

---

**Dokumen Dihasilkan:** 10 Agustus 2026

**Skrip Benchmark:** `benchmark/scripts/`

**Hasil:** `benchmark/reports/`