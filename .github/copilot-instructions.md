# SICOCO V3 NEXT - Component Library Instructions

This is a Vue 3 component library (@sutekitechid/sicoco-v3-next) built with Vite and TypeScript. It provides reusable, accessible UI components styled with TailwindCSS and Reka UI, designed for enterprise applications.

## Code Style

- **Framework**: Vue 3 with `<script setup>` (Composition API)
- **Language**: TypeScript for all new code
- **Styling**: Use TailwindCSS classes first; avoid inline styles when possible; use them when values must be dynamic
- **Build Tool**: Vite with `vite.config.ts`
- **Imports**: Explicit imports required
- **ESLint**: Follow rules defined in `eslint.config.js`—use tabs for indentation, proper import ordering
- **Function syntax**: Use function declarations for named functions, arrow functions for callbacks

### Function Declaration Rules

**Always use function declarations** for named functions:

```typescript
// ✅ CORRECT - Function declaration
function handleSubmit() {
  // implementation
}

function fetchUserData(userId: string) {
  return api.get(`/users/${userId}`)
}

// ❌ WRONG - Arrow function assignment
const handleSubmit = () => {
  // implementation
}

const fetchUserData = (userId: string) => {
  return api.get(`/users/${userId}`)
}
```

**Function order**: Caller must be defined before callee

```typescript
// ✅ CORRECT - handleClick defined before fetchData
function handleClick() {
  fetchData() // Function hoisting allows this
}

function fetchData() {
  return api.get('/data')
}

// ❌ WRONG - fetchData defined before handleClick (callee before caller)
function fetchData() {
  return api.get('/data')
}

function handleClick() {
  fetchData()
}
```

**Exceptions**: Arrow functions are acceptable for:
- Inline callbacks: `array.map(item => item.id)`
- Function parameters: `setTimeout(() => {}, 1000)`
- React/Vue component methods where required by framework

### Code Quality Rules

**Avoid nested if statements**: Use early returns instead for better readability

```typescript
// ✅ CORRECT - Early return pattern
function processUser(user: User) {
  if (!user) {
    return null
  }
  
  if (!user.isActive) {
    return { error: 'User is not active' }
  }
  
  if (!user.hasPermission) {
    return { error: 'No permission' }
  }
  
  // Main logic here
  return processUserData(user)
}

// ❌ WRONG - Nested if statements
function processUser(user: User) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        // Main logic deeply nested
        return processUserData(user)
      } else {
        return { error: 'No permission' }
      }
    } else {
      return { error: 'User is not active' }
    }
  } else {
    return null
  }
}
```

### Component Development Rules

**Always use `<script setup>` syntax for components**:

```vue
<!-- ✅ CORRECT -->
<template>
  <button @click="handleClick" :class="buttonClasses">
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false
})

const emit = defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => {
  return `btn btn-${props.variant} ${props.disabled ? 'opacity-50' : ''}`
})

function handleClick() {
  emit('click')
}
</script>
```

**Rules**:
- Use `<script setup>` for all components
- Define props and emits explicitly with TypeScript
- Use `withDefaults()` for prop defaults
- Extract complex logic into composables
- Use `ref` or `reactive` for local mutable state when appropriate, and use `computed` for derived values

## 🎨 Design Reference

- **Figma as visual reference only**: Use Figma images for visual guidance
- **Text specifications are the primary source**: Follow written specifications as the main source of truth
- When conflicts arise between Figma and specifications, prioritize the text specifications

## Architecture

### Project Structure

```
lib/
  components/          ⭐ All reusable UI components
    button/
    card/
    dialog/
    form-input/
    data-table/
    ... (40+ components)
  assets/              Icons and static assets
  config/              Configuration utilities
  types/               TypeScript type definitions
  utils/               Helper functions
  main.ts              Library entry point

snippets/              VSCode snippets for quick component usage
  button.json
  card.json
  ... (component snippets)

test/                  Component tests (Vitest + Cypress)
src/                   Demo/dev app (not part of published library)
```

### Component Directory Structure

Each component folder follows this pattern:

```
button/
  Button.vue           Main component file
  index.ts             Export (re-export component)
  Button.spec.ts       Unit tests
```

**Rules**:
- One component per folder
- Always export from `index.ts`
- Include tests alongside component
- Use descriptive names matching the component

### Publishing & Distribution

**Published as**: `@sutekitechid/sicoco-v3-next`
**Package exports**: 
- Default: compiled JavaScript components in `dist/`
- Types: `dist/main.d.ts`
- Snippets: Auto-generated in `dist/.vscode/components.code-snippets`

