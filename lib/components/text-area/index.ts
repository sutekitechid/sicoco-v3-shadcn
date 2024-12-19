import { cva, type VariantProps } from 'class-variance-authority'

export const textAreaVariants = cva(
  'box-border p-3 w-full bg-transparent rounded-md border border-neutral-30 focus-visible:ring-4 focus-visible:ring-neutral-50/25 text-neutral-100 placeholder:text-neutral-60 focus-visible:outline-none focus-visible:ring-offset-0 disabled:opacity-50',
  {
    variants: {
      disabled: {
        true: 'border-2 text-neutral-60 bg-neutral-10 cursor-not-allowed'
      }
    },
    defaultVariants: {
      disabled: false
    }
  }
)

export type TextAreaVariants = VariantProps<typeof textAreaVariants>
export { default as Textarea } from './Textarea.vue'
