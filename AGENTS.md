# SICOCO V3 — Agent Instructions

Vue 3 component library (`@sutekitechid/sicoco-v3-next`). 45+ accessible UI components built with TypeScript, TailwindCSS, and Reka UI.

## Project Layout

```
lib/                    Library source (published)
  components/           45 component folders
  composables/          Reusable composition functions
  config/               TailwindCSS preset + CSS variables
  types/                Shared TypeScript types
  utils/                Helper functions (cn, currency, date, etc.)
  main.ts               Entry point — all exports
src/                    Demo app (not published)
  pages/                One page per component
  router.ts             Hash-based routes
test/                   Vitest unit tests
snippets/               VSCode snippet JSONs
docs/                   Technical documentation
```

## Hard Rules

1. `<script setup lang="ts">` for all Vue components
2. `Primitive` from `reka-ui` as root element (not raw HTML)
3. CVA for variant styling, defined in `index.ts`, consumed via `cn()`
4. Custom color scale only: `primary`, `secondary`, `success`, `warning`, `danger`, `neutral`
5. Never use standard Tailwind colors (`gray-200`, `blue-500`, etc.)
6. Function declarations for named functions, arrow functions for callbacks only
7. Early returns, no nested if statements
8. One component per folder, export from `index.ts`
9. `S` prefix for exports in `lib/main.ts` (e.g., `SButton`)
10. Include unit tests for every component

## Commands

```bash
npm run dev              # Library dev server
npm run build            # Library build (vue-tsc + vite)
npm run build:app        # Demo app build
npm run test             # Vitest single run
npm run test:watch       # Vitest watch mode
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run test:e2e         # Cypress E2E tests
```

## Memory Files

Load these for detailed guidance:
- `.opencode/memory/conventions.md` — Coding rules, color system, typography
- `.opencode/memory/component-anatomy.md` — How to structure a component
- `.opencode/memory/exports.md` — Export registry and S-prefix rules
- `docs/dark-mode.md` — CSS variable theming system
- `docs/form-validation-system.md` — Vuelidate integration

## Available Skills

| Skill | Purpose |
|-------|---------|
| `create-component` | Scaffold a complete new component |
| `add-variant` | Add a CVA variant to existing component |
| `write-tests` | Write or extend Vitest unit tests |
| `create-demo-page` | Create a demo page in the app |
| `review-component` | Review against conventions checklist |
| `validate-build` | Run lint + test + build pipeline |

## Available Agents

| Agent | Purpose |
|-------|---------|
| `component-explorer` | Find existing patterns before creating code |
| `convention-checker` | Validate code against conventions |

## Available Commands

| Command | Workflow |
|---------|----------|
| `create-component` | Full component creation pipeline |
| `add-variant` | Variant addition pipeline |
| `review-pr` | PR review pipeline |
| `fix-bug` | Bug investigation and fix pipeline |