**Build outputs**:
- Component bundle: `dist/main.js`
- Type definitions: `dist/main.d.ts`
- Snippets: `.vscode/components.code-snippets` (merged from `snippets/` folder)

### File Modification Rules

**When implementing features**:
- **Edit existing files**: If a file already exists, modify it instead of creating new ones
- **Don't create unnecessary files**: Only create new files when absolutely necessary
- **Follow existing structure**: Match the project's folder organization and naming conventions

### Snippets System

VSCode snippets are auto-generated from component implementations:

**Workflow**:
1. Create/modify component in `lib/components/button/`
2. Run `npm run build` (generates snippets automatically)
3. Snippets appear in `.vscode/components.code-snippets`
4. Components reference these snippets in documentation

**Consumer usage**:
```bash
# In consuming project
npm install @sutekitechid/sicoco-v3-next
npm run postinstall  # Copies snippets to project
```

## Build and Test

```bash
# Development
npm run dev                             # Start dev server with hot reload

# Testing
npm test                                # Run component tests (Vitest)
npm run test:watch                      # Run tests in watch mode
npm run test:e2e                        # Run end-to-end tests (Cypress)
npm run cypress:run                     # Run Cypress in headless mode

# Build
npm run build                            # Build library (Vue TSC + Vite)
npm run preview                          # Preview built library

# Quality checks
npm run lint                             # ESLint on .js/.ts/.vue
npm run lint:fix                         # Auto-fix linting issues
```

**Build output**:
- Component bundle: `dist/main.js`
- Type definitions: `dist/main.d.ts`
- Merged snippets: `.vscode/components.code-snippets`

**Prerequisites**: Node 20+

## Conventions

### 🎨 Styling

- **TailwindCSS first**: Use Tailwind classes for all styling needs; avoid inline styles unless necessary for dynamic values
- **Custom color system**: Use project's custom color scale with shades 10-100 (increments of 10)
  - Available colors: `primary`, `success`, `warning`, `danger`, `neutral`
  - Examples: `text-neutral-60`, `bg-primary-10`, `border-neutral-20`, `text-danger-100`
  - **Never use standard Tailwind colors** like `gray-200`, `blue-500`, `red-600`
- **Common patterns from codebase**:
  - Borders: `border-neutral-20`, `border-neutral-30`
  - Text: `text-neutral-100` (dark), `text-neutral-60` (medium), `text-neutral-50` (light)
  - Backgrounds: `bg-neutral-10`, `bg-neutral-20`
  - Accent text: `text-primary-100`, `text-danger-100`
- **Reka UI integration**: Components use Reka UI for accessible primitives
- **HTML sanitization**: Use `sanitize-html` for user-generated content when applicable

### 📦 Package Management

- **Manager**: NPM
- **GitHub Package Registry**: Required for `@sutekitechid` packages
- **Entry point**: `lib/main.ts` exports all components
- **Type safety**: All components must have full TypeScript support

### 🔄 Git Workflow

- **Branches**: `feat/feature-name`, `fix/bug-name`, `docs/docs-name`
- **Main branch**: `main` (production)
- **Commits**: Follow conventional commits for clarity
- **Publishing**: Automatic via GitHub Actions on version tag

### ⚠️ Common Pitfalls

1. **Direct style attributes**: Use Tailwind classes instead of `style=""`
2. **Component exports**: Always export from component `index.ts` file
3. **TypeScript**: All props and emits must have explicit types
4. **Tests**: Include unit tests (`.spec.ts`) with each component
5. **Snippets**: Run `npm run build` after adding/modifying components to generate snippets
6. **Props documentation**: Use JSDoc comments for complex props in components

## Documentation

- **Setup**: [README.md](../README.md) - Prerequisites, installation, and snippets usage
- **Component Snippets**: Auto-generated in `.vscode/components.code-snippets` after build
- **Examples**: See demo app in `src/` folder
- **Tests**: Examples in `test/` folder for component testing patterns

## Quick Reference

| Need | Location |
|------|----------|
| Add new component | `lib/components/new-component/` |
| Component file | `lib/components/[name]/[Name].vue` |
| Component export | `lib/components/[name]/index.ts` |
| Component tests | `lib/components/[name]/[Name].spec.ts` |
| Icons/Assets | `lib/assets/` |
| TypeScript types | `lib/types/` |
| Utilities | `lib/utils/` |
| Config | `lib/config/` |
| Snippets | `snippets/*.json` (auto-merged to `.vscode/`) |
| Library entry | `lib/main.ts` |
| Build output | `dist/` |
| Demo app | `src/` |
