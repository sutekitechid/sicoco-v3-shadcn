import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import { RadioGroupItem, RadioGroup, RadioGroupItemLabel, anyValueType2String, string2AnyValueType } from '../lib/components/radio'
import FormInput from '../lib/components/form-input/FormInput.vue'

const stubs = {
  'radio-item': RadioGroupItem
}

test('should display radio group', () => {
  const wrapper = mount(RadioGroup, {
    slots: {
      default: `
        <radio-item />
      `
    },
    global: {
      stubs
    },
  })

  expect(wrapper.find('button').exists()).toBe(true)
})

test('radio button should show the correct label', () => {
  const wrapper = mount(RadioGroup, {
    slots: {
      default: `
        <radio-item>
          Option 1
        </radio-item>
      `
    },
    global: {
      stubs
    },
  })

  expect(wrapper.find('label').text()).toBe('Option 1')
})

test('radio button should has correct state', async () => {
  const wrapper = mount(RadioGroup, {
    slots: {
      default: `
        <radio-item value="opt1">
          Option 1
        </radio-item>
        <radio-item value="opt2">
          Option 2
        </radio-item>
      `
    },
    global: {
      stubs
    },
  })

  const buttons = wrapper.findAll('button')
  await buttons[0].trigger('click')
  await buttons[1].trigger('click')
  expect(buttons[0].html()).toContain('data-state="unchecked"')
  expect(buttons[1].html()).toContain('data-state="checked"')
})

// test('radio button should has correct state when radio label clicked', async () => {
//   const wrapper = mount(RadioGroup, {
//     slots: {
//       default: `
//         <radio-item value="opt1">
//           Option 1
//         </radio-item>
//         <radio-item value="opt2">
//           Option 2
//         </radio-item>
//       `
//     },
//     global: {
//       stubs
//     },
//   })

//   const labels = wrapper.findAll('label')
//   await labels[0].trigger('click')
//   await labels[1].trigger('click')
//   console.log(labels[0].html())
//   console.log(labels[1].html())

//   const buttons = wrapper.findAll('button')
//   console.log(buttons[0].html())
//   console.log(buttons[1].html())
//   expect(buttons[0].html()).toContain('data-state="unchecked"')
//   expect(buttons[1].html()).toContain('data-state="checked"')
// })

test('radio button should be unchecked if modelValue is null', async () => {
  const wrapper = mount(RadioGroup, {
    slots: {
      default: `
        <radio-item value="opt1">
          Option 1
        </radio-item>
      `
    },
    props: {
      modelValue: null
    },
    global: {
      stubs
    },
  })

  expect(wrapper.html()).toContain('data-state="unchecked"')
})

test('radio button should be unchecked if modelValue is undefined', async () => {
  const wrapper = mount(RadioGroup, {
    slots: {
      default: `
        <radio-item value="opt1">
          Option 1
        </radio-item>
      `
    },
    props: {
      modelValue: undefined
    },
    global: {
      stubs
    },
  })

  expect(wrapper.html()).toContain('data-state="unchecked"')
})

test('radio button should be checked if modelValue is equal to value', async () => {
  const wrapper = mount(RadioGroup, {
    slots: {
      default: `
        <radio-item value="opt1">
          Option 1
        </radio-item>
        <radio-item value="opt2">
          Option 1
        </radio-item>
      `
    },
    props: {
      modelValue: 'opt1'
    },
    global: {
      stubs
    },
  })

  const buttons = wrapper.findAll('button')
  expect(buttons[0].html()).toContain('data-state="checked"')
  expect(buttons[1].html()).toContain('data-state="unchecked"')
})


test('radio button should be checked if modelValue is equal to value (number)', async () => {
  const wrapper = mount(RadioGroup, {
    slots: {
      default: `
        <radio-item :value="1">
          Option 1
        </radio-item>
        <radio-item :value="2">
          Option 1
        </radio-item>
      `
    },
    props: {
      modelValue: 2
    },
    global: {
      stubs
    },
  })

  const buttons = wrapper.findAll('button')
  expect(buttons[0].html()).toContain('data-state="unchecked"')
  expect(buttons[1].html()).toContain('data-state="checked"')
})

