import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createValidationRegistry } from '../lib/components/form-input/index'
import {
	queueRegistration,
	flushQueue,
	getBatcherStats,
	cancelQueue,
} from '../lib/components/form-input/validationBatcher'
import type { ValidateFunctionObject } from '../lib/components/form-input/index'

describe('Validation Batcher - Deduplication', () => {
	beforeEach(() => {
		cancelQueue()
		document.body.innerHTML = '' // Clean up DOM
	})

	it('should deduplicate rapid registrations of same validationId', () => {
		const registry = createValidationRegistry()

		// Create element
		const el = document.createElement('input')
		el.setAttribute('data-validation-id', 'test-input')
		document.body.appendChild(el)

		const validate1 = vi.fn(() => true)
		const validate2 = vi.fn(() => true)
		const validate3 = vi.fn(() => true)

		const func1: ValidateFunctionObject = {
			validate: validate1,
			reset: vi.fn(),
			validationId: '[data-validation-id="test-input"]',
		}

		const func2: ValidateFunctionObject = {
			validate: validate2,
			reset: vi.fn(),
			validationId: '[data-validation-id="test-input"]', // SAME ID
		}

		const func3: ValidateFunctionObject = {
			validate: validate3,
			reset: vi.fn(),
			validationId: '[data-validation-id="test-input"]', // SAME ID
		}

		// Queue all 3 registrations rapidly
		queueRegistration(func1, registry)
		queueRegistration(func2, registry)
		queueRegistration(func3, registry)

		const stats = getBatcherStats()
		
		// ✅ Should only have 1 entry in queue (deduplicated by validationId)
		// OLD BUG: Would have 3 entries (Set doesn't dedupe objects)
		expect(stats.queueSize).toBe(1)

		// Flush and verify only the LATEST registration was kept
		flushQueue()

		expect(registry.list.length).toBe(1)
		expect(registry.map.size).toBe(1)

		// Verify it's func3 (latest) that was registered
		const registered = registry.list[0]
		expect(registered.validate).toBe(validate3) // ✅ Latest wins
		expect(registered.validate).not.toBe(validate1) // First was overwritten
		expect(registered.validate).not.toBe(validate2) // Second was overwritten
	})

	it('should maintain separate queues for different validationIds', () => {
		const registry = createValidationRegistry()

		// Create 2 elements
		const el1 = document.createElement('input')
		el1.setAttribute('data-validation-id', 'input-1')
		document.body.appendChild(el1)

		const el2 = document.createElement('input')
		el2.setAttribute('data-validation-id', 'input-2')
		document.body.appendChild(el2)

		const func1: ValidateFunctionObject = {
			validate: vi.fn(() => true),
			reset: vi.fn(),
			validationId: '[data-validation-id="input-1"]',
		}

		const func2: ValidateFunctionObject = {
			validate: vi.fn(() => true),
			reset: vi.fn(),
			validationId: '[data-validation-id="input-2"]',
		}

		// Queue different validationIds
		queueRegistration(func1, registry)
		queueRegistration(func2, registry)

		const stats = getBatcherStats()
		
		// ✅ Should have 2 entries (different validationIds)
		expect(stats.queueSize).toBe(2)

		flushQueue()

		// Both should be registered
		expect(registry.list.length).toBe(2)
		expect(registry.map.size).toBe(2)
	})

	it('should deduplicate across multiple registries correctly', () => {
		const registry1 = createValidationRegistry()
		const registry2 = createValidationRegistry()

		// Create element
		const el = document.createElement('input')
		el.setAttribute('data-validation-id', 'shared-input')
		document.body.appendChild(el)

		const func1: ValidateFunctionObject = {
			validate: vi.fn(() => true),
			reset: vi.fn(),
			validationId: '[data-validation-id="shared-input"]',
		}

		const func2: ValidateFunctionObject = {
			validate: vi.fn(() => true),
			reset: vi.fn(),
			validationId: '[data-validation-id="shared-input"]',
		}

		// Same validationId, different registries
		queueRegistration(func1, registry1)
		queueRegistration(func2, registry2)

		const stats = getBatcherStats()
		
		// ✅ Should have 2 entries (different registries)
		// Queue is Map<registry, Map<validationId, func>>
		expect(stats.queueSize).toBe(2)
		expect(stats.registryCount).toBe(2)

		flushQueue()

		// Each registry should have 1 entry
		expect(registry1.list.length).toBe(1)
		expect(registry2.list.length).toBe(1)
	})

	it('should handle rapid re-registration of same field in same registry', () => {
		const registry = createValidationRegistry()

		// Create element
		const el = document.createElement('input')
		el.setAttribute('data-validation-id', 'rapid-input')
		document.body.appendChild(el)

		const validateMocks = Array.from({ length: 100 }, () => vi.fn(() => true))

		// Simulate 100 rapid registrations (e.g., reactive updates)
		for (let i = 0; i < 100; i++) {
			const func: ValidateFunctionObject = {
				validate: validateMocks[i],
				reset: vi.fn(),
				validationId: '[data-validation-id="rapid-input"]',
			}
			queueRegistration(func, registry)
		}

		const stats = getBatcherStats()
		
		// ✅ CRITICAL: Should only have 1 entry (deduplicated)
		// OLD BUG: Would have 100 entries → O(n) performance issue
		expect(stats.queueSize).toBe(1)

		flushQueue()

		// Only 1 should be registered
		expect(registry.list.length).toBe(1)
		expect(registry.map.size).toBe(1)

		// Latest (index 99) should win
		expect(registry.list[0].validate).toBe(validateMocks[99])
	})

	it('should update queue when same field registered with different validators', () => {
		const registry = createValidationRegistry()

		// Create element
		const el = document.createElement('input')
		el.setAttribute('data-validation-id', 'changing-input')
		document.body.appendChild(el)

		const validator1 = vi.fn(() => true)
		const validator2 = vi.fn(() => false) // Different validator

		// First registration
		queueRegistration(
			{
				validate: validator1,
				reset: vi.fn(),
				validationId: '[data-validation-id="changing-input"]',
			},
			registry
		)

		let stats = getBatcherStats()
		expect(stats.queueSize).toBe(1)

		// Second registration (same ID, different validator)
		queueRegistration(
			{
				validate: validator2,
				reset: vi.fn(),
				validationId: '[data-validation-id="changing-input"]',
			},
			registry
		)

		stats = getBatcherStats()
		
		// ✅ Still only 1 entry (overwritten, not added)
		expect(stats.queueSize).toBe(1)

		flushQueue()

		// Only latest validator should be registered
		expect(registry.list.length).toBe(1)
		expect(registry.list[0].validate).toBe(validator2) // Latest wins
	})

	it('should correctly count queue size across multiple registries', () => {
		const registry1 = createValidationRegistry()
		const registry2 = createValidationRegistry()
		const registry3 = createValidationRegistry()

		// Create elements
		for (let i = 1; i <= 5; i++) {
			const el = document.createElement('input')
			el.setAttribute('data-validation-id', `input-${i}`)
			document.body.appendChild(el)
		}

		// Registry 1: 2 fields
		queueRegistration(
			{
				validate: vi.fn(() => true),
				reset: vi.fn(),
				validationId: '[data-validation-id="input-1"]',
			},
			registry1
		)
		queueRegistration(
			{
				validate: vi.fn(() => true),
				reset: vi.fn(),
				validationId: '[data-validation-id="input-2"]',
			},
			registry1
		)

		// Registry 2: 2 fields
		queueRegistration(
			{
				validate: vi.fn(() => true),
				reset: vi.fn(),
				validationId: '[data-validation-id="input-3"]',
			},
			registry2
		)
		queueRegistration(
			{
				validate: vi.fn(() => true),
				reset: vi.fn(),
				validationId: '[data-validation-id="input-4"]',
			},
			registry2
		)

		// Registry 3: 1 field
		queueRegistration(
			{
				validate: vi.fn(() => true),
				reset: vi.fn(),
				validationId: '[data-validation-id="input-5"]',
			},
			registry3
		)

		const stats = getBatcherStats()
		
		// ✅ Total queue size = 5 (2 + 2 + 1)
		expect(stats.queueSize).toBe(5)
		
		// ✅ Registry count = 3
		expect(stats.registryCount).toBe(3)

		flushQueue()

		expect(registry1.list.length).toBe(2)
		expect(registry2.list.length).toBe(2)
		expect(registry3.list.length).toBe(1)
	})

	it('should repair desynchronized registry (entry in map but not in list)', () => {
		const registry = createValidationRegistry()

		// Create element
		const el = document.createElement('input')
		el.setAttribute('data-validation-id', 'desynced-input')
		document.body.appendChild(el)

		// Manually create desync: add to map but not to list
		const oldFunc: ValidateFunctionObject = {
			validate: vi.fn(() => true),
			reset: vi.fn(),
			validationId: '[data-validation-id="desynced-input"]',
		}

		// Simulate desync state (this shouldn't happen, but we handle it defensively)
		registry.map.set(oldFunc.validationId, oldFunc)
		// NOT added to registry.list! → Desync state

		// Verify desync
		expect(registry.map.size).toBe(1) // In map
		expect(registry.list.length).toBe(0) // NOT in list ❌

		// Now queue a new registration for same validationId
		const newFunc: ValidateFunctionObject = {
			validate: vi.fn(() => false),
			reset: vi.fn(),
			validationId: '[data-validation-id="desynced-input"]',
		}

		queueRegistration(newFunc, registry)
		flushQueue()

		// ✅ Should repair the registry
		// - list should now contain the new func
		// - map should be updated to new func
		// - Both should be in sync
		expect(registry.list.length).toBe(1) // Added to list!
		expect(registry.map.size).toBe(1)
		expect(registry.list[0]).toBe(newFunc) // New func added
		expect(registry.map.get(newFunc.validationId)).toBe(newFunc) // Map updated
	})

	it('should handle multiple desynced entries and repair all', () => {
		const registry = createValidationRegistry()

		// Create elements
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

		// Queue new registrations
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

		queueRegistration(newFunc1, registry)
		queueRegistration(newFunc2, registry)
		queueRegistration(newFunc3, registry)

		flushQueue()

		// ✅ All should be repaired and added
		expect(registry.list.length).toBe(3)
		expect(registry.map.size).toBe(3)

		// Verify correct functions registered
		expect(registry.list).toContain(newFunc1)
		expect(registry.list).toContain(newFunc2)
		expect(registry.list).toContain(newFunc3)
	})
})
