# Skill: Create Component

Scaffold a complete new component following all project conventions.

## Trigger

User asks to create a new UI component (e.g., "Create a Select component", "Add a Toggle component").

## Input

- **name** (required): Component name in PascalCase (e.g., `Select`, `Toggle`)
- **description** (required): What the component does
- **props** (optional): List of props with types
- **variants** (optional): CVA variant names

## Output

Creates 6 files and modifies 1:

| File | Purpose |
|------|---------|
| `lib/components/{name}/{Name}.vue` | Component implementation |
| `lib/components/{name}/index.ts` | CVA variants + re-exports |
| `test/{Name}.spec.ts` | Unit tests |
| `src/pages/{name}.vue` | Demo page |
| `snippets/{name}.json` | VSCode snippet |
| `lib/main.ts` | Modified — adds S-prefix exports |

## Workflow

1. Load memory: `.opencode/memory/conventions.md`, `.opencode/memory/component-anatomy.md`, `.opencode/memory/exports.md`
2. Run `component-explorer` agent to find similar existing components
3. Create `index.ts` with CVA variants
4. Create `{Name}.vue` with `<script setup lang="ts">`, `Primitive` root, `cn()` class merging
5. Add exports to `lib/main.ts` with `S` prefix
6. Create `test/{Name}.spec.ts` with basic tests
7. Create `src/pages/{name}.vue` demo page
8. Create `snippets/{name}.json`
9. Run `convention-checker` agent to validate
10. Run `validate-build` skill

## Template: index.ts

```ts
import { cva, type VariantProps } from 'class-variance-authority'

export { default as {Name} } from './{Name}.vue'

const BASE = 'base-classes'

export const {name}Variants = cva(
  BASE,
  {
    variants: {
      variant: {
        default: 'classes...',
      },
      size: {
        sm: 'text-label-md rounded h-9 min-w-9',
        md: 'text-label-lg rounded h-12 min-w-12',
        lg: 'text-label-lg rounded-lg h-14 min-w-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export type {Name}Variants = VariantProps<typeof {name}Variants>
```

## Template: {Name}.vue

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/utils/tw-merge'
import { {name}Variants, type {Name}Variants } from './index'

interface Props extends PrimitiveProps {
  variant?: {Name}Variants['variant']
  size?: {Name}Variants['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  variant: 'default',
  size: 'md',
})

const emit = defineEmits<{
  change: [value: string]
}>()

function handleChange(value: string) {
  if (!value) return
  emit('change', value)
}
</script>

<template>
  <Primitive
    :as="as"
    :class="cn({name}Variants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
```

## Template: lib/main.ts entry

```ts
export { {Name} as S{Name} } from './components/{name}'
```

## Template: test/{Name}.spec.ts

```ts
import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import {Name} from '../lib/components/{name}/{Name}.vue'
import { {name}Variants } from '../lib/components/{name}'

test('{Name} renders correctly', () => {
  const wrapper = mount({Name}, {
    slots: { default: 'Content' },
  })
  expect(wrapper.text()).toContain('Content')
})

test('{Name} applies variant classes', () => {
  const classes = {name}Variants({ variant: 'default', size: 'md' })
  expect(classes).toContain('base-classes')
})

test('{Name} emits change event', async () => {
  const wrapper = mount({Name})
  await wrapper.vm.handleChange('test')
  expect(wrapper.emitted('change')).toBeTruthy()
})
```

## Rules

- Never create a component that already exists — check `lib/components/` first
- Always use `<script setup lang="ts">`
- Always use `Primitive` from reka-ui as root
- Always use `cn()` for class merging
- Always use custom color tokens, never standard Tailwind colors
- Always export with `S` prefix from `lib/main.ts`
- Always create unit tests
