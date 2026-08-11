#!/bin/bash
set -e

echo "=========================================="
echo "  Tailwind CSS v3 vs v4 Local Benchmark"
echo "=========================================="
echo ""

# Check if required tools are installed
command -v hyperfine >/dev/null 2>&1 || {
  echo "hyperfine is required but not installed. Install with:"
  echo "brew install hyperfine"
  exit 1
}

# Create reports directory
mkdir -p reports

# Function to run benchmark for a specific version
run_benchmark() {
  local version=$1
  local css_file=$2
  local config_file=$3

  echo "--- Tailwind v$version ---"

  # Create temp directory for this version
  local temp_dir=$(mktemp -d)
  cp "$css_file" "$temp_dir/input.css"
  cp "$config_file" "$temp_dir/" 2>/dev/null || true

  # Cold build benchmark
  echo "Running cold build benchmark..."
  hyperfine \
    --warmup 2 \
    --runs 10 \
    --export-json "reports/build-benchmark-$version.json" \
    "tailwindcss -i $temp_dir/input.css -o $temp_dir/output.css --minify 2>/dev/null" \
    --command-name "Tailwind v$version build"

  # Measure bundle size
  echo "Measuring bundle size..."
  RAW_SIZE=$(wc -c < "$temp_dir/output.css")
  GZIP_SIZE=$(gzip -c "$temp_dir/output.css" | wc -c)
  BROTLI_SIZE=$(brotli -c "$temp_dir/output.css" | wc -c)

  cat > "reports/size-benchmark-$version.json" << EOF
{
  "version": "$version",
  "raw": $RAW_SIZE,
  "gzip": $GZIP_SIZE,
  "brotli": $BROTLI_SIZE
}
EOF

  echo "Results for v$version:"
  echo "  Raw: $RAW_SIZE bytes"
  echo "  Gzip: $GZIP_SIZE bytes"
  echo "  Brotli: $BROTLI_SIZE bytes"
  echo ""

  # Cleanup
  rm -rf "$temp_dir"
}

# Run benchmarks
run_benchmark 3 "shared/tailwind-v3.css" "shared/tailwind-v3.config.js"
run_benchmark 4 "shared/tailwind-v4.css" "shared/tailwind-v4.css"

echo ""
echo "=========================================="
echo "  Benchmark Complete!"
echo "=========================================="
echo ""
echo "Results saved to reports/ directory:"
ls -la reports/
