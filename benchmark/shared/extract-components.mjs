import fs from 'node:fs';
import { parse } from '@vue/compiler-sfc';
import path from 'node:path';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '../../');
const BENCHMARK_DIR = path.resolve(import.meta.dirname, '../');

// Components to extract
const VUE_FILES = [
  'lib/components/button/Button.vue',
  'lib/components/button/index.ts',
  'lib/components/badge/Badge.vue',
  'lib/components/badge/index.ts',
  'lib/components/input/Input.vue',
  'lib/components/dialog/DialogContent.vue',
  'lib/components/datatablev2/DataTable.vue',
];

function extractClassesFromHTML(html) {
  const classes = new Set();
  const classRegex = /class="([^"]+)"/g;
  const dynamicClassRegex = /:class="([^"]+)"/g;

  let match;
  while ((match = classRegex.exec(html)) !== null) {
    match[1].split(/\s+/).filter(Boolean).forEach(cls => classes.add(cls));
  }
  while ((match = dynamicClassRegex.exec(html)) !== null) {
    const strRegex = /'([^']+)'/g;
    let strMatch;
    while ((strMatch = strRegex.exec(match[1])) !== null) {
      strMatch[1].split(/\s+/).filter(Boolean).forEach(cls => classes.add(cls));
    }
  }
  return classes;
}

function extractClassesFromApply(css) {
  const classes = new Set();
  const applyRegex = /@apply\s+([^;]+);/g;

  let match;
  while ((match = applyRegex.exec(css)) !== null) {
    match[1].split(/\s+/).filter(Boolean).forEach(cls => classes.add(cls));
  }
  return classes;
}

function extractCVAVariants(tsContent) {
  const classes = new Set();
  const stringRegex = /'([a-z][\w-]*(?:\s+[a-z][\w-]*)*)'/g;

  let match;
  while ((match = stringRegex.exec(tsContent)) !== null) {
    const str = match[1];
    if (/\b(flex|items|justify|gap|text|bg|border|rounded|px|py|pt|pb|pl|pr|p|m|mt|mb|ml|mr|mx|my|w|h|min|max|space|font|leading|tracking|shadow|ring|transition|duration|ease|hover|focus|active|disabled|dark|data|outline|cursor|sticky|fixed|absolute|relative|z|overflow|opacity|animate|scale|rotate|translate)\b/.test(str)) {
      str.split(/\s+/).filter(Boolean).forEach(cls => classes.add(cls));
    }
  }

  const templateRegex = /`([^`]+)`/g;
  while ((match = templateRegex.exec(tsContent)) !== null) {
    if (/\b(flex|items|justify|gap|text|bg|border|rounded|px|py)\b/.test(match[1])) {
      match[1].split(/\s+/).filter(Boolean).forEach(cls => classes.add(cls));
    }
  }

  return classes;
}

console.log('==========================================');
console.log('  Component Extraction');
console.log('==========================================\n');

const allClasses = new Set();
const componentResults = {};

for (const file of VUE_FILES) {
  const filePath = path.join(PROJECT_ROOT, file);

  if (!fs.existsSync(filePath)) {
    console.log(`  Skipping ${file} (not found)`);
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(file);

  let classes = new Set();

  if (file.endsWith('.vue')) {
    const { descriptor } = parse(content, { filename: fileName });

    if (descriptor.template) {
      const templateClasses = extractClassesFromHTML(descriptor.template.content);
      templateClasses.forEach(cls => classes.add(cls));
    }

    for (const style of descriptor.styles) {
      const styleClasses = extractClassesFromApply(style.content);
      styleClasses.forEach(cls => classes.add(cls));
    }
  } else if (file.endsWith('.ts')) {
    const variantClasses = extractCVAVariants(content);
    variantClasses.forEach(cls => classes.add(cls));
  }

  componentResults[file] = classes.size;
  classes.forEach(cls => allClasses.add(cls));

  console.log(`  ${file}: ${classes.size} classes`);
}

console.log(`\n  Total unique classes: ${allClasses.size}\n`);

const html = `<!DOCTYPE html>
<html lang="en" data-mode="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Real-World Component Benchmark (Vue Runtime)</title>
  <link rel="stylesheet" href="output.css">
