export { default as Dropdown } from './Dropdown.vue'
export { default as DropdownContent } from './DropdownContent.vue'
export { default as DropdownTrigger } from './DropdownTrigger.vue'
export { default as DropdownItem } from './DropdownItem.vue'
export { default as DropdownErrorMessage } from './DropdownErrorMessage.vue'
import { cva, type VariantProps } from 'class-variance-authority'

export const dropdownVariants = cva(
	'inline-flex items-center w-full h-[2.75rem] border-[1px] justify-between gap-x-1.5 rounded-md px-2 py-2 text-sm shadow-sm transition duration-150 ease-in-out focus:border-primary-50 focus:ring-2 focus:ring-primary-30 hover:bg-grey-10',
	{
		variants: {
			type: {
				selected: 'text-grey-100 bg-white curssor-pointer',
				disabled: 'bg-grey-10 text-grey-90 cursor-not-allowed',
				default: 'text-grey-60 curssor-pointer',
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
	'block font-normal py-2 rounded-md cursor-pointer mb-2 text-sm',
	{
		variants: {
			type: {
				selected: 'text-white bg-primary-100 cursor-pointer',
				disabled: 'text-grey-90 bg-grey-10 cursor-not-allowed',
				default: 'text-grey-90 hover:bg-grey-10 cursor-pointer',
				'multiple-select': 'text-primary-100 hover:bg-grey-10 cursor-pointer',
			},
		},
		defaultVariants: {
			type: 'default',
		},
	}
)

export type DropdownItemVariants = VariantProps<typeof dropdownItemVariants>

export const dropdownContentVariants = cva(
	'z-50 w-full rounded-md bg-white shadow-md border border-grey-10 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 '
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
