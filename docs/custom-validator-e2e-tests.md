# Custom Validator E2E Tests

## Overview
Comprehensive Cypress E2E tests untuk memastikan custom validator berfungsi dengan benar, terutama ketika validator rules berubah secara dinamis.

## Test Coverage

### 1. Custom Validator minLength Changes (5 → 3)
**Test Case:** Validasi berubah dari invalid menjadi valid ketika minLength requirement dikurangi

**Steps:**
1. Input 4 karakter (invalid untuk minLength 5)
2. Verify error message muncul: "Minimum 5 characters required"
3. Change minLength menjadi 3
4. Trigger validation lagi
5. Verify error message TIDAK muncul lagi (4 chars valid untuk minLength 3)

**Expected Result:**
- Validasi adapt ke rules yang baru secara real-time
- Error message di-update atau hilang sesuai dengan custom validator baru

---

### 2. Custom Validator minLength Changes (5 → 10)
**Test Case:** Validasi berubah dari valid menjadi invalid ketika minLength requirement ditingkatkan

**Steps:**
1. Input 7 karakter (valid untuk minLength 5)
2. Verify tidak ada error
3. Change minLength menjadi 10
4. Trigger validation
5. Verify error message muncul: "Minimum 10 characters required"

**Expected Result:**
- Field yang sebelumnya valid sekarang invalid
- Error message di-display dengan requirement yang baru

---

### 3. Real-time Validation Updates dengan Multiple Changes
**Test Case:** Validasi update secara real-time ketika switch bolak-balik antara different minLength values

**Steps:**
1. Input 6 karakter ("medium")
2. Test dengan minLength 3 → should be valid
3. Test dengan minLength 5 → should be valid (6 >= 5)
4. Test dengan minLength 10 → should be invalid (6 < 10)
5. Back to minLength 5 → should be valid again

**Expected Result:**
- Setiap perubahan minLength langsung mempengaruhi validation
- Tidak ada stale validation state
- Error message di-update sesuai dengan current requirement

---

### 4. Empty Value Handling
**Test Case:** Custom validator handle empty value dengan benar terlepas dari minLength requirement

**Steps:**
1. Set minLength = 10
2. Clear field (empty value)
3. Trigger validation
4. Verify tidak ada error (empty value allowed by custom validator)
5. Type 1 karakter
6. Verify error muncul (1 < minLength 10)

**Expected Result:**
- Empty value di-treat sebagai valid (custom validator allows empty)
- Non-empty value yang terlalu pendek tetap invalid

---

### 5. Custom Validator Integration dengan Form Submit
**Test Case:** Custom validator di-validate bersama dengan static validations saat form submit

**Steps:**
1. Fill semua static fields (field-1, field-2, field-3) dengan value valid
2. Set custom validator minLength = 10
3. Input hanya 5 chars di custom validator field (invalid)
4. Submit form
5. Verify custom validator field di-focus (first invalid field)
6. Fix custom validator field (input 10+ chars)
7. Submit lagi
8. Verify validation passed

**Expected Result:**
- Custom validator ter-integrate dalam validation flow
- Focus management bekerja dengan benar
- Form submit hanya berhasil jika ALL validations (including custom) passed

---

## Implementation Details

### Test Page Structure
**File:** `src/pages/form-validation-test.vue`

```vue
<template>
  <!-- Static Fields -->
  <Input v-model="form.field1" required ... />
  <Input v-model="form.field2" required ... />
  <Input v-model="form.field3" required ... />
  
  <!-- Custom Validator Field -->
  <Input
    v-model="customValidatorValue"
    :custom-validators="customValidators"
    data-cy="custom-validator-field"
  >
    <template #errors="{ validation }">
      <div v-if="validation.customMinLength?.$invalid">
        Minimum {{ customValidatorMinLength }} characters required
      </div>
    </template>
  </Input>
  
  <!-- Buttons untuk change minLength -->
  <button @click="setMinLength(3)">Set MinLength = 3</button>
  <button @click="setMinLength(5)">Set MinLength = 5</button>
  <button @click="setMinLength(10)">Set MinLength = 10</button>
</template>

<script setup>
const customValidatorMinLength = ref(5)
const customValidatorValue = ref('')

const customValidators = computed(() => ({
  customMinLength: (value: string) => {
    if (!value) return true // Allow empty
    return value.length >= customValidatorMinLength.value
  }
}))

const setMinLength = (length: number) => {
  customValidatorMinLength.value = length
}
</script>
```

