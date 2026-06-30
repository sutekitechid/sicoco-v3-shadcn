# Dark Mode System

## Overview

Sicoco menggunakan **CSS Variable-based theming** untuk mendukung light & dark mode. Sistem ini:
- Berbasis **CSS custom properties** (bukan Tailwind `dark:` variant)
- Support **multiple themes** (default + purple) via `data-theme` attribute
- Support **light/dark mode** per theme via `data-mode` attribute
- **Tidak ada flash of unstyled content** (FOUC) saat switch mode
- **Automatic cascade** — purple theme otomatis inherit pattern light/dark dari default theme

## Table of Contents

1. [Architecture](#architecture)
2. [How It Works](#how-it-works)
3. [Color Palette: The 50/950 Inversion](#color-palette-the-50950-inversion)
4. [Triggering Dark Mode](#triggering-dark-mode)
5. [Custom Ring Variables](#custom-ring-variables)
6. [Adding a New Color](#adding-a-new-color)
7. [Creating Dark-Mode Aware Components](#creating-dark-mode-aware-components)
8. [Common Pitfalls](#common-pitfalls)
9. [Testing](#testing)
10. [Examples](#examples)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│ :root (default light mode)                          │
│   --color-primary-50: 234 237 255;                 │
│   --color-primary-500: 11 90 208;                  │
│   --color-primary-950: 0 12 42;                    │
│   --ring-primary: rgba(var(--color-primary-50) / 1)│
└─────────────────────────────────────────────────────┘
            ↓ (when [data-mode="dark"])
┌─────────────────────────────────────────────────────┐
│ :root[data-mode="dark"]                             │
│   --color-primary-50: 0 12 42;        ← INVERTED   │
│   --color-primary-500: 11 90 208;     ← SAME       │
│   --color-primary-950: 234 237 255;  ← INVERTED   │
│   --ring-primary: rgba(var(--color-primary-950) / 1)│
└─────────────────────────────────────────────────────┘
            ↓ (when [data-theme="purple"])
┌─────────────────────────────────────────────────────┐
│ :root[data-theme="purple"]                          │
│   --color-primary-50: 247 240 255;  ← PURPLE TINT  │
│   --color-primary-500: 100 0 201;                  │
│   --color-primary-950: 10 0 20;                    │
└─────────────────────────────────────────────────────┘
            ↓ (purple + dark)
┌─────────────────────────────────────────────────────┐
│ :root[data-theme="purple"][data-mode="dark"]        │
│   --color-primary-50: 10 0 20;       ← INVERTED   │
│   --color-primary-500: 100 0 201;    ← SAME       │
│   --color-primary-950: 247 240 255; ← INVERTED   │
└─────────────────────────────────────────────────────┘
```

## How It Works

### 1. CSS Variable Definition

Semua color didefinisikan sebagai CSS custom properties di:
- `lib/config/tailwind.css` — default theme light mode
- `src/assets/index.css` — dark mode override + purple theme (light & dark)

```css
/* lib/config/tailwind.css */
@layer base {
  :root {
    --color-primary-50: 234 237 255;
    --color-primary-100: 212 219 254;
    /* ... up to 950 */
    --color-primary-950: 0 12 42;
  }
}
```

### 2. Tailwind Color Mapping

CSS variables di-mapping ke Tailwind colors di `lib/config/configPreset.ts`:

```ts
colors: {
  primary: {
    50: 'rgba(var(--color-primary-50) / <alpha-value>)',
    // ... up to 950
    950: 'rgba(var(--color-primary-950) / <alpha-value>)',
  },
}
```

`<alpha-value>` adalah Tailwind placeholder yang otomatis diganti dengan opacity modifier (e.g., `bg-primary-500/40` → `rgba(... / 0.4)`).

### 3. Mode Switching

Mode di-switch dengan mengubah attribute di `<html>` element:

```ts
document.documentElement.setAttribute('data-mode', 'dark')  // dark mode
document.documentElement.setAttribute('data-mode', '')      // light mode
```

CSS kemudian apply overrides:

```css
:root[data-mode="dark"] {
  --color-primary-50: 0 12 42;  /* override light value */
}
```

## Color Palette: The 50/950 Inversion

**Key insight:** Palette di-invert antara light dan dark mode untuk shades ekstrem (50-200 dan 800-950), tapi **sama** untuk shades mid (300-700).

### Light Mode Primary

| Shade | RGB | Visual |
|---|---|---|
| 50 | `234 237 255` | Paling terang (hampir putih) |
| 100 | `212 219 254` | Sangat terang |
| 200 | `167 185 254` | Terang |
| 300 | `122 153 253` | Medium-terang |
| 400 | `53 119 253` | Medium |
| **500** | **`11 90 208`** | **Mid (sama di kedua mode)** |
| 600 | `7 72 169` | Medium |
| 700 | `4 55 133` | Gelap |
| 800 | `2 36 94` | Sangat gelap |
| 900 | `1 21 61` | Hampir hitam |
| 950 | `0 12 42` | Paling gelap (hampir hitam) |

### Dark Mode Primary

| Shade | RGB | Visual |
|---|---|---|
| 50 | `0 12 42` | **Paling gelap** (hampir hitam) ← INVERTED |
| 100 | `1 21 61` | Sangat gelap |
| 200 | `2 36 94` | Gelap |
| 300 | `4 55 133` | Medium-gelap |
| 400 | `7 72 169` | Medium |
| **500** | **`11 90 208`** | **Mid (sama)** |
| 600 | `53 119 253` | Medium |
| 700 | `122 153 253` | Terang |
| 800 | `167 185 254` | Sangat terang |
| 900 | `212 219 254` | Hampir putih |
| 950 | `234 237 255` | **Paling terang** ← INVERTED |

### Practical Implications

| Use Case | Recommended Shade | Why |
|---|---|---|
| Text on light bg | 900, 950 | Dark text on light bg |
| Text on dark bg | 50, 100 | Light text on dark bg |
| Background (light) | 50, 100 | Very light bg |
| Background (dark) | 900, 950 | Very dark bg |
| **Focus shadow (light)** | **50** | Subtle, light shadow |
| **Focus shadow (dark)** | **950** | Visible, light shadow on dark bg |
| **Avoid for shadows** | **500, 300** | Same in both modes → blends with bg-{color}-500 |

## Triggering Dark Mode

### JavaScript API

```ts
// Enable dark mode
document.documentElement.setAttribute('data-mode', 'dark')

// Enable light mode
document.documentElement.setAttribute('data-mode', '')

// Read current mode
const isDark = document.documentElement.getAttribute('data-mode') === 'dark'
```

### Vue Example (Composition API)

```vue
<script setup>
import { ref, watch } from 'vue'

const isDark = ref(false)

watch(isDark, (value) => {
  document.documentElement.setAttribute('data-mode', value ? 'dark' : '')
}, { immediate: true })
</script>

<template>
  <Switch v-model="isDark" true-value="true" false-value="">
    Dark Mode
  </Switch>
</template>
```

### Theme Switching

Untuk switch theme (default ↔ purple):

```ts
document.documentElement.setAttribute('data-theme', 'purple')  // purple theme
document.documentElement.setAttribute('data-theme', '')         // default theme
```

### Persistence dengan localStorage

```ts
// On mount
const savedMode = localStorage.getItem('data-mode')
if (savedMode) {
  document.documentElement.setAttribute('data-mode', savedMode)
}

// On change
function setMode(mode: 'dark' | 'light') {
  const value = mode === 'dark' ? 'dark' : ''
  document.documentElement.setAttribute('data-mode', value)
  localStorage.setItem('data-mode', value)
}
```

### Prevent Flash of Unstyled Content (FOUC)

Add inline script di `<head>` BEFORE any CSS loads:

```html
<script>
  (function() {
    const mode = localStorage.getItem('data-mode');
    if (mode) document.documentElement.setAttribute('data-mode', mode);
    const theme = localStorage.getItem('data-theme');
    if (theme) document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

## Custom Ring Variables

Untuk component shadow/ring yang butuh **adaptive behavior** antara light & dark mode, gunakan **CSS custom property pattern**.

### Pattern

Define CSS variable di kedua mode, reference via `var()` di Tailwind config.

**Step 1: Define variable di `lib/config/tailwind.css` (light mode)**

```css
@layer base {
  :root {
    /* ... existing color variables ... */
    
    --ring-primary: rgba(var(--color-primary-50) / 1);
    --ring-secondary: rgba(var(--color-secondary-50) / 1);
    --ring-warning: rgba(var(--color-warning-100) / 1);
    --ring-success: rgba(var(--color-success-50) / 1);
    --ring-danger: rgba(var(--color-danger-100) / 1);
    --ring-neutral: rgba(var(--color-neutral-950) / 0.1);
  }
}
```

**Step 2: Define override di `src/assets/index.css` (dark mode)**

```css
@layer base {
  :root[data-mode="dark"] {
    /* ... existing color overrides ... */
    
    --ring-primary: rgba(var(--color-primary-950) / 1);
    --ring-secondary: rgba(var(--color-secondary-950) / 1);
    --ring-warning: rgba(var(--color-warning-950) / 1);
    --ring-success: rgba(var(--color-success-950) / 1);
    --ring-danger: rgba(var(--color-danger-950) / 1);
    --ring-neutral: rgba(var(--color-neutral-50) / 0.1);
  }
}
```

**Step 3: Reference di `lib/config/configPreset.ts`**

```ts
boxShadow: {
  primary: '0 0 0 3px var(--ring-primary)',
  secondary: '0 0 0 3px var(--ring-secondary)',
  // ... etc
}
```

**Step 4: Use di component**

```vue
<button class="focus:shadow-primary">...</button>
```

### Why This Pattern?

| Approach | Light Mode | Dark Mode | Drawback |
|---|---|---|---|
| `shadow: var(--color-{name}-50)` | Subtle light shadow ✓ | Almost invisible (very dark) ✗ | Need manual override |
| `shadow: var(--color-{name}-500)` | Blends with `bg-{name}-500` ✗ | Same issue | Bad for all |
| `shadow: var(--color-{name}-700)` | Dark ring on light bg ✓ | Light ring on dark bg ✓ | Inverted polarity, may be too strong |
| **`shadow: var(--ring-{name})` (CSS var)** | **Subtle light shadow** ✓ | **Visible light shadow** ✓ | **No drawbacks** |

The CSS variable pattern memberikan:
- ✅ Subtle look di light mode (matches original ring design)
- ✅ Visible di dark mode (uses -950, which is light in dark mode)
- ✅ No hardcoded shade change needed — pure CSS behavior
- ✅ Works for any shade (not limited to 50/500/700)
- ✅ Theme-aware (purple theme inherits automatically via CSS cascade)

### Variable Naming

Gunakan prefix yang **generic** (bukan use-case specific):

| ❌ Avoid | ✅ Use | Why |
|---|---|---|
| `--focus-ring-primary` | `--ring-primary` | Bisa dipakai untuk hover, active, border, dll |
| `--shadow-primary` | `--ring-primary` | Mendeskripsikan visual effect (ring-like), bukan property |
| `--border-primary` | `--ring-primary` | "Border" terlalu spesifik (border ≠ shadow) |

## Adding a New Color

Step-by-step untuk menambah color baru (e.g., `pink`):

### Step 1: Define RGB values di `lib/config/tailwind.css`

```css
@layer base {
  :root {
    /* ... existing colors ... */
    
    --color-pink-50: 252 232 243;
    --color-pink-100: 251 213 230;
    --color-pink-200: 248 165 200;
    --color-pink-300: 244 114 182;
    --color-pink-400: 236 72 153;
    --color-pink-500: 219 39 119;
    --color-pink-600: 190 24 93;
    --color-pink-700: 157 23 77;
    --color-pink-800: 122 18 60;
    --color-pink-900: 87 13 43;
    --color-pink-950: 53 8 26;
  }
}
```

### Step 2: Define inverted values di `src/assets/index.css` (dark mode)

```css
@layer base {
  :root[data-mode="dark"] {
    /* ... existing colors ... */
    
    --color-pink-50: 53 8 26;        /* darkest in dark */
    --color-pink-100: 87 13 43;
    --color-pink-200: 122 18 60;
    --color-pink-300: 157 23 77;
    --color-pink-400: 190 24 93;
    --color-pink-500: 219 39 119;    /* SAME in both modes */
    --color-pink-600: 236 72 153;
    --color-pink-700: 244 114 182;
    --color-pink-800: 248 165 200;
    --color-pink-900: 251 213 230;
    --color-pink-950: 252 232 243;   /* lightest in dark */
  }
}
```

**Pattern:** Di dark mode, urutannya di-flip:
- 50 (paling terang di light) → jadi paling gelap di dark
- 950 (paling gelap di light) → jadi paling terang di dark
- 500 (mid) → tetap sama

### Step 3: Map ke Tailwind di `lib/config/configPreset.ts`

```ts
colors: {
  pink: {
    50: 'rgba(var(--color-pink-50) / <alpha-value>)',
    100: 'rgba(var(--color-pink-100) / <alpha-value>)',
    // ... up to 950
    950: 'rgba(var(--color-pink-950) / <alpha-value>)',
  },
}
```

### Step 4: Add ring variable (optional, untuk focus shadow)

```css
/* lib/config/tailwind.css */
:root {
  --ring-pink: rgba(var(--color-pink-50) / 1);
}

/* src/assets/index.css */
:root[data-mode="dark"] {
  --ring-pink: rgba(var(--color-pink-950) / 1);
}
```

```ts
// lib/config/configPreset.ts
boxShadow: {
  pink: '0 0 0 3px var(--ring-pink)',
}
```

### Step 5: Verify

```bash
npm run build
```

Check generated CSS untuk `.bg-pink-500`, `.text-pink-700`, etc. dan `.focus\:shadow-pink` jika ring variable ditambah.

## Creating Dark-Mode Aware Components

### Pattern 1: Use Existing Color (auto-adaptive)

Pakai Tailwind color utilities yang sudah di-map ke CSS variables. Tidak perlu tambahan code.

```vue
<template>
  <button class="bg-primary-500 text-white">Click me</button>
</template>
```

✅ **Auto-adaptive** — `bg-primary-500` resolve ke `var(--color-primary-500)` yang nilainya sama di light & dark mode.

### Pattern 2: Conditional Colors per Mode

Untuk text/icon yang beda antara light & dark:

```vue
<template>
  <p class="text-neutral-950 dark:text-neutral-500">Hello</p>
</template>
```

`dark:` variant di-resolve ke `var(--color-neutral-500)` di dark mode.

### Pattern 3: Custom Ring via CSS Variable

Untuk focus ring/shadow yang adaptive:

```vue
<template>
  <button class="focus:shadow-primary focus-visible:shadow-primary">Click me</button>
</template>
```

Reference `var(--ring-primary)` di boxShadow config (sudah di-setup di `configPreset.ts`).

### Pattern 4: Component-Level Dark Mode Override

Jika butuh override per-component, gunakan `data-[state=...]` atau `data-mode` selectors:

```vue
<template>
  <div class="bg-white data-[mode=dark]:bg-neutral-900">...</div>
</template>
```

### Anti-Patterns (Avoid!)

❌ **Hardcode color values:**
```vue
<div class="bg-[#0b5ad0]">...</div>  <!-- Won't adapt to dark mode -->
```

❌ **Use Tailwind `dark:` for everything:**
```vue
<div class="bg-white dark:bg-neutral-900">...</div>  <!-- OK but verbose -->
```

❌ **Override CSS variables di component style:**
```vue
<style scoped>
.my-class {
  --color-primary-500: ...;  <!-- Breaks global theme system -->
}
</style>
```

❌ **Use `var(--color-{name}-50)` for shadows in dark mode:**
```css
--ring-primary: rgba(var(--color-primary-50) / 1);  /* Almost invisible in dark mode! */
```

## Common Pitfalls

### 1. Using `dark:` Tailwind Variant Instead of CSS Variables

**Problem:** `dark:bg-neutral-900` generates CSS that depends on `.dark` class, but our system uses `data-mode="dark"` attribute.

**Solution:** Use CSS variables or the data-mode attribute:
```css
/* Instead of dark:bg-neutral-900, use: */
.bg-neutral-900 { background: rgba(var(--color-neutral-900) / 1); }
/* which auto-adapts via :root[data-mode="dark"] */
```

### 2. Forgetting to Invert 50/950 in Dark Mode

**Problem:** In dark mode, `--color-primary-50` becomes very dark (almost black), making shadows invisible.

**Solution:** Use CSS variable pattern for shadows:
```css
:root { --ring-primary: rgba(var(--color-primary-50) / 1); }
:root[data-mode="dark"] { --ring-primary: rgba(var(--color-primary-950) / 1); }
```

### 3. Component Doesn't Adapt Because of Inline Styles

**Problem:** `style="background: #fff"` overrides CSS variable.

**Solution:** Always use Tailwind classes or CSS variables in inline styles.

### 4. Tailwind `<alpha-value>` Doesn't Work in `boxShadow`

**Problem:** `boxShadow: { primary: '0 0 0 3px rgba(var(--color-primary-500) / <alpha-value>)' }` outputs literal `<alpha-value>` string (invalid CSS).

**Solution:** Use CSS variables instead of `<alpha-value>` in boxShadow:
```ts
boxShadow: {
  primary: '0 0 0 3px var(--ring-primary)',  /* CSS var handles alpha */
}
```

### 5. Purple Theme Override Not Applied

**Problem:** Adding `--color-pink-500` to `:root` doesn't apply when `data-theme="purple"`.

**Solution:** Either add `--color-pink-*` to all theme selectors, or accept that pink isn't available in purple theme.

### 6. JavaScript Runs Before CSS Variables Load

**Problem:** Setting `data-mode` before CSS loads causes FOUC.

**Solution:** Use inline `<script>` in `<head>` BEFORE stylesheet link.

### 7. Form Input Background Not Adapting

**Problem:** `<input class="bg-white">` stays white in dark mode.

**Solution:** Use `bg-white dark:bg-neutral-800` or `bg-transparent` (inherits from parent).

## Testing

### Manual Testing Checklist

- [ ] Toggle dark mode — all colors adapt smoothly
- [ ] Toggle theme (purple) — colors apply correctly in both modes
- [ ] Focus indicators (ring/shadow) visible in both modes
- [ ] Disabled state has good contrast in both modes
- [ ] Hover/focus border colors visible in both modes
- [ ] No "flash" when page loads (FOUC check)
- [ ] Saved mode in localStorage persists across reloads

### Browser DevTools

1. Inspect element → Computed styles → check `background-color` value
2. Verify it uses `rgba(var(--color-{name}-500), ...)` format
3. Toggle `data-mode` attribute manually — colors should change immediately
4. Check `data-theme` attribute — purple theme should apply

### Programmatic Test

```ts
// In test file
import { mount } from '@vue/test-utils'

test('component adapts to dark mode', () => {
  document.documentElement.setAttribute('data-mode', 'dark')
  const wrapper = mount(MyComponent)
  expect(wrapper.find('.my-element').classes()).toContain('dark:bg-neutral-900')
  document.documentElement.setAttribute('data-mode', '')  // cleanup
})
```

### Visual Regression Test

Use tools like Percy, Chromatic, atau LokiJS untuk screenshot diff antara light & dark mode.

## Examples

### Example 1: Toggle Dark Mode

```vue
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Switch } from '@sutekitechid/sicoco-v3-next'

const isDark = ref(false)

onMounted(() => {
  // Restore from localStorage
  const saved = localStorage.getItem('data-mode')
  if (saved === 'dark') {
    isDark.value = true
  }
})

watch(isDark, (value) => {
  document.documentElement.setAttribute('data-mode', value ? 'dark' : '')
  localStorage.setItem('data-mode', value ? 'dark' : '')
}, { immediate: true })
</script>

<template>
  <Switch v-model="isDark" true-value="dark" false-value="">Dark Mode</Switch>
</template>
```

### Example 2: Theme Selector

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dropdown } from '@sutekitechid/sicoco-v3-next'

const theme = ref('default')

watch(theme, (value) => {
  document.documentElement.setAttribute('data-theme', value)
}, { immediate: true })
</script>

<template>
  <Dropdown v-model="theme" :options="['default', 'purple']" />
</template>
```

### Example 3: Component with Adaptive Focus Ring

```vue
<template>
  <button class="
    bg-primary-500 text-white
    hover:enabled:bg-primary-700
    focus:shadow-primary focus-visible:shadow-primary
    focus:outline-none
  ">
    Click me
  </button>
</template>
```

**Behavior:**
- Light mode: subtle primary-50 ring around button
- Dark mode: visible primary-950 ring (light color, contrast with dark bg)
- Purple theme: ring uses purple's -50 (light) / -950 (dark) values via CSS cascade

### Example 4: Adaptive Card

```vue
<template>
  <div class="
    bg-white dark:bg-neutral-900
    border border-neutral-200 dark:border-neutral-800
    text-neutral-950 dark:text-neutral-100
    p-4 rounded-lg
  ">
    <h3 class="font-semibold">Card Title</h3>
    <p class="text-neutral-600 dark:text-neutral-400">Card content</p>
  </div>
</template>
```

### Example 5: Adaptive Shadow (Generic, not color-specific)

```vue
<script setup>
import { useThemeMode } from '@/composables/useThemeMode'
const { isDark } = useThemeMode()
</script>

<template>
  <div :class="['p-4 rounded', isDark ? 'shadow-lg shadow-black/20' : 'shadow-lg shadow-neutral-950/10']">
    Content
  </div>
</template>
```

## File Reference

| File | Purpose |
|---|---|
| `lib/config/tailwind.css` | Default theme light mode CSS variables + ring variables |
| `lib/config/configPreset.ts` | Tailwind config: color mapping, boxShadow (refs CSS vars) |
| `src/assets/index.css` | Dark mode overrides + purple theme overrides + ring dark overrides |
| `tailwind.config.js` | Tailwind main config (uses configPreset) |
| `src/pages/index.vue` | Example dark mode toggle implementation |

## Related Documentation

- [Tailwind Config Preset](./config-preset.md) (TBD)
- [Component Best Practices](./component-best-practices.md) (TBD)
- [Color System](./color-system.md) (TBD)

## Changelog

| Date | Change |
|---|---|
| Initial | Basic dark mode with data-mode attribute |
| 2026-06 | Added CSS variable ring pattern for adaptive shadows |
| 2026-06 | Standardized purple theme dark mode |
| 2026-06 | Documentation created |
