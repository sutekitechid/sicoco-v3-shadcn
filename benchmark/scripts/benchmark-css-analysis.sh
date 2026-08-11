#!/bin/bash
set -e

VERSION=${1:-"unknown"}
RESULTS_DIR="/app/reports"
RESULTS_FILE="$RESULTS_DIR/css-analysis-$VERSION.json"

mkdir -p "$RESULTS_DIR"

echo "=== CSS Analysis Benchmark (Tailwind v$VERSION) ==="

# Install css-stats dependencies
npm list postcss-selector-parser || npm install postcss-selector-parser postcss

# Create CSS analysis script
cat > /tmp/css-analysis.mjs << 'EOF'
import fs from 'node:fs';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

const cssFile = process.argv[2];
const version = process.argv[3];

const css = fs.readFileSync(cssFile, 'utf-8');
const root = postcss.parse(css);

// 1. Selector Specificity Analysis
const specificityScores = [];
root.walkRules(rule => {
  try {
    const parsed = selectorParser().astSync(rule.selector);
    parsed.walkSelectors(sel => {
      let a = 0, b = 0, c = 0;
      sel.walkIds(() => a++);
      sel.walkClasses(() => b++);
      sel.walkAttributes(() => b++);
      sel.walkTags(() => c++);
      specificityScores.push({ a, b, c, score: a * 100 + b * 10 + c });
    });
  } catch (e) {
    // Skip invalid selectors
  }
});

const maxSpecificity = specificityScores.reduce((max, s) =>
  s.score > max.score ? s : max, { a: 0, b: 0, c: 0, score: 0 });

const avgScore = specificityScores.reduce((sum, s) => sum + s.score, 0) / specificityScores.length;
const p95Score = specificityScores.sort((a, b) => a.score - b.score)[
  Math.floor(specificityScores.length * 0.95)
];

// 2. CSS Variable Count
const variables = new Set();
root.walkDecls(decl => {
  if (decl.prop.startsWith('--')) {
    variables.add(decl.prop);
  }
});

// Categorize variables
const themeVars = [...variables].filter(v => v.startsWith('--color-') || v.startsWith('--breakpoint-'));
const customVars = [...variables].filter(v => !v.startsWith('--color-') && !v.startsWith('--breakpoint-'));

// 3. Unused CSS Detection (simplified)
const totalRules = root.nodes.filter(n => n.type === 'rule').length;

// Get all class selectors
const allClasses = new Set();
root.walkRules(rule => {
  try {
    const parsed = selectorParser().astSync(rule.selector);
    parsed.walkClasses(cls => allClasses.add(cls.value));
  } catch (e) {
    // Skip
  }
});

// Load HTML to check usage
const htmlFile = process.argv[4];
let html = '';
if (htmlFile && fs.existsSync(htmlFile)) {
  html = fs.readFileSync(htmlFile, 'utf-8');
}

const usedClasses = new Set();
allClasses.forEach(cls => {
  if (html.includes(cls)) {
    usedClasses.add(cls);
  }
});

const unusedClasses = [...allClasses].filter(cls => !usedClasses.has(cls));

const result = {
  version,
  cssFile: cssFile,
  totalRules,
  specificity: {
    max: { a: maxSpecificity.a, b: maxSpecificity.b, c: maxSpecificity.c },
    average: Math.round(avgScore * 100) / 100,
    p95: p95Score ? p95Score.score : 0,
    totalSelectors: specificityScores.length
  },
  variables: {
    total: variables.size,
    theme: themeVars.length,
    custom: customVars.length
  },
  unused: {
    totalClasses: allClasses.size,
    usedClasses: usedClasses.size,
    unusedClasses: unusedClasses.length,
    percentage: Math.round((unusedClasses.length / allClasses.size) * 100),
    wastedBytes: unusedClasses.join(' ').length
  }
};

console.log(JSON.stringify(result, null, 2));
EOF

# Find CSS file
CSS_FILE=$(find dist -name "*.css" -type f | head -1)

node /tmp/css-analysis.mjs "$CSS_FILE" "$VERSION" "/app/shared/test-templates/small.html" > "$RESULTS_FILE"

echo "Results saved to $RESULTS_FILE"
