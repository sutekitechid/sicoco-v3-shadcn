import { Ref, nextTick } from 'vue'
import { queueRegistration } from './validationBatcher'

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

		// Compare document position
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

	// Cache positions after sort
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
 * @param registry - Validation registry (for new API) or legacy ref array
 */
export function registerValidateFunc(
	func: ValidateFunctionObject,
	registryOrRef: ValidationRegistry | Ref<ValidateFunctionObject[]>
) {
	// Support legacy API (Ref<array>) and new API (ValidationRegistry)
	const isLegacy = 'value' in registryOrRef
	const list = isLegacy
		? (registryOrRef as Ref<ValidateFunctionObject[]>).value
		: (registryOrRef as ValidationRegistry).list
	const map = isLegacy ? null : (registryOrRef as ValidationRegistry).map

	// Check if element exists in DOM
	const element = getElementBySelector(func.validationId)
	if (!element) {
		return
	}

	// Use Map for O(1) lookup if available
	if (map) {
		const existing = map.get(func.validationId)
		if (existing) {
			// Replace existing function
			const index = list.indexOf(existing)
			if (index !== -1) {
				list.splice(index, 1, func)
				map.set(func.validationId, func)
			}
		} else {
			// Add new function
			list.push(func)
			map.set(func.validationId, func)
		}
		// Mark as dirty for lazy sorting
		;(registryOrRef as ValidationRegistry).isDirty = true
	} else {
		// Legacy path: O(n) lookup with findIndex
		const funcIndex = list.findIndex(
			(item: { validationId: string }) => item.validationId === func.validationId
		)

		if (funcIndex !== -1) {
			// Replace current func
			list.splice(funcIndex, 1, func)
		} else {
			list.push(func)
		}
	}
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
 * @param registryOrRef - Validation registry (for new API) or legacy ref array
 */
export const removeValidateFunc = (
	validationId: string,
	registryOrRef: ValidationRegistry | Ref<ValidateFunctionObject[]>
) => {
	// Support legacy API (Ref<array>) and new API (ValidationRegistry)
	const isLegacy = 'value' in registryOrRef
	const list = isLegacy
		? (registryOrRef as Ref<ValidateFunctionObject[]>).value
		: (registryOrRef as ValidationRegistry).list
	const map = isLegacy ? null : (registryOrRef as ValidationRegistry).map

	if (map) {
		// Use Map for O(1) lookup
		const func = map.get(validationId)
		if (func) {
			const index = list.indexOf(func)
			if (index !== -1) {
				list.splice(index, 1)
			}
			map.delete(validationId)
			// Mark as dirty
			;(registryOrRef as ValidationRegistry).isDirty = true
		}
	} else {
		// Legacy path: O(n) lookup
		const funcIndex = list.findIndex(
			(item: { validationId: string }) => item.validationId === validationId
		)
		if (funcIndex !== -1) {
			list.splice(funcIndex, 1)
		}
	}
}

/**
 * Validate all registered validate function
 * @param option - {object}
 * * registryOrRef - Validation registry or legacy slotValidateFuncList ref
 * * emit
 * * submit
 */
export async function validate(
	{
		slotValidateFuncList,
		registryOrRef,
		emit,
		submit,
	}: {
		slotValidateFuncList?: Ref<ValidateFunctionObject[]>
		registryOrRef?: ValidationRegistry | Ref<ValidateFunctionObject[]>
		emit: (event: 'submit', valid: boolean) => void
		submit?: boolean
	} = {
		emit: () => {},
		submit: false,
	}
) {
	await nextTick()

	// Support both legacy and new API
	const registry = registryOrRef || slotValidateFuncList
	if (!registry) {
		return
	}

	const isLegacy = 'value' in registry
	const list = isLegacy
		? (registry as Ref<ValidateFunctionObject[]>).value
		: (registry as ValidationRegistry).list
	const isDirty = isLegacy
		? false
		: (registry as ValidationRegistry).isDirty
	const domPositionCache = isLegacy
		? new WeakMap()
		: (registry as ValidationRegistry).domPositionCache

	// Lazy sort: only sort if dirty flag is set (new API) or always for legacy
	if (!isLegacy && isDirty) {
		sortByDOMPosition(list, domPositionCache)
		;(registry as ValidationRegistry).isDirty = false
	} else if (isLegacy && list.length > 0) {
		// Legacy: always sort (for backward compatibility)
		sortByDOMPosition(list, domPositionCache)
	}

	let focused = false
	let valid = true

	list.forEach((item: ValidateFunctionObject) => {
		const itemValid = item.validate()

		if (!itemValid && item.openAccordion) {
			item.openAccordion()
		}

		// success to focus into an element
		if (
			!itemValid &&
			!focused &&
			focusIntoElement(item.validationId, item.focusFunction ?? (() => {}))
		) {
			valid = false
			focused = true
		}
	})

	if (valid && submit) {
		list.forEach((item: ValidateFunctionObject) => {
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
