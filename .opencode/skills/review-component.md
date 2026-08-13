# Skill: Review Component

Review a component against the project conventions checklist.

## Trigger

User asks to review a PR, check a component, or validate against conventions.

## Input

- **target** (required): Component name or file path

## Output

Checklist with pass/fail per convention and specific fix recommendations.

## Workflow

1. Load memory: `.opencode/memory/conventions.md`
2. Read component files: `.vue`, `index.ts`
3. Read test file: `test/{Name}.spec.ts`
4. Read demo page: `src/pages/{name}.vue`
5. Check `lib/main.ts` for correct exports
6. Run checklist and report findings

## Checklist

### Script Setup
- [ ] Uses `<script setup lang="ts">`
- [ ] No Options API usage

### Props and Emits
- [ ] Props defined with `interface Props`
- [ ] Props have explicit TypeScript types
- [ ] Uses `withDefaults()` for optional props with defaults
- [ ] Emits defined with `defineEmits<{...}>()`

### Root Element
- [ ] Uses `Primitive` from `reka-ui` as root element
- [ ] Not using raw `<div>` or `<button>` as root

### Styling
- [ ] Uses `cn()` for class merging
- [ ] Uses CVA variants from `index.ts`
- [ ] No standard Tailwind colors (`gray-*`, `blue-*`, `red-*`, etc.)
- [ ] Custom color tokens used (`primary-*`, `neutral-*`, etc.)
- [ ] No inline `style=""` unless truly dynamic values

### Function Rules
- [ ] Named functions use function declarations
- [ ] Arrow functions only for callbacks
- [ ] Early returns used (no nested ifs)

### CVA Pattern (index.ts)
- [ ] Uses `cva()` from `class-variance-authority`
- [ ] Variant constants use `as const`
- [ ] Type exported: `type FooVariants = VariantProps<typeof fooVariants>`
- [ ] Component re-exported: `export { default as Foo } from './Foo.vue'`

### Exports
- [ ] Exported from `lib/main.ts` with `S` prefix
- [ ] All sub-components exported (if compound component)

### Testing
- [ ] Test file exists in `test/{Name}.spec.ts`
- [ ] Renders correctly test
- [ ] Variant classes test
- [ ] Emit event test
- [ ] At least 3 test cases

### Accessibility
- [ ] Semantic HTML used
- [ ] ARIA attributes where needed
- [ ] Keyboard navigation supported
- [ ] Focus indicators visible

### Demo
- [ ] Demo page exists in `src/pages/{name}.vue`
- [ ] Uses `DocsLayout` wrapper
- [ ] Shows all variants
- [ ] Shows all sizes

### Snippet
- [ ] Snippet exists in `snippets/{name}.json`

## Output Format

```
## Convention Review: {ComponentName}

### Passed
- ✅ Uses <script setup lang="ts">
- ✅ Primitive from reka-ui
- ✅ cn() for class merging
...

### Failed
- ⚠️ Uses arrow function for handleChange → should be function declaration
  → File: lib/components/foo/Foo.vue:42
  → Fix: Change `const handleChange = () => {}` to `function handleChange() {}`

- ⚠️ Uses bg-gray-100 → should use bg-neutral-10
  → File: lib/components/foo/Foo.vue:15
  → Fix: Replace `bg-gray-100` with `bg-neutral-10`

### Summary
Passed: 14/16 | Failed: 2/16
```
