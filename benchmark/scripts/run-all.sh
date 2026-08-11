#!/bin/bash
set -e

VERSION=${1:-"all"}
RESULTS_DIR="/app/reports"

mkdir -p "$RESULTS_DIR"

echo "=========================================="
echo "  Tailwind CSS v3 vs v4 Benchmark Suite"
echo "=========================================="
echo ""

if [ "$VERSION" = "all" ]; then
  echo "Running benchmarks for both versions..."
  echo ""

  # Run all benchmarks for v3
  echo "--- Tailwind v3 ---"
  bash /app/scripts/benchmark-build.sh 3
  bash /app/scripts/benchmark-hmr.sh 3
  bash /app/scripts/benchmark-size.sh 3
  bash /app/scripts/benchmark-runtime.sh 3
  bash /app/scripts/benchmark-css-analysis.sh 3

  echo ""

  # Run all benchmarks for v4
  echo "--- Tailwind v4 ---"
  bash /app/scripts/benchmark-build.sh 4
  bash /app/scripts/benchmark-hmr.sh 4
  bash /app/scripts/benchmark-size.sh 4
  bash /app/scripts/benchmark-runtime.sh 4
  bash /app/scripts/benchmark-css-analysis.sh 4

  echo ""
  echo "All benchmarks complete. Results in $RESULTS_DIR/"
else
  echo "Running benchmarks for Tailwind v$VERSION..."
  echo ""

  bash /app/scripts/benchmark-build.sh "$VERSION"
  bash /app/scripts/benchmark-hmr.sh "$VERSION"
  bash /app/scripts/benchmark-size.sh "$VERSION"
  bash /app/scripts/benchmark-runtime.sh "$VERSION"
  bash /app/scripts/benchmark-css-analysis.sh "$VERSION"

  echo ""
  echo "Benchmarks complete for v$VERSION. Results in $RESULTS_DIR/"
fi
