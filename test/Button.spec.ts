import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Button from '../lib/components/button/Button.vue'

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
