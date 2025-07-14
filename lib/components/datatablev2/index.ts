import { cva } from 'class-variance-authority'

export const datatableHeaderVariants = cva(
  '[&:first-child]:border-l [&:last-child]:border-r',
  {
    variants: {
      hasSubheader: {
        true: 'text-center border-l border-r',
      }
    },
  }
)

export const datatableDataVariants = cva('', {
  variants: {
    hasSubheader: {
      true: 'border-l border-r',
    },
  },
})

export const COLUMN_SIZE = {
	Small: 'sm',
	Medium: 'md',
	Large: 'lg',
} as const

// Export components
export { default as DataTable } from './DataTable.vue'
export { default as DataTableColumn } from './DataTableColumn.vue'
export { default as DataTableGroup } from './DataTableGroup.vue'
export { default as DataTableDropdownSettings } from './DataTableDropdownSettings.vue'
export { default as DataTableColumnSizeDropdown } from './DataTableColumnSizeDropdown.vue'
export { default as DataTableScrollWrapper } from './DataTableScrollWrapper.vue'