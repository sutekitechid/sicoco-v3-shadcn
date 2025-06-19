export { default as FormInput } from './FormInput.vue'

/**
 * Get element by selector [data-validation-id]
 * @param validationId
 * @returns
 */
export const getElementBySelector = (validationId: string) => {
	if (validationId && typeof window !== 'undefined') {
		return document.querySelector(validationId)
	}
	return null
}

/**
 * Register validate function to slotValidateFuncList
 * @param func
 * @param slotValidateFuncList
 */
export function registerValidateFunc(func: any, slotValidateFuncList: any) {
	// check if func exists
	const funcIndex = slotValidateFuncList.value.findIndex(
		(item: { validationId: string }) => item.validationId === func.validationId
	)

	// check if element exists
	if (!getElementBySelector(func.validationId)) {
		return
	}

	if (funcIndex !== -1) {
		// replace current func
		slotValidateFuncList.value.splice(funcIndex, 1, func)
		return
	}
	slotValidateFuncList.value.push(func)

	// sort slot validate func
	slotValidateFuncList.value.sort(
		(a: { validationId: string }, b: { validationId: string }) => {
			const aNode = getElementBySelector(a.validationId)
			const bNode = getElementBySelector(b.validationId)
			if (!aNode || !bNode) {
				return 0
			}
			return aNode.compareDocumentPosition(bNode) &
				Node.DOCUMENT_POSITION_FOLLOWING
				? -1
				: 1
		}
	)
}

/**
 * Remove validate function from slotValidateFuncList
 * @param validationId
 * @param slotValidateFuncList
 */
export const removeValidateFunc = (
	validationId: string,
	slotValidateFuncList: any
) => {
	const funcIndex = slotValidateFuncList.value.findIndex(
		(item: { validationId: string }) => item.validationId === validationId
	)
	if (funcIndex !== -1) {
		slotValidateFuncList.value.splice(funcIndex, 1)
	}
}

/**
 * Validate all registered validate function
 * @param slotValidateFuncList
 * @param emit
 */
export function validate(slotValidateFuncList: any, emit: any) {
	let focused = false
	let valid = true
	slotValidateFuncList.value.forEach(
		(item: {
			validationId: string
			validate: () => boolean
			focusFunction?: () => void
			reset: () => void
			openAccordion?: () => void
		}) => {
			const validate = item.validate()

			if (!validate && item.openAccordion) {
				item.openAccordion()
			}

			// success to focus into an element
			if (
				!validate &&
				!focused &&
				focusIntoElement(item.validationId, item.focusFunction ?? (() => {}))
			) {
				valid = false
				focused = true
			}
		}
	)
	if (valid) {
		slotValidateFuncList.value.forEach(
			(item: {
				id: string
				validate: () => boolean
				focusFunction?: () => void
				reset: () => void
			}) => {
				item.reset()
			}
		)
		emit('submit', true)
	}
}

/**
 * Focus into element by id
 * @param validationId
 * @param focusFunction
 * @returns
 */
const focusIntoElement = (validationId: string, focusFunction: Function) => {
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
