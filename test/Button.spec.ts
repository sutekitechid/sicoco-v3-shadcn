import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Button from '../lib/components/button/Button.vue'
import { buttonVariants } from '../lib/components/button'

test('Button', () => {
  const wrapper = mount(Button, {
    slots: {
      default: 'Shadcn Button'
    }
  })
  expect(wrapper.html()).toContain('Shadcn Button')
})

test('Button should cannot be clicked when disabled', async () => {
  const wrapper = mount(Button, {
    props: {
      disabled: true
    }
  })
  await wrapper.trigger('click')
  expect(wrapper.emitted('click')).toBeFalsy()
})

const BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap ' +
  'font-medium transition-colors transition-shadow duration-150 ease-out ' +
  'active:scale-[0.98] disabled:cursor-not-allowed ' +
  '[&_svg]:shrink-0 outline-none'

const SOLID_PRIMARY =
  'text-white border border-transparent bg-primary-default ' +
  'hover:enabled:bg-primary-hover active:bg-primary-800 ' +
  'hover:enabled:border-primary-hover ' +
  'focus:border-primary-700 focus:shadow-primary ' +
  'focus-visible:border-primary-700 focus-visible:shadow-primary'

const SOLID_DANGER =
  'text-white border border-transparent bg-danger-default ' +
  'hover:enabled:bg-danger-hover active:bg-danger-800 ' +
  'hover:enabled:border-danger-hover ' +
  'focus-visible:border-danger-700 focus-visible:shadow-danger'

const OUTLINED_PRIMARY =
  'bg-transparent text-primary-default border border-primary-default ' +
  'hover:enabled:bg-primary-subtle active:bg-primary-subtle ' +
  'hover:enabled:border-primary-hover ' +
  'focus-visible:border-primary-700 focus-visible:shadow-primary'

const OUTLINED_DANGER =
  'bg-transparent text-danger-default border border-danger-default ' +
  'hover:enabled:bg-danger-subtle active:bg-danger-subtle ' +
  'hover:enabled:border-danger-hover ' +
  'focus-visible:border-danger-700 focus-visible:shadow-danger'

const SOLID_DISABLED =
  'bg-neutral-300 text-neutral-500 border-transparent ' +
  'shadow-none hover:bg-neutral-300 active:bg-neutral-300 cursor-not-allowed'

const OUTLINED_DISABLED =
  'bg-transparent text-neutral-500 border-neutral-500 ' +
  'shadow-none hover:bg-transparent active:bg-transparent cursor-not-allowed'

const SIZE_SM = 'text-label-md rounded h-9 min-w-9 px-3'
const SIZE_MD = 'text-label-lg rounded h-12 min-w-12 px-4'
const SIZE_LG = 'text-label-lg rounded-lg h-14 min-w-14 px-6'
const SIZE_MD_NO_PADDING = 'text-label-lg rounded h-12 min-w-12'

test('Button solid default + size sm', () => {
  expect(buttonVariants({ variant: 'default', size: 'sm' })).toBe(
    `${BASE} ${SOLID_PRIMARY} ${SIZE_SM}`
  )
})

test('Button solid default + size md', () => {
  expect(buttonVariants({ variant: 'default', size: 'md' })).toBe(
    `${BASE} ${SOLID_PRIMARY} ${SIZE_MD}`
  )
})

test('Button solid default + size lg', () => {
  expect(buttonVariants({ variant: 'default', size: 'lg' })).toBe(
    `${BASE} ${SOLID_PRIMARY} ${SIZE_LG}`
  )
})

test('Button solid danger + size md', () => {
  expect(buttonVariants({ variant: 'danger', size: 'md' })).toBe(
    `${BASE} ${SOLID_DANGER} ${SIZE_MD}`
  )
})

test('Button outlined primary + size md', () => {
  expect(buttonVariants({ variant: 'primary', size: 'md', outlined: true })).toBe(
    `${BASE} ${SOLID_PRIMARY} ${SIZE_MD_NO_PADDING} ${OUTLINED_PRIMARY} px-4`
  )
})

test('Button outlined danger + size md', () => {
  expect(buttonVariants({ variant: 'danger', size: 'md', outlined: true })).toBe(
    `${BASE} ${SOLID_DANGER} ${SIZE_MD_NO_PADDING} ${OUTLINED_DANGER} px-4`
  )
})

test('Button disabled solid primary', () => {
  expect(buttonVariants({ variant: 'primary', size: 'md', disabled: true })).toBe(
    `${BASE} ${SOLID_PRIMARY} ${SIZE_MD_NO_PADDING} active:scale-1 ${SOLID_DISABLED} px-4`
  )
})

test('Button disabled outlined primary', () => {
  expect(
    buttonVariants({ variant: 'primary', size: 'md', outlined: true, disabled: true })
  ).toBe(
    `${BASE} ${SOLID_PRIMARY} ${SIZE_MD_NO_PADDING} active:scale-1 ${OUTLINED_PRIMARY} ${SOLID_DISABLED} ${OUTLINED_DISABLED} px-4`
  )
})