test('radio button should be checked if modelValue is equal to value (object)', async () => {
  const wrapper = mount(RadioGroup, {
    slots: {
      default: `
        <radio-item :value="1">
          Option 1
        </radio-item>
        <radio-item :value="{id: 1}">
          Option 1
        </radio-item>
      `
    },
    props: {
      modelValue: { id: 1 }
    },
    global: {
      stubs
    },
  })

  const buttons = wrapper.findAll('button')
  expect(buttons[0].html()).toContain('data-state="unchecked"')
  expect(buttons[1].html()).toContain('data-state="checked"')
})

test('radio button should be checked if modelValue is equal to value (array)', async () => {
  const wrapper = mount(RadioGroup, {
    slots: {
      default: `
        <radio-item :value="1">
          Option 1
        </radio-item>
        <radio-item :value="[{id: 1}]">
          Option 1
        </radio-item>
      `
    },
    props: {
      modelValue: [{ id: 1 }]
    },
    global: {
      stubs
    },
  })

  const buttons = wrapper.findAll('button')
  expect(buttons[0].html()).toContain('data-state="unchecked"')
  expect(buttons[1].html()).toContain('data-state="checked"')
})

test('radio button should be checked if modelValue is equal to value (boolean)', async () => {
  const wrapper = mount(RadioGroup, {
    slots: {
      default: `
        <radio-item :value="true">
          Option 1
        </radio-item>
        <radio-item :value="[{id: 1}]">
          Option 1
        </radio-item>
      `
    },
    props: {
      modelValue: true
    },
    global: {
      stubs
    },
  })

  const buttons = wrapper.findAll('button')
  expect(buttons[0].html()).toContain('data-state="checked"')
  expect(buttons[1].html()).toContain('data-state="unchecked"')
})

test('anyValueType2String should return string', () => {
  const value = anyValueType2String('test')
  expect(value).toBe('test')
})

test('anyValueType2String should return string for number', () => {
  const value = anyValueType2String(1000)
  expect(value).toBe('1000')
})

test('anyValueType2String should return string for object', () => {
  const value = anyValueType2String({ key: 'value' })
  expect(value).toBe('{"key":"value"}')
})

test('anyValueType2String should return string for array', () => {
  const value = anyValueType2String([1, 2, 3])
  expect(value).toBe('[1,2,3]')
})

test('string2AnyValueType should return string', () => {
  const value = string2AnyValueType('test')
  expect(value).toBe('test')
})

test('string2AnyValueType should return number', () => {
  const value = string2AnyValueType('1000')
  expect(value).toBe(1000)
})

test('string2AnyValueType should return object', () => {
  const value = string2AnyValueType('{"key":"value"}')
  expect(value).toEqual({ key: 'value' })
})

test('string2AnyValueType should return array', () => {
  const value = string2AnyValueType('[1,2,3]')
  expect(value).toEqual([1, 2, 3])
})

test('Radio button should be disabled', async () => {
  const wrapper = mount(RadioGroup, {
    slots: {
      default: `
        <radio-item value="opt1" disabled>
          Option 1
        </radio-item>
      `
    },
    global: {
      stubs
    },
  })

  expect(wrapper.html()).toContain('disabled')
})

test('Radio button label should be visible with given slot', async () => {
  const wrapper = mount(RadioGroupItemLabel, {
    slots: {
      default: 'Radio Label'
    }
  })
  expect(wrapper.text()).toBe('Radio Label')
})

test('RadioGroup should show error message if required validation fail', async () => {
  const wrapper = mount(FormInput, {
    props: {
      required: true,
    },
    slots: {
      default: `
        <radio-group :value="null" :required="true">
        </radio-group>
        <button type="submit"></button>
      `
    },
    global: {
      stubs: {
        'radio-group': RadioGroup,
      },
    }
  })
  const button = wrapper.find('button')
  await button.trigger('click')
  expect(wrapper.html()).toContain('Wajib diisi')
})

test('RadioGroup should show error message if custom validation fail', async () => {
  const wrapper = mount(FormInput, {
    props: {
      required: true,
    },
    slots: {
      default: `
        <radio-group :value="null" :custom-validators="{ test: value => value === 'test' }">
        <template #errors="{ validation }">
          <div v-if="validation.test.$invalid">
            Invalid custom error test
          </div>
        </template>
        </radio-group>
        <button type="submit"></button>
      `
    },
    global: {
      stubs: {
        'radio-group': RadioGroup,
      },
    }
  })
  const button = wrapper.find('button')
  await button.trigger('click')
  expect(wrapper.html()).toContain('Invalid custom error test')
})
