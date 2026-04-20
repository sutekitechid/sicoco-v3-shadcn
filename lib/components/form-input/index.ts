import { nextTick } from 'vue'
import { queueRegistration, removePendingRegistration, flushQueue } from './validationBatcher'

export { default as FormInput } from './FormInput.vue'

// Re-export constants
export { BatchingMode, type BatchingModeType } from './constants'

export type ValidateFunctionObject = {
	validate: () => boolean
	reset: () => void
	validationId: string
	focusFunction?: () => void
	openAccordion?: () => void
}

// Validation registry state
export type ValidationRegistry = {
	list: ValidateFunctionObject[]
	map: Map<string, ValidateFunctionObject>
	isDirty: boolean
	domPositionCache: WeakMap<Element, number>
}

/**
 * Create a new validation registry
 * @returns ValidationRegistry
 */
export function createValidationRegistry(): ValidationRegistry {
	return {
		list: [],
		map: new Map(),
		isDirty: false,
		domPositionCache: new WeakMap(),
	}
}

/**
 * Get element by selector [data-validation-id]
 * @param validationId
 * @returns
 */
export const getElementBySelector = (validationId: string): Element | null => {
	if (validationId && typeof window !== 'undefined') {
		return document.querySelector(validationId)
	}
	return null
}

/**
 * Sort validation functions by DOM position (lazy evaluation with caching)
 * @param list - Array of validation functions to sort
 * @param domPositionCache - WeakMap cache for DOM positions
 */
function sortByDOMPosition(
	list: ValidateFunctionObject[],
	domPositionCache: WeakMap<Element, number>
): void {
	// Build element map
	const elementMap = new Map<string, Element>()

	list.forEach(item => {
		const el = getElementBySelector(item.validationId)
		if (el) {
			elementMap.set(item.validationId, el)
		}
	})

	// Sort directly using compareDocumentPosition
	list.sort((a, b) => {
		const elA = elementMap.get(a.validationId)
		const elB = elementMap.get(b.validationId)

		// Elements not found go to end
		if (!elA && !elB) return 0
		if (!elA) return 1
		if (!elB) return -1

		// Check cache first
		const cachedA = domPositionCache.get(elA)
		const cachedB = domPositionCache.get(elB)
		if (cachedA !== undefined && cachedB !== undefined) {
			return cachedA - cachedB
		}

		// Compare document position (fresh from DOM)
		const position = elA.compareDocumentPosition(elB)
		
		// If B follows A (A comes before B in document)
		if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
			return -1 // A should come before B in sorted list
		}
		
		// If B precedes A (A comes after B in document)
		if (position & Node.DOCUMENT_POSITION_PRECEDING) {
			return 1 // A should come after B in sorted list
		}

		return 0 // Same position
	})

	// Cache positions after sort (always refresh cache with new order)
	list.forEach((item, index) => {
		const el = elementMap.get(item.validationId)
		if (el) {
			domPositionCache.set(el, index)
		}
	})
}

/**
 * Register validate function to validation registry
 * @param func - Validation function object
 * @param registry - Validation registry
 */
export function registerValidateFunc(
	func: ValidateFunctionObject,
	registry: ValidationRegistry
) {
	// Check if element exists in DOM
	const element = getElementBySelector(func.validationId)
	if (!element) {
		return
	}

	const existing = registry.map.get(func.validationId)
	if (existing) {
		// Replace existing function in list
		const index = registry.list.indexOf(existing)
		if (index !== -1) {
			// Found in list - replace it
			registry.list.splice(index, 1, func)
		} else {
			// ⚠️ DESYNC DETECTED: existing in map but not in list!
			// Defensive repair: add to list to keep registry consistent
			registry.list.push(func)
		}
		// Always update map (whether found in list or not)
		registry.map.set(func.validationId, func)
	} else {
		// Add new function
		registry.list.push(func)
		registry.map.set(func.validationId, func)
	}
	// Mark as dirty for lazy sorting
	registry.isDirty = true
}

/**
 * Register validate function with RAF batching (for performance with many inputs)
 * @param func - Validation function object
 * @param registry - Validation registry (required, does not support legacy ref)
 */
