# Skill: Create Demo Page

Create a demo/preview page in the app for a component.

## Trigger

User asks to create a demo page or preview page for a component.

## Input

- **component** (required): Component name (e.g., `Button`, `Dialog`)
- **scenarios** (optional): Specific demo scenarios to show

## Output

- `src/pages/{name}.vue` — Demo page
- Modified `src/router.ts` — New route

## Workflow

1. Read existing demo pages for reference (e.g., `src/pages/button.vue`, `src/pages/dialog.vue`)
2. Create `src/pages/{name}.vue` using `DocsLayout`
3. Add route to `src/router.ts`

## Template

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

      <section>
        <h2 class="text-title-lg font-bold mb-4">Sizes</h2>
        <div class="flex items-center gap-4">
          <SComponentName size="sm">Small</SComponentName>
          <SComponentName size="md">Medium</SComponentName>
          <SComponentName size="lg">Large</SComponentName>
        </div>
      </section>
    </div>
  </DocsLayout>
</template>
```

## Router Entry

Add to `src/router.ts`:

```ts
{
  path: '/component-name',
  name: 'ComponentName',
  component: () => import('./pages/component-name.vue'),
}
```

## Rules

- Always use `DocsLayout` as wrapper
- Show all variants in separate sections
- Show all sizes
- Show interactive states (disabled, loading)
- Use semantic typography classes (`text-title-lg`, `text-body-md`)
