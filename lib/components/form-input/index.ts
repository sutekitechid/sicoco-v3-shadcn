import { type Ref, nextTick } from 'vue'
import { queueRegistration, removePendingRegistration, flushQueue } from './validationBatcher'

export { default as FormInput } from './FormInput.vue'

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
 * Type guard: returns true when the argument is a legacy Ref<ValidateFunctionObject[]>
 */
function isLegacyRef(
	registryOrRef: ValidationRegistry | Ref<ValidateFunctionObject[]>
): registryOrRef is Ref<ValidateFunctionObject[]> {
	return (
		registryOrRef !== null &&
		typeof registryOrRef === 'object' &&
		'value' in registryOrRef &&
		Array.isArray((registryOrRef as Ref<ValidateFunctionObject[]>).value)
	)
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
 * Supports both the new `ValidationRegistry` format and the legacy `Ref<ValidateFunctionObject[]>` format.
 * @param func - Validation function object
 * @param registryOrRef - ValidationRegistry (new) or Ref<ValidateFunctionObject[]> (legacy)
 */
export function registerValidateFunc(
	func: ValidateFunctionObject,
	registryOrRef: ValidationRegistry | Ref<ValidateFunctionObject[]>
) {
	// Check if element exists in DOM
	const element = getElementBySelector(func.validationId)
	if (!element) {
		return
	}

	if (isLegacyRef(registryOrRef)) {
		// Legacy Ref<ValidateFunctionObject[]> path
		const funcIndex = registryOrRef.value.findIndex(
			(item: ValidateFunctionObject) => item.validationId === func.validationId
		)
		if (funcIndex !== -1) {
			registryOrRef.value.splice(funcIndex, 1, func)
			return
		}
		registryOrRef.value.push(func)
		// Cache element lookups before sort to avoid O(n² log n) DOM queries
		const sortElementMap = new Map<string, Element | null>()
		registryOrRef.value.forEach((item: ValidateFunctionObject) => {
			sortElementMap.set(item.validationId, getElementBySelector(item.validationId))
		})
		registryOrRef.value.sort(
			(a: ValidateFunctionObject, b: ValidateFunctionObject) => {
				const aNode = sortElementMap.get(a.validationId)
				const bNode = sortElementMap.get(b.validationId)
				if (!aNode || !bNode) return 0
				return aNode.compareDocumentPosition(bNode) &
					Node.DOCUMENT_POSITION_FOLLOWING
					? -1
					: 1
			}
		)
		return
	}

	// New ValidationRegistry path
	const registry = registryOrRef
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
 * Register validate function with RAF batching (for performance with many inputs).
 * Only accepts the new `ValidationRegistry` format; use `registerValidateFunc` for legacy support.
 * @param func - Validation function object
 * @param registry - Validation registry (ValidationRegistry only)
 */
export function registerValidateFuncBatched(
	func: ValidateFunctionObject,
	registry: ValidationRegistry
) {
	queueRegistration(func, registry)
}

/**
 * Remove validate function from validation registry
 * Supports both the new `ValidationRegistry` format and the legacy `Ref<ValidateFunctionObject[]>` format.
 * @param validationId - Validation ID to remove
 * @param registryOrRef - ValidationRegistry (new) or Ref<ValidateFunctionObject[]> (legacy)
 */
export const removeValidateFunc = (
	validationId: string,
	registryOrRef: ValidationRegistry | Ref<ValidateFunctionObject[]>
) => {
	if (isLegacyRef(registryOrRef)) {
		// Legacy Ref<ValidateFunctionObject[]> path
		const funcIndex = registryOrRef.value.findIndex(
			(item: ValidateFunctionObject) => item.validationId === validationId
		)
		if (funcIndex !== -1) {
			registryOrRef.value.splice(funcIndex, 1)
		}
		return
	}

	// New ValidationRegistry path
	const registry = registryOrRef
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
 * Validate all registered validate functions.
 * Supports both the new `{ registry, emit, submit }` format and the legacy `{ slotValidateFuncList, emit, submit }` format.
 * @param option - {object}
 * * registry - Validation registry (new format)
 * * slotValidateFuncList - Legacy Ref<ValidateFunctionObject[]> (legacy format)
 * * emit
 * * submit
 */
export async function validate(
	options:
		| {
				registry: ValidationRegistry
				emit: (event: 'submit', valid: boolean) => void
				submit?: boolean
		  }
		| {
				slotValidateFuncList: Ref<ValidateFunctionObject[]>
				emit: (event: 'submit', valid: boolean) => void
				submit?: boolean
		  } = {
		registry: createValidationRegistry(),
		emit: () => {},
		submit: false,
	}
) {
	await nextTick()

	// Handle legacy Ref<ValidateFunctionObject[]> format
	if ('slotValidateFuncList' in options) {
		const { slotValidateFuncList, emit, submit } = options
		let focused = false
		let valid = true
		slotValidateFuncList.value.forEach((item: ValidateFunctionObject) => {
			const itemValid = item.validate()

			if (!itemValid) {
				valid = false

				if (item.openAccordion) {
					item.openAccordion()
				}

				if (!focused && focusIntoElement(item.validationId, item.focusFunction ?? (() => {}))) {
					focused = true
				}
			}
		})
		if (valid && submit) {
			slotValidateFuncList.value.forEach((item: ValidateFunctionObject) => {
				item.reset()
			})
			emit('submit', true)
		}
		return
	}

	// New ValidationRegistry format
	const { registry, emit, submit } = options

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