export function registerValidateFuncBatched(
	func: ValidateFunctionObject,
	registry: ValidationRegistry
) {
	queueRegistration(func, registry)
}

/**
 * Remove validate function from validation registry
 * @param validationId - Validation ID to remove
 * @param registry - Validation registry
 */
export const removeValidateFunc = (
	validationId: string,
	registry: ValidationRegistry
) => {
	const func = registry.map.get(validationId)
	if (func) {
		const index = registry.list.indexOf(func)
		if (index !== -1) {
			registry.list.splice(index, 1)
		}
		registry.map.delete(validationId)
		// Mark as dirty
		registry.isDirty = true

		// ⚠️ RACE CONDITION FIX: Clear pending queue entry (if any)
		// Prevents processQueue() from re-adding validator after unmount
		removePendingRegistration(validationId, registry)
	}
}

/**
 * Validate all registered validate function
 * @param option - {object}
 * * registry - Validation registry
 * * emit
 * * submit
 */
export async function validate(
	{
		registry,
		emit,
		submit,
	}: {
		registry: ValidationRegistry
		emit: (event: 'submit', valid: boolean) => void
		submit?: boolean
	} = {
		registry: createValidationRegistry(),
		emit: () => {},
		submit: false,
	}
) {
	await nextTick()
	
	// Flush pending batched registrations before validation
	// Prevents race condition where validators in RAF queue are missed
	flushQueue()

	const list = registry.list
	const isDirty = registry.isDirty

	// Lazy sort: sort if dirty OR on submit
	// Submit sort ensures correct focus order even if DOM reordered without re-registration
	// (e.g., drag-drop with stable keys, v-for reorder)
	if (isDirty || submit) {
		// Invalidate cache when dirty - DOM order may have changed (e.g., v-for reorder)
		registry.domPositionCache = new WeakMap()
		sortByDOMPosition(list, registry.domPositionCache)
		registry.isDirty = false
	}

	let focused = false
	let valid = true

	// Single-pass partition: separate active/stale validators while reusing DOM lookups
	// This allows intentionally removed fields (v-if=false) to be skipped
	// Accordion fields are included if element exists (may be hidden by CSS)
	const activeValidators: ValidateFunctionObject[] = []
	const staleValidators: ValidateFunctionObject[] = []

	list.forEach((item: ValidateFunctionObject) => {
		const element = getElementBySelector(item.validationId)
		if (element !== null) {
			activeValidators.push(item)
		} else {
			staleValidators.push(item)
		}
	})

	activeValidators.forEach((item: ValidateFunctionObject) => {
		const itemValid = item.validate()

		// Set valid = false IMMEDIATELY when validation fails
		// Don't wait for focus to succeed!
		if (!itemValid) {
			valid = false

			// Open accordion if validation failed inside it
			if (item.openAccordion) {
				item.openAccordion()
			}

			// Try to focus first invalid element (UX only)
			if (!focused) {
				if (focusIntoElement(item.validationId, item.focusFunction ?? (() => {}))) {
					focused = true
				}
			}
		}
	})

	// Prune stale validators from registry (cleanup, prevent memory leaks)
	if (staleValidators.length > 0) {
		staleValidators.forEach((staleItem: ValidateFunctionObject) => {
			const index = list.indexOf(staleItem)
			if (index !== -1) {
				list.splice(index, 1)
			}
			registry.map.delete(staleItem.validationId)
		})
		// Mark as dirty since we modified list
		registry.isDirty = true
	}

	if (valid && submit) {
		// ✅ Only reset ACTIVE validators (prevent errors on unmounted components)
		activeValidators.forEach((item: ValidateFunctionObject) => {
			item.reset()
		})
		emit('submit', true)
	}
}

/**
 * Focus into element by id
 * @param validationId
 * @param focusFunction
 * @returns
 */
const focusIntoElement = (validationId: string, focusFunction: () => void) => {
	const el = getElementBySelector(validationId)

	// check if element exists
	// if element exists, focus into that element
	if (el) {
		if (focusFunction) {
			focusFunction()
		}
		return true
	}
	return false
}
