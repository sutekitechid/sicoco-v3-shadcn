/**
 * Modul untuk mengekspor komponen dan variabel yang digunakan dalam navbar.
 * Ini mencakup komponen seperti `NavigationMenu` dan `NavItem`
 * serta konfigurasi variabel untuk kelas CSS menggunakan `class-variance-authority`.
 *
 * @module
 */

export { default as NavigationMenu } from './NavigationMenu.vue'
export { default as NavItem } from './NavItem.vue'
import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Variabel untuk mendefinisikan variasi tampilan Navbar menggunakan CVA.
 * CVA memungkinkan untuk menentukan kelas dinamis berdasarkan `variant` dan `layout`.
 *
 * Variasi `variant` menentukan gaya warna latar belakang:
 * - `'default'`: `bg-primary-100`
 * - `'dark'`: `bg-slate-900`
 * - `'light'`: `bg-neutral-10`
 *
 * Variasi `layout` menentukan tata letak navbar:
 * - `'default'`: `justify-evenly`
 * - `'spaced'`: `justify-between`
 * - `'centered'`: `justify-center`
 *
 * @example
 * navbarVariants({ variant: 'dark', layout: 'spaced' })
 *
 * @type {cva}
 */

export const navbarVariants = cva('flex w-full', {
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

/**
 * Variabel untuk mendefinisikan variasi tampilan link navigasi (NavLink) menggunakan `class-variance-authority` (CVA).
 * Variasi ini mengatur warna teks dan latar belakang untuk tampilan tombol link.
 *
 * Variasi `variant` mengatur warna dan efek hover untuk link:
 * - `'default'`: `text-white hover:bg-primary-80`
 * - `'dark'`: `hover:bg-slate-700 text-white`
 * - `'light'`: `text-slate-700 hover:bg-neutral-30`
 *
 * @example
 * navLink({ variant: inheritedFromParent })
 *
 * @type {cva}
 */

export const navLink = cva('flex items-center gap-2 py-[0.75rem] px-3', {
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

/**
 * Tipe untuk variasi Navbar yang dihasilkan oleh `navbarVariants`.
 * Digunakan untuk menyertakan properti jenis variasi dan layout untuk Navbar.
 *
 * @example
 * import { type NavbarVariants, navbarVariants } from './index'
 *
 * @type {VariantProps<typeof navbarVariants>}
 */

export type NavbarVariants = VariantProps<typeof navbarVariants>
/**
 * Tipe untuk variasi NavLink yang dihasilkan oleh `navLink`.
 * Digunakan untuk menyertakan properti jenis variasi untuk setiap link navigasi.
 * @type {VariantProps<typeof navLink>}
 */

export type NavLink = VariantProps<typeof navLink>
