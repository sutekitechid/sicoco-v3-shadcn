import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { createValidationRegistry, registerValidateFunc, validate } from '../lib/components/form-input/index'
import type { ValidateFunctionObject } from '../lib/components/form-input/index'

describe('Validation Sorting - Cache Invalidation', () => {
	beforeEach(() => {
		document.body.innerHTML = '' // Clean up DOM
	})

	it('should recompute DOM positions when order changes (v-for reorder scenario)', async () => {
		const registry = createValidationRegistry()

		// Create 3 inputs in order: input-1, input-2, input-3
		const container = document.createElement('div')
		document.body.appendChild(container)

		const el1 = document.createElement('input')
		el1.setAttribute('data-validation-id', 'input-1')
		container.appendChild(el1)

		const el2 = document.createElement('input')
		el2.setAttribute('data-validation-id', 'input-2')
		container.appendChild(el2)

		const el3 = document.createElement('input')
		el3.setAttribute('data-validation-id', 'input-3')
		container.appendChild(el3)

		// Register in order: 1, 2, 3
		const validate1 = vi.fn(() => true)
		const validate2 = vi.fn(() => true)
		const validate3 = vi.fn(() => true)

		registerValidateFunc(
			{
				validate: validate1,
				reset: vi.fn(),
				validationId: '[data-validation-id="input-1"]',
			},
			registry
		)

		registerValidateFunc(
			{
				validate: validate2,
				reset: vi.fn(),
				validationId: '[data-validation-id="input-2"]',
			},
			registry
		)

		registerValidateFunc(
			{
				validate: validate3,
				reset: vi.fn(),
				validationId: '[data-validation-id="input-3"]',
			},
			registry
		)

		// First validation - cache built with order: 1, 2, 3
		const emit1 = vi.fn()
		await validate({ registryOrRef: registry, emit: emit1, submit: true })

		expect(emit1).toHaveBeenCalledWith('submit', true)

		// Now REORDER DOM elements (simulate v-for key reordering)
		// New order: input-3, input-1, input-2
		container.innerHTML = ''
		container.appendChild(el3) // input-3 first
		container.appendChild(el1) // input-1 second
		container.appendChild(el2) // input-2 last

		// Mark registry as dirty (simulates new registration or external change)
		registry.isDirty = true

		// Validation functions that fail (to check focus order)
		validate1.mockReturnValue(false)
		validate2.mockReturnValue(false)
		validate3.mockReturnValue(false)

		const focus1 = vi.fn()
		const focus2 = vi.fn()
		const focus3 = vi.fn()

		// Update with focus functions
		registerValidateFunc(
			{
				validate: validate1,
				reset: vi.fn(),
				validationId: '[data-validation-id="input-1"]',
				focusFunction: focus1,
			},
			registry
		)

		registerValidateFunc(
			{
				validate: validate2,
				reset: vi.fn(),
				validationId: '[data-validation-id="input-2"]',
				focusFunction: focus2,
			},
			registry
		)

		registerValidateFunc(
			{
				validate: validate3,
				reset: vi.fn(),
				validationId: '[data-validation-id="input-3"]',
				focusFunction: focus3,
			},
			registry
		)

		// Second validation - should use NEW DOM order, not cached order
		const emit2 = vi.fn()
		await validate({ registryOrRef: registry, emit: emit2, submit: true })

		// Should NOT submit (all invalid)
		expect(emit2).not.toHaveBeenCalled()

		// ✅ CRITICAL: Should focus FIRST element in NEW DOM order
		// New order is: input-3, input-1, input-2
		// So input-3 should be focused (first in DOM)
		expect(focus3).toHaveBeenCalled() // input-3 is first now
		expect(focus1).not.toHaveBeenCalled() // input-1 is second
		expect(focus2).not.toHaveBeenCalled() // input-2 is third

		// ✅ If cache was stale, it would focus input-1 (old first position) ❌
		// With fix, it focuses input-3 (new first position) ✅
	})

	it('should handle dynamic DOM reordering with multiple validations', async () => {
		const registry = createValidationRegistry()

		const container = document.createElement('div')
		document.body.appendChild(container)

		// Create elements
		const el1 = document.createElement('input')
		el1.setAttribute('data-validation-id', 'field-a')
		
		const el2 = document.createElement('input')
		el2.setAttribute('data-validation-id', 'field-b')
		
		const el3 = document.createElement('input')
		el3.setAttribute('data-validation-id', 'field-c')

		// Initial order: A, B, C
		container.appendChild(el1)
		container.appendChild(el2)
		container.appendChild(el3)

		// Register validators
		const focusA = vi.fn()
		const focusB = vi.fn()
		const focusC = vi.fn()

		registerValidateFunc(
			{
				validate: vi.fn(() => false),
				reset: vi.fn(),
				validationId: '[data-validation-id="field-a"]',
				focusFunction: focusA,
			},
			registry
		)

		registerValidateFunc(
			{
				validate: vi.fn(() => false),
				reset: vi.fn(),
				validationId: '[data-validation-id="field-b"]',
				focusFunction: focusB,
			},
			registry
		)

		registerValidateFunc(
			{
				validate: vi.fn(() => false),
				reset: vi.fn(),
				validationId: '[data-validation-id="field-c"]',
				focusFunction: focusC,
			},
			registry
		)

		// Validation 1: Order A, B, C
		const emit1 = vi.fn()
		await validate({ registryOrRef: registry, emit: emit1, submit: true })
		
		expect(focusA).toHaveBeenCalled() // A is first
		expect(focusB).not.toHaveBeenCalled()
		expect(focusC).not.toHaveBeenCalled()

		// Reset mocks
		focusA.mockClear()
		focusB.mockClear()
		focusC.mockClear()

		// REORDER: C, A, B (simulate drag-drop or v-for key reorder)
		container.innerHTML = ''
		container.appendChild(el3) // C first
		container.appendChild(el1) // A second
		container.appendChild(el2) // B third

		registry.isDirty = true

		// Validation 2: Should respect NEW order C, A, B
		const emit2 = vi.fn()
		await validate({ registryOrRef: registry, emit: emit2, submit: true })
		
		expect(focusC).toHaveBeenCalled() // ✅ C is first now
		expect(focusA).not.toHaveBeenCalled()
		expect(focusB).not.toHaveBeenCalled()

		// Reset mocks
		focusA.mockClear()
		focusB.mockClear()
		focusC.mockClear()

		// REORDER AGAIN: B, C, A
		container.innerHTML = ''
		container.appendChild(el2) // B first
		container.appendChild(el3) // C second
		container.appendChild(el1) // A third

		registry.isDirty = true

		// Validation 3: Should respect NEW order B, C, A
		const emit3 = vi.fn()
		await validate({ registryOrRef: registry, emit: emit3, submit: true })
		
		expect(focusB).toHaveBeenCalled() // ✅ B is first now
		expect(focusA).not.toHaveBeenCalled()
		expect(focusC).not.toHaveBeenCalled()
	})

	it('should not use stale cache when validator is updated', async () => {
		const registry = createValidationRegistry()

		const container = document.createElement('div')
		document.body.appendChild(container)

		const el1 = document.createElement('input')
		el1.setAttribute('data-validation-id', 'dynamic-1')
		
		const el2 = document.createElement('input')
		el2.setAttribute('data-validation-id', 'dynamic-2')

		// Order: 1, 2
		container.appendChild(el1)
		container.appendChild(el2)

		const focus1 = vi.fn()
		const focus2 = vi.fn()

		registerValidateFunc(
			{
				validate: vi.fn(() => false),
				reset: vi.fn(),
				validationId: '[data-validation-id="dynamic-1"]',
				focusFunction: focus1,
			},
			registry
		)

		registerValidateFunc(
			{
				validate: vi.fn(() => false),
				reset: vi.fn(),
				validationId: '[data-validation-id="dynamic-2"]',
				focusFunction: focus2,
			},
			registry
		)

		// First validation
		await validate({ registryOrRef: registry, emit: vi.fn(), submit: true })
		expect(focus1).toHaveBeenCalled()
		focus1.mockClear()
		focus2.mockClear()

		// Swap DOM order: 2, 1
		container.innerHTML = ''
		container.appendChild(el2)
		container.appendChild(el1)

		// Re-register (marks dirty)
		registerValidateFunc(
			{
				validate: vi.fn(() => false),
				reset: vi.fn(),
				validationId: '[data-validation-id="dynamic-1"]',
				focusFunction: focus1,
			},
			registry
		)

		// Second validation - should use NEW order
		await validate({ registryOrRef: registry, emit: vi.fn(), submit: true })
		
		// ✅ Should focus dynamic-2 (now first in DOM)
		expect(focus2).toHaveBeenCalled()
		expect(focus1).not.toHaveBeenCalled()
	})

	it('should handle partial reordering (some elements stay in place)', async () => {
		const registry = createValidationRegistry()

		const container = document.createElement('div')
		document.body.appendChild(container)

		// Create 5 elements
		const elements = []
		const focusFns = []
		
		for (let i = 1; i <= 5; i++) {
			const el = document.createElement('input')
			el.setAttribute('data-validation-id', `item-${i}`)
			container.appendChild(el)
			elements.push(el)

			const focus = vi.fn()
			focusFns.push(focus)

			registerValidateFunc(
				{
					validate: vi.fn(() => false),
					reset: vi.fn(),
					validationId: `[data-validation-id="item-${i}"]`,
					focusFunction: focus,
				},
				registry
			)
		}

		// Initial order: 1, 2, 3, 4, 5
		await validate({ registryOrRef: registry, emit: vi.fn(), submit: true })
		expect(focusFns[0]).toHaveBeenCalled() // item-1 first
		
		focusFns.forEach(fn => fn.mockClear())

		// Partial reorder: swap 2 and 4, keep others
		// New order: 1, 4, 3, 2, 5
		container.innerHTML = ''
		container.appendChild(elements[0]) // 1
		container.appendChild(elements[3]) // 4
		container.appendChild(elements[2]) // 3
		container.appendChild(elements[1]) // 2
		container.appendChild(elements[4]) // 5

		registry.isDirty = true

		// Should still focus item-1 (still first)
		await validate({ registryOrRef: registry, emit: vi.fn(), submit: true })
		expect(focusFns[0]).toHaveBeenCalled() // item-1 still first
		
		focusFns.forEach(fn => fn.mockClear())

		// Move item-1 to end
		// New order: 4, 3, 2, 5, 1
		container.innerHTML = ''
		container.appendChild(elements[3]) // 4
		container.appendChild(elements[2]) // 3
		container.appendChild(elements[1]) // 2
		container.appendChild(elements[4]) // 5
		container.appendChild(elements[0]) // 1

		registry.isDirty = true

		// Should now focus item-4 (first in new order)
		await validate({ registryOrRef: registry, emit: vi.fn(), submit: true })
		expect(focusFns[3]).toHaveBeenCalled() // ✅ item-4 now first
		expect(focusFns[0]).not.toHaveBeenCalled() // item-1 is last
	})

	it('should clear cache for legacy API (always recompute)', async () => {
		// Legacy API uses Ref instead of ValidationRegistry
		const list = ref([])

		const container = document.createElement('div')
		document.body.appendChild(container)

		const el1 = document.createElement('input')
		el1.setAttribute('data-validation-id', 'legacy-1')
		
		const el2 = document.createElement('input')
		el2.setAttribute('data-validation-id', 'legacy-2')

		container.appendChild(el1)
		container.appendChild(el2)

		const focus1 = vi.fn()
		const focus2 = vi.fn()

		registerValidateFunc(
			{
				validate: vi.fn(() => false),
				reset: vi.fn(),
				validationId: '[data-validation-id="legacy-1"]',
				focusFunction: focus1,
			},
			list
		)

		registerValidateFunc(
			{
				validate: vi.fn(() => false),
				reset: vi.fn(),
				validationId: '[data-validation-id="legacy-2"]',
				focusFunction: focus2,
			},
			list
		)

		// First validation
		await validate({ registryOrRef: list, emit: vi.fn(), submit: true })
		expect(focus1).toHaveBeenCalled()
		
		focus1.mockClear()
		focus2.mockClear()

		// Reorder
		container.innerHTML = ''
		container.appendChild(el2)
		container.appendChild(el1)

		// Legacy always sorts, should use new order
		await validate({ registryOrRef: list, emit: vi.fn(), submit: true })
		
		// ✅ Should focus legacy-2 (now first)
		expect(focus2).toHaveBeenCalled()
		expect(focus1).not.toHaveBeenCalled()
	})
})
