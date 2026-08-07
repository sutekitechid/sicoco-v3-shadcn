
import { cva, type VariantProps } from 'class-variance-authority'

export const tooltipVariant = cva('z-50 overflow-hidden rounded py-2 px-3 text-label-md shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      variant: {
        default: 'bg-neutral-950 text-neutral-100',
        primary: 'bg-primary-subtle text-primary-default',
        danger: 'bg-danger-subtle text-danger-default',
        warning: 'bg-warning-subtle text-warning-default',
        success: 'bg-success-subtle text-success-default',
        black: 'bg-neutral-950 text-neutral-100',
        white: 'bg-neutral-100 text-main dark:text-neutral-500',
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
          primary: 'fill-primary-subtle',
          danger: 'fill-danger-subtle',
          warning: 'fill-warning-subtle',
          success: 'fill-success-subtle',
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