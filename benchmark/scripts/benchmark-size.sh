#!/bin/bash
set -e

VERSION=${1:-"unknown"}
RESULTS_DIR="/app/reports"
RESULTS_FILE="$RESULTS_DIR/size-benchmark-$VERSION.json"

mkdir -p "$RESULTS_DIR"

echo "=== Bundle Size Benchmark (Tailwind v$VERSION) ==="

# Find the CSS file
CSS_FILE=$(find dist -name "*.css" -type f | head -1)

if [ -z "$CSS_FILE" ]; then
  echo "No CSS file found in dist/"
  exit 1
fi

# Measure sizes
RAW_SIZE=$(wc -c < "$CSS_FILE")
GZIP_SIZE=$(gzip -c "$CSS_FILE" | wc -c)
BROTLI_SIZE=$(brotli -c "$CSS_FILE" | wc -c)

echo "CSS File: $CSS_FILE"
echo "Raw: $RAW_SIZE bytes"
echo "Gzip: $GZIP_SIZE bytes"
echo "Brotli: $BROTLI_SIZE bytes"

# Save results
cat > "$RESULTS_FILE" << EOF
{
  "version": "$VERSION",
  "file": "$CSS_FILE",
  "raw": $RAW_SIZE,
  "gzip": $GZIP_SIZE,
  "brotli": $BROTLI_SIZE
}
EOF

echo "Results saved to $RESULTS_FILE"
