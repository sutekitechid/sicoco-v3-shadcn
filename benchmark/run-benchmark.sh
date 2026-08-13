#!/bin/bash
set -e

echo "=========================================="
echo "  Tailwind CSS v3 vs v4 Benchmark"
echo "=========================================="
echo ""

# Create reports directory
mkdir -p reports

# Function to measure time in milliseconds
measure_time() {
  local start=$(python3 -c 'import time; print(time.time() * 1000)')
  eval "$1"
  local end=$(python3 -c 'import time; print(time.time() * 1000)')
  echo $((end - start))
}

# Function to run benchmark for a specific version
run_benchmark() {
  local version=$1
  local input_file=$2
  local output_dir="reports"

  echo "--- Tailwind v$version ---"

  # Clean previous build
  rm -rf "/tmp/tw-bench-$version"
  mkdir -p "/tmp/tw-bench-$version"

  # Copy input file
  cp "$input_file" "/tmp/tw-bench-$version/input.css"

  # Cold build benchmark (5 runs)
  echo "Running cold build benchmark (5 runs)..."
  local times=()
  for i in {1..5}; do
    rm -rf "/tmp/tw-bench-$version/output.css"
    local time_ms=$(measure_time "cd /tmp/tw-bench-$version && npx tailwindcss -i input.css -o output.css --minify 2>/dev/null")
    times+=($time_ms)
    echo "  Run $i: ${time_ms}ms"
  done

  # Calculate average
  local total=0
  for t in "${times[@]}"; do
    total=$((total + t))
  done
  local avg=$((total / ${#times[@]}))

  # Find min and max
  local min=${times[0]}
  local max=${times[0]}
  for t in "${times[@]}"; do
    if [ $t -lt $min ]; then min=$t; fi
    if [ $t -gt $max ]; then max=$t; fi
  done

  echo ""
  echo "Build Time Results (v$version):"
  echo "  Average: ${avg}ms"
  echo "  Min: ${min}ms"
  echo "  Max: ${max}ms"
  echo ""

  # Measure bundle size
  if [ -f "/tmp/tw-bench-$version/output.css" ]; then
    local raw_size=$(wc -c < "/tmp/tw-bench-$version/output.css")
    local gzip_size=$(gzip -c "/tmp/tw-bench-$version/output.css" | wc -c)
    local brotli_size=$(brotli -c "/tmp/tw-bench-$version/output.css" | wc -c)

    echo "Bundle Size (v$version):"
    echo "  Raw: ${raw_size} bytes"
    echo "  Gzip: ${gzip_size} bytes"
    echo "  Brotli: ${brotli_size} bytes"
    echo ""

    # Save results to JSON
    cat > "$output_dir/benchmark-$version.json" << EOF
{
  "version": "$version",
  "buildTime": {
    "average": $avg,
    "min": $min,
    "max": $max,
    "runs": [$(IFS=,; echo "${times[*]}")]
  },
  "bundleSize": {
    "raw": $raw_size,
    "gzip": $gzip_size,
    "brotli": $brotli_size
  }
}
EOF
  else
    echo "Error: Build failed for v$version"
  fi

  echo "=========================================="
  echo ""
}

# Check if npx is available
command -v npx >/dev/null 2>&1 || {
  echo "npx is required but not found. Please install Node.js."
  exit 1
}

# Install tailwindcss globally for benchmarking
echo "Setting up benchmark environment..."
npm install -g tailwindcss@3 tailwindcss@4 2>/dev/null || true

# Run benchmarks
run_benchmark 3 "shared/tailwind-v3.css"
run_benchmark 4 "shared/tailwind-v4.css"

echo ""
echo "=========================================="
echo "  Benchmark Complete!"
echo "=========================================="
echo ""
echo "Results saved to reports/ directory:"
ls -la reports/
echo ""
echo "To view results:"
cat reports/benchmark-3.json
echo ""
cat reports/benchmark-4.json
