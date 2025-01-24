export { default as FormInput } from './FormInput.vue'

/**
 * Get element by selector [data-validation-id]
 * @param id
 * @returns
 */
export const getElementBySelector = (id: string) => {
	return document.querySelector(`[data-validation-id="${id}"]`)
}

/**
 * Register validate function to slotValidateFuncList
 * @param func
 * @param slotValidateFuncList
 */
export function registerValidateFunc(func: any, slotValidateFuncList: any) {
	// check if func exists
	const funcIndex = slotValidateFuncList.value.findIndex(
		(item: { id: string }) => item.id === func.id
	)

	// check if element exists
	if (!getElementBySelector(func.id)) {
		return
	}

	if (funcIndex !== -1) {
		// replace current func
		slotValidateFuncList.value.splice(funcIndex, 1, func)
		return
	}
	slotValidateFuncList.value.push(func)

	// sort slot validate func
	slotValidateFuncList.value.sort((a: { id: string }, b: { id: string }) => {
		const aNode = getElementBySelector(a.id)
		const bNode = getElementBySelector(b.id)
		if (!aNode || !bNode) {
			return 0
		}
		return aNode.compareDocumentPosition(bNode) &
			Node.DOCUMENT_POSITION_FOLLOWING
			? -1
			: 1
	})
}

/**
 * Remove validate function from slotValidateFuncList
 * @param id
 * @param slotValidateFuncList
 */
export const removeValidateFunc = (id: string, slotValidateFuncList: any) => {
	const funcIndex = slotValidateFuncList.value.findIndex(
		(item: { id: string }) => item.id === id
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
			id: string
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
				focusIntoElement(item.id, item.focusFunction ?? (() => {}))
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
 * @param id
 * @param focusFunction
 * @returns
 */
const focusIntoElement = (id: string, focusFunction: Function) => {
	const el = getElementBySelector(id)

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
