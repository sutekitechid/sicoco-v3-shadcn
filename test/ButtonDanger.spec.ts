import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import ButtonDanger from '../lib/components/ButtonDanger.vue'

test('ButtonDanger', () => {
  const wrapper = mount(ButtonDanger, {
    slots: {
      default: 'Button Danger'
    }
  })
  expect(wrapper.html()).toContain('Button Danger')
})
