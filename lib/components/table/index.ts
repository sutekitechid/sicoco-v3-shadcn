import { cva, type VariantProps } from 'class-variance-authority'

export { default as Table } from './Table.vue'
export { default as TableBody } from './TableBody.vue'
export { default as TableCell } from './TableCell.vue'
export { default as TableEmpty } from './TableEmpty.vue'
export { default as TableHead } from './TableHead.vue'
export { default as TableHeader } from './TableHeader.vue'
export { default as TableRow } from './TableRow.vue'
export { default as TableFooter } from './TableFooter.vue'

export const tableCellVariant = cva(
	'text-left align-middle [&:has([role=checkbox])]:pr-0',
	{
		variants: {
			size: {
				sm: 'p-2',
				md: 'p-3.5',
				lg: 'p-4',
			},
		},
	}
)

export type TableCellVariant = VariantProps<typeof tableCellVariant>

export const tableHeadVariant = cva(
	'h-12 text-left align-middle font-semibold [&:has([role=checkbox])]:pr-0 text-main dark:text-neutral-500 cursor-pointer dark:hover:!bg-neutral-300 hover:bg-[#F8F8F9] dark:bg-neutral-100',
	{
		variants: {
			size: {
				sm: 'px-2',
				md: 'px-3.5',
				lg: 'px-4',
			},
			textWrap: {
				true: '',
				false: 'text-nowrap',
			},
		},
	}
)

export type TableHeadVariant = VariantProps<typeof tableHeadVariant>

export const tableHeaderVariant = cva('', {
	variants: {
		sticky: {
			true: 'sticky top-0 z-[40] bg-white border-b border-main shadow-sm shadow-neutral-400 dark:bg-neutral-100',
		},
	},
	defaultVariants: {
		sticky: false,
	},
})

export type TableHeaderVariant = VariantProps<typeof tableHeaderVariant>
