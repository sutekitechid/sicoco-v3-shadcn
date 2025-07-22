import { Ref } from 'vue'

export { default as FormInput } from './FormInput.vue'

type ValidateFunctionObject = {
	validate: () => boolean
	reset: () => void
	validationId: string
	focusFunction?: () => void
	openAccordion?: () => void
}

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
export function registerValidateFunc(
	func: ValidateFunctionObject,
	slotValidateFuncList: Ref<ValidateFunctionObject[]>
) {
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
	slotValidateFuncList: Ref<ValidateFunctionObject[]>
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
 * @param option - {object}
 * * slotValidateFuncList
 * * emit
 * * submit
 */
export function validate(
	{
		slotValidateFuncList,
		emit,
		submit,
	}: {
		slotValidateFuncList: Ref<ValidateFunctionObject[]>
		emit: (event: 'submit', valid: boolean) => void
		submit?: boolean
	} = {
		slotValidateFuncList: { value: [] } as Ref<ValidateFunctionObject[]>,
		emit: () => {},
		submit: false,
	}
) {
	let focused = false
	let valid = true
	slotValidateFuncList.value.forEach((item: ValidateFunctionObject) => {
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
	})
	if (valid && submit) {
		slotValidateFuncList.value.forEach((item: ValidateFunctionObject) => {
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
