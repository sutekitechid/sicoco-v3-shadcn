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
    layout: 'default'
  }
})

// Variants for NavItem
export const navItem = cva('cursor-pointer group px-3 bg-transparent', {
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-black',
      accent: 'text-white'
    }
  },
  defaultVariants: {
    variant: 'primary'
  }
})

// Variants for NavLink
export const navLink = cva(
  'flex items-center gap-2 py-3 group-hover:bg-primary-80 group-hover:text-white text-white',
  {
    variants: {
      variant: {
        primary: 'bg-primary-100 text-white',
        secondary: 'bg-secondary-100 text-black',
        accent: 'bg-accent-100 text-white'
      }
    },
    defaultVariants: {
      variant: 'primary'
    }
  }
)

// Types
export type NavbarVariants = VariantProps<typeof navbarVariants>
export type NavItem = VariantProps<typeof navItem>
export type NavLink = VariantProps<typeof navLink>
