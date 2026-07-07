
import { cva, type VariantProps } from 'class-variance-authority'

export const tooltipVariant = cva('z-50 overflow-hidden rounded py-2 px-3 text-label-md shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      variant: {
        default: 'bg-neutral-950 text-neutral-100',
        primary: 'bg-primary-50 text-primary-500',
        danger: 'bg-danger-50 text-danger-500',
        warning: 'bg-warning-50 text-warning-500',
        success: 'bg-success-50 text-success-500',
        black: 'bg-neutral-950 text-neutral-100',
        white: 'bg-neutral-100 text-neutral-950 dark:text-neutral-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    }
  },
)

export const tooltipArrowVariant = cva('',
    {
      variants: {
        variant: {
          default: 'fill-neutral-950',
          primary: 'fill-primary-50',
          danger: 'fill-danger-50',
          warning: 'fill-warning-50',
          success: 'fill-success-50',
          black: 'fill-neutral-950',
          white: 'fill-neutral-100',
        },
      },
      defaultVariants: {
        variant: 'default',
      }
    },
  )

export type TooltipVariant = VariantProps<typeof tooltipVariant>

export type TooltipContentPosition = 'top' | 'bottom' | 'left' | 'right'

export { default as Tooltip } from './Tooltip.vue'
export { default as TooltipContent } from './TooltipContent.vue'