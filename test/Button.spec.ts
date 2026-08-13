import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import { Comment, Fragment, h } from 'vue'
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
  expect(wrapper.attributes('disabled')).toBeDefined()
  expect(wrapper.emitted('click')).toBeFalsy()
})

test('Button ignores a comment-only default slot when detecting text', () => {
  const wrapper = mount(Button, {
    props: {
      size: 'md',
    },
    slots: {
      default: () => h(Comment),
      'icon-left': () => h('i'),
    },
  })

  expect(wrapper.classes()).not.toContain('pl-4')
  expect(wrapper.classes()).not.toContain('px-4')
})

test('Button ignores a fragment containing only comments when detecting text', () => {
  const wrapper = mount(Button, {
    props: {
      size: 'md',
    },
    slots: {
      default: () => h(Fragment, null, [h(Comment)]),
      'icon-left': () => h('i'),
    },
  })

  expect(wrapper.classes()).not.toContain('pl-4')
  expect(wrapper.classes()).not.toContain('px-4')
})

const BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap ' +
	'font-medium transition-colors transition-shadow duration-150 ease-out ' +
	'active:enabled:scale-[0.98] disabled:cursor-not-allowed ' +
	'[&_svg]:shrink-0 outline-hidden cursor-pointer'

const SOLID_PRIMARY =
  'text-white border border-transparent bg-primary-default ' +
	'hover:enabled:bg-primary-hover active:enabled:bg-primary-800 ' +
  'hover:enabled:border-primary-hover ' +
  'focus:border-primary-700 focus:shadow-primary ' +
  'focus-visible:border-primary-700 focus-visible:shadow-primary'

const SOLID_DANGER =
  'text-white border border-transparent bg-danger-default ' +
	'hover:enabled:bg-danger-hover active:enabled:bg-danger-800 ' +
  'hover:enabled:border-danger-hover ' +
  'focus-visible:border-danger-700 focus-visible:shadow-danger'

const OUTLINED_PRIMARY =
  'bg-transparent text-primary-default border border-primary-default ' +
	'hover:enabled:bg-primary-subtle active:enabled:bg-primary-subtle ' +
  'hover:enabled:border-primary-hover ' +
  'focus-visible:border-primary-700 focus-visible:shadow-primary'

const OUTLINED_DANGER =
  'bg-transparent text-danger-default border border-danger-default ' +
	'hover:enabled:bg-danger-subtle active:enabled:bg-danger-subtle ' +
  'hover:enabled:border-danger-hover ' +
  'focus-visible:border-danger-700 focus-visible:shadow-danger'

const SOLID_DISABLED =
  'bg-neutral-300 text-neutral-500 border-transparent ' +
  'shadow-none hover:bg-neutral-300 active:bg-neutral-300 cursor-not-allowed'

const OUTLINED_DISABLED =
  'bg-transparent text-neutral-500 border-neutral-500 ' +
  'shadow-none hover:bg-transparent active:bg-transparent cursor-not-allowed'

const SIZE_SM = 'text-label-md rounded-sm h-9 min-w-9 button-sm px-3'
const SIZE_MD = 'text-label-lg rounded-sm h-12 min-w-12 button-md px-4'
const SIZE_LG = 'text-label-lg rounded-lg h-14 min-w-14 button-lg px-6'
const SIZE_MD_NO_PADDING = 'text-label-lg rounded-sm h-12 min-w-12 button-md'

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
	`${BASE} ${SOLID_PRIMARY} ${SIZE_MD_NO_PADDING} ${SOLID_DISABLED} px-4`
  )
})

test('Button disabled outlined primary', () => {
  expect(
    buttonVariants({ variant: 'primary', size: 'md', outlined: true, disabled: true })
  ).toBe(
	`${BASE} ${SOLID_PRIMARY} ${SIZE_MD_NO_PADDING} ${OUTLINED_PRIMARY} ${SOLID_DISABLED} ${OUTLINED_DISABLED} px-4`
  )
})
