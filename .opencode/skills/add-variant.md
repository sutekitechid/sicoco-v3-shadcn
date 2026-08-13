# Skill: Add Variant

Add a new CVA variant or state to an existing component.

## Trigger

User asks to add a variant, state, or style option to an existing component (e.g., "Add a ghost variant to Button", "Add loading state to Input").

## Input

- **component** (required): Component name (e.g., `Button`, `Input`)
- **variantName** (required): Name of the new variant (e.g., `ghost`, `loading`)
- **classes** (optional): Tailwind classes for the variant
- **propType** (optional): If new prop needed (boolean, string union, etc.)

## Output

- Modified `lib/components/{name}/index.ts` — new CVA variant
- Modified `lib/components/{name}/{Name}.vue` — new prop (if needed)
- Modified `test/{Name}.spec.ts` — variant tests
- Modified `snippets/{name}.json` — updated defaults (if needed)

## Workflow

1. Load memory: `.opencode/memory/conventions.md`
2. Read existing `lib/components/{name}/index.ts` to understand current variants
3. Read existing `lib/components/{name}/{Name}.vue` to understand current props
4. Add variant to CVA definition in `index.ts`
5. Add prop to `.vue` if new prop needed
6. Add tests for the new variant
7. Run `convention-checker` agent
8. Run `validate-build` skill

## Example: Add Ghost Variant to Button

### Before (index.ts)
```ts
export const buttonVariants = cva('base...', {
  variants: {
    variant: {
      default: SOLID.primary,
      primary: SOLID.primary,
      secondary: SOLID.secondary,
    },
  },
})
```

### After (index.ts)
```ts
const GHOST = {
  primary: 'bg-transparent text-primary-default hover:bg-primary-subtle ...',
  secondary: 'bg-transparent text-secondary-default hover:bg-secondary-subtle ...',
} as const

export const buttonVariants = cva('base...', {
  variants: {
    variant: {
      default: SOLID.primary,
      primary: SOLID.primary,
      secondary: SOLID.secondary,
      'ghost-primary': GHOST.primary,
      'ghost-secondary': GHOST.secondary,
    },
  },
})
```

### Test Addition
```ts
test('Button ghost primary variant', () => {
  expect(buttonVariants({ variant: 'ghost-primary', size: 'md' })).toContain('bg-transparent')
})
```

## Rules

- Follow existing variant naming convention (kebab-case for compound names)
- Use semantic color tokens, never standard Tailwind colors
- Add `as const` on variant constant objects
- Add `compoundVariants` for disabled/interactive states
- Update tests for every new variant
