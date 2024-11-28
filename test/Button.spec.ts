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
