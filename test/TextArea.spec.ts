import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import TextArea from '../lib/components/text-area/TextArea.vue'

test('should display textarea', () => {
  const wrapper = mount(TextArea)
  expect(wrapper.find('textarea').exists()).toBe(true)
})

test('should display placeholder', () => {
  const wrapper = mount(TextArea, {
    props: {
      placeholder: 'Shadcn Textarea'
    }
  })
  expect(wrapper.find('textarea').attributes('placeholder')).toBe(
    'Shadcn Textarea'
  )
})

test('should receive string value', async () => {
  const wrapper = mount(TextArea)
  await wrapper.find('textarea').setValue('Shadcn Textarea')
  expect(wrapper.find('textarea').element.value).toBe('Shadcn Textarea')
})

test('should apply cols and rows', () => {
  const wrapper = mount(TextArea, {
    props: {
      cols: 40,
      rows: 5
    }
  })
  const textarea = wrapper.find('textarea')
  expect(textarea.attributes('cols')).toBe('40')
  expect(textarea.attributes('rows')).toBe('5')
})

test('Should show custom validator message', async () => {
  const wrapper = mount(TextArea, {
    props: {
      modelValue: '123456',
      customValidators: {
        helloWorld: (value: string | number) => value === 'hello world'
      }
    },
    slots: {
      errors:
        '<template #errors="{ validation }"><span v-if="validation.helloWorld?.$invalid">Masukkan kata hello world</span></template>'
    }
  })
  await wrapper.find('textarea').trigger('blur')
  expect(wrapper.find('.input__help-message').text()).toContain(
    'Masukkan kata hello world'
  )
})

test('should validate min value', async () => {
  const expected = 'Minimal 10'
  const wrapper = mount(TextArea, {
    props: {
      modelValue: 5,
      min: 10,
      type: 'number'
    },
    slots: {
      minValue: expected
    }
  })

  await wrapper.find('textarea').trigger('blur')
  expect(wrapper.find('.input__help-message').text()).toContain(expected)
})

test('should validate max value', async () => {
  const expected = 'Maksimal 500'
  const wrapper = mount(TextArea, {
    props: {
      modelValue: 1500,
      max: 500
    },
    slots: {
      maxValue: expected
    }
  })

  expect(wrapper.find('.input__help-message').text()).toContain(expected)
})

test('should validate required value', async () => {
  const wrapper = mount(TextArea, {
    props: {
      required: true
    }
  })
  await wrapper.find('textarea').trigger('blur')
  expect(wrapper.find('.input__help-message').text()).toContain('Wajib diisi')
})

test('should disable textarea', async () => {
  const wrapper = mount(TextArea, {
    props: {
      disabled: true
    }
  })
  expect(wrapper.find('textarea').attributes('disabled')).toBe('')
})

test('should apply variant classes', () => {
  const wrapper = mount(TextArea, {
    props: {
      variant: 'danger'
    }
  })
  expect(wrapper.find('textarea').classes()).toContain('border-red-30')
})

test('should display label', () => {
  const wrapper = mount(TextArea, {
    props: {
      label: 'Nama Lengkap'
    }
  })
  // Pastikan label muncul
  expect(wrapper.find('.text-area__label').text()).toBe('Nama Lengkap')
})

test('should display hint text', () => {
  const wrapper = mount(TextArea, {
    props: {
      hintText: 'Masukkan nama lengkap Anda'
    }
  })
  // Pastikan hint text muncul
  expect(wrapper.find('.text-area__hint').text()).toBe(
    'Masukkan nama lengkap Anda'
  )
})

test('should display label and hint text together', () => {
  const wrapper = mount(TextArea, {
    props: {
      label: 'Nama Lengkap',
      hintText: 'Masukkan nama lengkap Anda'
    }
  })
  // Pastikan label dan hint text muncul bersamaan
  expect(wrapper.find('.text-area__label').text()).toBe('Nama Lengkap')
  expect(wrapper.find('.text-area__hint').text()).toBe(
    'Masukkan nama lengkap Anda'
  )
})
