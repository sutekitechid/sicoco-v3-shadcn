# Hook: Post-Create Build Validation

Automatically run build validation after component creation or variant addition.

## Trigger

After `create-component` or `add-variant` skill completes successfully.

## Action

Run `npm run lint && npm run test` and report results.

## Implementation

After any skill creates or modifies component files:

```bash
npm run lint && npm run test
```

## Value

Immediate feedback on whether the new code integrates cleanly with the existing codebase. Catches:
- Lint violations in new code
- Test failures from new or modified tests
- TypeScript errors

## Complexity

Lightweight — two shell commands. No file modifications.
