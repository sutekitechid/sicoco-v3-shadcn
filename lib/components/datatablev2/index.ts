import { cva } from 'class-variance-authority'

export const datatableHeaderVariants = cva(
  'group',
  {
    variants: {
      hasSubheader: {
        true: 'border-r border-l',
      },
      hasBorderLeft: {
        true: 'border-l',
      },
      hasBorderRight: {
        true: 'border-r',
      },
    },
  }
)

export const datatableHeaderContentVariants = cva(
  '',
  {
    variants: {
      hasSubheader: {
        true: '!justify-center',
      },
    },
  }
)

export const datatableDataRowVariants = cva('', {
  variants: {
    selectable: {
      true: 'cursor-pointer',
      false: 'cursor-not-allowed text-neutral-60',
    },
  },
})

export const datatableDataCellVariants = cva('', {
  variants: {
    hasBorderLeft: {
      true: 'border-l',
    },
    hasBorderRight: {
      true: 'border-r',
    },
  }
})

export const COLUMN_SIZE = {
	Small: 'sm',
	Medium: 'md',
	Large: 'lg',
} as const

// Export components
export { default as DataTable } from './DataTable.vue'
export { default as DataTableColumn } from './DataTableColumn.vue'
export { default as DataTableGroupColumn } from './DataTableGroupColumn.vue'
export { default as DataTableDropdownSettings } from './DataTableDropdownSettings.vue'
export { default as DataTableColumnSizeDropdown } from './DataTableColumnSizeDropdown.vue'
export { default as DataTableScrollWrapper } from './DataTableScrollWrapper.vue'