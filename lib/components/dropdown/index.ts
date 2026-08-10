export { default as Dropdown } from './Dropdown.vue'
export { default as DropdownContent } from './DropdownContent.vue'
export { default as DropdownTrigger } from './DropdownTrigger.vue'
export { default as DropdownItem } from './DropdownItem.vue'
export { default as DropdownErrorMessage } from './DropdownErrorMessage.vue'
export { default as DropdownChevron } from './DropdownChevron.vue'
export { default as DropdownSelectedItem } from './DropdownSelectedItem.vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { toggleArrayValue } from '../../utils/array'

/**
 * The type for the options in the dropdown.
 * - `string`: A simple text string.
 * - `number`: A numeric value.
 * - `boolean`: A true/false value.
 * - `Record<string, unknown>`: An object with string keys and any value.
 * - `Array<unknown>`: An array containing any type of value.
 * - `null`: Represents a null value.
 * - `undefined`: Represents an undefined value.
 */
export type Option =
	| string
	| number
	| boolean
	| Record<string, unknown>
	| Array<unknown>
	| null
	| undefined

export const dropdownVariants = cva(
	'inline-flex items-center w-full h-11 border border-main justify-between gap-x-1.5 rounded shadow-sm transition duration-150 ease-in-out focus:outline-none focus:shadow-primary focus:border-primary-main bg-transparent hover:bg-neutral-100',
	{
		variants: {
			type: {
				selected: 'text-main bg-white cursor-pointer hover:bg-primary-hover hover:text-gray-50',
				disabled:
					'bg-neutral-300 text-neutral-500 cursor-not-allowed hover:bg-neutral-300',
				default: 'text-neutral-600 curssor-pointer',
			},
			iconOpen: {
				false: '',
				true: 'rotate-180',
			},
		},
	}
)

export type DropdownVariants = VariantProps<typeof dropdownVariants>

export const dropdownItemVariants = cva(
	'block font-normal mx-2 my-1 p-2 cursor-pointer text-sm rounded',
	{
		variants: {
			type: {
				selected: 'text-neutral-100 bg-primary-default cursor-pointer',
				disabled: 'text-neutral-500 bg-neutral-300 cursor-not-allowed',
				default: 'text-main hover:bg-neutral-100 cursor-pointer',
				'multiple-select':
					'text-primary-default hover:bg-neutral-100 cursor-pointer',
			},
		},
		compoundVariants: [
			{
				type: ['multiple-select', 'selected'],
				class: 'bg-primary-10'
			}
		],
		defaultVariants: {
			type: 'default',
		},
	}
)

export type DropdownItemVariants = VariantProps<typeof dropdownItemVariants>

export const dropdownContentVariants = cva(
	'z-50 w-full rounded-lg bg-white shadow-md  outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
)

export type DropdownContentVariants = VariantProps<
	typeof dropdownContentVariants
>

/**
 * Type definitions for the dropdown item type.
 */
export const DropdownItemType = Object.freeze({
	Default: 'default',
	Disabled: 'disabled',
	Selected: 'selected',
	MultipleSelect: 'multiple-select',
})

/**
 * Computed property to determine the type of dropdown item.
 *
 * @type {DropdownItemType} - The type of dropdown item (default, disabled, selected, multiple-select).
 */
export const dropdownItemType = (
	isMultipleSelect: boolean,
	isSelected: boolean,
	isDisabled: boolean
) => {
	if (isMultipleSelect && isSelected) {
		return DropdownItemType.MultipleSelect
	} else if (isSelected) {
		return DropdownItemType.Selected
	} else if (isDisabled) {
		return DropdownItemType.Disabled
	}
	return DropdownItemType.Default
}

/**
 * Selects an option in single selection mode.
 *
 * @param {Option} selectedValue - The option value to select.
 * @returns {Option} - The selected value.
 */
export function selectSingleOption(selectedValue: Option): Option {
	return selectedValue
}

/**
 * Selects an option in multiple selection mode.
 *
 * @param {Option[]} currentValue - The current array of selected options.
 * @param {Option} selectedValue - The option value to select or deselect.
 * @returns {Option[]} - The updated array of selected options.
 */
export function selectMultipleOptions(
	currentValue: Option,
	selectedValue: Option
): Option {
	return toggleArrayValue(currentValue as [], selectedValue)
}

/**
 * Generates a CSS width style string based on the trigger width.
 * Dropdowns narrower than 288px use a minimum width of 18rem.
 */
export function getDropdownContentContainerWidth(width: number): string {
	if (width < 288) {
		return 'width: 18rem'
	}
	return `width: ${width}px`
}