### Key Features

1. **Reactive Custom Validators**
   - `customValidators` adalah computed property
   - Automatically re-evaluate ketika `customValidatorMinLength` berubah
   - Vue reactivity system ensure validation rules selalu up-to-date

2. **Custom Error Messages**
   - Menggunakan template `#errors` slot untuk display custom error
   - Check `validation.customMinLength?.$invalid` untuk detect validation state
   - Display dynamic error message dengan current minLength value

3. **Validation Registration**
   - Custom validator field automatically registered ke FormInput registry
   - Filtered out dari static validations count untuk E2E test assertions
   - Included dalam full validation order dan form submit validation

### Validation Count Filtering

**File:** `src/pages/form-validation-test.vue`

```typescript
const staticValidationsCount = computed(() => {
  if (!formRef.value?.validationRegistry?.list) return 0
  return formRef.value.validationRegistry.list.filter((item) => {
    const selector = item.validationId
    const element = document.querySelector(selector)
    if (!element) return false
    
    // Exclude custom validator field
    const inputElement = element.querySelector('[name="customValidatorField"]')
    return !inputElement
  }).length
})
```

**Purpose:** 
- Existing tests expect specific validation counts (3 static, 6 with dynamics, etc.)
- Custom validator field ditambahkan di tengah form
- Filter by name attribute untuk exclude dari static count
- Maintain backward compatibility dengan existing tests

---

## Test Execution

### Run Custom Validator Tests Only
```bash
npx cypress run --spec cypress/e2e/form-validation.cy.ts --browser electron
```

### Run Full E2E Suite
```bash
npm run test:e2e
```

### Expected Results
```
✔  form-validation.cy.ts    13/13 passing
   - 8 original validation tests
   - 5 custom validator tests (new)
```

---

## Test Results Summary

**Total E2E Tests:** 34/34 passing
- datatable.cy.ts: 3/3 ✅
- form-validation.cy.ts: 13/13 ✅
  - Sequential validation: 2/2 ✅
  - Removed elements: 4/4 ✅
  - Performance: 2/2 ✅
  - **Custom validators: 5/5 ✅ (NEW)**
- input.cy.ts: 18/18 ✅

---

## Key Learnings

### 1. Vue Reactivity untuk Custom Validators
Custom validators harus defined sebagai computed property agar:
- Automatically re-evaluate ketika dependencies berubah
- Validation rules selalu sinkron dengan current state
- Tidak perlu manual re-registration

### 2. Error Message Rendering
Custom validator errors di-handle via:
- Slot `#errors` di Input component
- Check `validation.customValidatorName?.$invalid`
- InputErrorMessage fallback ke slot `#errors` untuk non-built-in validators

### 3. Test Isolation
Custom validator field tidak interfere dengan existing tests karena:
- Static validations count filtered by element name
- Validation registry correctly includes/excludes based on selector
- Test assertions use `[data-cy="static-validations"]` instead of total count

---

## Future Enhancements

### Potential Test Additions
1. **Multiple Custom Validators** - Test dengan 2+ custom validators pada satu field
2. **Async Custom Validators** - Test debounced/async validation (e.g., username availability)
3. **Cross-field Custom Validators** - Validators yang depend on multiple field values
4. **Custom Validator Performance** - Benchmark complex validation logic dengan large datasets

### Code Improvements
1. Extract custom validator logic ke composable untuk reusability
2. Add TypeScript types untuk custom validator function signatures
3. Create custom validator utilities library (common patterns: regex, length, format)

---

## Date
- Feature implemented: 2026-04-17
- Tests created: 2026-04-17
- All tests passing: 2026-04-17

## Author
GitHub Copilot (Claude Sonnet 4.5)
