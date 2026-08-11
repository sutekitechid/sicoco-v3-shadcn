# Command: Add Variant

Variant addition pipeline with validation.

## Workflow

```
1. Load memory files
2. Read existing component
3. Add variant
4. Validate conventions
5. Validate build
```

## Steps

### Step 1: Load Memory
```
Load: .opencode/memory/conventions.md
```

### Step 2: Read Existing Component
```
Read: lib/components/{name}/index.ts
Read: lib/components/{name}/{Name}.vue
Read: test/{Name}.spec.ts (if exists)
```

### Step 3: Execute Add Variant Skill
```
Skill: add-variant
Modifies: index.ts, .vue, test
```

### Step 4: Run Convention Checker Agent
```
Agent: convention-checker
Purpose: Validate modified files follow conventions
```

### Step 5: Run Validate Build Skill
```
Skill: validate-build
Purpose: Run lint + test + build pipeline
```

## Files Involved

| Action | File |
|--------|------|
| Read | `lib/components/{name}/index.ts` |
| Read | `lib/components/{name}/{Name}.vue` |
| Read | `test/{Name}.spec.ts` |
| Modify | `lib/components/{name}/index.ts` |
| Modify | `lib/components/{name}/{Name}.vue` |
| Modify | `test/{Name}.spec.ts` |

## Skills Used

- `add-variant`
- `validate-build`

## Agents Used

- `convention-checker`
