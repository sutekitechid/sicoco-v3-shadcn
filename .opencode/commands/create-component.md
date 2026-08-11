# Command: Create Component

Full component creation pipeline with validation.

## Workflow

```
1. Load memory files
2. Explore existing patterns
3. Create component files
4. Validate conventions
5. Validate build
```

## Steps

### Step 1: Load Memory
```
Load: .opencode/memory/conventions.md
Load: .opencode/memory/component-anatomy.md
Load: .opencode/memory/exports.md
```

### Step 2: Run Component Explorer Agent
```
Agent: component-explorer
Purpose: Find similar components, reusable pieces
```

### Step 3: Execute Create Component Skill
```
Skill: create-component
Creates: .vue, index.ts, test, demo, snippet, main.ts export
```

### Step 4: Run Convention Checker Agent
```
Agent: convention-checker
Purpose: Validate all new files follow conventions
```

### Step 5: Run Validate Build Skill
```
Skill: validate-build
Purpose: Run lint + test + build pipeline
```

## Files Involved

| Action | File |
|--------|------|
| Read | `lib/components/*/` (exploration) |
| Read | `lib/composables/` (reusable logic) |
| Read | `lib/utils/` (reusable helpers) |
| Read | `lib/main.ts` (exports) |
| Create | `lib/components/{name}/{Name}.vue` |
| Create | `lib/components/{name}/index.ts` |
| Create | `test/{Name}.spec.ts` |
| Create | `src/pages/{name}.vue` |
| Create | `snippets/{name}.json` |
| Modify | `lib/main.ts` |

## Skills Used

- `create-component`
- `validate-build`

## Agents Used

- `component-explorer`
- `convention-checker`
