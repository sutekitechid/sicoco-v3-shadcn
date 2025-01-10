import { cva, type VariantProps } from 'class-variance-authority'

export { default as Table } from './Table.vue'
export { default as TableBody } from './TableBody.vue'
export { default as TableCell } from './TableCell.vue'
export { default as TableEmpty } from './TableEmpty.vue'
export { default as TableHead } from './TableHead.vue'
export { default as TableHeader } from './TableHeader.vue'
export { default as TableRow } from './TableRow.vue'

export const tableCellVariant = cva(
	'text-left align-middle [&:has([role=checkbox])]:pr-0',
	{
		variants: {
			size: {
				sm: 'p-1',
				md: 'p-2',
				lg: 'p-4',
			},
		},
	}
)

export type TableCellVariant = VariantProps<typeof tableCellVariant>

export const tableHeadVariant = cva(
	'h-12 text-left align-middle font-medium text-neutral-90 font-semibold [&:has([role=checkbox])]:pr-0 dark:text-neutral-40 cursor-pointer hover:bg-neutral-10 dark:hover:bg-neutral-10',
	{
		variants: {
			size: {
				sm: 'px-0',
				md: 'px-2',
				lg: 'px-4',
			},
		},
	}
)

export type TableHeadVariant = VariantProps<typeof tableHeadVariant>
