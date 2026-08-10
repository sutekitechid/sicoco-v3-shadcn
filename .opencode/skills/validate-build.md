# Skill: Validate Build

Run the full lint + test + build pipeline and report results.

## Trigger

User asks to validate, check, or verify the build.

## Input

- **scope** (optional): `all` (default), `lint`, `test`, `build`

## Output

Status report with errors and file:line references.

## Workflow

1. Run `npm run lint` — ESLint check
2. Run `npm run test` — Vitest unit tests
3. Run `npm run build` — vue-tsc + vite build
4. Report results

## Commands

```bash
# Full pipeline
npm run lint && npm run test && npm run build

# Individual
npm run lint        # ESLint only
npm run test        # Vitest only
npm run build       # Type check + build only
```

## Output Format

```
## Build Validation

### Lint
✅ No errors or warnings

### Tests
✅ 79 tests passed (0 failed)

### Build
✅ Build successful
  - dist/main.js (412 KB)
  - dist/main.d.ts
```

Or on failure:

```
## Build Validation

### Lint
❌ 2 errors
  - lib/components/foo/Foo.vue:42 — @typescript-eslint/no-unused-vars: 'value' is defined but never used
  - lib/components/bar/Bar.ts:15 — prefer-const: 'let' can be converted to 'const'

### Tests
❌ 1 failed
  - test/Foo.spec.ts:23 — expected 'bg-primary-default' to contain 'bg-blue-500'

### Build
❌ Build failed
  - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'
  - at lib/components/foo/Foo.vue:18
```

## Rules

- Always run all three stages
- Report first error of each type, not all errors
- Include file:line references for quick navigation
- If lint fails, still run tests and build to get full picture
