# Legacy API Removal

## Overview

Removed legacy `Ref<ValidateFunctionObject[]>` API support from form validation system. The codebase now exclusively uses the optimized `ValidationRegistry` structure.

## Motivation

- **Internal Library**: This library is only used internally, no external consumers to worry about
- **Code Simplification**: Eliminates dual-API complexity (`isLegacy` checks)
- **Clearer Intent**: Single, well-defined API is easier to understand and maintain  
- **Zero Runtime Cost**: No need to check and branch on API type

## Changes Made

### 1. Simplified Function Signatures

#### `registerValidateFunc()`

**Before:**
```typescript
function registerValidateFunc(
  func: ValidateFunctionObject,
  registryOrRef: ValidationRegistry | Ref<ValidateFunctionObject[]>
)
```

**After:**
```typescript
function registerValidateFunc(
  func: ValidateFunctionObject,
  registry: ValidationRegistry
)
```

#### `removeValidateFunc()`

**Before:**
```typescript
function removeValidateFunc(
  validationId: string,
  registryOrRef: ValidationRegistry | Ref<ValidateFunctionObject[]>
)
```

**After:**
```typescript
function removeValidateFunc(
  validationId: string,
  registry: ValidationRegistry
)
```

#### `validate()`

**Before:**
```typescript
async function validate({
  slotValidateFuncList?: Ref<ValidateFunctionObject[]>
  registryOrRef?: ValidationRegistry | Ref<ValidateFunctionObject[]>
  emit
  submit
})
```

**After:**
```typescript
async function validate({
  registry: ValidationRegistry
  emit
  submit
})
```

### 2. Removed Dead Code

- ❌ Removed `isLegacy` type detection (`'value' in registryOrRef`)
- ❌ Removed O(n) `findIndex` fallback path
- ❌ Removed `slotValidateFuncList` parameter
- ❌ Removed conditional WeakMap instantiation for legacy
- ❌ Removed conditional pruning logic (`if (!isLegacy && ...)`)
- ❌ Removed unused `Ref` imports

### 3. Updated Components

**FormInput.vue:**
```diff
- validate({ registryOrRef: validationRegistry, emit, submit })
+ validate({ registry: validationRegistry, emit, submit })
```

### 4. Updated Tests

- Removed 2 legacy-specific tests:
  - `should not prune for legacy API (backward compatibility)`
  - `should clear cache for legacy API (always recompute)`
- Updated 31 test calls: `registryOrRef:` → `registry:`

## Migration Guide

### For Internal Codebase

✅ **No migration needed** - Production code (FormInput.vue, BaseInput.vue, AccordionContent.vue) already uses `ValidationRegistry`.

### If External Users Exist (Not Applicable Here)

If this was a public library, users would need to:

```typescript
// ❌ Old (no longer supported)
const list = ref<ValidateFunctionObject[]>([])
registerValidateFunc(func, list)

// ✅ New (required)
const registry = reactive(createValidationRegistry())
registerValidateFunc(func, registry)
```

## Benefits

### Before (Dual API)
```typescript
const isLegacy = 'value' in registryOrRef
const list = isLegacy ? registryOrRef.value : registryOrRef.list
const map = isLegacy ? null : registryOrRef.map

if (map) {
  // Fast path: O(1) lookup
  const existing = map.get(func.validationId)
  // ...
} else {
  // Slow path: O(n) lookup
  const funcIndex = list.findIndex(...)
  // ...
}
```

### After (Single API)
```typescript
// Always fast path: O(1) lookup
const existing = registry.map.get(func.validationId)
// ...
```

## Performance Impact

**Before:** Type detection + branching overhead on every call  
**After:** Direct access, zero branching overhead

## Test Results

✅ **All 501 tests passing** after legacy removal  
✅ **No TypeScript errors**  
✅ **No breaking changes** to internal codebase

## Date

2026-04-17
