import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import path from 'node:path';

const RESULTS_DIR = './reports';
const SHARED_DIR = './shared';

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

console.log('==========================================');
console.log('  Tailwind CSS v3 vs v4 Benchmark');
console.log('==========================================\n');

// Benchmark function for Tailwind v3
function benchmarkTailwindV3() {
  console.log('--- Tailwind v3 Benchmark ---');

  const times = [];
  const iterations = 5;

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();

    try {
      // Use npx to run tailwindcss v3
      execSync('npx tailwindcss@3 -i ./shared/tailwind-v3.css -o ./reports/output-v3.css --minify', {
        stdio: 'pipe',
        timeout: 30000
      });
    } catch (error) {
      console.error(`  Run ${i + 1} failed:`, error.message);
      continue;
    }

    const end = performance.now();
    const duration = end - start;
    times.push(duration);
    console.log(`  Run ${i + 1}: ${duration.toFixed(2)}ms`);
  }

  return times;
}

// Benchmark function for Tailwind v4
function benchmarkTailwindV4() {
  console.log('--- Tailwind v4 Benchmark ---');

  const times = [];
  const iterations = 5;

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();

    try {
      // Use npx to run @tailwindcss/cli for v4
      execSync('npx @tailwindcss/cli -i ./shared/tailwind-v4.css -o ./reports/output-v4.css --minify', {
        stdio: 'pipe',
        timeout: 30000
      });
    } catch (error) {
      console.error(`  Run ${i + 1} failed:`, error.message);
      continue;
    }

    const end = performance.now();
    const duration = end - start;
    times.push(duration);
    console.log(`  Run ${i + 1}: ${duration.toFixed(2)}ms`);
  }

  return times;
}

// Analyze CSS output
function analyzeCSS(filePath, version) {
  console.log(`\n--- CSS Analysis (v${version}) ---`);

  if (!fs.existsSync(filePath)) {
    console.log('  CSS file not found');
    return null;
  }

  const css = fs.readFileSync(filePath, 'utf-8');

  // Basic size analysis
  const rawSize = Buffer.byteLength(css, 'utf-8');

  // Count CSS rules
  const ruleMatches = css.match(/\{[^}]*\}/g) || [];
  const totalRules = ruleMatches.length;

  // Count CSS variables
  const variableMatches = css.match(/--[\w-]+/g) || [];
  const uniqueVariables = new Set(variableMatches);

  // Count selectors (approximate)
  const selectorMatches = css.match(/[\.\#\:\[][\w\-\.\:\[\]]+/g) || [];
  const uniqueSelectors = new Set(selectorMatches);

  const results = {
    version,
    size: {
      raw: rawSize,
      gzip: 0,
      brotli: 0
    },
    rules: totalRules,
    variables: uniqueVariables.size,
    selectors: uniqueSelectors.size
  };

  // Measure compressed sizes
  try {
    const gzipOutput = execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf-8' });
    results.size.gzip = parseInt(gzipOutput.trim());
  } catch (e) {}

  try {
    const brotliOutput = execSync(`brotli -c "${filePath}" | wc -c`, { encoding: 'utf-8' });
    results.size.brotli = parseInt(brotliOutput.trim());
  } catch (e) {}

  console.log(`  Raw Size: ${results.size.raw} bytes`);
  console.log(`  Gzip Size: ${results.size.gzip} bytes`);
  console.log(`  Brotli Size: ${results.size.brotli} bytes`);
  console.log(`  CSS Rules: ${results.rules}`);
  console.log(`  CSS Variables: ${results.variables}`);
  console.log(`  Unique Selectors: ${results.selectors}`);

  return results;
}

// Main benchmark execution
async function runBenchmark() {
  const results = {
    timestamp: new Date().toISOString(),
    v3: {},
    v4: {}
  };

  // Run v3 benchmark
  const v3Times = benchmarkTailwindV3();
  if (v3Times.length > 0) {
    const avg = v3Times.reduce((a, b) => a + b, 0) / v3Times.length;
    results.v3.buildTime = {
      average: Math.round(avg),
      min: Math.round(Math.min(...v3Times)),
      max: Math.round(Math.max(...v3Times)),
      runs: v3Times.map(t => Math.round(t))
    };
  }

  // Run v4 benchmark
  const v4Times = benchmarkTailwindV4();
  if (v4Times.length > 0) {
    const avg = v4Times.reduce((a, b) => a + b, 0) / v4Times.length;
    results.v4.buildTime = {
      average: Math.round(avg),
      min: Math.round(Math.min(...v4Times)),
      max: Math.round(Math.max(...v4Times)),
      runs: v4Times.map(t => Math.round(t))
    };
  }

  // Analyze CSS outputs
  const v3Analysis = analyzeCSS('./reports/output-v3.css', 3);
  const v4Analysis = analyzeCSS('./reports/output-v4.css', 4);

  if (v3Analysis) results.v3.analysis = v3Analysis;
  if (v4Analysis) results.v4.analysis = v4Analysis;

  // Save results
  const resultsPath = path.join(RESULTS_DIR, 'benchmark-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  // Print summary
  console.log('\n==========================================');
  console.log('  Benchmark Summary');
  console.log('==========================================\n');

  if (results.v3.buildTime && results.v4.buildTime) {
    const v3Avg = results.v3.buildTime.average;
    const v4Avg = results.v4.buildTime.average;
    const speedup = v3Avg / v4Avg;

    console.log('Build Time:');
    console.log(`  v3: ${v3Avg}ms`);
    console.log(`  v4: ${v4Avg}ms`);
    console.log(`  Speedup: ${speedup.toFixed(2)}x faster\n`);
  }

  if (results.v3.analysis && results.v4.analysis) {
    console.log('Bundle Size:');
    console.log(`  v3: ${results.v3.analysis.size.raw} bytes (raw), ${results.v3.analysis.size.gzip} bytes (gzip)`);
    console.log(`  v4: ${results.v4.analysis.size.raw} bytes (raw), ${results.v4.analysis.size.gzip} bytes (gzip)`);
    console.log(`  Reduction: ${((1 - results.v4.analysis.size.raw / results.v3.analysis.size.raw) * 100).toFixed(1)}%\n`);

    console.log('CSS Variables:');
    console.log(`  v3: ${results.v3.analysis.variables}`);
    console.log(`  v4: ${results.v4.analysis.variables}\n`);
  }

  console.log(`Results saved to: ${resultsPath}`);
}

// Run the benchmark
runBenchmark().catch(console.error);
