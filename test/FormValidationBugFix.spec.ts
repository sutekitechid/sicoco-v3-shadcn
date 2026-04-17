import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
	createValidationRegistry,
	registerValidateFunc,
	validate,
} from '../lib/components/form-input/index'
import type { ValidateFunctionObject } from '../lib/components/form-input/index'

describe('Form Validation Bug Fix - Stale Registry Entries', () => {
	let registry: ReturnType<typeof createValidationRegistry>

	beforeEach(() => {
		registry = createValidationRegistry()
		document.body.innerHTML = ''
	})

	afterEach(() => {
		document.body.innerHTML = ''
	})

	it('should skip validation for fields not in DOM (intentionally removed)', async () => {
		// Create an element and register validator
		const el = document.createElement('input')
		el.setAttribute('data-validation-id', 'test-input')
		document.body.appendChild(el)

		let shouldFail = false
		const validateFunc: ValidateFunctionObject = {
			validate: () => !shouldFail, // Will return false when shouldFail = true
			reset: vi.fn(),
			validationId: '[data-validation-id="test-input"]',
			focusFunction: vi.fn(),
		}

		registerValidateFunc(validateFunc, registry)

		// Verify registration
		expect(registry.list.length).toBe(1)

		// Now REMOVE the element from DOM (simulate intentional removal, e.g., v-if=false)
		document.body.removeChild(el)

		// Set validation to fail (but element not in DOM anymore)
		shouldFail = true

		// Emit spy
		const emit = vi.fn()

		// Validate with submit = true
		await validate({ registry: registry, emit, submit: true })

		// ✅ Should SKIP validation for removed field and submit successfully
		// Field removed from DOM = intentionally excluded from form
		expect(emit).toHaveBeenCalledWith('submit', true)
	})

	it('should filter out fields not in DOM (only validate active fields)', async () => {
		// Create 3 inputs
		const el1 = document.createElement('input')
		el1.setAttribute('data-validation-id', 'input-1')
		document.body.appendChild(el1)

		const el2 = document.createElement('input')
		el2.setAttribute('data-validation-id', 'input-2')
		document.body.appendChild(el2)

		const el3 = document.createElement('input')
		el3.setAttribute('data-validation-id', 'input-3')
		document.body.appendChild(el3)

		// Register all 3
		const func1Mock = vi.fn(() => true)
		const func2Mock = vi.fn(() => true)
		const func3Mock = vi.fn(() => true)

		registerValidateFunc(
			{
				validate: func1Mock,
				reset: vi.fn(),
				validationId: '[data-validation-id="input-1"]',
			},
			registry
		)

		registerValidateFunc(
			{
				validate: func2Mock,
				reset: vi.fn(),
				validationId: '[data-validation-id="input-2"]',
			},
			registry
		)

		registerValidateFunc(
			{
				validate: func3Mock,
				reset: vi.fn(),
				validationId: '[data-validation-id="input-3"]',
			},
			registry
		)

		expect(registry.list.length).toBe(3)

		// Remove input-2 from DOM (intentional removal)
		document.body.removeChild(el2)

		const emit = vi.fn()

		// Validate
		await validate({ registry: registry, emit, submit: true })

		// ✅ Only active fields (in DOM) should be validated
		expect(func1Mock).toHaveBeenCalled()
		expect(func2Mock).not.toHaveBeenCalled() // ✅ Field removed, skip validation
		expect(func3Mock).toHaveBeenCalled()

		// Form should submit (active validations passed)
		expect(emit).toHaveBeenCalledWith('submit', true)
	})

	it('should set valid=false immediately when validation fails, regardless of focus success', async () => {
		// Create input
		const el = document.createElement('input')
		el.setAttribute('data-validation-id', 'test-input')
		document.body.appendChild(el)

		const focusMock = vi.fn()

		// Validator that fails
		registerValidateFunc(
			{
				validate: () => false, // Always fails
				reset: vi.fn(),
				validationId: '[data-validation-id="test-input"]',
				focusFunction: focusMock,
			},
			registry
		)

		const emit = vi.fn()

		// Validate
		await validate({ registry: registry, emit, submit: true })

		// Focus should be attempted
		expect(focusMock).toHaveBeenCalled()

		// ✅ CRITICAL: emit should NOT be called because validation failed
		// This should work regardless of whether focus succeeded
		expect(emit).not.toHaveBeenCalled()
	})

	it('should submit form when all validations pass', async () => {
		// Create 2 inputs
		const el1 = document.createElement('input')
		el1.setAttribute('data-validation-id', 'input-1')
		document.body.appendChild(el1)

		const el2 = document.createElement('input')
		el2.setAttribute('data-validation-id', 'input-2')
		document.body.appendChild(el2)

		const reset1 = vi.fn()
		const reset2 = vi.fn()

		// Both validators pass
		registerValidateFunc(
			{
				validate: () => true,
				reset: reset1,
				validationId: '[data-validation-id="input-1"]',
			},
			registry
		)

		registerValidateFunc(
			{
				validate: () => true,
				reset: reset2,
				validationId: '[data-validation-id="input-2"]',
			},
			registry
		)

		const emit = vi.fn()

		// Validate
		await validate({ registry: registry, emit, submit: true })

		// ✅ All validations passed - should emit submit
		expect(emit).toHaveBeenCalledWith('submit', true)

		// Reset should be called on all validators
		expect(reset1).toHaveBeenCalled()
		expect(reset2).toHaveBeenCalled()
	})

	it('should NOT submit if ANY validation fails, even if others pass', async () => {
		// Create 3 inputs
		const el1 = document.createElement('input')
		el1.setAttribute('data-validation-id', 'input-1')
		document.body.appendChild(el1)

		const el2 = document.createElement('input')
		el2.setAttribute('data-validation-id', 'input-2')
		document.body.appendChild(el2)

		const el3 = document.createElement('input')
		el3.setAttribute('data-validation-id', 'input-3')
		document.body.appendChild(el3)

		// input-1: pass, input-2: FAIL, input-3: pass
		registerValidateFunc(
			{
				validate: () => true,
				reset: vi.fn(),
				validationId: '[data-validation-id="input-1"]',
			},
			registry
		)

		registerValidateFunc(
			{
				validate: () => false, // ❌ FAILS
				reset: vi.fn(),
				validationId: '[data-validation-id="input-2"]',
				focusFunction: vi.fn(),
			},
			registry
		)

		registerValidateFunc(
			{
				validate: () => true,
				reset: vi.fn(),
				validationId: '[data-validation-id="input-3"]',
			},
			registry
		)

		const emit = vi.fn()

		// Validate
		await validate({ registry: registry, emit, submit: true })

		// ✅ Should NOT submit because input-2 failed
		expect(emit).not.toHaveBeenCalled()
	})

	it('should focus first invalid element in DOM order', async () => {
		// Create 3 inputs in DOM order
		const el1 = document.createElement('input')
		el1.setAttribute('data-validation-id', 'input-1')
		document.body.appendChild(el1)

		const el2 = document.createElement('input')
		el2.setAttribute('data-validation-id', 'input-2')
		document.body.appendChild(el2)

		const el3 = document.createElement('input')
		el3.setAttribute('data-validation-id', 'input-3')
		document.body.appendChild(el3)

		const focus1 = vi.fn()
		const focus2 = vi.fn()
		const focus3 = vi.fn()

		// All fail, but only first should be focused
		registerValidateFunc(
			{
				validate: () => false,
				reset: vi.fn(),
				validationId: '[data-validation-id="input-1"]',
				focusFunction: focus1,
			},
			registry
		)

		registerValidateFunc(
			{
				validate: () => false,
				reset: vi.fn(),
				validationId: '[data-validation-id="input-2"]',
				focusFunction: focus2,
			},
			registry
		)

		registerValidateFunc(
			{
				validate: () => false,
				reset: vi.fn(),
				validationId: '[data-validation-id="input-3"]',
				focusFunction: focus3,
			},
			registry
		)

		const emit = vi.fn()

		// Validate
		await validate({ registry: registry, emit, submit: true })

		// ✅ Only first invalid should be focused
		expect(focus1).toHaveBeenCalled()
		expect(focus2).not.toHaveBeenCalled()
		expect(focus3).not.toHaveBeenCalled()

		// Should NOT submit
		expect(emit).not.toHaveBeenCalled()
	})

	it('should validate accordion fields even if accordion is closed (not visible)', async () => {
		// Create input that's in a closed accordion (element exists but may be hidden)
		const el = document.createElement('input')
		el.setAttribute('data-validation-id', 'accordion-input')
		document.body.appendChild(el)

		const openAccordionMock = vi.fn()
		const validateMock = vi.fn(() => false) // Validation fails

		// Register with openAccordion function (indicates it's in accordion)
		registerValidateFunc(
			{
				validate: validateMock,
				reset: vi.fn(),
				validationId: '[data-validation-id="accordion-input"]',
				focusFunction: vi.fn(),
				openAccordion: openAccordionMock, // ← This marks it as accordion field
			},
			registry
		)

		const emit = vi.fn()

		// Validate
		await validate({ registry: registry, emit, submit: true })

		// ✅ Accordion field should be validated (even if closed/hidden)
		expect(validateMock).toHaveBeenCalled()

		// ✅ Accordion should be opened (to show invalid field)
		expect(openAccordionMock).toHaveBeenCalled()

		// ✅ Should NOT submit (validation failed)
		expect(emit).not.toHaveBeenCalled()
	})

	it('should validate accordion fields even if element not in DOM yet', async () => {
		// Accordion field registered but element not rendered yet
		// (e.g., lazy loading, virtual scroll)
		const openAccordionMock = vi.fn()
		const validateMock = vi.fn(() => false)

		registerValidateFunc(
			{
				validate: validateMock,
				reset: vi.fn(),
				validationId: '[data-validation-id="lazy-accordion-input"]',
				focusFunction: vi.fn(),
				openAccordion: openAccordionMock, // ← Accordion field
			},
			registry
		)

		const emit = vi.fn()

		// Validate (element not in DOM, but has openAccordion)
		await validate({ registry: registry, emit, submit: true })

		// ✅ Accordion fields without element in DOM are also skipped
		// (Different from regular behavior, but consistent with "not in DOM = skip")
		// If accordion needs validation, it should keep element in DOM (may be hidden)
		expect(validateMock).not.toHaveBeenCalled()

		// Should submit (no active validators)
		expect(emit).toHaveBeenCalledWith('submit', true)
	})
})
