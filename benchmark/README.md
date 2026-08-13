# Tailwind CSS v3 vs v4 Benchmark Suite

Benchmark untuk membandingkan performa Tailwind CSS v3 dan v4 menggunakan Docker containerized environment.

## Metrik yang Diukur

| # | Kategori | Metrik | Tool |
|---|----------|--------|------|
| 1 | Build-Time | Cold Build Time | hyperfine |
| 2 | Build-Time | HMR/Incremental Rebuild | Custom Node script |
| 3 | Bundle Size | Raw CSS Size | wc -c |
| 4 | Bundle Size | Gzip Size | gzip |
| 5 | Bundle Size | Brotli Size | brotli |
| 6 | Runtime | Style Recalculation Time | Puppeteer CDP |
| 7 | CSS Analysis | Selector Specificity Distribution | postcss-selector-parser |
| 8 | CSS Analysis | CSS Variable Count | Custom parser |
| 9 | CSS Analysis | Unused CSS Detection | Custom analyzer |

## Cara Menjalankan

### Prerequisites
- Docker dan Docker Compose terinstall
- Node.js 20+ (untuk local development)

### Menjalankan Semua Benchmark

```bash
cd benchmark
docker-compose up --build
```

### Menjalankan Benchmark Tertentu

```bash
# Hanya v3
docker-compose run tailwind-v3

# Hanya v4
docker-compose run tailwind-v4

# Semua versi
docker-compose run benchmark-runner
```

### Melihat Hasil

Hasil benchmark tersimpan di folder `reports/` dalam format JSON:

- `build-benchmark-{version}.json` - Hasil cold build
- `hmr-benchmark-{version}.json` - Hasil HMR rebuild
- `size-benchmark-{version}.json` - Ukuran CSS bundle
- `runtime-benchmark-{version}.json` - Performa runtime
- `css-analysis-{version}.json` - Analisis CSS (specificity, variables, unused)

## Struktur Folder

```
benchmark/
├── docker/
│   ├── Dockerfile.v3           # Environment Tailwind v3
│   ├── Dockerfile.v4           # Environment Tailwind v4
│   └── docker-compose.yml      # Orchestration
├── shared/
│   ├── tailwind-v3.config.js   # Config untuk v3
│   ├── tailwind-v3.css         # CSS input untuk v3
│   ├── tailwind-v4.css         # CSS input untuk v4
│   └── test-templates/         # HTML templates untuk testing
├── scripts/
│   ├── benchmark-build.sh      # Cold build benchmark
│   ├── benchmark-hmr.sh        # HMR benchmark
│   ├── benchmark-size.sh       # Bundle size benchmark
│   ├── benchmark-runtime.sh    # Runtime performance benchmark
│   ├── benchmark-css-analysis.sh # CSS analysis benchmark
│   └── run-all.sh              # Main orchestrator
└── reports/                    # Output benchmark results
```

## Customization

### Menambah Utilities yang Di-Test

Edit file HTML di `shared/test-templates/` untuk menambahkan kombinasi utilities baru.

### Mengubah Parameter Benchmark

Edit script di `scripts/` untuk mengubah:
- Jumlah runs (hyperfine)
- Ukuran test templates
- Threshold untuk performance assertions

## Troubleshooting

### Docker Build Gagal
```bash
docker-compose down
docker-compose up --build --force-recreate
```

### Hasil Benchmark Tidak Konsisten
- Pastikan tidak ada aplikasi lain yang menggunakan CPU/Memory
- Jalankan benchmark beberapa kali untuk mendapatkan rata-rata
- Gunakan `--warmup` flag pada hyperfine
