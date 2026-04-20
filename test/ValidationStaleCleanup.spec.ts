import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { createValidationRegistry, registerValidateFunc, validate } from '../lib/components/form-input/index'

describe('Validation - Stale Validator Cleanup', () => {
	beforeEach(() => {
		document.body.innerHTML = '' // Clean up DOM
	})

	it('should only reset active validators on submit, not stale ones', async () => {
		const registry = createValidationRegistry()

		const container = document.createElement('div')
		document.body.appendChild(container)

		// Create 2 elements
		const el1 = document.createElement('input')
		el1.setAttribute('data-validation-id', 'field-1')
		container.appendChild(el1)

		const el2 = document.createElement('input')
		el2.setAttribute('data-validation-id', 'field-2')
		container.appendChild(el2)

		// Register validators with reset spies
		const reset1 = vi.fn()
		const reset2 = vi.fn()

		registerValidateFunc(
			{
				validate: vi.fn(() => true),
				reset: reset1,
				validationId: '[data-validation-id="field-1"]',
			},
			registry
		)

		registerValidateFunc(
			{
				validate: vi.fn(() => true),
				reset: reset2,
				validationId: '[data-validation-id="field-2"]',
			},
			registry
		)

		// Remove field-2 from DOM (simulate unmount)
		container.removeChild(el2)

		// Validate and submit
		const emit = vi.fn()
		await validate({ registry: registry, emit, submit: true })

		// ✅ Should reset only field-1 (active)
		expect(reset1).toHaveBeenCalled()
		
		// ✅ Should NOT reset field-2 (stale, removed from DOM)
		expect(reset2).not.toHaveBeenCalled()

		// ✅ Should emit submit
		expect(emit).toHaveBeenCalledWith('submit', true)
	})

	it('should prune stale validators from registry', async () => {
		const registry = createValidationRegistry()

		const container = document.createElement('div')
		document.body.appendChild(container)

		// Create 3 elements
		const el1 = document.createElement('input')
		el1.setAttribute('data-validation-id', 'item-1')
		container.appendChild(el1)

		const el2 = document.createElement('input')
		el2.setAttribute('data-validation-id', 'item-2')
		container.appendChild(el2)

		const el3 = document.createElement('input')
		el3.setAttribute('data-validation-id', 'item-3')
		container.appendChild(el3)

		// Register all
		registerValidateFunc(
			{
				validate: vi.fn(() => true),
				reset: vi.fn(),
				validationId: '[data-validation-id="item-1"]',
			},
			registry
		)

		registerValidateFunc(
			{
				validate: vi.fn(() => true),
				reset: vi.fn(),
				validationId: '[data-validation-id="item-2"]',
			},
			registry
		)

		registerValidateFunc(
			{
				validate: vi.fn(() => true),
				reset: vi.fn(),
				validationId: '[data-validation-id="item-3"]',
			},
			registry
		)

		expect(registry.list.length).toBe(3)
		expect(registry.map.size).toBe(3)

		// Remove item-2 from DOM
		container.removeChild(el2)

		// Validate (should trigger cleanup)
		await validate({ registry: registry, emit: vi.fn(), submit: true })

		// ✅ Should prune item-2 from registry
		expect(registry.list.length).toBe(2)
		expect(registry.map.size).toBe(2)

		// ✅ item-2 should be removed from map
		expect(registry.map.has('[data-validation-id="item-2"]')).toBe(false)

		// ✅ item-1 and item-3 should remain
		expect(registry.map.has('[data-validation-id="item-1"]')).toBe(true)
		expect(registry.map.has('[data-validation-id="item-3"]')).toBe(true)
	})

	it('should handle multiple stale validators', async () => {
		const registry = createValidationRegistry()

		const container = document.createElement('div')
		document.body.appendChild(container)

		// Create 5 elements
		const elements = []
		for (let i = 1; i <= 5; i++) {
			const el = document.createElement('input')
			el.setAttribute('data-validation-id', `field-${i}`)
			container.appendChild(el)
			elements.push(el)

			registerValidateFunc(
				{
					validate: vi.fn(() => true),
					reset: vi.fn(),
					validationId: `[data-validation-id="field-${i}"]`,
				},
				registry
			)
		}

		expect(registry.list.length).toBe(5)

		// Remove field-2, field-4 (2 stale validators)
		container.removeChild(elements[1])
		container.removeChild(elements[3])

		// Validate
		await validate({ registry: registry, emit: vi.fn(), submit: true })

		// ✅ Should prune both stale validators
		expect(registry.list.length).toBe(3)
		expect(registry.map.size).toBe(3)

		// ✅ Remaining: field-1, field-3, field-5
		expect(registry.map.has('[data-validation-id="field-1"]')).toBe(true)
		expect(registry.map.has('[data-validation-id="field-2"]')).toBe(false)
		expect(registry.map.has('[data-validation-id="field-3"]')).toBe(true)
		expect(registry.map.has('[data-validation-id="field-4"]')).toBe(false)
		expect(registry.map.has('[data-validation-id="field-5"]')).toBe(true)
	})

	it('should not throw errors when reset() accesses unmounted component state', async () => {
		const registry = createValidationRegistry()

		const container = document.createElement('div')
		document.body.appendChild(container)

		const el = document.createElement('input')
		el.setAttribute('data-validation-id', 'unmounted-field')
		container.appendChild(el)

		// Simulate reset that throws when component unmounted
		const dangerousReset = vi.fn(() => {
			throw new Error('Cannot access component state after unmount')
		})

		registerValidateFunc(
			{
				validate: vi.fn(() => true),
				reset: dangerousReset,
				validationId: '[data-validation-id="unmounted-field"]',
			},
			registry
		)

		// Remove from DOM (unmount)
		container.removeChild(el)

		// ✅ Should NOT throw error (reset not called on stale validators)
		const emit = vi.fn()
		await expect(
			validate({ registry: registry, emit, submit: true })
		).resolves.not.toThrow()

		// ✅ Dangerous reset should NOT be called
		expect(dangerousReset).not.toHaveBeenCalled()

		// ✅ Should still emit submit (no active validators = valid)
		expect(emit).toHaveBeenCalledWith('submit', true)
	})

	it('should prune incrementally (not all at once)', async () => {
		const registry = createValidationRegistry()

		const container = document.createElement('div')
		document.body.appendChild(container)

		// Create 3 elements
		const elements = []
		for (let i = 1; i <= 3; i++) {
			const el = document.createElement('input')
			el.setAttribute('data-validation-id', `incremental-${i}`)
			container.appendChild(el)
			elements.push(el)

			registerValidateFunc(
				{
					validate: vi.fn(() => true),
					reset: vi.fn(),
					validationId: `[data-validation-id="incremental-${i}"]`,
				},
				registry
			)
		}

		expect(registry.list.length).toBe(3)

		// First validation: remove field 1
		container.removeChild(elements[0])
		await validate({ registry: registry, emit: vi.fn(), submit: true })

		// ✅ Should prune field 1
		expect(registry.list.length).toBe(2)
		expect(registry.map.has('[data-validation-id="incremental-1"]')).toBe(false)

		// Second validation: remove field 2
		container.removeChild(elements[1])
		await validate({ registry: registry, emit: vi.fn(), submit: true })

		// ✅ Should prune field 2
		expect(registry.list.length).toBe(1)
		expect(registry.map.has('[data-validation-id="incremental-2"]')).toBe(false)

		// ✅ Only field 3 remains
		expect(registry.map.has('[data-validation-id="incremental-3"]')).toBe(true)
	})

	it('should mark registry dirty after pruning', async () => {
		const registry = createValidationRegistry()

		const container = document.createElement('div')
		document.body.appendChild(container)

		const el = document.createElement('input')
		el.setAttribute('data-validation-id', 'dirty-test')
		container.appendChild(el)

		registerValidateFunc(
			{
				validate: vi.fn(() => true),
				reset: vi.fn(),
				validationId: '[data-validation-id="dirty-test"]',
			},
			registry
		)

		// First validation clears dirty flag
		await validate({ registry: registry, emit: vi.fn(), submit: true })
		expect(registry.isDirty).toBe(false)

		// Remove from DOM
		container.removeChild(el)

		// Second validation should prune and mark dirty
		await validate({ registry: registry, emit: vi.fn(), submit: true })

		// ✅ Should be marked dirty after pruning
		expect(registry.isDirty).toBe(true)
	})

	it('should handle validation failure with stale validators', async () => {
		const registry = createValidationRegistry()

		const container = document.createElement('div')
		document.body.appendChild(container)

		// Active validator (will fail)
		const el1 = document.createElement('input')
		el1.setAttribute('data-validation-id', 'active-invalid')
		container.appendChild(el1)

		const reset1 = vi.fn()

		registerValidateFunc(
			{
				validate: vi.fn(() => false), // Fails validation
				reset: reset1,
				validationId: '[data-validation-id="active-invalid"]',
			},
			registry
		)

		// Stale validator (removed from DOM)
		const el2 = document.createElement('input')
		el2.setAttribute('data-validation-id', 'stale-valid')
		container.appendChild(el2)

		const reset2 = vi.fn()

		registerValidateFunc(
			{
				validate: vi.fn(() => true), // Would pass, but stale
				reset: reset2,
				validationId: '[data-validation-id="stale-valid"]',
			},
			registry
		)

		// Remove stale validator
		container.removeChild(el2)

		// Validate
		const emit = vi.fn()
		await validate({ registry: registry, emit, submit: true })

		// ✅ Should NOT submit (active validator failed)
		expect(emit).not.toHaveBeenCalled()

		// ✅ Should NOT reset (validation failed)
		expect(reset1).not.toHaveBeenCalled()
		expect(reset2).not.toHaveBeenCalled()

		// ✅ Should still prune stale validator
		expect(registry.list.length).toBe(1)
		expect(registry.map.has('[data-validation-id="stale-valid"]')).toBe(false)
	})
})
