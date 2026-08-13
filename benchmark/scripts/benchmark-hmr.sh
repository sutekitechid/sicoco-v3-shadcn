#!/bin/bash
set -e

VERSION=${1:-"unknown"}
RESULTS_DIR="/app/reports"
RESULTS_FILE="$RESULTS_DIR/hmr-benchmark-$VERSION.json"

mkdir -p "$RESULTS_DIR"

echo "=== HMR Benchmark (Tailwind v$VERSION) ==="

# Start dev server in background
npm run dev &
DEV_PID=$!
sleep 3

# Create HMR test script
cat > /tmp/hmr-test.mjs << 'EOF'
import fs from 'node:fs';
import { performance } from 'node:perf_hooks';

const filePath = '/app/shared/test-templates/small.html';
const results = [];

for (let i = 0; i < 10; i++) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const start = performance.now();

  // Simulate file change
  fs.writeFileSync(filePath, content.replace('bg-primary-500', 'bg-secondary-500'));

  const end = performance.now();
  results.push(end - start);

  // Wait for HMR to process
  await new Promise(resolve => setTimeout(resolve, 500));

  // Revert change
  fs.writeFileSync(filePath, content);
  await new Promise(resolve => setTimeout(resolve, 500));
}

const avg = results.reduce((a, b) => a + b, 0) / results.length;
const min = Math.min(...results);
const max = Math.max(...results);

console.log(JSON.stringify({
  version: process.argv[2],
  avg: avg,
  min: min,
  max: max,
  runs: results
}));
EOF

node /tmp/hmr-test.mjs "$VERSION" > "$RESULTS_FILE"

# Kill dev server
kill $DEV_PID 2>/dev/null || true

echo "Results saved to $RESULTS_FILE"
