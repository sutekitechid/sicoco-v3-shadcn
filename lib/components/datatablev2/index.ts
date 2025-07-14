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