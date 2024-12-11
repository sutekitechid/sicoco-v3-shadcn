import { cva, type VariantProps } from 'class-variance-authority'

export const radioGroupItemVariant = cva('aspect-square h-5 w-5 rounded-full border border-neutral-30 ring-offset-neutral-5 focus:outline-none focus-visible:ring-4 hover:ring-4 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default:
          'focus:ring-primary-100/30 hover:ring-primary-100/30',
        primary:
          'focus:ring-primary-100/30 hover:ring-primary-100/30',
        danger:
          'focus:ring-danger-100/30 hover:ring-danger-100/30',
        warning:
          'focus:ring-warning-100/30 hover:ring-warning-100/30',
        success:
          'focus-visible:ring-success-100/30 hover:ring-success-100/30',
      },
      disabled: {
        true: 'bg-neutral-5 text-neutral-50 cursor-not-allowed hover:ring-0',
      }
    },
    defaultVariants: {
      variant: 'default',
      disabled: false,
    }
  },
)
  
export type RadioGroupItemVariant = VariantProps<typeof radioGroupItemVariant>

export const radioGroupItemIndicatorVariant = cva('flex items-center justify-center w-full h-full rounded-full',
  {
    variants: {
      variant: {
        default:
          'bg-primary-100',
        primary:
          'bg-primary-100',
        danger:
          'bg-danger-100',
        warning:
          'bg-warning-100',
        success:
          'bg-success-100',
      },
      disabled: {
        true: '!bg-neutral-5 text-neutral-50 cursor-not-allowed hover:ring-0',
      }
    },
    defaultVariants: {
      variant: 'default',
      disabled: false,
    }
  },
)

export { default as RadioGroup } from './RadioGroup.vue'
export { default as RadioGroupItem } from './RadioGroupItem.vue'
export { default as RadioGroupItemLabel } from './RadioGroupItemLabel.vue'
export { default as RadioGroupErrorMessage } from './RadioGroupErrorMessage.vue'
