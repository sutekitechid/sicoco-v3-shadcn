import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import { generateRandomName } from '../lib/components/base-input/index'
import Input from '../lib/components/input/Input.vue'

test('generateRandomName', () => {
  const name = generateRandomName()
  expect(name).toContain('input__')
})

test('should display input', () => {
  const wrapper = mount(Input)
  expect(wrapper.find('input').exists()).toBe(true)
})

test('should display placeholder', () => {
  const wrapper = mount(Input, {
    props: {
      placeholder: 'Shadcn Input'
    }
  })
  expect(wrapper.find('input').attributes('placeholder')).toBe('Shadcn Input')
})

test('should receive string value', async () => {
  const wrapper = mount(Input)
  await wrapper.find('input').setValue('Shadcn Input')
  expect(wrapper.find('input').element.value).toBe('Shadcn Input')
})

test('should receive number value', async () => {
  const wrapper = mount(Input, {
    props: {
      type: 'number'
    }
  })
  await wrapper.find('input').setValue(1000)
  expect(wrapper.find('input').element.value).toBe('1000')
})

test('should receive currency value', async () => {
  const wrapper = mount(Input, {
    props: {
      modelValue: 1000,
      type: 'currency'
    }
  })
  // await wrapper.find('input').setValue('1000')
  // console.log(wrapper.vm)
  expect(wrapper.find('input').element.value).toBe('1.000')
})

test('should receive password value', async () => {
  const wrapper = mount(Input, {
    props: {
      type: 'password'
    }
  })
  await wrapper.find('input').setValue('Shadcn Input')
  expect(wrapper.find('input').element.value).toBe('Shadcn Input')
})

test('should receive email value', async () => {
  const wrapper = mount(Input, {
    props: {
      type: 'email'
    }
  })
  await wrapper.find('input').setValue('example@example.com')
  expect(wrapper.find('input').element.value).toBe('example@example.com')
})

test('should validate min value', async () => {
  const wrapper = mount(Input, {
    props: {
      min: 10
    }
  })
  await wrapper.find('input').setValue('5')
  // find class .input__help-message and check if it contains 'min'
  expect(wrapper.find('.input__help-message').text()).toContain('Nilai harus lebih besar atau sama dengan 10')
})

test('should validate max value', async () => {
  const wrapper = mount(Input, {
    props: {
      max: 10
    }
  })
  await wrapper.find('input').setValue('15')
  // find class .input__help-message and check if it contains 'max'
  expect(wrapper.find('.input__help-message').text()).toContain('Nilai harus lebih kecil atau sama dengan 10')
})

test('should validate required value', async () => {
  const wrapper = mount(Input, {
    props: {
      required: true
    }
  })
  await wrapper.find('input').setValue('')
  // blur input
  await wrapper.find('input').trigger('blur')
  // find class .input__help-message and check if it contains 'required'
  expect(wrapper.find('.input__help-message').text()).toContain('Wajib diisi')
})

test('should validate exact length', async () => {
  const wrapper = mount(Input, {
    props: {
      length: 5
    }
  })
  await wrapper.find('input').setValue('123456')
  // find class .input__help-message and check if it contains 'length'
  expect(wrapper.find('.input__help-message').text()).toContain('Panjang karakter harus 5')
})

test('should validate email', async () => {
  const wrapper = mount(Input, {
    props: {
      type: 'email'
    }
  })
  await wrapper.find('input').setValue('example')
  expect(wrapper.find('.input__help-message').text()).toContain('Email tidak valid')
})

test('should disable input', async () => {
  const wrapper = mount(Input, {
    props: {
      disabled: true
    }
  })
  console.log(wrapper.find('input').attributes('disabled'))
  expect(wrapper.find('input').attributes('disabled')).toBe('disabled')
})