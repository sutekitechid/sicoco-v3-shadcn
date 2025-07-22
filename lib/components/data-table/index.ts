import { Updater } from '@tanstack/vue-table'
import { Ref } from 'vue'

export { default as DataTable } from './DataTable.vue'
export { default as DataTableColumn } from './DataTableColumn.vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function valueUpdater<T extends Updater<any>>(
	updaterOrValue: T,
	ref: Ref
) {
	ref.value =
		typeof updaterOrValue === 'function'
			? updaterOrValue(ref.value)
			: updaterOrValue
}

export const SORT_ORDER = {
	ASC: 'asc',
	DESC: 'desc',
} as const

export const COLUMN_SIZE = {
	Small: 'sm',
	Medium: 'md',
	Large: 'lg',
} as const

export const PINNING_TYPE = {
	LEFT: 'left',
	RIGHT: 'right',
} as const
