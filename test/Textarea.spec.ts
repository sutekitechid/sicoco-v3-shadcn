import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Textarea from '../lib/components/text-area/Textarea.vue'

test('renders correctly', () => {
  const wrapper = mount(Textarea)
  expect(wrapper.find('textarea').exists()).toBe(true)
  expect(wrapper.find('textarea').classes()).toContain('block')
})

test('validates required field', async () => {
  const wrapper = mount(Textarea, {
    props: {
      modelValue: '',
      required: true
    }
  })

  await wrapper.find('textarea').trigger('blur')
  expect(wrapper.findAll('.input__has-error').length).toBe(1)
})

test('validates minlength field', async () => {
  const wrapper = mount(Textarea, {
    props: {
      modelValue: 'a',
      required: true,
      minlength: 5
    }
  })

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

test('renders custom validator errors through the errors slot', async () => {
  const wrapper = mount(Textarea, {
    props: {
      modelValue: 'Satu dua tiga',
      customValidators: {
        isAbstractWithinWordLimit: (value: string) => value.split(/\s+/).length <= 2,
      },
    },
    slots: {
      errors:
        '<template #errors="{ validation }"><p v-if="validation.isAbstractWithinWordLimit?.$invalid">Maksimal dua kata</p></template>',
    },
  })

  await wrapper.find('textarea').trigger('blur')

  expect(wrapper.find('.input__help-message').text()).toContain(
    'Maksimal dua kata',
  )
})
