#!/bin/bash
set -e

VERSION=${1:-"unknown"}
RESULTS_DIR="/app/reports"
RESULTS_FILE="$RESULTS_DIR/runtime-benchmark-$VERSION.json"

mkdir -p "$RESULTS_DIR"

echo "=== Runtime Performance Benchmark (Tailwind v$VERSION) ==="

# Install puppeteer if not present
npm list puppeteer || npm install puppeteer

# Create runtime test script
cat > /tmp/runtime-test.mjs << 'EOF'
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();

// Load the test page
await page.goto('file:///app/shared/test-templates/small.html', {
  waitUntil: 'networkidle0'
});

// Get performance metrics
const metrics = await page.evaluate(() => {
  const performance = window.performance;
  const entries = performance.getEntriesByType('navigation');

  // Get style recalculation time
  const styleRecalcEntries = performance.getEntriesByType('measure')
    .filter(e => e.name.includes('Style') || e.name.includes('style'));

  return {
    navigation: entries[0] || {},
    styleRecalc: styleRecalcEntries,
    memory: performance.memory || {}
  };
});

// Measure style recalculation by forcing reflow
const styleRecalcTime = await page.evaluate(() => {
  const start = performance.now();

  // Force style recalculation
  document.querySelectorAll('*').forEach(el => {
    el.style.display = 'none';
    el.offsetHeight; // Trigger reflow
    el.style.display = '';
  });

  const end = performance.now();
  return end - start;
});

const result = {
  version: process.argv[2],
  styleRecalculationTime: styleRecalcTime,
  metrics: metrics
};

console.log(JSON.stringify(result, null, 2));

await browser.close();
EOF

node /tmp/runtime-test.mjs "$VERSION" > "$RESULTS_FILE"

echo "Results saved to $RESULTS_FILE"
