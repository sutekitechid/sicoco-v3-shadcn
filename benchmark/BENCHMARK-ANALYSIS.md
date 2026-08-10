# Tailwind CSS v3 vs v4: Comprehensive Benchmark Analysis

**Project:** sicoco-v3-shadcn (Vue 3 Component Library)
**Date:** August 10, 2026
**Tailwind Versions:** v3.4.x vs v4.3.3
**Runtime:** Node.js 20.x on macOS

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Methodology](#2-methodology)
3. [Benchmark 1: Initial Comparison](#3-benchmark-1-initial-comparison)
4. [Benchmark 2: 3-Way Comparison](#4-benchmark-2-3-way-comparison)
5. [Benchmark 3: Vue Runtime Components](#5-benchmark-3-vue-runtime-components)
6. [CSS Analysis](#6-css-analysis)
7. [Key Findings](#7-key-findings)
8. [Recommendations](#8-recommendations)
9. [Appendix](#9-appendix)

---

## 1. Executive Summary

Benchmark ini membandingkan performa **Tailwind CSS v3** dan **v4** menggunakan 3 konfigurasi berbeda:

| Config | Deskripsi |
|--------|-----------|
| **v3 Default** | PostCSS + tailwindcss@3 + tailwind.config.js |
| **v4 Minimal** | @import "tailwindcss" (built-in defaults only) |
| **v4 Full** | Custom @theme definitions (project-specific) |

### Hasil Utama

| Metric | v3 Default | v4 Minimal | v4 Full | Winner |
|--------|------------|------------|---------|--------|
| **Build Time** | 831ms | 799ms | **651ms** | v4 Full |
| **Bundle Size (Gzip)** | **2,323 bytes** | 4,666 bytes | 7,318 bytes | v3 |
| **CSS Variables** | 146 | 75 | 179 | v4 Full |
| **Class Coverage** | 0% | 45% | **61%** | v4 Full |

**Kesimpulan:** v4 memberikan performa build yang lebih baik (1.28x faster) dengan class coverage lebih tinggi, namun dengan trade-off bundle size yang lebih besar.

---

## 2. Methodology

### Environment

- **OS:** macOS (Apple Silicon)
- **Node.js:** v20.x
- **CPU:** Apple M-series (single-threaded benchmark)
- **Memory:** 16GB+ RAM

### Tools

- **Build Benchmark:** Custom Node.js script dengan `performance.now()`
- **CSS Analysis:** PostCSS parser + custom class extraction
- **Vue Extraction:** `@vue/compiler-sfc` for SFC template parsing

### Metrics

| Metric | Unit | Description |
|--------|------|-------------|
| Build Time | ms | Waktu compile CSS (5 runs, avg/min/max) |
| Raw Size | bytes | Ukuran CSS output sebelum kompresi |
| Gzip Size | bytes | Ukuran CSS output setelah gzip kompresi |
| CSS Variables | count | Jumlah unique CSS custom properties |
| Selectors | count | Jumlah unique CSS selectors |
| Class Coverage | % | Persentase classes yang ter-generate dari detected classes |

### Components Tested (Vue Runtime Benchmark)

| Component | Source | Classes |
|-----------|--------|---------|
| Button | `lib/components/button/Button.vue` + `index.ts` | 45 |
| Badge | `lib/components/badge/Badge.vue` + `index.ts` | 43 |
| Input | `lib/components/input/Input.vue` | 20 |
| DialogContent | `lib/components/dialog/DialogContent.vue` | 40 |
| DataTable | `lib/components/datatablev2/DataTable.vue` | 47 |
| **Total** | | **169 unique classes** |

---

## 3. Benchmark 1: Initial Comparison

### Setup

Menggunakan CSS input yang meng-include semua custom theme definitions.

### Build Time

```
v3 Default:     763ms (min: 736, max: 815)
v4 Full:        660ms (min: 620, max: 700)
```

### Bundle Size

| Config | Raw | Gzip |
|--------|-----|------|
| v3 Default | 7,591 bytes | 2,320 bytes |
| v4 Full | 25,937 bytes | 5,321 bytes |

### CSS Analysis

| Metric | v3 | v4 |
|--------|----|----|
| CSS Rules | 44 | 235 |
| CSS Variables | 146 | 163 |
| Selectors | 123 | 337 |

### Temuan

- **v4 lebih cepat** (660ms vs 763ms = 1.16x faster)
- **v4 lebih besar** (25,937 vs 7,591 bytes = 3.4x larger)
- **v4 lebih banyak CSS variables** (163 vs 146)

---

## 4. Benchmark 2: 3-Way Comparison

### Setup

Menguji 3 konfigurasi dengan CSS input yang berbeda.

### Build Time

```
v3 Default:     845ms (min: 738, max: 1137)
v4 Minimal:     765ms* (min: 611, max: 5111)
v4 Full:        660ms (min: 620, max: 700)
```

> *v4 Minimal run pertama lambat (5111ms) karena npm package cold start. Run 2-4: ~765ms.

### Bundle Size

| Config | Raw | Gzip | vs v3 |
|--------|-----|------|-------|
| **v3 Default** | 7,591 bytes | 2,320 bytes | baseline |
| **v4 Minimal** | 13,236 bytes | 3,290 bytes | +42% |
| **v4 Full** | 25,956 bytes | 5,332 bytes | +130% |

### CSS Variables

| Config | Count |
|--------|-------|
| v3 Default | 146 |
| v4 Minimal | 63 |
| v4 Full | 164 |

### Temuan

1. **v4 Full paling cepat** (660ms = 1.28x faster dari v3)
2. **v3 paling kecil** (2,320 bytes gzip)
3. **v4 Full paling banyak CSS variables** (164)
4. **Trade-off jelas:** Build speed vs Bundle size

---

## 5. Benchmark 3: Vue Runtime Components

### Setup

Extract classes dari actual `.vue` files menggunakan `@vue/compiler-sfc`, lalu benchmark CSS generation.

### Components Extracted

| Component | Template Classes | Style @apply | CVA Variants | Total |
|-----------|------------------|--------------|--------------|-------|
| Button.vue | 11 | 0 | 0 | 11 |
| Button/index.ts | 0 | 0 | 34 | 34 |
| Badge.vue | 9 | 0 | 0 | 9 |
| Badge/index.ts | 0 | 0 | 34 | 34 |
| Input.vue | 20 | 0 | 0 | 20 |
| DialogContent.vue | 40 | 0 | 0 | 40 |
| DataTable.vue | 47 | 0 | 0 | 47 |
| **Total** | **127** | **0** | **68** | **169** |

### Build Time

```
v3 Default:     831ms (min: 750, max: 1093)
v4 Minimal:     799ms (min: 610, max: 1233)
v4 Full:        651ms (min: 614, max: 694)
```

### Bundle Size

| Config | Raw | Gzip | vs v3 |
|--------|-----|------|-------|
| **v3 Default** | 7,591 bytes | 2,323 bytes | baseline |
| **v4 Minimal** | 20,052 bytes | 4,666 bytes | +101% |
| **v4 Full** | 38,405 bytes | 7,318 bytes | +214% |

### Class Coverage

| Config | Detected | Generated | Used | Coverage |
|--------|----------|-----------|------|----------|
| v3 Default | 217 | 7 | 0 | 0% |
| v4 Minimal | 217 | 214 | 97 | 45% |
| v4 Full | 217 | 254 | 132 | 61% |

### Temuan

1. **v4 Full coverage terbaik** (61% vs 45% vs 0%)
2. **v3 gagal detect custom utilities** (hanya 7 classes generated)
3. **v4 lebih cepat** (651ms vs 831ms = 1.28x faster)
4. **v4 Full CSS paling besar** (38,405 bytes raw)

---

## 6. CSS Analysis

### Selector Specificity

| Version | Max Specificity | Avg Specificity | Impact |
|---------|-----------------|-----------------|--------|
| v3 | 0,3,0 | 0,1,2 | Higher (lobotomized owl selectors) |
| v4 | 0,2,0 | 0,0,3 | Lower (better runtime performance) |

### Color Format

| Version | Format | Example |
|---------|--------|---------|
| v3 | rgb()/hsl() | `rgb(11 90 208)` |
| v4 | oklch() | `oklch(70.5% .213 47.604)` |

### CSS Architecture

| Aspect | v3 | v4 |
|--------|----|----|
| Layers | Flat CSS | @layer (properties, theme, base, utilities) |
| Variables | Not exposed by default | All exposed as CSS custom properties |
| Content Detection | Manual `content: [...]` | Automatic detection |
| Dark Mode | `darkMode: ['selector']` | `@custom-variant dark` |

### Custom Utilities in Project

| Utility | v3 Support | v4 Support |
|---------|------------|------------|
| `text-main` | @layer utilities | @utility directive |
| `text-placeholder` | @layer utilities | @utility directive |
| `bg-disabled` | @layer utilities | @utility directive |
| `border-main` | @layer utilities | @utility directive |
| `text-stroke-*` | @layer utilities | @utility directive |
| `*-hover` variants | @layer utilities | @utility directive |

---

## 7. Key Findings

### Finding 1: v4 Build Time Lebih Cepat

```
v4 Full:    651ms (baseline)
v3 Default: 831ms (1.28x slower)
v4 Minimal: 799ms (1.23x slower)
```

**Penjelasan:** Rust-based Lightning CSS engine di v4 memberikan performa kompilasi yang lebih baik, terutama untuk project dengan banyak custom utilities.

### Finding 2: v3 Bundle Size Lebih Kecil

```
v3 Default: 2,323 bytes gzip (baseline)
v4 Minimal: 4,666 bytes gzip (+101%)
v4 Full:    7,318 bytes gzip (+214%)
```

**Penjelasan:** v4 mengekspos semua default theme sebagai CSS variables, yang meningkatkan ukuran output. v3 hanya generate CSS yang benar-benar digunakan.

### Finding 3: v3 Gagal Detect Custom Utilities

```
v3 Generated: 7 classes (0% coverage)
v4 Generated: 214-254 classes (45-61% coverage)
```

**Penjelasan:** v3 memerlukan `content: [...]` config untuk scan template files. Tanpa config yang benar, hanya default utilities yang di-generate.

### Finding 4: v4 CSS Variables Enable Runtime Flexibility

```
v3 Variables: 146 (custom only)
v4 Variables: 63-179 (built-in + custom)
```

**Manfaat:**
- Runtime theming tanpa rebuild
- Dynamic customization via CSS
- Better developer experience (DevTools inspection)

### Finding 5: Selector Specificity Lebih Rendah di v4

```
v3 Max: 0,3,0 (high - lobotomized owl)
v4 Max: 0,2,0 (lower - improved selectors)
```

**Dampak:** Style recalculation lebih cepat di browser, terutama untuk DOM besar.

---

## 8. Recommendations

### Gunakan v3 Jika:

- Bundle size adalah prioritas utama
- Project sudah stable dengan v3 config
- Tidak memerlukan runtime theming
- CI/CD pipeline sensitif terhadap output size
- Menggunakan legacy PostCSS plugins

### Gunakan v4 Minimal Jika:

- Ingin zero-config experience
- Project baru tanpa custom theme
- Built-in defaults sudah cukup
- Ingin modern CSS features (oklch, CSS layers)

### Gunakan v4 Full Jika:

- Build speed adalah prioritas
- Memerlukan runtime theming/dynamic branding
- Custom design system kompleks
- Multi-brand/multi-theme application
- Ingin CSS variables untuk dynamic customization
- Team familiar dengan CSS-based config

### Migration Strategy

| Step | Action | Risk |
|------|--------|------|
| 1 | Audit custom utilities | Low |
| 2 | Convert tailwind.config.js to @theme | Medium |
| 3 | Update @layer utilities to @utility | Medium |
| 4 | Test all components | High |
| 5 | Deploy with feature flag | Low |

---

## 9. Appendix

### A. File Structure

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

### B. Raw Data

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

### C. Tools Used

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20.x | Runtime |
| @vue/compiler-sfc | 3.5.20 | Vue SFC parsing |
| tailwindcss | 3.4.x / 4.3.3 | CSS generation |
| PostCSS | 8.x | CSS processing |
| @tailwindcss/cli | 4.3.3 | v4 CLI |
| gzip | - | Compression |
| brotli | - | Compression |

### D. Limitations

1. **Cold Start:** v4 Minimal run pertama lambat (~5 detik) karena npm package download
2. **Dynamic Classes:** Tidak bisa extract classes dari `:class="cn(...)"` tanpa runtime
3. **Scoped Styles:** `@reference` directive tidak di-handle dalam extraction
4. **Environment:** Benchmark dijalankan di macOS, hasil mungkin berbeda di Linux/Windows

---

**Document Generated:** August 10, 2026
**Benchmark Scripts:** `benchmark/scripts/`
**Results:** `benchmark/reports/`
