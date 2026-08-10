#!/bin/bash
set -e

VERSION=${1:-"unknown"}
RESULTS_DIR="/app/reports"
RESULTS_FILE="$RESULTS_DIR/build-benchmark-$VERSION.json"

mkdir -p "$RESULTS_DIR"

echo "=== Cold Build Benchmark (Tailwind v$VERSION) ==="

# Clear any caches
rm -rf node_modules/.cache
rm -rf dist

# Create dist directory
mkdir -p dist

# Run build benchmark with hyperfine
hyperfine \
  --warmup 2 \
  --runs 10 \
  --export-json "$RESULTS_FILE" \
  'npm run build 2>/dev/null' \
  --command-name "Tailwind v$VERSION build"

echo "Results saved to $RESULTS_FILE"
