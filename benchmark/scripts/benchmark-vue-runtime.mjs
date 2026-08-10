import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import path from 'node:path';

const RESULTS_DIR = './reports';

if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

console.log('==========================================');
console.log('  Vue Runtime Component Benchmark');
console.log('==========================================\n');

function benchmarkCommand(name, command) {
  console.log(`--- ${name} ---`);
  const times = [];
  const iterations = 5;

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    try {
      execSync(command, { stdio: 'pipe', timeout: 60000 });
    } catch (error) {
      console.error(`  Run ${i + 1} failed:`, error.message.slice(0, 100));
      continue;
    }
    const end = performance.now();
    const duration = end - start;
    times.push(duration);
    console.log(`  Run ${i + 1}: ${duration.toFixed(0)}ms`);
  }

  if (times.length > 0) {
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`  Average: ${avg.toFixed(0)}ms\n`);
    return {
      average: Math.round(avg),
      min: Math.round(Math.min(...times)),
      max: Math.round(Math.max(...times)),
      runs: times.map(t => Math.round(t))
    };
  }
  return null;
}

function analyzeCSS(filePath, htmlFile) {
  if (!fs.existsSync(filePath)) return null;

  const css = fs.readFileSync(filePath, 'utf-8');
  const rawSize = Buffer.byteLength(css, 'utf-8');

  const variableMatches = css.match(/--[\w-]+/g) || [];
  const uniqueVariables = new Set(variableMatches);

  const selectorMatches = css.match(/[\.\#\:\[][\w\-\.\:\[\]]+/g) || [];
  const uniqueSelectors = new Set(selectorMatches);

  let html = '';
  if (fs.existsSync(htmlFile)) {
    html = fs.readFileSync(htmlFile, 'utf-8');
  }

  const htmlClassRegex = /class="([^"]+)"/g;
  const htmlClasses = new Set();
  let match;
  while ((match = htmlClassRegex.exec(html)) !== null) {
    match[1].split(/\s+/).filter(Boolean).forEach(cls => htmlClasses.add(cls));
  }

  const cssClassRegex = /\.([\w-]+)/g;
  const cssClasses = new Set();
  while ((match = cssClassRegex.exec(css)) !== null) {
    cssClasses.add(match[1]);
  }

  const usedClasses = new Set();
  const unusedClasses = new Set();

  htmlClasses.forEach(cls => {
    if (cssClasses.has(cls)) {
      usedClasses.add(cls);
    } else {
      unusedClasses.add(cls);
    }
  });

  let gzipSize = 0;
  try {
    gzipSize = parseInt(execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf-8' }).trim());
  } catch (e) {}

  return {
    raw: rawSize,
    gzip: gzipSize,
    variables: uniqueVariables.size,
    selectors: uniqueSelectors.size,
    classes: {
      htmlTotal: htmlClasses.size,
      cssGenerated: cssClasses.size,
      used: usedClasses.size,
      unused: unusedClasses.size,
      percentage: htmlClasses.size > 0 ? Math.round((usedClasses.size / htmlClasses.size) * 100) : 0
    }
  };
}

const results = { timestamp: new Date().toISOString() };

results.v3 = {
  buildTime: benchmarkCommand(
    'v3 Default (PostCSS)',
    'npx tailwindcss@3 -c ./shared/tailwind-v3.config.js -i ./shared/tailwind-v3.css -o ./reports/realworld-v3.css --minify'
  ),
  analysis: analyzeCSS('./reports/realworld-v3.css', './shared/realworld-components.html')
};

results.v4Minimal = {
  buildTime: benchmarkCommand(
    'v4 Minimal (@import "tailwindcss")',
    'npx @tailwindcss/cli@4 -i ./shared/tailwind-v4-minimal.css -o ./reports/realworld-v4-minimal.css --minify'
  ),
  analysis: analyzeCSS('./reports/realworld-v4-minimal.css', './shared/realworld-components.html')
};

results.v4Full = {
  buildTime: benchmarkCommand(
    'v4 Full (custom @theme)',
    'npx @tailwindcss/cli@4 -i ./shared/tailwind-v4.css -o ./reports/realworld-v4-full.css --minify'
  ),
  analysis: analyzeCSS('./reports/realworld-v4-full.css', './shared/realworld-components.html')
};

fs.writeFileSync(path.join(RESULTS_DIR, 'benchmark-vue-runtime.json'), JSON.stringify(results, null, 2));

console.log('==========================================');
console.log('  Vue Runtime Benchmark Summary');
console.log('==========================================\n');

const fmt = (obj) => obj ? `${obj.average}ms (min: ${obj.min}, max: ${obj.max})` : 'N/A';
const fmtSize = (obj) => obj ? `${obj.raw} raw / ${obj.gzip} gzip bytes` : 'N/A';

console.log('BUILD TIME:');
console.log(`  v3 Default:     ${fmt(results.v3.buildTime)}`);
console.log(`  v4 Minimal:     ${fmt(results.v4Minimal.buildTime)}`);
console.log(`  v4 Full:        ${fmt(results.v4Full.buildTime)}`);
console.log('');

console.log('BUNDLE SIZE:');
console.log(`  v3 Default:     ${fmtSize(results.v3.analysis)}`);
console.log(`  v4 Minimal:     ${fmtSize(results.v4Minimal.analysis)}`);
console.log(`  v4 Full:        ${fmtSize(results.v4Full.analysis)}`);
console.log('');

console.log('CSS VARIABLES:');
console.log(`  v3 Default:     ${results.v3.analysis ? results.v3.analysis.variables : 'N/A'}`);
console.log(`  v4 Minimal:     ${results.v4Minimal.analysis ? results.v4Minimal.analysis.variables : 'N/A'}`);
console.log(`  v4 Full:        ${results.v4Full.analysis ? results.v4Full.analysis.variables : 'N/A'}`);
console.log('');

console.log('CLASS COVERAGE (from Vue templates):');
console.log(`  v3 Default:     ${results.v3.analysis ? results.v3.analysis.classes.htmlTotal + ' detected, ' + results.v3.analysis.classes.used + ' used (' + results.v3.analysis.classes.percentage + '%)' : 'N/A'}`);
console.log(`  v4 Minimal:     ${results.v4Minimal.analysis ? results.v4Minimal.analysis.classes.htmlTotal + ' detected, ' + results.v4Minimal.analysis.classes.used + ' used (' + results.v4Minimal.analysis.classes.percentage + '%)' : 'N/A'}`);
console.log(`  v4 Full:        ${results.v4Full.analysis ? results.v4Full.analysis.classes.htmlTotal + ' detected, ' + results.v4Full.analysis.classes.used + ' used (' + results.v4Full.analysis.classes.percentage + '%)' : 'N/A'}`);
console.log('');

if (results.v3.buildTime && results.v4Minimal.buildTime) {
  const ratio = results.v3.buildTime.average / results.v4Minimal.buildTime.average;
  console.log(`v4 Minimal vs v3 Default: ${ratio.toFixed(2)}x ${ratio > 1 ? 'faster' : 'slower'}`);
}
if (results.v3.buildTime && results.v4Full.buildTime) {
  const ratio = results.v3.buildTime.average / results.v4Full.buildTime.average;
  console.log(`v4 Full vs v3 Default:    ${ratio.toFixed(2)}x ${ratio > 1 ? 'faster' : 'slower'}`);
}

console.log('\nResults saved to: reports/benchmark-vue-runtime.json');
