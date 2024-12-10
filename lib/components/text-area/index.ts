import { cva, type VariantProps } from 'class-variance-authority'

// Define textAreaVariants using CVA
export const textAreaVariants = cva(
  'box-border p-3 w-full rounded-md bg-white text-grey-100 ring-offset-white placeholder:text-grey-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border border-grey-30 focus-visible:ring-4 focus-visible:ring-grey-50/25 focus-visible:border-2',
        danger:
          'border border-red-30 focus-visible:ring-4 focus-visible:ring-red-50/40 focus-visible:border-red-100/30'
      },
      disabled: {
        true: 'border-2 text-grey-60 cursor-not-allowed'
      }
    },
    defaultVariants: {
      variant: 'default',
      disabled: false
    }
  }
)

// Export types and components
export type TextAreaVariants = VariantProps<typeof textAreaVariants>
export { default as TextArea } from './TextArea.vue'
