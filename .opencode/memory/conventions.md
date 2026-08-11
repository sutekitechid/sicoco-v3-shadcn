# Coding Conventions

Extracted from source code. This is the single source of truth for coding rules.

## Component Pattern

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/utils/tw-merge'
import { fooVariants, type FooVariants } from './index'

interface Props extends PrimitiveProps {
  variant?: FooVariants['variant']
  size?: FooVariants['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'default',
  size: 'md',
})

const emit = defineEmits<{
  click: [value: string]
}>()

function handleClick() {
  emit('click', 'value')
}
</script>

<template>
  <Primitive
    :as="as"
    :class="cn(fooVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
```

### Rules
- Always `<script setup lang="ts">`
- Props extend `PrimitiveProps` from `reka-ui`
- `class?: HTMLAttributes['class']` for class override
- `cn( variants({...}), props.class )` in template
- Function declarations for named functions
- Early returns, no nested ifs

## CVA Pattern (in `index.ts`)

```ts
import { cva, type VariantProps } from 'class-variance-authority'

export { default as Foo } from './Foo.vue'

const SOLID = {
  primary: 'text-white bg-primary-default hover:bg-primary-hover ...',
  secondary: '...',
} as const

export const fooVariants = cva(
  'base classes here',
  {
    variants: {
      variant: {
        default: SOLID.primary,
        primary: SOLID.primary,
        secondary: SOLID.secondary,
      },
      size: {
        sm: 'text-label-md rounded h-9 min-w-9',
        md: 'text-label-lg rounded h-12 min-w-12',
        lg: 'text-label-lg rounded-lg h-14 min-w-14',
      },
    },
    compoundVariants: [
      { variant: 'primary', size: 'sm', class: 'extra-class' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export type FooVariants = VariantProps<typeof fooVariants>
```

### Rules
- Use `as const` on variant constant objects
- Derive types with `VariantProps<typeof fooVariants>`
- Re-export `.vue` default: `export { default as Foo } from './Foo.vue'`
- Compound variant keys use kebab-case: `'secondary-primary'`, `'link-danger'`

## Color System

### Available Scales
`primary`, `secondary`, `success`, `warning`, `danger`, `neutral`, `info`, `orange`

### Semantic Tokens
```
bg-{color}-default     → color-500 (brand)
bg-{color}-hover       → color-700
bg-{color}-subtle      → color-50 (light tint)
bg-{color}-{shade}     → color-{shade} (50-950)
text-{color}-default   → color-500
text-{color}-{shade}   → color-{shade}
border-{color}-default → color-500
border-{color}-hover   → color-700
focus-visible:shadow-{color}  → ring variable
```

### Utility Classes
```
text-main          → text-neutral-950
text-secondary     → text-neutral-700
text-disabled      → text-neutral-500
text-placeholder   → text-neutral-600
bg-disabled        → bg-neutral-300
border-main        → border-neutral-400
```

### Forbidden
- `text-gray-*`, `bg-blue-*`, `red-*`, etc. — never use standard Tailwind colors
- Inline `style=""` unless value is truly dynamic (height, width, position)

## Typography

Custom font-size tokens (use as `text-{token}`):
```
display-xl  display-lg  display-md  display-sm
heading-xl  heading-lg  heading-md  heading-sm
title-lg    title-md    title-sm
body-lg     body-md     body-sm
label-lg    label-md    label-sm
caption-md  caption-sm
```

Font weight is separate: `font-bold`, `font-semibold`, etc.

## Function Rules

```ts
// ✅ Function declaration
function handleClick() {
  fetchData()
}

// ✅ Arrow function for callbacks
array.map(item => item.id)
setTimeout(() => {}, 1000)

// ❌ Arrow function assignment
const handleClick = () => {}
```

### Order: caller before callee
```ts
function parent() {
  child() // OK — hoisted
}

function child() {}
```

## Build Commands

```bash
npm run dev           # Library dev server
npm run build         # vue-tsc --noEmit && vite build
npm run build:app     # Demo app build
npm run test          # vitest run
npm run test:watch    # vitest (watch)
npm run lint          # eslint . --ext .js,.ts,.vue
npm run lint:fix      # eslint --fix
npm run test:e2e      # Build app + Cypress
```

## TypeScript

- Path alias: `@/` → `./lib/`
- Module: ES2020, Target: ES2021
- `skipLibCheck: true`
- Import types with `import type { ... }`

## Testing

- Framework: Vitest 3.0 + `@vue/test-utils` 2.4
- Environment: `happy-dom`
- File naming: `test/{Name}.spec.ts`
- Pattern: `mount()` → assert → check emits
