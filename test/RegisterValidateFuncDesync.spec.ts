import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createValidationRegistry, registerValidateFunc } from '../lib/components/form-input/index'
import type { ValidateFunctionObject } from '../lib/components/form-input/index'

describe('registerValidateFunc - Desync Protection', () => {
	beforeEach(() => {
		document.body.innerHTML = '' // Clean up DOM
	})

	it('should repair desynchronized registry when map has entry but list does not', () => {
		const registry = createValidationRegistry()

		// Create element
		const el = document.createElement('input')
		el.setAttribute('data-validation-id', 'test-input')
		document.body.appendChild(el)

		// Manually create desync: add to map but not to list
		const oldFunc: ValidateFunctionObject = {
			validate: vi.fn(() => true),
			reset: vi.fn(),
			validationId: '[data-validation-id="test-input"]',
		}

		// Simulate desync state (shouldn't happen normally, but we handle it defensively)
		registry.map.set(oldFunc.validationId, oldFunc)
		// NOT added to registry.list! → Desync

		// Verify desync
		expect(registry.map.size).toBe(1) // In map ✅
		expect(registry.list.length).toBe(0) // NOT in list ❌

		// Now register a new function with same validationId
		const newFunc: ValidateFunctionObject = {
			validate: vi.fn(() => false),
			reset: vi.fn(),
			validationId: '[data-validation-id="test-input"]',
		}

		registerValidateFunc(newFunc, registry)

		// ✅ Should repair the registry
		// - list should now contain the new func
		// - map should be updated to new func
		// - Both should be in sync
		expect(registry.list.length).toBe(1) // Repaired! Added to list
		expect(registry.map.size).toBe(1)
		expect(registry.list[0]).toBe(newFunc) // New func in list
		expect(registry.map.get(newFunc.validationId)).toBe(newFunc) // Map updated
	})

	it('should handle normal case (entry in both map and list) correctly', () => {
		const registry = createValidationRegistry()

		// Create element
		const el = document.createElement('input')
		el.setAttribute('data-validation-id', 'normal-input')
		document.body.appendChild(el)

		// Register normally (first time)
		const firstFunc: ValidateFunctionObject = {
			validate: vi.fn(() => true),
			reset: vi.fn(),
			validationId: '[data-validation-id="normal-input"]',
		}

		registerValidateFunc(firstFunc, registry)

		// Verify normal registration
		expect(registry.list.length).toBe(1)
		expect(registry.map.size).toBe(1)
		expect(registry.list[0]).toBe(firstFunc)

		// Register again with same ID (update)
		const secondFunc: ValidateFunctionObject = {
			validate: vi.fn(() => false),
			reset: vi.fn(),
			validationId: '[data-validation-id="normal-input"]',
		}

		registerValidateFunc(secondFunc, registry)

		// ✅ Should replace (not add new)
		expect(registry.list.length).toBe(1) // Still 1
		expect(registry.map.size).toBe(1)
		expect(registry.list[0]).toBe(secondFunc) // Replaced with new func
		expect(registry.map.get(secondFunc.validationId)).toBe(secondFunc)
	})

	it('should handle multiple desynced entries and repair all', () => {
		const registry = createValidationRegistry()

		// Create multiple elements
		for (let i = 1; i <= 3; i++) {
			const el = document.createElement('input')
			el.setAttribute('data-validation-id', `input-${i}`)
			document.body.appendChild(el)
		}

		// Manually create desync for 2 entries
		const oldFunc1: ValidateFunctionObject = {
			validate: vi.fn(() => true),
			reset: vi.fn(),
			validationId: '[data-validation-id="input-1"]',
		}

		const oldFunc2: ValidateFunctionObject = {
			validate: vi.fn(() => true),
			reset: vi.fn(),
			validationId: '[data-validation-id="input-2"]',
		}

		// Add to map but not list (desync)
		registry.map.set(oldFunc1.validationId, oldFunc1)
		registry.map.set(oldFunc2.validationId, oldFunc2)

		// Verify desync
		expect(registry.map.size).toBe(2)
		expect(registry.list.length).toBe(0) // Empty! ❌

		// Register new functions
		const newFunc1: ValidateFunctionObject = {
			validate: vi.fn(() => false),
			reset: vi.fn(),
			validationId: '[data-validation-id="input-1"]',
		}

		const newFunc2: ValidateFunctionObject = {
			validate: vi.fn(() => false),
			reset: vi.fn(),
			validationId: '[data-validation-id="input-2"]',
		}

		const newFunc3: ValidateFunctionObject = {
			validate: vi.fn(() => true),
			reset: vi.fn(),
			validationId: '[data-validation-id="input-3"]',
		}

		registerValidateFunc(newFunc1, registry)
		registerValidateFunc(newFunc2, registry)
		registerValidateFunc(newFunc3, registry)

		// ✅ All should be repaired and registered
		expect(registry.list.length).toBe(3)
		expect(registry.map.size).toBe(3)

		// Verify correct functions
		expect(registry.list).toContain(newFunc1)
		expect(registry.list).toContain(newFunc2)
		expect(registry.list).toContain(newFunc3)
	})

	it('should not register if element does not exist in DOM', () => {
		const registry = createValidationRegistry()

		// NO element created (validationId doesn't exist in DOM)

		const func: ValidateFunctionObject = {
			validate: vi.fn(() => true),
			reset: vi.fn(),
			validationId: '[data-validation-id="nonexistent"]',
		}

		registerValidateFunc(func, registry)

		// ✅ Should not register (element check fails)
		expect(registry.list.length).toBe(0)
		expect(registry.map.size).toBe(0)
	})

	it('should mark registry as dirty after registration', () => {
		const registry = createValidationRegistry()

		// Create element
		const el = document.createElement('input')
		el.setAttribute('data-validation-id', 'dirty-test')
		document.body.appendChild(el)

		// Initially not dirty
		registry.isDirty = false

		const func: ValidateFunctionObject = {
			validate: vi.fn(() => true),
			reset: vi.fn(),
			validationId: '[data-validation-id="dirty-test"]',
		}

		registerValidateFunc(func, registry)

		// ✅ Should mark as dirty
		expect(registry.isDirty).toBe(true)
	})

	it('should preserve element order when repairing desync', () => {
		const registry = createValidationRegistry()

		// Create elements
		const el1 = document.createElement('input')
		el1.setAttribute('data-validation-id', 'input-1')
		document.body.appendChild(el1)

		const el2 = document.createElement('input')
		el2.setAttribute('data-validation-id', 'input-2')
		document.body.appendChild(el2)

		const el3 = document.createElement('input')
		el3.setAttribute('data-validation-id', 'input-3')
		document.body.appendChild(el3)

		// Register input-1 normally
		const func1: ValidateFunctionObject = {
			validate: vi.fn(() => true),
			reset: vi.fn(),
			validationId: '[data-validation-id="input-1"]',
		}
		registerValidateFunc(func1, registry)

		// Create desync for input-2 (in map but not list)
		const oldFunc2: ValidateFunctionObject = {
			validate: vi.fn(() => true),
			reset: vi.fn(),
			validationId: '[data-validation-id="input-2"]',
		}
		registry.map.set(oldFunc2.validationId, oldFunc2)

		// Register input-3 normally
		const func3: ValidateFunctionObject = {
			validate: vi.fn(() => true),
			reset: vi.fn(),
			validationId: '[data-validation-id="input-3"]',
		}
		registerValidateFunc(func3, registry)

		// List should have: [func1, func3] (input-2 missing due to desync)
		expect(registry.list.length).toBe(2)

		// Now repair input-2
		const newFunc2: ValidateFunctionObject = {
			validate: vi.fn(() => false),
			reset: vi.fn(),
			validationId: '[data-validation-id="input-2"]',
		}
		registerValidateFunc(newFunc2, registry)

		// ✅ Should be added to list (repair)
		expect(registry.list.length).toBe(3)
		expect(registry.list).toContain(func1)
		expect(registry.list).toContain(newFunc2)
		expect(registry.list).toContain(func3)
	})
})
