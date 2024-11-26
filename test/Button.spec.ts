import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import ButtonDanger from '../lib/components/button/Button.vue'

test('Button', () => {
  const wrapper = mount(ButtonDanger, {
    slots: {
      default: 'Shadcn Button'
    }
  })
  expect(wrapper.html()).toContain('Shadcn Button')
})
