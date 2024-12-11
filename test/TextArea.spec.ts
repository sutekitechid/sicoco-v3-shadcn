import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Textarea from '../lib/components/text-area/Textarea.vue'

test('renders correctly', () => {
  const wrapper = mount(Textarea)
  expect(wrapper.find('textarea').exists()).toBe(true)
})

test('validates required field', async () => {
  const wrapper = mount(Textarea, {
    props: {
      modelValue: '',
      required: true
    }
  })

  await wrapper.find('textarea').setValue('')
  await wrapper.find('textarea').trigger('blur')

  expect(wrapper.findAll('.input__has-error').length).toBe(1)
  expect(wrapper.text()).toContain('The value is required')
})

test('validates minlength field', async () => {
  const expected = 'This field should be at least 5 characters long'
  const wrapper = mount(Textarea, {
    props: {
      modelValue: 'a',
      minlength: 5
    }
  })

  await wrapper.find('textarea').trigger('blur')
  expect(wrapper.findAll('.input__has-error').length).toBe(1)
  expect(wrapper.text()).toContain(expected)
})

test('does not show error if value is valid', async () => {
  const wrapper = mount(Textarea, {
    props: {
      modelValue: 'Hello World',
      minlength: 5,
      required: true
    }
  })

  await wrapper.find('textarea').setValue('Hello World')
  await wrapper.find('textarea').trigger('blur')

  expect(wrapper.findAll('.input__has-error').length).toBe(0)
})
