import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Textarea from '../lib/components/text-area/Textarea.vue'

test('renders correctly', () => {
  const wrapper = mount(Textarea)
  expect(wrapper.find('textarea').exists()).toBe(true)
})

test('validates required field', async () => {
  const value = 'a'
  const wrapper = mount(Textarea, {
    props: {
      modelValue: '',
      required: true
    }
  })

  await wrapper.find('textarea').setValue(value)
  await wrapper.find('textarea').trigger('blur')

  expect(wrapper.findAll('.input__has-error').length).toBe(1)
})

test('validates minlength field', async () => {
  const value = 'a'
  const wrapper = mount(Textarea, {
    props: {
      modelValue: 'a',
      required: true,
      minlength: 5
    }
  })
  await wrapper.find('textarea').setValue(value)
  await wrapper.find('textarea').trigger('blur')
  expect(wrapper.findAll('.input__has-error').length).toBe(1)
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