</head>
<body class="bg-neutral-50 text-neutral-900 font-sans">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-heading-xl font-bold text-primary-500 mb-8">Vue Runtime Component Benchmark</h1>

    <section class="mb-12">
      <h2 class="text-title-lg font-semibold text-primary-700 mb-4">Button Components</h2>
      <div class="flex flex-wrap gap-4 mb-4">
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out text-white border border-transparent bg-primary-default hover:enabled:bg-primary-hover active:bg-primary-800 hover:enabled:border-primary-hover focus:border-primary-700 focus:shadow-primary focus-visible:border-primary-700 focus-visible:shadow-primary text-label-md rounded-sm h-9 min-w-9 px-3 active:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-hidden">Primary</button>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out bg-transparent text-primary-default border border-primary-default hover:enabled:bg-primary-subtle active:bg-primary-subtle hover:enabled:border-primary-hover focus-visible:border-primary-700 focus-visible:shadow-primary text-label-md rounded-sm h-9 min-w-9 px-3 active:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-hidden">Outlined</button>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out bg-transparent text-main border border-transparent hover:enabled:bg-primary-subtle active:bg-primary-subtle focus-visible:border-primary-700 focus-visible:shadow-primary text-label-md rounded-sm h-9 min-w-9 px-3 active:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-hidden">Tertiary</button>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out underline bg-transparent border border-transparent text-primary-default hover:enabled:text-primary-700 active:enabled:text-primary-800 focus:enabled:text-primary-800 focus-visible:enabled:text-primary-800 text-label-md rounded-sm h-9 min-w-9 px-3 active:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-hidden">Link</button>
      </div>
      <div class="flex flex-wrap gap-4 mb-4">
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out text-white border border-transparent bg-secondary-default hover:enabled:bg-secondary-hover active:bg-secondary-800 hover:enabled:border-secondary-hover focus-visible:border-secondary-700 focus-visible:shadow-secondary text-label-md rounded-sm h-9 min-w-9 px-3 active:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-hidden">Secondary</button>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out text-white border border-transparent bg-danger-default hover:enabled:bg-danger-hover active:bg-danger-800 hover:enabled:border-danger-hover focus-visible:border-danger-700 focus-visible:shadow-danger text-label-md rounded-sm h-9 min-w-9 px-3 active:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-hidden">Danger</button>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out text-white border border-transparent bg-warning-default hover:enabled:bg-warning-hover active:bg-warning-800 hover:enabled:border-warning-hover focus-visible:border-warning-700 focus-visible:shadow-warning text-label-md rounded-sm h-9 min-w-9 px-3 active:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-hidden">Warning</button>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out text-white border border-transparent bg-success-default hover:enabled:bg-success-hover active:bg-success-800 hover:enabled:border-success-hover focus-visible:border-success-700 focus-visible:shadow-success text-label-md rounded-sm h-9 min-w-9 px-3 active:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-hidden">Success</button>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out bg-neutral-50 border border-main text-main hover:enabled:bg-disabled hover:enabled:border-neutral-950 active:bg-neutral-500 focus:bg-disabled focus:border-neutral-950 focus:outline-1 focus:outline focus-visible:border-neutral-950 focus-visible:outline-1 focus-visible:outline focus:outline-neutral-950 outline-offset-0 text-label-md rounded-sm h-9 min-w-9 px-3 active:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-hidden">Neutral</button>
      </div>
      <div class="flex flex-wrap items-center gap-4 mb-4">
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out text-white border border-transparent bg-primary-default hover:enabled:bg-primary-hover active:bg-primary-800 hover:enabled:border-primary-hover focus:border-primary-700 focus:shadow-primary focus-visible:border-primary-700 focus-visible:shadow-primary text-label-md rounded-sm h-9 min-w-9 px-3 active:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-hidden">Small</button>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out text-white border border-transparent bg-primary-default hover:enabled:bg-primary-hover active:bg-primary-800 hover:enabled:border-primary-hover focus:border-primary-700 focus:shadow-primary focus-visible:border-primary-700 focus-visible:shadow-primary text-label-lg rounded-sm h-12 min-w-12 px-4 active:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-hidden">Medium</button>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out text-white border border-transparent bg-primary-default hover:enabled:bg-primary-hover active:bg-primary-800 hover:enabled:border-primary-hover focus:border-primary-700 focus:shadow-primary focus-visible:border-primary-700 focus-visible:shadow-primary text-label-lg rounded-lg h-14 min-w-14 px-6 active:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-hidden">Large</button>
      </div>
      <div class="flex flex-wrap gap-4">
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out bg-neutral-300 text-neutral-500 border-transparent shadow-none hover:bg-neutral-300 active:bg-neutral-300 cursor-not-allowed active:scale-1 text-label-md rounded-sm h-9 min-w-9 px-3 [&_svg]:shrink-0 outline-hidden" disabled>Disabled Solid</button>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out bg-transparent text-neutral-500 border-neutral-500 shadow-none hover:bg-transparent active:bg-transparent cursor-not-allowed active:scale-1 text-label-md rounded-sm h-9 min-w-9 px-3 [&_svg]:shrink-0 outline-hidden" disabled>Disabled Outlined</button>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-title-lg font-semibold text-primary-700 mb-4">Badge Components</h2>
      <div class="flex flex-wrap gap-4">
        <span class="inline-flex items-center gap-1 rounded-full bg-primary-100 text-primary-700 text-label-sm px-2.5 py-0.5">Primary</span>
        <span class="inline-flex items-center gap-1 rounded-full bg-secondary-100 text-secondary-700 text-label-sm px-2.5 py-0.5">Secondary</span>
        <span class="inline-flex items-center gap-1 rounded-full bg-warning-100 text-warning-700 text-label-sm px-2.5 py-0.5">Warning</span>
        <span class="inline-flex items-center gap-1 rounded-full bg-success-100 text-success-700 text-label-sm px-2.5 py-0.5">Success</span>
        <span class="inline-flex items-center gap-1 rounded-full bg-danger-100 text-danger-700 text-label-sm px-2.5 py-0.5">Danger</span>
        <span class="inline-flex items-center gap-1 rounded-full bg-neutral-100 text-neutral-700 text-label-sm px-2.5 py-0.5">Neutral</span>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-title-lg font-semibold text-primary-700 mb-4">Dialog Components</h2>
      <div class="relative bg-white rounded-lg shadow-1 border border-neutral-300 p-6">
        <div class="absolute inset-0 bg-neutral-950/50 dark:bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 rounded-lg"></div>
        <div class="relative fixed left-1/2 grid w-full -translate-x-1/2 overflow-hidden rounded-lg border bg-white shadow-lg duration-200 dark:bg-neutral-100 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] max-w-lg p-6">
          <div class="absolute right-4 top-4 z-10">
            <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out bg-transparent text-main border border-transparent hover:enabled:bg-primary-subtle active:bg-primary-subtle focus-visible:border-primary-700 focus-visible:shadow-primary text-label-md rounded-sm h-9 min-w-9 p-0 active:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-hidden">Close</button>
          </div>
          <div class="pt-4 pb-5">
            <h3 class="text-title-lg font-semibold text-primary-700">Dialog Title</h3>
            <p class="text-body-md text-secondary mt-2">Dialog content with animations and dark mode support.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-title-lg font-semibold text-primary-700 mb-4">DataTable Components</h2>
      <div class="flex flex-col">
        <div class="overflow-auto" style="max-height: 400px;">
          <table class="w-full text-body-sm">
            <thead class="bg-neutral-100 sticky top-0 z-40">
              <tr>
                <th class="text-center min-w-[60px] max-w-[60px] sticky left-0 z-40 px-4 py-3 text-label-md font-semibold text-primary-700 bg-neutral-100"><input type="checkbox" class="w-4 h-4 text-primary-500 border-neutral-400 rounded focus:ring-primary-500"></th>
                <th class="text-left px-4 py-3 text-label-md font-semibold text-primary-700"><div class="flex items-center justify-between gap-2"><span>Name</span><button class="text-neutral-500 hover:text-primary-700">Sort</button></div></th>
                <th class="text-left px-4 py-3 text-label-md font-semibold text-secondary-700"><div class="flex items-center justify-between gap-2"><span>Status</span></div></th>
                <th class="text-left px-4 py-3 text-label-md font-semibold text-warning-700">Role</th>
                <th class="text-left px-4 py-3 text-label-md font-semibold text-success-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-neutral-200 hover:bg-neutral-50">
                <td class="text-center min-w-[60px] max-w-[60px] sticky left-0 z-40 px-4 py-3 bg-white"><input type="checkbox" class="w-4 h-4 text-primary-500 border-neutral-400 rounded focus:ring-primary-500"></td>
                <td class="px-4 py-3 text-primary-600">John Doe</td>
                <td class="px-4 py-3"><span class="px-2 py-1 bg-success-100 text-success-700 text-label-sm rounded">Active</span></td>
                <td class="px-4 py-3 text-secondary">Admin</td>
                <td class="px-4 py-3"><button class="text-primary-600 hover:text-primary-800">Edit</button></td>
              </tr>
              <tr class="border-t border-neutral-200 hover:bg-neutral-50">
                <td class="text-center min-w-[60px] max-w-[60px] sticky left-0 z-40 px-4 py-3 bg-white"><input type="checkbox" class="w-4 h-4 text-primary-500 border-neutral-400 rounded focus:ring-primary-500"></td>
                <td class="px-4 py-3 text-primary-600">Jane Smith</td>
                <td class="px-4 py-3"><span class="px-2 py-1 bg-warning-100 text-warning-700 text-label-sm rounded">Pending</span></td>
                <td class="px-4 py-3 text-secondary">Editor</td>
                <td class="px-4 py-3"><button class="text-primary-600 hover:text-primary-800">Edit</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-body-sm text-secondary">Showing 1-2 of 2</span>
          <div class="flex gap-2">
            <button class="px-3 py-1 text-body-sm border border-neutral-400 rounded hover:bg-neutral-50">Previous</button>
            <button class="px-3 py-1 text-body-sm border border-primary-500 bg-primary-500 text-white rounded">1</button>
            <button class="px-3 py-1 text-body-sm border border-neutral-400 rounded hover:bg-neutral-50">Next</button>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-title-lg font-semibold text-primary-700 mb-4">Form Input Components</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col gap-1">
          <label class="text-label-md text-secondary">Email Address</label>
          <input type="email" placeholder="Enter your email" class="w-full px-3 py-2 border border-main rounded-sm text-body-sm text-main placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-disabled disabled:text-disabled disabled:cursor-not-allowed">
          <span class="text-caption-sm text-secondary">We'll never share your email.</span>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-label-md text-secondary">Password</label>
          <input type="password" placeholder="Enter your password" class="w-full px-3 py-2 border border-main rounded-sm text-body-sm text-main placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-disabled disabled:text-disabled disabled:cursor-not-allowed">
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-label-md text-secondary">Role</label>
          <select class="w-full px-3 py-2 border border-main rounded-sm text-body-sm text-main focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
            <option>Select a role</option>
            <option>Admin</option>
            <option>Editor</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-label-md text-secondary">Message</label>
          <textarea placeholder="Enter your message" rows="3" class="w-full px-3 py-2 border border-main rounded-sm text-body-sm text-main placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"></textarea>
        </div>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-title-lg font-semibold text-primary-700 mb-4">Dark Mode & Animations</h2>
      <div class="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-700">
        <p class="text-body-md text-main dark:text-neutral-50">This content adapts to dark mode.</p>
      </div>
      <div class="flex flex-wrap gap-4 mt-4">
        <div class="p-4 bg-primary-50 rounded-lg animate-pulse">Pulse</div>
        <div class="p-4 bg-secondary-50 rounded-lg animate-bounce">Bounce</div>
      </div>
    </section>
  </div>
</body>
</html>`;

const htmlPath = path.join(BENCHMARK_DIR, 'shared/realworld-components.html');
fs.writeFileSync(htmlPath, html);
console.log(`Generated HTML saved to: ${htmlPath}`);
console.log(`Total classes in HTML: ${allClasses.size}`);

const resultsPath = path.join(BENCHMARK_DIR, 'reports/extraction-results.json');
fs.writeFileSync(resultsPath, JSON.stringify({
  components: componentResults,
  totalClasses: allClasses.size,
  allClasses: Array.from(allClasses).sort()
}, null, 2));
console.log(`Extraction results saved to: ${resultsPath}`);
