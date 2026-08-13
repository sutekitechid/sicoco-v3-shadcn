# Skill: Write Tests

Write or extend Vitest unit tests for a component or utility.

## Trigger

User asks to add tests, improve test coverage, or test a specific behavior.

## Input

- **target** (required): Component or utility name (e.g., `Button`, `tw-merge`)
- **behaviors** (optional): Specific behaviors to test
- **file** (optional): Existing test file to extend

## Output

- New or updated `test/{Name}.spec.ts`

## Workflow

1. Read the component/utility source code
2. Check if test file already exists in `test/`
3. Identify testable behaviors:
   - Props rendering and defaults
   - Emits triggered correctly
   - User interactions (click, input)
   - Conditional rendering (loading, empty, error)
   - Accessibility attributes
   - Variant class output
4. Write tests following project patterns
5. Run `npm run test` to verify

## Test Patterns

### Component Rendering
```ts
test('Component renders content', () => {
  const wrapper = mount(Component, {
    slots: { default: 'Hello' },
  })
  expect(wrapper.text()).toContain('Hello')
})
```

### Props and Defaults
```ts
test('Component applies default variant', () => {
  const wrapper = mount(Component)
  expect(wrapper.classes()).toContain('expected-class')
})

test('Component applies custom variant', () => {
  const wrapper = mount(Component, {
    props: { variant: 'secondary' },
  })
  expect(wrapper.classes()).toContain('secondary-class')
})
```

### Emits
```ts
test('Component emits event on action', async () => {
  const wrapper = mount(Component)
  await wrapper.find('[data-testid="action"]').trigger('click')
  expect(wrapper.emitted('eventName')).toBeTruthy()
})
```

### CVA Variants
```ts
test('Component variant classes are correct', () => {
  expect(componentVariants({ variant: 'default', size: 'md' })).toContain('expected')
})

test('Component disabled variant', () => {
  expect(componentVariants({ variant: 'primary', disabled: true })).toContain('cursor-not-allowed')
})
```

### Accessibility
```ts
test('Component has correct ARIA attributes', () => {
  const wrapper = mount(Component)
  expect(wrapper.attributes('role')).toBe('button')
})
```

## Utility Tests
```ts
import { cn } from '../lib/utils/tw-merge'

test('cn merges classes correctly', () => {
  expect(cn('foo', 'bar')).toBe('foo bar')
})

test('cn deduplicates conflicting classes', () => {
  expect(cn('p-2', 'p-4')).toBe('p-4')
})
```

## File Location

- Component tests: `test/{Name}.spec.ts`
- Utility tests: `test/utils-{name}.spec.ts`
- Composable tests: `test/use-{name}.spec.ts`

## Rules

- Import from relative paths (e.g., `../lib/components/button/Button.vue`)
- Import CVA variants separately for variant class testing
- Use `@vue/test-utils` `mount()` for component mounting
- Test both happy path and edge cases
- Include at least: render test, variant test, emit test
