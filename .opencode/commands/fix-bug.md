# Command: Fix Bug

Bug investigation and fix pipeline with test coverage.

## Workflow

```
1. Load memory files
2. Investigate bug
3. Write failing test
4. Fix code
5. Write regression test
6. Validate build
```

## Steps

### Step 1: Load Memory
```
Load: .opencode/memory/conventions.md
```

### Step 2: Run Component Explorer Agent
```
Agent: component-explorer
Purpose: Find relevant code, understand context
```

### Step 3: Write Failing Test
```
Skill: write-tests
Purpose: Create test that reproduces the bug
Verify: Test should fail, confirming bug exists
```

### Step 4: Fix Code
```
Action: Modify the buggy code
Constraint: Follow conventions from memory
```

### Step 5: Write Regression Test
```
Skill: write-tests
Purpose: Add test to prevent regression
```

### Step 6: Run Validate Build Skill
```
Skill: validate-build
Purpose: Run lint + test + build pipeline
```

## Files Involved

| Action | File |
|--------|------|
| Read | `lib/components/{name}/` (buggy component) |
| Read | `test/{Name}.spec.ts` (existing tests) |
| Read | `lib/utils/` (if utility bug) |
| Modify | Source file (fix) |
| Modify/Create | `test/{Name}.spec.ts` (regression test) |

## Skills Used

- `write-tests`
- `validate-build`

## Agents Used

- `component-explorer`
