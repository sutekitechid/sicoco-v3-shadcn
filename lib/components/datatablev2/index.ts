import { cva } from 'class-variance-authority'

export const datatableHeaderVariants = cva(
  'group',
  {
    variants: {
      hasSubheader: {
        true: 'border-l border-b',
      },
      hasBorderLeft: {
        true: 'border-l',
      },
      hasBorderRight: {
        true: 'border-r',
      },
      isSticky: {
        true: 'bg-white dark:bg-neutral-10 border-neutral-20',
      },
    },
  }
)

export const datatableHeaderSectionVariants = cva('', {
  variants: {
    sticky: {
      true: 'sticky top-0 z-30 bg-white dark:bg-neutral-10',
    },
  },
})

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
      false: 'cursor-not-allowed text-neutral-60 bg-[#F8F8F9] dark:bg-neutral-20',
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
    pinned: {
      true: '',
      false: '',
    },
    selectable: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    { pinned: true, selectable: true, class: 'bg-white dark:bg-neutral-10' },
    { pinned: true, selectable: false, class: 'bg-[#F8F8F9] dark:bg-neutral-20' },
  ],
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