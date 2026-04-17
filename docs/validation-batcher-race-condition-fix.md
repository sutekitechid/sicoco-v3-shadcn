# Validation Batcher Race Condition Fix

## Problem

The validation batcher had a race condition bug where validators could be re-added after they were removed:

### Scenario:
1. **T0**: Component calls `registerValidateFuncBatched()` → element exists → queued
2. **T1**: Component unmounts → calls `removeValidateFunc()` → removes from registry
3. **T2**: RAF flush → `processQueue()` runs → **re-adds the validator** (BUG!)

### Root Cause:
- `queueRegistration()` only checks DOM existence at **queue time**
- `removeValidateFunc()` does NOT clear pending queue entries
- `processQueue()` does NOT re-check element existence before processing
- Result: Validators for unmounted components get re-added to registry

## Solution

### 1. Re-check DOM Existence in `processQueue()`

```typescript
// ⚠️ RE-CHECK DOM EXISTENCE: Component may have unmounted since queueing
if (typeof window !== 'undefined') {
  const el = document.querySelector(validationId)
  if (!el) {
    // Element gone (unmounted) - skip this registration
    return
  }
}
```

**Purpose**: Prevents processing stale queue entries for unmounted components

### 2. Add `removePendingRegistration()` Function

```typescript
/**
 * Remove a pending registration from the queue (called when component unmounts)
 */
export function removePendingRegistration(
  validationId: string,
  registry: ValidationRegistry
): void {
  const registryMap = batcherState.queue.get(registry)
  if (registryMap) {
    registryMap.delete(validationId)
    // Cleanup: remove empty registry map
    if (registryMap.size === 0) {
      batcherState.queue.delete(registry)
    }
  }
}
```

**Purpose**: Allows removing pending queue entries before RAF flush

### 3. Call `removePendingRegistration()` in `removeValidateFunc()`

```typescript
// ⚠️ RACE CONDITION FIX: Clear pending queue entry (if any)
// Prevents processQueue() from re-adding validator after unmount
removePendingRegistration(validationId, registryOrRef as ValidationRegistry)
```

**Purpose**: Clears queue entries synchronously when validator is removed

## Defense-in-Depth

This fix uses **two layers of protection**:

1. **Layer 1 (Proactive)**: Remove from queue when `removeValidateFunc()` is called
2. **Layer 2 (Defensive)**: Re-check DOM existence in `processQueue()`

Even if one layer fails (e.g., `removeValidateFunc()` not called), the other layer catches the issue.

## Impact

- ✅ Prevents memory leaks from stale validators
- ✅ Avoids validation errors on unmounted components
- ✅ More robust handling of dynamic forms (v-if, v-show, conditional rendering)
- ✅ No breaking changes to existing API

## Testing

Test coverage should include:
1. Component unmounts before RAF flush → validator not re-added
2. Multiple rapid mount/unmount cycles → queue stays clean
3. Queue cleanup when registry map becomes empty

## Date

2026-04-17
