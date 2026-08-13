# Hook: Pre-Commit Convention Check

Run convention validation on staged files before commit.

## Trigger

Before any file is committed (git pre-commit hook).

## Action

Run `convention-checker` agent on all staged `.vue` and `.ts` files.

## Implementation

```bash
# In .husky/pre-commit (add after lint-staged)
npx opencode run convention-checker --staged
```

Or via lint-staged in `lint-staged.config.js`:

```js
module.exports = {
  '*.{vue,ts}': [
    'eslint --fix',
    // Convention check would run here
  ],
}
```

## Value

Catches 80% of PR review feedback before it reaches the PR:
- Arrow function assignments
- Standard Tailwind color usage
- Missing function declarations
- Nested if statements

## Complexity

Lightweight — reads staged files, runs pattern checks, outputs warnings. No file modifications.
