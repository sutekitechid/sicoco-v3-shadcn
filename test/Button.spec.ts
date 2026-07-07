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
  'active:enabled:scale-[0.98] disabled:cursor-not-allowed ' +
  '[&_svg]:shrink-0 outline-none'

const SOLID_PRIMARY =
  'text-white border border-transparent bg-primary-500 ' +
  'hover:enabled:bg-primary-hover active:bg-primary-800 ' +
  'hover:enabled:border-primary-hover ' +
  'focus:border-primary-700 focus:shadow-primary ' +
  'focus-visible:border-primary-700 focus-visible:shadow-primary'

const SOLID_DANGER =
  'text-white border border-transparent bg-danger-500 ' +
  'hover:enabled:bg-danger-hover active:bg-danger-800 ' +
  'hover:enabled:border-danger-hover ' +
  'focus-visible:border-danger-700 focus-visible:shadow-danger'

const OUTLINED_PRIMARY =
  'bg-transparent text-primary-500 border border-primary-500 ' +
  'hover:enabled:bg-primary-50 active:bg-primary-50 ' +
  'hover:enabled:border-primary-hover ' +
  'focus-visible:border-primary-700 focus-visible:shadow-primary'

const OUTLINED_DANGER =
  'bg-transparent text-danger-500 border border-danger-500 ' +
  'hover:enabled:bg-danger-50 active:bg-danger-50 ' +
  'hover:enabled:border-danger-hover ' +
  'focus-visible:border-danger-700 focus-visible:shadow-danger'

const SOLID_DISABLED =
  'bg-neutral-300 text-neutral-500 border-transparent ' +
  'shadow-none hover:bg-neutral-300 active:bg-neutral-300 cursor-not-allowed'

const OUTLINED_DISABLED =
  'bg-transparent text-neutral-500 border-neutral-500 ' +
  'shadow-none hover:bg-transparent active:bg-transparent cursor-not-allowed'

const SIZE_SM = 'px-2 text-label-sm rounded h-9 min-w-9'
const SIZE_MD = 'px-3 text-label-md rounded-lg h-11 min-w-11'
const SIZE_LG = 'px-6 text-label-lg rounded-xl h-14 min-w-14'

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
    `${BASE} ${SOLID_PRIMARY} ${SIZE_MD} ${OUTLINED_PRIMARY}`
  )
})

test('Button outlined danger + size md', () => {
  expect(buttonVariants({ variant: 'danger', size: 'md', outlined: true })).toBe(
    `${BASE} ${SOLID_DANGER} ${SIZE_MD} ${OUTLINED_DANGER}`
  )
})

test('Button disabled solid primary', () => {
  expect(buttonVariants({ variant: 'primary', size: 'md', disabled: true })).toBe(
    `${BASE} ${SOLID_PRIMARY} ${SIZE_MD} ${SOLID_DISABLED}`
  )
})

test('Button disabled outlined primary', () => {
  expect(
    buttonVariants({ variant: 'primary', size: 'md', outlined: true, disabled: true })
  ).toBe(
    `${BASE} ${SOLID_PRIMARY} ${SIZE_MD} ${OUTLINED_PRIMARY} ${SOLID_DISABLED} ${OUTLINED_DISABLED}`
  )
})
