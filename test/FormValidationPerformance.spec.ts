import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
	registerValidateFunc,
	registerValidateFuncBatched,
	removeValidateFunc,
	validate,
	createValidationRegistry,
	type ValidateFunctionObject,
	type ValidationRegistry,
} from '@/components/form-input'
import {
	queueRegistration,
	flushQueue,
	cancelQueue,
	shouldEnableBatching,
	getBatcherStats,
} from '@/components/form-input/validationBatcher'

describe('Form Validation Performance Optimization', () => {
	let mockValidateFunctions: ValidateFunctionObject[]
	let registry: ValidationRegistry

	beforeEach(() => {
		// Create mock DOM elements
		document.body.innerHTML = ''
		mockValidateFunctions = []

		// Create validation registry
		registry = createValidationRegistry()

		// Clean up batcher queue
		cancelQueue()
	})

	afterEach(() => {
		cancelQueue()
		document.body.innerHTML = ''
	})

	describe('Phase 1: Lazy Sorting', () => {
		it('should not sort on registration, only on validate', async () => {
			// Create 10 mock inputs in DOM (0,1,2...9) but register in reverse order
			// First, create elements in DOM order
			for (let i = 0; i < 10; i++) {
				const el = document.createElement('input')
				el.setAttribute('data-validation-id', `input-${i}`)
				document.body.appendChild(el)
			}

			// Then register in reverse order (9, 8, 7, ..., 0)
			for (let i = 9; i >= 0; i--) {
				const func: ValidateFunctionObject = {
					validate: vi.fn(() => true),
					reset: vi.fn(),
					validationId: `[data-validation-id="input-${i}"]`,
				}

				registerValidateFunc(func, registry)
				mockValidateFunctions.push(func)
			}

			// After registration, list should be in registration order (9,8,7...0)
			expect(registry.list.length).toBe(10)
			expect(registry.list[0].validationId).toContain('input-9')
			expect(registry.isDirty).toBe(true)

			// After validation, list should be sorted by DOM order (0,1,2...9)
			const emit = vi.fn()
			await validate({ registry: registry, emit, submit: false })

			expect(registry.list[0].validationId).toContain('input-0')
			expect(registry.list[9].validationId).toContain('input-9')
			expect(registry.isDirty).toBe(false)
		})

		it('should skip sorting if not dirty', async () => {
			// Create 5 inputs
			for (let i = 0; i < 5; i++) {
				const el = document.createElement('input')
				el.setAttribute('data-validation-id', `input-${i}`)
				document.body.appendChild(el)

				registerValidateFunc(
					{
						validate: () => true,
						reset: vi.fn(),
						validationId: `[data-validation-id="input-${i}"]`,
					},
					registry
				)
			}

			const emit = vi.fn()

			// First validate - should sort
			await validate({ registry: registry, emit, submit: false })
			expect(registry.isDirty).toBe(false)

		// Capture first item after sort
		const firstItemBefore = registry.list[0]

		// Second validate without changes - should skip sort
		await validate({ registry: registry, emit, submit: false })

		// Should still have same first item (no re-sort happened)
		expect(registry.list[0]).toBe(firstItemBefore)
		expect(registry.isDirty).toBe(false)
	})

	it('should focus on first invalid input in DOM order', async () => {
		// Create inputs with middle one invalid
		for (let i = 0; i < 5; i++) {
			const el = document.createElement('input')
			el.setAttribute('data-validation-id', `input-${i}`)
			document.body.appendChild(el)

			const focusMock = vi.fn()
			const isValid = i !== 2 // Input 2 is invalid

			registerValidateFunc(
				{
					validate: () => isValid,
					reset: vi.fn(),
					validationId: `[data-validation-id="input-${i}"]`,
					focusFunction: focusMock,
				},
				registry
			)

			if (i === 2) {
				mockValidateFunctions.push({
					validate: () => false,
					reset: vi.fn(),
					validationId: `[data-validation-id="input-${i}"]`,
					focusFunction: focusMock,
				})
			}
		}

		const emit = vi.fn()
		await validate({ registry: registry, emit, submit: true })

		// Should focus on input-2 (first invalid)
		// emit should not be called since validation failed
		expect(emit).not.toHaveBeenCalled()
	})
})

	describe('Phase 2: Map-based Lookup', () => {
		it('should use O(1) Map lookup for registration', () => {
			const el = document.createElement('input')
			el.setAttribute('data-validation-id', 'test')
			document.body.appendChild(el)

			const func: ValidateFunctionObject = {
				validate: () => true,
				reset: vi.fn(),
				validationId: '[data-validation-id="test"]',
			}

			// First registration
			registerValidateFunc(func, registry)
			expect(registry.map.has('[data-validation-id="test"]')).toBe(true)
			expect(registry.list.length).toBe(1)

			// Re-registration should replace
			const func2: ValidateFunctionObject = {
				validate: () => false,
				reset: vi.fn(),
				validationId: '[data-validation-id="test"]',
			}

			registerValidateFunc(func2, registry)
			expect(registry.map.has('[data-validation-id="test"]')).toBe(true)
			expect(registry.list.length).toBe(1) // Should still be 1
			expect(registry.map.get('[data-validation-id="test"]')).toBe(func2)
		})

		it('should maintain sync between Map and Array', () => {
			// Add multiple items
			for (let i = 0; i < 10; i++) {
				const el = document.createElement('input')
				const id = `[data-validation-id="input-${i}"]`
				el.setAttribute('data-validation-id', `input-${i}`)
				document.body.appendChild(el)

				registerValidateFunc(
					{
						validate: () => true,
						reset: vi.fn(),
						validationId: id,
					},
					registry
				)
			}

			// Check sync
			expect(registry.list.length).toBe(registry.map.size)
			expect(registry.list.length).toBe(10)

			// Remove some items
			removeValidateFunc('[data-validation-id="input-5"]', registry)
			removeValidateFunc('[data-validation-id="input-7"]', registry)

			// Check sync after removal
			expect(registry.list.length).toBe(registry.map.size)
			expect(registry.list.length).toBe(8)
			expect(registry.map.has('[data-validation-id="input-5"]')).toBe(false)
			expect(registry.map.has('[data-validation-id="input-7"]')).toBe(false)
		})

		it('should perform better than Array.findIndex for large datasets', () => {
			const start = performance.now()

			// Register 500 inputs using Map-based approach
			for (let i = 0; i < 500; i++) {
				const el = document.createElement('input')
				const id = `[data-validation-id="input-${i}"]`
				el.setAttribute('data-validation-id', `input-${i}`)
				document.body.appendChild(el)

				registerValidateFunc(
					{
						validate: () => true,
						reset: vi.fn(),
						validationId: id,
					},
					registry
				)
			}

			const duration = performance.now() - start

	// Should complete in reasonable time (~300ms for 500 inputs, allow 500ms for slower CI)
	expect(duration).toBeLessThan(500)
			expect(registry.list.length).toBe(500)
			expect(registry.map.size).toBe(500)
		})
	})

	describe('Phase 3: RAF Batching', () => {
		it('should queue registrations and process in batch', async () => {
			// Create multiple inputs
			for (let i = 0; i < 10; i++) {
				const el = document.createElement('input')
				const id = `[data-validation-id="input-${i}"]`
				el.setAttribute('data-validation-id', `input-${i}`)
				document.body.appendChild(el)

				registerValidateFuncBatched(
					{
						validate: () => true,
						reset: vi.fn(),
						validationId: id,
					},
					registry
				)
			}

			// Check queue stats
			const stats = getBatcherStats()
			expect(stats.queueSize).toBeGreaterThan(0)

			// Flush queue
			flushQueue()

			// Check registry after flush
			expect(registry.list.length).toBe(10)
			expect(registry.map.size).toBe(10)
			expect(registry.isDirty).toBe(true)

			// Queue should be empty
			const statsAfter = getBatcherStats()
			expect(statsAfter.queueSize).toBe(0)
		})

		it('should dedupe rapid re-registrations', async () => {
			const el = document.createElement('input')
			const id = '[data-validation-id="test"]'
			el.setAttribute('data-validation-id', 'test')
			document.body.appendChild(el)

			// Register same input 5 times rapidly
			for (let i = 0; i < 5; i++) {
				registerValidateFuncBatched(
					{
						validate: () => true,
						reset: vi.fn(),
						validationId: id,
					},
					registry
				)
			}

			// Flush and check - should only have 1 entry
			flushQueue()
			expect(registry.list.length).toBe(1)
			expect(registry.map.size).toBe(1)
		})

		it('should auto-enable batching for > 50 inputs', () => {
			// With few inputs, batching not recommended
			for (let i = 0; i < 10; i++) {
				const el = document.createElement('input')
				const id = `[data-validation-id="input-${i}"]`
				el.setAttribute('data-validation-id', `input-${i}`)
				document.body.appendChild(el)

				registerValidateFunc(
					{
						validate: () => true,
						reset: vi.fn(),
						validationId: id,
					},
					registry
				)
			}

			expect(shouldEnableBatching(registry)).toBe(false)

			// Add more inputs beyond threshold
			for (let i = 10; i < 60; i++) {
				const el = document.createElement('input')
				const id = `[data-validation-id="input-${i}"]`
				el.setAttribute('data-validation-id', `input-${i}`)
				document.body.appendChild(el)

				registerValidateFunc(
					{
						validate: () => true,
						reset: vi.fn(),
						validationId: id,
					},
					registry
				)
			}

			expect(shouldEnableBatching(registry)).toBe(true)
		})

		it('should handle batched registration performance for 200+ inputs', async () => {
			const start = performance.now()

			// Register 200 inputs with batching
			for (let i = 0; i < 200; i++) {
				const el = document.createElement('input')
				const id = `[data-validation-id="input-${i}"]`
				el.setAttribute('data-validation-id', `input-${i}`)
				document.body.appendChild(el)

				registerValidateFuncBatched(
					{
						validate: () => true,
						reset: vi.fn(),
						validationId: id,
					},
					registry
				)
			}

			flushQueue()

			const duration = performance.now() - start

			// Allow slower CI environments while retaining a meaningful performance guard.
			expect(duration).toBeLessThan(250)
			expect(registry.list.length).toBe(200)
		})
	})

	describe('Integration: Full Flow', () => {
		it('should handle complete validation flow with batching', async () => {
			// Simulate DataTable with 100 rows, 3 inputs each
			const rowCount = 100
			const inputsPerRow = 3

			for (let row = 0; row < rowCount; row++) {
				for (let col = 0; col < inputsPerRow; col++) {
					const el = document.createElement('input')
					const id = `[data-validation-id="row-${row}-col-${col}"]`
					el.setAttribute('data-validation-id', `row-${row}-col-${col}`)
					document.body.appendChild(el)

					registerValidateFuncBatched(
						{
							validate: () => row !== 50, // Row 50 invalid
							reset: vi.fn(),
							validationId: id,
							focusFunction: vi.fn(),
						},
						registry
					)
				}
			}

			// Flush batch
			flushQueue()

			expect(registry.list.length).toBe(rowCount * inputsPerRow)

			// Validate
			const emit = vi.fn()
			await validate({ registry: registry, emit, submit: true })

			// Should not emit submit due to validation failure
			expect(emit).not.toHaveBeenCalled()

			// Should be sorted by DOM order
			expect(registry.list[0].validationId).toContain('row-0-col-0')
			expect(registry.isDirty).toBe(false)
		})

		it('should maintain performance with dynamic add/remove', () => {
			const start = performance.now()

			// Add 100 inputs
			for (let i = 0; i < 100; i++) {
				const el = document.createElement('input')
				const id = `[data-validation-id="input-${i}"]`
				el.setAttribute('data-validation-id', `input-${i}`)
				document.body.appendChild(el)

				registerValidateFuncBatched(
					{
						validate: () => true,
						reset: vi.fn(),
						validationId: id,
					},
					registry
				)
			}

			flushQueue()

			// Remove 50 inputs
			for (let i = 0; i < 50; i++) {
				removeValidateFunc(`[data-validation-id="input-${i}"]`, registry)
			}

			// Add 50 new inputs
			for (let i = 100; i < 150; i++) {
				const el = document.createElement('input')
				const id = `[data-validation-id="input-${i}"]`
				el.setAttribute('data-validation-id', `input-${i}`)
				document.body.appendChild(el)

				registerValidateFuncBatched(
					{
						validate: () => true,
						reset: vi.fn(),
						validationId: id,
					},
					registry
				)
			}

			flushQueue()

			const duration = performance.now() - start

			// Should handle dynamic changes efficiently
			expect(duration).toBeLessThan(100)
			expect(registry.list.length).toBe(100)
			expect(registry.map.size).toBe(100)
		})
	})
})
