import { cva, type VariantProps } from 'class-variance-authority'

// Variants for Navbar
export const navbarVariants = cva('flex', {
  variants: {
    variant: {
      default: 'bg-primary-100',
      dark: 'bg-slate-900',
      light: 'bg-neutral-10'
    },
    layout: {
      default: 'justify-evenly',
      spaced: 'justify-between',
      centered: 'justify-center'
    }
  },
  defaultVariants: {
    variant: 'default',
    layout: 'default'
  }
})

// Variants for NavLink
export const navLink = cva('flex items-center gap-2 py-3', {
  variants: {
    variant: {
      default: 'text-white hover:bg-primary-80',
      dark: 'hover:bg-slate-700 text-white',
      light: 'text-slate-700 hover:bg-neutral-30'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

// Types
export type NavbarVariants = VariantProps<typeof navbarVariants>
export type NavLink = VariantProps<typeof navLink>
