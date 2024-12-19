import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center text-neutral-10 justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus:ring-primary-100/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-fit',
  {
    variants: {
      variant: {
        default:
          'bg-primary-100 hover:bg-primary-100/90',
        primary:
          'bg-primary-100 hover:bg-primary-100/90',
        danger:
          'bg-danger-100 hover:bg-danger-100/90 focus:ring-danger-100/30',
        warning:
          'bg-warning-100 hover:bg-warning-100/90 focus:ring-warning-100/30',
        success:
          'bg-success-100 hover:bg-success-100/90 focus:ring-success-100/30',
        'default light': 'bg-primary-100/10 text-primary-100 hover:bg-primary-100/20',
        'primary light': 'bg-primary-100/10 text-primary-100 hover:bg-primary-100/20',
        'danger light': 'bg-danger-100/10 text-danger-100 hover:bg-danger-100/20 focus:ring-danger-100/30',
        'warning light': 'bg-warning-100/10 text-warning-100 hover:bg-warning-100/20 focus:ring-warning-100/30',
        'success light': 'bg-success-100/10 text-success-100 hover:bg-success-100/20 focus:ring-success-100/30',
        'light default': 'bg-primary-100/10 text-primary-100 hover:bg-primary-100/20',
        'light primary': 'bg-primary-100/10 text-primary-100 hover:bg-primary-100/20',
        'light danger': 'bg-danger-100/10 text-danger-100 hover:bg-danger-100/20 focus:ring-danger-100/30',
        'light warning': 'bg-warning-100/10 text-warning-100 hover:bg-warning-100/20 focus:ring-warning-100/30',
        'light success': 'bg-success-100/10 text-success-100 hover:bg-success-100/20 focus:ring-success-100/30',
      },
      size: {
        default: 'h-11 px-4 py-3',
        sm: 'h-8 px-3 py-2 text-xs',
        md: 'h-11 px-4 py-3',
        lg: 'h-14 px-8 py-4 text-base'
      },
      rounded: {
        true: 'rounded-full',
      },
      outlined: {
        true: 'bg-transparent border border-neutral-30 hover:text-neutral-10',
      },
      disabled: {
        true: 'bg-neutral-30 text-white cursor-not-allowed hover:bg-neutral-30 hover:text-white',
      }
    },
    compoundVariants: [
      {
        variant: 'default',
        outlined: true,
        disabled: false,
        class: 'text-primary-100 hover:bg-primary-100/90',
      },
      {
        variant: 'primary',
        outlined: true,
        disabled: false,
        class: 'text-primary-100',
      },
      {
        variant: 'danger',
        outlined: true,
        disabled: false,
        class: 'text-danger-100',
      },
      {
        variant: 'warning',
        outlined: true,
        disabled: false,
        class: 'text-warning-100',
      },
      {
        variant: 'success',
        outlined: true,
        disabled: false,
        class: 'text-success-100',
      },
      {
        variant: ['default light', 'primary light', 'danger light', 'warning light', 'success light', 'light default', 'light primary', 'light danger', 'light warning', 'light success'],
        disabled: true,
        class: 'hover:bg-neutral-10',
      }
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: false,
      outlined: false,
      disabled: false,
    }
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
