# Agent: Component Explorer

Find existing patterns, similar components, and reusable pieces before creating new code.

## Responsibility

Read-only exploration of the codebase to gather context for development tasks.

## Read-Only Access

This agent never modifies files. It only reads and reports.

## When to Invoke

- Before creating a new component
- Before adding a complex feature
- When investigating how similar components work
- When looking for reusable composables or utilities

## Search Strategy

### 1. Find Similar Components
```
Search: lib/components/*/{name}*.vue
Purpose: Find components with similar naming or behavior
```

### 2. Find Reusable Composables
```
Search: lib/composables/*.ts
Purpose: Check if logic already exists as a composable
```

### 3. Find Reusable Utilities
```
Search: lib/utils/*.ts
Purpose: Check if helper functions already exist
```

### 4. Find Similar Test Patterns
```
Search: test/{Name}*.spec.ts
Purpose: Find test patterns for similar components
```

### 5. Check Existing Exports
```
Search: lib/main.ts
Purpose: See what's already exported and naming patterns
```

## Output Format

```
## Component Explorer Report

### Similar Components Found
- lib/components/dropdown/Dropdown.vue — Similar popup/selection pattern
- lib/components/tooltip/Tooltip.vue — Uses Reka UI Popover primitive

### Reusable Composables
- lib/composables/useBreakpoint.ts — Could be useful for responsive behavior

### Reusable Utilities
- lib/utils/tw-merge.ts — cn() for class merging (standard)

### Existing Test Patterns
- test/Dropdown.spec.ts — Good reference for popup component testing

### Existing Exports
- SDropdown, SDropdownItem already exported
- Naming convention: S + PascalCase

### Recommendation
Use Reka UI SelectRoot/SelectTrigger/SelectContent primitives (like Dropdown).
Follow Dropdown pattern for popup behavior.
```
