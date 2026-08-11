# Component Anatomy

Step-by-step guide to creating a component in SICOCO V3.

## Directory Structure

```
lib/components/{name}/
  ├── {Name}.vue          Main component file
  └── index.ts            CVA variants + re-exports
```

One component per folder. Folder name is kebab-case, file name is PascalCase.

## Step 1: Create `index.ts`

```ts
import { cva, type VariantProps } from 'class-variance-authority'

export { default as ComponentName } from './ComponentName.vue'

export const componentNameVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        default: 'classes...',
        secondary: 'classes...',
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

export type ComponentNameVariants = VariantProps<typeof componentNameVariants>
```

## Step 2: Create `{Name}.vue`

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/utils/tw-merge'
import { componentNameVariants, type ComponentNameVariants } from './index'

interface Props extends PrimitiveProps {
  variant?: ComponentNameVariants['variant']
  size?: ComponentNameVariants['size']
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
    :class="cn(componentNameVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
```

## Step 3: Add Exports to `lib/main.ts`

```ts
export { ComponentName as SComponentName } from './components/component-name'
```

## Step 4: Create Unit Test

File: `test/ComponentName.spec.ts`

```ts
import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import ComponentName from '../lib/components/component-name/ComponentName.vue'
import { componentNameVariants } from '../lib/components/component-name'

test('ComponentName renders correctly', () => {
  const wrapper = mount(ComponentName, {
    slots: { default: 'Content' },
  })
  expect(wrapper.text()).toContain('Content')
})

test('ComponentName variant classes', () => {
  expect(componentNameVariants({ variant: 'default', size: 'md' })).toContain('base-classes')
})

test('ComponentName emits change event', async () => {
  const wrapper = mount(ComponentName)
  await wrapper.vm.handleChange('test')
  expect(wrapper.emitted('change')).toBeTruthy()
})
```

## Step 5: Create Demo Page

File: `src/pages/component-name.vue`

```vue
<script setup lang="ts">
import DocsLayout from '../layouts/DocsLayout.vue'
import { SComponentName } from '../../lib/main'
</script>

<template>
  <DocsLayout title="ComponentName">
    <div class="space-y-8">
      <section>
        <h2 class="text-title-lg font-bold mb-4">Default</h2>
        <SComponentName>Default content</SComponentName>
      </section>

      <section>
        <h2 class="text-title-lg font-bold mb-4">Variants</h2>
        <div class="flex gap-4">
          <SComponentName variant="default">Default</SComponentName>
          <SComponentName variant="secondary">Secondary</SComponentName>
        </div>
      </section>
    </div>
  </DocsLayout>
</template>
```

Add route to `src/router.ts`.

## Step 6: Create Snippet

File: `snippets/component-name.json`

```json
{
  "ComponentName Default": {
    "prefix": "s-component-name",
    "body": [
      "<SComponentName>$1</SComponentName>"
    ],
    "description": "Insert ComponentName component"
  }
}
```

## Checklist

- [ ] `lib/components/{name}/{Name}.vue` exists
- [ ] `lib/components/{name}/index.ts` exports CVA + component
- [ ] `lib/main.ts` has `S` prefix export
- [ ] `test/{Name}.spec.ts` exists with basic tests
- [ ] `src/pages/{name}.vue` demo page exists
- [ ] `snippets/{name}.json` snippet exists
- [ ] Uses `<script setup lang="ts">`
- [ ] Uses `Primitive` from reka-ui
- [ ] Uses `cn()` for class merging
- [ ] Custom colors only (no standard Tailwind)
- [ ] Function declarations for named functions
- [ ] Early returns, no nested ifs
