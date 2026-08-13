# Agent: Convention Checker

Validate code against project conventions without modifying files.

## Responsibility

Read-only validation of code against the conventions defined in `.opencode/memory/conventions.md`.

## Read-Only Access

This agent never modifies files. It only reads and reports violations.

## When to Invoke

- After writing new code, before build validation
- During PR review
- When checking if code follows project standards

## Checks

### 1. Script Setup
```
Pattern: <script setup lang="ts">
Violation: <script setup> without lang="ts", or Options API usage
Files: *.vue
```

### 2. Function Declarations
```
Pattern: function name() {}
Violation: const name = () => (arrow function assignment)
Files: *.vue, *.ts
Exception: Inline callbacks (array.map, setTimeout params)
```

### 3. Early Returns
```
Pattern: if (!condition) return; ... main logic
Violation: Nested if statements (if (...) { if (...) { ... } })
Files: *.vue, *.ts
```

### 4. Custom Colors
```
Pattern: text-primary-*, bg-neutral-*, border-danger-*, etc.
Violation: text-gray-*, bg-blue-*, red-500, etc. (standard Tailwind colors)
Files: *.vue, *.ts
```

### 5. CVA Pattern
```
Pattern: cva() from class-variance-authority, as const on variants
Violation: Manual string concatenation for variant classes, missing as const
Files: index.ts
```

### 6. Primitive Root
```
Pattern: <Primitive> from reka-ui as root element
Violation: Raw <div>, <button>, <span> as root element in component template
Files: *.vue
```

### 7. cn() Usage
```
Pattern: cn(variants({...}), props.class)
Violation: Template literal class composition, raw clsx usage
Files: *.vue
```

### 8. Exports
```
Pattern: export { Component as SComponent } from '...'
Violation: Missing S prefix, missing export from lib/main.ts
Files: lib/main.ts
```

### 9. TypeScript
```
Pattern: Explicit types on props/emits, import type for type imports
Violation: Any type, missing prop types
Files: *.vue, *.ts
```

## Output Format

```
## Convention Check Report

### Passed (14/16)
- ✅ <script setup lang="ts">
- ✅ Primitive from reka-ui
- ✅ cn() for class merging
...

### Failed (2/16)
- ❌ Arrow function assignment
  → File: lib/components/foo/Foo.vue:42
  → Code: const handleChange = () => { ... }
  → Fix: function handleChange() { ... }

- ❌ Standard Tailwind color used
  → File: lib/components/foo/Foo.vue:15
  → Code: bg-gray-100
  → Fix: bg-neutral-10

### Summary
Convention compliance: 87.5% (14/16)
```
