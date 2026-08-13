# Command: Review PR

PR review pipeline with convention checking and build validation.

## Workflow

```
1. Load memory files
2. Explore changed files
3. Review against checklist
4. Validate build
5. Report findings
```

## Steps

### Step 1: Load Memory
```
Load: .opencode/memory/conventions.md
```

### Step 2: Run Component Explorer Agent
```
Agent: component-explorer
Purpose: Gather context on changed components
```

### Step 3: Execute Review Component Skill
```
Skill: review-component
Checks: All convention items
```

### Step 4: Run Validate Build Skill
```
Skill: validate-build
Purpose: Run lint + test + build pipeline
```

### Step 5: Report
```
Output: Checklist with pass/fail and fix recommendations
```

## Files Involved

| Action | File |
|--------|------|
| Read | `lib/components/*/` (changed components) |
| Read | `test/` (test files) |
| Read | `src/pages/` (demo pages) |
| Read | `lib/main.ts` (exports) |

## Skills Used

- `review-component`
- `validate-build`

## Agents Used

- `component-explorer`
- `convention-checker`
